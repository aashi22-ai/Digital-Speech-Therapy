import difflib
import re


def _tokenize(text: str) -> list:
    """Lowercase, strip punctuation, split into words."""
    cleaned = re.sub(r"[^\w\s]", "", text.lower())
    return cleaned.split()


def compute_word_diff(target_text: str, transcript: str) -> dict:
    """
    Real, deterministic word-level comparison between the target text and
    what the ASR actually transcribed. This is NOT an LLM guess — it's a
    straightforward sequence alignment (Python's difflib, the same
    algorithm behind `diff` tools), so the result is honest and
    reproducible, not a fabricated "AI analysis".

    Returns:
      - word_diff: each word of the TARGET text tagged as:
          "correct"   -> the user said this word
          "different" -> the user said a different word in this position
          "missing"   -> the user never said this word
      - extra_words: words the user said that aren't part of the target
          text at all (filler words, repeats, etc.)
    """
    target_words = _tokenize(target_text)
    said_words = _tokenize(transcript)

    matcher = difflib.SequenceMatcher(None, target_words, said_words)

    word_diff = []
    extra_words = []

    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag == "equal":
            for w in target_words[i1:i2]:
                word_diff.append({"word": w, "status": "correct"})
        elif tag == "replace":
            for w in target_words[i1:i2]:
                word_diff.append({"word": w, "status": "different"})
            extra_words.extend(said_words[j1:j2])
        elif tag == "delete":
            for w in target_words[i1:i2]:
                word_diff.append({"word": w, "status": "missing"})
        elif tag == "insert":
            extra_words.extend(said_words[j1:j2])

    return {"word_diff": word_diff, "extra_words": extra_words}
