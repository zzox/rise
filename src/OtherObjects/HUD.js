// import { Geom } from 'phaser'

export default class HUD {
	constructor (scene) {
		this.scene = scene
		this.playerHealth = this.scene.player.health
		this.playerMelee = this.scene.player.meleeWeapon.name
		this.playerGun = this.scene.player.gun.name
	}

	create () {
    this.graphics().map(item => {
    	this.scene.add.graphics({ fillStyle: { color: item.color } })
    		.fillRectShape(new Phaser.Geom.Rectangle(item.x, item.y, item.width, item.height))
    		.setScrollFactor(0, 0)

    })

		this.playerHealthText = this.scene.add
			.bitmapText(8, 10, 'font', `Health:${this.scene.player.health}`)
			.setScrollFactor(0, 0)

		// this.playerMeleeSprite = this.add.sprite()
		// 	.setScrollFactor(0, 0)

		// this.playerGunSprite = this.add.sprite()
		// 	.setScrollFactor(0, 0)

		this.playerAmmoText = this.scene.add
			.bitmapText(200, 10, 'font', `Ammo:${this.scene.player.ammo}`)
			.setScrollFactor(0, 0)
	}

	update () {
		if (this.scene.player.health !== this.playerHealth) {
			this.playerHealth = this.scene.player.health
			this.playerHealthText.text = `Health:${this.playerHealth}`
		}

		// gun

		// melee

		if (this.scene.player.ammo !== this.playerAmmo) {
			this.playerAmmo = this.scene.player.ammo
			this.playerAmmoText.text = `Ammo:${this.playerAmmo}`
		}
	}

	graphics () {
		return [
			{ x: 0, y: 0, width: 480, height: 30, color: 0x000000 },
			{ x: 0, y: 0, width: 480, height: 4, color: 0x8B008B },
			{ x: 0, y: 26, width: 480, height: 4, color: 0x8B008B },
			{ x: 0, y: 0, width: 4, height: 30, color: 0x8B008B },
			{ x: 476, y: 0, width: 4, height: 30, color: 0x8B008B }
		]
	}
}