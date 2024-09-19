/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// // /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { ChatBubble } from 'react-chat-ui';
// import DefaultLayout from '@/layouts/DefaultLayout';
// import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
// import UserList from './UserList';
// import '../Chat/chat.css';
// import { io } from 'socket.io-client';

// interface Chat {
//   _id: string;
//   content: string; 
//   createdAt: Date;
//   sender: {
//     _id: string;
//     name: string;
//     avatar: string;
//   };
// }

// interface User {
//   _id: string;
//   username: string;
//   imageUrl: string;
// }

// const ChatComponent: React.FC = () => {
//   const [messages, setMessages] = useState<Chat[]>([]);
//   const [users] = useState<User[]>([]);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [inputValue, setInputValue] = useState<string>('');
//   const [refreshKey, setRefreshKey] = useState<number>(0); // State to trigger refresh
//   const socket = io("http://localhost:8000", { transports: ["websocket"] });

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const accessToken = localStorage.getItem('userToken');
//         const response = await axios.get('http://localhost:7000/api/my/messages/all', {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });

//         if (response.status === 200) {
//           if (response.data && response.data.length > 0) {
//             const formattedMessages = response.data
//               .map((msg: any) => ({
//                 _id: msg._id,
//                 content: msg.content,
//                 createdAt: new Date(msg.createdAt),
//                 sender: {
//                   _id: msg.sender._id,
//                   name: msg.sender.username,
//                   avatar: msg.sender.imageUrl,
//                 },
//               }))
//               .sort((a: { createdAt: { getTime: () => number; }; }, b: { createdAt: { getTime: () => number; }; }) => a.createdAt.getTime() - b.createdAt.getTime());

//             setMessages(formattedMessages);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();
//   }, [refreshKey]);

//   useEffect(() => {
//     socket.on('chat message', (message: Chat) => {
//       setMessages(prevMessages => [
//         ...prevMessages,
//         message,
//       ]);
//     });

//     return () => {
//       socket.off('chat message');
//     };
//   }, [socket]);

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setRefreshKey(prevKey => prevKey + 1);
//     }, 1000);

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, []);

//   const sendMessage = async (content: string) => {
//     const userId = localStorage.getItem('userId');
//     if (!userId || !selectedUser || !socket) {
//       console.error('User ID, selected user, or socket not found');
//       return;
//     }

//     const sender = {
//       _id: userId,
//       name: localStorage.getItem('username') || 'Unknown',
//       avatar: localStorage.getItem('avatar') || 'https://example.com/avatar.png',
//     };

//     const newMessage = {
//       content: content,
//       sender: sender._id,
//     };

//     try {
//       const response = await axios.post('http://localhost:7000/api/my/messages/new', newMessage, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('userToken')}`,
//         },
//       });

//       if (response.status === 201) {
//         const serverMessage = response.data;

//         socket.emit('chat message', {
//           _id: serverMessage._id,
//           content: serverMessage.content,
//           createdAt: serverMessage.createdAt,
//           sender: {
//             _id: serverMessage.sender._id,
//             name: serverMessage.sender.username,
//             avatar: serverMessage.sender.imageUrl,
//           },
//         });

