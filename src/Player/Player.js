import Melee from '../GameObjects/Melee'
import Gun from '../GameObjects/Gun'

export default class Player extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key, config.hasGun, config.hasSword, config.maxJumps, config.maxDashes)
    config.scene.physics.world.enable(this)
    config.scene.add.existing(this)

    this.animation = "stand" //????? maybe not best practice

    this.hasSword = config.hasSword
    this.hasGun = config.hasGun
    this.maxJumps = config.maxJumps
    this.maxDashes = config.maxDashes
  }

  create(){
    // console.log("create Player???")
    // original val = 125
    this.body.maxVelocity.x = 150
    this.body.maxVelocity.y = 300
    this.acceleration = 800

    this.jumping = false
    this.jumpTimer = 120
    this.jumpHold = false
    this.falling = false
    this.jumpVelocity = 200
    this.wallJumpVelocity = 100

    this.health = 100

    this.body.offset.set(14, 8)
    this.body.setSize(10, 16)

    // this.setDisplaySize(64, 64)

    this.anims.play('stand')
    //this.anims = this.scene.anims
    this.exitDoorTime = 0
    // this.depth = 1
    // this.cameras.main.fadeIn(500)
    // this.play('stand')
    this.clearKeyTime = 0
    // if(this.scene.worldConfig.groundLayer) this.scene.physics.add.collider(this, this.scene.groundLayer);
    this.alive = true

    // this.swingHold = 0
    // this.swingingDir = ''

    this.weapon = 'aluminumBat'

    let config = this.scene.weaponsConfig[this.weapon]

    this.hasMelee = false

    this.meleeWeapon = new Melee({
      scene: this.scene,
      key: 'melee',
      name: '',
      swingStart: config.swingStart,
      swingLow: config.swingLow,
      swingHigh: config.swingHigh,
      damage: config.damage,
      blowback: config.blowback
    })

    // dash
    this.canDash = true
    this.dashing = false
    this.dashWarming = false
    this.dashTime = 0
    this.dashTimer = 250
    this.dashVeloctiy = 500
    this.maxVelocityTimer = 0
    this.dashes = 0

    // hurt
    this.hurt = false
    this.hurtTimer = 500
    this.hurtTime = 0
    this.tintStep = 0

    this.hasGun = false
    this.ammoInc = 3
    this.ammo = 0
    this.firePerSec = 1
    this.lastFired = 0
    this.projFrequency = 1000 / this.firePerSec
    this.shooting = false

    // proj
    this.gun = new Gun({
      scene: this.scene,
      key: 'gun',
      name: '',
      player: this,
      from: 'player'
    })

    // no grav proj

    this.prevState = {}

    this.wallSlow = 50
    // this.wallSlowing = false

    this.healthIncTime = 2000
    this.healthIncTimer = 0
  }

  update(keys, time, delta) {

    // console.log(this.x + ' ' + this.y)

    if (!this.scene){
      return
    }
    //use this?????

    if(!this.alive){
      this.body.setVelocity(0)
      this.body.setAcceleration(0)
      this.anims.play('stand')
      if (this.tint !== 0x000000) {
        this.tint = 0x000000
        this.body.allowGravity = false
      }
      return
      // this.scene.goingDead = true
      // this.scene.scene.start('TitleScene', { currentStage: this.scene.stage })
    }

    if(this.clearKeyTime < 333){
      this.clearKeyTime += delta
      return
    } else {
      // put in key clear here???
    }

    if (this.health !== 100 && !this.hurt) {
      if (this.healthIncTimer < this.healthIncTime) {
        let multi = 1
        if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
          multi = 3
        }
        this.healthIncTimer += (delta * multi)
      } else {
        this.health++
        this.healthIncTimer = 0
      }
    }

    // this.scene.gfx.strokeRect(this.x, this.y, this.body.width, this.body.height);
    // this.exitDoorTime += delta


    /////////////////////////////////////////////////////////////
    //Input logic
    let input = {
      left: keys.left.isDown,
      right: keys.right.isDown,
      up: keys.up.isDown,
      down: keys.down.isDown,
      jump: keys.jump.isDown,
      melee: keys.melee.isDown,
      shoot: keys.shoot.isDown,
      dash: keys.dash.isDown
    }

    // holds
    let holds = {
      left: keys.left.timeDown,
      right: keys.right.timeDown,
      up: keys.up.timeDown,
      down: keys.down.timeDown,
      jump: keys.jump.timeDown,
      melee: keys.melee.timeDown,
      shoot: keys.shoot.timeDown,
      dash: keys.dash.timeDown
    }

    // if(this.scene.exitLayer && input.up && !this.exiting){
    //   this.exiting = true
    //   console.log(time)
    //   this.scene.physics.world.overlap(this, this.scene.exitLayer, this.scene.exitWorld.bind(this.scene))
    //   // return
    // }
    // this.hold.up    && input.up    ? null : this.hold.up = false
    // this.hold.down  && input.down  ? null : this.hold.down = false
    // this.hold.left  && input.left  ? null : this.hold.left = false
    // this.hold.right && input.right ? null : this.hold.right = false
    // this.hold.jump  && input.jump  ? null : this.hold.jump = false
    // this.hold.shoot && input.shoot ? null : this.hold.shoot = false


    // if both are down, we check to see the newest one pressed
    let vel = 0

    if(input.right){
      vel = 1
    } 

    if(input.left){
      vel = -1
    }

    if(input.left && input.right){
      if(holds.right > holds.left){
        vel = 1
      } else {
        vel = -1
      }
    }

    // SLOBLEM: hurtTime
    if(this.hurtTime <= 0 || this.hurtTime > 250){
      if ((this.body.blocked.down && !input.left && !input.right) 
        || (this.meleeWeapon.swingHold > 0 && this.meleeWeapon.swingHold < this.meleeWeapon.swingHigh) && this.body.blocked.down) {
        this.run(0)
      } else {
        this.run(vel)
      }
    }

    /////////////////////////////////////////////////////////////
    //Jump Logic
    // this.hold.jump  && input.jump  ? null : this.hold.jump = false

    // we subtract from the the jump timer if we are jumping.
    if(this.jumpTimer > 0 && this.jumping){
      this.jumpTimer -= delta
    }

    // we want to know if the player let go of the jump button
    //  in air for the double jump
    if(this.jumpHold && !input.jump){
      this.jumpHold = false
    }

    if (this.body.velocity.y !== 0 && !this.jumping) {
      this.isFalling = true
      this.jumpTimer = 0
      this.jumps++
    }

    if (input.jump) {
      this.jump()
      this.jumpHold = true
    }else if(!input.jump && this.body.blocked.down){
      this.jumping = false
      this.jumps = 0
      this.isFalling = false
      this.jumpTimer = 120
    }

      //for not quick entry AND timing scene changing problem
    // if(this.scene.worldConfig.exitLayer && input.up && this.exitDoorTime > 1000){
    //   this.scene.physics.world.overlap(this, this.scene.exitLayer, this.scene.exitWorld.bind(this))
    // }
    // }

    if(this.meleeWeapon.swinging && this.prevState.flipX !== this.flipX){
      this.meleeWeapon.swing(false)
    }

    //Melee Logic
    if(input.melee && !this.prevState.melee && this.hasMelee){
      this.meleeWeapon.swing(true)
    } 

    if (!input.melee) {
      this.meleeWeapon.swing(false)
    }

    //proj logic
    if(input.shoot && !this.prevState.shoot && this.hasGun && 
      (time > this.lastFired || this.lastFired === 0) && 
      !(this.meleeWeapon.swingHold > 0 && this.meleeWeapon.swingHold < this.meleeWeapon.swingHigh || 
        this.meleeWeapon.swinging)) {
      // console.log(this.scene.projectiles)
      // let bullet = this.scene.bullets.get()
      // console.log(bullet)


      // TODO
      // Need to be careful about running out of 50 bullets!

      if(this.ammo > 0){
        // console.log(this.body.x + " " + this.body.y)
        this.shooting = true
        
        this.ammo--
        this.lastFired = time + this.projFrequency

        // this.scene.ammoText.text = 'AMMO ' + this.ammo
      } else {
        console.log("no more projectiles!! out of ammo")
      }
    }

    this.gun.update(this.shooting, delta)

    //wall logic
    if(this.body.blocked.left && !this.body.blocked.down && input.left ||
      this.body.blocked.right && !this.body.blocked.down && input.right) {
      if(this.body.velocity.y > 0) {
        this.body.setVelocityY(this.wallSlow)
      }

      if(input.jump && !this.prevState.jump){
        let dir = this.body.blocked.left ? 1 : -1

        this.body.setVelocity(this.jumpVelocity * dir, this.jumpVelocity * -1.1)
        this.scene.sound.playAudioSprite('sfx', 'jump', { volume: .3 })
      }
    }

    //hurt logic
    if(this.hurt){
      if(this.hurtTime > this.hurtTimer){
        this.hurt = false
        this.hurtTime = 0
        console.log('player no longer hurt')
      } else {
        this.hurtTime += delta
      }
    }
    
    if(this.hurt){
      // dont know how this works but it does
      this.tintStep = (this.tintStep === 5) ? 0 : this.tintStep + 1
      this.tint = [0xFFFFFF, 0xFF0000, 0xFF0000, 0xFF0000, 0xFF0000, 0xFF0000][this.tintStep];
    } else {
      if(this.tint !== 0xFFFFFF){
        this.tint = 0xFFFFFF
      }
    }

    //dash logic
    if(input.dash && !this.prevState.dash && 
      this.canDash && !this.dashWarming && 
      !this.dashing && this.dashes < this.maxDashes){
      this.dashes++
      this.dashWarming = true
      this.body.allowGravity = false
      this.scene.sound.playAudioSprite('sfx', 'dash-warm', { volume: .3 })
    }

    if(this.dashWarming){
      if(this.dashTime > this.dashTimer || this.prevState.dash && !input.dash){
        console.log('dashing')
        this.dash(this.flipX, this.dashTime, this.dashTimer)
        this.scene.sound.playAudioSprite('sfx', 'dash', { volume: .3 }) // ???
      } else {
        this.body.setVelocity(0)
        this.dashTime += delta
      }
    }

    if(this.maxVelocityTimer > 0){
      this.maxVelocityTimer -= delta
    } 

    //end dash
    if(this.maxVelocityTimer <= 0){
      this.maxVelocityTimer = 0
      this.dashing = false

      //possibly helps with timing?
      if(this.body.maxVelocity.x !== 150){
        this.body.maxVelocity.x = 150
        this.body.allowGravity = true
        this.body.setVelocityX(0)
      }
    }

    if (this.dashes !== 0 && this.body.blocked.down) {
      this.dashes = 0
    }

    //Animation Logic
    if(this.body.velocity.x === 0){
      this.animation = 'stand'
    } else {
      this.animation = 'run'
    }

    if(!this.body.blocked.down){
      if(this.body.velocity.y < 0){
        this.animation = 'jump-up'
      } else {
        this.animation = 'jump-down'
      }
    }

    if(this.meleeWeapon.swingingDir){
      if(this.meleeWeapon.swingingDir === 'up')
        this.animation = 'swing-up'
      if(this.meleeWeapon.swingingDir === 'down')
        this.animation = 'swing-down'
    }

    if (!this.meleeWeapon.swingingDir && this.meleeWeapon.swinging || this.shooting) {
      if(this.body.velocity.x !== 0){
        this.animation = 'swing-run'
      }

      if(this.body.velocity.y !== 0) {
        this.animation = 'swing-jump'
      }

      if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
        this.animation = 'swing-stand'
      }
    }

    if (this.dashWarming) {
      this.animation = 'dash-warm'
    }

    if (this.dashing) {
      this.animation = 'dash'
    }

    this.anims.play(this.animation, true)

    this.meleeWeapon.update(time, delta, this.x, this.y, this.flipX ? 'right' : 'left')

    this.prevState.flipX = this.flipX
    this.prevState.jump = input.jump
    this.prevState.melee = input.melee
    this.prevState.dash = input.dash
    this.prevState.shoot = input.shoot
    // }
  }

  run(dir) {

    let vel = this.acceleration * dir

    if (dir === 0) {
      // 10 instead of 
      if (Math.abs(this.body.velocity.x) < 10) {
        this.body.setVelocityX(0)
        this.body.setAccelerationX(vel)
      } else {
                                                          // higher will slow it down
        this.body.setAccelerationX(((this.body.velocity.x > 0) ? -1 : 1) * this.acceleration * 1)
      }
    } else {
      if (this.body.velocity.y === 0 && this.body.blocked.down) {
        this.body.setAccelerationX(vel);
      }
      else {
        this.body.setAccelerationX(vel / 2)
      }
      if(!this.meleeWeapon.swinging && !this.shooting){
        this.flipX = dir < 0 ? false : true
      }
    }
  }

  jump() {
    if (!this.body.blocked.down && !this.jumping && this.jumps < this.maxJumps) {
      return;
    }

    // console.log(this.jumpTimer)

    // first jump just needs to be on ground
    if(this.body.blocked.down && !this.jumpHold){
      this.body.setVelocityY(-this.jumpVelocity)
      this.scene.sound.playAudioSprite('sfx', 'jump', { volume: .3 })
      this.jumpTimer = 120
      this.jumping = true
      this.jumps++

      return
    }
      
    // second jump needs to be
    if((this.jumping || !this.body.blocked.down) && this.jumps < this.maxJumps && (this.jumpTimer <= 0 || this.isFalling) && !this.jumpHold){
      this.body.setVelocityY(-this.jumpVelocity / 1.5)
      this.jumpTimer = 120
      this.jumps++
      this.scene.sound.playAudioSprite('sfx', 'jump', { volume: .2 })
      return
    }

    if(this.jumpHold && this.jumpTimer > 0) this.body.setVelocityY(-this.jumpVelocity / 1.5)
  }

  hurtByEnemy(player, enemy) {
    let damage
    let lrDir = player.x >= enemy.x ? 1 : -1

    if (enemy.hurt || player.hurt) return

    if (enemy.attacking) {
      damage = enemy.attackDamage
    } else {
      damage = enemy.stillDamage
    }

    if (enemy.alive) {
      if(player.body.blocked.down && player.body.velocity.y === 0){
        console.log('setting velocity:' + (damage * lrDir * 100))
        player.body.setVelocityX(damage * lrDir * 100)  
      } else {
        player.body.setVelocity(damage * 100 * lrDir, damage * -5)  
      }
      player.damage(damage)
      player.hurt = true
    }
  }

  dash (dir, dashTime, dashTimer) {
    console.log('trying to dash')
    this.dashTime = 0
    this.dashWarming = false
    dir = dir ? 1 : -1

    console.log(dir * (dashTime / dashTimer) * this.dashVeloctiy)

    this.body.maxVelocity.x = 400
    this.maxVelocityTimer = 150
    this.dashing = true

    this.body.setVelocityX(dir * (dashTime / dashTimer) * this.dashVeloctiy)
  }

  cancelDash () {
    this.dashTime = 0
    this.dashWarming = false
    this.body.allowGravity = true
  }

  damage(damage){
    this.health -= damage
    console.log('damagedddddddd')
    if(this.health <= 0) this.kill()

    this.scene.sound.playAudioSprite('sfx', 'player-hurt', { volume: .2 })
  }

  kill() {
    this.alive = false
  }

}
