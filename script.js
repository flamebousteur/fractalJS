var canvas = document.querySelector("canvas")
var ctx = canvas.getContext("2d")

function getGradientColor(percentage, gradient = []) {
    if (gradient.length == 0) {
        // gradient color (rgba) and percentage (0-100)
        gradient = [
            // rgba
            /*
            {color: {r: 255, g: 0, b: 0, a: 255}, percentage: 0},
            {color: {r: 255, g: 255, b: 0, a: 255}, percentage: 25},
            {color: {r: 0, g: 255, b: 0, a: 255}, percentage: 50},
            {color: {r: 0, g: 255, b: 255, a: 255}, percentage: 75},
            {color: {r: 0, g: 0, b: 255, a: 255}, percentage: 100},
            */
            // black and white
            {color: {r: 0, g: 0, b: 0, a: 255}, percentage: 0},
            {color: {r: 255, g: 255, b: 255, a: 255}, percentage: 100},
        ]
    }
    return gradient.reduce((prev, curr) => {
        if (percentage >= prev.percentage && percentage <= curr.percentage) {
            let percentageInRange = (percentage - prev.percentage) / (curr.percentage - prev.percentage)
            let color = {
                r: prev.color.r + (curr.color.r - prev.color.r) * percentageInRange,
                g: prev.color.g + (curr.color.g - prev.color.g) * percentageInRange,
                b: prev.color.b + (curr.color.b - prev.color.b) * percentageInRange,
                a: 255
            }
            return color
        }
        return prev
    })
}

// return the color of the pixel with the Julia fractal algorithm
/*
cool figures:
{
    c: {
        r:-1.3,
        i:0.07
    },
    offset: {
        x:0,
        y:0
    },
    scale: 0.45,
}
*/
function Julia(x, y, width, height, iterations = 100, option = {scale: 0.5, offsetX: 0, offsetY: 0, c: {r: 0, i: 0}, color: true}, smooth = true) {
    // center the fractal, move it and scale it
    var x = (x - width / 2) / (width / 2) / option.scale + option.offsetX
    var y = (y - height / 2) / (height / 2) / option.scale / (width / height) + option.offsetY

    var i = 0
    while (x * x + y * y < 4 && i < iterations) {
        var xtemp = x * x - y * y + option.c.r
        y = 2 * x * y + option.c.i
        x = xtemp
        i++
    }

    if (smooth) {
        let log_zn = Math.log(x * x + y * y) / 2
        let nu = Math.log(log_zn / Math.log(2)) / Math.log(2)
        ni = i + 1 - nu
    }

    if (option.color) {
        var color = {r: 0, g: 0, b: 0}
        if (i == iterations) color = {r: 255, g: 255, b: 255}
        else color = getGradientColor(ni / iterations * 100)
        return color
    } else return i
}

