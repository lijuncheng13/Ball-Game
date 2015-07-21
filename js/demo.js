// game state
var gameState = {
	mainMenu: true,
	mainMenuPlay: false,
	mainMenuLoaded: false,
	playing: false,
	pause: false,
	courtsType: 1,
	quit: function() {
		this.mainMenu = true;
		this.MenuPlay = true;
		this.mainMenuPlay = false;
		this.mainMenuLoaded = false;
		this.playing = false;
	},
	startPlay: function() {
		this.mainMenuPlay = false;
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

// 4 kinds of courts
var courts = ["air", "water", "fire", "soil"];

// courts image
var courtsLoad = 0;
var courtsReady = false;
var courtsImage = new Array();
for (var i = 0; i < 4; i++) {
	courtsImage.push(new Image());
	courtsImage[i].src = "./images/" + courts[i] + ".jpg";
	courtsImage[i].onload = function () {
	courtsLoad++;
	if (courtsLoad == 4) {
		courtsReady = true;
	}
	};
}

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
var player1Locked = new Image();
player1Locked.src = "./images/hero1_locked.png";
var player1Tornado = [new Image(), new Image(), new Image(), new Image()];
for (var i = 0; i < 4; i++) {
	player1Tornado[i].src = "./images/tornado_hero1_" + i + ".png";
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
	id: 1,
	speed: 160,
	isMoving: false,
	count: 0,
	phase: 0, // 0 ~ 7
	x: 0,
	y: 0,
	w: 44,
	h: 90,
	xl: 0,
	xr: 40,
	yu: 7,
	yd: 90,
	id: 1,
	cd: 0,
	score: 0,
	locked: false,
	playerType: 1,
	skill1: skill1,
	skill2: skill2,
	wave: {
		x: 0,
		y: 0,
		length: 0,
		maxLength: 500,
		lastTime: 0,
		maxTime: 2000,
		img: new Image(),
		height: 20
	},
	hitCheck: playerhitCheck
};
player1.wave.img.src = "./images/wave.png";

var player2 = {
	id: 2,
	speed: 160,
	isMoving: false,
	count: 0,
	phase: 0, // 0 ~ 7
	x: 0,
	y: 0,
	w: 45,
	h: 92,
	xl: 7,
	xr: 44,
	yu: 7,
	yd: 92,
	id: 2,
	cd: 0,
	score: 0,
	locked: true,
	playerType: 1,
	hitCheck: playerhitCheck
};

var ball = {
	width: 16,
	height: 16,
	x: canvas.width / 2,
	y: canvas.height / 2,
	x_last: 0,
	y_last: 0,
	speed: 320,
	theta: Math.PI / 4.0, // degree
	hitCheck: hitCheck,
	adaptTheta: adaptTheta
};

var map = {
	x: 48,
	y: 94,
	width: 700,
	height: 276,
	xb: 32,
	yb: 32
};

// water skill 2
var icePillar1 = [];
icePillar1.push({ x: 46 + 2 * 18, y: (183 + 297) / 2.0 + 12, height: 0, width: 20, img: new Image() });
icePillar1.push({ x: 46 + 18, y: (183 + 297) / 2.0 - (297 - 183) / 4.0 + 12, height: 0, width: 20, img: new Image() });
icePillar1.push({ x: 46 + 18, y: (183 + 297) / 2.0 + (297 - 183) / 4.0 + 12, height: 0, width: 20, img: new Image() });
icePillar1.push({ x: 46, y: 183 + 12, height: 0, width: 20, img: new Image() });
icePillar1.push({ x: 46, y: 297 + 12, height: 0, width: 20, img: new Image() });
for (var i = 0; i < 5; i++) {
	icePillar1[i].img.src = "./images/ice_pillar.png";
};
var icePillar1State = {
	show: false,
	lastTime: 0,
	maxHeight: 50,
	stepLength: 400,
	fadeFactor: 2,
	fade: false
};

// air skill 1
var tornado1 = {
	active: false,
	caught: false,
	theta: 0,
	maxTheta: Math.PI / 3.0,
	direction: 1,
	angularSpeed: Math.PI / 1.5,
	phase: 0, // 0 ~ 3
	count: 0,
	arrow: new Image()
};
tornado1.arrow.src = "./images/tornado_arrow.png";

// air skill 2
var bubble = {
	x: 0,
	y: 0,
	height: 90,
	width: 30,
	img: new Image(),
	show: 0,
	maxShow: 600
};
bubble.img.src = "./images/bubble.png";

// fire skill 1
var fire_shield1 = {
	x: 0,
	y: 0,
	height: 120,
	width: 30,
	img: new Image(),
	show: 0,
	maxShow: 600
};
fire_shield1.img.src = "./images/fire_shield.png";

// fire skill 2
var fireWall = [];
fireWall.push({ x: canvas.width / 2 - 15, y: 235, height: 0, width: 40, img: new Image() });
fireWall.push({ x: canvas.width / 2 - 15, y: 235 - 75, height: 0, width: 40, img: new Image() });
fireWall.push({ x: canvas.width / 2 - 15, y: 235 + 75, height: 0, width: 40, img: new Image() });
fireWall.push({ x: canvas.width / 2 - 15, y: 235 - 150, height: 0, width: 40, img: new Image() });
fireWall.push({ x: canvas.width / 2 - 15, y: 235 + 150, height: 0, width: 40, img: new Image() });
for (var i = 0; i < 5; i++) {
	fireWall[i].img.src = "./images/fire_wall.png";
};
var fireWallState = {
	show: false,
	lastTime: 0,
	maxHeight: 120,
	stepLength: 500,
	fadeFactor: 2.5,
	fade: false
};

// soil skill 1
var instantReturn = {
	returning: 0,
	returnTime: 600,
	returnX: 50,
	returnY: 235 - 48
};

// soil skill 2

var deltax = new Array(-1, 1, 0, 0);
var deltay = new Array(0, 0, -1, 1);
var Door = {
	y0: 180, 
	y1: 296
};

var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
	if (e.keyCode == 19){
		gameState.pause = true;
	} else if (gameState.pause){
		gameState.pause = false;
	}
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game
var reset = function () {
	player1.x = canvas.width / 4 - player1.w;
	player1.y = map.y + map.height / 2 - player1.h;

	player2.x = canvas.width * 3 / 4;
	player2.y = map.y + map.height / 2 - player2.h;
	
	ball.x = canvas.width / 2;
	ball.y = map.y + map.height / 2;
};

//distance squared
function dist2(x1, y1, x2, y2){
	return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
}

// Update game objects
var update = function (modifier) {
	
	if (gameState.pause){//pause
		return;
	}
	
	if (27 in keysDown){//Quit Game
		gameState.quit();
		return;
	}

	// water skill 1
	if (player1.wave.lastTime > 0) {
		player1.wave.lastTime -= 1000 * modifier;
		player1.wave.x = player1.x + player1.w / 2.0;
		player1.wave.y = player1.y + (player1.h - player1.wave.height) / 2.0;
		if (player1.wave.lastTime > 3.0 / 5.0 * player1.wave.maxTime) {
			player1.wave.length = (player1.wave.maxTime - player1.wave.lastTime) / (2.0 / 5.0 * player1.wave.maxTime) * player1.wave.maxLength;
		}
		else if (player1.wave.lastTime < player1.wave.maxTime * 2.0 / 5.0) {
			player1.wave.length = player1.wave.lastTime / (2.0 / 5.0 * player1.wave.maxTime) * player1.wave.maxLength;	
		}
		else {
			player1.wave.length = player1.wave.maxLength;
		}

		if (player1.wave.x + player1.wave.length > player2.x && player1.wave.y + player1.wave.height > player2.y && player1.wave.y < player2.y + player2.h) {
			player2.cd = 50;
		}
	}
	else {
		player1.wave.length = 0;
	}

	// water skill 2
	if (icePillar1State.show) {
		if (189 in keysDown) {
			icePillar1State.lastTime += modifier * 1000;
		}
		else {
			icePillar1State.show = false;
			icePillar1State.fade = true;
		}
	}
	if (icePillar1State.fade) {
		icePillar1State.lastTime -= modifier * 1000 * icePillar1State.fadeFactor;
		if (icePillar1State.lastTime < 0) {
			icePillar1State.lastTime = 0;
			icePillar1State.fade = false;
		}
	}
	if (icePillar1State.lastTime < icePillar1State.stepLength) {
		icePillar1[0].height = icePillar1State.lastTime / icePillar1State.stepLength * icePillar1State.maxHeight;
	}
	else if (icePillar1State.lastTime < 2.0 * icePillar1State.stepLength) {
		icePillar1[0].height = icePillar1State.maxHeight;
		icePillar1[1].height = (icePillar1State.lastTime / icePillar1State.stepLength - 1) * icePillar1State.maxHeight;
		icePillar1[2].height = (icePillar1State.lastTime / icePillar1State.stepLength - 1) * icePillar1State.maxHeight;
	}
	else if (icePillar1State.lastTime < 3.0 * icePillar1State.stepLength) {
		icePillar1[0].height = icePillar1State.maxHeight;
		icePillar1[1].height = icePillar1State.maxHeight;
		icePillar1[2].height = icePillar1State.maxHeight;
		icePillar1[3].height = (icePillar1State.lastTime / icePillar1State.stepLength - 2) * icePillar1State.maxHeight;
		icePillar1[4].height = (icePillar1State.lastTime / icePillar1State.stepLength - 2) * icePillar1State.maxHeight;
	}
	else {
		icePillar1[0].height = icePillar1State.maxHeight;
		icePillar1[1].height = icePillar1State.maxHeight;
		icePillar1[2].height = icePillar1State.maxHeight;
		icePillar1[3].height = icePillar1State.maxHeight;
		icePillar1[4].height = icePillar1State.maxHeight;
	}

	// air skill 1
	if (tornado1.active) {
		if (187 in keysDown) {
			tornado1.theta += tornado1.direction * modifier * tornado1.angularSpeed;
			if (tornado1.theta * tornado1.direction > tornado1.maxTheta) {
				tornado1.direction = -tornado1.direction;
			}
			if (tornado1.caught ||
				dist2(player1.x + 0.5 * player1.w, player1.y + 0.5 * player1.h, ball.x + 0.5 * ball.width, ball.y + 0.5 * ball.height) < 1800) {
				ball.x = player1.x + player1.w - 0.5 * ball.width;
				ball.y = player1.y + 0.5 * player1.h - 0.5 * ball.height;
				tornado1.caught = true;
			}
		}
		else {
			if (tornado1.caught) {
				ball.theta = tornado1.theta;
			}
			tornado1.caught = false;
			tornado1.theta = 0;
			tornado1.active = false;
		}
	}

	// air skill 2
	bubble.show -= modifier * 1000;
	if (bubble.show < 0) {
		bubble.show = 0;
	}

	// fire skill 1
	fire_shield1.show -= modifier * 1000;
	if (fire_shield1.show < 0) {
		fire_shield1.show = 0;
	}

	// fire skill 2
	if (fireWallState.show) {
		if (189 in keysDown) {
			fireWallState.lastTime += modifier * 1000;
		}
		else {
			fireWallState.show = false;
			fireWallState.fade = true;
		}
	}
	if (fireWallState.fade) {
		fireWallState.lastTime -= modifier * 1000 * fireWallState.fadeFactor;
		if (fireWallState.lastTime < 0) {
			fireWallState.lastTime = 0;
			fireWallState.fade = false;
		}
	}
	if (fireWallState.lastTime < fireWallState.stepLength) {
		fireWall[0].height = fireWallState.lastTime / fireWallState.stepLength * fireWallState.maxHeight;
	}
	else if (fireWallState.lastTime < 2.0 * fireWallState.stepLength) {
		fireWall[0].height = fireWallState.maxHeight;
		fireWall[1].height = (fireWallState.lastTime / fireWallState.stepLength - 1) * fireWallState.maxHeight;
		fireWall[2].height = (fireWallState.lastTime / fireWallState.stepLength - 1) * fireWallState.maxHeight;
	}
	else if (fireWallState.lastTime < 3.0 * fireWallState.stepLength) {
		fireWall[0].height = fireWallState.maxHeight;
		fireWall[1].height = fireWallState.maxHeight;
		fireWall[2].height = fireWallState.maxHeight;
		fireWall[3].height = (fireWallState.lastTime / fireWallState.stepLength - 2) * fireWallState.maxHeight;
		fireWall[4].height = (fireWallState.lastTime / fireWallState.stepLength - 2) * fireWallState.maxHeight;
	}
	else {
		fireWall[0].height = fireWallState.maxHeight;
		fireWall[1].height = fireWallState.maxHeight;
		fireWall[2].height = fireWallState.maxHeight;
		fireWall[3].height = fireWallState.maxHeight;
		fireWall[4].height = fireWallState.maxHeight;
	}

	// soil skill 1
	if (instantReturn.returning > 0) {
		instantReturn.returning -= modifier * 1000;
		if (instantReturn.returning < 0) {
			instantReturn.returning = 0;
		}
		if (instantReturn.returning < instantReturn.returnTime / 2) {
			player1.x = instantReturn.returnX;
			player1.y = instantReturn.returnY;
		}
	}

	// soil skill 2
	
	// update the position of player1
	player1.isMoving = false;	
	if (player1.cd <= 0){//Player can move
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
	} else {
		player1.cd --;
	}
	player1.hitCheck();
	
	
	player2.isMoving = false;
	if (player2.cd <= 0){
	if (!player2.locked){
		if (87 in keysDown) { // Player walk up
			player2.y -= player2.speed * modifier;
			player2.isMoving = true;
		}
		if (83 in keysDown) { // Player walk down
			player2.y += player2.speed * modifier;
			player2.isMoving = true;
		}
		if (65 in keysDown) { // Player walk left
			player2.x -= player2.speed * modifier;
			player2.isMoving = true;
		}
		if (68 in keysDown) { // Player walk right
			player2.x += player2.speed * modifier;
			player2.isMoving = true;
		}
	}
	else {//using AI
		var tx = ball.x;
		var ty = ball.y;
		if (ball.x <= canvas.width / 2){//change target
			tx = canvas.width * 4 / 5;
			ty = canvas.height / 2;
		}
		var x0 = player2.x;
		var y0 = player2.y;
		var distMin = dist2(x0, y0, tx, ty);
		for (var i = 0; i < 4; i ++){
			var cx = x0 + player2.speed * modifier * deltax[i];
			var cy = y0 + player2.speed * modifier * deltay[i];
			var distNow = dist2(cx, cy, tx, ty);
			if (distNow - distMin < -0.1){
				distMin = distNow;
				player2.x = cx;
				player2.y = cy;
				player2.isMoving = true;
			}
		}
	}
	} else {
		player2.cd --;
	}
	player2.hitCheck();
	
	if (!tornado1.caught) {
		ball.x_last = ball.x;
		ball.y_last = ball.y;
		ball.x += ball.speed * Math.cos(ball.theta) * modifier;
		ball.y += ball.speed * Math.sin(ball.theta) * modifier;
		ball.adaptTheta();
	}

	if (13 in keysDown) { // Enter: reset
		reset();
	}

	if (187 in keysDown) { // skill 1
		player1.skill1();
	}

	if (189 in keysDown) { // skill 2
		player1.skill2();
	}
};

// skill 1
function skill1() {
	if (this.playerType === 1) { // water
		if (this.id === 1) {
			player1.wave.x = player1.x + player1.w / 2.0;
			player1.wave.y = player1.y + (player1.h - player1.wave.height) / 2.0;
			player1.wave.lastTime = player1.wave.maxTime;
		}
	}
	if (this.playerType === 0) { // air
		if (this.id === 1) {
			tornado1.active = true;
		}
	}
	if (this.playerType === 2) { // fire
		if (this.id === 1) {
			if (fire_shield1.show === 0) {
				fire_shield1.show = fire_shield1.maxShow;
				fire_shield1.x = Math.max(ball.x - 100, player1.x + player1.w);
				fire_shield1.y = ball.y + (ball.height - fire_shield1.height) / 2;
			}
		}
	}
	if (this.playerType === 3) { // soil
		if (this.id === 1) {
			instantReturn.returning = instantReturn.returnTime;
		}
	}
}

// skill 2
function skill2() {
	if (this.playerType === 1) { // water
		if (this.id === 1) {
			icePillar1State.show = true;
			icePillar1State.fade = false;
		}
	}
	if (this.playerType === 0) { // air
		var margin = 0;
		if (this.id === 1) {
			if (bubble.show === 0) {
				bubble.show = bubble.maxShow;
				bubble.x = player1.x + 200;
				if (player1.y + margin < ball.y && player1.y + 96 - margin > ball.y + ball.height && Math.cos(ball.theta) < 0) {
					ball.theta = Math.PI - ball.theta;
					bubble.x = ball.x + 30;
				}
				bubble.y = player1.y + margin;
			}
		}
	}
	if (this.playerType === 2) { // fire
		fireWallState.show = true;
		fireWallState.fade = false;
	}
	if (this.playerType === 3) { // soil
		
	}
}

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
	if (this.x < map.x) this.x = map.x;
	if (this.x + this.w > map.x + map.width) this.x = map.x + map.width - this.w;
	if (this.y < map.y - this.h) this.y = map.y - this.h;
	if (this.y + this.h > map.y + map.height) this.y = map.y + map.height - this.h;
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
		return true;
	}
	return false;
}

