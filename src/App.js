import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Services from './components/pages/Services';
import Contact from './components/pages/Contact';
import './App.css';
import Alert from './components/Alert';
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

function App() {
  const [theme, setTheme] = useState('light');
  const [alert, setAlert] = useState(null);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const showAlert = (message, type = 'success', timeout = 1500) => {
    setAlert({ message, type });
    if (timeout > 0) {
      setTimeout(() => {
        setAlert(null);
      }, timeout);
    }
  };

  const clearAlert = () => {
    setAlert(null);
  };

  useEffect(() => {
    document.body.className = theme + '-mode';
  }, [theme]);

  return (
    <div className="App">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div style={{ padding: '10px' }}>
        <Alert 
          alert={alert?.message} 
          type={alert?.type}
          timeout={alert ? 1500 : 0}
          onTimeout={clearAlert}
        />
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home theme={theme} showAlert={showAlert} />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services theme={theme} />} />
        <Route path="/contact" element={<Contact theme={theme} />} />
      </Routes>
    </div>
    
  );
}

export default App;
