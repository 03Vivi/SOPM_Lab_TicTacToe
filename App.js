import { useState } from 'react';

// --- Componenta Pătrat (Square) ---
// Am adăugat props-ul 'isWinning' pentru a evidenția linia câștigătoare
function Square({ value, onSquareClick, isWinning }) {
  // Aplică clasa 'winning' dacă pătratul face parte din linia câștigătoare
  const className = `square ${isWinning ? 'winning' : ''}`;
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

// --- Componenta Tabla de Joc (Board) ---
// Am modificat-o să randeze pătratele folosind bucle
// și să trimită 'isWinning' către componenta Square
function Board({ xIsNext, squares, onPlay }) {
  // Alege caracterele noi
  const PLAYER_1 = '🌸'; // Floare de cireș
  const PLAYER_2 = '🌼'; // Margaretă

  function handleClick(i) {
    const { winner } = calculateWinner(squares); // Obține doar câștigătorul
    if (winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = PLAYER_1;
    } else {
      nextSquares[i] = PLAYER_2;
    }
    onPlay(nextSquares);
  }

  // Calculează câștigătorul și linia câștigătoare
  const { winner, line: winningLine } = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Câștigător: ' + winner;
  } else if (squares.every(Boolean)) {
    // Verifică dacă este egalitate
    status = 'Egalitate!';
  } else {
    // Afișează următorul jucător cu noile caractere
    status = 'Următorul jucător: ' + (xIsNext ? PLAYER_1 : PLAYER_2);
  }

  // Funcție pentru a randat un pătrat
  const renderSquare = (i) => {
    return (
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        // Verifică dacă indexul 'i' este în linia câștigătoare
        isWinning={winningLine.includes(i)}
      />
    );
  };

  // Creează tabla de joc folosind bucle
  const boardSize = 3;
  const boardRows = [];
  for (let row = 0; row < boardSize; row++) {
    const squaresInRow = [];
    for (let col = 0; col < boardSize; col++) {
      squaresInRow.push(renderSquare(row * boardSize + col));
    }
    boardRows.push(
      <div className="board-row" key={row}>
        {squaresInRow}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

// --- Componenta Principală (Game) ---
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

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
      description = 'Mergi la mutarea #' + move;
    } else {
      description = 'Mergi la începutul jocului';
    }

    // Verifică dacă acesta este butonul pentru mutarea curentă
    const isCurrentMove = move === currentMove;
    const buttonClassName = isCurrentMove ? 'current-move' : '';

    return (
      <li key={move}>
        <button className={buttonClassName} onClick={() => jumpTo(move)}>
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <h3>Istoric mutări</h3>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// --- Funcția de Calculare a Câștigătorului ---
// Acum returnează un obiect cu câștigătorul și linia
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // Returnează câștigătorul și linia
      return { winner: squares[a], line: lines[i] };
    }
  }
  // Returnează null și o linie goală dacă nu există câștigător
  return { winner: null, line: [] };
}
