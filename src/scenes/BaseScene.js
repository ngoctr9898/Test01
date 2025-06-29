
export class BaseScene extends Phaser.Scene {
    constructor(key) {
        super(key);
        this.centreX;
        this.centreY;
    }

    preload() {
        this.centreX = this.scale.width * 0.5;
        this.centreY = this.scale.height * 0.5;
    }

    create() {
        this.initScene();
    }

    openScene(arg) {
        console.log('open scene ' + arg);

        // fade to black
        this.cameras.main.fadeOut(300, 0, 0, 0);

        //this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
        //    this.scene.start(arg);
        // })

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.time.delayedCall(300, () => {
                this.scene.start(arg)
            })
        })
    }

    initScene() {
        this.cameras.main.fadeIn(300, 0, 0, 0);
    }

    loadBackground() {
        /*this.imgBgFront = this.load.image('backgroundFront', `assets/Background/BigClouds.png`);
        this.load.image('backgroundBack', `assets/Background/BGSky.png`)
        this.load.image('waterReflect1', `assets/Background/WaterReflectBig1.png`);
        this.load.image('waterReflect2', `assets/Background/WaterReflectBig2.png`);
        this.load.image('waterReflect3', `assets/Background/WaterReflectBig3.png`);
        this.load.image('waterReflect4', `assets/Background/WaterReflectBig4.png`);*/
    }

    showBackground(showReflect = true) {
        this.bgBack = this.add.image(this.centreX, this.centreY, 'backgroundBack');
        this.bgBack.setScale(Math.max(this.scale.width / this.bgBack.width,
            this.scale.height / this.bgBack.height));

        // Calculate bg cloud position
        var bgFrontHeight = this.scale.height - 200;
        var seaHeight = this.scale.height / 3 - 4;
        var offsetY = (seaHeight) - (this.scale.height - bgFrontHeight) / 2;
        var bgFrontCentreY = this.centreY - offsetY;

        this.bgFront = this.add.tileSprite(this.centreX, bgFrontCentreY,
            this.scale.width, bgFrontHeight, 'backgroundFront');
        this.bgFront.setTileScale(bgFrontHeight / 101, bgFrontHeight / 101);

        // Water reflect animation
        this.waterReflect = this.add.sprite(this.centreX, this.centreY + 154, 'waterReflect1');
        this.waterReflect.setScale(4, 4);

        this.waterReflect.anims.create({
            key: 'idle',
            frames: [
                { key: 'waterReflect1' },
                { key: 'waterReflect2' },
                { key: 'waterReflect3' },
                { key: 'waterReflect4' },
            ],
            frameRate: 15,
            repeat: -1
        });

        this.waterReflect.play('idle');
        this.waterReflect.setActive(showReflect).setVisible(showReflect);
    }
}