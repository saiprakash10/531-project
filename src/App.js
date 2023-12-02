import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import NavBar from './NavBar';
import Graph from './Graph';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Graphs" element={<Graph />} />
      </Routes>

      
    </Router>
  );
}

export default App;
