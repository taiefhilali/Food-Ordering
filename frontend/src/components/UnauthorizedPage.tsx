import Lottie from 'react-lottie';
import * as unauthorizedAnimation from '../assets/unauthorized.json'; // Adjust the path as necessary
import DefaultLayout from '@/layouts/DefaultLayout';

const UnauthorizedPage = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: unauthorizedAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (    
  <DefaultLayout>

    <div style={{ textAlign: 'center', padding: '50px' }}>
      <Lottie options={defaultOptions} height={300} width={300} />
      <h1>Not Authorized</h1>
      <p>You do not have permission to view this page.</p>
    </div>
    </DefaultLayout>
  );
};

export default UnauthorizedPage;
