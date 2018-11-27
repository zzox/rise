export default class Bullet extends Phaser.GameObjects.Sprite {
  constructor (scene) {
    super(scene)

    this.scene.physics.world.enable(this)

    this.body.setSize(8, 4)
    this.body.offset.set(12, 14)

    // this.body.setCollideWorldBounds(true)

    // this.on('animationcomplete', () => {
    //     if (this.anims.currentAnim.key === 'fireExplode') {
    //         this.setActive(false);
    //         this.setVisible(false);
    //     }
    // }, this);

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
      // this.scene.sound.playAudioSprite('sfx', 'smb_fireball');

      // console.log(this.scene.physics.world.collide);
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
    // this.scene.physics.world.collide(this, this.scene.worldBounds, this.hitGround)

    if(this.from === 'player'){
      if(this.scene.bossGroup) {
        // console.log('opp')
        this.scene.physics.world.overlap(this, this.scene.bossGroup, this.hitEnemy)
      }
      if(this.scene.pestGroup){
        // console.log('pest')
        this.scene.physics.world.overlap(this, this.scene.pestGroup, this.hitEnemy)
      }
    } else if(this.from === 'boss'){
      this.scene.physics.world.overlap(this, this.scene.player, this.hitEnemy)
    }
    this.scene.physics.world.overlap(this, this.scene.enemyGroup, this.hitEnemy)

    //  console.log(this.scene.physics.world.collide);
   	if(this.body.velocity.x === 0){
   	  this.hitWorldBounds()
   	}
  }

	hitWorldBounds () {
		this.setActive(false)
    this.setVisible(false)
    this.body.setVelocity(0,0)
    // maybe not necessary? vvv to take the bullet off the possible area to prevent future collisions
    this.setPosition(-100, -100)
	}

  hitGround (bullet, ground) {
      console.log("COLLIEDE")
      // if(this.body.velocity.y === 0){
      //   this.body.velocity.y=-150;
      // }
      // if(this.body.velocity.x === 0){
      //   // this.scene.sound.playAudioSprite('sfx', 'smb_bump');

      //   this.explode();
      // }
    bullet.setActive(false)
    bullet.setVisible(false)
    bullet.body.setVelocity(0,0)
    bullet.setPosition(-100, -100)
  }

  hitEnemy (bullet, enemy) {

  	console.log('hit!')

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

    // this.body.allowGravity = false;
    // this.body.velocity.y = 0;
    // this.play("fireExplode");
    bullet.setActive(false)
    bullet.setVisible(false)
    bullet.body.setVelocity(0,0)
  }

}