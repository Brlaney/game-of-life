import React, { useState, useRef, useCallback } from 'react';
import produce from 'immer'
import './scss/App.scss';

let numRows = 38;
let numCols = 50;

interface Props {
  onChange: () => void;
}

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0))
  }

  return rows;
}


const App: React.FC = () => {
  // Declare state variables for number of rows, n
  // and number of columns, m. Set the initial state.
  const [n, setN] = useState(numRows);
  const [m, setM] = useState(numCols);

  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  function handleChange1 (event: number) {
    setN({value: event.target.value});
  }

  // function handleChange1(e: any) {
  //   setN(e);
  // }

  // function handleChange2(e: any) {
  //   setM(e);
  // }

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g => {
      return produce(g, (gridCopy: number[][]) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK]
              }
            })

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });
    setTimeout(runSimulation, 100);
  }, []);

  return (
    <>
      <div
        style={{
          padding: '0 0.33rem 0.66rem 0.33rem',
          margin: '0.22rem'
        }}
      >
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? 'stop' : 'start'}
        </button>
        <button
          onClick={() => {
            setGrid(generateEmptyGrid());
          }}
        >
          Clear
        </button>
        <button
          onClick={() => {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
              rows.push(
                Array.from(Array(numCols), () => (Math.random() > 0.8 ? 1 : 0))
              );
            }
            setGrid(rows);
          }}
        >
          Random
        </button>
        <input
          name='n'
          type='number'
          value={n}
          onChange={handleChange1}
        />
        <input
          name='m'
          type='number'
          value={m}
          onChange={handleChange2}
        />
      </div>
      <div
        style={{
          width: '100vw',
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 20px)`
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy: number[][]) => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "blue" : undefined,
                border: 'solid 1px black'
              }}
            />
          ))
        )}
      </div>
    </>
  );
}

export default App;
