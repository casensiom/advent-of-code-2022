var inputSrc = "data";
inputSrc = "test";
var input = document.getElementById(inputSrc).textContent;
var solution1 = document.getElementById(inputSrc).getAttribute("solution1");
var solution2 = document.getElementById(inputSrc).getAttribute("solution2");

var lines = input.split('\n');

var acc = 0;
var acc2 = 0;

var monkeys = [];
var monkey = {};

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
for(var i = 0; i < lines.length; i += (LINE_FALSE + 2)) {
  const found_id    = lines[i + LINE_ID].match(REGEX_ID);
  const found_items = lines[i + LINE_ITEMS].match(REGEX_ITEMS);
  const found_op    = lines[i + LINE_OP].match(REGEX_OP);
  const found_test  = lines[i + LINE_TEST].match(REGEX_TEST);
  const found_true  = lines[i + LINE_TRUE].match(REGEX_TRUE);
  const found_false = lines[i + LINE_FALSE].match(REGEX_FALSE);

  monkey = {
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

function copyMonkeys() {
  var temp = [];
  monkeys.forEach( m => {
    temp.push( {
      id: m.id,
      items: [...m.items], 
      op_cmd: m.op_cmd,
      op_value: m.op_value,
      test_value: m.test_value,
      on_true: m.on_true,
      on_false: m.on_false,
      count: 0
    } );
  })

  return temp;
}

// console.log(monkeys);

function solve(rounds, worry) {

  // Make a copy
  var temp = copyMonkeys();

  for(var r = 0; r < rounds; ++r) {
    // console.log("Round: " + r);
    temp.forEach(m => {
      // console.log("Monkey " + m.id + ":")
      m.items.forEach((i, idx, obj) => {
        // console.log("  Monkey inspects an item with a worry level of " + i + ".");
        var newVal = 0;
        if(m.op_value == "old") {
          newVal = eval ( i  + " " + m.op_cmd + " " + i);
        } else {
          newVal = eval ( i  + " " + m.op_cmd + " " + Number(m.op_value));
        }
        // console.log("    Worry level is " + m.op_cmd + " by " + m.op_value + " to " + newVal + ".");
        newVal = Math.floor(newVal / worry);
        // console.log("    Monkey gets bored with item. Worry level is divided by " + worry + " to " + newVal + ".");
        var isDivisible = (newVal % m.test_value) == 0;
        // console.log("    Current worry level is "+ (isDivisible ? "" : "not") + " divisible by " + m.test_value + ".")
        var dst = isDivisible ? m.on_true : m.on_false;
        // console.log("    Item with worry level " + newVal + " is thrown to monkey " + dst + ".");
        // if(dst == 2) {
        //   console.log(" [[ Monkey " + m.id + " send item " + newVal + " because is divisible by " + m.test_value + "]]");
        // }
        temp[dst].items.push(newVal);
      });
      m.count += m.items.length;
      m.items = [];
    });
    // console.log(temp);

    // if(((r + 1) % 1000) == 0 || r == 0 || r == 19) {
    //   console.log("== After round " + (r + 1) + " ==");
    //   temp.forEach(m => {
    //     console.log("Monkey " + m.id + " inspected items " + m.count + " times.");
    //   });
    // }

    // if(r < 20) {
    //   console.log("After round " + (r + 1) + ", the monkeys are holding items with these worry levels:");
    //   temp.forEach(m => {
    //     console.log("Monkey " + m.id + ": " + m.items);
    //   });
    // }

  }

  var sorted = temp.sort((a, b) => b.count - a.count);
  return sorted[0].count * sorted[1].count;
}


var part1 = solve(20, 3);

// There is a bug on part 2 that i not yet solved!
var part2 = solve(10000, 1);

console.log("Part1: " + part1);
console.log("Part2: " + part2);


if(solution1 && solution2) {
  console.log("");
  console.log("Check solution to part1 is " + solution1 + ": " + (solution1 == part1));
  console.log("Check solution to part1 is " + solution2 + ": " + (solution2 == part2));
}
