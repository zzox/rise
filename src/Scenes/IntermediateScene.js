export default class IntermediateScene extends Phaser.Scene {
  constructor(test) {
    super({ key: 'IntermediateScene' })
  }

  preload(){
    this.load.image('selector', 'assets/menu/selector.png')
  }

  create(){
    this.nextStage = this.scene.settings.data.nextStage
    console.log(this.nextStage)

    if (this.nextStage === 'end') {
      this.add.bitmapText(210, 185, 'font', 'Quit')
    } else {
      this.add.bitmapText(210, 185, 'font', 'Next Level')
      this.add.bitmapText(210, 205, 'font', 'Quit')
    }

    this.dialog = this.sys.cache.json.entries.entries.dialog[this.nextStage]

    for (let i = 0; i < this.dialog.length; i++) {
      this.add.bitmapText(50, i * 20 + 50, 'font', this.dialog[i])
    }

    if (this.nextStage === 'end') {
      this.menuPositions = 1
    } else {
      this.menuPositions = 2
    }
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
      if (this.nextStage === 'end') {
        this.quitGame()
      } else {
        this.nextLevel()
      }
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
    console.log(this.scene)
    this.scene.start('GameScene', { stage: this.nextStage })
  }

  quitGame(){
    this.scene.start('TitleScene')
  }
}