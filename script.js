////////////////////////////////////////////////////////////////////////////// Game works, looks ugly, but works /////////////////////////////// 

const players = (function () {                                   ///////////// players object made using IIFE 
    function createPlayer (token) {
        let name = ""
        let score = 0
        const increaseScore = () => score++
        const getScore = () => score
        const resetScore = () => score = 0
        return {name,token,increaseScore,getScore,resetScore}    
    }
    const one = createPlayer("X")
    const two = createPlayer("O")
    return {one,two}    
})();

(function buttonControl() {                                      ///////////// ugly, this regulates what all the buttons do
    const buttons = document.querySelector(".button-container")
    let mode = ""
    buttons.addEventListener("click", event => {
        if (event.target.className === "single-player" && mode !== "Singleplayer") {
            if (mode === ""){
                players.one.name = "Human"
                players.two.name = "Computer"
                addButtons()
                addScoreboard(players.one.name,players.two.name)
            }else if (mode === "Multiplayer") {
                resetBoard()
                players.one.name = "Human"
                players.two.name = "Computer"
                players.one.token = "X"
                players.two.token = "O" 
                resetScoreboard()  
            }
            mode = "Singleplayer"
            gameFlow(["","","","","","","","",""])
        }else if (event.target.className === "multi-player" && mode !== "Multiplayer") {
            if (mode === ""){
                players.one.name = "Player 1"
                players.two.name = "Player 2"
                addButtons()
                addScoreboard(players.one.name,players.two.name)
            }else if (mode === "Singleplayer") {
                resetBoard()
                players.one.name = "Player 1"
                players.two.name = "Player 2"
                resetScoreboard()   
            }
            mode = "Multiplayer"
            gameFlowMP(["","","","","","","","",""],"X")
            
        }else if (event.target.className === "reset-board") {
            if (mode === "Singleplayer") {
                resetBoard()
                gameFlow(["","","","","","","","",""])
            }else if (mode === "Multiplayer") {
                resetBoard()
                gameFlowMP(["","","","","","","","",""],"X")
            }
        }else if (event.target.className === "reset-score") {
            resetScoreboard(players.one.name,players.two.name)
        }else if (event.target.className === "change-names") {
            const playerOneNew = document.querySelector("#player-one-input")
            players.one.name = playerOneNew.value
            const playerTwoNew = document.querySelector("#player-two-input")
            players.two.name = playerTwoNew.value
            updateDisplay()

        }else if (event.target.className === "change-tokens" && mode === "Multiplayer") {
            players.one.token = switchTokens(players.one.token)
            players.two.token = switchTokens(players.two.token)
            updateDisplay()
        }
    })
})();
function updateDisplay () {
    const player = document.querySelector(".player-one")
    player.textContent = `(${players.one.token})${players.one.name}: ${players.one.getScore()}`
    const secondPlayer = document.querySelector(".player-two")
    secondPlayer.textContent = `(${players.two.token})${players.two.name}: ${players.two.getScore()}`    
};

function resetScoreboard () {
    players.one.resetScore()
    players.two.resetScore()
    updateDisplay()
};

function resetBoard() {
    const board = document.querySelector(".board")
    const body = document.querySelector("body")
    if (body.childElementCount > 4) {
        const winner = document.querySelector(".winner")
        winner.remove()
        }
    board.remove()    
};

function addButtons() {
    const body = document.querySelector("body")
    const buttons = document.querySelector(".button-container")

    const resetBoard = document.createElement("button")
    resetBoard.className = "reset-board"
    resetBoard.textContent = "Reset Board"
    const resetScore = document.createElement("button")
    resetScore.className = "reset-score"
    resetScore.textContent = "Reset Score"
    const playerOneInput = document.createElement("input")
    playerOneInput.placeholder = players.one.name
    playerOneInput.id = "player-one-input"
    const playerTwoInput = document.createElement("input")
    playerTwoInput.placeholder = players.two.name
    playerTwoInput.id = "player-two-input"
    const changeNames = document.createElement("button")
    changeNames.className = "change-names"
    changeNames.textContent = "Change Names"
    const changeTokens = document.createElement("button")
    changeTokens.className = "change-tokens"
    changeTokens.textContent = "Change Tokens(MP)"

    buttons.append(resetBoard,resetScore,changeNames,changeTokens,playerOneInput,playerTwoInput )
    body.append(buttons)  
};

function addScoreboard(player1,player2) {                       ///////////// makes the SCOREBOARD in the DOM  
    const body = document.querySelector("body")
    const scoreBoard = document.createElement("div")
    scoreBoard.className = "score"
    const player = document.createElement("div")
    player.className = "player-one"
    player.textContent = `(${players.one.token})${player1}: ${players.one.getScore()}`
    const secondPlayer = document.createElement("div")
    secondPlayer.className = "player-two"
    secondPlayer.textContent = `(${players.two.token})${player2}: ${players.two.getScore()}`
    scoreBoard.append(player,secondPlayer)
    body.append(scoreBoard) 
};