// return the color of the pixel with the newton fractal algorithm
function Newton(pos_x, pos_y, width, height, iterations = 100, points = [{x: 0, y: 0, c: {r: 0, g: 0, b: 0, a: 255}}], option = {scale: 0.5, offsetX: 0, offsetY: 0}, smooth = true) {
    var x = [0, 0],
        p1 = points[0],
        p2 = points[1],
        p3 = points[2],
        num = [0, 0],
        denom = [0, 0],
        threshold = 0.001,
        d_1 = Math.sqrt((x[0] - p1.x) * (x[0] - p1.x) + (x[1] - p1.y) * (x[1] - p1.y))
        d_2 = Math.sqrt((x[0] - p2.x) * (x[0] - p2.x) + (x[1] - p2.y) * (x[1] - p2.y))
        d_3 = Math.sqrt((x[0] - p3.x) * (x[0] - p3.x) + (x[1] - p3.y) * (x[1] - p3.y))
        d_min = Math.min(d_1, d_2, d_3)
    var i = 0,
        color = {r: 0, g: 0, b: 0, a: 255}
    
    // center the fractal, move it and scale it
    x[0] = (pos_x - width / 2) / (width / 2) / option.scale + option.offsetX
    x[1] = (pos_y - height / 2) / (height / 2) / option.scale / (width / height) + option.offsetY

    while (i < iterations && d_min > threshold) {
        // multiply_3(subtract(x, p_1), subtract(x, p_2), subtract(x, p_3))
        num = [(x[0] - p1.x) * (x[0] - p2.x) * (x[0] - p3.x), (x[1] - p1.y) * (x[1] - p2.y) * (x[1] - p3.y)]
        // denom = add_3(multiply(subtract(x, p_2), subtract(x, p_3)), multiply(subtract(x, p_1), subtract(x, p_3)), multiply(subtract(x, p_1), subtract(x, p_2)));
        denom = [(x[0] - p2.x) * (x[0] - p3.x) + (x[0] - p1.x) * (x[0] - p3.x) + (x[0] - p1.x) * (x[0] - p2.x), (x[1] - p2.y) * (x[1] - p3.y) + (x[1] - p1.y) * (x[1] - p3.y) + (x[1] - p1.y) * (x[1] - p2.y)]
        // x = subtract(x, divide(num, denom));
        x = [x[0] - num[0] / denom[0], x[1] - num[1] / denom[1]]
        // d_1 = length(subtract(x, p_1));
        d_1 = Math.sqrt((x[0] - p1.x) * (x[0] - p1.x) + (x[1] - p1.y) * (x[1] - p1.y))
        // d_2 = length(subtract(x, p_2));
        d_2 = Math.sqrt((x[0] - p2.x) * (x[0] - p2.x) + (x[1] - p2.y) * (x[1] - p2.y))
        // d_3 = length(subtract(x, p_3));
        d_3 = Math.sqrt((x[0] - p3.x) * (x[0] - p3.x) + (x[1] - p3.y) * (x[1] - p3.y))
        // d_min = min(d_1, d_2, d_3);
        d_min = Math.min(d_1, d_2, d_3)
        i++
    }

    var color_value = 0

    if (smooth) color_value = 0.6 + 0.4 * Math.cos(0.25 * (i - Math.log2(Math.log(d_min) / Math.log(threshold))));
    else color_value = 0.6 + 0.4 * Math.cos(0.25 * i);

    if (i == iterations) color = {r: 0, g: 0, b: 0, a: 255}
	else if (d_1 < d_2 && d_1 < d_3) color = (1 * color_value, 0, 0.3 * color_value, 1);
	else if (d_2 < d_1 && d_2 < d_3) color = (0, 1 * color_value, 0.3 * color_value, 1);
	else color = (0, 0.3 * color_value, 1 * color_value, 1);
    return color
}

// set image data
canvas.width = window.innerWidth
canvas.height = window.innerHeight
// canvas.width = 1920 * 2
// canvas.height = 1080 * 2

var width = canvas.width,
    height = canvas.height,
    img = new ImageData(width, height)


function Draw(s, offx, offy, r, i) {
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var color = Julia(x, y, width, height, 100, {scale: s, offsetX: offx, offsetY: offy, c: {r: r, i: i}, color: true})
            /*
            var color = Newton(x, y, width, height, 100,
                [
                    {x: 1, y: 0, c: {r: 255, g: 0, b: 0, a: 255}},
                    {x: 0.5, y: 0.8660254037844386, c: {r: 0, g: 255, b: 0, a: 255}},
                    {x: 0.5, y: -0.8660254037844386, c: {r: 0, g: 0, b: 255, a: 255}}
                ],
            {scale: s, offsetX: offx, offsetY: offy}, true)
            */
            img.SetPixel(x, y, {r: color.r, g: color.g, b: color.b, a:255})
        }
    }
    ctx.putImageData(img, 0, 0)
}

var offset = {x: 0, y: 0}
var scale = 0.5
var c = {r: -1, i: 0}

function Update() {
    Draw(scale, offset.x, offset.y, c.r, c.i)
}

window.onbeforeunload = function () {
    // save the data (scale, offset, c)
    localStorage.setItem("pos", JSON.stringify({scale: scale, offset: offset, c: c}))
}

window.onload = function () {
    if (localStorage.key("pos")) {
        // load the data (scale, offset, c)
        var pos = JSON.parse(localStorage.getItem("pos"))
        scale = pos.scale
        offset = pos.offset
        c = pos.c
    }
    Update()
}


// move the fractal: click and drag
// stop moving: release the mouse button
canvas.addEventListener("mousedown", function (e) {
    var mouse = {
        x: e.clientX,
        y: e.clientY
    }
    canvas.onmousemove = function (e) {
        offset.x -= (e.clientX - mouse.x) / scale / 500
        offset.y -= (e.clientY - mouse.y) / scale / 500
        mouse.x = e.clientX
        mouse.y = e.clientY
        Update()
        canvas.style.cursor = "grabbing"
    }
    canvas.addEventListener("mouseup", function (e) {
        canvas.onmousemove = null
        canvas.style.cursor = "grab"
    })
})

