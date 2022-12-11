var input = document.getElementById("data").textContent;
// input = document.getElementById("test").textContent;
var lines = input.split('\n');

var acc = 0;
var acc2 = 0;

function getValue(c) {
  var val = 0;
  if(c >= 'a' && c <= 'z') {
    val = c.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
  } else if(c >= 'A' && c <= 'Z') {
    val = c.charCodeAt(0) - 'A'.charCodeAt(0) + 27;
  }
  // console.log(c + ": value is " + val);
  return val;
}

for(var i = 0; i < lines.length; i++) { 
  var full = lines[i];
  var first  = lines[i].substring(0, full.length / 2);
  var second = lines[i].substring(full.length / 2, full.length);
  
  var firstSet = new Set(first);
  var secondSet = new Set(second);
  var intersection = new Set([...firstSet].filter(x => secondSet.has(x)));
  
  acc += getValue([...intersection][0]);
}
console.log("Part1: " + acc);

for(var i = 0; i < lines.length; i+=3) { 
  var group = [new Set(lines[i+0]), new Set(lines[i+1]), new Set(lines[i+2])];

	var list = [];
  intersection = group[0];
  for(var j = 1; j < 3; ++j) {
  	intersection = new Set([...intersection].filter(x => group[j].has(x)));
  }

  acc2 += getValue([...intersection][0]);
}
console.log("Part2: " + acc2);
