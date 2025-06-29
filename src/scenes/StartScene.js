import { BaseScene } from './BaseScene.js';
import Asset from '../asset.js'

export class StartScene extends BaseScene {
    constructor() {
        super('StartScene');
    }

    preload() {
        super.preload();
        //this.loadBackground();
        this.loadAsset();
    }

    create() {
        this.showBackground();
        this.startText = this.add.text(this.centreX, this.scale.height - 150, 'Tap to Start', {
            fontFamily: 'Sans-serif', fontSize: 40, color: '#ffffff',
            //stroke: '#ffffff', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: this.startText,
            alpha: { from: 0.85, to: 0.3 },
            ease: 'SineOut',
            duration: 1000,
            repeat: -1,
            yoyo: true
        });

        this.input.on('pointerdown', () => {
            this.startGame();
        });
    }

    update() {
        this.bgFront.tilePositionX += 0.5;
    }

    startGame() {
        this.openScene('SelectScene');
        //this.scene.start('SelectScene');
    }

    loadAsset() {
         //  Load the assets for the game - see ./src/assets.js
        for (let type in Asset) {
            let obj = Asset[type];
            for (let key in obj) {
                let argsBuffer = obj[key].args.slice(); // copy to argsBuffer
                argsBuffer.unshift(obj[key].key); // add key to the front of args
                this.load[type].apply(this.load, argsBuffer); // = this.load.image(key, args)
            }
        }
    }
}