function englishVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((voice) => voice.lang === 'en-GB') ?? voices.find((voice) => voice.lang.startsWith('en'));
}

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

let waitingForVoices = false;

export function speakEnglish(text: string): void {
  if (!canSpeak()) return;
  const synth = window.speechSynthesis;
  const start = () => {
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/\n+/g, '. '));
    utterance.lang = 'en-GB';
    utterance.rate = 0.92;
    const voice = englishVoice();
    if (voice) utterance.voice = voice;
    synth.speak(utterance);
  };
  if (synth.getVoices().length === 0) {
    if (waitingForVoices) return;
    waitingForVoices = true;
    const once = () => {
      synth.removeEventListener('voiceschanged', once);
      waitingForVoices = false;
      start();
    };
    synth.addEventListener('voiceschanged', once);
    return;
  }
  start();
}