//         setMessages(prevMessages => [
//           ...prevMessages,
//           {
//             _id: serverMessage._id,
//             content: serverMessage.content,
//             createdAt: new Date(serverMessage.createdAt),
//             sender: {
//               _id: serverMessage.sender._id,
//               name: serverMessage.sender.username,
//               avatar: serverMessage.sender.imageUrl,
//             },
//           } as Chat,
//         ]);
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   const handleSend = () => {
//     if (inputValue.trim() !== '') {
//       sendMessage(inputValue);
//       setInputValue('');
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   const onSelectUser = (user: User) => {
//     setSelectedUser(user);
//   };

//   const formatTimestamp = (timestamp: Date): string => {
//     const options: Intl.DateTimeFormatOptions = {
//       hour: 'numeric',
//       minute: 'numeric',
//       hour12: true,
//     };
//     return new Intl.DateTimeFormat('en-US', options).format(timestamp);
//   };

//   return (
//     <DefaultLayout>
//       <Breadcrumb pageName="Chat" />
//       <div className="chat-layout">
//       <UserList 
//   users={users} 
//   onSelectUser={onSelectUser} 
//   selectedUser={selectedUser} 
// />
//         {selectedUser ? (
//           <div className="chat-container">
//             <div className="selected-user">
//               <img src={selectedUser.imageUrl} alt={selectedUser.username} className="selected-user-avatar" />
//               <span className="selected-user-name">{selectedUser.username}</span>
//             </div>
//             <div className="selected-user-divider"></div>
//             <ul className="message-list">
//               {messages
//                 .filter(message => selectedUser && (message.sender._id === selectedUser._id || message.sender._id === localStorage.getItem('userId')))
//                 .map((message) => (
//                   <li
//                     key={message._id}
//                     className={`message-item ${
//                       message.sender._id === localStorage.getItem('userId') ? 'sent' : 'received'
//                     }`}
//                   >
//                     <div className="message-sender-container">
//                       <div className="message-sender">
//                         {message.sender.name}
//                       </div>
//                       <div className="message-timestamp">
//                         {formatTimestamp(message.createdAt)}
//                       </div>
//                     </div>
//                     <ChatBubble
//                       message={{ id: message._id || '0', message: message.content }}
//                       bubbleProps={{
//                         showSenderName: message.sender._id !== localStorage.getItem('userId'),
//                         senderName: message.sender.name,
//                       }}
//                     />
//                   </li>
//                 ))}
//             </ul>
//             <div className="message-input-box">
//               <input
//                 type="text"
//                 className="message-input"
//                 placeholder="Type your message here..."
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyDown={handleKeyDown}
//               />
//               <button onClick={handleSend} className="send-button">
//                 Send
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="chat-placeholder">Select a user to start chatting</div>
//         )}
//       </div>
//     </DefaultLayout>
//   );
// };

// export default ChatComponent;
// import React, { useEffect, useState } from 'react';
// import './userList.css';
// import './chat.css';
// import axios from 'axios';
// import { ChatItem,MessageBox, MessageList } from 'react-chat-elements';

// // import { ChatBubble } from 'react-chat-ui';
// import DefaultLayout from '@/layouts/DefaultLayout';
// import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
// import { io } from 'socket.io-client';

// interface User {
//   _id: string;
//   username: string;
//   imageUrl: string;
// }

// interface Chat {
//   _id: string;
//   content: string;
//   createdAt: Date;
//   sender: {
//     _id: string;
//     name: string;
//     avatar: string;
//   };
// }

// const ChatComponent: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [messages, setMessages] = useState<Chat[]>([]);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [inputValue, setInputValue] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [refreshKey, setRefreshKey] = useState<number>(0);
//   const socket = io('http://localhost:8000', { transports: ['websocket'] });

//   useEffect(() => {
//     const fetchSenders = async () => {
//       try {
//         const response = await axios.get<User[]>('http://localhost:7000/api/my/messages/fetch-senders');
//         const loggedInUserId = localStorage.getItem('userId');

//         if (loggedInUserId) {
//           const uniqueUsersSet = new Set<string>();
//           response.data.forEach((user) => {
//             if (user._id !== loggedInUserId && !uniqueUsersSet.has(user._id)) {
//               uniqueUsersSet.add(user._id);
//             }
//           });

//           const filteredUsers = Array.from(uniqueUsersSet).map(
//             (userId) => response.data.find((user) => user._id === userId)!
//           );
//           setUsers(filteredUsers);
//         } else {
//           setError('User ID not found in localStorage');
//         }
//       } catch (err) {
//         setError('Error fetching senders');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSenders();
//   }, []);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const accessToken = localStorage.getItem('userToken');
//         const response = await axios.get('http://localhost:7000/api/my/messages/all', {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });

//         if (response.status === 200 && response.data) {
//           const formattedMessages = response.data
//             .map((msg: any) => ({
//               _id: msg._id,
//               content: msg.content,
//               createdAt: new Date(msg.createdAt),
//               sender: {
//                 _id: msg.sender._id,
//                 name: msg.sender.username,
//                 avatar: msg.sender.imageUrl,
//               },
//             }))
//             .sort((a: { createdAt: { getTime: () => number; }; }, b: { createdAt: { getTime: () => number; }; }) => a.createdAt.getTime() - b.createdAt.getTime());

//           setMessages(formattedMessages);
//         }
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();
//   }, [refreshKey]);

//   useEffect(() => {
//     socket.on('chat message', (message: Chat) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     return () => {
//       socket.off('chat message');
//     };
//   }, [socket]);

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setRefreshKey((prevKey) => prevKey + 1);
//     }, 1000);

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, []);

//   const sendMessage = async (content: string) => {
//     const userId = localStorage.getItem('userId');
//     if (!userId || !selectedUser) {
//       console.error('User ID or selected user not found');
//       return;
//     }

//     const sender = {
//       _id: userId,
//       name: localStorage.getItem('username') || 'Unknown',
//       avatar: localStorage.getItem('avatar') || 'https://example.com/avatar.png',
//     };

//     const newMessage = {
//       content: content,
//       sender: sender._id,
//     };

//     try {
//       const response = await axios.post('http://localhost:7000/api/my/messages/new', newMessage, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('userToken')}`,
//         },
//       });

//       if (response.status === 201) {
//         const serverMessage = response.data;

//         socket.emit('chat message', {
//           _id: serverMessage._id,
//           content: serverMessage.content,
//           createdAt: serverMessage.createdAt,
//           sender: {
//             _id: serverMessage.sender._id,
//             name: serverMessage.sender.username,
//             avatar: serverMessage.sender.imageUrl,
//           },
//         });

//         setMessages((prevMessages) => [
//           ...prevMessages,
//           {
//             _id: serverMessage._id,
//             content: serverMessage.content,
//             createdAt: new Date(serverMessage.createdAt),
//             sender: {
//               _id: serverMessage.sender._id,
//               name: serverMessage.sender.username,
//               avatar: serverMessage.sender.imageUrl,
//             },
//           } as Chat,
//         ]);
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   const handleSend = () => {
//     if (inputValue.trim() !== '') {
//       sendMessage(inputValue);
//       setInputValue('');
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   const onSelectUser = (user: User) => {
//     setSelectedUser(user);
//   };

//   const formatTimestamp = (timestamp: Date): string => {
//     const options: Intl.DateTimeFormatOptions = {
//       hour: 'numeric',
//       minute: 'numeric',
//       hour12: true,
//     };
//     return new Intl.DateTimeFormat('en-US', options).format(timestamp);
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <DefaultLayout>
//       <Breadcrumb pageName="Chat" />
//       <div className="chat-layout">
//         <div className="chat-list">
//           {users.map((user: User) => (
//             <ChatItem
//               key={user._id}
//               id={user._id}
//               avatar={user.imageUrl}
//               alt={user.username}
//               title={user.username}
//               date={new Date()}
//               unread={0}
//               showMute={true}
//               className="chat-item"
//               onClick={() => onSelectUser(user)}
//             />
//           ))}
//         </div>
//         {selectedUser ? (
//           <div className="chat-container">
//             <div className="selected-user">
//               <img src={selectedUser.imageUrl} alt={selectedUser.username} className="selected-user-avatar" />
//               <span className="selected-user-name">{selectedUser.username}</span>
//             </div>
//             <div className="selected-user-divider"></div>
//             <ul className="message-list">
//               {messages
//                 .filter(
//                   (message) =>
//                     selectedUser &&
//                     (message.sender._id === selectedUser._id || message.sender._id === localStorage.getItem('userId'))
//                 )
//                 .map((message) => (
//                   <li
//                     key={message._id}
//                     className={`message-item ${
//                       message.sender._id === localStorage.getItem('userId') ? 'sent' : 'received'
//                     }`}
//                   >
//                     <div className="message-sender-container">
//                       <div className="message-sender">{message.sender.name}</div>
//                       <div className="message-timestamp">{formatTimestamp(message.createdAt)}</div>
//                     </div>
//                     {/* <ChatBubble
//                       message={{ id: message._id || '0', message: message.content }}
//                       bubbleProps={{
//                         showSenderName: message.sender._id !== localStorage.getItem('userId'),
//                         senderName: message.sender.name,
//                       }}
//                     /> */}
//                   </li>
//                 ))}
//             </ul>
//             <div className="message-input-box">
//               <input
//                 type="text"
//                 className="message-input"
//                 placeholder="Type your message here..."
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyDown={handleKeyDown}
//               />
//               <button onClick={handleSend} className="send-button">
//                 Send
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="chat-placeholder">Select a user to start chatting</div>
//         )}
//       </div>
//     </DefaultLayout>
//   );
// };

// export default ChatComponent;
import React, { useEffect, useState } from 'react';
import './userList.css';
import './chat.css';
import axios from 'axios';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { io } from 'socket.io-client';
import { ChatItem } from 'react-chat-elements';

interface User {
  _id: string;
  username: string;
  imageUrl: string;
}

interface Chat {
  _id: string;
  content: string;
  createdAt: Date;
  sender: {
    _id: string;
    name: string;
    avatar: string;
  };
}

const ChatComponent: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Chat[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const socket = io('http://localhost:8000', { transports: ['websocket'] });

  useEffect(() => {
    const fetchSenders = async () => {
      try {
        const response = await axios.get<User[]>('http://localhost:7000/api/my/messages/fetch-senders');
        const loggedInUserId = localStorage.getItem('userId');

        if (loggedInUserId) {
          const uniqueUsersSet = new Set<string>();
          response.data.forEach((user) => {
            if (user._id !== loggedInUserId && !uniqueUsersSet.has(user._id)) {
              uniqueUsersSet.add(user._id);
            }
          });

          const filteredUsers = Array.from(uniqueUsersSet).map(
            (userId) => response.data.find((user) => user._id === userId)!
          );
          setUsers(filteredUsers);
        } else {
          setError('User ID not found in localStorage');
        }
      } catch (err) {
        setError('Error fetching senders');
      } finally {
        setLoading(false);
      }
    };

    fetchSenders();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const accessToken = localStorage.getItem('userToken');
        const response = await axios.get('http://localhost:7000/api/my/messages/all', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200 && response.data) {
          const formattedMessages = response.data
            .map((msg: any) => ({
              _id: msg._id,
              content: msg.content,
              createdAt: new Date(msg.createdAt),
              sender: {
                _id: msg.sender._id,
                name: msg.sender.username,
                avatar: msg.sender.imageUrl,
              },
            }))
            .sort((a: { createdAt: { getTime: () => number; }; }, b: { createdAt: { getTime: () => number; }; }) => a.createdAt.getTime() - b.createdAt.getTime());

          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [refreshKey]);

  useEffect(() => {
    socket.on('chat message', (message: Chat) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('chat message');
    };
  }, [socket]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefreshKey((prevKey) => prevKey + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const sendMessage = async (content: string) => {
    const userId = localStorage.getItem('userId');
    if (!userId || !selectedUser) {
      console.error('User ID or selected user not found');
      return;
    }

    const sender = {
      _id: userId,
      name: localStorage.getItem('username') || 'Unknown',
      avatar: localStorage.getItem('avatar') || 'https://example.com/avatar.png',
    };

    const newMessage = {
      content: content,
      sender: sender._id,
    };

    try {
      const response = await axios.post('http://localhost:7000/api/my/messages/new', newMessage, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });

      if (response.status === 201) {
        const serverMessage = response.data;

        socket.emit('chat message', {
          _id: serverMessage._id,
          content: serverMessage.content,
          createdAt: serverMessage.createdAt,
          sender: {
            _id: serverMessage.sender._id,
            name: serverMessage.sender.username,
            avatar: serverMessage.sender.imageUrl,
          },
        });

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            _id: serverMessage._id,
            content: serverMessage.content,
            createdAt: new Date(serverMessage.createdAt),
            sender: {
              _id: serverMessage.sender._id,
              name: serverMessage.sender.username,
              avatar: serverMessage.sender.imageUrl,
            },
          } as Chat,
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSend = () => {
    if (inputValue.trim() !== '') {
      sendMessage(inputValue);
      setInputValue('');
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Chat" />
      <div className="chat-layout">
        <div className="chat-list">
          {users.map((user: User) => (
            <ChatItem
              key={user._id}
              id={user._id}
              avatar={user.imageUrl}
              alt={user.username}
              title={user.username}
              date={new Date()}
              unread={0}
              showMute={true}
              className="chat-item"
              onClick={() => onSelectUser(user)}
            />
          ))}
        </div>
        {selectedUser ? (
          <div className="chat-container">
            <div className="selected-user">
              <img src={selectedUser.imageUrl} alt={selectedUser.username} className="selected-user-avatar" />
              <span className="selected-user-name">{selectedUser.username}</span>
            </div>
            <div className="selected-user-divider"></div>
            <ul className="message-list">
              {messages
                .filter(
                  (message) =>
                    selectedUser &&
                    (message.sender._id === selectedUser._id || message.sender._id === localStorage.getItem('userId'))
                )
                .map((message) => (
                  <li
                    key={message._id}
                    className={`message-item ${message.sender._id === localStorage.getItem('userId') ? 'sent' : 'received'
                      }`}
                  >
                    <div className={`message-bubble ${message.sender._id === localStorage.getItem('userId') ? 'sent' : 'received'}`}>
                      <div className="message-sender-name">{message.sender.name}</div>
                      <div className="message-content">{message.content}</div>
                      <div className="message-timestamp">{formatTimestamp(message.createdAt)}</div>
                    </div>
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
