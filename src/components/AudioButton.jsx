import { SpeakerWaveIcon } from '@heroicons/react/24/outline';

export function AudioButton({ poem, className }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakPoem = async () => {
    setIsSpeaking(true);
    try {
      const utterance = new SpeechSynthesisUtterance(poem);
      utterance.lang = 'en-US';
      utterance.pitch = 1;
      utterance.rate = 0.9;
      
      speechSynthesis.speak(utterance);
      
      // Wait for the speech to finish
      await new Promise((resolve) => {
        utterance.onend = resolve;
      });
    } catch (error) {
      console.error('Error speaking poem:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <button
      onClick={speakPoem}
      disabled={isSpeaking}
      className={`p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 ${className}`}
      title="Listen to poem"
    >
      <SpeakerWaveIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
    </button>
  );
}