function Point(x, y) {
	return { x: x, y: y };
}

function hitfront(player){
	var y0 = (ball.y + ball.y_last) / 2;
	var yp = (player.y * 2 + player.yu + player.yd) / 2;
	var ratio = (y0 - yp) / player.h;
	ratio = ratio * ratio * 0.1;
	//if (y0 <= player.y + player.h / 7) ball.theta = (Math.PI / 2 + ball.theta) / 2;//top
	//	else if (y0 >= player.y + player.h * 6 / 7) ball.theta = (ball.theta - Math.PI / 2) / 2;//bottom
	//	else ball.theta += ratio * ball.theta;
}

function hitback(){
	ball.theta = Math.PI - ball.theta;
	/*if (ball.theta > 0){
		ball.theta = (ball.theta * 8 + Math.PI) / 10;
	} else {
		ball.theta = (ball.theta * 8 - Math.PI) / 10;
	}*/
}

function adaptTheta() {
	
	//border
	var e = 100;
	var xl = map.xb;
	if (this.hitCheck(Point(xl, -e), Point(xl, canvas.height + e))){//left
		if (this.y >= Door.y0 && this.y <= Door.y1){
			player2.score ++; reset(); return;
		}
	}
	xl = canvas.width - map.xb - this.width;
	if (this.hitCheck(Point(xl, canvas.height + e), Point(xl, -e))){//right
		if (this.y >= Door.y0 && this.y <= Door.y1){
			player1.score ++; reset(); return;
		}
	}
	this.hitCheck(Point(-e, map.yb), Point(canvas.width + e, map.yb));
	this.hitCheck(Point(canvas.width + e, canvas.height - this.height / 2), Point(-e, canvas.height - this.height / 2));
	
	var bx = this.x;
	var by = this.y;
	var bt = this.theta;
	
	//hit player1 front
	for (var i = 0; i < 4; i ++){
		var xi = player1.x + player1.xr - i;
		if (this.x_last >= xi && this.x <= xi && this.hitCheck(Point(xi, player1.y + player1.h), Point(xi, player1.y)))
			return;
	}
	
	if (this.hitCheck(Point(player1.x, player1.y), Point(player1.x + player1.w, player1.y))
		|| this.hitCheck(Point(player1.x, player1.y), Point(player1.x, player1.y + player1.h))
		|| this.hitCheck(Point(player1.x + player1.w, player1.y + player1.h), Point(player1.x, player1.y + player1.h))){
			this.x = bx;
			this.y = by;
			this.theta = bt;
			player1.cd = 40;
	}
	
	//hit player2 front
	for (var i = 0; i < 4; i ++){
		var xi = player2.x + player2.xl + i - ball.width;
		if (ball.x_last <= xi && ball.x >= xi && this.hitCheck(Point(xi, player2.y + player2.h), Point(xi, player2.y)))
			return;
	}
	if (this.hitCheck(Point(player2.x, player2.y), Point(player2.x + player2.w, player2.y))
		|| this.hitCheck(Point(player2.x + player2.w, player2.y + player2.h), Point(player2.x + player2.w, player2.y))
		|| this.hitCheck(Point(player2.x + player2.w, player2.y + player2.h), Point(player2.x, player2.y + player2.h))){
			this.x = bx;
			this.y = by;
			this.theta = bt;
			player2.cd = 40;
	}
	/*
	//player1
	//front
	for (var i = 0; i < 1; i ++){
		var xi = player1.x + player1.w - i;
		if (this.last_x >= xi && this.x <= xi && this.hitCheck(Point(xi, player1.y), Point(xi, player1.y + player1.h))){
			return;
		}
	}
	/*back
	for (var i = 0; i < 1; i ++){
		var xi = player1.x + player1.xl + i - this.width;
		if (this.hitCheck(Point(xi, player1.y + player1.yu), Point(xi, player1.y + player1.yd))){
			hitback(); player1.cd = 40; break;
		}
	}
	//up & down
	if (this.hitCheck(Point(player1.x, player1.y + player1.yu), Point(player1.x + player1.w, player1.y + player1.yu))
		|| this.hitCheck(Point(player1.x, player1.y + player1.yd), Point(player1.x + player1.w, player1.y + player1.yd))){
		ball = _ball; player1.cd = 40;
	}
	
	//player2
	//front
	for (var i = 0; i < 1; i ++){
		var xi = player2.x + player2.xl + i - this.width;
		if (this.last_x <= xi && this.x >= xi && this.hitCheck(Point(xi, player2.y), Point(xi, player2.y + player2.yd))){
			return;
		}
	}
	//back
	/*for (var i = 0; i < 1; i ++){
		var xi = player2.x + player2.xr - i;
		if (this.hitCheck(Point(xi, player2.y + player2.yu), Point(xi, player2.y + player2.yd))){
			hitback(); player2.cd = 40; break;
		}
	}
	//up & down
	if (this.hitCheck(Point(player2.x, player2.y + player2.yu), Point(player2.x + player2.w, player2.y + player2.yu))
		|| this.hitCheck(Point(player2.x, player2.y + player2.yd), Point(player2.x + player2.w, player2.y + player2.yd))){
		ball = _ball; player2.cd = 40;
	}*/
}

