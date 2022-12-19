var inputSrc = "data";
// inputSrc = "test";
var input = document.getElementById(inputSrc).textContent;
var solution1 = document.getElementById(inputSrc).getAttribute("solution1");
var solution2 = document.getElementById(inputSrc).getAttribute("solution2");

var lines = input.split("\n");
var sand = { x: 500, y: 0 };


var regex = /\d+/gm
var all = input.match(regex).map(a => Number(a));
var horizontal = all.filter((v, i) => (i % 2) == 0)
var vertical = all.filter((v, i) => (i % 2) != 0)
var minX = Math.min(...horizontal)
var maxX = Math.max(...horizontal)
var minY = 0;  //Math.min(...vertical)
var maxY = Math.max(...vertical)
var WIDTH = (maxX - minX) + 1;
var HEIGHT = (maxY - minY) + 1;
const moves = [0, -1, 1];


function buildMap() {
    if (INFINITE_FLOOR) {
        maxY += 2;
        HEIGHT = (maxY - minY) + 1;
    }
    var map = Array(HEIGHT).fill([]);
    map.forEach((v, i) => map[i] = Array(WIDTH).fill('.'))

    var idx = 0;
    var counts = lines.map(v => v.split(">").length);
    var count = counts[idx] - 1;
    for (var i = 0; i < all.length - 2; i += 2) {
        if (count == 0) {
            count = counts[++idx] - 1;
            continue;
        }
        var x = all[i + 0] - minX;
        var y = all[i + 1] - minY;
        var ex = all[i + 2] - minX;
        var ey = all[i + 3] - minY;

        var dirX = (ex == x) ? 0 : (ex - x) > 0 ? 1 : -1;
        var dirY = (ey == y) ? 0 : (ey - y) > 0 ? 1 : -1;
        while (x != ex || y != ey) {
            map[y][x] = '#';
            x += dirX;
            y += dirY;
        }
        map[y][x] = '#';
        --count;
    }

    if (INFINITE_FLOOR) {
        map[HEIGHT - 1].fill('#');
    }

    var x = sand.x - minX;
    var y = sand.y - minY;
    map[y][x] = '+';
    return map;
}

function insideMap(pos) {
    return pos.x >= 0 && pos.x < WIDTH && pos.y >= 0 && pos.y < HEIGHT;
}

function resizeMap() {
    map.forEach(row => {
        row.unshift('.')
        row.push('.')
    });
    map[HEIGHT - 1].fill('#');
    WIDTH += 2;
    sand.x += 1;
}

const UNKNOWN = 0;
const MOVED = 1;
const BLOCKED = 2;
const FALL = 3;

function nextMove(pos) {
    var next = { x: pos.x, y: pos.y + 1 };
    moves.some(p => {
        next.x = pos.x + p;
        return (!insideMap(next) || map[next.y][next.x] == '.');
    });

    if (!insideMap(next)) {
        if (INFINITE_FLOOR) {
            resizeMap();
            pos.x += 1;
            return nextMove(pos);
        }
        return FALL;
    } else if (map[next.y][next.x] == '.') {
        pos.x = next.x;
        pos.y = next.y;
        return MOVED;
    } else {
        return BLOCKED;
    }

}

const draw = ['.', 'o', 'O', '.'];
function dropSand() {
    pos = { x: sand.x - minX, y: sand.y - minY };

    map[pos.y][pos.x] = 'o';
    do {
        map[pos.y][pos.x] = '.';
        var act = nextMove(pos);
        map[pos.y][pos.x] = draw[act];
        if (act != MOVED) {
            if (INFINITE_FLOOR && pos.x == sand.x - minX && pos.y == sand.y - minY) {
                return false;
            }
            return (act == BLOCKED);
        }
    } while (true);
}

function drawMap(map) {
    var content = "";
    map.forEach(row => {
        content += row.join("") + "\n";
    });
    document.getElementById("drawMap").textContent = content;
}

var interval = 10;
var INFINITE_FLOOR = 0;
var acc = 0;
var map = buildMap();
while (dropSand()) {
    ++acc;
}

INFINITE_FLOOR = 1;
var acc2 = 0;
var map = buildMap();
while (dropSand()) {
    ++acc2;
}

// (function loop() {
//     drawMap(map);
//     if (dropSand()) {
//         setTimeout(loop, 2);
//     }
// })();

var part1 = acc;
var part2 = acc2 + 1;   // the base case is not count (do it manually)

console.log("Part1: " + part1);
console.log("Part2: " + part2);

if (solution1 && solution2) {
    console.log("");
    console.log("Check solution to part1 is " + solution1 + ": " + (solution1 == part1));
    console.log("Check solution to part1 is " + solution2 + ": " + (solution2 == part2));
}



