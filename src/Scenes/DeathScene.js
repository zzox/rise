export default class DeathScene extends Phaser.Scene {
  constructor(test) {
    super({ key: 'DeathScene' })
  }

  preload(){
    this.load.image('selector', 'assets/menu/selector.png')
  }

  create(){
    this.currentStage = this.scene.settings.data.currentStage
    console.log(this.currentStage)

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
    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)

    this.cameras.main.fadeIn(2000)
  }

  update(){
    if(this.startKey.isDown && !this.prevState.startKey && this.menuPos === 1){
      this.nextLevel()
      return
    } else if(this.startKey.isDown && !this.prevState.startKey && this.menuPos === 2){
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

  nextLevel(){
    this.scene.start('GameScene', { stage: this.currentStage })
  }

  loadGame(){
    this.scene.start('TitleScene')
  }

}