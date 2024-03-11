var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var w = window.innerWidth - 50 || document.documentElement.clientWidth - 50 || document.body.clientWidth - 50;
var h = window.innerHeight - 50 || document.documentElement.clientHeight - 50 || document.body.clientHeight - 50;
canvas.width = w;
canvas.height = h;
canvas.style.left = (window.innerWidth - w)/2+'px';

if(window.innerHeight>h){
	canvas.style.top = (window.innerHeight - h)/2+'px';
}

var particles = [];
var particlesNum = 50;
var mx;
var my;

// Event listener to get the mouse position
window.addEventListener( 'mousemove', function(e) {
	var bounds = canvas.getBoundingClientRect();
	mx = e.clientX - bounds.left;
	my = e.clientY - bounds.top;
});

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
		if(i%2 == 0){
			color += letters[Math.floor(Math.random() * 15)];
		}else{
			color += letters[Math.floor(Math.random() * 16)];
		}
    }
    return color;
}

// This creates particles with randomized values for x & y coordinates, radius size, color, and how fast
function Factory(){  
	this.x = Math.random() * w;
	this.y = Math.random() * h;
	this.rad = Math.round( Math.random() * 7) + 5;
	this.rgba = getRandomColor();
	this.vx = Math.random() * 1;
	this.vy = Math.random() * 1;
}

function draw(){
	ctx.clearRect(0, 0, w, h);
	
	// loop through all the particles
	for(var i = 0;i < particlesNum; i++){
		var temp = particles[i];
		
		// Defines the color for filling and drawing lines.
		ctx.fillStyle = temp.rgba;
		ctx.strokeStyle = temp.rgba;
		
		var vx = 0;
		var vy = 0;
		for(var j=0; j<particlesNum; j++){
			if(i != j){
				var temp2 = particles[j];
				var dx = temp.x - temp2.x;
				var dy = temp.y - temp2.y;
				var d = dx * dx + dy * dy;
				
				var t = Math.atan2(dy, dx);
				var f = -0.003 * temp.rad * temp2.rad / Math.pow(d, 1/2);;
				
				if(Math.sqrt(d) < (temp.rad + temp2.rad)){
					f=0;
				}
				
				temp.vx += f * Math.cos(t);
				temp.vy += f * Math.sin(t);
			}
		}
		
		if(temp.vx > 5.5){
			temp.vx = 5.5;
		}
		
		if(temp.vy > 5.5){
			temp.vy = 5.5;
		}
		
		temp.x += temp.vx;
		temp.y += temp.vy;
		
		var margin = 35;
		
		if(temp.x > w + margin){
			temp.x = w + margin;
			temp.vx -= 2*temp.vx
		}
		
		if(temp.x < 0 - margin){
			temp.x = 0 - margin;
			temp.vx -= 2*temp.vx
		}
		
		if(temp.y > h + margin){
			temp.y = h + margin;
			temp.vy -= 2*temp.vy
		}
		
		if(temp.y < 0 - margin){
			temp.y = 0 - margin;
			temp.vy -= 2*temp.vy
		}
		
		// This is what draws the particle
		ctx.beginPath();	// Start drawing
		ctx.arc(temp.x, temp.y, temp.rad, 0, 2*Math.PI, true); 	
		ctx.fill();	// fills the arc
		ctx.closePath(); // stop drawing
		
		// Defines the color for filling and drawing lines.
		ctx.fillStyle = '#1111ee';
		ctx.strokeStyle = '#1111ee';
	}
}

// An api for doing recusive animation loops. Basically it optimizes things when it can
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
})();

// Create particles
(function init(){
	for(var i = 0; i < particlesNum; i++){
		particles.push(new Factory());
	}
	
	particles[particles.length-1].x = w/2; //particles.length-1
	particles[particles.length-1].y = h/2;
	particles[particles.length-1].rad = 32;
	particles[particles.length-1].rgba = '#000000';
	particles[particles.length-1].vx = 0;
	particles[particles.length-1].vy = 0;
})();

// The animation loop
(function loop(){
	draw();
	requestAnimFrame(loop);
})();