
import LoginFormModal from '@/forms/manage-user-form/LoginFormModal';

const AuthPage = () => {
    // const [showRegister, setShowRegister] = useState(false);
  
    // const handleToggleForm = (isRegister: boolean) => {
    //   setShowRegister(isRegister);
    // };
  
    return (
        <LoginFormModal></LoginFormModal>
    )};
//       <Container>
//         <Title>Welcome to Food Ordering App</Title>
//         <ButtonContainer>
//           <ToggleButton onClick={() => handleToggleForm(true)}>Register</ToggleButton>
//           <ToggleButton onClick={() => handleToggleForm(false)}>Login</ToggleButton>
//         </ButtonContainer>
//         {showRegister ? <RegistrationForm /> : <LoginForm />}
//       </Container>
//     );
//   };
  
//   const Container = styled.div`
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     height: 100vh;
//     background-color: #f8f8f8; /* Light grey background */
//   `;
  
//   const Title = styled.h1`
//     color: #e67e22; /* Orange */
//     margin-bottom: 30px;
//   `;
  
//   const ButtonContainer = styled.div`
//     display: flex;
//     justify-content: space-around;
//     width: 200px;
//     margin-bottom: 20px;
//   `;
  
//   const ToggleButton = styled.button`
//     padding: 10px 20px;
//     font-size: 16px;
//     border: none;
//     border-radius: 5px;
//     cursor: pointer;
//     background-color: #f39c12; /* Yellow */
//     color: #ffffff; /* White */
//     transition: background-color 0.3s ease;
  
//     &:hover {
//       background-color: #e67e22; /* Darker orange on hover */
//     }
//   `;
  
  export default AuthPage;