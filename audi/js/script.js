// Hide those circles that should not be seen
var visible = [[1, 2],		
	       [1, 2]];

var coordinates = ['0, 0, 0',
		   '-39.4, 5, -38'];

var manualLocation = ['100, 150', '120, 70'];

// Image object and its basic function
var imgObj = new Image();
imgObj.onload = function() {
	$('#sky').attr('src', imgObj.src);
};

createMap();

function createMap() {
	for (var i = 0; i < coordinates.length; i++) {
		var loc = manualLocation[i].split(', ');
		var newElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		newElement.setAttribute('cx', loc[0]);
		newElement.setAttribute('cy', loc[1]);
		newElement.setAttribute('r', 5);
		newElement.setAttribute('class', 'circles');
		newElement.setAttribute('id', 'circle' + (i + 1));
		newElement.setAttribute('name', (i + 1));
		document.getElementById('map').appendChild(newElement);
	}
}

// , 0.5Interacting with map
$('body').on('click', '.circles', function() {
	count = parseInt($(this).attr('name'));
	relocate();
});

// Make circles
$(document).ready(function() {
	var path = '';
	for (var i = 1; i < coordinates.length + 1; i++) {
		$('#spheres').append('<a-sphere id="sphere' + i + '" class="sphere" name="' + i + '" radius="2" color="green" transparent=true opacity="0.8" position="' + coordinates[i - 1] + '"></a-sphere>');
		if (i > 1) path += ',';
		path += coordinates[i - 1];
	}
	relocate();
});

// Master function of switching scenes
function relocate() {
	zoomBack();
	$('#sky').attr('src', '#img' + count);
	$('#sky, #camera').attr('position', coordinates[count - 1]);
	console.log(count + " loaded");
	// map display handling
	$('.activeCircle').removeClass('activeCircle');
	$('#circle' + count).addClass('activeCircle');
	// visibility handling
	$('.sphere').attr('opacity', 0);
	$('.active').removeClass('active');
	visible[count - 1].forEach(function(num) {
		$('#sphere' + num).attr('opacity', '0.8');
		$('#sphere' + num).addClass('active');
	});
	// Adjust scene orientation
	switch(count) {
		case 1: $('a-sky').attr('rotation', '0 136 0'); break;
		case 2: $('a-sky').attr('rotation', '0 136 0'); break;
	}
	if (imgObj.src.indexOf('L'))
		imgObj.src = 'img/' + count + '.jpg';
}

var count = 1;
var keylog = 2;

var interval = 0.1;
var gap = 0.01;
var loop = interval / gap;

// Press > or < to switch forward or backward
$('body').on('keyup', function(e) {
	if (e.keyCode == 190 && count < 2) {
		count++;
		console.log('Count = ' + count);
		relocate();
	} else if (e.keyCode == 188 && count > 1) {
		count--;
		relocate();
	} else if (e.keyCode == 67) {
		console.log($('#camera').attr('rotation'));;
	}
});

// Zoom in and out
$('body').on('keydown', function(e) {
	console.log(e.keyCode);
	var psn = $('#camera').attr('position');
	var rtn = $('#camera').attr('rotation');
	var va = parseFloat(rtn.x) / 180 * Math.PI; // Vertical Angle
	var ha = parseFloat(rtn.y) / 180 * Math.PI; // Horizontal Angle
	var levelLength = 35 * Math.cos(va);
	if (e.keyCode == 87 && keylog > 0) {
		$('.active').addClass('zoommode');
		$('.active').attr('opacity', 0);
		var X = -levelLength * Math.sin(ha) + psn.x;
		var Z = -levelLength * Math.cos(ha) + psn.z;
		var Y = 30 * Math.sin(va);
		console.log('ha: ' + ha + 'cos(ha): ' + Math.cos(ha));
		$('#camera').attr('position', X + ', ' + Y + ', ' + Z);
		keylog--; 
	} else if (e.keyCode == 83 && keylog < 2) {
		zoomBack();
	}
});

function zoomBack() {
	$('.zoommode').removeClass('zoommode');
	$('.active').attr('opacity', 0.5);
	keylog = 2;
	$('#camera').attr('position', coordinates[count - 1]);
}

// Assistant function in determining coordinations
/*
$('body').on('keydown', function(e) {
	var pos = $('#text').attr('position');
	var rot = $('#text').attr('rotation');
	var x = parseFloat(pos.x);
	var y = parseFloat(pos.y);
	var z = parseFloat(pos.z);
	var r = parseFloat(rot.y);
	switch (e.keyCode) {
		case 38: z -= 0.1; break;
		case 40: z += 0.1; break;
		case 37: x -= 0.1; break;
		case 39: x += 0.1; break;
		case 87: y += 0.1; break;
		case 83: y -= 0.1; break;
		case 65: r += 1; break;
		case 68: r -= 1;
	}
	var newPos = x + ' ' + y + ' ' + z;
	var newRot = rot.x + ' ' + r + ' ' + rot.z;
	console.log("new pos: " + newPos);
	console.log("new rot: " + newRot);
	$('#text').attr('position', newPos);
	$('#text').attr('rotation', newRot);
});
*/

// Interaction with the circles, with switching effect
$('body').on('click', '.sphere.active:not(.zoommode)', function() {
	var name = $(this).attr('name');
	console.log('Jump to site ' + name);
	count = parseInt(name);
	console.log('Count name = ' + count);
	var pos = $(this).attr('position');
	var cpos = $('#camera').attr('position');
	var x = parseFloat(cpos.x);
	var z = parseFloat(cpos.z);
	var gx = parseFloat(pos.x) - x;
	var gz = parseFloat(pos.z) - z;
	var dx = gx / loop;
	var dz = gz / loop;
	var counter = 0;
	var newPos;
	newPos = x + ' ' + 0 + ' ' + z;
	var moveCam = setInterval(function() {
		x += dx;
		z += dz;
		counter++;
		newPos = x + ' ' + 0 + ' ' + z;
		$('#camera').attr('position', newPos);
		if (counter >= loop) {
			clearInterval(moveCam);
			relocate();
		}
	}, gap * 1000);
});

$('h3.platform').click(function() {
        window.open('../platform/index.html', '_self');
});

$('h3.gym').click(function() {
        window.open('../gym/index.html', '_self');
});

