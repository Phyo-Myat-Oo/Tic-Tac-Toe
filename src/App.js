import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function range(end) {
  return Array.from({ length: end }, (_, i) => i);
}

function Square({ value, onClick, hightlight }) {
  return (
    <button
      className={`square ${hightlight ? "hightlight" : ""}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, dimension, squares, NtoWin, onPlay, draw,setPosition  }) {
  const winner = calculateWinner(squares, dimension, NtoWin);

  function handleClick(row, col) {
    if (squares[row * dimension + col] || winner || draw) {
      return;
    }
    setPosition([row,col]);

    const newSquares = squares.slice();
    newSquares[row * dimension + col] = xIsNext ? "X" : "O";

    onPlay(newSquares);
  }
 let status;
    if(winner) status =`Winner is :${squares[winner[0]]}`
    else if(draw) status =`The game end up draw`
    else status =`Next player : ${xIsNext ? "X" : "O"}`;

  const hightlight = (index) => {
    if (winner) {
      return winner.includes(index);
    }
    return false;
  };

  return (
    <>
      <h3>{status}</h3>

      {range(dimension).map((rowIndex) => (
        <div key={rowIndex} className="board-row">
          {range(dimension).map((colIndex) => (
            <Square
              key={colIndex}
              value={squares[rowIndex * dimension + colIndex]}
              onClick={() => handleClick(rowIndex, colIndex)}
              hightlight={hightlight(rowIndex * dimension + colIndex)}
            />
          ))}
        </div>
      ))}
    </>
  );
}

function StartForm({ submithandler }) {
  return (
    <>
      <div className="d-flex justify-content-center">
        <form onSubmit={submithandler} className="w-50 ">
          <div className="input-group mb-3 w-100">
            <label htmlFor="dimension" className="input-group-text w-75">
              Select the number of dimension
            </label>
            <input
              className="form-control"
              name="dimension"
              id="dimension"
              type="number"
              min="2"
              max="20"
            ></input>
          </div>
          <div className="input-group mb-3 w-100">
            <label htmlFor="Ntowin" className="input-group-text w-75">
              Select the number of consecutive element to win
            </label>
            <input
              className="form-control"
              name="Ntowin"
              id="Ntowin"
              type="number"
              min="2"
              max="10"
            ></input>
          </div>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button className="btn btn-primary me-md-2" type="submit">
              Submit
            </button>
          </div>
          <br />
        </form>
      </div>
    </>
  );
}
export default function Game() {
  const [gameState, setGameState] = useState({
    dimension: 5,
    NtoWin: 3,
  });
  let dimension = gameState["dimension"];
  let NtoWin = gameState["NtoWin"];
  let defaulthistory = [Array(dimension * dimension).fill(null)];

  const [reverse, setReverse] = useState(false);
  const [startgame, setStartGame] = useState(false);
  const [history, setHistory] = useState(defaulthistory);
  const [currentMove, setCurrentMove] = useState(0);
  const [position,setPosition]=useState([[0,0]]);

  
  
  const draw=history.length===(dimension*dimension+1) ? true : false;
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  function handlePlay(newSquares) {
    const newHistory = [...history.slice(0, currentMove + 1), newSquares];
    setHistory(newHistory);
    setCurrentMove(newHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  const lastIndex = history.length - 1;
 
  const addPosition=(newposition)=>{
    setPosition((prevposition)=>{

      return [...prevposition,newposition];
    })
    
  }
  const moves = history.map((_squares, move) => {
    let description;
    let loc=position[move]

    if (reverse) {
      move = history.length - 1 - move;
    }
    if (move == lastIndex) {
      description = "You are currently at move #" + move     ;

    } else if (move > 0) {
      description = "Go to move #" + move + " Row : " +(loc[0]+1) +" Col :" +( loc[1]+1)  ;
    } else {
      description = "Go to game start move #0 "  ;
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const submithandler = (event) => {
    event.preventDefault();
    setGameState({
      dimension: event.target[0].value,
      NtoWin: event.target[1].value,
    });
    setStartGame(true);
    setHistory(defaulthistory);
    setCurrentMove(0);
  };

  
  return (
    <>
      <h2 className="d-flex justify-content-center">Tic-Tac-Too</h2>
      {startgame ? (
        <div className="game d-flex justify-content-center">
          <div className="game-board ">
            <Board
              xIsNext={xIsNext}
              dimension={dimension}
              squares={currentSquares}
              NtoWin={NtoWin}
              onPlay={handlePlay}
              draw={draw}
              setPosition={addPosition}
            />
          </div>
          <div className="game-info">
            <ol>
              <button
                onClick={() => {
                  setReverse(!reverse);
                }}
              >
                Reverse the list
              </button>
            </ol>
            <ol>{moves}</ol>
            <br></br>
            <ol>
              <button
                onClick={() => {
                  setStartGame(false);
                }}
              >
                Restart The game
              </button>
            </ol>
          </div>
        </div>
      ) : (
        <StartForm submithandler={submithandler} />
      )}
    </>
  );
}

function calculateWinner(squares, dimension, n) {
  const rows = dimension;
  const cols = dimension;
  if (!squares) {
    return null;
  }
  let connectedSequence = [];
  // Check rows
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols - n + 1; col++) {
      // 0 -> 6
      const symbol = squares[row * dimension + col];
      if (!symbol) continue;
      let connected = true;
      for (let k = 0; k < n; k++) {
        if (symbol === squares[row * dimension + col + k]) {
          connectedSequence.push(row * dimension + col + k);
        } else {
          connected = false;
          connectedSequence = [];
          break;
        }
      }
      if (connected) {
        return connectedSequence;
      }
    }
  }

  // Check columns
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows - n + 1; row++) {
      const symbol = squares[row * dimension + col];
      if (!symbol) continue;
      let connected = true;
      for (let k = 0; k < n; k++) {
        if (symbol === squares[(row + k) * dimension + col]) {
          connectedSequence.push((row + k) * dimension + col);
        } else {
          connected = false;
          connectedSequence = [];
          break;
        }
      }
      if (connected) {
        return connectedSequence;
      }
    }
  }

  // Check forward diagonals
  for (let row = 0; row < rows - n + 1; row++) {
    for (let col = 0; col < cols - n + 1; col++) {
      const symbol = squares[row * dimension + col];
      if (!symbol) continue;
      let connected = true;
      for (let k = 0; k < n; k++) {
        if (symbol === squares[(row + k) * dimension + col + k]) {
          connectedSequence.push((row + k) * dimension + col + k);
        } else {
          connected = false;
          connectedSequence = [];
          break;
        }
      }
      if (connected) {
        return connectedSequence;
      }
    }
  }

  // Check reverse diagonals
  for (let row = 0; row < rows - n + 1; row++) {
    for (let col = n - 1; col < cols; col++) {
      const symbol = squares[row * dimension + col];
      if (!symbol) continue;
      let connected = true;
      for (let k = 0; k < n; k++) {
        if (symbol === squares[(row + k) * dimension + col - k]) {
          connectedSequence.push((row + k) * dimension + col - k);
        } else {
          connected = false;
          connectedSequence = [];
          break;
        }
      }
      if (connected) {
        return connectedSequence;
      }
    }
  }

  return null;
}
