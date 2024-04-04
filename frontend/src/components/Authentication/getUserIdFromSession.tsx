
const getUserIdFromSession = () => {

  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const userObj = JSON.parse(userInfo);
    return userObj._id;
  }
  return null;
};
export default getUserIdFromSession;