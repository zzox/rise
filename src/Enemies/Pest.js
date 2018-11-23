export default class Pest extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y - 16, config.key, config.name, config.details);    
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.alive = true
    // start still and wait until needed
                                                //SLOBLEM: setting to true causes weird blips
    this.body.setVelocity(0, 0).setBounce(0, 0)// .setCollideWorldBounds(true)
    this.body.allowGravity = true // needed now?
    this.beenSeen = false
    // know about player
    this.player = this.scene.player
    // Base horizontal velocity / direction.
    this.speed = config.details.speed
    this.attackSpeed = config.details.attackSpeed
    this.direction = 0
    // Standard sprite is 16x16 pixels with a smaller body
    this.body.setSize(16, 8)
    this.body.offset.set(8, 12)
    this.anims.play(`${config.name}-moving`)  
    this.health = config.details.health
    this.killAt = 0;
    this.type = config.type
    this.stillDamage = config.details.stillDamage
    this.attackDamage = config.details.attackDamage

    this.biDirectional = config.details.biDir

    this.attacking = false

    this.hurt = false
    this.hurtTimer = 500
    this.hurtTime = 0
    this.tintStep = 0

    this.decisionTimer = config.details.decisionTime
    this.decisionTime = 0
    this.decision = 'move'

    this.name = config.name
  }

  activated(){
    // Method to check if an enemy is activated, the enemy will stay put
    // until activated so that starting positions is correct
    // if(!this.alive){
    //   if(this.y>240){
    //     this.kill();
    //   }
    //   return false;
    // }
    if(!this.beenSeen){
      // check if it's being seen now and if so, activate it
      // console.log('seen')

                                            //TEMP
      if(this.y - 8 > this.scene.cameras.main.scrollY){
        this.beenSeen = true;
        console.log('seen')
        // alert('seen')
        // this.body.velocity.x = this.direction;
        this.body.allowGravity = true
        // this.body.setCollideWorldBounds(true)
        return true;
      }
      return false
    }
    return true // to activate
    // return false
  }

  update (time, delta) {
    // If it's not activated, then just skip the update method (see Enemy.js)\
    // console.log(this.x + ' ' + this.y)
    if(!this.activated()) return
    // this.scene.physics.world.collide(this, this.scene.groundLayer)
    // might need to take this out incase it equals 0 at one point, which it may
    if(!this.alive){
      // The killtimer is set, keep the flat Goomba then kill it for good.
      // console.log(this.body.velocity)
      if(this.killAt === 1000){
        this.body.setVelocityY(-200)
      }
      this.killAt-=delta;
      if(this.killAt < 0){
        this.destroy();
      }

      this.tintStep = (this.tintStep === 5) ? 0 : this.tintStep + 1
      this.tint = [0xFFFFFF, 0xFFFFFF, 0xFF0000, 0xFF0000, 0xFF0000, 0xFF0000][this.tintStep];

      return;
    }

    if(this.hurt){
      if(this.hurtTime > this.hurtTimer){
        this.hurt = false
        this.hurtTime = 0
      } else {
        this.hurtTime += delta
      }
    }

    if(this.hurt){
      // dont know how this works but it does
      this.tintStep = (this.tintStep === 5) ? 0 : this.tintStep + 1
      this.tint = [0xFFFFFF, 0xFFFFFF, 0xFF0000, 0xFF0000, 0xFF0000, 0xFF0000][this.tintStep];
    } else {
      if(!this.tint !== 0xFFFFFF){
        this.tint = 0xFFFFFF
      }
    }


    //change dir at wall, up here because below setVelocity it interferes.
    if(this.body.velocity.x === 0 && this.body.blocked.left || this.body.blocked.right) {
      this.direction = -this.direction
    }

    //decision
    if(this.decisionTime > this.decisionTimer){
      this.decisionTime = 0


      if(Math.abs(this.x - this.player.x) < 100 && Math.abs(this.y - this.player.y) < 20 && this.body.blocked.down && Math.random() > .5){
        this.attacking = true
        this.body.setVelocityY(this.attackSpeed * -1.5)
        if(this.x < this.player.x){
          this.body.setVelocityX(this.attackSpeed)
        } else {
          this.body.setVelocityX(-this.attackSpeed)
        }
      } else {
        if(this.body.blocked.down) {
          if(Math.random() > .9){
            this.direction = -this.direction
          } else {
            this.direction = Math.random() * this.speed
          }
        }
      }
    } else {
      this.decisionTime += delta
    }

    if(!this.hurt && !this.attacking){
      this.body.setVelocityX(this.direction)
    }

    if(this.body.velocity.x < 0){
      this.flipX = false
    } else {
      this.flipX = true
    }

    if(this.body.blocked.down && this.body.velocity.y === 0) {
      this.attacking = false
    }

    if(this.attacking) {
      this.anims.play(`${this.name}-attacking`, true)
    } else {
      this.anims.play(`${this.name}-moving`, true)
    }

  }

  // verticalHit(enemy, player){
  //    // quick check if a collision between the enemy and player is from above.
  //    if(!player.alive){return false}
  //    return player.body.velocity.y>=0 && (player.body.y+player.body.height)-enemy.body.y<10;
  // }

  // hurtplayer(enemy, player){
  //   // send the enemy to player hurt method (if player got a star this will not end well for the enemy)
  //   this.scene.player.hurtBy(enemy);
  // }

  // starKilled(){
  //   // Killed by a star or hit from below with a block, later on also fire
  //   if(!this.alive){
  //     return;
  //   }
  //   this.body.velocity.x  = 0;
  //   this.body.velocity.y = -200;
  //   this.alive = false;
  //   this.flipY = true;
  //   this.scene.sound.playAudioSprite('sfx', 'smb_stomp');
  //   // this.scene.updateScore(100);
  // }

  kill(){
    this.killAt = 500
    this.body.velocity.y = -500
    this.flipY = true
    this.alive = false
  }

  damage(damage){
    this.health = this.health - damage
    if(this.health <= 0) this.kill()

    this.scene.sound.playAudioSprite('sfx', 'pest-hurt', { volume: .2 })
  }
}