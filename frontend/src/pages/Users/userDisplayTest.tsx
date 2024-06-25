import { Link } from "react-router-dom";

interface User {
  displayName: string;
  photos: { value: string }[];
}

interface UserDisplayTestProps {
  user: User | null;
}

const UserDisplayTest: React.FC<UserDisplayTestProps> = ({ user }) => {
  const logout = () => {
    window.open("http://localhost:7000/auth/logout", "_self");
  };

  return (
    <div className="navbar">
      <span className="logo">
        <Link className="link" to="/">
          Lama App
        </Link>
      </span>
      {user ? (
        <ul className="list">
          <li className="listItem">
            <img src={user.photos[0].value} alt="" className="avatar" />
          </li>
          <li className="listItem">{user.displayName}</li>
          <li className="listItem" onClick={logout}>
            Logout
          </li>
        </ul>
      ) : (
        <Link className="link" to="login">
          Login
        </Link>
      )}
    </div>
  );
};

export default UserDisplayTest;
