var input = document.getElementById("data").textContent;
// input = document.getElementById("test").textContent;
var lines = input.split('\n');

var acc = 0;
var acc2 = 0;

var groups = input.split("\n\n");
var weights = [];
groups.forEach( (s) => {
    weights.push(s.split("\n").reduce((acc, curr) => acc + Number(curr), 0));
});

console.log("Part1: " + weights.sort().slice(-1));
console.log("Part2: " + weights.sort().slice(-3).reduce(function (a,b) { return a+b; }));
