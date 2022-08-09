import {React} from 'react';
import {useNavigate} from 'react-router-dom';
function Private({}) {
  const navigate = useNavigate();
  const logoutHandler = () => {
    console.log('Logout');
    navigate('/');
  };
  return (
    <>
      <h1>This is private route</h1><br />
      <button onClick={logoutHandler}>Log Out</button>
    </>
  );
}

export default Private;
