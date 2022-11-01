var canvas = document.querySelector("canvas")
var ctx = canvas.getContext("2d")

// set image data
canvas.width = window.innerWidth
canvas.height = window.innerHeight
// canvas.width = 1920 * 2
// canvas.height = 1080 * 2

var width = canvas.width,
    height = canvas.height
    
    
function Draw(s, offx, offy, r, i) {
    ctx.putImageData(
        fractal.createFractal("Julia", width, height, {scale: s, offsetX: offx, offsetY: offy, c: {r: r, i: i}}),
    0, 0)
}


var offset = {x: 0, y: 0}
var scale = 0.5
var c = {r: -1, i: 0}

function set (f) {
    ctx.putImageData(fractal.createFractal(f, width, height), 0, 0)
    offset = (f.option.offset != undefined) ? f.option.offset : offset
    scale = (f.option.scale != undefined) ? f.option.scale : scale
    c = (f.option.c != undefined) ? f.option.c : c
}

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
    PickerJulia.innerHTML = "Julia: " + fractal.Julia(x, y, width, height, {scale: scale, offsetX: offset.x, offsetY: offset.y, c: {r: c.r, i: c.i}, color: false, smooth: false})
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