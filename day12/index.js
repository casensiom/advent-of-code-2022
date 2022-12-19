var inputSrc = "data";
// inputSrc = "test";
var input = document.getElementById(inputSrc).textContent;
var solution1 = document.getElementById(inputSrc).getAttribute("solution1");
var solution2 = document.getElementById(inputSrc).getAttribute("solution2");

var lines = input.split("\n");

const HEIGHT = lines.length;
const WIDTH = lines[0].length;


function solve_a_star(data, s, e) {
    var table = [];
    var queue = [];

    //Create a map
    for (var y = 0; y < HEIGHT; ++y) {
        for (var x = 0; x < WIDTH; ++x) {
            var h = data[y][x];
            if (h == 'S') {
                h = 'a';
            }
            if (h == 'E') {
                h = 'z';
            }

            table[y * WIDTH + x] = { x: x, y: y, height: h, found: false, distance: null, gcost: null, hcost: null, prev: null }; // cell
        }
    }

    table[s.y * WIDTH + s.x].distance = 0;
    queue.push(table[s.y * WIDTH + s.x]);

    while (queue.length > 0) {
        var current = queue.shift();
        current.found = true;
        if (e.y == current.y && e.x == current.x) {
            break;
        }

        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                if (Math.abs(i) != Math.abs(j)) {
                    const pos = { x: current.x + j, y: current.y + i };
                    const offset = pos.y * WIDTH + pos.x;
                    if (pos.x >= WIDTH || pos.x < 0 || pos.y >= HEIGHT || pos.y < 0) {
                        continue;
                    }
                    if (table[offset].x != pos.x || table[offset].y != pos.y) {
                        console.log("ERROR!!");
                    }
                    var diff = table[offset].height.charCodeAt(0) - current.height.charCodeAt(0);
                    if (diff > 1) {
                        continue;
                    }
                    if (table[offset].found) {
                        continue;
                    }

                    var gcost = current.gcost + Math.hypot(pos.y - current.y, pos.x - current.x);
                    if (table[offset].distance == null || table[offset].gcost > gcost) {
                        table[offset].gcost = gcost;
                        table[offset].hcost = Math.hypot(pos.y - e.y, pos.x - e.x);
                        table[offset].distance = table[offset].gcost + table[offset].hcost;
                        table[offset].prev = current;
                        queue.push(table[offset]);
                    }
                }
            }
        }
    }


    current = table[e.y * WIDTH + e.x];
    var currentPath = [];
    while (current.prev != null) {
        currentPath.push(current);
        current = current.prev;
    }
    return currentPath.reverse();
}


function drawPath(path) {

    var maze = [];
    for (var y = 0; y < HEIGHT; ++y) {
        maze.push([]);
        for (var x = 0; x < WIDTH; ++x) {
            maze[y].push(".");
        }
    }

    if (path.length > 0) {
        // maze[path[0].y][path[0].x] = 'S';
        for (var i = 0; i < path.length - 1; ++i) {
            const current = path[i];
            const next = path[i + 1];
            var c = '+';
            if (current.x < next.x) {
                c = '>';
            } else if (current.x > next.x) {
                c = '<';
            } else if (current.y < next.y) {
                c = 'v';
            } else if (current.y > next.y) {
                c = '^';
            }
            maze[current.y][current.x] = c;
        }
    }

    for (var y = 0; y < maze.length; ++y) {
        var str = "";
        for (var x = 0; x < WIDTH; ++x) {
            str += maze[y][x];
        }
        console.log(str);
    }
}

var alter = [];
var s = { x: 0, y: 0 };
var e = { x: 0, y: 0 };
for (var y = 0; y < HEIGHT; ++y) {
    for (var x = 0; x < WIDTH; ++x) {
        var h = lines[y][x];
        if (h == 'S') {
            s = { x: x, y: y };
        }
        if (h == 'a' || h == 'S') {
            alter.push({ x: x, y: y });
        }
        if (h == 'E') {
            e = { x: x, y: y };
        }
    }
}

var path = solve_a_star(lines, s, e);
drawPath(path);
var part1 = path.length;

var best = [];
alter.forEach(v => {
    var path = solve_a_star(lines, v, e);
    if (path.length > 0 && (path.length < best.length || best.length == 0)) {
        console.log("Solve with : " + v.x + ", " + v.y + " is " + path.length);
        best = path;
    }
});
drawPath(best);
var part2 = best.length;


console.log("Part1: " + part1);
console.log("Part2: " + part2);

if (solution1 && solution2) {
    console.log("");
    console.log("Check solution to part1 is " + solution1 + ": " + (solution1 == part1));
    console.log("Check solution to part1 is " + solution2 + ": " + (solution2 == part2));
}