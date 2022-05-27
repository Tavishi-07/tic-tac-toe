"use strict";

const Player = (sign) => {
    this.sign = sign;
    const getSign = () => {
        return sign;
    };
    return {getSign};
};

const gameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];
    const setField = (index, sign) => {
        if (index>board.length) return;
        board [index] = sign;
    };
    const getField = (index) => {
        if (index>board.length) return;
        return board[index];
    };
    const reset = () => {
        for(let i=0; i<board.length; i++) {
        board[i]="";
        }
    };
    return {setField, getField, reset};
})();


const displayController = (() => {
    const fieldElements = document.querySelectorAll(".field");
    const msgElement = document.getElementById("msg");
    const restartBtn = document.getElementById("restart-btn");

    fieldElements.forEach((field) =>
        field.addEventListener("click",(e) => {
            if (gameController.getIsOver() || e.target.textContent!=="") return;
            gameController.playRound(parseInt(e.target.dataset.index));
            updateGameboard();
        })
    );
    restartBtn.addEventListener("click",(e) => {
        gameBoard.reset();
        gameController.reset();
        updateGameboard();
        setMsgElement("Player X's turn");
    });
    const updateGameboard = () => {
        for (let i=0; i<fieldElements.length; i++) {
            fieldElements[i].textContent = gameBoard.getField(i);
        }
    };
    const setResultMsg = (winner) => {
        if (winner==="Draw") {
            setMsgElement("It's a draw");
        }
        else {
            setMsgElement(`Player ${winner} has won`);
        }
    };
    const setMsgElement = (msg) => {
        msgElement.textContent=msg;
    };

    return{setResultMsg, setMsgElement};
})();

const gameController = (() => {
    const playerX = Player("X");
    const playerO = Player("O");
    let round = 1;
    let isOver = false;

    const playRound = (fieldIndex) => {
        gameBoard.setField(fieldIndex, getCurrentPlayerSign());
        if (checkWinner(fieldIndex)) {
            displayController.setResultMsg(getCurrentPlayerSign());
            isOver = true;
            return;
        }
        if (round===9) {
            displayController.setResultMsg("Draw");
            isOver = true;
            return;
        }
        round++
        displayController.setMsgElement(`Player ${getCurrentPlayerSign()}'s turn`);
    };

    const getCurrentPlayerSign = () => {
        return round%2===1 ? playerX.getSign() : playerO.getSign();
    };

    const checkWinner = (fieldIndex) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        return winConditions
        .filter((combination) => combination.includes(fieldIndex))
        .some((possibleCombination) =>
          possibleCombination.every(
            (index) => gameBoard.getField(index) === getCurrentPlayerSign()
          )
        );
    };

    const getIsOver = () => {
        return isOver;
    };

    const reset = () => {
        round = 1;
        isOver = false;
    };

    return {playRound, getIsOver, reset};
})();
