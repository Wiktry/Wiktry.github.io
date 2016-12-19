// Create our 'playGame' state that will contain the game
var playState = {
    preload: function() {

        this.load.image('player', 'assets/player.png');
        this.load.image('wall', 'assets/wall.png');
        this.load.image('lava', 'assets/lava.png');
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
        this.playerCreate(1);

        // Function that creates the game level
        this.levelCreate();

        // Player movement vars
        this.playerMove = 0;
        this.playerDown = 0;

    },



    update: function() {

        // All of the updates related to the player
        this.playerUpdate();

        // Debug function
        this.Debug();

        // AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
        if (this.keyboardKey.G.isDown)
            text = null;

        if (this.keyboardKey.H.isDown)
            text = this.textCreate('Det trodde du allt', 100, 100);


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
                if (this.levelToBuild[i][j] == 'x'){
                    var wall = this.game.add.sprite(30+20*j, 30+20*i, 'wall');
                    this.walls.add(wall);
                    wall.body.immovable = true;
                }

                // Create the enemies, the blocks that restarts the game
                if (this.levelToBuild[i][j] == 'o'){
                    var lava = this.game.add.sprite(30+20*j, 30+20*i, 'lava');
                    this.enemies.add(lava);
                    lava.body.immovable = true;
                }
            }
        }
    },

    playerCreate: function(playerNumb) {

        // Create player 1 and 2
        if (playerNumb == 1) {
            // Add the player sprite
            this.player = this.add.sprite(120, 390, 'player');

            // Move the players anchor point to the center
            this.player.anchor.setTo(0.5, 0.5);

            // Enable physics for the player
            this.physics.arcade.enable(this.player);

            // Add gravity to the player
            this.player.body.gravity.y = 600;
            this.player.body.checkCollision.up = false;
            this.player.body.checkCollision.left = false;
            this.player.body.checkCollision.right = false;
        }
        else if (playerNumb == 2) {
            // Add the player sprite
            this.player2 = this.add.sprite(820, 390, 'player2');

            // Enable physics for the player
            this.physics.arcade.enable(this.player2);

            // Add gravity to the player
            this.player2.body.gravity.y = 600;
            this.player2.body.checkCollision.up = false;
            this.player2.body.checkCollision.left = false;
            this.player2.body.checkCollision.right = false;
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

        // Add collision between the player and the ground (floor)
        this.physics.arcade.collide(this.player, this.floors);

        // Add collision between the player and the ground (walls)
        this.physics.arcade.collide(this.player, this.walls);

        // Add overlap between the player and lava, when they touch, restart the game
        this.physics.arcade.overlap(this.player, this.enemies, this.restart, null, this);

        // Player movement
        this.playerMovement();

    },

    playerMovement: function() {

        // Player movement
        if (options.controls.player1.left.isDown && this.playerMove >= -150) {
            this.playerMove -= 10;
        }
        else if (options.controls.player1.right.isDown && this.playerMove <= 150) {
            this.playerMove += 10;
        }
        else if (this.playerMove <= 10 && this.playerMove >= -10)
            // set 'playerMove' to 0 when it is between 10 and -10, to stop it from getting stuck on 6 or 2
            this.playerMove = 0;
        else if (this.player.body.touching.down) {
            // Player loses speed over time when button is not pressed
            // Friction when player is on the ground
            if (this.playerMove < 0)
                this.playerMove += 8;
            if (this.playerMove > 0)
                this.playerMove -= 8;
        }
        else {
            // Losses speed slower in the air
            if (this.playerMove < 0)
                this.playerMove += 2;
            if (this.playerMove > 0)
                this.playerMove -= 2;
        }

        // Set the movement speed to the var 'playerMove'
        if (this.playerMove < 0)
            this.player.body.velocity.x = this.playerMove;
        else if (this.playerMove > 0)
            this.player.body.velocity.x = this.playerMove;
        else
            this.player.body.velocity.x = 0;

        // Player's current movespeed
        game.debug.text("playerMove = " + this.playerMove, 2, 56, "#00ff00");

        // Player jumping
        if (options.controls.player1.up.isDown && this.player.body.touching.down)
            this.player.body.velocity.y = -350;

        // Angle when player jumps
        if (this.player.body.touching.down === false && this.player.body.velocity.x > 1)
            this.player.angle += 2;
        else if (this.player.body.touching.down === false && this.player.body.velocity.x < -1)
            this.player.angle -= 2;
        else if (this.player.body.touching.down === false)
            this.player.angle++;
        else
            this.player.angle = 0;

        // Player going down through platforms
        if (options.controls.player1.down.isDown && this.player.body.position.y < 375){
            this.player.body.checkCollision.down = false;
            this.playerDown = 5;
        }
        else if (this.playerDown < 2)
            this.player.body.checkCollision.down = true;
        else if (this.playerDown > 0)
            this.playerDown--;
        if (this.player.body.position.y > 400)
            this.player.body.checkCollision.down = true;

        // Add player death and game restart on touching the game bounds
        if (this.player.body.position.x < -20 || this.player.body.position.x > 960)
            this.restart();
    },

    restart: function() {
        game.state.start('playState');
        this.playerMove = 0;
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