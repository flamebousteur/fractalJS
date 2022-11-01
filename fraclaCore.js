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
            /*
            {color: {r: 0, g: 0, b: 0, a: 255}, percentage: 0},
            {color: {r: 255, g: 255, b: 255, a: 255}, percentage: 100},
            */
            // red to orange
            {color: {r: 255, g: 0, b: 0, a: 255}, percentage: 0},
            {color: {r: 255, g: 255, b: 0, a: 255}, percentage: 100},
        ]
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
            scale: 0.45,
        },
        {
            algorithm: "Mandelbrot",
            offsetX: -0.5,
        },
        {
            algorithm: "BurningShip",
            offsetX: -0.3,
            offsetY: -0.5,
       }
    ]

    // return the color of the pixel with the Julia fractal algorithm
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

    // return the color of the pixel with the Mandelbrot fractal algorithm
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

    // return the color of the pixel with the Burning Ship fractal algorithm
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

    // return the color of the pixel with a custom fractal algorithm
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

    // return the color of the pixel with a custom fractal algorithm
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

    static sierpinskiCarpet(x, y, {size} = {}) {
        if (size < limit) return;
        size = size / 3;
        for (i = 0; i < 9; i = i + 1)
           if (i == 4){

                rect(x+size, y+size, size, size);
                noFill();
           }
           else sierpinskiCarpet(x+(i%3)*size, y+(i/3)*size, {size});
     }

    // return image data of the fractal
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
                let x = (gx - width / 2) / (width / 2) / option.scale + option.offset.x
                let y = (gy - height / 2) / (height / 2) / option.scale / (width / height) + option.offset.y
                let color = this[option.algorithm](x, y, option)
                img.SetPixel(gx, gy, {r: color.r, g: color.g, b: color.b, a: 255})
            }
        }
        return img
    }
}

// if nodeJs is used, export the function
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') module.exports = { fractal }
// if browser is used, add the function to the window object
else window.fractal = fractal