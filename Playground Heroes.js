// Initialize Phaser, and create a 960px by 640px game
var game = new Phaser.Game(960, 540);



// Create the 'mainState' that loads the game and contains the startup menu
var mainState = {
    preload: function() {
        // This function will be executed at the beginning     
        // That's where we load the images and sounds
        
        this.load.atlas('playButton', 'assets/textureAtlas.png', 'assets/textureAtlas.json', Phaser.Loader.TEXTURE_LOADER_JSON_HASH);
        this.load.image('logo', 'assets/Logo.png');
        
    },
    
    create: function() {
        // This function is called after the preload function     
        // Here we set up the game, display sprites, etc.
        
        // Scaling
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.maxWidth = this.scale.Exact_fit;
        this.scale.maxHeight = this.scale.Exact_fit;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.setScreenSize = true;
        
        // Stage background color
        this.stage.backgroundColor = '#3C9BBA';
        
        // Button to start the game
        var playButton = this.add.button(this.world.centerX - 50, 400, 'playButton', this.playButtonClick, this, 'PlayButtonHoover.png', 'PlayButton.png', 'PlayButtonHoover.png');
        
        // Logo
        var logo = this.add.image(this.world.centerX -190, 200, 'logo');
        
        // Enable the keyboard
        this.enter = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        
    },
    
    update: function() {
        // This function is called 60 times per second    
        // It contains the game's logic
        
        if(this.enter.isDown)
            this.playButtonClick();
        
    },
    
    playButtonClick: function() {
        // Changes to the 'playGame' state
        
        game.state.start('playState');
    },
    
    playButtonOver: function() {
        
    },
};



// Create our 'playGame' state that will contain the game
var playState = {
    preload: function() { 
        
        this.load.image('player', 'assets/player.png');
        this.load.image('wall', 'assets/wall.png');
        this.load.image('lava', 'assets/lava.png');
    },

    create: function() { 
        
        // Create a fps variable
        game.time.advancedTiming = true;
        
        // Scaling
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.maxWidth = this.scale.Exact_fit;
        this.scale.maxHeight = this.scale.Exact_fit;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.setScreenSize = true;

        // Set the stage background to '#56abec'
        this.stage.backgroundColor = '#56abec';
        
        // Start the physics engine 'ARCADE'
        this.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Ass the physics to all game objects
        game.world.enableBody = true;
        
        // Add the cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Function that creates the player sprite and places it
        this.playerCreate();
        
        // Function that creates the 'walls' and places them
        // Needs to be changed to the right level and more levels added
        this.levelCreate();
        
        // Player movement vars
        this.playerMove = 0;
        
    },

    update: function() {
        
        // Add collision between the player and the ground (walls)
        this.physics.arcade.collide(this.player, this.walls);
        
        // Add overlap between the player and lava, when they touch, restart the game
        this.physics.arcade.overlap(this.player, this.enemies, this.restart, null, this);
        
        // Player movement
        this.playerMovement();
        
        // Debug function
        this.Debug();
        
    },
    
    playerCreate: function() {
        
        // Add the player sprite
        this.player = this.add.sprite(120, 390, 'player');
        
        // Enable physics for the player
        this.physics.arcade.enable(this.player)
        
        // Add gravity to the player
        this.player.body.gravity.y = 600;
        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;
    },
    
    playerMovement: function() {
        
        // Player movement
        if (this.cursors.left.isDown) {
            this.playerMove = -200;
        }
        else if (this.cursors.right.isDown) {
            this.playerMove = 200;
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
        
        game.debug.text("playerMove = " + this.playerMove, 2, 56, "#00ff00");
        
        // Player jumping
        if (this.cursors.up.isDown && this.player.body.touching.down)
            this.player.body.velocity.y = -350;
    },
    
    levelCreate: function() {
        
        // Add the walls group and the lava group
        this.walls = game.add.group();
        this.enemies = game.add.group();
        
        for(var i = 0; i < Atlantis.length; i++){
            for(var j = 0; j < Atlantis[i].length; j++){
        
                // Create the walls
                if (Atlantis[i][j] == 'x'){
                    var wall = this.game.add.sprite(30+20*j, 30+20*i, 'wall');
                    this.walls.add(wall);
                    wall.body.immovable = true;
                }   
                
                // Create the enemies
                if (Atlantis[i][j] == 'o'){
                    var lava = this.game.add.sprite(30+20*j, 30+20*i, 'lava');
                    this.enemies.add(lava);
                    lava.body.immovable = true;
                } 
            }
        }
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
        
    },
};



// Add the 'mainState' and call it 'main'
game.state.add('playState', playState); 
game.state.add('mainState', mainState);

// Start the state to actually start the game
game.state.start('mainState');