// game state
var gameState = {
	mainMenu: true,
	mainMenuPlay: false,
	mainMenuLoaded: false,
	playing: false,
	startPlay: function() {
		this.mainMenu = false;
		this.MenuPlay = false;
		this.mainMenuLoaded = false;
		this.playing = true;
		$(".main_menu_play").remove();
	}
};

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 805;
canvas.height = 375;
var container = document.getElementById("container");
container.appendChild(canvas);
container.style.width = canvas.width + 'px';
container.style.height = canvas.height + 'px';

// main menu background image
var mainMenuBGReady = false;
var mainMenuBGImage = new Image();
mainMenuBGImage.onload = function() {
	mainMenuBGReady = true;
};
mainMenuBGImage.src = "./images/main_bg.jpg";

// game background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "./images/water.jpg";

// player1 image
var player1Load = 0;
var player1Ready = false;
var player1Image = new Array();
for (var i = 0; i < 8; i++) {
	player1Image.push(new Image());
	player1Image[i].src = "./images/hero1_" + i + ".png";
	player1Image[i].onload = function () {
	player1Load++;
	if (player1Load == 8) {
		player1Ready = true;
	}
	};
}

// player2 image
var player2Load = 0;
var player2Ready = false;
var player2Image = new Array();
for (var i = 0; i < 8; i++) {
	player2Image.push(new Image());
	player2Image[i].src = "./images/hero2_" + i + ".png";
	player2Image[i].onload = function () {
	player2Load++;
	if (player2Load == 8) {
		player2Ready = true;
	}
	};
}

//ball image
var ballReady = false;
var ballImage = new Image();
ballImage.onload = function() {
	ballReady = true;
}
ballImage.src = "./images/ball.png";

// Game Objects
var player1 = {
	speed: 256,
	isMoving: false,
	count: 0,
	phase: 0, // 0 ~ 7
	x: 0,
	y: 0,
	w: 45,
	h: 90,
	id: 1,
	hitCheck: playerhitCheck
};

var player2 = {
	speed: 256,
	isMoving: false,
	count: 0,
	phase: 0, // 0 ~ 7
	x: 0,
	y: 0,
	w: 45,
	h: 90,
	id: 2,
	hitCheck: playerhitCheck
};

var ball = {
	width: 15,
	height: 15,
	x: canvas.width / 2,
	y: canvas.height / 2,
	x_last: 0,
	y_last: 0,
	speed: 256,
	theta: Math.PI / 4.0, // degree
	hitCheck: hitCheck,
	adaptTheta: adaptTheta
};

var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	player1.x = canvas.width / 4;
	player1.y = canvas.height / 2;

	player2.x = canvas.width * 3 / 4;
	player2.y = canvas.height / 2;
};

// Update game objects
var update = function (modifier) {
	player1.isMoving = false;
	if (38 in keysDown) { // Player walk up
		player1.y -= player1.speed * modifier;
		player1.isMoving = true;
	}
	if (40 in keysDown) { // Player walk down
		player1.y += player1.speed * modifier;
		player1.isMoving = true;
	}
	if (37 in keysDown) { // Player walk left
		player1.x -= player1.speed * modifier;
		player1.isMoving = true;
	}
	if (39 in keysDown) { // Player walk right
		player1.x += player1.speed * modifier;
		player1.isMoving = true;
	}
	player1.hitCheck();
	
	ball.x_last = ball.x;
	ball.y_last = ball.y;
	ball.x += ball.speed * Math.cos(ball.theta) * modifier;
	ball.y += ball.speed * Math.sin(ball.theta) * modifier;
	ball.adaptTheta();

	if (13 in keysDown) { // Enter: reset
		reset();
	}
};

//
function determinant(v1, v2, v3, v4)
{
	return (v1 * v4 - v2 * v3);
}

function determinant2(p1, p2, p0)
{
	return determinant(p1.x - p0.x, p2.x - p0.x, p1.y - p0.y, p2.y - p0.y);
}

