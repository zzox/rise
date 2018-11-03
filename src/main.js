import 'phaser'
import BootScene from './Scenes/BootScene'
import TitleScene from './Scenes/TitleScene'
import GameScene from './Scenes/GameScene'
// import IntermediateScene from './WorldScenes/IntermediateScene'
// import PauseMenuScene from './Scenes/PauseMenuScene'

const config = {
  type: Phaser.WEBGL,
  parent: 'content',
  width: 480,
  height: 270,
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 800},
      debug: true
    }
  },
  scene: [
    BootScene,
    TitleScene,
    GameScene
    // IntermediateScene,
    // PauseMenuScene
  ]
}

// window.lisen('resize'{
//   ()
// })

const game = new Phaser.Game(config)