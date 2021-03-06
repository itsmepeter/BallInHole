//"use strict";

window.onload = init;

var winW, winH;
var ball;
var gat;
var mouseDownInsideball;
var touchDownInsideball;
var movementTimer;
var lastMouse, lastOrientation, lastTouch;
var radius;

//timer
var start = 0;
var pause = 1;
var reset = 0;
var counter;
var ms = 0;

function starttimer(){
	counter=setInterval(timer, 1000); 
	start = 1;
	pause = 0;
	reset = 0;
}

function pausetimer(){
	clearInterval(counter);
	pause = 1;
	start = 0;
	reset = 0;
}

function resettimer(){
	start = 0;
	pause = 1;
	reset = 1;
	ms = 0;
	ball.x = winW/2;
	ball.y = winH/2;
	clearInterval(counter);
	document.getElementById("timer").innerHTML=ms + " secs";
	renderBall();
}

function timer()
{
  ms=ms+1;
  document.getElementById("timer").innerHTML=ms + " secs"; 
} 

function checkBalInHole(){
	if(ball.x > gat.x - 10 && ball.x < gat.x + 10 && ball.y > gat.y - 10 && ball.y < gat.y + 10 ){
	alert("je hebt gewonnen");
	initialiseerGat();
	resettimer();
	renderBall();
	pausetimer();
	}
}

function initialiseerGat(){
	gat = {	radius:radius+10,
			x:Math.random()*winW ,
			y:Math.random() * winH,
			color:'rgba(0, 0, 0, 255)'};
	//gat alleen binnen het veld laten door botsing te checken
	if (gat.x > winW - (radius+10)) {
	    gat.x = winW - (radius+10);
	} else if (gat.x < (radius+10)) {
	    gat.x = radius+10;
	}
	if (gat.y > winH - (winH*0.20-(radius+10)) - 2*(radius+10)) {
	    gat.y = winH - (winH*0.20-(radius+2)) - 2*(radius +10);
	} else if (gat.y < radius+10) {
	    gat.y = radius+10;
	}
}



// Initialisation on opening of the window
function init() {
	
	lastOrientation = {};
	window.addEventListener('resize', doLayout, false);
	document.body.addEventListener('mousemove', onMouseMove, false);
	document.body.addEventListener('mousedown', onMouseDown, false);
	document.body.addEventListener('mouseup', onMouseUp, false);
	document.body.addEventListener('touchmove', onTouchMove, false);
	document.body.addEventListener('touchstart', onTouchDown, false);
	document.body.addEventListener('touchend', onTouchUp, false);
	window.addEventListener('deviceorientation', deviceOrientationTest, false);
	lastMouse = {x:0, y:0};
	lastTouch = {x:0, y:0};
	mouseDownInsideball = false;
	touchDownInsideball = false;
	doLayout(document);
}

// Does the gyroscope or accelerometer actually work?
function deviceOrientationTest(event) {
	window.removeEventListener('deviceorientation', deviceOrientationTest);
	window.addEventListener('deviceorientation', onDeviceOrientationChange, false);
	movementTimer = setInterval(onRenderUpdate, 10); 
	//if (event.beta != null && event.gamma != null) {
		//alert(event.beta + " " + event.gamma);  
		//window.addEventListener('deviceorientation', onDeviceOrientationChange, false);

	//}
}



function doLayout(event) {
	winW = document.getElementById('middle').clientWidth;
	winH = document.getElementById('middle').clientHeight;
	var surface = document.getElementById('surface');
	surface.width = winW;
	surface.height = winH;
	radius = 50;
	ball = {	radius:radius,
				x:Math.round(winW/2),
				y:Math.round(winH/2),
				color:'rgba(255, 0, 0, 255)'};
	
	initialiseerGat();
	renderBall();

}



