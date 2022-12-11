var input = document.getElementById("data").textContent;
// input = document.getElementById("test").textContent;

var lines = input.split('\n');

var regX = 1;
var iter = 0;
var acc = 0;
var screen = "";
var WIDTH = 40;
var HEIGHT = 6;

function draw() {
  screen += (Math.abs((iter % WIDTH) - regX) <= 1) ? '#' : ' ';
}

function nextCycle() {
  ++iter;
  if(iter >= 20 && iter <= 220 && ((iter - 20) % 40) == 0) {
    acc += iter * regX;
  }
}

for(var i = 0; i < lines.length; ++i) {
  const action = /(noop|addx) ?(-?[0-9]*)/;
  const found = lines[i].match(action);
  if(!found) continue;
  
  var cmd = found[1];
  
  
// console.log("Sprite position: " + regX);
// console.log("");
// console.log("Start cycle " + (iter + 1) + ": begin executing " + lines[i]);
  
  if(cmd == "addx") {
  	var value = Number(found[2]);
   
    draw();
    // console.log("During cycle  " + (iter + 1) + ": CRT draws pixel in position " +  (iter % WIDTH));
    // console.log("Current CRT row: " + screen);
		// console.log("");
    nextCycle();
    
    draw();
    // console.log("During cycle  " + (iter + 1) + ": CRT draws pixel in position " +  (iter % WIDTH));
    // console.log("Current CRT row: " + screen);
    nextCycle();

		regX += value;
		// console.log("End of cycle " + (iter + 1) + ": finish executing " + lines[i] + " (Register X is now " + regX + ")");
  } else {
    draw();
    // console.log("During cycle  " + (iter + 1) + ": CRT draws pixel in position " +  (iter % WIDTH));
    // console.log("Current CRT row: " + screen);
		// console.log("End of cycle " + (iter + 1) + ": finish executing " + lines[i]);
    nextCycle();
  }
}

console.log("Total: " + acc);
for(var i = 0; i < WIDTH * HEIGHT; i += WIDTH) {
	console.log(screen.substring(i, i + WIDTH));
}


/*

RGLRBZAU

"###   ##  #    ###  ###  ####  ##  #  # "
"#  # #  # #    #  # #  #    # #  # #  # "
"#  # #    #    #  # ###    #  #  # #  # "
"###  # ## #    ###  #  #  #   #### #  # "
"# #  #  # #    # #  #  # #    #  # #  # "
"#  #  ### #### #  # ###  #### #  #  ##  "

*/
