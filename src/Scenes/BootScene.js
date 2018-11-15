export default class BootScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'BootScene'
    })
  }

  preload()
  {
    // console.log("preload")
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
  
      // this.load.audioSprite('sfx', [
      //   'assets/audio/sfx.ogg',
      //   'assets/audio/sfx.mp3'
      // ], 'assets/audio/sfx.json', {
      //     instances: 4
      //   });

      // let el = document.getElementsByTagName('canvas')[0]
      // // console.log(el);
      // el.style.width = el.style.width*2+"px"
      // el.style.height = el.style.height*2+"px"
  
      // this.load.bitmapFont('font', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
  
      // Load plugin for animated tiles. This is just a first build of an upcoming plugin.
      // It's not optimized and lack features. The source code will be released when an
      // official first version is released.
      // console.log("before")
      // this.load.plugin('AnimatedTiles', 'assets/plugins/AnimatedTiles.min.js');

      //   console.log("af")
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
    // console.log("create")
     // skipping the menu for now, going straight to the game
      window.addEventListener('resize', function(){
        console.log('resizing -- more to added here later')
      })

      let el = document.getElementsByTagName('canvas')[0];
      // console.log(el);
      el.style.width = "960px"
      el.style.height = "540px"
      this.scene.start('TitleScene')
     // this.scene.start('OverworldScene', {town: 'humblock', mapName: 'slobs-room', freshRun: true})
  }
}