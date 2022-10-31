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