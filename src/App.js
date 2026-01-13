import React from 'react';
import './App.css'; 


import Header from './components.js/header.js';
import Footer from './components.js/footer.js';
import Standings from './components.js/Standings.js';

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="content">
        <Standings />
      </div>
      <Footer />
    </div>
  );
}

export default App;