// zoom the fractal
canvas.addEventListener("wheel", (e) => {
    if (e.deltaY < 0) {
        scale *= 1.5
    } else {
        scale /= 1.5
    }
    Update()
})


var controls = document.getElementById("control")

// mouve the control panel
controls.addEventListener("mousedown", function (e) {
    if (e.target != controls) return
    var mouse = {
        x: e.clientX,
        y: e.clientY
    }
    document.onmousemove = function (e) {
        controls.style.left = controls.offsetLeft + e.clientX - mouse.x + "px"
        controls.style.top = controls.offsetTop + e.clientY - mouse.y + "px"
        mouse.x = e.clientX
        mouse.y = e.clientY
    }
    controls.addEventListener("mouseup", function (e) {
        document.onmousemove = null
    })
})

// change the ioffset of the fractal
var div = document.createElement("div")
var ioffEle = document.createElement("input")
var ioffLabel = document.createElement("label")
ioffLabel.innerHTML = "IOffset: " + c.i
ioffEle.type = "range"
ioffEle.defaultValue = c.i
ioffEle.min = -100
ioffEle.max = 100
ioffEle.addEventListener("input", function (e) {c.i = e.target.value / 100; ioffLabel.innerHTML = "IOffset: " + c.i;})
div.appendChild(ioffEle)
div.appendChild(ioffLabel)
controls.appendChild(div)

// change the roffset of the fractal
var div = document.createElement("div")
var roffEle = document.createElement("input")
var roffLabel = document.createElement("label")
roffLabel.innerHTML = "ROffset: " + c.r
roffEle.type = "range"
roffEle.defaultValue = c.r * 100
roffEle.min = -100
roffEle.max = 100
roffEle.addEventListener("input", function (e) {c.r = e.target.value / 100; roffLabel.innerHTML = "ROffset: " + c.r;})
div.appendChild(roffEle)
div.appendChild(roffLabel)
controls.appendChild(div)

// submit the changes
var submit = document.createElement("button")
submit.innerHTML = "submit"
submit.addEventListener("click", function (e) {Update()})
controls.appendChild(submit)

// animate the fractal
var div = document.createElement("div")
var animate = document.createElement("input")
var animateLabel = document.createElement("label")
animateLabel.innerHTML = "Animate"
animate.type = "checkbox"
function an() {
    if (animate.checked) {
        if (c.i > 1) c.i = -1
        if (c.r > 1) c.r = -1
        c.i += 0.01
        c.r += 0.01
        Update()
        requestAnimationFrame(an)
    } else {
        cancelAnimationFrame(an)
    }
}
animate.addEventListener("change", function (e) {an()})
div.appendChild(animate)
div.appendChild(animateLabel)
controls.appendChild(div)

// pick a color from the image
var div = document.createElement("div")
var colorPicker = document.createElement("div")
var colorPickerLabel = document.createElement("label")
var PickerJulia = document.createElement("span")
colorPickerLabel.innerHTML = "Pick a color"
colorPicker.style.width = "20px"
colorPicker.style.height = "20px"
colorPicker.style.border = "1px solid black"
colorPicker.style.backgroundColor = "white"
PickerJulia.innerHTML = "Julia"
canvas.addEventListener("mousemove", function (e) {
    var x = e.offsetX
    var y = e.offsetY
    var color = ctx.getImageData(x, y, 1, 1).data
    colorPicker.style.backgroundColor = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")"
    colorPickerLabel.innerHTML = "Pick a color: " + color[0] + ", " + color[1] + ", " + color[2]
    PickerJulia.innerHTML = "Julia: " + Julia(x, y, width, height, 100, {scale: scale, offsetX: offset.x, offsetY: offset.y, c: {r: c.r, i: c.i}, color: false}, false)
})
div.id = "colorPicker"
div.appendChild(colorPicker)
div.appendChild(colorPickerLabel)
div.appendChild(PickerJulia)
controls.appendChild(div)

// download the image
var download = document.createElement("button")
download.innerHTML = "download"
download.addEventListener("click", function (e) {
    var link = document.createElement("a")
    link.download = "fractal.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
})
controls.appendChild(download)