import React, { useState, useEffect } from 'react';
import './Maze.css';

const createEmptyGrid = (rows, cols) => {
  let grid = Array(rows).fill().map(() => Array(cols).fill(false));
  return grid;
};

const generateMaze = (grid) => {
  const rows = grid.length;
  const cols = grid[0].length;

  const inBounds = (x, y) => x >= 0 && y >= 0 && x < cols && y < rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      grid[row][col] = true;
    }
  }

  const carvePath = (x, y) => {
    const directions = [
      [1, 0], [-1, 0], [0, 1], [0, -1]
    ];

    for (let [dx, dy] of directions) {
      const nx = x + 2 * dx, ny = y + 2 * dy;
      if (inBounds(nx, ny) && grid[ny][nx]) {
        grid[ny][nx] = false;
        grid[y + dy][x + dx] = false;
        carvePath(nx, ny);
      }
    }
  };

  const startX = Math.floor(Math.random() * (cols - 2)) + 1;
  const startY = Math.floor(Math.random() * (rows - 2)) + 1;
  grid[startY][startX] = false;
  carvePath(startX, startY);

  const edge = Math.floor(Math.random() * 4);
  let exitX, exitY;

  switch (edge) {
    case 0:
      exitX = Math.floor(Math.random() * cols);
      exitY = 0;
      break;
    case 1:
      exitX = cols - 1;
      exitY = Math.floor(Math.random() * rows);
      break;
    case 2:
      exitX = Math.floor(Math.random() * cols);
      exitY = rows - 1;
      break;
    case 3:
      exitX = 0;
      exitY = Math.floor(Math.random() * rows);
      break;
    default:
      break;
  }

  grid[exitY][exitX] = false;

  return grid;
};

const Maze = ({ grid, carPosition, carDirection, endPosition, onClick }) => {
  const directionAngles = {
    'up': 0,
    'right': 90,
    'down': 180,
    'left': 270
  };

  return (
    <div className="maze">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="maze-row">
          {row.map((cell, colIndex) => {
            const isCar = carPosition && carPosition.x === colIndex && carPosition.y === rowIndex;
            const isEnd = endPosition && endPosition.x === colIndex && endPosition.y === rowIndex;
            return (
              <div
                key={colIndex}
                className={`maze-cell ${cell ? 'wall' : 'passage'} ${isCar ? 'car' : ''} ${isEnd ? 'end' : ''}`}
                onClick={() => onClick(colIndex, rowIndex)}
                style={{ backgroundColor: isEnd ? 'yellow' : '' }}
              >
                {isCar && (
                  <div
                    className="car"
                    style={{
                      transform: `rotate(${directionAngles[carDirection]}deg)`,
                      transition: 'transform 0.2s ease-in-out'
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const MazeContainer = () => {
  const [grid, setGrid] = useState(createEmptyGrid(20, 20));
  const [carPosition, setCarPosition] = useState({ x: 1, y: 0 });
  const [endPosition, setEndPosition] = useState(null);
  const [carDirection, setCarDirection] = useState('right');
  const [carVisible, setCarVisible] = useState(false);
  const [destinationReached, setDestinationReached] = useState(false);
  const [path, setPath] = useState([]);

  useEffect(() => {
    setGrid(generateMaze(createEmptyGrid(20, 20)));
  }, []);

  const startAnimation = () => {
    setCarVisible(true);
    setDestinationReached(false);
    findShortestPath(carPosition, endPosition);
  };

  const stopAnimation = () => {
    setCarVisible(false);
  };

  const onClickCell = (x, y) => {
    if (grid[y][x] === false) {
      if (!endPosition) {
        setEndPosition({ x, y });
      } else {
        setCarPosition({ x, y });
        setCarVisible(true);
        setDestinationReached(false);
        findShortestPath({ x, y }, endPosition);
      }
    }
  };

  const findShortestPath = (start, end) => {
    if (!start || !end) return;

    const directions = [
      { x: 1, y: 0, turn: 'right' },
      { x: -1, y: 0, turn: 'left' },
      { x: 0, y: 1, turn: 'down' },
      { x: 0, y: -1, turn: 'up' }
    ];

    const inBounds = (x, y) => x >= 0 && y >= 0 && x < grid[0].length && y < grid.length;
    const visited = Array(grid.length).fill().map(() => Array(grid[0].length).fill(false));
    const queue = [{ x: start.x, y: start.y, path: [], direction: carDirection }];
    visited[start.y][start.x] = true;

    while (queue.length > 0) {
      const { x, y, path, direction } = queue.shift();

      if (x === end.x && y === end.y) {
        setPath(path);
        return;
      }

      console.log("Finding Path: ", path);

      for (const { x: dx, y: dy, turn } of directions) {
        const nx = x + dx;
        const ny = y + dy;
        if (inBounds(nx, ny) && !grid[ny][nx] && !visited[ny][nx]) {
          visited[ny][nx] = true;
          queue.push({
            x: nx,
            y: ny,
            path: [...path, { x: nx, y: ny, direction: getNewDirection(direction, { x: dx, y: dy }), turn }],
            direction: getNewDirection(direction, { x: dx, y: dy })
          });
        }
      }
    }

    setPath([]);
  };

  const getNewDirection = (currentDirection, movement) => {
    const movementDirection = {
      '1,0': 'right',
      '-1,0': 'left',
      '0,1': 'down',
      '0,-1': 'up'
    };

    const movementString = `${movement.x},${movement.y}`;
    return movementDirection[movementString];
  };

  useEffect(() => {
    let pathIndex = 0;

    const moveCar = () => {
      if (pathIndex < path.length) {
        const { x, y, direction, turn } = path[pathIndex];
        setCarPosition({ x, y });
        setCarDirection(direction);

        // Apply turn
        if (turn === 'left' || turn === 'right' || turn === 'around') {
          setTimeout(() => {
            setCarDirection(direction);
          }, 100); // Delay to simulate turn
        }

        pathIndex += 1;
      } else {
        setDestinationReached(true);
        clearInterval(interval);
      }
    };

    const interval = setInterval(moveCar, 200);
    return () => clearInterval(interval);
  }, [path]);

  useEffect(() => {
    if (destinationReached) {
      stopAnimation();
    }
  }, [destinationReached]);

  return (
    <div>
      
      <Maze
        grid={grid}
        carPosition={carPosition}
        carDirection={carDirection}
        endPosition={endPosition}
        onClick={onClickCell}
      />
<button className="large-button" onClick={startAnimation}>Start</button>
      <button className="large-button" onClick={stopAnimation}>Stop</button>
      {destinationReached && <p>FINISHED</p>}
    </div>
  );
};

export default MazeContainer;
