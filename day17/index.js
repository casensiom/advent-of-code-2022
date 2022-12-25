var inputSrc = "data";
inputSrc = "test";
var input = document.getElementById(inputSrc).textContent;
var solution1 = document.getElementById(inputSrc).getAttribute("solution1");
var solution2 = document.getElementById(inputSrc).getAttribute("solution2");

var lines = input;

var stopCount1 = 2022;
var stopCount2 = 1000000000000;
var stopCount = stopCount1;

var pieces = [
    ["@@@@"],

    [".@.",
     "@@@",
     ".@."],

    ["..@",
     "..@",
     "@@@"],

    ["@",
     "@",
     "@",
     "@"],

    ["@@",
     "@@"]];
var currentPiece = {id: 0, data: null, x: 0, y: 0, w:0, h:0};

function buildMap(w, h) {
    var map = { w: w, h: h, max: 0, resize: 0, buffer: Array(h).fill(0).map(() => Array(w).fill("."))};
    return map;
}

function increaseMax(map, max) {
    var repeat = max - map.max ;

    map.max = max;
    while(repeat > 0) {
        map.buffer.unshift(Array(map.w).fill("."));
        map.h++;
        repeat--;
    }

    // Reshape
    var maxH = Array(map.w).fill(0);
    for(var x = 0; x < map.w; ++x) {
        for(var y = 0; y <  map.h; ++y) {
            if(map.buffer[y][x] != ".") {
                maxH[x] = map.h - y - 1;
                break;
            }
        }
    }

    var min = maxH.reduce((a,b) => Math.min(a, b), map.h);
    if(min > 0) min--;
    map.buffer.slice(-min);
    map.max-= min;
    map.h -= min;
    map.resize += min;
}

function draw(map, piece, time) {
    var buffer = "";
    
    var vert = 3;
    var spaces = 5;


    const pw = piece.w;
    const ph = piece.h;
    const px = piece.x;
    const py = piece.y;
    for(var y = 0; y < map.h; ++y) {
        var line = "";
        for(var x = 0; x < map.w; ++x) {
            if (piece.data != null && x >= px && x < px + pw && y >= py && y < py + ph) 
                line += piece.data[y-py][x-px]; 
            else 
                line += map.buffer[y][x];
        }
        buffer +=  "|" + line + "|";
        if(y >= vert) {

            info= ["Current height: " + (map.max + map.resize + ((map.h - map.max) - piece.y)), 
            " Current rock: " + counter, 
            " ".repeat(spaces) + "" + lines,
            " ".repeat(spaces) + " ".repeat(time % lines.length) + "^ next action: [" + lines[time % lines.length] + "]"];

            if(y - vert < info.length) {
                buffer += info[y -vert];
            }
        }
        buffer += "\n";
    }

    buffer += "-".repeat(map.w+2) + "\n";


    document.getElementById("show").textContent = buffer;
    return buffer;
}

function setPiece(id, map) {
    currentPiece.id = id % pieces.length;
    currentPiece.data = pieces[currentPiece.id];
    currentPiece.w = currentPiece.data[0].length;
    currentPiece.h = currentPiece.data.length;
    currentPiece.x = 2;
    currentPiece.y = map.h - (map.max + 3 + currentPiece.h);
}

function check(map, piece, offsetx, offsety) {
    var px = piece.x + offsetx;
    var py = piece.y + offsety;

    if(px < 0 || px + piece.w > map.w || py + piece.h > map.h) {
        return false;
    }

    for(var y = 0; y < piece.h; ++y) {
        if(y + py < 0) continue;
        for(var x = 0; x < piece.w; ++x) {
            if(piece.data[y][x] != "." && map.buffer[y + py][x + px] != ".")
                return false;
        }
    }
    return true;
}

var counter = 0;
function nextPiece(map, piece, time) {
    var px = piece.x;
    var py = piece.y;
    for(var y = 0; y < piece.h; ++y) {
        for(var x = 0; x < piece.w; ++x) {
            if(piece.data[y][x] != ".") {
                map.buffer[y + py][x + px] = "#";
            }
        }
    }

    draw(map, piece, time);

    counter++;
    if(counter == stopCount) {
        console.log(map.max + map.resize + piece.h);
        stopAnimation = true;
        return;
    }


    increaseMax(map, Math.max(map.max, map.h - piece.y));
    setPiece(piece.id + 1, map);
}

function move_piece(pattern, time, map) {

    var action = pattern[time % pattern.length];
    if(action == "<" && check(map, currentPiece,  -1, 0)) currentPiece.x-=1;
    if(action == ">" && check(map, currentPiece,  1, 0)) currentPiece.x+=1;
    if(check(map, currentPiece, 0, 1)) currentPiece.y+=1; else nextPiece(map, currentPiece, time);
}

function solve(map, count) {
    return 0;
    while(count > 0) {
        simulateRock();
    }
    return getHeight();
}

var time = 0;
var stopAnimation = false;
var map = buildMap(7, 10);
setPiece(time, map);

var acc = solve(map, 2022);
var acc2 = solve(map, 1000000000000);

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

function processLoop(type) {
    if(type == "animation") {
        move_piece(lines, time, map);
        time++;
        if(!stopAnimation) {
            setTimeout(processLoop, 10, type);
        }
    } else if(type == "event") {
        document.addEventListener("keydown", (event) => {
            if (event.shiftKey) {
                if(!stopAnimation) {
                    move_piece(lines, time, map);
                    time++;
                }
            }
        })        
    } else if(type == "fast") {
        while(!stopAnimation) {
            move_piece(lines, time, map);
            time++;
        }
    }
}
// processLoop("animation");
// processLoop("event");
processLoop("fast");


(function drawLoop() {
    draw(map, currentPiece, time);
    if(!stopAnimation) {
        setTimeout(drawLoop, 100);
    }
})();


