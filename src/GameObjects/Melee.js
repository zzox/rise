export default class Melee extends Phaser.GameObjects.Sprite {
	constructor(config){
		super(config.scene, config.key, config.possession)
		config.scene.physics.world.enable(this)
    config.scene.add.existing(this)

    console.log(config.possession)

    this.swinging = false
    this.body.allowGravity = false
		this.direction = 'left'
		this.swingHold = 0

		this.damage = 34
		this.blowback = 200

		this.possession = config.possession || 'player'
	}

	swing(bool){
		this.swinging = bool
		if(!bool && this.swingHold > 0 && this.swingHold < 200){
			this.swinging = true
		}
	}

	update(time, delta, x, y, dir){
		if(this.swinging) this.swingHold += delta
		if(!this.swinging) {
			this.visible = false
			this.swingHold = 0
			return
		}
		this.direction = dir

		if(this.swingHold > 50 && this.swingHold <= 100){
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
			this.y = y - 16
			this.anims.play('up', true)
			if (this.possession === 'player') {
				this.scene.physics.world.overlap(this, this.scene.pestGroup, this.hurtEnemy)
				this.scene.physics.world.overlap(this, this.scene.opponentGroup, this.hurtEnemy)
			} else if(this.possession === 'opponent') {
				this.scene.physics.world.overlap(this, this.scene.player, this.hurtPlayer)
			}
			//overlap
		} else if(this.swingHold > 100 && this.swingHold <= 150){
			this.visible = true
			this.body.setSize(10, 10)
			if(this.direction === 'left'){
				this.body.setOffset(10, 10)
				this.x = x - 12
				this.flipX = false
			} else {
				this.body.setOffset(16, 10)
				this.x = x + 12
				this.flipX = true
			}
			this.y = y - 12
			this.anims.play('swing', true)
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
			this.body.setOffset(8, 14)
			if(this.direction === 'left'){
				this.x = x - 16
				this.flipX = false
			} else {
				this.x = x + 16
				this.flipX = true
			}
			this.y = y + 2
			this.anims.play('down', true)
			//overlap
			if (this.possession === 'player') {
				this.scene.physics.world.overlap(this, this.scene.pestGroup, this.hurtEnemy)
				this.scene.physics.world.overlap(this, this.scene.opponentGroup, this.hurtEnemy)
			} else if(this.possession === 'opponent') {
				this.scene.physics.world.overlap(this, this.scene.player, this.hurtPlayer)
			}
		} 
	}

	hurtEnemy (weapon, enemy) {
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
	}

	hurtPlayer (weapon, player) {
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
	}
}
