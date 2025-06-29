import ASSET from '../asset.js'

class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, textureKey) {
        super(scene, x, y, textureKey);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(3);
        this.setImmovable(true);
        this.body.setAllowGravity(false);

        const obstacleRealSize = { x: 28, y: 22 };
        const obstacleColliderSize = { x: 20, y: 16 };
        const botSpace = 2;

        this.y = y - (obstacleRealSize.y * 3 - obstacleColliderSize.y * 3) / 2 + botSpace * 3 / 2;

        this.body.setSize(obstacleColliderSize.x, obstacleColliderSize.y);
        this.body.setOffset((obstacleRealSize.x - obstacleColliderSize.x) / 2,
            (obstacleRealSize.y - obstacleColliderSize.y) / 2);
        this.refreshBody();
    }

}

export default Obstacle;
