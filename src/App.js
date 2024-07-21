import React from 'react';
import './App.css';
import MazeContainer from './Maze';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Maze Game</h1>
      </header>
      <main className="App-content">
        <MazeContainer />
      </main>
    </div>
  );
};

export default App;
