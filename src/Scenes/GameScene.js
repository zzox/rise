import Player from '../Player/Player'
import Pest from '../Enemies/Pest'
import Text from '../OtherObjects/Text'
// import Opponent from '../Enemies/Opponent'
// import Bullet from '../ForeignObjects/Bullet'

// import GameState from '../utils/GameState'

export default class GameScene extends Phaser.Scene {
  constructor(config) {
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

  preload(){

    this.stage = this.scene.settings.data.stage
    console.log(this.scene)
    console.log(this.stage)

    this.controls = this.scene.settings.data.controls

    // this.GameState = this.scene.settings.data.state
    // console.log(this.GameState)

    // const level = this.GameState.level()

    // this.name = level.name
    // this.enemiesNum = level.enemiesNum
    // this.playerHasGun = level.playerData.gun
    // this.playerHasSword = level.playerData.sword

    console.log(this.name)
    console.log(this.enemiesNum)
    
    // this.screenOffset = { x: 0, y: 0 }
    this.stageConfig = this.sys.cache.json.entries.entries.stages[this.stage]
    this.animsConfig = this.sys.cache.json.entries.entries.animations
    // this.dialogConfig = this.sys.cache.json.entries.entries.dialog
    this.pestConfig = this.sys.cache.json.entries.entries.pests
    this.weaponsConfig = this.sys.cache.json.entries.entries.weapons
    // this.opponentConfig = this.sys.cache.json.entries.entries.opponents

    this.dialogLine = 0
    this.dialogPos = 0
    this.dialogOpen = false
    this.dialogHalt = 2

    this.windowDimensions = {x: this.sys.game.config.width, y: this.sys.game.config.height - this.hudHeight}
    // if(this.worldConfig.offsetNeeded){
    //   this.screenOffset.x = (this.windowDimensions.x - this.worldConfig.size.x) / 2
    //   this.screenOffset.y = (this.windowDimensions.y - this.worldConfig.size.y) / 2
    // }

    // aluminum bat should be taken out.
    this.animsArray = ['slob', 'aluminumBat', 'bullet', 'selectorBounce']

    console.log('this.gameConfig')
    console.log(this.gameConfig)

    // look through cache to see if I need to load it.
    // let cont = this.gameConfig.content.tilesets

    // for (var i = cont.length - 1; i >= 0; i--) {
    //   console.log('cont[i]')
    //   console.log(cont[i])
    //   // this.load.spritesheet(`${this.town}-${cont[i]}-tiles`, `assets/tilesets/introStages/${this.town}-${cont[i]}.png`, { frameWidth: 16, frameHeight: 16, spacing:2, margin:1})
    //   this.load.spritesheet(cont[i], `assets/tilesets/introStages/${cont[i]}.png`, { frameWidth: 16, frameHeight: 16, spacing:2, margin:1})
    // }

    // this.load.spritesheet()

    // this.npc = this.worldConfig.content.npc
    // if(this.npc) {
    //   this.load.spritesheet('speechBubble', 'assets/characters/additional/speechBubble.png', { frameWidth: 16, frameHeight: 20, spacing: 2, margin: 1 })
    //   this.npc.map(item => {
    //     this.animsArray.push(item.name)
    //     this.load.spritesheet(item.name, `assets/characters/npc/${item.name}.png`, { frameWidth: 16, frameHeight: 16, spacing: 2, margin: 1 })
    //   })
    // }

    this.pests = this.stageConfig.pests
    if(this.pests) {
      this.pests.map(enemy => {
        if(!this.animsArray.includes(enemy.name)){
                                                                                          // make this come from the enemy object
          this.animsArray.push(enemy.name)
          this.load.spritesheet(enemy.name, `assets/characters/enemies/${enemy.name}.png`, { frameWidth: 16, frameHeight: 8, spacing: 2, margin: 1 })
        }
      })
    }

    // this.opponents = this.gameConfig.content.opponents
    // console.log(this.opponents)

    // if(this.opponents) {
    //   this.opponents.map(enemy => {
    //     if(!this.animsArray.includes(enemy.name)){
    //                                                                                       // make this come from the enemy object
    //       this.animsArray.push(enemy.name)
    //       this.load.spritesheet(enemy.name, `assets/characters/npc/${enemy.name}.png`, { frameWidth: 16, frameHeight: 16, spacing: 2, margin: 1 })
    //     }
    //   })
    // }    

    this.load.spritesheet('slob-p', 'assets/characters/player/slob.png', { frameWidth: 16, frameHeight: 16, spacing:2, margin:1})
    // this.load.tilemapTiledJSON(this.mapName, `assets/tilemaps/${this.town}/${this.mapName}.json`)

    this.load.spritesheet(`${this.stage}-tiles`, `assets/tilesets/${this.stage}.png`, { frameWidth: 16, frameHeight: 16, spacing: 2, margin: 1 })
    this.load.tilemapTiledJSON(this.stage, `assets/tilemaps/${this.stage}.json`)

    this.load.spritesheet('aluminumBat', 'assets/weapons/aluminumBat.png', { frameWidth: 16, frameHeight: 16, spacing:2, margin:1})
    this.load.spritesheet('bullet', 'assets/weapons/bullet.png', { frameWidth: 8, frameHeight: 8/*, spacing:2, margin:1*/})
    this.load.spritesheet('selectorBounce', 'assets/menu/selectorBounce.png', { frameWidth: 16, frameHeight: 16, spacing:2, margin:1})


    // 6 * 16.7 === 100.6
    this.cameraTimer = 25
    this.cameraTime = 0
    this.cameraNudge = 0
    this.cameraNudge = 1
    this.cameraDelay = 7000
    this.cameraIncrement = 0
  }

  create(){
    // if(this.gameConfig.offsetNeeded){
    //   var rect = new Phaser.Geom.Rectangle(this.screenOffset.x, this.screenOffset.y + this.hudHeight, this.worldConfig.size.x, this.worldConfig.size.y);
    //   let colorrr =  this.worldConfig.bgRect
    //   colorrr = parseInt(colorrr, 16)
    //   var graphics = this.add.graphics({ fillStyle: { color: colorrr } });
    //   graphics.fillRectShape(rect);
    // }

    // if(this.worldConfig.bgTileset){
    //   this.bgMap = this.make.tilemap({
    //     key: this.mapName
    //   })
    //   this.bgTileset = this.bgMap.addTilesetImage('humblock-bg', 'humblock-bg-tiles')

    //   if(this.worldConfig.farBackground)    this.farBackground    = this.bgMap.createDynamicLayer('farBackground', this.bgTileset, 0 + this.screenOffset.x, 0 + this.hudHeight + this.screenOffset.y).setScrollFactor(.125,.5)
    //   if(this.worldConfig.middleBackground) this.middleBackground = this.bgMap.createDynamicLayer('middleBackground', this.bgTileset, 0 + this.screenOffset.x, 0 + this.hudHeight + this.screenOffset.y).setScrollFactor(.25,.75)
    //   if(this.worldConfig.nearBackground)   this.nearBackground   = this.bgMap.createDynamicLayer('nearBackground', this.bgTileset, 0 + this.screenOffset.x, 0 + this.hudHeight + this.screenOffset.y).setScrollFactor(.375,.875)
    // }

    this.map = this.make.tilemap({
      key: this.stage
    })

    console.log('this.map')
    console.log(this.map)

    // may need to implement if statements protecting from multiple addTilesetImages
    // let layers = this.gameConfig.content.layers

    // console.log('layers')
    // console.log(layers)

    // for (let i = layers.length - 1; i >= 0; i--) {
    //   if(layers[i] === 'contactLayer'){
        this.contactTileSet = this.map.addTilesetImage(this.stage, `${this.stage}-tiles`)
        console.log(this.contactTileSet)
        // this.contactLayer = this.map.createDynamicLayer('contactLayer', this.contactTileSet, 0 + this.screenOffset.x, 0/* + this.hudHeight + this.screenOffset.y*/)
        this.contactLayer = this.map.createDynamicLayer('contactLayer', this.contactTileSet, 0, 0 + this.hudHeight)
        this.contactLayer.setCollisionByProperty({ collide: true })
        // this.contactLayer.filterTiles(item => {
        //   if(item.properties.collideDown === true){
        //     item.setCollision(false, false, true, false)
        //   }
        // })
      // } else if(layers[i].split('-')[1] === 'exitLayer'){
      //   this.exitTileSet = this.map.addTilesetImage(this.town + '-' + layers[i].split('-')[0], this.town + '-' + layers[i].split('-')[0] + '-tiles')
      //   this.exitLayer = this.map.createDynamicLayer(layers[i].split('-')[1], this.exitTileSet, 0 + this.screenOffset.x, 0 + this.hudHeight + this.screenOffset.y)
      // }else{
      //   this.backgroundTileSet = this.map.addTilesetImage(this.town + '-' + layers[i].split('-')[0], this.town + '-' + layers[i].split('-')[0] + '-tiles')
      //                           // createDynamicLayer ????
      //   this.background = this.map.createStaticLayer(layers[i].split('-')[1], this.backgroundTileSet, 0 + this.screenOffset.x, 0 + this.hudHeight + this.screenOffset.y)
      // }
    // }

    console.log(this.contactLayer)

    this.sceneWidth = this.contactLayer.width
    this.sceneHeight = this.contactLayer.height

    // if(this.animsMade){
    //   this.anims.remove('run')
    //   this.anims.remove('slide-vert')
    //   this.anims.remove('stand')
    //   this.anims.remove('jump')
    // }

    this.textGroup = []
    let text = this.stageConfig.text

    text.map(item => {
      let it = new Text(
        this, 
        item.color, 
        item.text, 
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
    // if(this.freshRun){
    //   playerX = this.worldConfig.fresh.x + this.screenOffset.x
    //   playerY = this.worldConfig.fresh.y + this.hudHeight + this.screenOffset.y
    // } else if(this.fromInside){
    //   playerX = this.worldConfig.fromInside[this.fromInside].split('x')[0] * 16 + 8 + this.screenOffset.x
    //   playerY = this.worldConfig.fromInside[this.fromInside].split('x')[1] * 16 + 8 + this.hudHeight + this.screenOffset.y
    // } else {
    //   if(this.fromDoor){
    //     if(this.from === 'right'){
    //       playerX = this.map.widthInPixels - 16 + this.screenOffset.x
    //       playerY = this.sceneHeight - 8 + this.hudHeight + this.screenOffset.y
    //     } else if(this.from === 'left'){
    //       playerX = 16 + this.screenOffset.x
    //       playerY = this.sceneHeight - 8 + this.hudHeight + this.screenOffset.y
    //       playerFlipX = true
    //     }
    //   } else {
    //     if(this.from === 'right'){
    //       playerX = this.map.widthInPixels - 16 + this.screenOffset.x
    //       // playerY = this.sceneHeight - 8 + this.hudHeight + this.screenOffset.y
    //       playerY = this.playerY
    //     } else if(this.from === 'left'){
    //       playerX = 16 + this.screenOffset.x
    //       // playerY = this.sceneHeight - 8 + this.hudHeight + this.screenOffset.y
    //       playerY = this.playerY
    //       playerFlipX = true
    //     }
    //   }
    // }

    this.playerMaxJumps = 1
    this.playerMaxDashes = 1

    playerX = 16 * 2.5
    playerY = 16 * 60

    this.player = new Player({
      scene: this,
      key: 'player',
      x: playerX,
      y: playerY,
      hasGun: this.playerHasGun,
      HasSword: this.playerHasSword,
      maxJumps: this.playerMaxJumps,
      maxDashes: this.playerMaxDashes
    })
    this.player.create()
    this.player.flipX = true // for now
    
    // if(this.worldConfig.collideWB){
      // this.player.body.setCollideWorldBounds(true)
    // }
      this.physics.world.addCollider(this.player, this.contactLayer)

    if(this.contactLayer){
    } else {
      this.contactLayer = null
    }


    // if(this.npc){
    //   this.npcGroup = []
    //   this.bubbleGroup = []
    //   this.npc.map(item => {

    //     console.log('npc create')
    //     console.log(item)

    //     let pos = item.position.split('x')
    //     // console.log(Number(pos[0]) * 16 + this.screenOffset.x + " " + Number(pos[1]) * 16 + this.screenOffset.y + this.hudHeight)
    //     let spr = this.add.sprite(Number(pos[0]) * 16 + this.screenOffset.x + 8, Number(pos[1]) * 16 + this.screenOffset.y + this.hudHeight + 8, item.name)
    //     this.npcGroup.push(spr)
    //     spr.anims.play(`${item.name}-idle`)
        
    //     let bubble = this.add.sprite(spr.x, spr.y - 20, 'speechBubble') 
    //     this.bubbleGroup.push(bubble)
    //   })
    // }
    this.pestGroup = this.add.group()

    if(this.pests){
        // console.log(this.worldConfig.content)
      this.pests.map(enemy => {
        // console.log('enemy')
        // console.log(enemy)
        // console.log('enemyConfig')
        // console.log(this.enemyConfig)
        let pos = enemy.position.split('x')
        console.log(pos)
        console.log(this.pestConfig[enemy.name])
        this.pestGroup.add(new Pest({
          scene: this,
          key: 'sprites16',
          x: Number(pos[0]) * 16 + 8,
          y: Number(pos[1]) * 16,
          name: enemy.name,
          details: this.pestConfig[enemy.name]
        })) 
      })
      console.log('enemies here')
      this.physics.add.collider(this.contactLayer, this.pestGroup)
    }

    this.physics.add.overlap(this.player, this.pestGroup, this.player.hurtByEnemy)
    // this.opponentGroup = this.add.group()

    // if(this.opponents){
    //     // console.log(this.worldConfig.content)
    //   this.opponents.map(enemy => {
    //     // console.log('enemy')
    //     // console.log(enemy)
    //     // console.log('enemyConfig')
    //     // console.log(this.enemyConfig)
    //     let pos
    //     let flipX = false// = enemy.position.split('x')
    //     if(enemy.position === 2) {
    //       pos = [27, 15.5]
    //       flipX = true
    //     }
    //     console.log(pos)
    //     console.log(this.opponentConfig[enemy.name])
    //     this.opponentGroup.add(new Opponent({
    //       scene: this,
    //       key: 'opponent',
    //       x: Number(pos[0]) * 16 + this.screenOffset.x + 8,
    //       y: Number(pos[1]) * 16 + this.screenOffset.y,
    //       name: enemy.name,
    //       details: this.opponentConfig[enemy.name],
    //       flipX: flipX
    //     })) 
    //   })
    //   console.log('enemies here')
    //   this.physics.add.collider(this.contactLayer, this.opponentGroup)
    // }

    // console.log(this)


    console.log('this.cameras.main')
    console.log(this.cameras.main)

    this.cameras.main.fadeIn(500)
      .startFollow(this.player)
      .setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels + this.hudHeight) // <- may need to change with long and narrow or high amd skinny
      .setBackgroundColor('#80e5ff')
      .stopFollow()
      // .setLerp(.8, .8)

    if(this.controls === 'arrows'){

    } else {

    } 

    this.keys = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      melee: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      shoot: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      bomb: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      dash: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      item: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
      // pause: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
    }

    // if(this.gameConfig.offsetNeeded){
      // this.physics.world.bounds.width = this.sceneWidth
      // this.physics.world.bounds.height = this.sceneHeight
      // this.physics.world.bounds.x = this.screenOffset.x
      // this.physics.world.bounds.y = this.screenOffset.y + this.hudHeight
    // } else {
      // this.physics.world.bounds.width = this.sceneWidth
      // this.physics.world.bounds.height = this.sceneHeight
    // }

    // Temporary HUD border, will be replaced with a nineslice image
    var rect = new Phaser.Geom.Rectangle(0, 0, 480, 30)
    var graphics = this.add.graphics({ fillStyle: { color: 0x000000 } })
    graphics.fillRectShape(rect).setScrollFactor(0, 0)

    var rect = new Phaser.Geom.Rectangle(0, 0, 480, 4)
    var graphics = this.add.graphics({ fillStyle: { color: 0x8B008B } })
    graphics.fillRectShape(rect).setScrollFactor(0, 0)

    var rect = new Phaser.Geom.Rectangle(0, 26, 480, 4)
    var graphics = this.add.graphics({ fillStyle: { color: 0x8B008B } })
    graphics.fillRectShape(rect).setScrollFactor(0, 0)

    var rect = new Phaser.Geom.Rectangle(0, 0, 4, 30)
    var graphics = this.add.graphics({ fillStyle: { color: 0x8B008B } })
    graphics.fillRectShape(rect).setScrollFactor(0, 0)

    var rect = new Phaser.Geom.Rectangle(476, 0, 4, 30)
    var graphics = this.add.graphics({ fillStyle: { color: 0x8B008B } })
    graphics.fillRectShape(rect).setScrollFactor(0, 0)

    // need to implement multiple elements
    this.HUD = this.add.bitmapText(8, 10, 'font', `H:${this.player.health}                              A:${this.player.ammo}                        $100`)
    this.HUD.setScrollFactor(0,0)
    this.switching = false
    this.scenePause = false
    this.prevState = {}

    this.dialogBox = this.add.group()

    var rect = new Phaser.Geom.Rectangle(0, 0, 480, 56)
    var graphics = this.add.graphics({ fillStyle: { color: 0x000000 } })
    this.dialogBox.add(graphics.fillRectShape(rect).setScrollFactor(0, 0))

    var rect = new Phaser.Geom.Rectangle(0, 0, 480, 4)
    var graphics = this.add.graphics({ fillStyle: { color: 0x8BBB8B } })
    this.dialogBox.add(graphics.fillRectShape(rect).setScrollFactor(0, 0))

    var rect = new Phaser.Geom.Rectangle(0, 56, 480, 4)
    var graphics = this.add.graphics({ fillStyle: { color: 0x8BBB8B } })
    this.dialogBox.add(graphics.fillRectShape(rect).setScrollFactor(0, 0))

    var rect = new Phaser.Geom.Rectangle(0, 0, 4, 56)
    var graphics = this.add.graphics({ fillStyle: { color: 0x8BBB8B } })
    this.dialogBox.add(graphics.fillRectShape(rect).setScrollFactor(0, 0))

    var rect = new Phaser.Geom.Rectangle(476, 0, 4, 56)
    var graphics = this.add.graphics({ fillStyle: { color: 0x8BBB8B } })
    this.dialogBox.add(graphics.fillRectShape(rect).setScrollFactor(0, 0))

    this.dialogLineOne = this.add.bitmapText(8, 10, 'font', '')
    this.dialogLineTwo = this.add.bitmapText(8, 32, 'font', '')
    this.dialogBox.add(this.dialogLineOne)
    this.dialogBox.add(this.dialogLineTwo)

    this.dialogSelector = this.add.sprite(200, 200)
    console.log(this.dialogSelector)
    // this.dialogSelector.toggleVisible()

    this.dialogBox.toggleVisible()

    // this.bullets = this.add.group({
    //   classType: Bullet,
    //   maxSize: 50,
    //   runChildUpdate: false
    // })
  }

  update(time, delta){
    // switching scene, do not want to run update()
    if(this.switching) return

    // dialog is happening, 
    if(this.dialogOpen) {
      let line = this.dialogLine
      let pos = this.dialogPos
      let halt = this.dialogHalt
                                  // should be a character: this.isTalking
      let d = this.dialogConfig[this.dialogOpen].firstPass

      this.player.body.setVelocityX(0)
      this.player.body.setAccelerationX(0)
      this.player.anims.play('stand')

      if(line >= halt) {

        if(this.keys.shoot.isDown && !this.prevState.shoot && this.dialogHalt >= d.length){
          this.dialogHalt = 2
          this.dialogLineOne.text = ''
          this.dialogLineTwo.text = ''
          this.dialogLine = 0
          this.dialogPos = 0
          this.dialogOpen = false
          this.dialogBox.toggleVisible()
          return
        }

        if(this.keys.shoot.isDown && !this.prevState.shoot){
          this.dialogHalt += 2
          this.dialogLineOne.text = ''
          this.dialogLineTwo.text = ''
        }

        this.prevState.shoot = this.keys.shoot.isDown
        return
      }

      if(this.dialogLine % 2 === 0){
        this.dialogLineOne.text = this.dialogLineOne.text + d[line][pos]
      } else {
        this.dialogLineTwo.text = this.dialogLineTwo.text + d[line][pos]
      }

      if(pos + 1 >= d[line].length){
        this.dialogLine++
        this.dialogPos = 0
      } else {
        this.dialogPos++
      }

      return
    }

    // if(this.keys.pause.isDown && this.prevState.pause === false){
    //   // console.log(this.player.x + " " + this.player.y)
    //   // console.log(this.cameras.main)
    //   this.prevState.pause = true
    //   console.log("pausing")
    //   this.scene.launch('PauseMenuScene')
    //   this.scene.pause()
    //   return
    // }

    this.player.update(this.keys, time, delta)

    // console.log(this.player.y + ' ' + (this.cameras.main.scrollY + 270))

    if(this.player.y > this.cameras.main.scrollY + 270 + 30){
      // console.log('die')
    }

    this.pestGroup.children.entries.map(pest => pest.update(time, delta))
    // this.opponentGroup.children.entries.map(opponent => opponent.update(time, delta))
    // this.bullets.children.entries.map(bullet => bullet.update(time, delta))
    // Array.from(this.fireballs.children.entries).forEach(
    //         (fireball) => 
    //         {fireball.update(time, delta);
    //     });



    this.HUD.text = `H:${this.player.health}                              A:${this.player.ammo}                      $100`


    // if(this.player.x < 8 + this.screenOffset.x){
    //   if(this.worldConfig.leftNeighbor){
    //     if(this.worldConfig.leftToOutside){
    //       this.switching = true
    //       this.player.destroy()
    //       this.player = null
    //       this.scene.start('GameScene', {town: this.town, mapName: this.worldConfig.leftNeighbor, fromInside:this.mapName})
    //     } else {
    //       let y = this.player.y
    //       this.switching = true
    //       this.player.destroy()
    //       this.player = null          
    //       this.scene.start('GameScene', {town: this.town, mapName: this.worldConfig.leftNeighbor, from: 'right', y: y})
    //     }
    //   } else {
    //     // alert('left exit')
    //     // if(this.player.alive) this.die()
    //   }
    // } else if(this.player.x + 8 > this.map.widthInPixels + this.screenOffset.x){
    //   if(this.worldConfig.rightNeighbor){
    //     if(this.worldConfig.rightToOutside){
    //       this.switching = true
    //       this.player.destroy()
    //       this.player = null
    //       this.scene.start('GameScene', {town: this.town, mapName: this.worldConfig.rightNeighbor, fromInside:this.mapName})
    //     } else {
    //       let y = this.player.y
    //       this.switching = true
    //       this.player.destroy()
    //       this.player = null          
    //       this.scene.start('GameScene', {town: this.town, mapName: this.worldConfig.rightNeighbor, from: 'left', y: y})
    //     }
    //   } else {
    //     // alert('right exit')
    //     // if(this.player.alive) this.player.die()
    //   }
    // }

    // if(this.npcGroup && this.player){
    //   this.npcGroup.map((spr, i) => {
    //     if(Math.abs(spr.x - this.player.x) < 24 && Math.abs(spr.y - this.player.y) < 24){
    //       this.bubbleGroup[i].visible = true
    //       this.bubbleGroup[i].play('bounce', true)

    //       if(this.keys.up.isDown){
    //         // dialog open, it's true because it's a name string.
    //         // Watch out for empty strings!
    //         this.dialogOpen = this.npcGroup[i].texture.key
    //         this.dialogBox.toggleVisible()
    //         console.log(this.dialogBox)
    //       }
    //     } else {
    //       this.bubbleGroup[i].visible = false
    //     }
    //   })
    // }

    // if(this.exitSquare){
    //   this.switching = true
    //   this.player.destroy()
    //   this.player = null
    //   this.scene.start('GameScene', {town: this.town, mapName: this.worldConfig.exits[this.exitSquare].mapName, from:this.worldConfig.exits[this.exitSquare].from, fromDoor: true})
    //   this.exitSquare = false
    //   return
    // }

    // if (this.enemiesNum <= 0) {
    //   this.scene.pause()
    //   // this.switching = true
    //   this.GameState.nextLevel()

    //   setTimeout(() => {
    //     console.log('launching')
    // this.switching = true

    //     this.scene.start('GameScene', {stage: this.GameState.level().name, state: this.GameState})
    //   }, 3000)
    // }

    this.textGroup.map(text => text.update(delta, this.cameras.main.scrollY))

    if(this.cameraDelay === 0){
      this.cameraTime += delta

      if (this.cameraTime > this.cameraTimer) {
        let wv = this.cameras.main.worldView.x

        this.cameras.main.scrollY -= this.cameraNudge
        this.cameraIncrement++
        // console.log(this.cameraIncrement)

        this.cameraTime = 0

        if(this.cameraIncrement === 360){
          this.cameraTimer = 25
        }
      }
    } else {
      this.cameraDelay -= delta
      if(this.cameraDelay < 0){
        this.cameraDelay = 0
      }
    }


    // this.prevState.pause = this.keys.pause.isDown
    // this.prevState.up = this.keys.up.isDown
  }

  createAnimations(){
    if(this.anims.anims)
      this.anims.anims.clear()

    // if(this.npc) this.anims.create({key: 'bounce', frames: this.anims.generateFrameNumbers('speechBubble', { start: 0, end: 11 }), frameRate: 4, repeat: -1, repeatDelay: 0 })

    console.log(this.animsArray)

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

  exitWorld(player, tile){
    let exitSquare = tile.x + 'x' + tile.y
    console.log(exitSquare)
    if(tile && tile.index >= 0){
      this.scene.exitSquare = exitSquare
    }
  }
}