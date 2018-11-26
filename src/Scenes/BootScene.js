export default class BootScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'BootScene'
    })
  }

  preload()
  {
    this.resize()
      // this.load.image('background-clouds', 'assets/images/clouds.png'); // 16-bit later
      // // Tilemap with a lot of objects and tile-properties tricks

      // this.load.spritesheet('gun-bullet', 'assets/images/gun-bullet.png', { frameWidth: 8, frameHeight:8 })
      
      // // I load the tiles as a spritesheet so I can use it for both sprites and tiles
      // this.load.spritesheet('tiles', 'assets/images/super-mario.png', { frameWidth: 16, frameHeight: 16 });
      // // Just for fun:
      // this.load.spritesheet('tiles-16bit', 'assets/images/super-mario-16bits.png', { frameWidth: 16, frameHeight: 16, spacing:2, margin:1});
      // // Spritesheets with fixed sizes. Should be replaced with atlas:
      // this.load.spritesheet('mario', 'assets/images/mario-sprites.png', { frameWidth: 16, frameHeight: 32 });
      // this.load.spritesheet('sprites16', 'assets/images/16x16sprites.png', { frameWidth: 16, frameHeight: 16 });
      // // Beginning of an atlas to replace spritesheets
      // this.load.atlas('mario-sprites', 'assets/mario-sprites.png', 'assets/mario-sprites.json');
      // // Music to play. Need to cut it for it to loop properly
      // this.load.audio('overworld', [
      //   'assets/music/overworld.ogg',
      //   'assets/music/overworld.mp3'
      // ]);

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

      // this.load.json('worlds', 'assets/data/worlds.json')  
      this.load.json('stages', 'assets/data/stages.json')  
      this.load.json('animations', 'assets/data/animations.json')
      this.load.json('dialog', 'assets/data/dialog.json')
      this.load.json('pests', 'assets/data/pests.json')
      // this.load.json('opponents', 'assets/data/opponents.json')
      this.load.json('weapons', 'assets/data/weapons.json')

      this.load.bitmapFont('font', 'assets/fonts/manaspace.png', 'assets/fonts/manaspace.fnt')
  }
  
  create()
  {
    window.addEventListener('resize', () => {
      this.resize()
      console.log('resizing')
    })

    this.scene.start('TitleScene')
  }

  resize () {
    const w = 480
    const h = 270
    const availW = window.screen.width
    const availH = window.screen.height
    // - 20 for padding
    const maxW = Math.floor(availW / (w + 50))
    const maxH = Math.floor(availH / (h + 50))
    console.log(maxW + ' ' + maxH + ' ' + availH + ' ' + availW)
    const multi = maxW < maxH ? maxW : maxH

    let canvas = document.getElementsByTagName('canvas')[0]
    canvas.style.width = `${multi * w}px`
    canvas.style.height = `${multi * h}px`
  }
}