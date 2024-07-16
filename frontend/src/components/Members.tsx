import React from 'react';
import '../assets/css/styless.css';

interface MemberProps {
  id: string;
  clientData: {
    username: string;
    color: string;
  };
  isMe: boolean;
}

interface MembersProps {
  members: MemberProps[];
  me: {
    id: string;
  };
}

const Members: React.FC<MembersProps> = ({ members, me }) => {
  return (
    <div className="members">
      <div className="membersCount">
        {members.length} user{members.length === 1 ? '' : 's'} online
      </div>
      <div className="membersList">
        {members.map((m) => (
          <Member key={m.id} id={m.id} clientData={m.clientData} isMe={m.id === me.id} />
        ))}
      </div>
    </div>
  );
};

const Member: React.FC<MemberProps> = ({ id, clientData, isMe }) => {
  const { username, color } = clientData;

  return (
    <div key={id} className="member">
      <div className="avatar" style={{ backgroundColor: color }} />
      <div className="username">
        {username} {isMe ? ' (you)' : ''}
      </div>
    </div>
  );
};

export default Members;
