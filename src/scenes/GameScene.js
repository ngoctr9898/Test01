import { BaseScene } from './BaseScene.js';
import ASSET from '../asset.js'
import ANIMATION from '../animation.js'
import Player from "../characters/Player.js";
import Obstacle from "../characters/Obstacle.js";

export class GameScene extends BaseScene {
    constructor() {
        super('GameScene');
        this.terrainTileSize = 16;
        this.started = false;

        this.gameSpeed = 5;
        this.gameMaxSpeed = 3;

        this.spawnInterval = 400;
        this.spawnCheckTime = 0;
        this.obstacleSpawnChance = 0.3;
        this.lastObstacle = 0;
        this.minObstacleDistance = 50;
        this.maxObstacleDistance = 200;
        this.coinDistance = 20;
    }

    preload() {
        super.preload();
        this.loadBackground();
    }

    create(data) {
        super.create();
        this.showBackground(false);
        this.characterId = data.characterId;
        this.initPlatform();
        this.initPlayer();
        this.initObstacles();
        this.input.once('pointerdown', () => {
            this.startGame();
        });

        this.scoreText = this.add.text(this.centreX, 50, 'Score: 0', {
            fontFamily: 'Sans-serif', fontSize: 28, color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

    }

    update(time, delta) {
        if (!this.started) {
            return;
        }
        this.bgFront.tilePositionX += (this.gameSpeed * 0.1);
        this.player.update(delta);

        this.obstacleGroup.getChildren().forEach(obstacle => {
            obstacle.x -= this.gameSpeed;

            obstacle.refreshBody();
        }, this);

        this.updateObstacle(delta);
    }

    startGame() {
        this.started = true;
        this.input.on('pointerdown', () => {
            this.player.jump();
        });
        this.player.jump();
    }

    initPlayer() {
        this.player = new Player(this, 300, 528);
        this.physics.add.collider(this.player, this.platforms);
    }

    initPlatform() {
        var spriteScale = 3;
        var offset = (this.terrainTileSize * spriteScale) / 2;
        var platformCentreY1 = this.scale.height - this.terrainTileSize * spriteScale * 3 + offset; // 3 tiles
        var platformCentreY2 = this.scale.height - this.terrainTileSize * spriteScale * 2 + offset; // 2 tiles
        var platformCentreY3 = this.scale.height - this.terrainTileSize * spriteScale * 1 + offset; // 2 tiles

        // Add platform visual
        this.add.tileSprite(this.centreX, platformCentreY1,
            this.scale.width, 0, ASSET.spritesheet.terrain.key)
            .setFrame(7)
            .setScale(spriteScale);
        this.add.tileSprite(this.centreX, platformCentreY2,
            this.scale.width, 0, ASSET.spritesheet.terrain.key)
            .setFrame(29)
            .setScale(spriteScale);
        this.add.tileSprite(this.centreX, platformCentreY3,
            this.scale.width, 0, ASSET.spritesheet.terrain.key)
            .setFrame(51)
            .setScale(spriteScale);

        // Add real platform
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(this.centreX, platformCentreY1, null)
            .setDisplaySize(this.scale.width, this.terrainTileSize * spriteScale)
            .setVisible(false)
            .refreshBody();
    }

    initObstacles() {
        this.obstacleGroup = this.add.group();
        this.coinGroup = this.add.group();

        this.physics.add.overlap(this.player, this.obstacleGroup, this.hitObstacle, null, this);
        this.physics.add.overlap(this.player, this.coinGroup, this.collectCoin, null, this);
    }

    hitObstacle(player, obstacle) {
        this.gameStarted = false;
        this.physics.pause();

        this.gameOver();
    }

    collectCoin(player, coin) {
        coin.destroy();
        this.score++;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    updateObstacle(delta) {
        this.lastObstacle += (delta / 1000 * this.gameSpeed * 10);
        console.log('last ' + this.lastObstacle);
        let isSpawn = false;
        if (this.lastObstacle > this.maxObstacleDistance) {
            this.spawnObstacle();
            isSpawn = true;
        }
        else if (this.lastObstacle > this.minObstacleDistance) {
            this.spawnCheckTime += delta;
            if (this.spawnCheckTime > this.spawnInterval) {
                let chance = Math.random;
                if (chance <= this.obstacleSpawnChance) {
                    console.log('spawn max');
                    this.spawnObstacle();
                    isSpawn = true;
                }
            }
        }

        if (isSpawn) {
            this.lastObstacle = 0;
            this.spawnCheckTime = 0;
        }
    }

    spawnObstacle() {
        let groundPosition = this.scale.height - this.terrainTileSize * 3 * 3;
        let obstacle = new Obstacle(this, this.scale.width + 50, groundPosition, ASSET.image.box.key);
        this.obstacleGroup.add(obstacle);
    }

    gameOver() {
        this.started = false;
        this.openScene('SelectScene');
    }
}