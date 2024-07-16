// import React, { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';
// import axios from 'axios';
// import '../Chat/chat.css';
// import DefaultLayout from '@/layouts/DefaultLayout';
// import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
// import UserList from './UserList';
// import { MessageBox } from 'react-chat-elements';

// const ENDPOINT = 'http://localhost:8000';

// interface Message {
//   _id?: string;
//   sender: string;
//   content: string;
//   timestamp: Date;
// }

// interface User {
//   _id: string;
//   username: string;
//   imageUrl: string;
// }

// const ChatComponent: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [users, setUsers] = useState<User[]>([]);
//   const [inputValue, setInputValue] = useState<string>(''); // State for input value
//   const socket = io(ENDPOINT);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get<User[]>(`http://localhost:7000/api/my/messages/clients`);
//         setUsers(response.data);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };

//     fetchUsers();

//     // Listen for incoming messages
//     socket.on('chat message', (message: Message) => {
//       setMessages(prevMessages => [...prevMessages, message]);
//     });

//     // Clean up on unmount
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const sendMessage = (content: string) => {
//     const userId = localStorage.getItem('userId');
//     if (!userId) {
//       console.error('User ID not found in local storage');
//       return;
//     }

//     const message: Message = {
//       sender: userId,
//       content,
//       timestamp: new Date(),
//     };

//     socket.emit('chat message', message);
//     setMessages(prevMessages => [...prevMessages, message]);
//   };

//   const handleSend = () => {
//     if (inputValue.trim() !== '') {
//       sendMessage(inputValue);
//       setInputValue(''); // Clear input field
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   return (
//     <DefaultLayout>
//       <Breadcrumb pageName="Chat " />
//       <div className="chat-layout">
//         <UserList  />
//         <div className="chat-container">
//           <ul className="message-list">
//             {messages.map((message, index) => (
//               <li key={message._id || index} className="message-item">
//                 <div className="message-sender-container">
//                   <div className="message-sender">{message.sender}</div>
//                   <div className="message-timestamp">{formatTimestamp(message.timestamp)}</div>
//                 </div>
//                 <div className="message-content">{message.content}</div>
//               </li>
//             ))}
//           </ul>
//           <div className="message-input-box">
//             <input
//               type="text"
//               className="message-input"
//               placeholder="Type your message here..."
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyDown={handleKeyDown}
//             />
//             <button onClick={handleSend} className="send-button">
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </DefaultLayout>
//   );
// };

// const formatTimestamp = (timestamp: Date): string => {
//   const options: Intl.DateTimeFormatOptions = {
//     hour: 'numeric',
//     minute: 'numeric',
//     hour12: true,
//   };

//   return new Intl.DateTimeFormat('en-US', options).format(timestamp);
// };

// export default ChatComponent;
import DefaultLayout from '@/layouts/DefaultLayout';
import React, { useState } from 'react';

interface ChatMessage {
  sender: string;
  message: string;
  time: string;
}

const chatMessages: ChatMessage[] = [
  { sender: 'Henry Dholi', message: 'Reply to message', time: '' },
  { sender: 'Andri Thomas', message: 'I want to make an appointment tomorrow from 2:00 to 5:00pm?', time: '1:55pm' },
  { sender: 'Andri Thomas', message: 'Ok, Thanks for your reply.', time: '' },
  { sender: 'Robert Jhon', message: 'Can you share your offer?', time: '' },
  { sender: 'Cody Fisher', message: 'I\'m waiting for you response!', time: '' },
  { sender: 'Jenny Wilson', message: 'I\'m waiting for you response!', time: '' },
  { sender: 'Marcus Siphron', message: 'Hello, how are you?', time: '' },
];

const ChatApp = () => {
  const [newMessage, setNewMessage] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  };

  const sendMessage = () => {
    // Add the new message to the chatMessages array
    chatMessages.push({
      sender: 'You',
      message: newMessage,
      time: new Date().toLocaleTimeString(),
    });

    setNewMessage('');
  };

  return (
    <DefaultLayout>
    <div className="chat-app">
      <div className="chat-header">
        <div>
          Active Conversations <span className="active-count">7</span>
        </div>
        <div className="header-controls">
          <span className="control-icon">...</span>
        </div>
      </div>
      <div className="chat-body">
        <div className="chat-search">
          <input type="text" placeholder="Search..." />
          <span className="search-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="1em"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
        </div>
        <div className="chat-messages">
          {chatMessages.map((message, index) => (
            <div key={index} className="message">
              <div className="message-sender">{message.sender}</div>
              <div className="message-text">{message.message}</div>
              <div className="message-time">{message.time}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div></DefaultLayout>
  );
};

export default ChatApp;