const getSpeech = (text: string) => {
  const lang = 'ko-KR';
  const utterThis = new SpeechSynthesisUtterance(text);

  utterThis.lang = lang;

  const setVoice = () => {
    const voices = window.speechSynthesis.getVoices();

    // 한국어 vocie 찾기
    const kor_voice = voices.find(
      elem => elem.lang === lang || elem.lang === lang.replace('-', '_'),
    );

    // 한국어 voice가 있다면 ? utterance에 목소리를 설정한다 : 리턴하여 목소리가 나오지 않도록 한다.
    if (kor_voice) {
      utterThis.voice = kor_voice;
    } else {
      console.error('No Korean voice found');
      return;
    }

    // utterance를 재생(speak)한다.
    window.speechSynthesis.speak(utterThis);
  };

  // Check if voices are already loaded
  if (window.speechSynthesis.getVoices().length === 0) {
    // If not, add an event listener to wait for them to be loaded
    window.speechSynthesis.onvoiceschanged = setVoice;
  } else {
    // If voices are already loaded, set the voice immediately
    setVoice();
  }
};

export default getSpeech;
