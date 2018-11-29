import Player from '../Player/Player'
import Bullet from '../GameObjects/Bullet'
import Pest from '../Enemies/Pest'
import Boss from '../Enemies/Boss'
import BigBoss from '../Enemies/BigBoss'
import Text from '../OtherObjects/Text'
import HUD from '../OtherObjects/HUD'

export default class GameScene extends Phaser.Scene {
  constructor (config) {
    super({
      key: 'GameScene'
    })

    this.sceneWidth = 0
    this.sceneHeight = 0
    this.switching = false
    this.exitSquare = false

    //probably wont change
    this.hudHeight = 30
  }

  preload () {

    this.switching = true

    this.stage = this.scene.settings.data.stage
    this.controls = this.scene.settings.data.controls

    // TODO: changeable controls
    // if(this.controls === 'arrows'){
      this.control = {
        jump: 'J',
        melee: 'K',
        shoot: 'L',
        bomb: 'O',
        dash: 'I',
        slide: 'U'
      }
    // } else {
    // }

    this.stageConfig = this.sys.cache.json.entries.entries.stages[this.stage]
    this.animsConfig = this.sys.cache.json.entries.entries.animations
    this.pestConfig = this.sys.cache.json.entries.entries.pests
    this.weaponsConfig = this.sys.cache.json.entries.entries.weapons

    this.nextStage = this.stageConfig.nextStage

    this.dialogLine = 0
    this.dialogPos = 0
    this.dialogOpen = false
    this.dialogHalt = 2

    this.windowDimensions = {x: this.sys.game.config.width, y: this.sys.game.config.height - this.hudHeight}

    // aluminum bat should be taken out.
    this.animsArray = ['slob', 'aluminumBat', 'bullet', 'selectorBounce']

    this.load.image(`${this.stage}-background`, `assets/backgrounds/${this.stage}.png`)

    this.pests = this.stageConfig.pests
    if(this.pests) {
      this.pests.map(enemy => {
        if(!this.animsArray.includes(enemy.name)){
          this.animsArray.push(enemy.name)
          this.load.spritesheet(enemy.name, `assets/characters/enemies/${enemy.name}.png`, { frameWidth: 16, frameHeight: 8, spacing: 2, margin: 1 })
        }
      })
    }

    this.bosses = this.stageConfig.bosses
    if(this.bosses) {
      this.bosses.map(boss => {
        if(!this.animsArray.includes(boss.name)){
                                                                                          // make this come from the boss object
          this.animsArray.push(boss.name)
          this.load.spritesheet(boss.name, `assets/characters/bosses/${boss.name}.png`, { frameWidth: 16, frameHeight: 16, spacing: 2, margin: 1 })
        }
      })
    }

    this.bigBosses = this.stageConfig.bigBosses
    if(this.bigBosses) {
      this.bigBosses.map(boss => {
        if(!this.animsArray.includes(boss.name)){
          this.animsArray.push(boss.name)
          this.load.spritesheet(boss.name, `assets/characters/bosses/${boss.name}.png`, { frameWidth: 48, frameHeight: 48, spacing: 2, margin: 1 })
        }
      })
    }

    this.items = this.stageConfig.items
    if (this.items) {
      this.items.map(item => {
        if(!this.animsArray.includes(item.name)){
          this.animsArray.push(item.name)
          this.load.spritesheet(item.name, `assets/weapons/${item.name}.png`, { frameWidth: item.size.x, frameHeight: item.size.y, spacing: 2, margin: 1 })
        }
      })
    }


    this.load.spritesheet('slob', 'assets/characters/player/slob.png', { frameWidth: 16, frameHeight: 16, spacing:2, margin:1})

    this.load.spritesheet(`${this.stage}-tiles`, `assets/tilesets/${this.stage}.png`, { frameWidth: 16, frameHeight: 16, spacing: 2, margin: 1 })
    this.load.tilemapTiledJSON(this.stage, `assets/tilemaps/${this.stage}.json`)

    this.load.spritesheet('aluminumBat', 'assets/weapons/aluminumBat.png', { frameWidth: 16, frameHeight: 16, spacing:2, margin:1})
    this.load.spritesheet('bullet', 'assets/weapons/bullet.png', { frameWidth: 8, frameHeight: 8/*, spacing:2, margin:1*/})
    this.load.spritesheet('selectorBounce', 'assets/menu/selectorBounce.png', { frameWidth: 16, frameHeight: 16, spacing:2, margin:1})


    this.cameraTimer = 25
    this.cameraTime = 0
    this.cameraNudge = 0
    this.cameraNudge = 1
    this.cameraDelay = 1000 * this.stageConfig.cameraDelay
    this.cameraIncrement = 0

    this.bossesNum = 0

    this.goingNext = false
    this.goingNextTime = 1000

    this.deathTimer = 2000
    this.deathTime = 0
    this.warn1Time = 1
    this.warn1Played = false
    this.warn2Time = 1000
    this.warn2Played = false
    this.deathPlayed = false

    this.goingDead = false
    this.goingDeadTime = 500
  }

