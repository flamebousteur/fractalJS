# fractalJS
fractalJS is a JavaScript library for generating fractals. The preview is shown in an HTML5 canvas element.

# fractalCore

## class Fractal
### constructor (algorithm = "Julia", {iterations = 100, scale = 0.5, offsetX = 0, offsetY = 0, c = {r: 0, i: 0}, color = true, smooth = true} = {}): Fractal
> Creates a new Fractal object.

```js
let MyFractal = new Fractal("Julia", {
    iterations: 100,
    scale: 0.5,
    offsetX: 0,
    offsetY: 0,
    c: {
        r: 0,
        i: 0
    },
    color: true,
    smooth: true
});
```

### getPixel(x: number, y: number): {r: number, g: number, b: number}
> Returns the color of the pixel at the given coordinates.

```js
var Pixel = MyFractal.getPixel(10, 50)
```

### createFractal(): ImageData
> Returns an ImageData object containing the fractal.

```js
var Fractal = MyFractal.createFractal()
// put the fractal on a canvas
ctx.putImageData(Fractal, 0, 0) // ctx is a 2D canvas context
```

### static coolfigure
> some cool figure preset

```js
let MyFractal = Fractal.createFractal(Fractal.coolfigure[0])
```

### static Julia(x: number, y: number, {iterations: number = 100, c: object = {r: 0, i: 0}, color: boolean = true, smooth:boolean = true} = {}): {r: number, g: number, b: number}
> Returns the color of the pixel at the given coordinates using the Julia fractal algorithm.

```js
var Pixel = Fractal.Julia(10, 50, {
    iterations: 100,
    c: {
        r: 0,
        i: 0
    },
    color: true,
    smooth: true
})
```

### static Mandelbrot(x: number, y: number, {iterations: number = 100, color: boolean = true, smooth:boolean = true} = {}): {r: number, g: number, b: number}
> Returns the color of the pixel at the given coordinates using the Mandelbrot fractal algorithm.

```js
var Pixel = Fractal.Mandelbrot(10, 50, {
    iterations: 100,
    color: true,
    smooth: true
})
```

### static BurningShip(x: number, y: number, {iterations: number = 100, color: boolean = true, smooth:boolean = true} = {}): {r: number, g: number, b: number}
> Returns the color of the pixel at the given coordinates using the Burning Ship fractal algorithm.

```js
var Pixel = Fractal.BurningShip(10, 50, {
    iterations: 100,
    color: true,
    smooth: true
})
```

### static arrow(x: number, y: number, {iterations: number = 100, color: boolean = true, smooth:boolean = true, sin:string = "x"} = {}): {r: number, g: number, b: number}
> Returns the color of the pixel at the given coordinates using the arrow fractal algorithm. The sin parameter can be "x" or "y" and determines which axis the sin function is applied to.

> arrow is a fractal that is similar to the Mandelbrot fractal, but with a sin function applied to the x or y axis. the arrow fractal is a custom fractal (I didn't find it on the internet).

```js
var Pixel = Fractal.arrow(10, 50, {
    iterations: 100,
    color: true,
    smooth: true,
    sin: "x"
})
```

### static test(x: number, y: number, {} = {}): {r: number, g: number, b: number}
> some test fractal

```js
var Pixel = Fractal.test(10, 50, {})
```

### static createFractal(width: number = 1, height: number = 1, option: object = {}, log: function | null = null): ImageData
> Returns an ImageData object containing the fractal.

```js
var Fractal = Fractal.createFractal(100, 100, {
    algorithm: "Julia",
    iterations: 100,
    scale: 0.5,
    offsetX: 0,
    offsetY: 0,
    c: {
        r: 0,
        i: 0
    },
    color: true,
    smooth: true
}, function (progress) {
    console.log(progress + "%")
})

// put the fractal on a canvas
ctx.putImageData(Fractal, 0, 0) // ctx is a 2D canvas context
```

## class AnimateFractal
### constructor ({duration: number = 1000, keyframes: Array = [], width: number = 1, height: number = 1} = {}): AnimateFractal
> Creates a new AnimateFractal object.

```js
let MyAnimateFractal = new AnimateFractal({
    duration: 1000,
    keyframes: [],
    width: 1,
    height: 1
})
```

### addKeyframe({frame: number = 0, data: object = null, callback: function | null = null} = {}): void
> Adds a keyframe to the animation.

```js
MyAnimateFractal.addKeyframe({
    frame: 0,
    data: {
        algorithm: "Julia",
        iterations: 100,
        scale: 0.5,
        offsetX: 0,
        offsetY: 0,
        c: {
            r: 0,
            i: 0
        },
        color: true,
        smooth: true
    },
    callback: function (progress) {
        console.log(progress + "%")
    }
})
```

### getFrameData(frame: number = 0): object
> Returns the data of the keyframe at the given frame. if the frame is not a keyframe, it calculates the data of the keyframe

```js
var FrameData = MyAnimateFractal.getFrameData(5)
```

### renderFrame(frame: number = 0): ImageData
> Returns an ImageData object containing the fractal at the given frame.

```js
var Fractal = MyAnimateFractal.renderFrame(5)
// put the fractal on a canvas
ctx.putImageData(Fractal, 0, 0) // ctx is a 2D canvas context
```

### render({from: number = 0, to: number = this.duration} = {}, onFrame: function | null = null): void
> Renders the animation.

> with nodeJS you can use the fs module to save the frames as images and then use ffmpeg to create a video from the images😉.

```js
MyAnimateFractal.render({
    from: 0,
    to: 1000
}, function (frame, imageData) {
    // put the fractal on a canvas
    ctx.putImageData(imageData, 0, 0) // ctx is a 2D canvas context
})
```

## more
> I'm not a native english speaker, so if you find any mistakes, please let me know.

> this program can be used on NodeJS and in the browser. (same file)