var inputSrc = "data";
// inputSrc = "test";
var input = document.getElementById(inputSrc).textContent;
var solution1 = document.getElementById(inputSrc).getAttribute("solution1");
var solution2 = document.getElementById(inputSrc).getAttribute("solution2");

var lines = input.split("\n");


function buildMap() {
    var map = [];
    lines.forEach(e => {
        var c = e.split(",");
        map.push({x:+c[0], y:+c[1], z:+c[2]});
    });
    return map;
}

const offsets = [{x:1, y:0, z:0}, {x:-1, y:0, z:0}, 
                 {x:0, y:1, z:0}, {x:0, y:-1, z:0}, 
                 {x:0, y:0, z:1}, {x:0, y:0, z:-1}];

const LEFT  = 1;
const RIGHT = 2;
const UP    = 4;
const DOWN  = 8;
const FRONT = 16;
const BACK  = 32;

function codeSides(map, x, y, z) {
    var coded = 0;
    var pos   = 0;
    for(const o of offsets) {
        if(map.filter(v => v.x == (x + o.x) && v.y == (y + o.y) && v.z == (z + o.z)).length > 0) {
            coded += Math.pow(2, pos);
        }
        ++pos;
    }
    return coded;

}

function countSides(map, x, y, z) {
    var sideCount = 0;
    for(const o of offsets) {
        sideCount += (map.filter(v => v.x == (x + o.x) && v.y == (y + o.y) && v.z == (z + o.z)).length > 0) ? 1 : 0;
    }
    return sideCount;
}

function buildGrid(map) {
    var min = {x:Infinity, y:Infinity, z:Infinity};
    var max = {x:-Infinity, y:-Infinity, z:-Infinity};

    for(var v of map) {
        v.x += 1;
        v.y += 1;
        v.z += 1;
    }

    for(const v of map) {
        min.x = Math.min(v.x, min.x);
        min.y = Math.min(v.y, min.y);
        min.z = Math.min(v.z, min.z);
        max.x = Math.max(v.x, max.x);
        max.y = Math.max(v.y, max.y);
        max.z = Math.max(v.z, max.z);
    }

    var min = {x:min.x-1, y:min.y-1, z:min.z-1};
    var max = {x:max.x+2, y:max.y+2, z:max.z+2};

    var i = 0;
    var grid = Array(max.x).fill(null);
    for(var x = min.x; x < max.x; ++x) {
        grid[x] = Array(max.y).fill(null);
        for(var y = min.y; y < max.y; ++y) {
            grid[x][y] = Array(max.z).fill(null);
            for(var z = min.z; z < max.z; ++z) {
                const t = (map.filter(v => v.x == x && v.y == y && v.z == z).length > 0) ? 1 : 0;
                grid[x][y][z] = {key: i, pos: {x:x, y:y, z:z}, visited: false, sides: countSides(map, x, y, z), type: t};
                ++i;
            }
        }
    }

    return {data:grid, min: min, max: max};
}

function solve1(map) {
    var sideCount = 0;
    for(const e of map) {
        sideCount += countSides(map, e.x, e.y, e.z);
    }
    return (map.length * 6) - sideCount;
}

function solve2(map, grid) {

    var total = 0;
    var queue = [];
    queue.push(grid.data[grid.min.x][grid.min.y][grid.min.z]);
    while(queue.length > 0) {
        var current = queue.shift();
        if(current.visited) continue;
        current.visited = true;

        total += current.sides;

        for(const o of offsets) {
            var x = current.pos.x + o.x;
            var y = current.pos.y + o.y;
            var z = current.pos.z + o.z;
            if( x < grid.min.x || x >= grid.max.x || y < grid.min.y || y >= grid.max.y || z < grid.min.z || z >= grid.max.z || grid.data[x][y][z].visited || grid.data[x][y][z].type != 0) {
                continue;
            }

            queue.push(grid.data[x][y][z]);
        }
    }
    return total;
}

function draw(map, grid, z) {
    var buffer = "";
    

    buffer += " [Use Up and Down arrows to move on Z axis]\n";
    buffer += "  Z: " + z + "\n\n";

    for(var x = grid.min.x; x < grid.max.x; ++x) {
        var line = "";
        for(var y = grid.min.y; y < grid.max.y; ++y) {
            line += grid.data[x][y][z].type ? ".":"#";
        }
        buffer += line + "\n";
    }

    document.getElementById("show").textContent = buffer;
}

var map = buildMap();
var acc = solve1(map);

var grid = buildGrid(map);
var acc2 = solve2(map, grid);

var part1 = acc;
var part2 = acc2;

console.log("Part1: " + acc);
console.log("Part2: " + part2);
document.getElementById("show").textContent += "\n\n" + "Part1: " + part1 + "\nPart2: " + part2;

if (solution1 && solution2) {
    console.log("");
    console.log("Check solution to part1 is " + solution1 + ": " + (solution1 == part1));
    console.log("Check solution to part1 is " + solution2 + ": " + (solution2 == part2));
}

var global_z = grid.min.z;
draw(map, grid, global_z);
document.addEventListener("keydown", (event) => {
    const upString = 'ArrowUp';
    const up = 38;
    const downString = 'ArrowDown';
    const down = 40;

    if (event.key == upString && global_z < grid.max.z -1) {
        global_z++;
    } else if (event.key == downString && global_z > grid.min.z) {
        global_z--;
    }
    draw(map, grid, global_z);
})