  create () {

    this.add.image(240, 270, `${this.stage}-background`).setScrollFactor(0, 0.1).setAlpha(0.3)

    this.map = this.make.tilemap({
      key: this.stage
    })

    this.contactTileSet = this.map.addTilesetImage(this.stage, `${this.stage}-tiles`)
    this.contactLayer = this.map.createDynamicLayer('contactLayer', this.contactTileSet, 0, 0 + this.hudHeight)
    this.contactLayer.setCollisionByProperty({ collide: true })

    this.sceneWidth = this.contactLayer.width
    this.sceneHeight = this.contactLayer.height

    this.textGroup = []
    let text = this.stageConfig.text

    text.map(item => {
      let textReplaced = item.text
        .replace('jumpButton', this.control.jump)
        .replace('meleeButton', this.control.melee)
        .replace('shootButton', this.control.shoot)
        .replace('bombButton', this.control.bomb)
        .replace('slideButton', this.control.slide)
        .replace('dashButton', this.control.dash)
      let it = new Text(
        this, 
        item.color, 
        textReplaced, 
        item.position,
        item.scrollPosition,
        item.fadeTime,
        item.fadesOut
      )

      this.textGroup.push(it)

      it.create()
    })

    this.createAnimations()
    this.animsMade = true
      
    let playerX, playerY 
    let playerFlipX = false

    this.playerMaxJumps = 1
    this.playerMaxDashes = 1

    playerX = 16 * 2.5
    playerY = this.stageConfig.playerY

    this.player = new Player({
      scene: this,
      key: 'player',
      x: playerX,
      y: playerY,
      hasGun: this.stageConfig.hasGun,
      HasSword: this.stageConfig.hasSword,
      maxJumps: this.stageConfig.maxJumps,
      maxDashes: this.stageConfig.maxDashes
    })

    this.player.create()
    this.player.flipX = true // for now

    this.physics.world.addCollider(this.player, this.contactLayer)

    if(this.contactLayer){
    } else {
      this.contactLayer = null
    }

    this.pestGroup = this.add.group()

    if(this.pests){
      this.pests.map(enemy => {
        let pos = enemy.position.split('x')
        this.pestGroup.add(new Pest({
          scene: this,
          key: 'sprites16',
          x: Number(pos[0]) * 16 + 8,
          y: Number(pos[1]) * 16,
          name: enemy.name,
          details: this.pestConfig[enemy.name]
        })) 
      })

      this.physics.add.collider(this.contactLayer, this.pestGroup)
    }

    this.physics.add.overlap(this.player, this.pestGroup, this.player.hurtByEnemy)
    this.bossGroup = this.add.group()

    if(this.bosses){
      this.bosses.map(enemy => {
        this.bossesNum++
        let pos
        let flipX = false// = enemy.position.split('x')
        this.bossGroup.add(new Boss({
          scene: this,
          key: 'opponent',
          x: enemy.position.x,
          y: enemy.position.y,
          name: enemy.name,
          details: enemy.details,
          flipX: flipX
        })) 
      })
      this.physics.add.collider(this.contactLayer, this.bossGroup)
    }

    if(this.bigBosses){
      this.bigBosses.map(enemy => {
        this.bossesNum++

        let pos
        let flipX = false// = enemy.position.split('x')
        this.pestGroup.add(new BigBoss({
          scene: this,
          key: 'opponent',
          x: enemy.position.x,
          y: enemy.position.y,
          name: enemy.name,
          details: enemy.details,
          flipX: flipX
        })) 
      })
      this.physics.add.collider(this.contactLayer, this.bossGroup)
    }

    this.itemGroup = []

    this.items = this.items.map(item => {
      let spr = this.add.sprite(item.position.x, item.position.y)
      spr.play(`${item.name}-idle`)

      return {
        image: spr,
        type: item.type,
        name: item.name,
        data: item.data,
        visible: false
      }
    })

    this.cameras.main.fadeIn(500)
      .startFollow(this.player)
      .setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels + this.hudHeight) // <- may need to change with long and narrow or high amd skinny
      .setBackgroundColor(`#${this.stageConfig.bgColor}`)
      .stopFollow()

    if(this.controls === 'arrows'){
    } else {
    } 

