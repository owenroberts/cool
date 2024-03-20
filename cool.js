/* some helpers */
Array.prototype.insert = function(index, item) {
	this.splice(index, 0, item);
};

Number.prototype.clamp = function(min, max) {
	return max > min ? 
		Math.min(Math.max(this, min), max) :
		Math.min(Math.max(this, max), min);
};

// requestAnim shim layer by Paul Irish
// https://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
if (typeof window !== 'undefined') {
	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame  	|| 
			window.webkitRequestAnimationFrame 	|| 
			window.mozRequestAnimationFrame    	|| 
			window.oRequestAnimationFrame      	|| 
			window.msRequestAnimationFrame     	|| 
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
	})();
}

function getDate() {
	return new Date().toDateString().replace(/ /g, '-');
}

function map(value, low1, high1, low2, high2, clamp) {
	let v = low2 + (high2 - low2) * (value - low1) / (high1 - low1) || 0;
	return clamp ? v.clamp(low2, high2) : v;
}

function padNumber(number, length) {
	let my_string = '' + number;
	while (my_string.length < length) {
		my_string = '0' + my_string;
	}
	return my_string;
}

function random(min, max) {
	if (!max) {
		if (typeof min === "number") {
			return Math.random() * (min);
		} else if (Array.isArray(min)) {
			return min[Math.floor(Math.random() * min.length)];
		} else if (typeof min == 'object') {
			return min[random(Object.keys(min))];
		}
	} else {
		return Math.random() * (max - min) + min;
	}
}

function randomInt(min, max) {
	if (!max) max = min, min = 0;
	return Math.round( Math.random() * (max - min) + min );
}

const randInt = randomInt;

function chance(n) {
	return random(1) < n;
}

function choice(choices) {
	if (!Array.isArray(choices)) choices = [...arguments];
	return choices[Math.floor(Math.random() * choices.length)];
}

function shuffle(array) {
  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

// https://stackoverflow.com/a/36481059
function randomNormalInverse() {
	let u = 0, v = 0;
	while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
	while (v === 0) v = Math.random();
	const r = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
	let m = map(r, -3.5, 3.5, 0, 1); /* convert normal range to 0 - 1 */
	return m > 0.5 ? m - 0.5 : m + 0.5; /* invert range */
}

/* converting color values 
http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
https://gist.github.com/kig/2115205 // hslToHex
*/
function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function HueToRgb(m1, m2, hue) {
	var v;
	if (hue < 0)
		hue += 1;
	else if (hue > 1)
		hue -= 1;
	if (6 * hue < 1)
		v = m1 + (m2 - m1) * hue * 6;
	else if (2 * hue < 1)
		v = m2;
	else if (3 * hue < 2)
		v = m1 + (m2 - m1) * (2/3 - hue) * 6;
	else
		v = m1;
	return 255 * v;
}

function hslToHex(c) {
	var hue=0, saturation=0, lightness=0;
	var tmp = 0;
	for (var i=0,j=0,k=0; i<c.length; i++) {
		var ch = c.charCodeAt(i);
		if (ch >= 48 && ch <= 57) {
			tmp = tmp * 10 + (ch-48);
			k = 1;
			continue;
		} else if (k === 1) {
			switch(j) {
				case 0: hue = (tmp % 360) / 360; break;
				case 1:
					saturation = (tmp > 100 ? 100 : tmp) / 100; break;
				case 2:
					lightness = (tmp > 100 ? 100 : tmp) / 100; break;
			}
			j++;
		}
		k = 0;
		tmp = 0;
	}
	var h = (hue / (1/6));
	var c = (1-Math.abs(2*lightness-1))*saturation;
	var x = c * (1-Math.abs((h%2)-1));
	switch (h | 0) {
		case 0: r=c; g=x; b=0; break;
		case 1: r=x; g=c; b=0; break;
		case 2: r=0; g=c; b=x; break;
		case 3: r=0; g=x; b=c; break;
		case 4: r=x; g=0; b=c; break;
		case 5: r=c; g=0; b=x; break;
	}
	var m = lightness - 0.5*c;
	r+=m; g+=m; b+=m;
	r=r*255|0; g=g*255|0; b=b*255|0;
	var hex = '';
		k = (r >> 4 & 0xf) + 48;
		if (k > 57) k += 7;
		hex += String.fromCharCode(k);
		k = (r & 0xf) + 48;
		if (k > 57) k += 7;
		hex += String.fromCharCode(k);
		k = (g >> 4 & 0xf) + 48;
		if (k > 57) k += 7;
		hex += String.fromCharCode(k);
		k = (g & 0xf) + 48;
		if (k > 57) k += 7;
		hex += String.fromCharCode(k);
		k = (b >> 4 & 0xf) + 48;
		if (k > 57) k += 7;
		hex += String.fromCharCode(k);
		k = (b & 0xf) + 48;
		if (k > 57) k += 7;
		hex += String.fromCharCode(k);
	return hex;
}

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function rgbToHsl(rgb) {
	rgb.r /= 255, rgb.g /= 255, rgb.b /= 255;
	var max = Math.max(rgb.r, rgb.g, rgb.b), min = Math.min(rgb.r, rgb.g, rgb.b);
	var h, s, l = (max + min) / 2;

	if (max == min) { h = s = 0; } 
	else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max){
			case rgb.r: h = (rgb.g - rgb.b) / d + (rgb.g < rgb.b ? 6 : 0); break;
			case rgb.g: h = (rgb.b - rgb.r) / d + 2; break;
			case rgb.b: h = (rgb.r - rgb.g) / d + 4; break;
		}
		
		h /= 6;
	}
	
	return [(h*360+0.5)|0, ((s*100+0.5)|0), ((l*100+0.5)|0)];
}

