export default class TitleScene extends Phaser.Scene {
  constructor(test) {
    super({ key: 'TitleScene' })
  }

  preload(){
    this.load.image('static-title', 'assets/menu/rise.png')
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
      startKey: true,      
      upKey: true,     
      downKey: true      
    }

    this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)

    this.cameras.main.fadeIn(2000)

    this.music = this.sound.playAudioSprite('soundtrack', 'intro', { loop: true })
  }

  update(){
    if(this.startKey.isDown && !this.prevState.startKey && this.menuPos === 1){
      this.pauseMusic()
      this.newGame()
      return
    } else if(this.startKey.isDown && !this.prevState.startKey && this.menuPos === 2){
      this.loadGame()
    }

    if(this.downKey.isDown && this.downKey.isDown !== this.prevState.downKey){
      if(this.menuPos === this.menuPositions){
        this.menuPos = this.menuPositions // only for main
      } else {
        this.sound.playAudioSprite('soundtrack', 'selector', { volume: 0.5 })
        this.menuPos++
      }
    } else if(this.upKey.isDown && this.upKey.isDown !== this.prevState.upKey){
      if(this.menuPos === 1){
        this.menuPos = 1 // only for main
      } else {
        this.sound.playAudioSprite('soundtrack', 'selector', { volume: 0.5 })
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
  }

  loadGame(){
    console.log("loading game")
  }

  pauseMusic () {
    let sounds = this.sound.sounds
    for(let i = 0; i < sounds.length; i++) {
      if(sounds[i].key === 'soundtrack') {
        this.sound.sounds[i].pause()
      }
    }
  }

}