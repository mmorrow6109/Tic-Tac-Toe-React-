import { useState } from 'react'

import Player from './components/Player.jsx'
import GameBoard from './components/GameBoard.jsx'
import Log from './components/Log.jsx'
import GameOver from './components/GameOver.jsx'
import { WINNING_COMBOS } from './components/winning-combos.js'

const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2'
};

const INITIAL_GAME_BOARD = [
  [null, null, null], 
  [null, null, null], 
  [null, null, null],
];

//helper function.  Used to determine the active player without managing the activePlayer state.
function derivedActivePlayer(gameTurns){
  let currentPlayer = 'X';

  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O';
  }

  return currentPlayer;
}

function deriveGameBoard(gameTurns) {
  //this is DERIVED STATE. gameBoard is a computed value derived from the [gameTurns] state.  Manage as little state as possible.  This is a best practice.
  let gameBoard = [...INITIAL_GAME_BOARD.map(array => [...array])]; //this is a deep copy of the initialGameBoard

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;
  
    gameBoard[row][col] = player;
  }
  return gameBoard;
}

function deriveWinner(gameBoard, players) {
  let winner;

  for (const combo of WINNING_COMBOS) {
    const firstSquareSymbol = gameBoard[combo[0].row][combo[0].column];
    const secondSquareSymbol = gameBoard[combo[1].row][combo[1].column];
    const thirdSquareSymbol = gameBoard[combo[2].row][combo[2].column];

    if (
      firstSquareSymbol && 
      firstSquareSymbol === secondSquareSymbol && 
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
    }
  }

  return winner;
}  

function App() {
  const [ players, setPlayers ] = useState({PLAYERS});
  const [gameTurns, setGameTurns] = useState([]);

  const activePlayer = derivedActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;
  
  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns(prevTurns => {
     const currentPlayer = derivedActivePlayer(prevTurns);

      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer }, ...prevTurns
      ];

      return updatedTurns;
    });
  }

  function handleRestart() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers(prevPlayers => {
      return {
        ...prevPlayers,
        [symbol]: newName
      };
    });
  }

  return <main>
      <div id='game-container'>
        <ol id='players' className='highlight-player'>
          <Player initialName={PLAYERS.X} 
          symbol='X' 
          isActive={activePlayer === 'X'} 
          onChangeName={handlePlayerNameChange}
          />
          <Player initialName={PLAYERS.O} 
          symbol='O' 
          isActive={activePlayer === 'O'}
          onChangeName={handlePlayerNameChange} 
          />               
        </ol>
        {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
        <GameBoard 
          onSelectSquare={handleSelectSquare}
          board={gameBoard}
        />
      </div>
      <Log turns={gameTurns} />
    </main>  
}

export default App
