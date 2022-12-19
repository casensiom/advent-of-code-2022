var inputSrc = "data";
// inputSrc = "test";
var input = document.getElementById(inputSrc).textContent;
var solution1 = document.getElementById(inputSrc).getAttribute("solution1");
var solution2 = document.getElementById(inputSrc).getAttribute("solution2");

var lines = input.split("\n\n");

const TYPE_OPEN = 0;
const TYPE_NUMBER = 1;
const TYPE_CLOSE = 2;

function parseSide(str) {
    var last = 0;
    var parsed = [];
    [...str].forEach((v, i) => {
        switch (v) {
            case '[':
                parsed.push({ type: TYPE_OPEN });
                last = i;
                break;
            case ']':
                if ((i - last) > 1) {
                    parsed.push({ type: TYPE_NUMBER, value: Number(str.substring(last + 1, i)) });
                }
                parsed.push({ type: TYPE_CLOSE });
                last = i;
                break;
            case ',':
                if ((i - last) > 1) {
                    parsed.push({ type: TYPE_NUMBER, value: Number(str.substring(last + 1, i)) });
                }
                last = i;
                break;
        }
    })

    return parsed;
}

function wrap(arr) {
    var ret = [];
    ret.push({ type: TYPE_OPEN });
    ret.push(arr[0]);
    ret.push({ type: TYPE_CLOSE });
    ret = ret.concat(arr.slice(1));
    return ret;
}

function unwrap(arr) {
    var pos = 0;
    var depth = 0;
    arr.every((v, i) => {
        if (v.type == TYPE_OPEN)
            depth++;
        if (v.type == TYPE_CLOSE)
            depth--;
        if (depth == 0) {
            pos = i;
            return false;
        }
        return true;
    });

    return [arr.slice(1, pos), arr.slice(pos + 1)];
}

function compareParsed(left, right) {
    if (left.length == 0 || right.length == 0) {
        return (left.length - right.length);
    }

    if (left[0].type == TYPE_OPEN && right[0].type == TYPE_OPEN) {
        // both arrays
        var l = unwrap(left);
        var r = unwrap(right);
        var ret = compareParsed(l[0], r[0]);
        if (ret == 0) {
            ret = compareParsed(l[1], r[1]);
        }
        return ret;
    } else if (left[0].type == TYPE_NUMBER && right[0].type == TYPE_NUMBER) {
        // both numbers
        var ret = (left[0].value - right[0].value);
        if (ret == 0) {
            ret = compareParsed(left.slice(1), right.slice(1));
        }
        return ret;
    } else {
        var l = (right[0].type == TYPE_OPEN) ? wrap(left) : left;
        var r = (left[0].type == TYPE_OPEN) ? wrap(right) : right;
        return compareParsed(l, r);
    }
}

var acc = 0;
lines.forEach((group, idx) => {
    var pair = group.split("\n");

    var r = compareParsed(parseSide(pair[0]), parseSide(pair[1]));
    if (r < 0) {
        acc += idx + 1;
    }
    console.log("Result --> " + r + " at index: " + (idx + 1) + " " + acc);
});


var acc2 = 1;
const marks = ["[[2]]", "[[6]]", input];
var all = marks.join("\n").split("\n").filter(x => x.length > 0);
var sorted = all.sort((a, b) => { return compareParsed(parseSide(a), parseSide(b)) });
sorted.forEach((line, idx) => {
    console.log(line);
    if (line == marks[0] || line == marks[1]) {
        acc2 *= (idx + 1);
    }
});

var part1 = acc;
var part2 = acc2;

console.log("Part1: " + part1);
console.log("Part2: " + part2);

if (solution1 && solution2) {
    console.log("");
    console.log("Check solution to part1 is " + solution1 + ": " + (solution1 == part1));
    console.log("Check solution to part1 is " + solution2 + ": " + (solution2 == part2));
}



