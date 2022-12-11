var input = document.getElementById("data").textContent;
// input = document.getElementById("test").textContent;


var lines = input.split('\n');
var path = "";
var sizes = [];

for(var i = 0; i < lines.length; i++) {
  const action = /\$ (cd|ls) ?(.*)/;
  const found = lines[i].match(action);
  if(!found) continue;
  
  var cmd = found[1];
	if(cmd === "cd") {
	  var pth = found[2];
  	if(pth == "..") {
      path = path.substring(0, path.lastIndexOf('/'));
    } else if(pth == "/") {
    	path = "/";
    } else {
    	if(path[path.length - 1] != '/') {
	      path += "/";
      }
    	path += pth;
    }
    // console.log("Move to: " + path);
  } else if(found[1] === "ls") {
  	var j = i + 1;
    var s = 0;
    // console.log("List content of: " + path);
  	while(j < lines.length && lines[j][0] != '$') {
    	// console.log("  - " + lines[j]);
      const action = /(dir|[0-9]*) (.*)/;
      const found = lines[j].match(action);
      if(!found) continue;
  		if(found[1] != "dir") {
      	s += Number(found[1]);
      }
    	j++;
    }
    // console.log("Total size of: " + s + " bytes");
    i = j - 1;
    
    // store it
    sizes.push({"path":path, "size":s});
  }
}


sizes.sort((a, b) => { return a.path.length < b.path.length});
sizes.reverse();
// console.log(sizes);

// fill zeroes
var fullsize = [];
for(var i = 0; i < sizes.length; ++i) {
	const find = sizes[i].path;
  const size = sizes[i].size;
  const matches = sizes.filter(item => item.path.startsWith(find) && item.path.length > find.length);
  const sum = matches.flatMap(item => item.size).reduce((acc, v) => acc + v, 0);
  //console.log(sum);

  fullsize.push({"path":find, "size":(size + sum)});
}
// console.log(fullsize);

const matches = fullsize.filter(item => item.size < 100000);
const sum = matches.flatMap(item => item.size).reduce((acc, v) => acc + v, 0);
console.log("Part1: " + sum);

const total = 70000000;
const needed = 30000000;
const used = fullsize.filter(item => item.path == "/")[0].size; // 42677139;
const free = total - used;
const diff = needed - free;

var dirs = fullsize.filter(item => item.size > diff);
dirs = dirs.sort((a, b) => { return a.size - b.size});
console.log("Part2: " + dirs[0].size);


