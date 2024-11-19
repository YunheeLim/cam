import { franc } from 'franc';

// 언어 매핑
const langMap: { [key: string]: string } = {
  kor: 'ko-KR',
  eng: 'en-US',
  // 필요한 언어 추가 가능
};

// 한 언어만 지원
export const getSpeechForOne = (text: string) => {
  // 언어 자동 감지하여 설정
  // const detectedLangCode = franc(text, { minLength: 3 });
  // const lang = langMap[detectedLangCode] || 'ko-KR'; // 한국어 디폴트

  const lang = 'ko-KR'; // 한국어 디폴트

  const utterThis = new SpeechSynthesisUtterance(text);
  utterThis.lang = lang;

  const setVoice = () => {
    const voices = window.speechSynthesis.getVoices();

    const selectedVoice = voices.find(
      elem => elem.lang === lang || elem.lang === lang.replace('-', '_'),
    );

    if (selectedVoice) {
      utterThis.voice = selectedVoice;
    } else {
      console.error(`No voice found for language: ${lang}`);
      return;
    }

    window.speechSynthesis.speak(utterThis);
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = setVoice;
  } else {
    setVoice();
  }
};

// 텍스트를 언어별로 분리
const splitTextByLanguage = (
  text: string,
): { lang: string; content: string }[] => {
  const words = text.split(/\s+/); // 공백 기준으로 단어 분리
  const result: { lang: string; content: string }[] = [];

  let currentLang = franc(words[0], { minLength: 1 });
  let buffer = [];

  for (const word of words) {
    const detectedLang = franc(word, { minLength: 1 });
    if (detectedLang === currentLang) {
      buffer.push(word);
    } else {
      result.push({ lang: currentLang, content: buffer.join(' ') });
      buffer = [word];
      currentLang = detectedLang;
    }
  }

  if (buffer.length > 0) {
    result.push({ lang: currentLang, content: buffer.join(' ') });
  }

  return result;
};

// 혼합된 문장에서 두 언어 모두 지원
export const getSpeechForBoth = (text: string) => {
  const textSegments = splitTextByLanguage(text);

  textSegments.forEach(segment => {
    const detectedLangCode = segment.lang;
    const lang = langMap[detectedLangCode] || 'en-US'; // 기본값은 영어
    const utterThis = new SpeechSynthesisUtterance(segment.content);
    utterThis.lang = lang;

    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();

      const selectedVoice = voices.find(
        elem => elem.lang === lang || elem.lang === lang.replace('-', '_'),
      );

      if (selectedVoice) {
        utterThis.voice = selectedVoice;
      } else {
        console.error(`No voice found for language: ${lang}`);
        return;
      }

      window.speechSynthesis.speak(utterThis);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = setVoice;
    } else {
      setVoice();
    }
  });
};
