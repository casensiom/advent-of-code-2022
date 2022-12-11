var inputSrc = "data";
// inputSrc = "test";
var input = document.getElementById(inputSrc).textContent;
var solution1 = document.getElementById(inputSrc).getAttribute("solution1");
var solution2 = document.getElementById(inputSrc).getAttribute("solution2");

var lines = input.split('\n');

const LINE_ID = 0;
const LINE_ITEMS = 1;
const LINE_OP = 2;
const LINE_TEST = 3;
const LINE_TRUE = 4;
const LINE_FALSE = 5;

const REGEX_ID    = /Monkey ([0-9]*):/;
const REGEX_ITEMS = /  Starting items: ([, 0-9]*)/;
const REGEX_OP    = /  Operation: new = old (.) (.*)/;
const REGEX_TEST  = /  Test: divisible by ([0-9]*)/;
const REGEX_TRUE  = /    If true: throw to monkey ([0-9]*)/;
const REGEX_FALSE = /    If false: throw to monkey ([0-9]*)/;

// get data
function parseData() {
  var monkeys = [];
  for(var i = 0; i < lines.length; i += (LINE_FALSE + 2)) {
    const found_id    = lines[i + LINE_ID].match(REGEX_ID);
    const found_items = lines[i + LINE_ITEMS].match(REGEX_ITEMS);
    const found_op    = lines[i + LINE_OP].match(REGEX_OP);
    const found_test  = lines[i + LINE_TEST].match(REGEX_TEST);
    const found_true  = lines[i + LINE_TRUE].match(REGEX_TRUE);
    const found_false = lines[i + LINE_FALSE].match(REGEX_FALSE);

    var monkey = {
      id: Number(found_id[1]),
      items: found_items[1].split(", ").map(x => Number(x)), 
      op_cmd: found_op[1],
      op_value: found_op[2],
      test_value: Number(found_test[1]),
      on_true: Number(found_true[1]),
      on_false: Number(found_false[1]),
      count: 0
    };

    monkeys.push(monkey);
  }
  return monkeys;
}


function solve(rounds, factor) {
  var monkeys = parseData();

  // Compute Least common multiple
  let lcm = monkeys.map(({test_value}) => test_value).reduce((a, b) => a * b);

  for(var r = 0; r < rounds; ++r) {
    monkeys.forEach(m => {
      m.items.forEach((w, idx, obj) => {
        var worry = 0;
        if(m.op_value == "old") {
          worry = eval ( w  + " " + m.op_cmd + " " + w);
        } else {
          worry = eval ( w  + " " + m.op_cmd + " " + Number(m.op_value));
        }

        worry %= lcm;  // Keep the numbers the lower as possible

        worry = Math.floor(worry / factor);
        var dst = ((worry % m.test_value) == 0) ? m.on_true : m.on_false;
        monkeys[dst].items.push(worry);
      });
      m.count += m.items.length;
      m.items = [];
    });
  }

  var sorted = monkeys.sort((a, b) => b.count - a.count);
  return sorted[0].count * sorted[1].count;
}


var part1 = solve(20, 3);
var part2 = solve(10000, 1);

console.log("Part1: " + part1);
console.log("Part2: " + part2);

if(solution1 && solution2) {
  console.log("");
  console.log("Check solution to part1 is " + solution1 + ": " + (solution1 == part1));
  console.log("Check solution to part1 is " + solution2 + ": " + (solution2 == part2));
}
