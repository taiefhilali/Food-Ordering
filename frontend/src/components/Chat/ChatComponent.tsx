import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import '../Chat/chat.css';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import UserList from './UserList';
import { ChatFeed, Message as ChatMessage, ChatBubble } from 'react-chat-ui';

const ENDPOINT = 'http://localhost:8000';

interface Message {
  _id?: string;
  sender: string;
  recipient: string;
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);

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

    // Initialize Socket.IO connection
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    // Listen for incoming messages
    newSocket.on('chat message', (message: Message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    // Clean up on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const sendMessage = (content: string) => {
    const userId = localStorage.getItem('userId');
    if (!userId || !selectedUser || !socket) {
      console.error('User ID, selected user, or socket not found');
      return;
    }

    const message: Message = {
      sender: userId,
      recipient: selectedUser._id,
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

  const onSelectUser = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Chat " />
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
                .filter(message => message.sender === selectedUser._id || message.recipient === selectedUser._id)
                .map((message, index) => (
                  <li key={message._id || index} className="message-item">
                    <div className="message-sender-container">
                      <div className="message-sender"></div>
                      <div className="message-timestamp">{formatTimestamp(message.timestamp)}</div>
                    </div>
                    {/* Replace with ChatBubble component */}
                    <ChatBubble
                      message={{ id: message._id || '0', message: message.content }}
                      bubbleProps={{
                        showSenderName: true,
                        senderName: message.sender,
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



const formatTimestamp = (timestamp: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  return new Intl.DateTimeFormat('en-US', options).format(timestamp);
};

export default ChatComponent;
