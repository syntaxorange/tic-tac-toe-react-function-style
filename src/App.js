import { useState } from 'react';

const boardSize = 3;

function Square({value, onSquareClick, id, highlight}) {
  return (
    <button  className={`square ${highlight ? 'square-won' : ''}`} onClick={onSquareClick} id={id}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const { winner, indexes } = calculateWinner(squares) || {};
  const draw = squares.every(v => v);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (draw) {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  function getSquareKey(row, square) {
    return row * boardSize + square;
  }

  function renderSquares() {
    return Array(boardSize).fill(null).map((v, row) => {
      return (
        <div className="board-row" key={row}>
          {Array(boardSize).fill(null).map((v, square) => {
            return <Square 
              highlight={indexes && indexes.some(v => v === getSquareKey(row, square))}
              value={squares[getSquareKey(row, square)]} 
              onSquareClick={() => handleClick(getSquareKey(row, square))}
              id={getSquareKey(row, square)}
              key={getSquareKey(row, square)} />
          })}
        </div>
      );
    })
  }
  return (
    <>
      <div className="status">{status}</div>
      {renderSquares()}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isAsc, setIsAsc] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      if (move === currentMove) {
        description = 'You are at move #' + move;
      } else {
        description = 'Go to move #' + move;
      }
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        {move !== currentMove 
          ? <button onClick={() => jumpTo(move)}>{description}</button> 
          : description}
      </li>
    )
  });

  function handleSortingClick() {
    setIsAsc(!isAsc);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button type="button" onClick={handleSortingClick}>{isAsc ? 'desc' : 'asc'}</button>
        <ol>{isAsc ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        indexes: [a, b, c]
      };
    }
  }
  return null;
}