
function drawMap(map) {
    var content = "";

    var line1 = "   ";
    var line2 = "   ";
    for (var x = minX; x < maxX; ++x) {
        if (x % 5 != 0) {
            line1 += " ";
            line2 += " ";
            continue;
        }
        line1 += Math.floor(Math.abs(x) / 10);
        line2 += Math.abs(x) % 10;

    }
    content += line1 + "\n";
    content += line2 + "\n";
    map.forEach((row, y) => {
        var pos = (y + minY);
        var line = "" + pos;
        if (pos < 0) {
        } else if (pos < 10) {
            line = "0" + line;
        }
        content += line + " " + row.join("") + "\n";
    });
    document.getElementById("drawMap").textContent = content;
}

function drawResize(box, w, h) {
    var rw = w / WIDTH;
    if (h === undefined) {
        h = HEIGHT * rw;
    }
    var rh = h / HEIGHT;

    var content = "";
    var instructions = "  ----  [[Ctrl + Wheel: Zoom]]  [[Shift + Mouse: Pan]]  [[DblClick: Reset]]";
    content += "scale: " + w + ", inc:" + scaleInc + ", box: " + box.sx + ", " + box.ex + ", " + box.sy + ", " + box.ey + " " + instructions + "\n";

    var line1 = "         ";
    var line2 = "         ";
    for (var x = box.sx; x < box.ex; x += 10) {
        var pos = Math.floor(x / rw);
        var num = "" + pos;
        line1 += num + " ".repeat(10 - num.length);
        line2 += "v" + " ".repeat(9);
    }
    content += line1 + "\n";
    content += line2 + "\n";
    var start = 97; // 'a';

    //var myData = data.filter(v => Math.abs(v.sensor.y - row1) < v.dist);
    var myData = data.sort((a, b) => a.dist - b.dist);

    var sol = Math.floor(row1 * rw);

    for (var y = box.sy; y < box.ey; ++y) {
        // if (Math.floor(y / rh) > freq1)
        //     continue;

        var pos = Math.floor(y / rh);
        var num = "" + pos;
        if (num.length < 8) {
            num = " ".repeat(8 - num.length) + num;
        }


        content += num + " "
        for (var x = box.sx; x < box.ex; ++x) {
            start = (Math.floor(y / rh) < 0 || Math.floor(y / rh) > freq1 || Math.floor(x / rw) < 0 || Math.floor(x / rw) > freq1) ? 48 : 97;
            // if (Math.floor(x / rw) > freq1) {
            //     // continue;
            // }

            var c = '.'
            if (myData.filter(v => Math.floor(v.sensor.x * rw) == x && Math.floor(v.sensor.y * rh) == y).length > 0)
                c = "S"
            else if (myData.filter(v => Math.floor(v.beacon.x * rw) == x && Math.floor(v.beacon.y * rh) == y).length > 0)
                c = "B"
            else if (myData.some((d, i) => {
                if (manhattanDist(d.sensor, { x: Math.floor(x / rw), y: Math.floor(y / rh) }) <= d.dist) {
                    c = String.fromCharCode(start + i);
                    return true;
                }
            }))
                c = c;
            // else {
            //     const a = myData.filter((d, i) => manhattanDist(d.sensor, { x: Math.floor(x / rw), y: Math.floor(y / rh) }) <= d.dist);
            //     if (a.length > 0) {
            //         c = String.fromCharCode('a'.charCodeAt(0) + a.length);
            //     }
            // }
            content += c;
        }
        content += "\n"
    }
    document.getElementById("drawMap").textContent = content;
}


document.addEventListener("wheel", (event) => {
    var mult = 1;
    if (!event.altKey) {
        return;
    }
    if (event.shiftKey) {
        mult = 10;
    }
    // event.preventDefault();
    // instance.zoom({
    //     deltaScale: Math.sign(event.deltaY) > 0 ? -1 : 1,
    //     x: event.pageX,
    //     y: event.pageY
    // });
    if (event.deltaY != 0) {
        var i = 0;
    }
    scale += Math.floor(event.deltaY) * mult;
});
document.addEventListener("dblclick", () => {
    startX = -20;
    startY = -20;
    sizeX = 200;
    sizeY = 60;
    scale = WIDTH > 100 ? 100 : 28;;
});
document.addEventListener("mousemove", (event) => {
    if (!event.shiftKey) {
        return;
    }
    event.preventDefault();
    // instance.panBy({
    //     originX: event.movementX,
    //     originY: event.movementY
    // });

    startX += event.movementX;
    startY += event.movementY;
})

