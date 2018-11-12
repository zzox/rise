import Melee from '../GameObjects/Melee'
import Gun from '../GameObjects/Gun'

export default class Boss extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.name, config.hasGun, config.hasSword, config.maxJumps, config.maxDashes)
    config.scene.physics.world.enable(this)
    config.scene.add.existing(this)

    this.beenSeen = false

    this.hasSword = config.hasSword
    this.hasGun = config.hasGun
    this.maxJumps = config.maxJumps
    this.maxDashes = config.maxDashes
    this.player = this.scene.player
    this.name = config.name

    console.log(config)

 
    // console.log("create Player???")
    // original val = 125


    this.jumps = 0
    this.jumping = false
    this.jumpTimer = 120
    this.jumpHold = false
    this.falling = false
    this.jumpVelocity = config.details.jumpVelocity
    this.wallJumpVelocity = this.jumpVelocity / 2
    this.hasSword = config.details.hasSword
    this.hasGun = config.details.hasGun
    this.maxJumps = config.details.maxJumps
    this.flipX = config.flipX
    this.health = config.details.health

    this.body.maxVelocity.x = config.details.maxVelocityX
    this.body.maxVelocity.y = 300
    this.acceleration = 800


    this.body.offset.set(14, 8)
    this.body.setSize(10, 16)
    this.anims.play(`${this.name}-stand`)


    // this.setDisplaySize(64, 64)

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

    let wepConfig = this.scene.weaponsConfig[this.weapon]

    this.meleeWeapon = new Melee({
      scene: this.scene,
      key: 'melee',
      name: 'aluminumBat',
      swingStart: wepConfig.swingStart,
      swingLow: wepConfig.swingLow,
      swingHigh: wepConfig.swingHigh,
      damage: wepConfig.damage,
      blowback: wepConfig.blowback,
      possession: 'opponent'
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

    // this.hasGun = false
    this.gun = 'pistol'
    this.ammoInc = 3
    this.ammo = 50
    this.firePerSec = 1
    this.lastFired = 0
    this.projFrequency = 1000 / this.firePerSec
    this.shooting = false

    // proj    this.decisionTimer = config.details.decisionTime
    this.decisionTimer = config.details.decisionTime
    this.decisionTime = 0
    this.gun = new Gun({
      scene: this.scene,
      key: 'gun',
      name: 'pistol',
      player: this,
      from: 'boss'
    })

    // no grav proj


    this.state = 'approach'

    this.prevState = {}

    this.holds = {
      left: 0,
      right: 0,
      up: 0,
      down: 0,
      jump: 0,
      shoot: 0
    }

    this.prevState = {}

    this.wallSlow = 50
    // this.wallSlowing = false
  }

  activated () {
    if(!this.beenSeen){
      if(this.player.y < this.y + 8){
        this.beenSeen = true
        return true
      }
      return false
    }
    return true
  }

  update(time, delta) {

    if (!this.alive) {
      // suspicious
      if(this.tint !== 0x000000) {
        this.scene.bossesNum--
        this.tint = 0x000000
      }
      return
    }

    // console.log(this.x + ' ' + this.y)

    // if (!this.scene){
    //   return
    // }
    //use this?????

    if(!this.activated()) return


    this.decisionTime += delta
    if(this.decisionTime > this.decisionTimer || this.decisionTimer < 20){
      this.decisionTime = 0
  

    // State Logic
    
    //state decider
      if(this.hurt){
        this.state = 'evade'
      } else if(Math.random() > .7){
        console.log('chilling')
        this.state = 'chill'
      } else if(Math.abs(this.player.x - this.x) < 25 &&
                Math.abs(this.player.y - this.y) < 25) {
        this.state = 'attack'
      } else {
        this.state = 'approach'
      }

    }





    let input = {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
      melee: false,
      shoot: false
    }

    // for(let key in input){
    //   if(Math.random() > .6) {
    //     input[key] = true
    //   } 
    // }

    // console.log(this.state)
    switch(this.state) {
      case 'approach':
        if(this.player.x < this.x){
          input.left = true
          input.right = false
          if(this.body.blocked.left && this.body.blocked.down
            || this.jumping && this.body.blocked.left){
            input.jump = true
          }
        } else {
          input.right = true 
          input.left = false
          if(this.body.blocked.right && this.body.blocked.down
            || this.jumping && this.body.blocked.right){
            input.jump = true
          }
        }
        break
      case 'evade':
        if(this.player.x < this.x){
          input.left = false
          input.right = true
          if(this.body.blocked.right && this.body.blocked.down
            || this.jumping && this.body.blocked.right){
            input.jump = true
          }
        } else {
          input.right = false
          input.left = true
          if(this.body.blocked.left && this.body.blocked.down
            || this.jumping && this.body.blocked.left){
            input.jump = true
          }
        }
        break
      case 'attack':
        if(this.player.x < this.x){
          input.left = true
          input.right = false
          input.melee = true
        } else {
          input.left = false
          input.right = true
          input.melee = true          
        }
        break
      case 'chill':
        input.left = false
        input.right = false
        input.up = false
        input.down = false
        input.jump = false
        input.melee = false          
        input.shoot = false          
        break
    }

    if(Math.abs(this.player.y - this.x) < 16){
      if(Math.random() > .5){
        input.shoot = true
      } else {
        input.jump = true
      }
    }

    //clear stuff
    if(this.holds.jump > 333){
      input.jump = false
    }

    if(this.holds.shoot > 50){
      input.shoot = false
    }

    if(this.meleeWeapon.swingHold > 200){
      input.melee = false
    }

    //calc holds
    for(let key in this.holds) {
      if(input[key]){
        this.holds[key] += delta
      } else {
        this.holds[key] = 0
      }
    }

    /////////////////////////////////////////////////////////////
    //Input logic
    // let input = {
    //   left: keys.left.isDown,
    //   right: keys.right.isDown,
    //   up: keys.up.isDown,
    //   down: keys.down.isDown,
    //   jump: keys.jump.isDown,
    //   melee: keys.melee.isDown,
    //   shoot: keys.shoot.isDown,
    //   dash: keys.dash.isDown
    // }

    // // holds
    // let holds = {
    //   left: keys.left.timeDown,
    //   right: keys.right.timeDown,
    //   up: keys.up.timeDown,
    //   down: keys.down.timeDown,
    //   jump: keys.jump.timeDown,
    //   shoot: keys.shoot.timeDown,
    //   dash: keys.dash.timeDown
    // }

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
    if(input.melee && !this.prevState.melee){
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
      }
    }

    //hurt logic
    if(this.hurt){
      if(this.hurtTime > this.hurtTimer){
        this.hurt = false
        this.hurtTime = 0
        // console.log('player no longer hurt')
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
    }

    if(this.dashWarming){
      if(this.dashTime > this.dashTimer || this.prevState.dash && !input.dash){
        // console.log('dashing')
        this.dash(this.flipX, this.dashTime, this.dashTimer)
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
      this.animation = 'jump'
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

    // console.log(this.animation)
    // console.log(this.anims.currentAnim.key)
    // console.log(this.anims)
    // if(this.anims.currentAnim.key != this.animation){
      // console.log("playing new")
      // console.log(this.anims)
      this.anims.play(`${this.name}-${this.animation}`, true)

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
      // this.scene.sound.playAudioSprite('sfx', 'smb_jump-small', {volume: .2})
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
      // this.scene.sound.playAudioSprite('sfx', 'smb_jump-super', {volume: .2})
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
        player.body.setVelocity(damage * 100 * lrDir, damage * -10)  
      }
      player.health = player.health - damage
      player.hurt = true
    }

    if (player.health <= 0) {
      player.die()
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
  }

  kill() {
    this.alive = false
  }

}