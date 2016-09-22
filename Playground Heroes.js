// Initialize Phaser, and create a 960px by 640px game
var game = new Phaser.Game(960, 540);

// Create the 'mainState' that loads the game and contains the startup menu
var mainState = {
    preload: function() {
        // This function will be executed at the beginning     
        // That's where we load the images and sounds
        
        this.load.image('playButton', 'assets/PlayButton.png');
        this.load.image('playButtonHoover', 'assets/PlayButtonHoover.png');
        
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
        this.stage.backgroundColor = '#fefefe';
        
        // Button to start the game
        var playButton = this.add.button(this.world.centerX - 50, 400, 'playButton', this.playButtonClick, this, playButtonOver);
        
    },
    
    update: function() {
        // This function is called 60 times per second    
        // It contains the game's logic
        
    },
    
    playButtonClick: function() {
        // Changes to the 'playGame' state
        
        game.state.start('playState');
    },
    
    plauButtonOver: function() {
        
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
        this.wallsCreate();
        
    },

    update: function() {
        
        // Add collision between the player and the ground (walls)
        this.physics.arcade.collide(this.player, this.walls);
        
        // Add overlap between the player and lava, when they touch, restart the game
        this.physics.arcade.overlap(this.player, this.enemies, this.restart, null, this);
        
        // Player movement
        this.playerMove();
        
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
    
    playerMove: function() {
        
        // Player movement
        if (this.cursors.left.isDown)
            this.player.body.velocity.x = -200;
        else if (this.cursors.right.isDown)
            this.player.body.velocity.x = 200;
        else
            this.player.body.velocity.x = 0;
        
        // Player jumping
        if (this.cursors.up.isDown && this. player.body.touching.down)
            this.player.body.velocity.y = -350;
    },
    
    wallsCreate: function() {
        
        // Add the walls group and the lava group
        this.walls = game.add.group();
        this.enemies = game.add.group();
        
        
        // Create the level Atlantis
        // Add every space is 20px another 30px is added to the left and right
        // Optimal size is 45 wide and 22 tall, the last five is for the resart block at the bottom
        // x = walls / o = enemies
        var Atlantis = [
            '                                             ',
            '                                             ',
            '                                             ',
            '                                             ',
            '                                             ',
            '                                             ',
            '                                             ',
            '                                             ',
            '                                             ',
            '                                             ',
            '                                             ',
            '                                             ',
            '                                             ',
            '                                             ',
            '                                             ',
            '                                             ',
            '           xxx      xxxxx      xxx           ',
            '                                             ',
            '                                             ',
            '                                             ',
            '    xxxxx  xxxx   xxxxxxxxx   xxxx  xxxxx    ',
            '                                             ',
            '                                             ',
            '                                             ',
            '                                             ',
            '                                             ',
            'ooooooooooooooooooooooooooooooooooooooooooooo',
        ];

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