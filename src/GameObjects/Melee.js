export default class Melee extends Phaser.GameObjects.Sprite {
	constructor(config){
		super(config.scene, config.key, config.name, config.damage, config.blowback, config.swingStart, config.swingLow, config.swingHigh, config.possession)
		config.scene.physics.world.enable(this)
    config.scene.add.existing(this)

    this.name = config.name
    this.swinging = false
    this.body.allowGravity = false
		this.direction = 'left'
		this.swingHold = 0

		this.damage = config.damage
		this.blowback = config.blowback

		this.swingStart = config.swingStart
		this.swingLow = config.swingLow
		this.swingHigh = config.swingHigh

		this.possession = config.possession || 'player'

		this.swingingDir = null
		this.soundPlayed = false
	}

	swing(bool){
		// keep swing if letting go
		if(this.swinging && this.swingHold < this.swingHigh){
			this.swinging = true
			return
		}
		this.swinging = bool
	}

	cancelSwing(weapon, tile) {
		if(tile.canCollide && weapon.swingHold > weapon.swingHigh){
			weapon.scene.sound.playAudioSprite('sfx', 'sword-pickup', { volume: .1 })
			weapon.swinging = false
			weapon.swingHold = 0
			weapon.visible = false
		}
	}

	update(time, delta, x, y, dir){
		if(this.swinging) this.swingHold += delta
		// stop swing if letting go
		if(!this.swinging && this.swingHold > this.swingHigh) {
			this.visible = false
			this.swingHold = 0
			return
		}
		this.direction = dir

		if(this.swingHold > this.swingStart && this.swingHold <= this.swingLow){
			this.visible = true
			this.body.setSize(4, 15)
			this.body.setOffset(14, 8)
			if(this.direction === 'left'){
				this.x = x - 4
				this.flipX = false
			} else {
				this.x = x + 4
				this.flipX = true		
			}
			this.y = y - 15
			this.anims.play(`${this.name}-up`, true)
			this.swingingDir = 'up'
			//overlap
			if (this.possession === 'player') {
				this.scene.physics.world.overlap(this, this.scene.pestGroup, this.hurtEnemy)
				this.scene.physics.world.overlap(this, this.scene.bossGroup, this.hurtEnemy)
			} else if(this.possession === 'opponent') {
				this.scene.physics.world.overlap(this, this.scene.player, this.hurtPlayer)
			}
			//overlap
		} else if(this.swingHold > this.swingLow && this.swingHold <= this.swingHigh){
			this.visible = true
			this.body.setSize(14, 15)
			if(this.direction === 'left'){
				this.body.setOffset(8, 8)
				this.x = x - 14
				this.flipX = false
			} else {
				this.body.setOffset(8, 8)
				this.x = x + 14
				this.flipX = true
			}
			this.y = y - 2
			this.anims.play(`${this.name}-swing`, true)
			this.swingingDir = 'down'
			//overlap
			if (this.possession === 'player') {
				this.scene.physics.world.overlap(this, this.scene.pestGroup, this.hurtEnemy)
				this.scene.physics.world.overlap(this, this.scene.bossGroup, this.hurtEnemy)
			} else if(this.possession === 'opponent') {
				this.scene.physics.world.overlap(this, this.scene.player, this.hurtPlayer)
			}
			if (!this.soundPlayed) {
				this.soundPlayed = true
				this.scene.sound.playAudioSprite('sfx', 'sword-swing', { volume: .08 })
			}
		} else if(this.swingHold > 150){
			this.visible = true
			this.body.setSize(15, 4)
			this.body.setOffset(8, 18)
			if(this.direction === 'left'){
				this.x = x - 14
				this.flipX = false
			} else {
				this.x = x + 14
				this.flipX = true
			}
			this.y = y - 2
			this.anims.play(`${this.name}-down`, true)
			this.swingingDir = null
			//overlap
			if (this.possession === 'player') {
				this.scene.physics.world.overlap(this, this.scene.pestGroup, this.hurtEnemy)
				this.scene.physics.world.overlap(this, this.scene.bossGroup, this.hurtEnemy)
			} else if(this.possession === 'opponent') {
				this.scene.physics.world.overlap(this, this.scene.player, this.hurtPlayer)
			}

			this.scene.physics.world.overlap(this, this.scene.contactLayer, this.cancelSwing)

			if (this.soundPlayed) {
				this.soundPlayed = false
			}
		} 
	}

	hurtEnemy (weapon, enemy) {
		if(!weapon.active || !weapon.visible) {
			return
		}
		if(enemy.hurt === false && enemy.alive === true){
			enemy.damage(weapon.damage)
		}

		enemy.hurt = true

		let dir = weapon.direction === 'left' ? -1 : 1

		if(enemy.body.blocked.down && enemy.body.velocity.y === 0){
			enemy.body.setVelocityX(weapon.blowback * dir)	
		} else {
			enemy.body.setVelocity(weapon.blowback * dir, weapon.blowback * -1)	
		}

		//cant keep a swing if holding
		if(!weapon.swingingDir) {
			weapon.cancelSwing(weapon, {canCollide: true})
		}
	}

	hurtPlayer (weapon, player) {
		if(!weapon.active || !weapon.visible) {
			return
		}
		if(player.hurt === false && player.alive === true){
			player.damage(weapon.damage)
		}

		player.hurt = true

		let dir = weapon.direction === 'left' ? -1 : 1

		if(player.body.blocked.down && player.body.velocity.y === 0){
			player.body.setVelocityX(weapon.blowback * dir)	
		} else {
			player.body.setVelocity(weapon.blowback * dir, weapon.blowback * -1)	
		}

		//cant keep a swing if holding
		if(!weapon.swingingDir) {
			weapon.cancelSwing(weapon, { canCollide: true })
		}
	}
}
