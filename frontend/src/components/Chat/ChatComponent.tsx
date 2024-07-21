import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChatBubble } from 'react-chat-ui';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import UserList from './UserList';
import '../Chat/chat.css';

interface Chat {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
}

interface User {
  _id: string;
  username: string;
  imageUrl: string;
}

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<Chat[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const accessToken = localStorage.getItem('userToken');

        const response = await axios.get('http://localhost:7000/api/my/messages/all', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200) {
          if (response.data && response.data.length > 0) {
            const formattedMessages = response.data
              .map((msg: any) => ({
                _id: msg._id,
                text: msg.content,
                createdAt: new Date(msg.createdAt),
                user: {
                  _id: msg.sender._id,
                  name: msg.sender.username,
                  avatar: msg.sender.imageUrl,
                },
              }))
              .sort((a: { createdAt: { getTime: () => number; }; }, b: { createdAt: { getTime: () => number; }; }) => a.createdAt.getTime() - b.createdAt.getTime());

            setMessages(formattedMessages);
            console.log('Fetched messages:', formattedMessages); // Debug log
          } else {
            console.log('No messages found');
          }
        } else {
          console.log('Unexpected response status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleSend = () => {
    if (inputValue.trim() !== '') {
      // Your sendMessage logic here...
      setInputValue(''); // Clear input field
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const onSelectUser = (user: User) => {
    setSelectedUser(user);
  };

  const formatTimestamp = (timestamp: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return new Intl.DateTimeFormat('en-US', options).format(timestamp);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Chat" />
      <div className="chat-layout">
        <UserList users={users} onSelectUser={onSelectUser} selectedUser={selectedUser} />
        {selectedUser ? (
          <div className="chat-container">
            <div className="selected-user">
              <img src={selectedUser.imageUrl} alt={selectedUser.username} className="selected-user-avatar" />
              <span className="selected-user-name">{selectedUser.username}</span>
            </div>
            <div className="selected-user-divider"></div>
            <ul className="message-list">
              {messages
                .filter(message => selectedUser && (message.user._id === selectedUser._id || message.user._id === localStorage.getItem('userId')))
                .map((message) => (
                  <li key={message._id} className={`message-item ${message.user._id === localStorage.getItem('userId') ? 'sent' : 'received'}`}>
                    <div className="message-sender-container">
                      <div className="message-sender">{message.user.name}</div>
                      <div className="message-timestamp">{formatTimestamp(message.createdAt)}</div>
                    </div>
                    <ChatBubble
                      message={{ id: message._id || '0', message: message.text }}
                      bubbleProps={{
                        showSenderName: message.user._id !== localStorage.getItem('userId'),
                        senderName: message.user.name,
                      }}
                    />
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
        ) : (
          <div className="chat-placeholder">Select a user to start chatting</div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default ChatComponent;
