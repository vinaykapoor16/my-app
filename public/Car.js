import React, { useState, useEffect } from 'react';
import './Car.css';

const directions = ['up', 'right', 'down', 'left'];

const getNextDirection = (currentDirection, turn) => {
  const index = directions.indexOf(currentDirection);
  if (turn === 'left') {
    return directions[(index + 3) % 4]; // Turn left
  } else if (turn === 'right') {
    return directions[(index + 1) % 4]; // Turn right
  } else if (turn === 'around') {
    return directions[(index + 2) % 4]; // Turn 180 degrees
  }
  return currentDirection;
};

const getNextPosition = (position, direction) => {
  let { x, y } = position;
  if (direction === 'right') x += 1;
  if (direction === 'left') x -= 1;
  if (direction === 'up') y -= 1;
  if (direction === 'down') y += 1;
  return { x, y };
};

const Car = ({ grid }) => {
  const [position, setPosition] = useState({ x: 1, y: 0 });
  const [direction, setDirection] = useState('right');
  const [state, setState] = useState('move');

  useEffect(() => {
    const moveCar = () => {
      let newState = state;
      let newDirection = direction;
      let newPosition = position;

      if (state === 'move') {
        newPosition = getNextPosition(position, direction);
        if (grid[newPosition.y][newPosition.x] === true) {
          newState = 'determine';
        }
      } else if (state === 'determine') {
        const rightDir = getNextDirection(direction, 'right');
        const leftDir = getNextDirection(direction, 'left');
        const backDir = getNextDirection(direction, 'around');

        const rightPos = getNextPosition(position, rightDir);
        const leftPos = getNextPosition(position, leftDir);
        const backPos = getNextPosition(position, backDir);

        if (grid[rightPos.y][rightPos.x] === false) {
          newState = 'move';
          newDirection = rightDir;
        } else if (grid[leftPos.y][leftPos.x] === false) {
          newState = 'move';
          newDirection = leftDir;
        } else if (grid[backPos.y][backPos.x] === false) {
          newState = 'move';
          newDirection = backDir;
        }
      }

      if (newPosition.x === 48 && newPosition.y === 48) {
        newState = 'stop';
      }

      setPosition(newPosition);
      setDirection(newDirection);
      setState(newState);
    };

    const interval = setInterval(moveCar, 500);
    return () => clearInterval(interval);
  }, [position, direction, state, grid]);

  const carStyle = {
    left: position.x * 10,
    top: position.y * 10,
    transform: `rotate(${directions.indexOf(direction) * 90}deg)`,
  };

  return <div className="car" style={carStyle}></div>;
};

export default Car;
