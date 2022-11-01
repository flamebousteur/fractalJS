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

class fractal {
    static coolfigure = [
        {
            algorithm: "Julia",
            option: {
                c: { r:-1.3, i:0.07 },
                offset: { x:0, y:0 },
                scale: 0.45,
            }
        }
    ]

    // return the color of the pixel with the Julia fractal algorithm
    static Julia(x, y, width, height, {iterations = 100, scale = 0.5, offsetX = 0, offsetY = 0, c = {r: 0, i: 0}, color = true, smooth = true} = {}) {
        // center the fractal, move it and scale it
        var x = (x - width / 2) / (width / 2) / scale + offsetX
        var y = (y - height / 2) / (height / 2) / scale / (width / height) + offsetY

        // z = z^2 + c
        var i = 0
        while (x * x + y * y < 4 && i < iterations) {
            var xtemp = x * x - y * y + c.r
            y = 2 * x * y + c.i
            x = xtemp
            i++
        }
        
        if (color) {
            var ni
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

    // return image data of the fractal
    static createFractal(fractal, width = 1, height = 1, option = {}) {
        if (typeof fractal == "object") {
            option = fractal.option
            width = (fractal.width) ? fractal.width : width
            height = (fractal.height) ? fractal.height : height
            fractal = fractal.algorithm
        }
        option.color = true
        if (!this[fractal]) throw new Error("Fractal algorithm not found")
        var img = new ImageData(width, height)
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let color = this[fractal](x, y, width, height, option)
                img.SetPixel(x, y, color)
            }
        }
        return img
    }
}

// if nodeJs is used, export the function
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') module.exports = { fractal }
// if browser is used, add the function to the window object
else window.fractal = fractal