import  { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000'); // Replace with your server URL

const NotificationListener = () => {
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  useEffect(() => {
    // Request notification permission on component mount
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
      });
    }

    socket.on('paymentSuccess', (data) => {
      showNotification(data);
      playNotificationSound();
    });

    return () => {
      socket.off('paymentSuccess');
    };
  }, []);

  const showNotification = (data) => {
    if (notificationPermission === 'granted') {
      new Notification('New Order', {
        body: `Order for $${(data.orderDetails.amount / 100).toFixed(2)} placed!`,
        icon: '/path/to/icon.png', // Replace with your icon path if you have one
        tag: 'new-order',
      });
    } else {
      console.warn('Notification permission not granted.');
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio('/path/to/notification-sound.mp3'); // Replace with your sound file path
    audio.play();
  };

  const handleRequestPermission = () => {
    Notification.requestPermission().then(permission => {
      setNotificationPermission(permission);
    });
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Notification Listener</h1>
      <p>Notification permission status: {notificationPermission}</p>
      {notificationPermission === 'default' && (
        <button onClick={handleRequestPermission}>
          Request Notification Permission
        </button>
      )}
    </div>
  );
};

export default NotificationListener;
