export default class Melee extends Phaser.GameObjects.Sprite {
	constructor(config){
		super(config.scene, config.key, config.damage, config.blowback, config.swingStart, config.swingLow, config.swingHigh, config.possession)
		config.scene.physics.world.enable(this)
    config.scene.add.existing(this)

    // console.log(config.possession)

    this.swinging = false
    this.body.allowGravity = false
		this.direction = 'left'
		this.swingHold = 0

		console.log('config')
		console.log(config)

		this.damage = config.damage
		this.blowback = config.blowback

		this.swingStart = config.swingStart
		this.swingLow = config.swingLow
		this.swingHigh = config.swingHigh

		this.possession = config.possession || 'player'

		this.swingingDir = null
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
		// console.log(tile.canCollide)
		// console.log(weapon.swingHold + ' ' + weapon.swingHigh)
		if(tile.canCollide && weapon.swingHold > weapon.swingHigh){
			console.log('canceling swing')
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
			this.anims.play('up', true)
			this.swingingDir = 'up'
			//overlap
			if (this.possession === 'player') {
				this.scene.physics.world.overlap(this, this.scene.pestGroup, this.hurtEnemy)
				this.scene.physics.world.overlap(this, this.scene.opponentGroup, this.hurtEnemy)
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
			this.anims.play('swing', true)
			this.swingingDir = 'down'
			//overlap
			if (this.possession === 'player') {
				this.scene.physics.world.overlap(this, this.scene.pestGroup, this.hurtEnemy)
				this.scene.physics.world.overlap(this, this.scene.opponentGroup, this.hurtEnemy)
			} else if(this.possession === 'opponent') {
				this.scene.physics.world.overlap(this, this.scene.player, this.hurtPlayer)
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
			this.anims.play('down', true)
			this.swingingDir = null
			//overlap
			if (this.possession === 'player') {
				this.scene.physics.world.overlap(this, this.scene.pestGroup, this.hurtEnemy)
				this.scene.physics.world.overlap(this, this.scene.opponentGroup, this.hurtEnemy)
			} else if(this.possession === 'opponent') {
				this.scene.physics.world.overlap(this, this.scene.player, this.hurtPlayer)
			}

			this.scene.physics.world.overlap(this, this.scene.contactLayer, this.cancelSwing)
		} 
	}

	hurtEnemy (weapon, enemy) {
		if(!weapon.active || !weapon.visible) {
			alert('not active or visible')
			return
		}
		if(enemy.hurt === false && enemy.alive === true){
			enemy.damage(weapon.damage)
		}
		console.log('enemy')
		console.log(enemy)
		console.log(weapon.possession)
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
			alert('not active or visible')
			return
		}
		if(player.hurt === false && player.alive === true){
			player.damage(weapon.damage)
		}

		console.log('player')
		console.log(player)
		console.log(weapon.possession)
		player.hurt = true

		let dir = weapon.direction === 'left' ? -1 : 1

		if(player.body.blocked.down && player.body.velocity.y === 0){
			player.body.setVelocityX(weapon.blowback * dir)	
		} else {
			player.body.setVelocity(weapon.blowback * dir, weapon.blowback * -1)	
		}

		//cant keep a swing if holding
		if(!weapon.swingingDir) {
			weapon.cancelSwing(weapon, {canCollide: true})
		}

	}
}
