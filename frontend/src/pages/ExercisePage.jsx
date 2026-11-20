import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  X,
  Heart,
  Volume2,
  Mic,
  Square,
  RefreshCw,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  MessageCircle,
  HelpCircle,
  RotateCcw,
} from "lucide-react";
import confetti from "canvas-confetti";
import { getExerciseById } from "../services/exerciseService";
import { submitAttempt } from "../services/attemptService";
import { useGamification } from "../context/GamificationContext";
import {
  playSuccessSound,
  playErrorSound,
  playClickSound,
  playFanfareSound,
} from "../utils/soundEffects";
import DuoMascot from "../components/mascot/DuoMascot";
import WordDiffDisplay from "../components/progress/WordDiffDisplay";

const MAX_RECORDING_SECONDS = 10;
const MIN_RECORDING_SECONDS = 1;

export default function ExercisePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hearts, maxHearts, applyAttemptReward, refillHearts } = useGamification();

  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);

  // Evaluation & Results states
  const [evaluating, setEvaluating] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showNoHeartsModal, setShowNoHeartsModal] = useState(false);
  const [showTutorialHint, setShowTutorialHint] = useState(false);

  // Refs to avoid stale closures
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const secondsRef = useRef(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const streamRef = useRef(null);
  const clientTranscriptRef = useRef("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    getExerciseById(id)
      .then((data) => {
        setExercise(data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Could not load this speech exercise.");
      })
      .finally(() => setLoading(false));

    return () => {
      cleanUpAudio();
    };
  }, [id]);

  const cleanUpAudio = () => {
    clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
  };

  // Text-To-Speech (Native Pronunciation Listen)
  const handleListen = (slow = false, textToSpeak = null) => {
    if (!exercise || typeof window === "undefined" || !window.speechSynthesis) return;
    playClickSound();

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak || exercise.targetText);

    const langCodeMap = {
      en: "en-US",
      es: "es-ES",
      fr: "fr-FR",
      de: "de-DE",
      hi: "hi-IN",
      it: "it-IT",
      ja: "ja-JP",
    };
    utterance.lang = langCodeMap[exercise.language] || "en-US";
    utterance.rate = slow ? 0.65 : 0.95;

    window.speechSynthesis.speak(utterance);
  };

  // Start Voice Recording with Live Waveform Meter & 10s auto-stop
  const handleStartRecording = async () => {
    if (hearts <= 0) {
      setShowNoHeartsModal(true);
      return;
    }
    playClickSound();
    setError("");
    setRecordedBlob(null);
    setAudioURL(null);
    secondsRef.current = 0;
    setRecordingSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // Start live parallel speech recognition (for instantaneous transcript fallback)
      clientTranscriptRef.current = "";
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRec) {
        try {
          const rec = new SpeechRec();
          const langCodeMap = {
            en: "en-US",
            es: "es-ES",
            fr: "fr-FR",
            de: "de-DE",
            hi: "hi-IN",
            it: "it-IT",
            ja: "ja-JP",
          };
          rec.lang = langCodeMap[exercise?.language] || "en-US";
          rec.continuous = true;
          rec.interimResults = true;
          rec.onresult = (evt) => {
            let tr = "";
            for (let i = 0; i < evt.results.length; i++) {
              tr += evt.results[i][0].transcript + " ";
            }
            clientTranscriptRef.current = tr.trim();
          };
          rec.onerror = () => {};
          rec.start();
          recognitionRef.current = rec;
        } catch (e) {
          console.warn("Native speech recognition not active:", e);
        }
      }

      // Setup audio analyzer for live mic meter
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        const audioCtx = new AudioCtxClass();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const checkVolume = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
          const avg = sum / dataArray.length;
          setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
          animFrameRef.current = requestAnimationFrame(checkVolume);
        };
        checkVolume();
      }

      // Determine supported mimeType
      let mimeType = "audio/webm";
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")) {
        mimeType = "audio/ogg;codecs=opus";
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        clearInterval(timerRef.current);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        setAudioLevel(0);

        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch {}
        }

        const recordedDuration = secondsRef.current;
        const blob = new Blob(chunksRef.current, { type: mimeType });

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        if (recordedDuration < MIN_RECORDING_SECONDS) {
          setError(`Recording was too brief (${recordedDuration}s). Speak clearly for at least 1-2 seconds.`);
          setRecordedBlob(null);
          setAudioURL(null);
          return;
        }

        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
      };

      // Flush every 250ms so chunks are continuous
      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        secondsRef.current += 1;
        setRecordingSeconds(secondsRef.current);

        // Auto-stop at MAX_RECORDING_SECONDS (10s)
        if (secondsRef.current >= MAX_RECORDING_SECONDS) {
          clearInterval(timerRef.current);
          if (recorder.state === "recording") {
            recorder.requestData();
            recorder.stop();
            setIsRecording(false);
          }
        }
      }, 1000);
    } catch {
      setError("Microphone permission was denied. Please allow microphone access in your browser settings.");
    }
  };

  const handleStopRecording = () => {
    playClickSound();
    clearInterval(timerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.requestData();
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Submit recording to backend
  const handleCheckSpeech = async () => {
    if (!recordedBlob) return;
    playClickSound();
    setEvaluating(true);
    setError("");

    try {
      const result = await submitAttempt(
        recordedBlob,
        id,
        clientTranscriptRef.current
      );
      setResultData(result);

      const pScore = result.score?.pronunciationScore ?? 85;
      const fScore = result.score?.fluencyScore ?? 85;
      const combined = (pScore + fScore) / 2;

      // Apply Gamification Reward
      const xpEarned = combined >= 90 ? 25 : combined >= 75 ? 15 : 10;
      applyAttemptReward({
        xpEarned,
        pronunciationScore: pScore,
        fluencyScore: fScore,
        exerciseId: id,
      });

      if (combined >= 70) {
        playSuccessSound();
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
        });
      } else {
        playErrorSound();
      }
    } catch (err) {
      setError(
        err.message ||
          err.response?.data?.message ||
          "Could not analyze speech. Please ensure your microphone is active and try speaking again."
      );
    } finally {
      setEvaluating(false);
    }
  };

  const handleContinue = () => {
    playClickSound();
    if (resultData) {
      navigate(`/results/${resultData.attempt._id}`, { state: resultData });
    } else {
      navigate("/dashboard");
    }
  };

  const handleRetry = () => {
    playClickSound();
    setResultData(null);
    setRecordedBlob(null);
    setAudioURL(null);
    setError("");
    secondsRef.current = 0;
    setRecordingSeconds(0);
    setAudioLevel(0);
    clientTranscriptRef.current = "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 space-y-4">
        <DuoMascot mood="thinking" size="lg" message="Loading your language practice..." />
      </div>
    );
  }

  const combinedScore = resultData
    ? ((resultData.score?.pronunciationScore ?? 80) + (resultData.score?.fluencyScore ?? 80)) / 2
    : 0;
  const isPassed = combinedScore >= 70;

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between select-none">
      {/* Top Header / Progress Bar */}
      <header className="max-w-3xl mx-auto w-full px-4 py-4 flex items-center justify-between gap-4">
        <button
          onClick={() => setShowExitModal(true)}
          className="text-slate-400 hover:text-duo-dark p-1 rounded-xl transition"
          title="Quit Lesson"
        >
          <X className="w-7 h-7 stroke-[2.5]" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 bg-slate-200 h-4 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-duo-yellow h-full rounded-full transition-all duration-500"
            style={{ width: resultData ? "100%" : recordedBlob ? "70%" : "30%" }}
          />
        </div>

        {/* Hearts indicator */}
        <div className="flex items-center gap-1.5 text-duo-red font-black text-sm">
          <Heart className="w-6 h-6 fill-duo-red animate-pulse" />
          <span>{hearts}</span>
        </div>
      </header>

      {/* Main Exercise Interaction */}
      <main className="max-w-2xl mx-auto w-full px-4 py-4 flex-1 flex flex-col justify-center space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-duo-neutral">
              {exercise.type === "dialogue" ? "Conversation Drill" : "Pronunciation Drill"} · {exercise.language.toUpperCase()}
            </span>
            <button
              onClick={() => setShowTutorialHint(!showTutorialHint)}
              className="text-xs font-bold text-duo-blue flex items-center gap-1 hover:underline"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showTutorialHint ? "Hide Tutorial" : "Language Tip"}</span>
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-duo-dark mt-1">
            {exercise.type === "dialogue" ? "Respond in conversation" : "Speak this phrase"}
          </h1>
        </div>

        {/* Tutorial / Language Tip Accordion */}
        {showTutorialHint && (
          <div className="bg-blue-50 border-2 border-duo-blue-light rounded-2xl p-4 text-xs space-y-1 animate-fadeIn">
            <p className="font-black text-duo-blue uppercase tracking-wide">
              Pronunciation & Grammar Guide:
            </p>
            <p className="text-duo-dark font-medium leading-relaxed">
              Listen carefully to the rhythm and vowel placement. Keep your throat open and relaxed.
              {exercise.phonetic && ` Phonetic guide: ${exercise.phonetic}`}
            </p>
          </div>
        )}

        {/* Mascot & Target Speech Card */}
        <div className="space-y-4">
          {/* Dialogue Prompt (If conversation practice) */}
          {exercise.dialoguePrompt && (
            <div className="bg-amber-50/70 border-2 border-amber-200 rounded-3xl p-4 flex items-center gap-3">
              <span className="text-2xl">🦉</span>
              <div className="flex-1">
                <p className="text-[11px] font-black uppercase text-duo-orange tracking-wider">
                  Partner asks:
                </p>
                <p className="text-base font-black text-duo-dark">{exercise.dialoguePrompt}</p>
              </div>
              <button
                onClick={() => handleListen(false, exercise.dialoguePrompt.replace(/^[a-zA-Z]+:\s*/, ""))}
                className="p-2 rounded-xl bg-white border border-amber-200 text-duo-orange hover:bg-amber-100 transition"
                title="Listen to prompt"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* User Target Phrase to Speak */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-50 border-2 border-duo-gray rounded-3xl p-5 shadow-xs">
            <DuoMascot
              mood={isRecording ? "listening" : resultData ? (isPassed ? "cheering" : "encouraging") : "speaking"}
              size="md"
            />

            <div className="flex-1 space-y-2.5">
              {/* Audio Listen Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleListen(false)}
                  className="btn-duo-blue py-1.5 px-3 rounded-xl text-xs flex items-center gap-1.5"
                  title="Listen at normal speed"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen</span>
                </button>

                <button
                  onClick={() => handleListen(true)}
                  className="btn-duo-gray py-1.5 px-3 rounded-xl text-xs flex items-center gap-1.5"
                  title="Listen slowly (Turtle speed for phonemes)"
                >
                  <span className="text-base">🐢</span>
                  <span>Slow</span>
                </button>

                <span className="text-[10px] font-bold text-slate-400 ml-auto">
                  1-10s drill
                </span>
              </div>

              {/* Target Phrase */}
              <p className="text-xl sm:text-2xl font-black text-duo-dark leading-snug">
                "{exercise.targetText}"
              </p>

              {/* Phonetic Pronunciation Guide */}
              {exercise.phonetic && (
                <p className="text-xs font-bold text-duo-neutral italic">
                  🗣️ Pronounce: <span className="text-duo-dark font-black">{exercise.phonetic}</span>
                </p>
              )}

              {/* English Translation */}
              {exercise.translation && exercise.language !== "en" && (
                <p className="text-xs font-bold text-slate-500">
                  🇬🇧 Meaning: "{exercise.translation}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recording Console */}
        <div className="flex flex-col items-center justify-center space-y-3 pt-1">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-duo-red-dark text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 max-w-md">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Recording Timer & Instructions */}
          {!resultData && (
            <p className="text-xs font-bold text-slate-400">
              {isRecording
                ? `Recording: ${recordingSeconds}s / ${MAX_RECORDING_SECONDS}s max (auto-stops at 10s)`
                : "Tap the microphone, speak clearly (1-10s), then tap Stop"}
            </p>
          )}

          {/* Big Duo Speech Microphone Button */}
          {!resultData && (
            <div className="relative">
              {isRecording ? (
                <button
                  onClick={handleStopRecording}
                  className="w-24 h-24 rounded-full bg-duo-red border-b-6 border-duo-red-dark text-white flex flex-col items-center justify-center shadow-lg active:translate-y-1 active:border-b-0 ring-8 ring-duo-red/25 animate-pulse"
                >
                  <Square className="w-8 h-8 fill-white" />
                  <span className="text-[11px] font-black uppercase mt-1">
                    {recordingSeconds}s / 10s
                  </span>
                </button>
              ) : (
                <button
                  onClick={handleStartRecording}
                  className="w-24 h-24 rounded-full bg-duo-yellow border-b-6 border-duo-yellow-dark text-slate-900 flex flex-col items-center justify-center shadow-lg hover:brightness-105 active:translate-y-1 active:border-b-0 ring-8 ring-duo-yellow/30"
                >
                  <Mic className="w-9 h-9" />
                  <span className="text-[10px] font-black uppercase mt-0.5">
                    {recordedBlob ? "Re-record" : "Tap to Speak"}
                  </span>
                </button>
              )}
            </div>
          )}

          {/* Live Mic Meter / Waveform */}
          {isRecording && (
            <div className="flex items-center gap-1.5 h-6">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-duo-red rounded-full transition-all duration-75"
                  style={{
                    height: `${Math.max(6, Math.min(28, (audioLevel / 100) * 30 + ((i % 3) * 4)))}px`,
                  }}
                />
              ))}
              <span className="text-xs font-black uppercase text-duo-red ml-2">
                Mic active ({recordingSeconds}s)
              </span>
            </div>
          )}

          {/* Audio Playback Preview */}
          {audioURL && !isRecording && !resultData && (
            <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-2xl border border-duo-gray">
              <audio controls src={audioURL} className="h-8 w-60" />
            </div>
          )}
        </div>
      </main>

      {/* Duo Speech Slide-Up Evaluation Bottom Bar */}
      <footer
        className={`w-full border-t-2 py-5 px-6 transition-colors duration-300 ${
          resultData
            ? isPassed
              ? "bg-amber-50 border-duo-yellow-dark"
              : "bg-duo-red-light border-duo-red-dark"
            : "bg-white border-duo-gray"
        }`}
      >
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {evaluating ? (
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 text-duo-blue animate-spin" />
              <div>
                <p className="font-black text-sm text-duo-dark">Evaluating Pronunciation...</p>
                <p className="text-xs text-duo-neutral">faster-whisper & Gemini AI speech analysis</p>
              </div>
            </div>
          ) : resultData ? (
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {isPassed ? "🎉" : resultData.score?.pronunciationScore === 0 ? "🔇" : "💡"}
                </span>
                <div>
                  <h3
                    className={`text-lg font-black ${
                      isPassed ? "text-amber-900" : "text-duo-red-dark"
                    }`}
                  >
                    {isPassed
                      ? "Awesome! You nailed it!"
                      : resultData.score?.pronunciationScore === 0 &&
                        resultData.score?.fluencyScore === 0
                      ? "No speech detected"
                      : "Keep practicing! Speech takes time."}
                  </h3>
                  <p className="text-xs font-bold text-duo-dark">
                    Pronunciation: {resultData.score?.pronunciationScore ?? 0}% · Fluency:{" "}
                    {resultData.score?.fluencyScore ?? 0}%
                  </p>
                </div>
              </div>

              {/* Word Diff Pills */}
              <WordDiffDisplay
                wordDiff={resultData.score?.wordDiff}
                extraWords={resultData.score?.extraWords}
              />
            </div>
          ) : (
            <div className="text-xs font-bold text-slate-400 hidden sm:block">
              {recordedBlob ? "Ready to evaluate your speech" : "Tap mic, speak 1-10s, then tap Check"}
            </div>
          )}

          {/* Action Button(s): Retry + Continue */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {resultData ? (
              <>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="btn-duo-gray text-duo-dark font-black text-sm px-5 py-3.5 flex items-center gap-2 hover:bg-slate-100 transition shadow-xs"
                  title="Retry this phrase to improve your score"
                >
                  <RotateCcw className="w-4 h-4 stroke-[3] text-duo-neutral" />
                  <span>RETRY</span>
                </button>

                <button
                  type="button"
                  onClick={handleContinue}
                  className={
                    isPassed
                      ? "btn-duo-yellow text-slate-900 font-black text-base px-8 py-3.5"
                      : "btn-duo-red text-white font-black text-base px-8 py-3.5"
                  }
                >
                  <span>CONTINUE</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={handleCheckSpeech}
                disabled={!recordedBlob || isRecording || evaluating}
                className="btn-duo-yellow text-slate-900 font-black text-base px-8"
              >
                CHECK
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-duo-gray max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <DuoMascot mood="sad" size="sm" className="justify-center" />
            <h3 className="text-xl font-black text-duo-dark">Quit This Lesson?</h3>
            <p className="text-xs text-duo-neutral font-medium">
              You will lose your progress in this speech practice session. Keep going to earn XP!
            </p>
            <div className="space-y-2 pt-2">
              <button onClick={() => setShowExitModal(false)} className="w-full btn-duo-yellow">
                KEEP PRACTICING
              </button>
              <button onClick={() => navigate("/dashboard")} className="w-full btn-duo-gray">
                END LESSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Out of Hearts Modal */}
      {showNoHeartsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-duo-gray max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-duo-red fill-duo-red" />
            </div>
            <h3 className="text-xl font-black text-duo-dark">You're Out of Hearts!</h3>
            <p className="text-xs text-duo-neutral font-medium">
              Hearts protect your speech lessons. Refill your hearts with gems to continue speaking!
            </p>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  refillHearts();
                  setShowNoHeartsModal(false);
                }}
                className="w-full btn-duo-yellow"
              >
                Refill 5 Hearts (50 Gems)
              </button>
              <button onClick={() => navigate("/dashboard")} className="w-full btn-duo-gray">
                Back to Path
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
