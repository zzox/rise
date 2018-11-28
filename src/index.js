import 'phaser'
import BootScene from './Scenes/BootScene'
import TitleScene from './Scenes/TitleScene'
import GameScene from './Scenes/GameScene'
import IntermediateScene from './Scenes/IntermediateScene'
import DeathScene from './Scenes/DeathScene'

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
      gravity: {y: 800}
    }
  },
  scene: [
    BootScene,
    TitleScene,
    IntermediateScene,
    GameScene,
    DeathScene
  ]
}

const game = new Phaser.Game(config)