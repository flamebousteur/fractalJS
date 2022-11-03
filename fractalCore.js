/**
 * you can use and modify this code for free but please keep this comment
 * thanks
 * 
 * @author: flamebousteur
 * @site: https://flamebousteur.github.io
 * @source: https://github.com/flamebousteur/fractalJS
 */

// set image data if undefined (nodeJS)
var ImageData = (ImageData == undefined) ? function (width, height) { this.width = width; this.height = height; this.data = new Uint8ClampedArray(width * height * 4) } : ImageData

ImageData.prototype.SetPixel = function (x, y, color = { r: 0, g: 0, b: 0, a: 255 }) {
    this.data[(x + y * this.width) * 4] = color.r
    this.data[(x + y * this.width) * 4 + 1] = color.g
    this.data[(x + y * this.width) * 4 + 2] = color.b
    this.data[(x + y * this.width) * 4 + 3] = color.a
}

ImageData.prototype.GetPixel = function (x, y) {
    return {
        r: this.data[(x + y * this.width) * 4],
        g: this.data[(x + y * this.width) * 4 + 1],
        b: this.data[(x + y * this.width) * 4 + 2],
        a: this.data[(x + y * this.width) * 4 + 3]
    }
}

function objectFusion (opt1, opt2) {
    var opt = {}
    for (let key in opt1) {
        if (typeof opt1[key] == "object") {
            opt[key] = objectFusion(opt1[key], opt2[key])
        } else {
            opt[key] = opt2[key] || opt1[key]
        }
    }
    return opt
}

var defaultGradient = [
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
    /*
    // red to white
    {color: {r: 255, g: 0, b: 0, a: 255}, percentage: 0},
    {color: {r: 255, g: 255, b: 0, a: 255}, percentage: 100},
    */
]

function getGradientColor(percentage, gradient = []) {
    if (gradient.length == 0) {
        // gradient color (rgba) and percentage (0-100)
        gradient = defaultGradient
    }
    return gradient.reduce((prev, curr) => {
        if (percentage >= prev.percentage && percentage <= curr.percentage) {
            let percentageInRange = (percentage - prev.percentage) / (curr.percentage - prev.percentage)
            let color = {
                r: prev.color.r + (curr.color.r - prev.color.r) * percentageInRange,
                g: prev.color.g + (curr.color.g - prev.color.g) * percentageInRange,
                b: prev.color.b + (curr.color.b - prev.color.b) * percentageInRange,
                a: prev.color.a + (curr.color.a - prev.color.a) * percentageInRange
            }
            return color
        }
        return prev
    })
}

class fractal {
    constructor (algorithm = "Julia", {iterations = 100, scale = 0.5, offsetX = 0, offsetY = 0, c = {r: 0, i: 0}, color = true, smooth = true} = {}) {
        this.algorithm = algorithm
        this.option = {iterations, scale, offsetX, offsetY, c, color, smooth}
    }

    static coolfigure = [
        {
            algorithm: "Julia",
            c: { r:-1.3, i:0.07 },
            offset: { x:0, y:0 },
            scale: 0.8,
        },
        {
            algorithm: "Mandelbrot",
            offset: { x:-0.5, y:0 },
            scale: 0.8,
        },
        {
            algorithm: "Mandelbrot",
            offset: { x:-1, y:0 },
            scale: 1.1,
        },
        {
            algorithm: "BurningShip",
            offset: { x:-0.3, y:-0.5 },
            scale: 0.8,
        },
        {
            algorithm: "Julia",
            c: { r:-0.162, i:1.04 },
            offset: { x:0, y:0 },
            scale: 4,
        }
    ]

    /**
     * @brief: return the color of the pixel with the Julia fractal algorithm
     * 
     * @param {number} x: the x coordinate of the pixel
     * @param {number} y: the y coordinate of the pixel
     * @param {object} option: the option of the fractal
     * 
     * @return {object}: the color of the pixel
     */
    static Julia(x, y, {iterations = 100, c = {r: 0, i: 0}, color = true, smooth = true} = {}) {
        // z = z^2 + c
        var i = 0
        while (x * x + y * y < 4 && i < iterations) {
            var xtemp = x * x - y * y + c.r
            y = 2 * x * y + c.i
            x = xtemp
            i++
        }
        
        if (color) {
            var ni = i
            if (smooth) {
                let log_zn = Math.log(x * x + y * y) / 2
                let nu = Math.log(log_zn / Math.log(2)) / Math.log(2)
                ni = i + 1 - nu
            }
            var color = {r: 0, g: 0, b: 0}
            if (i == iterations) color = {r: 255, g: 255, b: 255}
            else color = getGradientColor(ni / iterations * 100)
            return color
        } else return i
    }

