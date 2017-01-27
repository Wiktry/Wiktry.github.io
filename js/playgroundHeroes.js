var global = {
    velocity: {
        playerJumping: -350,
        jumpPad: -500,
    }
}

// Create our 'playGame' state that will contain the game
var playState = {
    preload: function() {

        // Text
        this.load.image('gameOver', 'assets/words/image/gameOver.png');
        this.load.image('p1wins', 'assets/words/image/player1wins.png');
        this.load.image('p2wins', 'assets/words/image/player2wins.png');

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
        this.player1 = playerCreate(160, 320, 'player1');
        this.player2 = playerCreate(800, 320, 'player2');
        this.player2.direction = 1;

        // Function that creates the game level
        this.levelCreate();
    },



    update: function() {

        // All of the collision stuff
        this.collisions();

        // All the player updates
        this.playerUpdate();

        // All the attack updates
        this.attackUpdate();

        // Game event updates
        this.gameEvent();

        // Debug function
        this.Debug();

    },


    // Create functions


    inputCreate: function() {

        // Add the cursor Keys
        this.cursors = keyBinding(true, null);

        // Add the keyboard Keys
        this.keyboardKey = keyBinding(null, true);
    },

    levelCreate: function() {

        // Decide the the level to create and add it to 'levelToBuild'
        if (levelDecide == 1)
            this.levelToBuild = Atlantis;
        else if (levelDecide == 2)
            this.levelToBuild = Aether;
        else if (levelDecide == 3)
            this.levelToBuild = Flatlands;

        // Add the walls group and the lava group
        this.floors = game.add.group();
        this.walls = game.add.group();
        this.enemies = game.add.group();
        this.jumpPad = game.add.group();
        this.launchPad = game.add.group();

        // I need to rebuild the whole block and either move it to another doc or
        // figure out a way of making it smaller
        // Gets the level info from 'levelDecide' and builds the right level
        // Creates the level
        for(var i = 0; i < this.levelToBuild.length; i++){
            for(var j = 0; j < this.levelToBuild[i].length; j++){

                // Create the floor
                if (this.levelToBuild[i][j] == 'f'){
                    var floor = this.game.add.sprite(30+20*j, 30+20*i, 'wall');
                    this.floors.add(floor);
                    floor.body.immovable = true;
                }
                // Create the walls
                else if (this.levelToBuild[i][j] == 'x'){
                    var wall = this.game.add.sprite(30+20*j, 30+20*i, 'wall');
                    this.walls.add(wall);
                    wall.body.immovable = true;
                }
                // Create the enemies, the blocks that restarts the game
                else if (this.levelToBuild[i][j] == 'o'){
                    var lava = this.game.add.sprite(30+20*j, 30+20*i, 'lava');
                    this.enemies.add(lava);
                    lava.body.immovable = true;
                }
                // Create jumpPads
                else if (this.levelToBuild[i][j] == 'e'){
                    var jumpPad = this.game.add.sprite(30+20*j, 30+20*i, 'jumpPad');
                    this.jumpPad.add(jumpPad);
                    jumpPad.body.immovable = true;
                }
                // Create launchPads
                else if (this.levelToBuild[i][j] == 'l'){
                    var launchPad = this.game.add.sprite(30+20*j, 30+20*i, 'launchPad');
                    this.launchPad.add(launchPad);
                    launchPad.body.immovable = true;
                }
            }
        }
    },

    textCreate: function (string, posX, posY) {

        // Convert the string into all uppercase letters
        this.string = string.toUpperCase();

        // The var that determines the X-position from the start
        var tempPos = 0;

        // Create the letters as images
        for (var i = 0; this.string.length > i; i++ ) {
            if (this.string[i] == 'I' || this.string[i] == ' ') {
                this.text += this.add.image(posX+tempPos, posY, 'alphabet', this.string[i]);
                tempPos += 6;
            }
            else if (this.string[i] == 'M' || this.string[i] == 'W') {
                this.text += this.add.image(posX+tempPos, posY, 'alphabet', this.string[i]);
                tempPos += 16;
            }
            else if (this.string[i] == 'N' || this.string[i] == 'Q' || this.string[i] == 'T' || this.string[i] == 'Y') {
                this.text += this.add.image(posX+tempPos, posY, 'alphabet', this.string[i]);
                tempPos += 14;
            }
            else {
                this.text += this.add.image(posX+tempPos, posY, 'alphabet', this.string[i]);
                tempPos += 12;
            }
        }

        return this.text;

    },


    // Update functions

    playerUpdate: function () {

        // Players movement
        this.player1.body.velocity.x = playerMovement(options.controls.player1.left, options.controls.player1.right, this.player1.body.velocity.x, this.player1)
        this.player2.body.velocity.x = playerMovement(options.controls.player2.left, options.controls.player2.right, this.player2.body.velocity.x, this.player2)

        // Player jumping
        if (options.controls.player1.up.isDown && this.player1.body.touching.down)
            this.player1.body.velocity.y = global.velocity.playerJumping;
        if (options.controls.player2.up.isDown && this.player2.body.touching.down)
            this.player2.body.velocity.y = global.velocity.playerJumping;

        // Player going down through a platform
        if (options.controls.player1.down.isDown && playerDown(this.player1.body.position.y) === true)
            this.player1.body.checkCollision.down = false;
        else
            this.player1.body.checkCollision.down = true;
        if (options.controls.player2.down.isDown && playerDown(this.player2.body.position.y) === true)
            this.player2.body.checkCollision.down = false;
        else
            this.player2.body.checkCollision.down = true;

        // Player leaving the game area
        if (this.player1.body.position.y > 540)
            this.player1.gameHealth = 0;
        if (this.player2.body.position.y > 540)
            this.player2.gameHealth = 0;
    },

    attackUpdate: function () {

        this.attackCooldown = {
            a1: 0,
        };

        if (this.attackCooldown.a1)
            if (options.controls.player1.attack1.isDown)
                this.player2.gameHealth -= meleeAttack(this.player1, this.player2);
            if (options.controls.player2.attack1.isDown)
                this.player1.gameHealth -= meleeAttack(this.player2, this.player1);

    },

    collisions: function () {

        // Add collision between the player and the ground (floor)
        this.physics.arcade.collide(this.player1, this.floors);
        this.physics.arcade.collide(this.player2, this.floors);

        // Add collision between the player and the ground (walls)
        this.physics.arcade.collide(this.player1, this.walls);
        this.physics.arcade.collide(this.player2, this.walls);

        // Add overlap between the player and lava, when they touch, restart the game
        this.physics.arcade.overlap(this.player1, this.enemies, this.restart, null, this);
        this.physics.arcade.overlap(this.player2, this.enemies, this.restart, null, this);

        // If the player touches the jumpPad
        if (this.physics.arcade.overlap(this.player1, this.jumpPad) === true)
            this.player1.body.velocity.y = global.velocity.jumpPad;
        if (this.physics.arcade.overlap(this.player2, this.jumpPad) === true)
            this.player2.body.velocity.y = global.velocity.jumpPad;
    },


    // Game event functions

    gameEvent: function () {

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
            this.afterText = game.add.sprite(game.world.centerX - 138, game.world.centerY - 50, 'p1wins')

        this.afterText.scale.setTo(2, 2);



        game.paused = true;

    },

    restart: function() {
        game.state.start('playState');
    },



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

// Functions that should not be anonymous

// Creates and places the player sprite
function playerCreate(posX, posY, sprite) {

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

    return player;
}

// The player's X movement
function playerMovement(left, right, playerMove, player) {

    this.playerSpeed = playerMove;

    // Player movement
    // If the left button is down the player speed will increase to -150
    if (left.isDown && playerMove >= -150) {
        this.playerSpeed -= 10;
        player.direction = 1;
    }
    // If the right button is down the player speed will increase to 150
    else if (right.isDown && playerMove <= 150) {
        this.playerSpeed += 10;
        player.direction = 0;
    }
    // set 'player1Move' to 0 when it is between 10 and -10, to stop it from getting stuck on 6 or 2
    else if (playerMove <= 10 && playerMove >= -10)
        this.playerSpeed = 0;
    else if (player.body.velocity.y <= 10 || player.body.velocity.y >= -10) {
        // Player loses speed over time when button is not pressed
        // Friction when player is on the ground
        if (playerMove < 0)
            this.playerSpeed += 10;
        if (playerMove > 0)
            this.playerSpeed -= 10;
    }
    else {
        // Losses speed slower in the air
        if (playerMove < 0)
            this.playerSpeed += 2;
        if (playerMove > 0)
            this.playerSpeed -= 2;
    }

    // Player's current movespeed
    game.debug.text("playerMove = " + this.playerSpeed, 2, 56, "#00ff00");
    game.debug.text("playerDirection = " + player.direction, 2, 120, "#00ff00");

    // Add player death and game restart on touching the game bounds
//    if (this.player1.body.position.x < -20 || this.player1.body.position.x > 960)
//        this.restart();

    return this.playerSpeed;
}

// Let the player go down through platforms
function playerDown(posY) {

    if (posY < 380)
        return true
    else
        return false
}

// Melee attack
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
        this.hit = 1

    this.attackArea.destroy();

    if (this.hit == 1)
        return 1;
    else
        return 0;

}