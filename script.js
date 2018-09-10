var origBoard;
const HUMAN = "human";
const AI = "ai";
const numPlayers = 2;
const SCORE_TO_WIN = 10;
let currentTurn = 0;

class Player {
	constructor(pType, pieceColor) {
		this.pType = pType;
		this.pieceColor = pieceColor;
		this.score = 0;
	}
};
//construct players
let huPlayer = new Player(HUMAN,"blue");
let aiPlayer = new Player(AI,"red");
let players = [huPlayer,aiPlayer];

//define legal combos
const combo1 = [	//scores 1 point
	//3 in a row
	[0,1,2],
	[1,2,3],
	[4,5,6],
	[5,6,7],
	[8,9,10],
	[9,10,11],
	[12,13,14],
	[13,14,15],
	[0,4,8],
	[4,8,12],
	[1,5,9],
	[5,9,13],
	[2,6,10],
	[6,10,14],
	[3,7,11],
	[7,11,15]
]
const combo2 = [	//scores 2 points
	//diagonals
	[0,5,10,15],
	[3,6,9,12],
	//4 corners
	[0,3,12,15],
	//2x2 box
	[0,1,4,5],
	[1,2,5,6],
	[2,3,6,7],
	[4,5,8,9],
	[5,6,9,10],
	[6,7,10,11],
	[8,9,12,13],
	[9,10,13,14],
	[10,11,14,15]
]

// main
const cells = document.querySelectorAll('.cell');
startGame();

//start new game
function startGame() {
	players[0].score=players[1].score=0;
	currentTurn = 0;
	document.querySelector(".endgame").style.display = "none";
	document.getElementById("disp_current_player").className = "blue_piece";
	document.getElementById("disp_scores").innerText = players[0].score+" - "+players[1].score;
	origBoard = Array.from(Array(16).keys());
	for (var i = 0; i < cells.length; i++){
		cells[i].className = 'cell';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', tryMove, false)
	}
}

// make move
function tryMove(square) {
	if(currentTurn == 0) {square = square.target} //convert click object to html element
	let moveSuccess = false;
	if(document.getElementById(square.id).className == "cell"){
		move(square.id, players[currentTurn]);
		//change board border color ***
		currentTurn = (currentTurn+1)%numPlayers
		moveSuccess = true;
	}
	console.log(square.id)
	document.getElementById("disp_scores").innerText = players[0].score+" - "+players[1].score;
	if(players[currentTurn].pType == AI) {
		aiMove();
	}
	return moveSuccess;
}

// define move
function move(squareId, currentPlayer) {
	origBoard[squareId] = currentPlayer.pieceColor;
	currentTurn == 0 ? document.getElementById(squareId).className = "blue_piece" : document.getElementById(squareId).className = "red_piece"
	currentTurn == 1 ? document.getElementById("disp_current_player").className = "blue_piece" : document.getElementById("disp_current_player").className = "red_piece"
	let c = 0;
	let s = 0;
	[c, s] = checkCombo(origBoard, currentPlayer);
	currentPlayer.score += s;
	let gameWon = checkWin(players);
	if(gameWon > -1) {gameOver(gameWon)};
}

function aiMove() {
	tryMove(document.getElementById(Math.floor(Math.random() * 16)));
}

function checkWin(players){
	for(var i = 0; i < players.length; i++) {
		if(players[i].score > SCORE_TO_WIN) {return i}
	}
	return -1
}

function gameOver(gameWon) {
	document.querySelector(".endgame").innerText = players[gameWon].pType+" Wins!";
	document.querySelector(".endgame").style.display = "block";
}

//check if combos have been formed, apply points, clear cells
function checkCombo(board, currentPlayer) {
	let plays = board.reduce((a, e, i) => (e === currentPlayer.pieceColor) ? a.concat(i) : a, []);
	let addToScore = 0;
	let combo = null;
	for(let [index, win] of combo1.entries()) {
		if(win.every(elem => plays.indexOf(elem) > -1)) {
			addToScore++;
			for(var i = 0; i < combo1[index].length; i++ ) {
				origBoard[combo1[index][i]] = combo1[index][i];
				document.getElementById(combo1[index][i]).className = "cell"
				cells[combo1[index][i]].addEventListener('click', tryMove, false)
			}
		}
	}
	for(let [index, win] of combo2.entries()) {
		if(win.every(elem => plays.indexOf(elem) > -1)) {
			addToScore+=2;
			for(var i = 0; i < combo2[index].length; i++ ) {
				origBoard[combo2[index][i]] = combo2[index][i];
				document.getElementById(combo2[index][i]).className = "cell"
				cells[combo2[index][i]].addEventListener('click', tryMove, false)
			}
		}
	}
	let full_check = true;
	for (var i = 0; i < origBoard.length; i++) {
		if(origBoard[i] == i) {full_check = false}
	}
	if(full_check) {
		let opponentPlayer = new Player;
		currentPlayer.pType == HUMAN ? opponentPlayer = players[1] : opponentPlayer = players[0]
		for (var i = 0; i < origBoard.length; i++) {
			if(origBoard[i] == opponentPlayer.pieceColor) {
				origBoard[i] = i;
				document.getElementById(i).className = "cell"
				cells[i].addEventListener('click', tryMove, false)				
			}
		}		
	}

	return [combo, addToScore];
}