    /**
     * return the color of the pixel with the Mandelbrot fractal algorithm
     * @param {number} x: the x coordinate of the pixel
     * @param {number} y: the y coordinate of the pixel
     * @param {object} option: the option of the fractal
     * 
     * @return {object}: the color of the pixel
     */
    static Mandelbrot(x, y, {iterations = 100, color = true, smooth = true} = {}) {
        // z = z^2 + c
        var c = {r: x, i: y}
        x = 0
        y = 0
        var i = 0
        while (x * x + y * y < 4 && i < iterations) {
            var xtemp = x * x - y * y + c.r
            y = 2 * x * y + c.i
            x = xtemp
            i++
        }

        if (color) {
            var ni = i
            if (smooth) {
                let log_zn = Math.log(x * x + y * y) / 2
                let nu = Math.log(log_zn / Math.log(2)) / Math.log(2)
                ni = i + 1 - nu
            }
            var color = {r: 0, g: 0, b: 0}
            if (i == iterations) color = {r: 255, g: 255, b: 255}
            else color = getGradientColor(ni / iterations * 100)
            return color
        } else return i
    }

    /**
     * return the color of the pixel with the Burning Ship fractal algorithm
     * @param {number} x: the x coordinate of the pixel
     * @param {number} y: the y coordinate of the pixel
     * @param {object} option: the option of the fractal
     * 
     * @return {object}: the color of the pixel
     */
    static BurningShip(x, y, {iterations = 100, color = true, smooth = true} = {}) {
        // z = |z^2 + c|
        var c = {r: x, i: y}
        x = 0
        y = 0
        var i = 0
        while (x * x + y * y < 4 && i < iterations) {
            var xtemp = Math.abs(x * x - y * y + c.r)
            y = Math.abs(2 * x * y + c.i)
            x = xtemp
            i++
        }

        if (color) {
            var ni = i
            if (smooth) {
                let log_zn = Math.log(x * x + y * y) / 2
                let nu = Math.log(log_zn / Math.log(2)) / Math.log(2)
                ni = i + 1 - nu
            }
            var color = {r: 0, g: 0, b: 0}
            if (i == iterations) color = {r: 0, g: 0, b: 0}
            else color = getGradientColor(ni / iterations * 100)
            return color
        } else return i
    }

    /**
     * return the color of the pixel with a custom fractal algorithm
     * @param {number} x: the x coordinate of the pixel
     * @param {number} y: the y coordinate of the pixel
     * @param {object} option: the option of the fractal
     * 
     * @return {object}: the color of the pixel
     */
    static arrow(x, y, {iterations = 100, color = true, smooth = true, sin = "x"} = {}) {
        // z = sin(z + c)
        var c = {r: x, i: y}
        x = 0
        y = 0
        var i = 0
        while (x * x + y * y < 4 && i < iterations) {
            var xtemp = x * x - y * y + c.r
            y = 2 * x * y + c.i;
            x = (sin == "x") ? Math.sin(xtemp) : xtemp
            if (sin == "y") y = Math.sin(y)
            i++
        }

        if (color) {
            var ni = i
            if (smooth) {
                let log_zn = Math.log(x * x + y * y) / 2
                let nu = Math.log(log_zn / Math.log(2)) / Math.log(2)
                ni = i + 1 - nu
            }
            var color = {r: 0, g: 0, b: 0}
            if (i == iterations) color = {r: 255, g: 255, b: 255}
            else color = getGradientColor(ni / iterations * 100)
            return color
        } else return i
    }

    /**
     * return the color of the pixel with a custom fractal algorithm
     * @param {number} x: the x coordinate of the pixel
     * @param {number} y: the y coordinate of the pixel
     * @param {object} option: the option of the fractal
     * 
     * @return {object}: the color of the pixel
     */
    static test(x, y, {iterations = 100, color = true, smooth = true, sin = "x"} = {}) {
        // z = sin(z + c)
        var c = {r: x, i: y}
        x = 0
        y = 0
        var i = 0
        while (x * x + y * y < 4 && i < iterations) {
            var xtemp = x * x - y * y + c.r
            y = 2 * x * y + c.i;
            x = (sin == "x") ? Math.sin(xtemp) : xtemp
            if (sin == "y") y = Math.sin(y)
            i++
        }

        if (color) {
            var ni = i
            if (smooth) {
                let log_zn = Math.log(x * x + y * y) / 2
                let nu = Math.log(log_zn / Math.log(2)) / Math.log(2)
                ni = i + 1 - nu
            }
            var color = {r: 0, g: 0, b: 0}
            if (i == iterations) color = {r: 255, g: 255, b: 255}
            else color = getGradientColor(ni / iterations * 100)
            return color
        } else return i
    }

