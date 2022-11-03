var canvas = document.querySelector("canvas")
var ctx = canvas.getContext("2d")

// set image data
canvas.width = window.innerWidth
canvas.height = window.innerHeight
// canvas.width = 1920 * 2
// canvas.height = 1080 * 2

var width = canvas.width,
    height = canvas.height

var option = {
        algorithm: "Julia",
        offset: {x: 0, y: 0},
        scale: 0.5,
        c: {r: -1, i: 0},
    }

console.log("a",option)

function Update(opt = null) {
    if (opt != null) option = opt
    ctx.putImageData(fractal.createFractal(width, height, option, function(percent) {
        console.log(percent + "%")
    }), 0, 0)
}

window.onbeforeunload = function () {
    // save the data (scale, offset, c)
    localStorage.setItem("data", JSON.stringify(option))
}

window.onload = function () {
    if (localStorage.key("data") != null) {
        // load the data (scale, offset, c)
        var data = JSON.parse(localStorage.getItem("data"))
        option = data
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
        option.offset.x -= (e.clientX - mouse.x) / option.scale / 500
        option.offset.y -= (e.clientY - mouse.y) / option.scale / 500
        mouse.x = e.clientX
        mouse.y = e.clientY
        canvas.style.cursor = "grabbing"
        Update()
    }
    canvas.addEventListener("mouseup", function (e) {
        canvas.onmousemove = null
        canvas.style.cursor = "grab"
    })
})

// zoom the fractal
canvas.addEventListener("wheel", (e) => {
    if (e.deltaY < 0) option.scale *= 1.5
    else option.scale /= 1.5
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
ioffLabel.innerHTML = "IOffset: " + option.c.i
ioffEle.type = "range"
ioffEle.defaultValue = option.c.i
ioffEle.min = -100
ioffEle.max = 100
ioffEle.addEventListener("input", function (e) {option.c.i = e.target.value / 100; ioffLabel.innerHTML = "IOffset: " + option.c.i;})
div.appendChild(ioffEle)
div.appendChild(ioffLabel)
controls.appendChild(div)

// change the roffset of the fractal
var div = document.createElement("div")
var roffEle = document.createElement("input")
var roffLabel = document.createElement("label")
roffLabel.innerHTML = "ROffset: " + option.c.r
roffEle.type = "range"
roffEle.defaultValue = option.c.r * 100
roffEle.min = -100
roffEle.max = 100
roffEle.addEventListener("input", function (e) {option.c.r = e.target.value / 100; roffLabel.innerHTML = "ROffset: " + option.c.r;})
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
        if (option.c.i > 1) option.c.i = -1
        if (option.c.r > 1) option.c.r = -1
        option.c.i += 0.01
        option.c.r += 0.01
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
var PickerFractal = document.createElement("span")
colorPickerLabel.innerHTML = "Pick a color"
colorPicker.style.width = "20px"
colorPicker.style.height = "20px"
colorPicker.style.border = "1px solid black"
colorPicker.style.backgroundColor = "white"
PickerFractal.innerHTML = option.algorithm
canvas.addEventListener("mousemove", function (e) {
    var x = e.offsetX
    var y = e.offsetY
    var color = ctx.getImageData(x, y, 1, 1).data
    colorPicker.style.backgroundColor = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")"
    colorPickerLabel.innerHTML = "Pick a color: " + color[0] + ", " + color[1] + ", " + color[2]
    var x = (x - width / 2) / (width / 2) / option.scale + option.offset.x
    var y = (y - height / 2) / (height / 2) / option.scale / (width / height) + option.offset.y
    option.color = false
    PickerFractal.innerHTML = option.algorithm+": " + fractal[option.algorithm](x, y, option)
    option.color = true
})
div.id = "colorPicker"
div.appendChild(colorPicker)
div.appendChild(colorPickerLabel)
div.appendChild(PickerFractal)
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