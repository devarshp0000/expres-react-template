import {React} from 'react';
import {useNavigate} from 'react-router-dom';

function Public({}) {
  const navigate = useNavigate();
  const btnHandler = () => {
    navigate('/private');
  }
  return (
    <>
      <h1>This is public route</h1>
      <button onClick={btnHandler}>Log In</button>
    </>
  );
}

export default Public;