function inregion(p1, p2, p0)
{
	return p0.x >= Math.min(p1.x, p2.x) && p0.x <= Math.max(p1.x, p2.x) 
		&& p0.y >= Math.min(p1.y, p2.y) && p0.y <= Math.max(p1.y, p2.y);
}

function intersect(aa, bb, cc, dd)
{
	var d1 = determinant2(cc, dd, aa);
	var d2 = determinant2(cc, dd, bb);
	var d3 = determinant2(aa, bb, cc);
	var d4 = determinant2(aa, bb, dd);
	if (d1 * d2 < 0 && d3 * d4 < 0)
		return true;
	if (Math.abs(d1) < 1e-7 && inregion(cc, dd, aa))
		return true;
	if (Math.abs(d2) < 1e-7 && inregion(cc, dd, bb))
		return true;
	if (Math.abs(d3) < 1e-7 && inregion(aa, bb, cc))
		return true;
	if (Math.abs(d4) < 1e-7 && inregion(aa, bb, dd))
		return true;
	return false;
}

function playerhitCheck(){
	//border
	if (this.x < 0) this.x = 0;
	if (this.x + this.w > canvas.width) this.x = canvas.width - this.w;
	if (this.y < 0) this.y = 0;
	if (this.y + this.h > canvas.height) this.y = canvas.height - this.h;
	//region
	if (this.id == 1){
		if (this.x + this.w > canvas.width / 2)
				this.x = canvas.width / 2 - this.w;
	}
	if (this.id == 2){
		if (this.x < canvas.width / 2)
				this.x = canvas.width / 2;
	}
}

function hitCheck(p1, p2) {
	if (intersect(p1, p2, this, { x: this.x_last, y: this.y_last })) {
		if (p1.x === p2.x) {
			this.x = 2 * p1.x - this.x;
			this.theta = Math.PI - this.theta;
		}
		if (p1.y === p2.y) {
			this.y = 2 * p1.y - this.y;
			this.theta = -this.theta;
		}
	}
}

function Point(x, y) {
	return { x: x, y: y };
}

function adaptTheta() {
	this.hitCheck(Point(0, 0), Point(0, canvas.height));
	this.hitCheck(Point(0, 0), Point(canvas.width, 0));
	this.hitCheck(Point(canvas.width, canvas.height), Point(0, canvas.height));
	this.hitCheck(Point(canvas.width, canvas.height), Point(canvas.width, 0));
}

// Draw everything when playing game
var renderGame = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
	}

	if (player1Ready) {
		if (player1.isMoving) {
			player1.count++;
			player1.count %= 3;
			if (player1.count === 2) {
				player1.phase++;
				player1.phase %= 8;
			}
		}
		else {
			player1.phase = 0;
		}
		ctx.drawImage(player1Image[player1.phase], player1.x, player1.y);
	}

	if (player2Ready) {
		if (player2.isMoving) {
			player2.count++;
			player2.count %= 3;
			if (player2.count === 2) {
				player2.phase++;
				player2.phase %= 8;
			}
		}
		else {
			player2.phase = 0;
		}
		ctx.drawImage(player2Image[player2.phase], player2.x, player2.y);
	}

	if (ballReady) {
		ctx.drawImage(ballImage, ball.x, ball.y, ball.width, ball.height);
	}
	
	if (19 in keysDown){
		alert("Pause");
	}
};

var renderMainMenu = function() {
	if (mainMenuBGReady) {
		if (!gameState.mainMenuPlay) {
			var mainMenuPlayButton = document.createElement("img");
			mainMenuPlayButton.className = "main_menu_play";
			mainMenuPlayButton.src = "./images/main_play.png";
			mainMenuPlayButton.onclick = function() {
				gameState.startPlay();
			};
			container.appendChild(mainMenuPlayButton);
			gameState.mainMenuPlay = true;
		}
		if (!gameState.mainMenuLoaded) {
			gameState.mainMenuLoaded = true;
			ctx.drawImage(mainMenuBGImage, 0, 0, canvas.width, canvas.height);
		}
	}
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	if (gameState.mainMenu) {
		renderMainMenu();
	}
	if (gameState.playing) {

		update(delta / 1000);
		renderGame();
	}

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
