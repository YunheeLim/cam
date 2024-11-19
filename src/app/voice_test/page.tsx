'use client';

import React, { useState, useEffect } from 'react';

if (typeof window !== 'undefined') {
  SpeechRecognition =
    window.SpeechRecognition || (window as any).webkitSpeechRecognition;
}

export default function VoiceRecognitionApp() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null,
  );

  useEffect(() => {
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'en-US'; // 언어 설정
      recognitionInstance.continuous = true; // 지속적인 음성 인식
      recognitionInstance.interimResults = true; // 중간 결과도 반환

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const currentTranscript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscript(currentTranscript);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };

      setRecognition(recognitionInstance);
    } else {
      console.error('Speech Recognition API is not supported in this browser.');
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setListening(false);
    }
  };

  return (
    <div>
      <h1>React Speech Recognition Example</h1>
      <button onClick={startListening} disabled={listening}>
        Start Listening
      </button>
      <button onClick={stopListening} disabled={!listening}>
        Stop Listening
      </button>
      <p>Transcript: {transcript}</p>
    </div>
  );
}
