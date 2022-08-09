import Public from './Public';
import Private from './Private';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Public />}/>
        <Route path="/private" element={<Private />}/>
      </Routes>
    </Router>
  );
}

export default App;