// Draw everything
var renderGame = function () {
	if (courtsReady) {
		ctx.drawImage(courtsImage[gameState.courtsType], 0, 0, canvas.width, canvas.height);
	}

	if (player1Ready) {
		if (player1.isMoving && player1.cd <= 0 && !tornado1.active) {
			player1.count++;
			player1.count %= 3;
			if (player1.count === 2) {
				player1.phase++;
				player1.phase %= 8;
			}
			ctx.drawImage(player1Image[player1.phase], player1.x, player1.y);
		}
		else {
			player1.phase = 0;
		}
		if (tornado1.active) { // air skill 1
			if (tornado1.caught) {
				ctx.drawImage(tornado1.arrow, ball.x + 30 * Math.cos(tornado1.theta), ball.y + 30 * Math.sin(tornado1.theta), ball.width, ball.height);
			}
			ctx.drawImage(player1Tornado[tornado1.phase], player1.x - 48, player1.y - 50);
			tornado1.count++;
			if (tornado1.count === 10) {
				tornado1.count = 0;
				tornado1.phase = (tornado1.phase + 1) % 4;
			}
		}
		else if (instantReturn.returning > 0) { // soil skill 1
			var tmp = instantReturn.returning / (instantReturn.returnTime / 2);
			if (instantReturn.returning < instantReturn.returnTime / 2) {
				ctx.drawImage(player1Image[0], 0, 0, 48, 96 * (1 - tmp), player1.x, player1.y + tmp * 96, 48, (1 - tmp) * 96);
			}
			else {
				tmp -= 1;
				ctx.drawImage(player1Image[0], 0, 0, 48, 96 * tmp, player1.x, player1.y + (1 - tmp) * 96, 48, tmp * 96);
			}
		}
		else if (player1.cd > 0) {
			ctx.drawImage(player1Locked, player1.x, player1.y);
		}
		else {
			ctx.drawImage(player1Image[player1.phase], player1.x, player1.y);
		}
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

	// ice pillars: water skill 2
	if (icePillar1State.show || icePillar1State.fade) {
		for (var i = 0; i < 5; i++) {
			ctx.drawImage(icePillar1[i].img, icePillar1[i].x, icePillar1[i].y - icePillar1[i].height, icePillar1[i].width, icePillar1[i].height);
		}
	}

	// wave: water skill 1
	if (player1.wave.length) {
		ctx.drawImage(player1.wave.img, player1.wave.x, player1.wave.y, player1.wave.length, player1.wave.height);
	}

	// bubble: air skill 2
	if (bubble.show > 0) {
		if (bubble.show > bubble.maxShow / 2.0) {
			var tmp = (bubble.maxShow - bubble.show) / (bubble.maxShow / 2);
			ctx.drawImage(bubble.img, 0, 0, 464, 800 * tmp, bubble.x, bubble.y, bubble.width, bubble.height * tmp);
		}
		else {
			var tmp = (bubble.maxShow / 2 - bubble.show) / (bubble.maxShow / 2);
			ctx.drawImage(bubble.img, 0, tmp * 800, 464, 800 * bubble.show / (bubble.maxShow / 2),
			bubble.x, bubble.y + tmp * bubble.height, bubble.width, (1 - tmp) * bubble.height);	
		}
	}

	// fire shield: fire skill 1
	if (fire_shield1.show > 0) {
		if (fire_shield1.show > fire_shield1.maxShow / 2.0) {
			var tmp = (fire_shield1.maxShow - fire_shield1.show) / (fire_shield1.maxShow / 2);
			ctx.drawImage(fire_shield1.img, 0, 0, 274, 416 * tmp, fire_shield1.x, fire_shield1.y, fire_shield1.width, fire_shield1.height * tmp);
		}
		else {
			var tmp = (fire_shield1.maxShow / 2 - fire_shield1.show) / (fire_shield1.maxShow / 2);
			ctx.drawImage(fire_shield1.img, 0, tmp * 416, 274, 416 * fire_shield1.show / (fire_shield1.maxShow / 2),
			fire_shield1.x, fire_shield1.y + tmp * fire_shield1.height, fire_shield1.width, (1 - tmp) * fire_shield1.height);	
		}
	}

	// fire wall: fire skill 2
	if (fireWallState.show || fireWallState.fade) {
		var order = [3, 1, 0, 2, 4];
		for (var i = 0; i < 5; i++) {
			ctx.drawImage(fireWall[order[i]].img, fireWall[order[i]].x, fireWall[order[i]].y - fireWall[order[i]].height,
				fireWall[order[i]].width, fireWall[order[i]].height);
		}
	}

	if (ballReady) {
		ctx.drawImage(ballImage, ball.x, ball.y, ball.width, ball.height);
	}

	ctx.font = 'bold 20px consolas';
    ctx.textAlign = 'left';
	ctx.textBaseline = 'top';
    ctx.strokeStyle = '#DF5326';
	ctx.strokeText('Score: ' + player1.score, 40, 30);
	ctx.strokeText('Score: ' + player2.score, canvas.width - 120, 30);
	
	if (gameState.pause){
		ctx.font = 'bold 32px consolas';
        ctx.strokeText('Pause', canvas.width / 2 - 45, map.y + map.height / 2 - 15);
	}

};

var renderMainMenu = function() {
	if (mainMenuBGReady) {
		if (!gameState.mainMenuPlay) {
			var mainMenuPlayButton = document.createElement("img");
			mainMenuPlayButton.className = "main_menu_play";
			mainMenuPlayButton.src = "./images/main_play.png";
			mainMenuPlayButton.onclick = function() {
				chooseCourts();
				//gameState.startPlay();
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

function chooseCourts() {
	var shadow = document.createElement("div");
	shadow.className = "shadow";
	container.appendChild(shadow);
	var chooseBox = document.createElement("div");
	chooseBox.id = "chooseCourts";
	shadow.appendChild(chooseBox);
	for (var i = 0; i < 4; i++) {
		var item = document.createElement("p");
		item.innerText = courts[i];
		var radio = document.createElement("input");
		radio.type = "radio";
		radio.name = "name";
		radio.id = "court_" + i;
		item.appendChild(radio);
		chooseBox.appendChild(item);
	}
	var img = document.createElement("img");
	img.id = "go_ahead";
	img.src = "./images/go_ahead.png";
	img.onclick = function() {
		for (var i = 0; i < 4; i++) {
			if ($("#court_" + i).attr("checked") === "checked") {
				gameState.courtsType = i;
				player1.playerType = i;
			}
		}
		$('.shadow').remove();
		gameState.startPlay();
	};
	chooseBox.appendChild(img);
}

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	if (delta < 0 || delta > 500) {
		delta = 500;
	}

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