function renderBall() {
		var surface = document.getElementById('surface');
		var context = surface.getContext('2d');
		context.clearRect(0, 0, surface.width, surface.height);
		
		context.beginPath();
		context.arc(gat.x, gat.y, gat.radius, 0, 2 * Math.PI, false);
		context.fillStyle = gat.color;
		context.fill();
		context.lineWidth = 1;
		context.strokeStyle = gat.color;
		context.stroke();	

		context.beginPath();
		context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
		context.fillStyle = ball.color;
		context.fill();
		context.lineWidth = 1;
		context.strokeStyle = ball.color;
		context.stroke();		
} 

function onRenderUpdate(event) {
		if(pause == 0){ 
		var xDelta, yDelta;
		switch (window.orientation) {
			case 0: // portrait - normal
				xDelta = lastOrientation.gamma;
				yDelta = lastOrientation.beta;
				break;
			case 180: // portrait - upside down
				xDelta = lastOrientation.gamma * -1;
				yDelta = lastOrientation.beta * -1;
				break;
			case 90: // landscape - bottom right
				xDelta = lastOrientation.beta;
				yDelta = lastOrientation.gamma * -1;
				break;
			case -90: // landscape - bottom left
				xDelta = lastOrientation.beta * -1;
				yDelta = lastOrientation.gamma;
				break;
			default:
				xDelta = lastOrientation.gamma;
				yDelta = lastOrientation.beta;
		}
		
		moveBall(xDelta, yDelta);


	

	}		
}


function moveBall(xDelta, yDelta) {

	ball.x += xDelta;
	ball.y += yDelta;
	//check voor muur
	if (ball.x > winW - radius) {
	    ball.x = winW - radius;
	} else if (ball.x < radius) {
	    ball.x = radius;
	}
	if (ball.y > winH - radius) {
	    ball.y = winH - radius;
	} else if (ball.y < radius) {
	    ball.y = radius;
	}

    renderBall();

	checkBalInHole();

}


function onMouseMove(event) {
	if(mouseDownInsideball){
		var xDelta, yDelta;
		xDelta = event.clientX - lastMouse.x;
		yDelta = event.clientY - lastMouse.y;
		moveBall(xDelta, yDelta);
		lastMouse.x = event.clientX;
		lastMouse.y = event.clientY;
	}
}

function onMouseDown(event) {
	var x = event.clientX;
	var y = event.clientY;
	if(	x > ball.x - ball.radius &&
		x < ball.x + ball.radius &&
		y > ball.y - ball.radius &&
		y < ball.y + ball.radius){
		mouseDownInsideball = true;
		lastMouse.x = x;
		lastMouse.y = y;
	} else {
		mouseDownInsideball = false;
	}
} 

function onMouseUp(event) {
	mouseDownInsideball = false;
}

function onTouchMove(event) {
	event.preventDefault();	
	if(touchDownInsideball){
		var touches = event.changedTouches;
		var xav = 0;
		var yav = 0;
		for (var i=0; i < touches.length; i++) {
			var x = touches[i].pageX;
			var y =	touches[i].pageY;
			xav += x;
			yav += y;
		}
		xav /= touches.length;
		yav /= touches.length;
		var xDelta, yDelta;

		xDelta = xav - lastTouch.x;
		yDelta = yav - lastTouch.y;
		moveBall(xDelta, yDelta);
		lastTouch.x = xav;
		lastTouch.y = yav;
	}
}

function onTouchDown(event) {
	
	//event.preventDefault();
	touchDownInsideball = false;
	var touches = event.changedTouches;
	for (var i=0; i < touches.length && !touchDownInsideball; i++) {
		var x = touches[i].pageX;
		var y = touches[i].pageY;
		if(	x > ball.x - ball.radius &&
			x < ball.x + ball.radius &&
			y > ball.y - ball.radius &&
			y < ball.y + ball.radius){
			touchDownInsideball = true;		
			lastTouch.x = x;
			lastTouch.y = y;			
		}
	}
	
} 


function onTouchUp(event) {
	touchDownInsideball = false;
}

function onDeviceOrientationChange(event) {
	lastOrientation.gamma = event.gamma;	
	lastOrientation.beta = event.beta;
}