'use strict'

const WALL = 'WALL'
const AFTER_WALL = 'AFTER_WALL'
const FLOOR = 'FLOOR'
const BALL = 'BALL'
const GAMER = 'GAMER'
const GLUE = 'GLUE'

const GAMER_IMG = '<img src="img/gamer.png">'
const BALL_IMG = '<img src="img/ball.png">'
const GLUE_IMG = '<img src="img/candy.png">'
const GAMER_GLUE_IMG = '<img src="img/gamer-purple.png">'
// Model:
var gBoard
var gGamerPos
var gEatCounter = 0
var gBallLeftCounter = 2
var gInterval
var gIsGlue = false

function onInitGame() {
    gGamerPos = { i: 2, j: 9 }
    gBoard = buildBoard()
    renderBoard(gBoard)
    createRandomBall(gBoard)
    setInterval(() => addGlue(), 5000);
}

function buildBoard() {
    const board = []
    // DONE: Create the Matrix 10 * 12
    // DONE: Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < 10; i++) {
        board[i] = []
        for (var j = 0; j < 12; j++) {
            board[i][j] = { type: FLOOR, gameElement: null }
            if (i === 0 && j !== 5|| i === 9 && j !== 5|| j === 0 && i !== 4|| j === 11 && i !== 4) {
                board[i][j].type = WALL
            }
        }
    }

    // for (var i = 0; i < 12; i++) {
    //     board[i] = []
    //     for (var j = 0; j < 14; j++) {
    //         board[i][j] = { type: FLOOR, gameElement: null }
    //         if (i === 0 || i === 11 || j === 0 || j === 13) board[i][j].type = AFTER_WALL
    //         else if ((i === 1 && j !== 6) || (i === 10 && j !== 6) || (j === 1 && i !== 5) || (j === 12 && i !== 5)) {
    //             board[i][j].type = WALL
    //         }
    //     }
    // }
    // DONE: Place the gamer and two balls
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER
    board[5][5].gameElement = BALL
    board[7][2].gameElement = BALL

    console.log(board)
    return board
}

// Render the board to an HTML table
function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]

            var cellClass = getClassName({ i: i, j: j })
            // console.log('cellClass:', cellClass)

            if (currCell.type === FLOOR) cellClass += ' floor'
            else if (currCell.type === WALL) cellClass += ' wall'
            // else if (currCell.type === AFTER_WALL) cellClass += ' after-wall'

            strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i},${j})" >\n`

            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG
            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG
            }

            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function displayNeighbors(i,j){
    const elNearBallDisplay = document.querySelector('.nearBallsDisplay')
    var neighbors = countNeighbors(i, j, gBoard)
    elNearBallDisplay.innerHTML = neighbors;
}
// Move the player to a specific location
function moveTo(i, j) {
    if (gIsGlue) return;
    const iAbsDiff = Math.abs(i - gGamerPos.i)
    const jAbsDiff = Math.abs(j - gGamerPos.j)

    if (j === gBoard[0].length) j = 0
    else if (j === -1) j = gBoard[0].length - 1
    else if (i === gBoard.length) i = 0
    else if (i === -1) i = gBoard.length - 1

    console.log(i, j)
    var targetCell = gBoard[i][j]
    console.log(targetCell)
    

    if (targetCell.type === WALL) return

    // if (targetCell.type === AFTER_WALL) {
    //     gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
    //     renderCell(gGamerPos, '')
    //     const newPosition = portal(i, j)
    //     i = newPosition.i
    //     j = newPosition.j
    //     targetCell = gBoard[i][j]
    // }
    if (targetCell.gameElement === GLUE && !gIsGlue) {
        gIsGlue = true;     
        setTimeout(() => {
            (gIsGlue = false)
        }, 3000);
      }
      displayNeighbors(i,j)
    // Calculate distance to make sure we are moving to a neighbor cell
    

    // If the clicked Cell is one of the four allowed
    if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0) || (jAbsDiff === gBoard[0].length - 1) || (iAbsDiff === gBoard.length - 1)) {
        if (targetCell.gameElement === BALL) {
            gBallLeftCounter--
            if (gBallLeftCounter === 0) {
                console.log('victory')
                clearInterval(gInterval)
                var elButton = document.querySelector('.play-button')
                elButton.classList.remove('play-again')
            } else {
                gEatCounter++
                var elCounter = document.querySelector('.ball-counter')
                elCounter.innerHTML = gEatCounter
                PlaySound('eating-sound-effect-36186')
                console.log('Collecting!')
            }
        }

        // DONE: Move the gamer
        // REMOVING FROM
        // update Model
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
        // update DOM
        renderCell(gGamerPos, '')

        // ADD TO
        // update Model
        targetCell.gameElement = GAMER
        gGamerPos = { i, j }
        // update DOM
        renderCell(gGamerPos, GAMER_IMG)
    }
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location) // cell-i-j
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}

// Move the player by keyboard arrows
function onHandleKey(event) {
    const i = gGamerPos.i
    const j = gGamerPos.j
    console.log('event.key:', event)

    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1)
            break
        case 'ArrowRight':
            moveTo(i, j + 1)
            break
        case 'ArrowUp':
            moveTo(i - 1, j)
            break
        case 'ArrowDown':
            moveTo(i + 1, j)
            break
    }
}

// Returns the class name for a specific cell
function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

function findEmptyCell(board) {
    const emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].gameElement === null && board[i][j].type === FLOOR) {
                emptyCells.push({ i, j })
            }
        }
    }
    const randomNumIdx = getRandomInt(0, emptyCells.length)
    const randomNum = emptyCells[randomNumIdx]
    return randomNum
}

function createRandomBall(board) {
    gInterval = setInterval(() => {
        const emptyCell = findEmptyCell(board)
        board[emptyCell.i][emptyCell.j].gameElement = BALL
        renderCell(emptyCell, BALL_IMG)
        gBallLeftCounter++
    }, 3000)
}

function playAgain() {
    gEatCounter = 0
    gBallLeftCounter = 2
    var elCounter = document.querySelector('.ball-counter')
    var elButton = document.querySelector('.play-button')
    elButton.classList.add('play-again')
    elCounter.innerHTML = gEatCounter
    onInitGame()
}

function portal(i, j) {
    if (i === 0 && j === 6) {
        gGamerPos = { i: 11, j: 6 }
        return { i: 10, j: 6 }
    } else {
        if (i === 11 && j === 6) {
            gGamerPos = { i: 0, j: 6 }
            return { i: 1, j: 6 }
        } else {
            if (i === 5 && j === 13) {
                gGamerPos = { i: 5, j: 0 }
                return { i: 5, j: 1 }
            } else {
                if (i === 5 && j === 0) {
                    gGamerPos = { i: 5, j: 13 }
                    return { i: 5, j: 12 }
                } else {
                    gBoard[i][j]
                }
            }
        }
    }
}

function countNeighbors(cellI, cellJ, board) {  
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
        if (board[i][j].gameElement === BALL) {
          neighborsCount++;
        } 
      }
      
    }
    return neighborsCount;
  }

  function addGlue() {
    var emptyPos = findEmptyCell(gBoard);
    gBoard[emptyPos.i][emptyPos.j].gameElement = GLUE;
    renderCell(emptyPos, GLUE_IMG);
    setTimeout(() => {
      if (gBoard[emptyPos.i][emptyPos.j].gameElement !== GAMER) {
        gBoard[emptyPos.i][emptyPos.j].gameElement = null;
        renderCell(emptyPos, "");
      }
    }, 3000);
  }