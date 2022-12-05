'use strict'

function PlaySound(sound) {
    var audio = new Audio('./sounds/' + sound + '.mp3')
    audio.play()
}

function boardNums(difficulty) {
    const nums = []
    for (var i = 1; i <= difficulty; i++) {
        nums.push(i)
    }
    return nums
}

function drawNum() {
    var randIdx = getRandomInt(0, gBoard.length)
    var num = gBoard[randIdx]
    gBoard.splice(randIdx, 1)
    return num
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

function createMat(ROWS, COLS) {
    const mat = []
    for (var i = 0; i < ROWS; i++) {
        const row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue

            if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE) neighborsCount++
        }
    }
    return neighborsCount
}