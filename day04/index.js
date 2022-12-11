
var inputSrc = "data";
// inputSrc = "test";
var input = document.getElementById(inputSrc).textContent;
var solution1 = document.getElementById(inputSrc).getAttribute("solution1");
var solution2 = document.getElementById(inputSrc).getAttribute("solution2");

var lines = input.split('\n');

var full_overlap = 0;
var no_overlap = 0;

for(var i = 0; i < lines.length; ++i) {
    const action = /([0-9]*)-([0-9]*),([0-9]*)-([0-9]*)/;
    const found = lines[i].match(action);
    if(!found) continue;
    const a = Number(found[1]);
    const b = Number(found[2]);
    const c = Number(found[3]);
    const d = Number(found[4]);

    if((c <= a && b <= d) || (a <= c && d <= b)) {
        full_overlap++;
    }
    if(b < c || d < a) {
        no_overlap++;
    }
}

var part_overlap = (lines.length - no_overlap - full_overlap);
var any_overlap = full_overlap + part_overlap;
var all = full_overlap + part_overlap + no_overlap;

console.log("Full: " + full_overlap);
console.log("Part: " + part_overlap);
console.log("None: " + no_overlap);
console.log("Any: " + any_overlap);
console.log("All: " + all);
console.log("ASSERT(" + (lines.length == all) + ")");
console.log("");

var part1 = full_overlap;
var part2 = any_overlap;
console.log("Part1: " + part1);
console.log("Part2: " + part2);

if(solution1 && solution2) {
    console.log("");
    console.log("Check solution to part1 is " + solution1 + ": " + (solution1 == part1));
    console.log("Check solution to part1 is " + solution2 + ": " + (solution2 == part2));
}
