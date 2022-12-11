var input = document.getElementById("data").textContent;
// input = document.getElementById("test").textContent;

function getSequence(len) {
	var val = 0;
  var seq = "";
  var pos = len;
  while(pos < input.length) {
    seq = input.substring(pos - len, pos);
    var m = new Set(seq);
    //console.log("Test: " + seq + ", Set: " + m + " ("+m.size+")");
    if(m.size == len) {
      val = pos;
      break;
    }
    pos++;
  }
  return val;
}

var acc = getSequence(4);
var acc2 = getSequence(14);

console.log("Part1: " + acc);
console.log("Part2: " + acc2);
