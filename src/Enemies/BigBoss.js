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
    this.body.setSize(40, 30)
    this.body.offset.set(-4,10)
    this.anims.play(`${config.name}-moving`)  
    this.health = config.details.health
    this.killAt = 0;
    this.type = config.type
    this.stillDamage = config.details.stillDamage
    this.attackDamage = config.details.attackDamage

    this.biDirectional = config.details.biDir

    this.attacking = false

    this.hurt = false
    this.hurtTimer = 250
    this.hurtTime = 0

    this.tintStep = 0

    this.decisionTimer = config.details.decisionTime
    this.decisionTime = 0
    this.decision = 'move'

    this.name = config.name
  }

  activated(){
    if(!this.beenSeen){
      if(this.y - 8 > this.scene.cameras.main.scrollY){
        this.beenSeen = true
        this.body.allowGravity = true
        return true
      }
      return false
    }
    return true // to activate
  }

  update (time, delta) {
    // If it's not activated, then just skip the update method (see Enemy.js)\
    // console.log(this.x + ' ' + this.y)
    if(!this.activated()) return
    // this.scene.physics.world.collide(this, this.scene.groundLayer)
    // might need to take this out incase it equals 0 at one point, which it may
    if (!this.alive) {
      // suspicious
      this.body.setVelocity(0)
      this.body.setAcceleration(0)
      this.anims.play(`${this.name}-stand`)
      if (this.tint !== 0x000000) {
        this.tint = 0x000000
        this.body.allowGravity = false
      }
      return
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
      this.tint = [0xFFFFFF, 0xFFFFFF, 0xFF0000, 0xFF0000, 0xFF0000, 0xFF0000][this.tintStep]
    } else {
      if(!this.tint !== 0xFFFFFF){
        this.tint = 0xFFFFFF
      }
    }


    //change dir at wall, up here because below setVelocity it interferes.
    if(this.body.velocity.x === 0 && this.body.blocked.left || this.body.blocked.right) {
      this.speed = -this.speed
    }

    // //decision
    if(this.decisionTime > this.decisionTimer){
      this.decisionTime = 0

      if(Math.abs(this.x - this.player.x) < 160 && (this.y - this.player.y) > -24 && this.body.blocked.down && Math.random() > 0.5){
        this.attacking = true
        this.body.setVelocityY(this.attackSpeed * -1.5)
        if(this.x < this.player.x){
          this.body.setVelocityX(this.attackSpeed)
        } else {
          this.body.setVelocityX(-this.attackSpeed)
        }
      } else {
        if(this.body.blocked.down) {
            // first
            if(Math.random() > 0.825) {
              this.speed = - this.speed
            }
        }
      }
    } else {
      this.decisionTime += delta
    }

    if(!this.hurt && !this.attacking && this.body.blocked.down){
      this.body.setVelocityX(this.speed)
    }

    if(this.body.blocked.down && this.body.velocity.y === 0) {
      this.attacking = false
    }

    if(this.attacking) {
      this.anims.play(`${this.name}-moving-fast`, true)
    } else {
      this.anims.play(`${this.name}-moving`, true)
    }

  }

  kill(){
    if(this.alive) {
      this.scene.bossesNum--
    }
    this.alive = false
  }

  damage(damage){
    this.health = this.health - damage
    if(this.health <= 0) this.kill()

    this.scene.sound.playAudioSprite('sfx', 'big-boss-hurt', { volume: .2 })
  }
}