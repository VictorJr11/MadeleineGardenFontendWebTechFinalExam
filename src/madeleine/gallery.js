// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Gallery from './pages/Gallery';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Rooms from './pages/Rooms';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/rooms" element={<Rooms />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

