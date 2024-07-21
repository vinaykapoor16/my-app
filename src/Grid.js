import React from 'react';
import './Grid.css'; // Example CSS for grid styling

const Grid = ({ grid }) => {
  return (
    <div className="grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`cell ${cell.wall ? 'wall' : ''}`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
