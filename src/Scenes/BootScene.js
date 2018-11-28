export default class BootScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'BootScene'
    })
  }

  preload()
  {
    this.resize()

    this.load.audioSprite('soundtrack', 
      'assets/audio/soundtrack.json',
      [
        'assets/audio/soundtrack.mp3',
        'assets/audio/soundtrack.ac3',
        'assets/audio/soundtrack.m4a',
        'assets/audio/soundtrack.ogg',
      ], 
      {
        instances: 4
      }
    )

    this.load.audioSprite('sfx', 
      'assets/audio/rise-sfx.json',
      [
        'assets/audio/rise-sfx.mp3',
        'assets/audio/rise-sfx.ac3',
        'assets/audio/rise-sfx.m4a',
        'assets/audio/rise-sfx.ogg',
      ], 
      {
        instances: 4
      }
    )

    this.load.json('stages', 'assets/data/stages.json')  
    this.load.json('animations', 'assets/data/animations.json')
    this.load.json('dialog', 'assets/data/dialog.json')
    this.load.json('pests', 'assets/data/pests.json')
    this.load.json('weapons', 'assets/data/weapons.json')

    this.load.bitmapFont('font', 'assets/fonts/manaspace.png', 'assets/fonts/manaspace.fnt')
  }
  
  create()
  {
    window.addEventListener('resize', () => {
      this.resize()
    })

    this.scene.start('TitleScene')
  }

  resize () {
    const w = 480
    const h = 270
    const availW = window.innerWidth
    const availH = window.innerHeight
    // - 20 for padding
    const maxW = Math.floor(availW / w)
    const maxH = Math.floor(availH / h)
    const multi = maxW < maxH ? maxW : maxH

    let canvas = document.getElementsByTagName('canvas')[0]
    canvas.style.width = `${multi * w}px`
    canvas.style.height = `${multi * h}px`
  }
}