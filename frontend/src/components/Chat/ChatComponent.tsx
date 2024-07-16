import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import '../Chat/chat.css';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import UserList from './UserList';
import { MessageBox } from 'react-chat-elements';

const ENDPOINT = 'http://localhost:8000';

interface Message {
  _id?: string;
  sender: string;
  content: string;
  timestamp: Date;
}

interface User {
  _id: string;
  username: string;
  imageUrl: string;
}

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [inputValue, setInputValue] = useState<string>(''); // State for input value
  const socket = io(ENDPOINT);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>(`http://localhost:7000/api/my/messages/clients`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();

    // Listen for incoming messages
    socket.on('chat message', (message: Message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (content: string) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in local storage');
      return;
    }

    const message: Message = {
      sender: userId,
      content,
      timestamp: new Date(),
    };

    socket.emit('chat message', message);
    setMessages(prevMessages => [...prevMessages, message]);
  };

  const handleSend = () => {
    if (inputValue.trim() !== '') {
      sendMessage(inputValue);
      setInputValue(''); // Clear input field
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Chat " />
      <div className="chat-layout">
        <UserList  />
        <div className="chat-container">
          <ul className="message-list">
            {messages.map((message, index) => (
              <li key={message._id || index} className="message-item">
                <div className="message-sender-container">
                  <div className="message-sender">{message.sender}</div>
                  <div className="message-timestamp">{formatTimestamp(message.timestamp)}</div>
                </div>
                <div className="message-content">{message.content}</div>
              </li>
            ))}
          </ul>
          <div className="message-input-box">
            <input
              type="text"
              className="message-input"
              placeholder="Type your message here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSend} className="send-button">
              Send
            </button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

const formatTimestamp = (timestamp: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  return new Intl.DateTimeFormat('en-US', options).format(timestamp);
};

export default ChatComponent;
