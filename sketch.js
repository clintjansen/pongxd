var ball, player1, player2, wallLeft, wallRight, voidBottom, voidTop, startTimer;
var fontRegular, fontBold, letsCollect;
var player1Score = 0; player2Score = 0;
var colors = [];
var BASE_SPEED = 10;
var SPEED = BASE_SPEED;
var SIZE = 20;
var PLAYERWIDTH = 160;

function preload() {
	fontPong = loadFont("assets/visitor1.ttf");
/*	fontRegular = loadFont("assets/Montserrat-Regular.otf");
	fontBold = loadFont("assets/Montserrat-SemiBold.otf");*/
    letsCollect = loadImage("assets/lclogo.png");
}

function setup() {
	createCanvas(600, 850);
	colors = [ /*color("hsb(180, 90%, 78%)"), */color("hsb(46, 83%, 99%)"), color("hsb(330, 79%, 74%)"), color("hsb(205, 77%, 99%)") ];
	var uniqueColor = colors.splice(random(0, colors.length), 1);

	ball = createSprite(width/2, height/2, 30, 30);
	ball.setSpeed(BASE_SPEED, 90);
	//ball.maxSpeed = 60;

	wallLeft = createSprite(-15, height/2, 60, height);
	wallLeft.setCollider("rectangle", -70, 0, 200, height+600);
	wallLeft.immovable = true;
	wallRight = createSprite(width+15, height/2, 60, height+200);
	wallRight.setCollider("rectangle", 70, 0, 200, height+600);
	wallRight.immovable = true;

	voidTop = createSprite(width/2, -80, width, 200);
	voidTop.visible = false;
	voidBottom = createSprite(width/2, height+80, width, 200);
	voidBottom.visible = false;

	player1 = createSprite(width/2, height-50, 160, SIZE);
	player1.setCollider("rectangle", 0, 90, PLAYERWIDTH, 200);
	player1.immovable = true;

	player2 = createSprite(width/2, 50, 160, SIZE);
	player2.setCollider("rectangle", 0, -90, PLAYERWIDTH, 200);
	player2.immovable = true; 

	wallLeft.shapeColor = wallRight.shapeColor = uniqueColor[0];
	ball.shapeColor = player1.shapeColor = player2.shapeColor = random(colors);
}

function draw() {
	background(255);
	letsCollectBG((player1.position.x/55)+width/2-10, height/2);

	player1.position.x = constrain(mouseX, player1.width/2+15, width-player1.width/2-15);
	player2.position.x = constrain(ball.position.x, player1.width/2+15, width-player1.width/2-15);

	let swing
	if (ball.bounce(player1)) {
		swing = (ball.position.x-player1.position.x)/3;
		ball.setSpeed(SPEED, ball.getDirection()+swing);
		SPEED++;
	}
	if (ball.bounce(player2)) {
		swing = (ball.position.x-player2.position.x)/3;
		ball.setSpeed(SPEED, ball.getDirection()-swing);
		SPEED++;
	}

	ball.bounce(wallRight);
	ball.bounce(wallLeft);


	dashedLine();
	scoreBoard();
	resetBall();

	//debug();

	drawSprites(); 
}


function mousePressed() {
	SPEED += 1;
	ball.setSpeed(SPEED, ball.getDirection()+2);
}


function resetBall() {
	let timerSet = false;
	if (!timerSet && (ball.overlap(voidBottom) || ball.overlap(voidTop))) {
		if (ball.overlap(voidBottom)) {
			ball.immovable = true;
			ball.setSpeed(BASE_SPEED, 90);
		}
		if (ball.overlap(voidTop)) {
			ball.immovable = true;
			ball.setSpeed(BASE_SPEED, -90);
		}
		startTimer = frameCount;
		timerSet = true;
	}
	if (ball.position.y > height && (frameCount - startTimer) > 100) {
		ball.immovable = false;
		ball.position.x = width/2;
		ball.position.y = height/2;
		ball.setSpeed(BASE_SPEED, 90);
		SPEED = BASE_SPEED;	
		startTimer = 0;
		timerSet = false;
		player2Score++;
	}
	if (ball.position.y < 0 && (frameCount - startTimer) > 100) {
		ball.immovable = false;
		ball.position.x = width/2;
		ball.position.y = height/2;
		ball.setSpeed(BASE_SPEED, -90);
		SPEED = BASE_SPEED;
		startTimer = 0;
		timerSet = false;
		player1Score++;
	}
}


function scoreBoard() {
	push();
	fill(wallLeft.shapeColor);
	translate(46, 385);
    textFont(fontPong);
    stroke(wallLeft.shapeColor);
    strokeWeight(2);
    textSize(80);
    text("" + player1Score, 0, 0);
    translate(0, 118);
    text("" + player2Score, 0, 0);
	pop();
}


function dashedLine() {
	let x1 = 0;
	let y1 = height/2;
	let x2 = width; 
	let y2 = y1;
	let lines = floor(width/14);
	push();
	strokeCap(SQUARE);
	strokeWeight(SIZE/2);
	translate(10, 0);
	for (var i = 0; i < 20; i++) {
		stroke(wallLeft.shapeColor);
		line(0, y1, lines/2, y2)
		translate(lines+1, 0);
	}
	pop();
}


function letsCollectBG(x, y, w, h) {
	w = w || letsCollect.width; h = h || letsCollect.height;
	push();
	imageMode(CENTER);
	rectMode(CENTER);
	noStroke();
	translate(x, y);
	image(letsCollect, 0, 0, w, h);
	fill(255, 160);
	rect(0, 0, w, h);
	pop();
}

function debug() {
	push();
    fill(0);
    translate(60, 200);
    text("velocity Y:" + round(ball.velocity.y), 0, 0);
    translate(0, 20);
    text("velocity X:" + round(ball.velocity.x), 0, 0);
    translate(0, 20);
    text("speed:" + SPEED, 0, 0);
    pop();
}