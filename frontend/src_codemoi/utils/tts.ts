/* eslint-disable no-console */

// We will fetch voices inside the speak function directly,
// as the speechSynthesis.onvoiceschanged event can be unreliable.

/**
 * Uses the browser's SpeechSynthesis API to speak the given text.
 *
 * @param text The text to be spoken.
 * @param lang The language to use for speech synthesis (e.g., 'vi-VN').
 */
export const speak = (text: string, lang = 'vi-VN'): void => {
  console.log(`[TTS] Attempting to speak: "${text}" with lang: ${lang}`);

  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('[TTS] SpeechSynthesis is not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech before starting a new one
  window.speechSynthesis.cancel();

  // For the "unlock" trick, if text is empty, don't proceed further.
  if (text.trim() === '') {
    console.log('[TTS] Audio unlocked or silent speak called.');
    const unlockUtterance = new SpeechSynthesisUtterance('');
    unlockUtterance.volume = 0;
    window.speechSynthesis.speak(unlockUtterance);
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Fetch voices directly at the time of speaking.
  const allVoices = window.speechSynthesis.getVoices();
  console.log('[TTS] All available voices at time of speak:', allVoices.map(v => ({ name: v.name, lang: v.lang })));

  // If the voice list is empty, it might not be loaded yet.
  // We can't proceed to select a voice. Let the browser use its default for the language.
  if (allVoices.length === 0) {
      console.warn('[TTS] Voice list is empty. Falling back to browser default for the language.');
      utterance.lang = lang;
  } else {
    // Ưu tiên tìm giọng "Hong Vi" hoặc "vnSpeak"
    let selectedVoice = allVoices.find(voice => voice.name.includes('Hong Vi') || voice.name.includes('vnSpeak'));

    // Nếu không có, tìm giọng tiếng Việt mặc định
    if (!selectedVoice) {
      selectedVoice = allVoices.find(voice => voice.lang === 'vi-VN');
    }

    // Ghi log giọng đã chọn hoặc thông báo nếu không tìm thấy
    console.log('[TTS] Selected voice:', selectedVoice ? selectedVoice.name : 'No specific Vietnamese voice found, falling back to browser language default.');

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang; // Đảm bảo lang khớp với giọng nói
    } else {
      // Nếu không tìm thấy giọng nói cụ thể nào, chỉ đặt lang
      // để trình duyệt cố gắng tìm giọng nói phù hợp nhất.
      utterance.lang = lang;
    }
  }

  utterance.onstart = () => {
    console.log('[TTS] Speech started.');
  };

  utterance.onend = () => {
    console.log('[TTS] Speech finished.');
  };

  utterance.onerror = (event) => {
    console.error('[TTS] An error occurred during speech synthesis:', event.error);
  };

  window.speechSynthesis.speak(utterance);
}; 