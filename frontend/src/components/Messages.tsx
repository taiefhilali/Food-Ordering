import React, { useEffect, useRef } from 'react';
import '../assets/css/styless.css';

interface MessageProps {
  member: {
    clientData: {
      username: string;
      color: string;
    };
    id: string;
  };
  data: string;
  id: string;
}

interface MessagesProps {
  messages: MessageProps[];
  me: {
    id: string;
  };
}

const Messages: React.FC<MessagesProps> = ({ messages, me }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <ul className="messagesList">
      {messages.map((m) => (
        <Message key={m.id} member={m.member} data={m.data} id={m.id} me={me} />
      ))}
      <div ref={bottomRef}></div>
    </ul>
  );
};

const Message: React.FC<MessageProps & { me: { id: string } }> = ({
  member,
  data,
  id,
}) => {
  const { username, color } = member.clientData;
//   const messageFromMe = member.id === me.id;
//   const className = messageFromMe
//     ? `$messagesMessage ${styles.currentMember}`
//     : styles.messagesMessage;

  return (
    <li key={id}>
      <span className="avatar" style={{ backgroundColor: color }} />
      <div className="messageContent">
        <div className="username">{username}</div>
        <div className="text">{data}</div>
      </div>
    </li>
  );
};

export default Messages;
