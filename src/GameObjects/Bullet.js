export default class Bullet extends Phaser.GameObjects.Sprite {
  constructor (scene) {
    super(scene)

    this.scene.physics.world.enable(this)

    this.body.setSize(8, 4)
    this.body.offset.set(12, 14)

    //to be dynamic vvvvvv
    this.velocity = 800
    this.damage = 15
    this.blowback = 150

    this.direction = 'left'
  }

  fire (x, y, dir, from) {
      
    this.from = from

    this.body.allowGravity = false

    this.direction = dir

    this.setPosition(x, y)
    this.body.velocity.x = 800 * (dir === 'left' ? -1 : 1)
    if (dir === 'right') {
      this.flipX = true
    } else {
    	this.flipX = false
    }
    this.anims.play('bullet-active')

    this.setActive(true)
    this.setVisible(true)
  }

  update (time, delta) {
    if(!this.active){
        return;
    }
    if(this.scene.contactLayer) {
    	this.scene.physics.world.collide(this, this.scene.contactLayer, this.hitGround)
    }

    if(this.from === 'player'){
      if(this.scene.bossGroup) {
        this.scene.physics.world.overlap(this, this.scene.bossGroup, this.hitEnemy)
      }
      if(this.scene.pestGroup){
        this.scene.physics.world.overlap(this, this.scene.pestGroup, this.hitEnemy)
      }
    } else if(this.from === 'boss'){
      this.scene.physics.world.overlap(this, this.scene.player, this.hitEnemy)
    }
    this.scene.physics.world.overlap(this, this.scene.enemyGroup, this.hitEnemy)

   	if(this.body.velocity.x === 0){
   	  this.hitWorldBounds()
   	}
  }

	hitWorldBounds () {
		this.setActive(false)
    this.setVisible(false)
    this.body.setVelocity(0,0)
    this.setPosition(-100, -100)
	}

  hitGround (bullet, ground) {
    bullet.setActive(false)
    bullet.setVisible(false)
    bullet.body.setVelocity(0,0)
    bullet.setPosition(-100, -100)
  }

  hitEnemy (bullet, enemy) {
		if(enemy.hurt === false && enemy.alive === true){
			enemy.damage(bullet.damage)
		}

		enemy.hurt = true

		let dir = bullet.body.velocity.x < 0 ? -1 : 1

		if(enemy.body.blocked.down && enemy.body.velocity.y === 0){
			enemy.body.setVelocityX(bullet.blowback * dir)	
		} else {
			enemy.body.setVelocity(bullet.blowback * dir, bullet.blowback * -1)	
		}

    bullet.setActive(false)
    bullet.setVisible(false)
    bullet.body.setVelocity(0,0)
  }
}