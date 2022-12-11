var input = document.getElementById("data").textContent;
// input = document.getElementById("test").textContent;
// input = document.getElementById("test1").textContent;


var lines = input.split('\n');

const len = 10;
const HEAD = 0;
const TAIL = len-1;
var positions = [];
for(var i = HEAD; i <= TAIL; ++i) {
	positions[i] = {x: 0, y:0};
}

var visited1 = new Set();
var visited2 = new Set();
visited1.add(positions[HEAD+1].x + "x" + positions[HEAD+1].y);
visited2.add(positions[TAIL].x + "x" + positions[TAIL].y);

for(var i = 0; i < lines.length; ++i) {
  const action = /([LRUD]) ([0-9]*)/;
  const found = lines[i].match(action);
  if(!found) continue;
  var dir = found[1];
  var count = found[2];
  
  var mov = {x: 0, y:0};
  if(dir == "R") {
  	mov.x = 1;
  } else if(dir == "L") {
  	mov.x = -1;
  } else if(dir == "U") {
  	mov.y = 1;
  } else if(dir == "D") {
  	mov.y = -1;
  }
  
  
  while(count > 0) {
  	--count;

  	// move head
    positions[HEAD].x += mov.x;
    positions[HEAD].y += mov.y;
    // console.log("Head moves to: [" + head.x + ", " + head.y + "]");
    
    // move tail
    for(var j = HEAD + 1; j <= TAIL; ++j) {
    	var prev = j - 1;
      var current = j;
      const difx = positions[prev].x - positions[current].x;
      const dify = positions[prev].y - positions[current].y;
      if(Math.abs(difx) <= 1 && Math.abs(dify) <= 1) {
        continue;
      }

      var dif = {x: Math.max(Math.min(difx, 1), -1), y: Math.max(Math.min(dify, 1), -1)};
      positions[current].x += dif.x;
      positions[current].y += dif.y;
      // console.log("Tail moves to: [" + tail.x + ", " + tail.y + "] - d: (" + dif.x + ", " + dif.y + ")");
    }
    
    // mark position
    visited1.add(positions[HEAD+1].x + "x" + positions[HEAD+1].y);
    visited2.add(positions[TAIL].x + "x" + positions[TAIL].y);
  }
}

console.log("Part1: " + visited1.size);
console.log("Part2: " + visited2.size);