    /**
     * return image data of the fractal
     * @param {number} width: the width of the image
     * @param {number} height: the height of the image
     * @param {object} option: the option of the fractal
     * @param {function} log: the function to log the progress (%)
     * 
     * @return {ImageData}: the image data of the fractal
     */
    static createFractal(width = 1, height = 1, option = {}, log = null) {
        if (!this[option.algorithm]) throw new Error("Fractal algorithm "+option.algorithm+" not found")
        var img = new ImageData(width, height)
        var p = 0
        for (let gx = 0; gx < width; gx++) {
            for (let gy = 0; gy < height; gy++) {
                if (typeof log == "function") {
                    // print the percentage of the progression
                    var percent = Math.round((gx * height + gy) / (width * height) * 100)
                    if (percent != p) {
                        log(percent, gx, gy)
                        p = percent
                    }
                }
                // center the fractal, move it and scale it
                let x = (gx - width / 2) / (width / 2) / Math.pow(option.scale, 2) + option.offset.x
                let y = (gy - height / 2) / (height / 2) / Math.pow(option.scale, 2) / (width / height) + option.offset.y
                let color = this[option.algorithm](x, y, option)
                img.SetPixel(gx, gy, {r: color.r, g: color.g, b: color.b, a: 255})
            }
        }
        return img
    }

    /**
     * return the color of the pixel with the curent fractal algorithm
     * @param {number} x: the x coordinate of the pixel
     * @param {number} y: the y coordinate of the pixel
     * 
     * @return {object}: the color of the pixel
     */
    getPixel(x, y) {
        if (!fractal[this.algorithm]) throw new Error("The algorithm '" + this.algorithm + "' is not defined")
        return fractal[this.algorithm](x, y, this.option)
    }

    /**
     * return image data of the fractal
     * @return {ImageData}: the image data of the fractal
     */
    createFractal() {
        return fractal.createFractal(this.width, this.height, this.option, this.log)
    }
}

// animate the fractal with keyframes
class AnimateFractal {
    constructor(width = 1, height = 1, {duration = 1000, keyframes = []} = {}) {
        this.duration = duration
        this.keyframes = keyframes
        this.width = width
        this.height = height
    }

    /**
     * add a keyframe
     * @param {object} keyframe: the keyframe to add
     */
    addKeyframe({frame = 0, data = null} = {}) {
        this.keyframes.push({frame: frame, data: data})
    }

    /**
     * get frame data
     * @param {number} frame: the frame to get
     * 
     * @return {object}: the data of the frame
     */
    getFrameData(frame = 0) {
        // if the frame is out of the animation duration
        if (frame > this.duration) throw new Error("Frame "+frame+" is out of the animation duration")
        // if the frame is not a keyframes calculate the data
        if (!this.keyframes.find(k => k.frame == frame)) {
            var prev = this.keyframes.find(k => k.frame < frame)
            // if there is no keyframe before the frame return the first keyframe data
            if (!prev) prev = this.keyframes[0]
            var next = this.keyframes.find(k => k.frame > frame)
            // if there is no keyframe after the frame return the last keyframe data
            if (!next) next = this.keyframes[this.keyframes.length - 1]
            var percent = (frame - prev.frame) / (next.frame - prev.frame)
            var data = {}
            for (let key in prev.data) {
                if (typeof prev.data[key] == "number") data[key] = prev.data[key] + (next.data[key] - prev.data[key]) * percent
                else if (typeof prev.data[key] == "object") {
                    data[key] = {}
                    for (let k in prev.data[key]){
                        if (typeof prev.data[key][k] == "number" && next.data[key]) data[key][k] = prev.data[key][k] + (next.data[key][k] - prev.data[key][k]) * percent
                        else data[key][k] = prev.data[key][k]
                    }
                }
                else data[key] = prev.data[key]
            }
            return data
        } else return this.keyframes.find(k => k.frame == frame).data
    }

    /**
     * render a frame and return ImageData
     * @param {number} frame: the frame to render
     * 
     * @return {ImageData}: the image data of the frame
     */
    renderFrame(frame = 0, log) {
        // if the frame is out of the animation duration
        if (frame > this.duration) throw new Error("Frame "+frame+" is out of the animation duration")
        // get the data of the frame
        var data = this.getFrameData(frame)
        // render the fractal
        var img = fractal.createFractal(this.width, this.height, data, log)
        return img
    }

    /**
     * render the animation
     * @param {object} option: the option of the animation
     * @param {function} onFrame: the function to get the images
     */
    render({from = 0, to = this.duration} = {}, onFrame = null, log) {
        if (from > to) throw new Error("from must be lower than to: " + from + " " + to)
        for (let frame = from; frame < to; frame++) {
            var img = this.renderFrame(frame, log)
            if (typeof onFrame == "function") onFrame(img, frame)
        }
    }
}

// if nodeJS is used create a class for better Animation rendering
if (typeof module !== "undefined") module.exports = {fractal, AnimateFractal}
// if browser is used, add the function to the window object
else if (typeof window !== 'undefined') {
    window.fractal = fractal
    window.AnimateFractal = AnimateFractal
} else throw new Error("Fractal.js can only be used in nodeJs or browser")