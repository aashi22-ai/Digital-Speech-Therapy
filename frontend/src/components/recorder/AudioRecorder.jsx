import { useState, useRef, useEffect } from "react";
import Button from "../common/Button";
import Alert from "../common/Alert";

const MIN_RECORDING_SECONDS = 1;
const MAX_RECORDING_SECONDS = 10;

export default function AudioRecorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [error, setError] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const secondsRef = useRef(0);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const startRecording = async () => {
    setError("");
    setAudioURL(null);
    secondsRef.current = 0;
    setElapsedSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      let mimeType = "audio/webm";
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        clearInterval(timerRef.current);
        const durationSeconds = secondsRef.current;
        const blob = new Blob(chunksRef.current, { type: mimeType });
        stream.getTracks().forEach((track) => track.stop());

        if (durationSeconds < MIN_RECORDING_SECONDS) {
          setError("Recording was too brief — please speak clearly for at least 1-2 seconds.");
          setAudioURL(null);
          onRecordingComplete(null);
          return;
        }

        setAudioURL(URL.createObjectURL(blob));
        onRecordingComplete(blob);
      };

      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        secondsRef.current += 1;
        setElapsedSeconds(secondsRef.current);

        if (secondsRef.current >= MAX_RECORDING_SECONDS) {
          clearInterval(timerRef.current);
          if (recorder.state === "recording") {
            recorder.requestData();
            recorder.stop();
            setIsRecording(false);
          }
        }
      }, 1000);
    } catch (err) {
      setError("Microphone access was denied or is unavailable. Check your browser permissions.");
    }
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.requestData();
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Alert type="error">{error}</Alert>

      <Button
        variant={isRecording ? "danger" : "primary"}
        onClick={isRecording ? stopRecording : startRecording}
        className="rounded-full px-5"
      >
        {isRecording ? `Stop recording (${elapsedSeconds}s / ${MAX_RECORDING_SECONDS}s)` : "Start recording"}
      </Button>

      {audioURL && (
        <audio controls src={audioURL} className="mt-2">
          Your browser does not support audio playback.
        </audio>
      )}
    </div>
  );
}
