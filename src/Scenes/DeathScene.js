export default class DeathScene extends Phaser.Scene {
  constructor(test) {
    super({ key: 'DeathScene' })
  }

  preload(){
    this.load.image('selector', 'assets/menu/selector.png')
  }

  create(){
    this.currentStage = this.scene.settings.data.currentStage

    this.add.bitmapText(214, 100, 'font', 'You Lost...')
    this.add.bitmapText(210, 185, 'font', 'Restart Level')
    this.add.bitmapText(210, 205, 'font', 'Quit')

    this.menuPositions = 2
    this.menuPos = 1

    this.spr = this.add.sprite(195, 188, 'selector')

    this.prevState = {
      startKey: true,      
      upKey: true,     
      downKey: true      
    }

    this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)

    this.cameras.main.fadeIn(2000)
  }

  update(){
    if(this.startKey.isDown && !this.prevState.startKey && this.menuPos === 1){
      this.nextLevel()
      return
    } else if(this.startKey.isDown && !this.prevState.startKey && this.menuPos === 2){
      this.quitGame()
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

  nextLevel(){
    this.clearKeys()
    this.scene.start('GameScene', { stage: this.currentStage })
  }

  quitGame(){
    this.clearKeys()
    this.scene.start('TitleScene')
  }

  clearKeys () {
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.S)
  }
}