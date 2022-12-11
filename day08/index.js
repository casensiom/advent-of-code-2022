var input = document.getElementById("data").textContent;
// input = document.getElementById("test").textContent;

var lines = input.split('\n');

// convert to matrix
var data = [];
for(var i = 0; i < lines.length; ++i) {
	var row = [];
	for(var j = 0; j < lines[i].length; ++j) {
		row.push(Number(lines[i][j]));
  }
  data.push(row);
}

var acc = 0;
var max = 0;
var h = data.length;
var w = data[0].length;
for(var y = 1; y < h-1; ++y) {
	for(var x = 1; x < w-1; ++x) {

    var d = data[y][x];
    var vT = true;
    var vB = true;
    var vL = true;
    var vR = true;
    var cT = 0;
    var cB = 0;
    var cL = 0;
    var cR = 0;
    
    for(var y1 = y-1; y1 >= 0; --y1) {
      cT++;
			if(data[y1][x] >= d) {
        vT = false;
        break;
      }
    }

		for(var y1 = y+1; y1 < h; ++y1) {
      cB++;
			if(data[y1][x] >= d) {
        vB = false;
        break;
      }
    }
    
    for(var x1 = x-1; x1 >= 0; --x1) {
      cL++;    
      if(data[y][x1] >= d) {
        vL = false;
        break;
      }
    }

    for(var x1 = x+1; x1 < w; ++x1) {
      cR++;
      if(data[y][x1] >= d) {
        vR = false;
        break;
      }
    }

		// console.log("d[" + y + "][" + x + "]=" + d + ", T:" + vT + ", B:" + vB + ", L:" + vL + ", R:" + vR + ", v:" + (vT || vB || vL || vR));  
		if(vT || vB || vL || vR) {
    	acc++;
    }
    var v = (cT * cB * cL * cR);
    if(v > max) {
    	max = v;
    }
    // console.log("d[" + y + "][" + x + "]=" + d + ", T:" + cT + ", B:" + cB + ", L:" + cL + ", R:" + cR + ", v:" + v); 
    
	}
}

var p = h * 2 + (w - 2) * 2;
// console.log("Size: " + w + " x " + h);
// console.log("Perimeter: " + p);
// console.log("Inner: " + acc);
console.log("Part1: " + (p + acc));
console.log("Part2: " + max);