// http://wowmotty.blogspot.com/2009/06/convert-jquery-rgb-output-to-hex-color.html
function rgb2hex(orig) {
 var rgb = orig.replace(/\s/g,'').match(/^rgba?\((\d+),(\d+),(\d+)/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : orig;
}

/* vector stuff */
function Vector(x,y) {
	this.x = x || 0;
	this.y = y || 0;
	
	if (Array.isArray(this.x)) {
		this.x = x[0];
		this.y = x[1];
	}

	this.random = function(xMin, xMax, yMin, yMax) {
		if (arguments.length == 1) {
			this.x = random(-xMin, xMin);
			this.y = random(-xMin, xMin);
		} else if (arguments.length == 2) {
			this.x = random(xMin, xMax);
			this.y = random(xMin, xMax);
		} else if (arguments.length == 4) {
			this.x = random(xMin, xMax);
			this.y = random(yMin, yMax);
		} else {
			console.error('You need 1, 2 or 4 arguments, dingus.');
		}
		return this;
	};

	this.zero = function() {
		if ( Math.abs(this.x) > 0 || Math.abs(this.y) > 0 ) return false;
		else return true;
	};

	this.add = function(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	};

	this.subtract = function(v) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	};

	this.multiply = function(n) {
		if (typeof n === 'object') {
			this.x *= n.x;
			this.y *= n.y;
		} else {
			this.x *= n;
			this.y *= n;
		}
		return this;
	};

	this.divide = function(n) {
		if (typeof n == 'object') {
			this.x /= n.x;
			this.y /= n.y;
		} else {
			this.x /= n;
			this.y /= n;
		}
		return this;
	};

	this.magnitude = function() {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	};
	
	this.normalize = function() {
		var m = this.magnitude();
		if (m != 0 && m != 1) this.divide(m);
		return this;
	};

	this.copy = function() {
		return new Vector(this.x, this.y);
	};

	this.distance = function(v) {
		var d = new Vector(v.x, v.y);
		d.subtract(this);
		return d.magnitude();
	};

	this.round = function() {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		return this;
	};

	this.getObj = function() {
		return { x: this.x, y: this.y };
	};

	this.clone = function() {
		return new Vector(this.x, this.y);
	};

	this.sameDirection = function(v) {
		return Math.sign(this.x) == Math.sign(v.x) &&
			Math.sign(this.y) == Math.sign(v.y);
	};

	this.toArray = function() {
		return [this.x, this.y];
	};

	return this;
};


/* browser stuff */
function mobilecheck() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

function testPerformance() {
	// https://stackoverflow.com/questions/19754792/measure-cpu-performance-via-js
	var _speedconstant = 1.15600e-8; //if speed=(c*a)/t, then constant=(s*t)/a and time=(a*c)/s
	var d = new Date();
	var amount = 150000000;
	var estprocessor = 1.7; //average processor speed, in GHZ
	// console.log("JSBenchmark by Aaron Becker, running loop " + amount + " times.     Estimated time (for " + estprocessor + "ghz processor) is " + (Math.round(((_speedconstant * amount) / estprocessor) * 100) / 100) + "s");
	for (var i = amount; i > 0; i--) {}
	var newd = new Date();
	var accnewd = Number(String(newd.getSeconds()) + "." + String(newd.getMilliseconds()));
	var accd = Number(String(d.getSeconds()) + "." + String(d.getMilliseconds()));
	var di = accnewd - accd;
	//console.log(accnewd,accd,di);
	if (d.getMinutes() != newd.getMinutes()) {
	  di = (60 * (newd.getMinutes() - d.getMinutes())) + di
	}
	var spd = ((_speedconstant * amount) / di);
	// console.log("Time: " + Math.round(di * 1000) / 1000 + "s, estimated speed: " + Math.round(spd * 1000) / 1000 + "GHZ");

	return Math.round(di * 1000) / 1000;
}

/* ascii key mapping */
const keys = {
	"9":   "tab",
	"13":  "enter",
	"27":  "escape",
	"32":  "space",
	"37":  "left",
	"38":  "up",
	"39":  "right",
	"40":  "down",
	"48": "0",
	"49": "1",
	"50": "2",
	"51": "3",
	"52": "4",
	"53": "5",
	"54": "6",
	"55": "7",
	"56": "8",
	"57": "9",
	"65":  "a",	
	"66":  "b",
	"67":  "c",
	"68":  "d",
	"69":  "e",
	"70":  "f",
	"71":  "g",
	"72":  "h",
	"73":  "i",
	"74":  "j",
	"75":  "k",
	"76":  "l",
	"77":  "m",
	"78":  "n",
	"79":  "o",
	"80":  "p",
	"81":  "q",
	"82":  "r",
	"83":  "s",
	"84":  "t",
	"85":  "u",
	"86":  "v",
	"87":  "w",
	"88":  "x",
	"89":  "y",
	"90":  "z",
	"186": ";",
	"187": "+",
	"188": ",",
	"190": ".",
	"191": "/",
	"192": "`",
	"219": "[",
	"220": "backslash",
	"221": "]",
	"222": "'",
};

// 8 bit bit mask auto tile order for 48 tiles
// https://unit.dev/posts/blobmaps/
const tileMap = [
	0, 4, 68, 64, 117, 71, 197, 93, 7, 199, 215, 193,
	1, 5, 69, 65, 23, 223, 247, 209, 95, 255, 221, 241,
	17, 21, 85, 81, 29, 127, 253, 113, 31, 119, 'x', 245,
	16, 20, 84, 80, 219, 92, 116, 87, 28, 125, 124, 112,
];

export { getDate, map, padNumber, random, randomInt, chance, choice, shuffle, randomNormalInverse, componentToHex, HueToRgb, hslToHex, hexToRgb, rgbToHsl, rgb2hex, Vector, mobilecheck, testPerformance, keys, tileMap, randInt };