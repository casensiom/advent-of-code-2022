var inputSrc = "data";
// inputSrc = "test";
var input = document.getElementById(inputSrc).textContent;
var solution1 = document.getElementById(inputSrc).getAttribute("solution1");
var solution2 = document.getElementById(inputSrc).getAttribute("solution2");

var lines = input.split("\n");


function buildMap() {
    data = [];
    lines.forEach(l => {
        const regex = /Valve ([A-Z]*) has flow rate=(-?\d*); tunnels? leads? to valves? (.*)/
        const found = l.match(regex);
        data.push({ valve: found[1], flow: Number(found[2]), adjacent: found[3].split(", "), paths: {} });
    });

    //fillPaths(data);
    data.forEach(src => {
        src.paths[src.valve] = 0;
        var queue = [];
        var visited = new Set();

        queue.push(src);
        while(queue.length > 0) {
            var current = queue.shift();
            for(const key of current.adjacent) {
                if(visited.has(key)) continue;
                visited.add(key);
                src.paths[key] = (src.paths[current.valve] || 0) + 1;
                queue.push(data.filter(v => v.valve == key)[0]);
            }
        }
    });

    return data;
}


function recursive(visited, pending, t) {
    if (t < 0 || pending.length == 0) {
        return 0;
    }

    var maxFlow = 0;
    var current = visited.at(-1);
    for (const next of pending) {
        var duration = current.paths[next.valve] + 1;
        var remain = t - duration;
        if(remain <= 0) continue;
        var computed = remain * next.flow;
        var f = recursive(visited.concat(next), pending.filter(p => p.valve != next.valve), remain);
        if (f + computed > maxFlow) {
            maxFlow = f + computed;
        }
    }
    return maxFlow;
}

// javascript is absolutely evil, this function is just the same as the above
function crazy_recursive(v, r, t) {
    if(t == 0) return 0;
    var c = v.at(-1);
    return r.filter(n => c.paths[n.valve] < t).reduce((a,n) => Math.max(a, crazy_recursive(v.concat(n), r.filter(p => p.valve != n.valve), t - c.paths[n.valve] - 1) + (t - c.paths[n.valve] - 1) * n.flow ), 0);
}


function crazy_recursive2(v, r, t) {
    var c = v.at(-1);
    var all = r.filter(n => c.paths[n.valve] < t).reduce((a,n) => [...a, crazy_recursive2(v.concat(n), r.filter(p => p.valve != n.valve), t - c.paths[n.valve] - 1) + (t - c.paths[n.valve] - 1) * n.flow ], []);
    return (all.length == 0) ? crazy_recursive(v, r, 26) : all.reduce((a, b) => Math.max(a, b), 0);
}


function iterative(nodes, start, time) {

    var queue = [];
    const first = nodes.filter(v => v.valve == start)[0];

    queue.push({node: first, remainingTime: time, releasedFlow: 0, openFlow:0, visited: new Set()});

    var maxFlow = 0;
    while(queue.length > 0) {
        const current = queue.shift();

        var pending = nodes.filter(v => !current.visited.has(v.valve) && v.flow > 0);
        if(pending.length == 0) {
            // compute flow
            var flow = current.releasedFlow + current.remainingTime * current.openFlow;
            if(maxFlow < flow) {
                maxFlow = flow;
            }
        } else {
            for(const key in pending) {
                
                var next     = pending[key];
                var steps    = current.node.paths[next.valve] + 1;
                var released = current.releasedFlow + steps * current.openFlow;
                var remain   = current.remainingTime - steps;

                if(remain > 0) {
                    // queue
                    var visited = new Set(current.visited);
                    visited.add(next.valve);
                    queue.push({node: next, remainingTime: remain, releasedFlow: released, openFlow: current.openFlow + next.flow, visited: visited});
                } else {
                    // compute flow
                    var flow = current.releasedFlow + current.remainingTime * current.openFlow;
                    if(maxFlow < flow) {
                        maxFlow = flow;
                        console.log(current.visited);
                    }
                }
            }
        }
    }
    return maxFlow;
}



function iterative2(nodes, start, blocked, time) {

    var queue = [];
    const first = nodes.filter(v => v.valve == start)[0];

    queue.push({node: first, remainingTime: time, releasedFlow: 0, openFlow:0, visited: new Set()});

    var best = {flow: 0, visited: new Set()};
    while(queue.length > 0) {
        const current = queue.shift();

        var pending = nodes.filter(v => !blocked.has(v.valve) && !current.visited.has(v.valve) && v.flow > 0);
        if(pending.length == 0) {
            // compute flow
            var flow = current.releasedFlow + current.remainingTime * current.openFlow;
            if(best.flow < flow) {
                best.flow = flow;
                best.visited = current.visited;
            }
        } else {
            for(const next of pending) {
                var steps    = current.node.paths[next.valve] + 1;
                var released = current.releasedFlow + steps * current.openFlow;
                var remain   = current.remainingTime - steps;

                if(remain > 0) {
                    // queue
                    var visited = new Set(current.visited);
                    visited.add(next.valve);
                    queue.push({node: next, remainingTime: remain, releasedFlow: released, openFlow: current.openFlow + next.flow, visited: visited});
                } else {
                    // compute flow
                    var flow = current.releasedFlow + current.remainingTime * current.openFlow;
                    if(best.flow < flow) {
                        best.flow = flow;
                        best.visited = current.visited;
                    }
                }
            }
        }
    }
    return best;
}


function solve1(map) {
    var node = "AA";
    return recursive(map.filter(v => v.valve == node), map.filter(v => v.valve != node && v.flow > 0), 30);
    return iterative(map, node, 30);
}

// NOT WORKING ! !
function solve2(map) {
    var node = "AA";
    //return recursive2(map.filter(v => v.valve == node), map.filter(v => v.valve != node && v.flow > 0), 26);

    var best = {flow: 0, visited: new Set()};
    for(var p = 0; p < 2; ++p) {
        var result = iterative2(map, node, best.visited, 26);
        best.flow += result.flow;
        for (const elem of result.visited) {
            best.visited.add(elem);
        }
    }
    return best.flow;
}

var map = buildMap();
var acc = solve1(map);
var acc2 = 0; // solve2(map); // Not working yet

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



