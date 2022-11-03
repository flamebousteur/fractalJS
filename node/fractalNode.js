const { fractal, AnimateFractal } = require("../fractalCore")
// for the png file
const { PNG } = require("pngjs")
const fs = require("node:fs")

function renderFractal (width, height, option, out) {
	var img = fractal.createFractal(width, height, option, function(p) {
		process.stdout.write("\r"+p+"%")
	})

	var png = new PNG({
		width: width,
		height: height,
		filterType: -1
	})
	png.data = img.data
	png.pack().pipe(fs.createWriteStream(out))

	process.stdout.write("\r\x1b[32m"+out+"\x1b[0m\n")
}

var anim = new AnimateFractal(1920, 1080, {
	duration: 24 * 10,
	keyframes: [],
})

function renderAnimation (out, {from = 0, to = anim.duration} = {}) {
	// if out folder don't exist create it
	if (!fs.existsSync(out)) fs.mkdirSync(out)
	var frame = 0
	anim.render({from:from, to:to}, function (img, f) {
		let png = new PNG({
			width: anim.width,
			height: anim.height,
			filterType: -1
		})
		png.data = img.data
		var file = out+"/"+f+".png"
		png.pack().pipe(fs.createWriteStream(file))
		process.stdout.write("\r\x1b[32mframe: "+f+":100% "+file+"\x1b[0m\n")
		frame = f+1
	}, function(p) {
		process.stdout.write("\rframe: "+frame+":"+p+"%")
	})
}

anim.addKeyframe({
	frame: 0,
	data: {
		algorithm: "Julia",
		c: { r:-1.3, i: -0.5 },
		offset: { x:0, y:0 },
		scale: 0.8,
	}
})

anim.addKeyframe({
	frame: anim.duration,
	data: {
		algorithm: "Julia",
		c: { r:-1.3, i: 0.5 },
		offset: { x:0, y:0 },
		scale: 0.8,
	}
})

/*
*/
renderFractal(
	1920*2,
	1080*2,
	{
		algorithm: "BurningShip",
		offset: { x:-0.3, y:-0.5 },
		scale: 0.8,
	},
	"./image.png")

//renderAnimation('./images', {from: 0, to: 24 * 2})
//renderAnimation('./images', {from: 24 * 2, to: 24 * 4})
//renderAnimation('./images', {from: 24 * 4, to: 24 * 6})
//renderAnimation('./images', {from: 24 * 6, to: 24 * 8})
//renderAnimation('./images', {from: 24 * 8, to: 24 * 10})