    this.keys = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
      melee: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
      shoot: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L),
      bomb: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O),
      dash: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I),
      slide: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J)
    }

    this.HUD = new HUD(this)
    this.HUD.create()

    this.switching = false
    this.scenePause = false
    this.prevState = {}

    this.bullets = this.add.group({
      classType: Bullet,
      maxSize: 50,
      runChildUpdate: false
    })

    this.switching = false

    this.music = this.sound.playAudioSprite('soundtrack', this.stage, { loop: true })
  }

  update(time, delta){
    if (this.switching) return

    if ((this.bosses || this.bigBosses) && this.bossesNum === 0 && !this.goingNext) {
      this.pauseMusic()
      this.sound.playAudioSprite('soundtrack', 'win', { volume: 0.9 })
      this.cameras.main.fadeOut(1000)
      this.goingNext = true
    }

    if (this.goingNext) {
      if(this.goingNextTime > 0) {
        this.goingNextTime -= delta
      } else {
        this.clearKeys()
        this.scene.start('IntermediateScene', { nextStage: this.nextStage })
      }
    }

    if(!this.player.alive && !this.goingDead) {
      this.cameras.main.fadeOut(this.goingDeadTime)
      this.pauseMusic()
      this.sound.playAudioSprite('soundtrack', 'lose', { volume: 0.7 })
      this.goingDead = true
    }

    if (this.goingDead) {
      if(this.goingDeadTime > 0) {
        this.goingDeadTime -= delta
      } else {
        this.clearKeys()
        this.scene.start('DeathScene', { currentStage: this.stage })
      }
    }

    if(this.player.y > this.cameras.main.scrollY + 270 + 30){
      if (this.deathTime < this.deathTimer) {
        this.deathTime += delta

        if(this.deathTime > this.warn1Time && !this.warn1Played){
          this.warn1Played = true
          this.sound.playAudioSprite('sfx', 'death-warn', { volume: 0.4 })
        }

        if(this.deathTime > this.warn2Time && !this.warn2Played){
          this.warn2Played = true
          this.sound.playAudioSprite('sfx', 'death-warn', { volume: 0.6 })
        }
      } else {
        if (!this.deathPlayed) {
          this.deathPlayed = true
          this.sound.playAudioSprite('sfx', 'death', { volume: 0.6 })
        }
        this.player.kill()
      }

    } else {
      if (this.deathTime !== 0) {
        this.deathTime = 0
        this.warn1Played = false
        this.warn2Played = false
        this.deathPlayed = false
      }
    }

    this.player.update(this.keys, time, delta)

    this.pestGroup.children.entries.map(pest => pest.update(time, delta))
    this.bullets.children.entries.map(bullet => bullet.update(time, delta))
    this.bossGroup.children.entries.map(boss => boss.update(time, delta))

    this.items.map(item => {
      if(!item.taken){
        if(Math.abs(item.image.x - this.player.x) < 10 && Math.abs(item.image.y - this.player.y) < 16 && !item.taken){
          item.image.visible = false
          item.taken = true

          let data = this.weaponsConfig[item.name]

          switch (item.type) {
            case ('ammo'):
              this.player.ammo += this.player.ammoInc
              this.sound.playAudioSprite('sfx', 'bullet-pickup', { volume: .8 })
              break
            case ('gun'):
              this.player.hasGun = true
              this.player.gun.name = item.name
              this.player.ammoInc = data.ammoInc
              this.player.firePerSec = data.firePerSec
              this.player.projFrequency = 1000 / this.player.firePerSec
              this.sound.playAudioSprite('sfx', 'gun-pickup', { volume: .8 })
              break
            case ('melee'):
              this.player.hasMelee = true
              this.player.meleeWeapon.name = item.name
              this.player.meleeWeapon.damage = data.damage
              this.player.meleeWeapon.blowback = data.blowback

              this.player.meleeWeapon.swingStart = data.swingStart
              this.player.meleeWeapon.swingLow = data.swingLow
              this.player.meleeWeapon.swingHigh = data.swingHigh
              this.sound.playAudioSprite('sfx', 'sword-pickup', { volume: .8 })
              break
          }
        }
      }
    })

    this.HUD.update()

    this.textGroup.map(text => text.update(delta, this.cameras.main.scrollY))

    // camera update
    if(this.cameraDelay === 0){
      this.cameraTime += delta

      if (this.cameraTime > this.cameraTimer) {
        let wv = this.cameras.main.worldView.x

        this.cameras.main.scrollY -= this.cameraNudge
        this.cameraIncrement++
        this.cameraTime = 0
      }
    } else {
      this.cameraDelay -= delta
      if(this.cameraDelay < 0){
        this.cameraDelay = 0
      }
    }
  }

  createAnimations(){
    if (this.anims.anims) {
      this.anims.anims.clear()
    }

    this.animsArray.map(item => {
      let sheet = this.animsConfig[item].sheet

      this.animsConfig[item].anims.map(anim => {
        this.anims.create({
          key: anim.key,
          frames: this.anims.generateFrameNumbers(sheet, anim.frames),
          frameRate: anim.frameRate ? anim.frameRate : 1,
          repeat: anim.repeat ? anim.repeat : -1,
          repeatDelay: anim.repeatDelay ? anim.repeatDelay : 0
        })
      })
    })
  }

  pauseMusic () {
    let sounds = this.sound.sounds
    for(let i = 0; i < sounds.length; i++) {
      if(sounds[i].key === 'soundtrack') {
        this.sound.sounds[i].pause()
      }
    }
  }

  clearKeys () {
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.D)
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.J)
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.K)
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.L)
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.O)
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.I)
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.U)
  }
}