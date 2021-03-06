var global = {
    velocity: {
        playerJumping: -400,
        jumpPad: -600,
    }
};

var animations = {};

// Add a variable for the weapon
var weapon;
var weapon2;
var shield;
var pad1;
var pad2;

var playState = {

    preload: function() {

        //Backgrounds
        this.load.image('Aether', 'assets/backgrounds/Aether.png');
        this.load.image('Desert', 'assets/backgrounds/Desert.png');
        this.load.image('Flatlands', 'assets/backgrounds/Flatlands.png');

        // Platform block
        this.load.image('platform', 'assets/platform.png');

        // Players
        this.load.spritesheet('player1', 'assets/player1.png', 32, 32);
        this.load.spritesheet('player2', 'assets/player2.png', 32, 32);

        // Attacks
        this.load.image('meleeSprite', 'assets/meleeSprite.png');
        this.load.spritesheet('projectile1', 'assets/projectile1.png', 16, 16);
        this.load.spritesheet('projectile2', 'assets/projectile2.png', 27, 16);
        this.load.spritesheet('explosion', 'assets/explosion.png', 350, 350, 30);
        this.load.image('shield', 'assets/shield.png');

        // Ui
        this.load.spritesheet('healthbar', 'assets/ui/healthbar.png', 157, 32);
        this.load.spritesheet('cooldown', 'assets/ui/cooldown.png', 31, 30);
        this.load.image('char1ico', 'assets/ui/char1ico.png');
        this.load.image('char2ico', 'assets/ui/char2ico.png');

        // Text
        this.load.image('p1Text', 'assets/ui/player1.png');
        this.load.image('p2Text', 'assets/ui/player2.png');
        this.load.image('gameOver', 'assets/ui/gameOver.png');
        this.load.image('p1wins', 'assets/ui/player1wins.png');
        this.load.image('p2wins', 'assets/ui/player2wins.png');

        // Audio
        this.load.audio('battleMusic', 'assets/audio/battleMusic.mp3');
        this.load.audio('audioAether', 'assets/audio/bgAether.mp3');
        this.load.audio('audioFlatlands', 'assets/audio/bgFlatlands.mp3');
    },

    create: function() {

        // Create a fps variable
        game.time.advancedTiming = true;
        game.time.desiredFps = 60;

        // Scaling
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.maxWidth = this.scale.Exact_fit;
        this.scale.maxHeight = this.scale.Exact_fit;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.setScreenSize = true;

        // Set the stage background to '#56abec'
        this.stage.backgroundColor = '56abec';

        // Start the physics engine 'ARCADE'
        this.physics.startSystem(Phaser.Physics.ARCADE);

        // Add the physics to all game objects
        this.world.enableBody = true;

        // Create all the input keys
        this.inputCreate();

        // Add Gamepad input
        this.input.gamepad.start();
        pad1 = game.input.gamepad.pad1;
        pad2 = game.input.gamepad.pad2;

        // Below this line is level and character specific functions

        // Function that creates the game level
        this.levelCreate();

        // Function that creates the player sprites and places them
        this.player1 = this.playerCreate(80, 250, characterSelect.player1, characterSelect.ID1, 1);
        this.player2 = this.playerCreate(848, 250, characterSelect.player2, characterSelect.ID2, 2);
        this.player2.direction = 1;

        // Create the ui
        this.uiCreate();

        // Create audio
        this.audioCreate();

        weapon = game.add.weapon(1, 'projectile1');
        weapon2 = game.add.weapon(1, 'projectile2');

    },

    update: function() {

        // All of the collision stuff
        this.collisions();

        // All the player updates
        this.playerUpdate();

        // Game event updates
        this.gameEvents();

        // Ui updates
        this.uiUpdate();

        // Audio Volume
        this.audioVolume();

        // Debug function
        //this.Debug();

    },

    shutdown: function () {

    },

    /** Create functions
     * **/

    inputCreate: function() {

        // Add the cursor Keys
        this.cursors = keyBinding(true, null);

        // Add the keyboard Keys
        this.keyboardKey = keyBinding(null, true);
    },

    levelCreate: function() {

        // Add the groups the level creator needs
        this.floors = game.add.group();
        this.platforms = game.add.group();
        this.jumpPads = game.add.group();

        // Add the background image
        if (levelDecide == 1)
            this.add.tileSprite(0, 0, 960, 540, 'Aether');
        else if (levelDecide == 2)
            this.add.tileSprite(0, 0, 960, 540, 'Desert');
        else if (levelDecide == 3)
            this.add.tileSprite(0, 0, 960, 540, 'Flatlands');

        // Create the level, all the documentation for this is in the levelCreate.js
        levelCreate(levelDecide, this.floors, this.platforms, this.jumpPads);

    },

    playerCreate: function (posX, posY, sprite, char, number) {

        // Add the player sprite to this.player
        var player = game.add.sprite(posX, posY, sprite);

        // Enable physics for the player
        game.physics.arcade.enable(player);

        // Add gravity to the player
        player.body.gravity.y = 600;

        // Remove collision detection for jumping up through blocks
        player.body.checkCollision.up = false;
        player.body.checkCollision.left = false;
        player.body.checkCollision.right = false;

        // The players health
        player.gameHealth = 5;
        // The direction the player is facing
        player.direction = 0;
        // Give the player an identifier
        player.ID = number;
        // Give the player a character
        player.char = char;
        // Give the player a timer for collision down
        player.collision = 0;
        // If the player is blocking set this to 1
        player.block = 0;
        // Give the player timers for their two attacks
        player.attack1Cool = 0;
        player.attack2Cool = 0;
        player.blockCool = 0;

        // Create the player input for easier input management
        player.input = {};
        // Bind the inputs to the player object
        if (number == 1) {
            player.input.up = options.controls.player1.up;
            player.input.down = options.controls.player1.down;
            player.input.left = options.controls.player1.left;
            player.input.right = options.controls.player1.right;
            player.input.attack1 = options.controls.player1.attack1;
            player.input.attack2 = options.controls.player1.attack2;
            player.input.block = options.controls.player1.block;
        }
        else {
            player.input.up = options.controls.player2.up;
            player.input.down = options.controls.player2.down;
            player.input.left = options.controls.player2.left;
            player.input.right = options.controls.player2.right;
            player.input.attack1 = options.controls.player2.attack1;
            player.input.attack2 = options.controls.player2.attack2;
            player.input.block = options.controls.player2.block;
        }

        player.gamepad = {};

        if (number == 1) {
        }

        if(number == 1)
            player.pad = pad1;
        else
            player.pad = pad2;

        // Add the move animations to the player
        animations.moveRight = player.animations.add('right', [0]);
        animations.moveLeft = player.animations.add('left', [1]);

        return player;

    },

    audioCreate: function () {

        // Add battle music
        this.backgroundAudio = game.add.audio('battleMusic');
        this.backgroundAudio.play();
        this.backgroundAudio.volume = .2;

        // Add ambiance | differs per level
        if (levelDecide == 1) {
            this.backgroundAudio = game.add.audio('audioAether');
            this.backgroundAudio.play();
            this.backgroundAudio.volume = .5;
        }
        else if (levelDecide == 3) {
            this.backgroundAudio = game.add.audio('audioFlatlands');
            this.backgroundAudio.play();
            this.backgroundAudio.volume = .5;
        }

    },

    /** Update functions
     * **/

    playerUpdate: function () {

        // Players movement
        this.playerMovement(this.player1);
        this.playerMovement(this.player2);

        // Player jumping
        if (options.controls.player1.up.isDown && this.player1.body.touching.down)
            this.player1.body.velocity.y = global.velocity.playerJumping;
        if (options.controls.player2.up.isDown && this.player2.body.touching.down)
            this.player2.body.velocity.y = global.velocity.playerJumping;

        // Player attacks and animations
        this.characterSpread(this.player1);
        this.characterSpread(this.player2);

        // Remake!
        // Player leaving the game area
        if (this.player1.body.position.y > 540)
            this.player1.gameHealth = 0;
        if (this.player2.body.position.y > 540)
            this.player2.gameHealth = 0;

        // Turn checkCollision.down back on after *20* frames
        if (this.player1.collision != 0) {
            this.player1.collision--;
            if (this.player1.collision == 1)
                this.player1.body.checkCollision.down = true;
        }
        if (this.player2.collision != 0) {
            this.player2.collision--;
            if (this.player2.collision == 1)
                this.player2.body.checkCollision.down = true;
        }

    },

    playerMovement: function (player) {

        // Add velocity to the left if the left button is held
        if (player.input.left.isDown && player.body.velocity.x > -150) {
            player.body.velocity.x -= 10;
            player.direction = 2;
            player.animations.play('left', 1);
        }
        // Add velocity to the right if the right button is held
        else if (player.input.right.isDown && player.body.velocity.x <= 150) {
            player.body.velocity.x += 10;
            player.direction = 1;
            player.animations.play('right', 1);
        }
        // If the velocity is lower then 10 or greater then -10, set it to 0 to avoid getting stuck on weird numbers
        else if (player.body.velocity.x <= 10 && player.body.velocity.x >= -10 ) {
            player.body.velocity.x = 0;
        }
        // If the player is touching down and not holding a button lower the velocity by 10
        else if (player.body.touching.down === true) {
            if (player.body.velocity.x > 0)
                player.body.velocity.x -= 10;
            if (player.body.velocity.x < 0)
                player.body.velocity.x += 10;
        }
        // If the player is not touching down lower the velocity by 4 instead
        else {
            if (player.body.velocity.x > 0)
                player.body.velocity.x -= 4;
            if (player.body.velocity.x < 0)
                player.body.velocity.x += 4;
        }

    },

    audioVolume: function () {



    },

    /** UI Functions
     * **/

    uiCreate: function () {

        // Health bar for player1
        this.healthbar1 = game.add.sprite(25, 450, 'healthbar');
        this.PlayerText1 = game.add.sprite(25, 420, 'p1Text');
        this.PlayerText1.scale.setTo(1.5,1.5);

        // Health bar for player2
        this.healthbar2 = game.add.sprite(935, 450, 'healthbar');
        this.PlayerText2 = game.add.sprite(935, 420, 'p2Text');
        this.healthbar2.anchor.x = 1;
        this.PlayerText2.anchor.x = 1;
        this.PlayerText2.scale.setTo(1.5,1.5);

        // Animations for health bars
        this.healthbar1.animations.add('4', [1]);
        this.healthbar1.animations.add('3', [2]);
        this.healthbar1.animations.add('2', [3]);
        this.healthbar1.animations.add('1', [4]);
        this.healthbar1.animations.add('0', [5]);
        this.healthbar2.animations.add('4', [1]);
        this.healthbar2.animations.add('3', [2]);
        this.healthbar2.animations.add('2', [3]);
        this.healthbar2.animations.add('1', [4]);
        this.healthbar2.animations.add('0', [5]);


        // Ability icons for the characters
        if (this.player1.char == 1)
            this.p1charico = game.add.sprite(25, 488, 'char1ico');
        else
            this.p1charico = game.add.sprite(25, 488, 'char2ico');

        console.log(this.player2.char);

        if (this.player2.char == 1)
            this.p2charico = game.add.sprite(935, 488, 'char1ico');
        else
            this.p2charico = game.add.sprite(935, 488, 'char2ico');
        this.p2charico.anchor.x = 1;

    },

    uiUpdate: function () {

        // Check the players health and change the health bars if there is a change
        if (this.player1.gameHealth == 4)
            this.healthbar1.animations.play('4');
        else if (this.player1.gameHealth == 3)
            this.healthbar1.animations.play('3');
        else if (this.player1.gameHealth == 2)
            this.healthbar1.animations.play('2');
        else if (this.player1.gameHealth == 1)
            this.healthbar1.animations.play('1');
        else if (this.player1.gameHealth == 0)
            this.healthbar1.animations.play('0');

        if (this.player2.gameHealth == 4)
            this.healthbar2.animations.play('4');
        else if (this.player2.gameHealth == 3)
            this.healthbar2.animations.play('3');
        else if (this.player2.gameHealth == 2)
            this.healthbar2.animations.play('2');
        else if (this.player2.gameHealth == 1)
            this.healthbar2.animations.play('1');
        else if (this.player2.gameHealth == 0)
            this.healthbar2.animations.play('0');

        // Add the cooldowns to abilities


    },

    uiCooldown: function (player, ability, time) {

        // Create the fps the animations will play at
        // 8 is the number of frames, time the amount of seconds in frames in 60fps
        var fps = parseFloat(8 / (time/60));

        // Create the sprite and add the animation
        this.CDsprite = game.add.sprite(0, 0, 'cooldown');
        this.CDsprite.animations.add('CD');

        // Figure out on which ability to place the sprite
        if (player == 1 && ability == 1) {
            this.CDsprite.position.x = 26;
            this.CDsprite.position.y = 489;
            this.CDsprite.animations.play('CD', fps);
        }
        else if (player == 1 && ability == 2) {
            this.CDsprite.position.x = 58;
            this.CDsprite.position.y = 489;
            this.CDsprite.animations.play('CD', fps);
        }
        else if (player == 1 && ability == 3) {
            this.CDsprite.position.x = 90;
            this.CDsprite.position.y = 489;
            this.CDsprite.animations.play('CD', fps);
        }
        else if (player == 2 && ability == 1) {
            this.CDsprite.position.x = 840;
            this.CDsprite.position.y = 489;
            this.CDsprite.animations.play('CD', fps);
        }
        else if (player == 2 && ability == 2) {
            this.CDsprite.position.x = 872;
            this.CDsprite.position.y = 489;
            this.CDsprite.animations.play('CD', fps);
        }
        else if (player == 2 && ability == 3) {
            this.CDsprite.position.x = 904;
            this.CDsprite.position.y = 489;
            this.CDsprite.animations.play('CD', fps);
        }

    },

    /** Collision Functions
     * **/

    collisions: function () {

        // Add collision between the player and the ground (floor)
        this.physics.arcade.collide(this.player1, this.floors);
        this.physics.arcade.collide(this.player2, this.floors);

        // Add collision between the player and the ground (walls)
        this.physics.arcade.collide(this.player1, this.platforms, this.platformsCollide);
        this.physics.arcade.collide(this.player2, this.platforms, this.platformsCollide);

        // If the player touches the jumpPad
        this.physics.arcade.collide(this.player1, this.jumpPads, this.jumpPadCollide);
        this.physics.arcade.collide(this.player2, this.jumpPads, this.jumpPadCollide);

        // Collision between the bullets from weapon1 and the players
        this.physics.arcade.overlap(this.player1, weapon.bullets, this.rangedHit1, null, this.player2);
        this.physics.arcade.overlap(this.player1, weapon2.bullets, this.rangedHit2, null, this.player2);

        // Collision between the bullets from weapon1 and the players
        this.physics.arcade.overlap(this.player2, weapon.bullets, this.rangedHit1, null, this.player1);
        this.physics.arcade.overlap(this.player2, weapon2.bullets, this.rangedHit2, null, this.player1);

    },

    jumpPadCollide: function (player) {

        player.body.velocity.y = global.velocity.jumpPad;

    },

    platformsCollide: function (player) {

        if (player.input.down.isDown || player.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) {
            player.body.checkCollision.down = false;
            player.collision = 20;
        }

    },

    /** Character Functions
    * **/

    characterSpread: function (player) {

        if (player.char == 1) {
            this.character1(player);
            this.attackCooldown(player);
        }
        if (player.char == 2) {
            this.character2(player);
            this.attackCooldown(player);
        }

    },

    character1: function (player) {

        player.input.attack1.onDown.add( this.char1attack1, player, 0);

        player.input.attack2.onDown.add( this.char1attack2, player, 0);

        player.input.block.onDown.add( this.block, player, 0, player);

    },

    character2: function (player) {

        player.input.attack1.onDown.add(this.char2attack1, player, 0);

        player.input.attack2.onDown.add(this.char2attack2, player, 0);

        player.input.block.onDown.add(this.block, player, 0, player);

    },

    attackCooldown: function (player) {

        // If the first attack is used it goes on a 1.5 seconds cooldown
        if (player.input.attack1.isDown && player.attack1Cool == 0) {
            player.attack1Cool = 90;
            this.uiCooldown( player.ID, 1, 90);
        }

        // If the secondary attack is used it goes on a 5 second cooldown
        if (player.input.attack2.isDown && player.attack2Cool == 0) {
            player.attack2Cool = 300;
            this.uiCooldown( player.ID, 2, 300);
        }

        // If the block is used it goes on a 5 second cool down
        if (player.input.block.isDown && player.blockCool == 0) {
            player.blockCool = 300;
            this.uiCooldown( player.ID, 3, 300);
        }
        // Stop the block after 90 frames or 1.5 seconds
        if (player.blockCool < 210) {
            player.block = 0;
        }

        // Actually count down the cooldowns
        if (player.attack1Cool != 0)
            player.attack1Cool--;
        if (player.attack2Cool != 0)
            player.attack2Cool--;
        if (player.blockCool != 0)
            player.blockCool--;

    },

    char1attack1: function () {

        // Stop the attack if it is not off cooldown
        if (this.attack1Cool > 3)
            return null;

        // Debug stuff
        console.log(this.ID + ': attack1');

        // Create variable for positioning of the meleeSprite
        var posX = null;

        // Check the direction and position of the player
        if (this.direction == 1) {
            posX = this.body.position.x += 32;
        }
        else {
            posX = this.body.position.x -= 20;
        }

        // Create the temporary meleeSprite
        var meleeSprite = game.add.sprite(posX, this.body.position.y, 'meleeSprite');

        // Check if there is an overlap between the enemy player and meleeSprite, remove one health if there is
        if (this.ID == 1) {
            if (game.physics.arcade.overlap(meleeSprite, playState.player2) === true && playState.player2.block == 0) {
                playState.player2.gameHealth--;
                console.log(playState.player2.gameHealth);
            }
        }
        else if (this.ID == 2) {
            if (game.physics.arcade.overlap(meleeSprite, playState.player1) === true && playState.player1.block == 0) {
                playState.player1.gameHealth--;
                console.log(playState.player1.gameHealth);
            }
        }

        // Destroy the temporary melee sprite
        game.time.events.add(Phaser.Timer.SECOND * 0.1, function () {
            meleeSprite.destroy();
        }, this);

    },

    char1attack2: function () {

        // Stop the attack if it is not off cooldown
        if (this.attack2Cool > 3)
            return null;

        // Debug stuff
        console.log(this.ID + ': attack2');

        // This attack is strong so it has to be charged up for .5 seconds
        game.time.events.add(Phaser.Timer.SECOND * 0.5, function () {

            // Create variable for positioning of the meleeSprite
            var posXr = null;
            var posXl = null;

            // Get coordinates for the initial impact
            posXr = this.body.position.x += 32;
            posXl = this.body.position.x -= 52;
            var posY = this.body.position.y;

            // Create the temporary meleeSprite
            var meleeSpriteRight = game.add.sprite(posXr, posY, 'meleeSprite');
            var meleeSpriteLeft = game.add.sprite(posXl, posY, 'meleeSprite');

            // Check if there is an overlap between the enemy player and meleeSprite, remove one health if there is
            if (this.ID == 1 && playState.player2.block == 0) {
                if ((game.physics.arcade.overlap(meleeSpriteRight, playState.player2) === true || game.physics.arcade.overlap(meleeSpriteLeft, playState.player2) === true)) {
                    playState.player2.gameHealth--;
                    console.log(playState.player2.gameHealth);
                }
            }
            else if (this.ID == 2 && playState.player1.block == 0) {
                if ((game.physics.arcade.overlap(meleeSpriteRight, playState.player1) === true || game.physics.arcade.overlap(meleeSpriteLeft, playState.player1) === true)) {
                    playState.player1.gameHealth--;
                    console.log(playState.player1.gameHealth);
                }
            }

            // WARNING: Terrible code ahead
            // Creates the animation for the second attack and checks the collision
            game.time.events.add(Phaser.Timer.SECOND * 0.2, function () {
                meleeSpriteRight.visible = false;
                meleeSpriteLeft.visible = false;

                meleeSpriteRight = game.add.sprite(posXr + 20, posY, 'meleeSprite');
                meleeSpriteLeft = game.add.sprite(posXl - 20, posY, 'meleeSprite');

                // Check if there is an overlap between the enemy player and meleeSprite, remove one health if there is
                if (this.ID == 1 && playState.player2.block == 0) {
                    if (game.physics.arcade.overlap(meleeSpriteRight, playState.player2) === true || game.physics.arcade.overlap(meleeSpriteLeft, playState.player2) === true) {
                        playState.player2.gameHealth--;
                        console.log(playState.player2.gameHealth);
                    }
                }
                else if (this.ID == 2 && playState.player1.block == 0) {
                    if (game.physics.arcade.overlap(meleeSpriteRight, playState.player1) === true || game.physics.arcade.overlap(meleeSpriteLeft, playState.player1) === true) {
                        playState.player1.gameHealth--;
                        console.log(playState.player1.gameHealth);
                    }
                }

                game.time.events.add(Phaser.Timer.SECOND * 0.2, function () {
                    meleeSpriteRight.visible = false;
                    meleeSpriteLeft.visible = false;

                    meleeSpriteRight = game.add.sprite(posXr + 2*20, posY, 'meleeSprite');
                    meleeSpriteLeft = game.add.sprite(posXl - 2*20, posY, 'meleeSprite');

                    // Check if there is an overlap between the enemy player and meleeSprite, remove one health if there is
                    if (this.ID == 1 && playState.player2.block == 0) {
                        if (game.physics.arcade.overlap(meleeSpriteRight, playState.player2) === true || game.physics.arcade.overlap(meleeSpriteLeft, playState.player2) === true) {
                            playState.player2.gameHealth--;
                            console.log(playState.player2.gameHealth);
                        }
                    }
                    else if (this.ID == 2 && playState.player1.block == 0) {
                        if (game.physics.arcade.overlap(meleeSpriteRight, playState.player1) === true || game.physics.arcade.overlap(meleeSpriteLeft, playState.player1) === true) {
                            playState.player1.gameHealth--;
                            console.log(playState.player1.gameHealth);
                        }
                    }

                    game.time.events.add(Phaser.Timer.SECOND * 0.2, function () {
                        meleeSpriteRight.visible = false;
                        meleeSpriteLeft.visible = false;

                        meleeSpriteRight = game.add.sprite(posXr + 3*20, posY, 'meleeSprite');
                        meleeSpriteLeft = game.add.sprite(posXl - 3*20, posY, 'meleeSprite');

                        // Check if there is an overlap between the enemy player and meleeSprite, remove one health if there is
                        if (this.ID == 1 && playState.player2.block == 0) {
                            if (game.physics.arcade.overlap(meleeSpriteRight, playState.player2) === true || game.physics.arcade.overlap(meleeSpriteLeft, playState.player2) === true) {
                                playState.player2.gameHealth--;
                                console.log(playState.player2.gameHealth);
                            }
                        }
                        else if (this.ID == 2 && playState.player1.block == 0) {
                            if (game.physics.arcade.overlap(meleeSpriteRight, playState.player1) === true || game.physics.arcade.overlap(meleeSpriteLeft, playState.player1) === true) {
                                playState.player1.gameHealth--;
                                console.log(playState.player1.gameHealth);
                            }
                        }

                        game.time.events.add(Phaser.Timer.SECOND * 0.2, function () {
                            meleeSpriteRight.destroy();
                            meleeSpriteLeft.destroy();
                        }, this);
                    }, this);
                }, this);
            }, this);

        }, this);
    },

    char2attack1: function () {

        if (weapon.shoot == 1)
            weapon.bullets.destroy();

        // Stop the attack if it is on cool down
        if (this.attack1Cool > 3)
            return null;

        // Create the weapon, add it to the variable, create 3 bullets the player can use and give it the sprite 'projectile1'
        weapon = game.add.weapon(3, 'projectile1');

        // Give the weapon the ID of 1
        weapon.ID = 1;

        // Add the animation for the bullet sprite
        weapon.addBulletAnimation('anim', null, 15, true);
        weapon.bulletAnimation = 'anim';

        // Kill the bullets on world bound
        weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

        // Check which direction the player is facing
        if (this.direction == 1) {
            weapon.bulletSpeed = 250;
            weapon.trackSprite(this, 42, 16, true);
        }
        else if (this.direction == 2) {
            weapon.bulletSpeed = -250;
            weapon.trackSprite(this, -10, 16, true);
            weapon.bulletAngleOffset = 180;
        }

        // Set weapon.shoot to 0 when the bullet is destroyed
        weapon.onkill = weapon.shoot = 0;

        // Set weapon.shoot to 1 when a new bullet is fired
        weapon.shoot = 1;

        // Fire the weapon
        weapon.fire();

    },

    char2attack2: function () {

        // Stop the attack if it is on cool down
        if (this.attack2Cool > 3)
            return null;

        // Create the weapon, add it to the variable, create 1 bullet the player can use and give it the sprite 'projectile2'
        weapon2 = game.add.weapon(1, 'projectile2');

        // Give the weapon the ID of 2
        weapon2.ID = 2;

        // Add the animation for the bullet sprite
        weapon2.addBulletAnimation('anim', null, 15, true);
        weapon2.bulletAnimation = 'anim';

        // Kill the bullets on world bound
        weapon2.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

        // Add gravity to the bullets and set it to 200
        game.physics.arcade.enable(weapon2.bullets);
        weapon2.bulletGravity = 2000;

        // Check which direction the player is facing
        if (this.direction == 1) {
            weapon2.bulletSpeed = 250;
            weapon2.trackSprite(this, 47, 16, true);
        }
        else if (this.direction == 2) {
            weapon2.bulletSpeed = -250;
            weapon2.trackSprite(this, -15, 16, true);
            weapon2.bulletAngleOffset = 180;
        }

        // Fire the weapon
        weapon2.fire();

    },

    rangedHit1: function (player, weapon) {

        if (player.ID == 1 && this.ID == 2 && playState.player1.block == 0) {
            playState.player1.gameHealth--;
        }
        else if (player.ID == 2 && this.ID == 1 && playState.player2.block == 0) {
            playState.player2.gameHealth--;
        }

        weapon.kill();

    },

    rangedHit2: function (player, weapon) {

        if (player.ID == 1 && this.ID == 2 && playState.player1.block == 0) {
            playState.player1.gameHealth--;
            playState.player1.gameHealth--;

            this.explosion = game.add.sprite(0, 0, 'explosion');
            this.explosion.anchor.setTo(.5,.5);
            this.explosion.x = weapon.x;
            this.explosion.y = weapon.y;
            this.explosion.animations.add('boom', null, false);
            this.explosion.play('boom');
        }
        else if (player.ID == 2 && this.ID == 1  && playState.player2.block == 0) {
            playState.player2.gameHealth--;
            playState.player2.gameHealth--;

            this.explosion = game.add.sprite(0, 0, 'explosion');
            this.explosion.anchor.setTo(.5,.5);
            this.explosion.x = weapon.x;
            this.explosion.y = weapon.y;
            this.explosion.animations.add('boom', null, false);
            this.explosion.play('boom');
        }

        weapon.kill();

    },

    block: function (player) {

        if (this.blockCool > 3)
            return null;

        if (this.blockCool < 3)
            this.block = 1;

        shield = game.add.sprite(0, 0, 'shield');
        shield.on = 1;
        shield.anchor.setTo(.5,.5);
        shield.x = this.body.position.x + 16;
        shield.y = this.body.position.y + 16;

        var loop = game.time.events.loop(1000/60, shieldUpdate, this, shield.x, shield.y, this.body.position);

        function shieldUpdate(x, y, p) {
            shield.kill();
            shield = game.add.sprite(0, 0, 'shield');
            shield.anchor.setTo(.5,.5);
            shield.x = p.x + 16;
            shield.y = p.y + 16;
        }

        game.time.events.add(Phaser.Timer.SECOND * 1.5, function () {
            game.time.events.remove(loop);
            shield.on = 0;
            shield.kill();
            console.log('ded');
        });
    },

    /** Animations
     * **/

    attack2ChargeUp: function () {



    },

    /** Event functions
     * **/

    gameEvents: function () {

        // Call game over when health is zero
        if (this.player1.gameHealth == 0 || this.player2.gameHealth == 0){
            console.log("Game is over");
            this.gameOver();
        }

    },

    gameOver: function () {

        this.afterText = game.add.sprite(game.world.centerX - 212, game.world.centerY - 150, 'gameOver');
        this.afterText.scale.setTo(4, 4);

        if (this.player1.gameHealth == 0)
            this.afterText = game.add.sprite(game.world.centerX - 138, game.world.centerY - 50, 'p2wins')
        if (this.player2.gameHealth == 0)
            this.afterText = game.add.sprite(game.world.centerX - 138, game.world.centerY - 50, 'p1wins')

        this.afterText.scale.setTo(2, 2);

        setTimeout(this.restart, 4000);

        game.paused = true;

    },

    restart: function() {

        // Reload the whole web page
        location.reload();
    },

    /** Debugging
     *
     * @constructor
     */

    Debug: function() {
        // Add the mouse position to variables
        var mouseX = parseInt(this.input.mousePointer.x);
        var mouseY = parseInt(this.input.mousePointer.y);

        // Display the mouse position
        game.debug.text("MouseX = " + mouseX, 2, 28, "#00ff00");
        game.debug.text("MouseY = " + mouseY, 2, 42, "#00ff00");

        // Display the fps counter
        game.debug.text("fps = " + game.time.fps, 2, 14, "#00ff00");

        // Display the player health
        game.debug.text("health1 = " + this.player1.gameHealth, 2, 70, "#00ff00");
        game.debug.text("health2 = " + this.player2.direction, 2, 84, "#00ff00");

        game.debug.text("playerPosX = " + this.player1.body.position.x, 2, 98, "#00ff00");

    }
};