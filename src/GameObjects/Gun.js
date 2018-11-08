export default class Gun extends Phaser.GameObjects.Sprite {
	constructor (config) {
		super(config.name)

		this.name = config.name
		this.direction = 'left'

		this.shooting = false
		this.shootStart = 50
		this.shootEnd = 200
	}

	update () {

	}
}