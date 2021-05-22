
var width = 8;
var height = 8;
var bombCount = 1;
const bomb = '&#128163;';
var grid = [];

init();

function init() {
    buildBoard();
    placeBombs();
    renderBoard();
}

function buildBoard() {
    var id = 0;
    for (var row = 0; row < height; row++) {
        grid.push([]);
        for (var col = 0; col < width; col++) {
            var cell = {};
            grid[row].push(cell);
            grid[row][col].value = 0;
            grid[row][col].isOpened = false;
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function placeBombs() {

    for (var placedBombs = 0; placedBombs < bombCount;) {
        var tempRow = getRandomInt(0, height);
        var tempCol = getRandomInt(0, width);
        if (grid[tempRow][tempCol].value !== bomb) {
            grid[tempRow][tempCol].value = bomb;
            placedBombs++;
        } else {
            continue;
        }
        grid = adjNeighbourCount(tempRow, tempCol, grid);
    }
    return grid;
}

function adjNeighbourCount(tRow, tCol) {
    for (var nbrRow = (tRow - 1); nbrRow < tRow + 2; nbrRow++) {
        for (var nbrCol = (tCol - 1); nbrCol < tCol + 2; nbrCol++) {
            if ((nbrRow >= 0) && (nbrRow < height) &&
                (nbrCol >= 0) && (nbrCol < width) &&
                (grid[nbrRow][nbrCol].value !== bomb)) {
                grid[nbrRow][nbrCol].value++;
            } else {
                continue;
            }
        }
    }
    return grid;
}


function expandShown(clickedI, clickedJ) {
    for (var nbrRow = (clickedI - 1); nbrRow < clickedI + 2; nbrRow++) {
        for (var nbrCol = (clickedJ - 1); nbrCol < clickedJ + 2; nbrCol++) {
            if ((nbrRow >= 0) && (nbrRow < height) &&
                (nbrCol >= 0) && (nbrCol < width) &&
                (!grid[nbrRow][nbrCol].isOpened)) {
                if (grid[nbrRow][nbrCol].value !== 0) {
                    var elementID = 'cell-' + nbrRow + '-' + nbrCol;
                    var elementCell = document.getElementById(elementID)
                    onCellClicked(elementCell);
                    continue;
                } else if (grid[nbrRow][nbrCol].value === 0) {
                    grid[nbrRow][nbrCol].isOpened = true
                    expandShown(nbrRow, nbrCol);
                }
            }
        }
    }
}


function onCellClicked(elCell) {
    strCellId = elCell.getAttribute('id');
    console.log();
    var parts = strCellId.split('-');
    var i = +parts[1];
    var j = +parts[2];
    if (grid[i][j].value === bomb) {
        alert('GAME OVER!');
    }
    if (grid[i][j].isOpened) {
        return;
    } else {
        grid[i][j].isOpened = true;
    checkVictory();
        if (!grid[i][j].value) {
            elCell.innerHTML = '';
            expandShown(i, j);
            checkVictory();
        }
        elCell.innerHTML = grid[i][j].value;
    }
}

function renderBoard() {
    var strHtml = '';
    for (var i = 0; i < height; i++) {
        strHtml += '<tr>';
        for (var j = 0; j < width; j++) {
            if (!grid[i][j].isOpened) { var cell = ''; }
            else { var cell = grid[i][j].value; }
            var tdId = 'cell-' + i + '-' + j;
            strHtml += `<td id="${tdId}" onclick="onCellClicked(this)" class="cell">${cell}</td>`;
        }
        strHtml += '</tr>';
    }
    var elBoard = document.querySelector('.grid');
    elBoard.innerHTML = strHtml;
}

function checkVictory() {
    var count = 0;
    for (var row = 0; row < height; row++) {
        for (var col = 0; col < width; col++) {
            if ((grid[row][col].isOpened) && (grid[row][col].value !== bomb)) {
                count++;
                if (count === width * height - bombCount) {
                    alert('YOU WON!');
                }
            }
        }
    }
}