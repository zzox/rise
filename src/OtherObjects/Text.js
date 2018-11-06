//define rounding function
const incAlpha = (alpha, pos) => {
	let inc = pos === 'up' ? .1 : -.1

	return parseFloat((alpha + inc).toFixed(1))
}

export default class Text {
	constructor(scene, color, text, position, scrollPosition, fadeTime, fadesOut){
		this.text = text
		this.color = color
		this.position = {}
		this.position.x = position.x
		this.position.y = position.y
		this.scene = scene
		this.scrollPosition = scrollPosition

		this.alphaTimer = fadeTime
		this.alphaTime = 0	
		this.alphaStop = true
		this.alphaFadeTimer = fadeTime
		this.alphaFadeTime = 0
		this.fadedIn = false
		this.fadesOut = fadesOut
		this.canFadeOut = false
	}

	create () {
		// scene.
		console.log(this.scene)
		this.line = this.scene.add.bitmapText(this.position.x, this.position.y, 'font', this.text)
			.setTint(parseInt(this.color))
			.setAlpha(0)
	}

	update (delta, scrollY) {

		if(!this.line) return

		if (!this.alphaStop && !this.canFadeOut && this.line.alpha < 1){
			if(this.alphaTime < this.alphaTimer) {
				this.alphaTime += delta
			} else {
				this.line.setAlpha(incAlpha(this.line.alpha, 'up'))
				this.alphaTime = 0
			}
		}

		if(this.line.alpha === 1) {
			this.fadedIn = true
			this.canFadeOut = true
		}

		if (this.fadedIn && this.canFadeOut && this.fadesOut && this.line.alpha > 0){
			if(this.alphaFadeTime < this.alphaFadeTimer) {
				this.alphaFadeTime += delta
			} else {
				this.line.setAlpha(incAlpha(this.line.alpha, 'down'))
				this.alphaFadeTime = 0
			}
		}

		if(this.scrollPosition > scrollY){
			this.alphaStop = false
		}

		if(scrollY < this.position.y - 300) {
			this.line = null
			console.log('text destroyed')
		}

	}
}