function displayBoard(array) {                                  ///////////// makes the board in the DOM  
    const body = document.querySelector("body")                
    const board = document.createElement("div")
    board.className = "board"
    let index = 0
    array.forEach(element => {
        const block = document.createElement("div")
        block.className = "block"
        block.id = index
        block.textContent = `${element}`
        board.append(block)
        index ++

    });
    body.append(board)
};

function displayWin(winnerArray) {                              ///////////// declares winner and highlights the winning fields
    winnerArray.slice(0,3).forEach(element => {
        const block = document.getElementById(`${element}`)
        block.className = "blue"
    })
    const body = document.querySelector("body")
    const winner = document.createElement("div")
    winner.className = "winner"
    winner.textContent = `The winner is: ${winnerArray[3]}`
    body.append(winner)
    updateScore(winnerArray[3])
    updateDisplay()
    
};

function updateScore(token) {                                   ///////////// invoked by displayWin(), updates the players object
    if (players.one.token === token) {
        players.one.increaseScore()
    }else {
        players.two.increaseScore()
    }
};

function checkWinner(array,token) {                             ///////////// simple algorhitm - 8 different solutions
    if (array[0] === token) {
        if (array[1] === token && array[2] === token) {
            return [true,0,1,2,token]
        }else if (array[3] === token && array[6] === token) {
            return [true,0,3,6,token]
        }else if (array[4] === token && array[8] === token) {
            return [true,0,4,8,token]
        }
    }if (array[1] === token && array[4] === token && array[7] === token ) {
        return [true,1,4,7,token]
    }if (array[2] === token) {
        if (array[4] === token && array[6] === token) {
            return [true,2,4,6,token]
        }else if (array[5] === token && array[8] === token) {
            return [true,2,5,8,token]
        }
    }if (array[3] === token && array[4] === token && array[5] === token ) {
        return [true,3,4,5,token]
    }if (array[6] === token && array[7] === token && array[8] === token ) {
        return [true,6,7,8,token]
    }
    return [false]
};

///////////////////////////////////////////////////////////////////////////// SINGLEPLAYER //////////////////////////////////////////////////////

function gameFlow (array) {                                     ///////////// the whole flow -SINGLEPLAYER-
    const winnerX = checkWinner(array,"X")
    if (winnerX[0] === true) {                                           /// 1.Check for x victory -loop ends -
        displayBoard(array)
        displayWin(winnerX.slice(1))
    }else if (array.indexOf("O") === -1 && array.indexOf("X") === -1 ) { /// 2. check if the board is empty - starts the loop
        displayBoard(array)
        singlePlayerTurn(array)
    }else if (array.indexOf("") > -1) {                                  /// 3. check if there are empty fields - continues the loop 
        array = makeAiTurn(array)
        displayBoard(array)
        const winnerO = checkWinner(array,"O")
        if (winnerO[0] === true) {                                       /// 3a. check for o victory -loop ends
            displayWin(winnerO.slice(1))
        }else {
            singlePlayerTurn(array)
        }
    }else {                                                              //// if the board is full, it gets displayed game is tied -loop ends
        displayBoard(array)
    }
};

function singlePlayerTurn(array) {                              ///////////// player selects field, than board is removed - continues the loop
    const board = document.querySelector(".board")
    board.addEventListener("click", event => {
        if (event.target.textContent === "") {
            array[event.target.id] = "X"
            board.remove()
            gameFlow(array)
        }
    })
};

function makeAiTurn (array) {                                   ///////////// simple recursion - AI is not very smart
    let = randomNumber = Math.floor(Math.random()* (8 - 0 + 1)) + 0;
    console.log(randomNumber)
    return array[randomNumber] === "" ? array.toSpliced(randomNumber, 1 , "O") : makeAiTurn(array)
};

///////////////////////////////////////////////////////////////////////////// MULTIPLAYER //////////////////////////////////////////////////////

function gameFlowMP (array,token) {
    const winner = checkWinner(array,token)
    if (winner[0] === true) {                                           /// 1.Check for  victory -loop ends -
        displayBoard(array)
        displayWin(winner.slice(1))
    }else if (array.indexOf("O") === -1 && array.indexOf("X") === -1 ){
        displayBoard(array)
        multiPlayerTurn(array,token)
    }else if (array.indexOf("") > -1) {
        displayBoard(array)
        multiPlayerTurn(array,switchTokens(token))
    }else {
        displayBoard(array)
    }
};

function switchTokens(token) {
    return token === "X" ? "O" : "X"
};

function multiPlayerTurn (array,token) {
    const board = document.querySelector(".board")
    board.addEventListener("click", event => {
        if (event.target.textContent === "") {
            array[event.target.id] = token
            board.remove()
            gameFlowMP(array,token)
        }
    })
};