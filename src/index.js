const PIXI = require('pixi.js')
const { Grid } = require('./Grid')

PIXI.utils.sayHello();

var grid = new Grid();
var computerScore = 0;
var playerScore = 0;
var sound = true;
var myAudio = new Audio();

//loads all the images needed
const app = new PIXI.Application({
	width: 80 * (grid.NB_ROW + 1),
	height: 80 * grid.NB_COL,
	transparent: true,
	resolution: 1
})

var renderer = app.renderer;

app.loader
	.add("solo", "./assets/unity.png")
	.add("bluePointer", "./assets/blue-pointer.png")
	.add("blueCoin", "./assets/blue-coin.png")
	.add("redCoin", "./assets/red-coin.png")
	.load(setup);

document.getElementById('display').appendChild(renderer.view);

var stage = new PIXI.Container();
var play = [grid.NB_COL];
var board = [];

//function called every game
function setup() {

	//initialization of the sounds
	myAudio.src = './sounds/fond.mp3';
	myAudio.loop = true;

	myAudio.play();
	if (!sound) {
		myAudio.volume = 0;
	}

	//initialization of every button to play the game
	var x = 0;
	var y = 0;
	for (var i = 0; i < grid.NB_COL; i++) {
		play[i] = new PIXI.Sprite(
			app.loader.resources["bluePointer"].texture
		);
		play[i].alpha = 0.5;
		stage.addChild(play[i]);
		play[i].width = renderer.width / (grid.NB_COL);
		play[i].height = renderer.width / (grid.NB_COL);
		play[i].x = x;
		play[i].y = y;
		let j = i;

		//definition of the events
		play[i].interactive = true;
		play[i].buttonMode = true;
		play[i].mouseover = function (mouseData) {
			this.alpha = 1;
		}
		play[i].mouseout = function (mouseData) {
			this.alpha = 0.5;
		}
		play[i].on('pointerdown', function () {
			//player turn
			if (grid.canPlayThere(j)) {
				var row = grid.playThere(j, grid.Player);
				let coinBlue;
				coinBlue = new PIXI.Sprite(
					app.loader.resources["blueCoin"].texture
				);
				stage.addChild(coinBlue);
				coinBlue.width = renderer.width / (grid.NB_COL);
				coinBlue.height = renderer.width / (grid.NB_COL);
				coinBlue.x = this.x;
				coinBlue.y = (grid.NB_ROW - row) * renderer.width / (grid.NB_COL);
				//disable the button if the column is full
				if (!grid.canPlayThere(j)) {
					this.interactive = false;
					this.alpha = 0;
				}
				//tests if the player wins
				if (grid.winner() == grid.Player) {
					//stops the game
					for (var k = 0; k < grid.NB_COL; k++) {
						play[k].interactive = false;
					}
					play[j].alpha = 0.5;
					myAudio.pause();
					myAudio.loop = false;
					myAudio.currentTime = 0;
					myAudio.src = './sounds/victory.mp3';
					myAudio.play();
					playerScore++;
				} else {
					//computer turn
					var col = grid.bestPlayForComputer();
					row = grid.playThere(col, grid.Computer);
					let coinRed;
					coinRed = new PIXI.Sprite(
						app.loader.resources["redCoin"].texture
					);
					stage.addChild(coinRed);
					coinRed.width = renderer.width / (grid.NB_COL);
					coinRed.height = renderer.width / (grid.NB_COL);
					coinRed.x = play[col].x;
					coinRed.y = (grid.NB_ROW - row) * renderer.width / (grid.NB_COL);
					//disable the button if the column is full
					if (!grid.canPlayThere(col)) {
						play[col].interactive = false;
						play[col].alpha = 0;
					}
					//tests if the computer wins
					if (grid.winner() == grid.Computer) {
						//stops the game
						for (var k = 0; k < grid.NB_COL; k++) {
							play[k].interactive = false;
						}
						play[j].alpha = 0.5;
						computerScore++;
						myAudio.pause();
						myAudio.loop = false;
						myAudio.currentTime = 0;
						myAudio.src = './sounds/defeat.mp3';
						myAudio.play();
					}
				}
				//tests if the grid is full
				if (grid.full()) {
					console.log("Nobody wins");
					myAudio.pause();
					myAudio.loop = false;
					myAudio.currentTime = 0;
					myAudio.src = './sounds/draw.mp3';
					myAudio.play();
				}
			}

		});
		x += renderer.width / (grid.NB_COL);
	}

	//construction of the grid
	x = 0;
	y = renderer.width / (grid.NB_COL);
	for (var i = 0; i < grid.NB_COL; i++) {
		board[i] = [];
		for (var j = 0; j < grid.NB_ROW; j++) {
			board[i][j] = new PIXI.Sprite(
				app.loader.resources["solo"].texture
			);
			stage.addChild(board[i][j]);
			board[i][j].width = renderer.width / (grid.NB_COL);
			board[i][j].height = renderer.width / (grid.NB_COL);
			board[i][j].x = x;
			board[i][j].y = y;
			y += renderer.width / (grid.NB_COL);
		}
		y = renderer.width / (grid.NB_COL);
		x += renderer.width / (grid.NB_COL);
	}
	renderer.render(stage);
}

animate();


function animate() {
	requestAnimationFrame(animate);
	// render the root container
	renderer.render(stage);
};

function newGame() {
	//remove all the coins to start a new game
	grid = new Grid();
	play = [grid.NB_COL];
	board = [];
	for (var i = stage.children.length - 1; i >= 0; i--) {
		stage.removeChild(stage.children[i]);
	}
	myAudio.pause();
	myAudio.currentTime = 0;
	setup();
	document.getElementById("scoreDisplay").innerHTML = "Player " + playerScore + " - " + computerScore + " Computer";
};

function changeSound() {
	//allow to mute the sound effects
	if (sound == true) {
		sound = false;
		myAudio.volume = 0;
		document.getElementById("source-image").src = "./assets/mute.png";
	} else {
		sound = true;
		myAudio.volume = 1;
		document.getElementById("source-image").src = "./assets/sound.png";
	}
}

window.resetGame = newGame;
window.changeSound = changeSound;