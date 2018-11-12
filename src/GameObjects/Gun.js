export default class Gun extends Phaser.GameObjects.Sprite {
	constructor (config) {
		super(config.scene, config.key, config.name, config.player, config.from)
		config.scene.physics.world.enable(this)
    config.scene.add.existing(this)

		this.name = config.name
		this.direction = 'left'

		this.shootTime = 0
		this.shootStart = 50
		this.shootEnd = 200
		this.shot = false

		this.player = config.player
		this.from = config.from
	}

	update (shooting, delta) {
		if (shooting) {
			this.shootTime += delta
		}

		if(this.shootTime > this.shootEnd) {
			this.player.shooting = false
			this.shootTime = 0
			this.shot = false
		}

		if(this.shootTime > this.shootStart && this.shootTime < this.shootEnd){
			let flipX = this.player.flipX

			if (flipX) {
				this.flipX = false
			} else {
				this.flipX = true
			}

			if(this.player.flipX){
				this.x = this.player.x + 10
			} else {
				this.x = this.player.x - 10
			}

			this.y = this.player.y
			this.anims.play(`${this.name}-shoot`, true)

			if(!this.shot){
				let x = this.player.flipX ? this.x - 8 : this.x + 8
				let bullet = this.scene.bullets.get()
				bullet.fire(x, this.y - 1, flipX ? 'right' : 'left', this.from)
				this.shot = true
			}
		} else {
			if(this.anims.isPlaying){
				this.anims.stop()
			}
		}
	}
}