
var inputSrc = "data";
inputSrc = "test";
var input = document.getElementById(inputSrc).textContent;
var solution1 = document.getElementById(inputSrc).getAttribute("solution1");
var solution2 = document.getElementById(inputSrc).getAttribute("solution2");

var lines = input.split('\n');

var maxStack = 9;
var stacks=[[], [], [], [], [], [], [], [], []];

// Fill data
var i = 0;
while(lines[i].length > 0) {
    for(var j = 0; j < maxStack; ++j) {
        var pos = (j * 4) + 1;
        if(pos >= lines[i].length) {
            maxStack = j;
            break;    
        }
        if(lines[i][pos] == ' ') {
            continue;
        }
        stacks[j].push(lines[i][pos]);
    }
    ++i;
}

// Fix data
for(var j = 0; j < maxStack; ++j) {
    stacks[j].pop();
    stacks[j] = stacks[j].reverse();
}

// console.log("Original");
// for(var j = 0; j < maxStack; ++j) {
//     console.log(stacks[j]);
// }

const CrateMover9000 = 0;
const CrateMover9001 = 1;

var start = i;
var results = [];
for(var type = CrateMover9000; type <= CrateMover9001; ++type) {
    // clone matrix
    var temp = [];
    for(var j = 0; j < maxStack; ++j) {
        temp.push(stacks[j].slice());
    }

    // move crates
    for(var i = start; i < lines.length; ++i) {
        const action = /move ([0-9]*) from ([0-9]*) to ([0-9]*)/;
        const found = lines[i].match(action);
        if(!found) continue;
        let num = Number(found[1]);
        const src = Number(found[2]) - 1;
        const dst = Number(found[3]) - 1;

        if(type == 0) {
            while(num-- > 0) {
                temp[dst].push(temp[src].pop());
            }
        } else {
            temp[dst] = temp[dst].concat(temp[src].slice(-num));
            temp[src] = temp[src].slice(0, temp[src].length - num);
        }
    }

    // gather result
    var val = "";
    for(var j = 0; j < maxStack; ++j) {
        val += temp[j][temp[j].length - 1];
    }
    results[type] = val;
}

var part1 = results[CrateMover9000];
var part2 = results[CrateMover9001];
console.log("Part1: " + part1);
console.log("Part2: " + part2);

if(solution1 && solution2) {
    console.log("");
    console.log("Check solution to part1 is " + solution1 + ": " + (solution1 == part1));
    console.log("Check solution to part1 is " + solution2 + ": " + (solution2 == part2));
}
