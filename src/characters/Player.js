import ANIMATION from '../animation.js'

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.groundPosition = y;
        this.body.collideWorldBounds = true;
        this.spriteSize = 32;
        this.colliderSizeX = 15;
        this.colliderSizeY = 20;

        this.setScale(3);
        this.body.setSize(this.colliderSizeX, this.colliderSizeY);
        this.body.offset.x = (this.spriteSize - this.colliderSizeX) / 2;
        this.body.offset.y = (this.spriteSize - this.colliderSizeY) / 2 + 5;
        this.refreshBody();

        this.initAnimation();
        this.onIdle();

        this.jumpForce = -800;
        this.jumpTime = 0;
        this.isJumping = false;
        this.maxJumpDuration = 300; // ms
        this.started = false;
    }

    update(delta) {
        if (!this.started) {
            return;
        }
        if (this.isJumping) {
            this.jumpTime += delta;
            if (this.jumpTime >= this.maxJumpDuration || this.body.velocity.y >= 0) {
                this.stopJumping();
            }
        }
        else if (this.isGrounded()) {
            this.run();
        }
    }

    initAnimation() {
        this.anims.create({
            key: ANIMATION.pinkman_idle.key,
            frames: this.anims.generateFrameNumbers(ANIMATION.pinkman_idle.texture),
            frameRate: ANIMATION.pinkman_idle.frameRate,
            repeat: ANIMATION.pinkman_idle.repeat
        });

        this.anims.create({
            key: ANIMATION.pinkman_jump.key,
            frames: this.anims.generateFrameNumbers(ANIMATION.pinkman_jump.texture),
            frameRate: ANIMATION.pinkman_jump.frameRate,
            repeat: ANIMATION.pinkman_jump.repeat
        });

        this.anims.create({
            key: ANIMATION.pinkman_run.key,
            frames: this.anims.generateFrameNumbers(ANIMATION.pinkman_run.texture),
            frameRate: ANIMATION.pinkman_run.frameRate,
            repeat: ANIMATION.pinkman_run.repeat
        });
    }

    onIdle() {
        this.anims.play(ANIMATION.pinkman_idle.key, true);
    }

    run() {
        this.anims.play(ANIMATION.pinkman_run, true);
    }

    jump() {
        this.started = true;
        if (this.isGrounded()) {
            this.body.setVelocityY(this.jumpForce);
            this.isJumping = true;
            this.anims.play(ANIMATION.pinkman_jump, true);
        }
    }

    stopJumping() {
        console.log('stop jumping');
        this.isJumping = false; // done jumping
        this.body.setVelocityY(0);
        this.jumpTime = 0;
    }

    isGrounded() {
        return this.body.touching.down;
    }
}

export default Player;