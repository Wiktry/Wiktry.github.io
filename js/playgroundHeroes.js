var global = {
    velocity: {
        playerJumping: -350,
        jumpPad: -500,
    }
};

var playState = {
    preload: function() {

        // Text
        this.load.image('gameOver', 'assets/words/image/gameOver.png');
        this.load.image('p1wins', 'assets/words/image/player1wins.png');
        this.load.image('p2wins', 'assets/words/image/player2wins.png');

        // Assets
        this.load.image('player1', 'assets/player.png');
        this.load.image('player2', 'assets/player2.png');
        this.load.image('wall', 'assets/wall.png');
        this.load.image('lava', 'assets/lava.png');
        this.load.image('jumpPad', 'assets/jumppad.png');
        this.load.image('meleeSprite', 'assets/meleeSprite.png');
        this.alphabet = this.load.atlas('alphabet', 'assets/spritesheets/alphabet.png', 'assets/spritesheets/alphabet.json');
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

        // Below this line is level and character specific functions

        // Function that creates the player sprites and places them
        this.player1 = this.playerCreate(160, 320, characterSelect.player1, characterSelect.ID1);
        this.player2 = this.playerCreate(800, 320, characterSelect.player2, characterSelect.ID2);
        this.player2.direction = 1;
        this.player2.ID = 2;

        // Function that creates the game level
        this.levelCreate();

    },

    update: function() {

        // All of the collision stuff
        this.collisions();

        // All the player updates
        this.playerUpdate();

        // All the attack updates
        this.attackFunctions();

        // Game event updates
        this.gameEvents();

        // Debug function
        this.Debug();

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

        levelCreate(levelDecide, this.floors, this.platforms, this.jumpPads);

    },

    playerCreate: function (posX, posY, sprite, char) {

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
        player.ID = 1;
        // Give the player a character
        player.char = char;
        // Give the player a timer for collision down
        player.collision = 0;

        return player;

    },

    /** Update functions
     * **/

    playerUpdate: function () {

        // Players movement
        this.playerMovement(options.controls.player1.left, options.controls.player1.right, this.player1);
        this.playerMovement(options.controls.player2.left, options.controls.player2.right, this.player2);

        // Player jumping
        if (options.controls.player1.up.isDown && this.player1.body.touching.down)
            this.player1.body.velocity.y = global.velocity.playerJumping;
        if (options.controls.player2.up.isDown && this.player2.body.touching.down)
            this.player2.body.velocity.y = global.velocity.playerJumping;

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

    playerMovement: function (left, right, player) {

        if (left.isDown && player.body.velocity.x > -150) {
            player.body.velocity.x -= 10;
        }
        else if (right.isDown && player.body.velocity.x <= 150) {
            player.body.velocity.x += 10;
        }
        else if (player.body.velocity.x <= 10 && player.body.velocity.x >= -10 ) {
            player.body.velocity.x = 0;
        }
        else if (player.body.touching.down === true) {
            if (player.body.velocity.x > 0)
                player.body.velocity.x -= 10;
            if (player.body.velocity.x < 0)
                player.body.velocity.x += 10;
        }
        else {
            if (player.body.velocity.x > 0)
                player.body.velocity.x -= 4;
            if (player.body.velocity.x < 0)
                player.body.velocity.x += 4;
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
    },

    jumpPadCollide: function (player) {

        player.body.velocity.y = global.velocity.jumpPad;

    },

    platformsCollide: function (player) {

        if (player.ID == 1 && options.controls.player1.down.isDown) {
            player.body.checkCollision.down = false;
            player.collision = 20;
        }
        if (player.ID == 2 && options.controls.player2.down.isDown) {
            player.body.checkCollision.down = false;
            player.collision = 20;
        }

    },

    /** Attack Functions
    * **/

    attackFunctions: function () {

        // Attack 1 or "Basic Attack"
        if (options.controls.player1.attack1.isDown) {
            if (this.player1.char == 1)
                this.meleeAttack(this.player1, this.player2);
            else
                this.rangedAttack(this.player1, this.player2);
        }
        if (options.controls.player2.attack1.isDown) {
            if (this.player2.char == 1)
                this.meleeAttack(this.player2, this.player1);
            else
                this.rangedAttack(this.player2, this.player1);
        }

        /**
        if (this.attackCooldown.a1 != 0)
            this.attackCooldown.a1--;
        if (this.attackCooldown.a2 != 0)
            this.attackCooldown.a2--;

        if (this.attackCooldown.a1 == 0)
            if (options.controls.player1.attack1.isDown) {
                this.player2.gameHealth -= meleeAttack(this.player1, this.player2);
                this.attackCooldown.a1 = 40;
            }
        if (this.attackCooldown.a2 == 0)
            if (options.controls.player2.attack1.isDown) {
                this.player1.gameHealth -= meleeAttack(this.player2, this.player1);
                this.attackCooldown.a1 = 40;
            }
         **/

    },

    meleeAttack: function (player1, player2) {

        console.log('hej!');

        options.controls.player1.attack1.enabled = false;
        setTimeout(options.controls.player1.attack1.enabled = true, 1000);

    },

    rangedAttack: function (player1, player2) {



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

        setTimeout(this.restart, 3000);

        game.paused = true;

    },

    restart: function() {
        game.paused = false;
        game.state.start('playState');
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
        game.debug.text("health2 = " + this.player2.gameHealth, 2, 84, "#00ff00");

        game.debug.text("playerPosX = " + this.player1.body.position.x, 2, 98, "#00ff00");

    }
};

// Melee attack **TO BE REMOVED**
function meleeAttack(player1, player2) {

    this.hit = 0;

    if (player1.direction == 1) {
        this.posX = player1.body.position.x - 20;
        this.posY = player1.body.position.y;
    }
    else {
        this.posX = player1.body.position.x + 32;
        this.posY = player1.body.position.y;
    }

    this.attackArea = game.add.sprite(this.posX, this.posY, 'meleeSprite');

    if (game.physics.arcade.overlap(player2, this.attackArea) === true)
        this.hit = 1;

    this.attackArea.destroy();

    if (this.hit == 1)
        return 1;
    else
        return 0;

}