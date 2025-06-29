import { BaseScene } from './BaseScene.js';
import ANIMATION from '../animation.js'

export class SelectScene extends BaseScene {
    constructor() {
        super('SelectScene');
        this.bgArray = ["Blue", "Brown", "Gray", "Green", "Pink", "Purple", "Yellow"];
        this.characterId = 0;
    }

    preload() {
        super.preload();
        var value = Phaser.Math.Between(0, 6);
        this.load.image('background', `assets/Background/${this.bgArray[value]}.png`);

        console.log(`bg: ${value}`);
        //this.add.tileSprite(posX, posY, width, height, "snow_field");
    }

    create() {
        super.create();
        this.background = this.add.tileSprite(this.scale.width / 2, this.scale.height / 2, this.scale.width,
            this.scale.height, 'background');

        const main = this.add.sprite(this.centreX, this.centreY, ANIMATION.pinkman_idle.texture);
        main.setScale(4, 4);

        main.anims.create({
            key: ANIMATION.pinkman_idle.key,
            frames: this.anims.generateFrameNumbers(ANIMATION.pinkman_idle.texture),
            frameRate: ANIMATION.pinkman_idle.frameRate,
            repeat: ANIMATION.pinkman_idle.repeat
        });

        main.play(ANIMATION.pinkman_idle.key, true);

        this.input.on('pointerdown', () => {
            this.startGame();
        });
    }

    startGame() {
        this.openScene('GameScene', { id: this.characterId });
    }
}