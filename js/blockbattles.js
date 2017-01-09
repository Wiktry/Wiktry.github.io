// Create our 'playGame' state that will contain the game
var playState = {
    preload: function() {

        this.load.image('player1', 'assets/player.png');
        this.load.image('player2', 'assets/player2.png');
        this.load.image('wall', 'assets/wall.png');
        this.load.image('lava', 'assets/lava.png');
        this.load.image('jumpPad', 'assets/jumpPad.png');
        this.load.image('launchPad', 'assets/launchPad.png');
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
        this.player1 = playerCreate(120, 380, 'player1');
        this.player2 = playerCreate(840, 380, 'player2')

        // Function that creates the game level
        this.levelCreate();

        // Player movement vars
        this.player1Move = 0;
        this.player1Down = 0;
        this.player2Move = 0;
        this.player2Down = 0;

        this.curPos;
        this.futPos;

    },



    update: function() {

        // Players movement
        this.player1.body.velocity.x = playerMovement(options.controls.player1.left, options.controls.player1.right, this.player1.body.velocity.x, this.player1)
        this.player2.body.velocity.x = playerMovement(options.controls.player2.left, options.controls.player2.right, this.player2.body.velocity.x, this.player2)

        playerJumping(options.controls.player1.down, options.controls.player1.up, this.player1)

        // All of the collision stuff
        this.collisions();

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
        if (this.physics.arcade.overlap(this.player1, this.jumpPad))
            jumpPad(this.player1);
        this.physics.arcade.overlap(this.player2, this.jumpPad, jumpPad(this.player2), null, this);

        // If the player touches the launchPad
        this.physics.arcade.overlap(this.player1, this.launchPad, this.launchPadFunc, null, this, this.curPos = 180, this.futPos = 500);
        this.physics.arcade.overlap(this.player2, this.launchPad, this.launchPadFunc, null, this, this.curPos = 180, this.futPos = 500);

    },


    // Game event functions

    /**


    launchPadFunc: function launchPadFunc () {

        this.player.body.velocity.y = -500;

        this.playerLaunched = true;

        this.wait = 0;

        /**
        for (var i = this.curPos; i < this.futPos; i++) {
            this.player.body.position.x = i;
        }
         **/

    restart: function() {
        game.state.start('playState');
        this.player1Move = 0;
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

    }
};

// Functions that should not be anonymous

// Creates and places the player sprite
function playerCreate(posX, posY, sprite) {

    // Add the player sprite to this.player
    var player = game.add.sprite(posX, posY, sprite);

    // Move the players anchor point to the center
    player.anchor.setTo(0.5, 0.5);

    // Enable physics for the player
    game.physics.arcade.enable(player);

    // Add gravity to the player
    player.body.gravity.y = 600;

    // Remove collision detection for jumping up through blocks
    player.body.checkCollision.up = false;
    player.body.checkCollision.left = false;
    player.body.checkCollision.right = false;

    return player;
}


// The player's X movement
function playerMovement(left, right, playerMove, player) {

    this.playerSpeed = playerMove;

    // Player movement
    // If the left button is down the player speed will increase to -150
    if (left.isDown && playerMove >= -150) {
        this.playerSpeed -= 10;
    }
    // If the right button is down the player speed will increase to 150
    else if (right.isDown && playerMove <= 150) {
        this.playerSpeed += 10;
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

    // Add player death and game restart on touching the game bounds
//    if (this.player1.body.position.x < -20 || this.player1.body.position.x > 960)
//        this.restart();

    return this.playerSpeed;
}


//
function playerJumping(down, up, player) {

     // Player jumping
     if (up.isDown && player.touching.down)
     player.velocity.y = -350;


     // Angle when player jumps
     if (player.touching.down === false && player.velocity.x > 1)
     player.angle += 2;
     else if (player.touching.down === false && player.velocity.x < -1)
     player.angle -= 2;
     else if (player.touching.down === false)
     player.angle++;
     else
     player.angle = 0;

     /**
     // Player going down through platforms
     if (down.isDown && player.body.position.y < 375){
        player.body.checkCollision.down = false;
        this.playerDown = 5;
    }
     else if (this.playerDown < 2)
         player.body.checkCollision.down = true;
     else if (this.playerDown > 0)
        this.playerDown--;
     if (player.body.position.y > 400)
         player.body.checkCollision.down = true;
    **/

}

function jumpPad(player) {

    player.body.velocity.y = -500;

}