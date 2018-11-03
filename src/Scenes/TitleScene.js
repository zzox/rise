// import GameState from '../utils/GameState'

export default class TitleScene extends Phaser.Scene {
  constructor(test) {
    super({ key: 'TitleScene' })

    // this.state = new GameState
  }

  preload(){
    this.load.image('static-title', 'assets/menu/title.png')
    this.load.image('selector', 'assets/menu/selector.png')
  }

  create(){
    this.add.image(240, 80, 'static-title')

    this.add.bitmapText(210, 185, 'font', 'New Game')
    this.add.bitmapText(210, 205, 'font', 'Continue')

    this.menuPositions = 2
    this.menuPos = 1

    this.spr = this.add.sprite(195, 188, 'selector')

    this.prevState = {
      startKey: false,      
      upKey: false,     
      downKey: false      
    }

    this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)

    this.cameras.main.fadeIn(2000)
  }

  update(){
    if(this.startKey.isDown && this.menuPos === 1){
      this.newGame()
      return
    } else if(this.startKey.isDown && this.menuPos === 2){
      this.loadGame()
    }

    if(this.downKey.isDown && this.downKey.isDown !== this.prevState.downKey){
      if(this.menuPos === this.menuPositions){
        this.menuPos = this.menuPositions // only for main
      } else {
        this.menuPos++
      }
    } else if(this.upKey.isDown && this.upKey.isDown !== this.prevState.upKey){
      if(this.menuPos === 1){
        this.menuPos = 1 // only for main
      } else {
        this.menuPos--
      }
    }

    this.spr.y = this.menuPos * 20 + 168

    this.prevState = {
      startKey: this.startKey.isDown,
      upKey: this.upKey.isDown,
      downKey: this.downKey.isDown
    }
  }

  newGame(){
    this.scene.start('GameScene', { stage: 'desert' })
    this.anims.remove('stand')
  }

  loadGame(){
    console.log("loading game")
  }

}