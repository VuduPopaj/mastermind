import React, { useEffect, useState } from "react";
import Colors from "./Colors";
import Pegs from "./Pegs";

function Game() {
  // rows, boje i pravila igre sa pdf-a

  const maxRows = 10;
  const colors = ["red", "blue", "yellow", "green", "orange", "purple"];
  const defaultColor = "white";
  const rules =
    "Try to guess the color pattern, in both order and color, within ten turns. After submitting a row, a small green squared is shown for each circle in a correct position and color. A yellow square indicates the existence of a correct color in an incorrect position.";
  // const link = https://en.wikipedia.org/wiki/Mastermind_(board_game)#Gameplay_and_rules
  //states za board, potez, poruku, state za array koji pointa na maxRows, state za provjeru ukoliko je player pogodio pattern, state za pattern, state za boju
  const [board, setBoard] = useState(null);
  const [gameCode, setGameCode] = useState(null);
  const [turn, setTurn] = useState(0);
  // state za hint boxes
  //   const [hintYellow, setHintYellow] = useState('yellow')
  //   const [hintGreen, setHintGreen] = useState('yellow')

  const [selectedColor, setSelectedColor] = useState("red");
  const [evaluation, setEvaluation] = useState(Array(maxRows).fill([]));
  const [message, setMessage] = useState(null);

  //useEffect koji se okida na prvom renderu. Dependency komentar - pogledati klip profesora Sulejmana

  //   useEffect(() => {
  //     createNewGame();
  //   }, [createNewGame()]);  //dependency komentar? react-hooks/exhaustive-deps

  useEffect(() => {
    createNewGame();
  }, []);

  //func. za newgame i intro poruka
  const createNewGame = () => {
    setBoard(createNewBoard(defaultColor));
    setGameCode(createNewGameCode(colors));
    setTurn(0);
    setEvaluation(Array(maxRows).fill([]));

    setMessage("Try to solve the color pattern.");
  };

  // func. za novi color pattern i kopija arraya -  for petlja za loop kroz 4 boje

  const createNewGameCode = (colors) => {
    let tmp = colors.slice(colors);
    let code = [];

    for (let i = 0; i < 4; i++) {
      let index = Math.floor(Math.random() * tmp.length);
      let removed = tmp.splice(index, 1);
      code.push(removed[0]);
    }
    return code;
  };

  // win func + poruka
  const handleGameWon = () => {
    setTurn(maxRows);

    setMessage("You won!");
  };

  // game over + poruka + koji je pattern
  const handleGameOver = () => {
    setTurn(maxRows);

    setMessage("Game over! Solution was: " + gameCode.join(", "));
  };

  // func za pattern

  const showSolution = () => {
    const code = gameCode ? gameCode.join(", ") : "Create a new game first!";
    setMessage("The solution is: " + code);
  };

  // rules poruka

  //   const showHowToPlay = () => {
  //     const msg = "https://en.wikipedia.org/wiki/Mastermind_(board_game)";
  //     setMessage(msg);
  // }
  const showHowToPlay = () => {
    const msg = rules;
    setMessage(msg);
  };

  // provjera pegs po redu
  const updateEvaluation = (currentRow) => {
    const guess = board ? board[currentRow] : [];

    setEvaluation((evaluation) => {
      evaluation[currentRow] = evaluateGuess(guess);

      return evaluation;
    });
  };

  const evaluateGuess = (guess) => {
    let evaluation = [];

    if (guess.includes(defaultColor)) {
      setMessage("You must select a color for all pegs!");
      return [];
    }

    // for each metoda za svaki element niza
    //mdn webdocs

    guess.forEach((peg, key) => {
      if (gameCode.join(",") === guess.join(",")) {
        evaluation.push("red");
      } else {
        if (gameCode.includes(peg)) {
          if (gameCode.indexOf(peg) === key) {
            evaluation.push("green");
          } else {
            evaluation.push("yellow");
          }
        }
      }
    });

    //mdn webdocs
    if (gameCode.join(",") === guess.join(",")) {
      handleGameWon();
      return evaluation;
    }

    evaluation.sort();

    const newTurn = turn + 1;
    if (newTurn >= maxRows) {
      handleGameOver();
    } else {
      setTurn(newTurn);
    }
    return evaluation;
  };

  const createNewBoard = (defaultColor) => {
    const board = [];

    for (let i = 0; i < maxRows; i++) {
      var row = [defaultColor, defaultColor, defaultColor, defaultColor];
      board.push(row);
    }
    return board;
  };

  const updateBoardColor = (rowNum, pegPos) => {
    setBoard((board) => {
      const newBoard = board.slice();

      const currentRow = newBoard[rowNum];
      const colorPos = currentRow.indexOf(selectedColor);

      if (colorPos >= 0 && colorPos !== pegPos) {
        const selectedPegColor = currentRow[pegPos];

        currentRow[pegPos] = selectedColor;

        currentRow[colorPos] = selectedPegColor;
      } else {
        currentRow[pegPos] = selectedColor;
      }

      return newBoard;
    });
  };

  const updateSelectedColor = (color) => {
    setSelectedColor(color);
  };

  const isRowDisabled = (rowNum) => {
    return turn !== rowNum;
  };

  const renderRow = (rowNum) => {
    const row = [];

    const boardRow = board ? board[rowNum] : [];

    const pegs = [];
    for (let pegPos = 0; pegPos < 4; pegPos++) {
      const color = boardRow[pegPos];

      //mdn webdocs
      pegs.push(
        <button
          key={pegPos}
          value={color}
          className={"btn-peg btn-" + color}
          onClick={() => updateBoardColor(rowNum, pegPos)}
        />
      );
    }
    row.push(pegs);

    row.push(
      <button
        key={"btn" + row}
        className={"btn-confirm"}
        onClick={() => updateEvaluation(rowNum)}
      >
        Check
      </button>
    );
    row.push(<Pegs key={"key" + row} keyPegs={evaluation[rowNum]} />);

    return row;
  };

  const renderBoard = () => {
    const board = [];

    for (let rowNum = 0; rowNum < maxRows; rowNum++) {
      const isDisabled = isRowDisabled(rowNum) ? " disabled" : "";

      const row = (
        <div key={rowNum} className={"row" + isDisabled}>
          {renderRow(rowNum)}
        </div>
      );
      board.push(row);
    }
    return board;
  };
  // tri button-a, solution, new game, rules
  return (
    <div className="App">
      <h1>MASTERMIND</h1>
      <div className={"top"}>
        <button onClick={createNewGame}>Play Again</button>
        <button onClick={showSolution}>Show Solution</button>
        <button onClick={showHowToPlay}>Rules</button>
      </div>
      <div className={"messages"}>
        <h3>{message}</h3>
      </div>
      <div className={"center"}>
        <Colors colors={colors} updateSelectedColor={updateSelectedColor} />
        <div className={"board"}>{renderBoard()}</div>
      </div>
    </div>
  );
}

export default Game;
