export default class Pest extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y - 16, config.key, config.name, config.details);    
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.alive = true

    this.body.setVelocity(0, 0).setBounce(0, 0)// .setCollideWorldBounds(true)
    this.body.allowGravity = true // needed now?
    this.beenSeen = false
    this.player = this.scene.player
    this.speed = config.details.speed
    this.attackSpeed = config.details.attackSpeed
    this.direction = 0
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
    if(!this.beenSeen){
      if(this.y + 24 > this.scene.cameras.main.scrollY){
        this.beenSeen = true;
        this.body.allowGravity = true
        return true;
      }
      return false
    }
    return true
  }

  update (time, delta) {
    if(!this.activated()) return

    if(!this.alive){
      if(this.killAt === 1000){
        this.body.setVelocityY(-200)
      }
      this.killAt -= delta
      if(this.killAt < 0){
        this.destroy()
      }

      this.tintStep = (this.tintStep === 5) ? 0 : this.tintStep + 1
      this.tint = [0xFFFFFF, 0xFFFFFF, 0xFF0000, 0xFF0000, 0xFF0000, 0xFF0000][this.tintStep]

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
      this.tintStep = (this.tintStep === 5) ? 0 : this.tintStep + 1
      this.tint = [0xFFFFFF, 0xFFFFFF, 0xFF0000, 0xFF0000, 0xFF0000, 0xFF0000][this.tintStep]
    } else {
      if(!this.tint !== 0xFFFFFF){
        this.tint = 0xFFFFFF
      }
    }

    if(this.body.velocity.x === 0 && this.body.blocked.left || this.body.blocked.right) {
      this.direction = -this.direction
    }

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
            // first
            if(this.direction === 0){
              let dir = Math.random() > 0.5 ? -1 : 1
              this.direction = Math.random() * this.speed * dir
            } else {
              this.direction = Math.random() * this.speed
            }
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