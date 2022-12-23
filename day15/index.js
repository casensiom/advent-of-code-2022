var inputSrc = "data";
// inputSrc = "test";
var input = document.getElementById(inputSrc).textContent;
var solution1 = document.getElementById(inputSrc).getAttribute("solution1");
var solution2 = document.getElementById(inputSrc).getAttribute("solution2");


var row1 = Number(document.getElementById(inputSrc).getAttribute("data1"));
var freq1 = Number(document.getElementById(inputSrc).getAttribute("data2"));

var lines = input.split("\n");

var minX = 0;
var maxX = 0;
var minY = 0;
var maxY = 0;
var WIDTH = 0;
var HEIGHT = 0;

function manhattanDist(pos1, pos2) {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}

function buildMap() {

    // "Sensor at x=9, y=16: closest beacon is at x=10, y=16"
    data = [];
    lines.forEach(l => {
        const regex = /Sensor at x=(-?\d*), y=(-?\d*): closest beacon is at x=(-?\d*), y=(-?\d*)/
        const found = l.match(regex);
        const sensor = { x: Number(found[1]), y: Number(found[2]) };
        const beacon = { x: Number(found[3]), y: Number(found[4]) };
        const dist = manhattanDist(sensor, beacon);
        data.push({ beacon: beacon, sensor: sensor, dist: dist });
    });

    minX = Math.min(...data.map(v => Math.min(v.beacon.x, v.sensor.x)))
    maxX = Math.max(...data.map(v => Math.max(v.beacon.x, v.sensor.x)))
    minY = Math.min(...data.map(v => Math.min(v.beacon.y, v.sensor.y)))
    maxY = Math.max(...data.map(v => Math.max(v.beacon.y, v.sensor.y)))
    WIDTH = (maxX - minX) + 1;
    HEIGHT = (maxY - minY) + 1;

    if (WIDTH * HEIGHT > 2000)
        return [['.']];

    var map = Array(HEIGHT).fill([]);
    map.forEach((v, y) => {
        map[y] = Array(WIDTH).fill('.');
        map[y].forEach((v, x) => {
            const pos = { x: x + minX, y: y + minY };
            const p = (data.filter(v => v.sensor.x == pos.x && v.sensor.y == pos.y).length > 0) ? "S" :
                (data.filter(v => v.beacon.x == pos.x && v.beacon.y == pos.y).length > 0) ? "B" :
                    (data.some(d => manhattanDist(d.sensor, pos) <= d.dist)) ? "#" : ".";
            map[y][x] = p;
        });
    })
    return map;
}

function getRemainScanDistance(pos) {
    var maxDiff = 0;
    data.forEach(e => {
        var dist = e.dist - manhattanDist(e.sensor, pos);
        if (dist > maxDiff) {
            maxDiff = dist;
        }
    });
    return maxDiff;
}


function solve1(row) {
    var ret = 0;
    const y = row;
    var line = "";

    var minDiff = Math.floor(getRemainScanDistance({ x: minX, y: y }) * 1.5);
    var maxDiff = Math.floor(getRemainScanDistance({ x: maxX, y: y }) * 1.5);
    console.log("Min diff: " + minDiff);
    console.log("Max diff: " + maxDiff);
    console.log("Range: " + ((maxX + maxDiff) - (minX - minDiff)));

    for (var x = minX - minDiff; x < maxX + maxDiff; ++x) {
        const pos = { x: x, y: y };
        const isSensor = data.filter(v => v.sensor.x == pos.x && v.sensor.y == pos.y).length > 0;
        const isBeacon = data.filter(v => v.beacon.x == pos.x && v.beacon.y == pos.y).length > 0;
        if (!isSensor && !isBeacon && data.some(d => manhattanDist(d.sensor, pos) <= d.dist)) {
            ++ret;
        }
    }

    return ret;
}


function solve1_a(row) {
    var ranges = [];
    var acc = 0;
    var minX = 0;
    var maxX = 0;
    var myData = data.filter(v => Math.abs(v.sensor.y - row) <= v.dist); // remove the ones that are too far
    myData.sort((a, b) => a.sensor.x - b.sensor.x).forEach(e => {
        var x1 = e.sensor.x - (e.dist - Math.abs(e.sensor.y - row));
        var x2 = e.sensor.x + (e.dist - Math.abs(e.sensor.y - row));
        minX = Math.min(minX, x1);
        maxX = Math.max(maxX, x2);
        ranges.push({ start: x1, end: x2 });
    });

    for (var i = minX; i <= maxX; ++i) {
        if (ranges.filter(e => e.start <= i && i < e.end).length > 0) {
            ++acc;
        }
    }
    return acc;
}

function solve1_b(row) {
    var ranges = [];
    var myData = data.filter(v => Math.abs(v.sensor.y - row) <= v.dist); // remove the ones that are too far
    myData.sort((a, b) => a.sensor.x - b.sensor.x).forEach(e => {
        var x1 = e.sensor.x - (e.dist - Math.abs(e.sensor.y - row));
        var x2 = e.sensor.x + (e.dist - Math.abs(e.sensor.y - row));
        ranges.push({ start: x1, end: x2 });
    });

    var count = 0;
    var vals = ranges.sort((a, b) => a.start - b.start);
    var max_x = 0;
    for (var i = 0; i < vals.length; ++i) {
        var v = vals[i];
        var cmp = (v.start > max_x && v.start >= 0 && v.start <= freq1);
        if (cmp) {
            console.log("Result: " + (max_x * freq1 + row) + ", x: " + max_x + ", y:" + row);
            count = max_x;
            break;

        }
        max_x = Math.max(max_x, v.end);
    };

    return count;
}

function solve2(freq) {
    var f = 0;
    for (var y = 0; y < freq; ++y) {
        var x = solve1_b(y);
        if (x > 0) {
            f = (x * freq + y);
            console.log("y: " + y + ", x: " + x + " -> " + f);
            break;
        }
    }
    return f;
}


var map = buildMap();
// drawMap(map);
var start = -50;
var size = 200;
// var box = { sx: -50, ex: 150, sy: -50, ey: 150 };
var box = { sx: start, ex: (size + start), sy: start, ey: (size + start) };

var scale = WIDTH;
var sizeX = 200;
var sizeY = 60;
var startX = 3340224 - sizeX / 2;
var startY = 3249595 - sizeY / 2;
var scaleInc = 1000000;
var box = { sx: startX, ex: (sizeX + startX), sy: startY, ey: (sizeY + startY) };

(function loop() {
    var box = { sx: startX, ex: (sizeX + startX), sy: startY, ey: (sizeY + startY) };
    drawResize(box, scale);
    setTimeout(loop, 10);
})();


var acc = solve1_a(row1);
var acc2 = solve2(freq1);

var part1 = acc;
var part2 = acc2;   // the base case is not count (do it manually)

console.log("Part1: " + part1);
console.log("Part2: " + part2);
document.getElementById("drawMap").textContent += "\n\n" + "Part1: " + part1 + "\nPart2: " + part2;

if (solution1 && solution2) {
    console.log("");
    console.log("Check solution to part1 is " + solution1 + ": " + (solution1 == part1));
    console.log("Check solution to part1 is " + solution2 + ": " + (solution2 == part2));
}



