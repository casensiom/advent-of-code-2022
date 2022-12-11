var input = document.getElementById("data").textContent;
// input = document.getElementById("test").textContent;
var lines = input.split('\n');

var acc = 0;
var acc2 = 0;

var values = {"A": 1,"B": 2,"C": 3, "X": 1,"Y": 2,"Z": 3};

for(var i = 0; i < lines.length; ++i) {
    var l1 = lines[i][0];
    var l2 = lines[i][2];

    var shape1 = values[l1];
    var shape2 = values[l2];
    var diff = (shape1 - shape2);

    var val = (diff == 0) ? 3 : ((diff == -1 || diff == 2) ? 6 : 0);
    acc += val + shape2;

    if(shape2 == 2) {
        shape2 = shape1;
        val = 3;
    } else if(shape2 == 1) {
        shape2 = (shape1 - 1);
        if(shape2 < 1)
            shape2 = 3;
        val = 0;
    } else if(shape2 == 3) {
        shape2 = (shape1 + 1);
        if(shape2 > 3)
            shape2 = 1;
        val = 6;
    }

    acc2 += val + shape2;
}


console.log("Part1: " + acc);
console.log("Part2: " + acc2);
