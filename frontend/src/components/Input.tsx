import React, {  useState } from 'react';
import '../assets/css/styless.css';
// import TypingIndicator from './TypingIndicator'; // Assuming TypingIndicator is imported correctly

// let typingIndicator: TypingIndicator | null = null;

interface InputProps {
  onSendMessage: (message: string) => void;
  onChangeTypingState: (isTyping: boolean) => void;
}

const Input: React.FC<InputProps> = ({ onSendMessage }) => {
  const [text, setText] = useState<string>('');

//   useEffect(() => {
//     if (typingIndicator === null) {
//       typingIndicator = new TypingIndicator();
//       typingIndicator.listen(onChangeTypingState);
//     }
//   }, [onChangeTypingState]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    // typingIndicator?.onChange(newText);
    setText(newText);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim() === '') return;
    onSendMessage(text);
    setText('');
  };

  return (
    <div className="input">
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          value={text}
          type='text'
          placeholder='Enter your message and press ENTER'
          autoFocus
        />
        <button type='submit'>Send</button>
      </form>
    </div>
  );
};

export default Input;
