// Initialize Phaser, and create a 960px by 640px game
var game = new Phaser.Game(960, 540);

var mainState = {
    preload: function() {
        // This function will be executed at the beginning     
        // That's where we load the images and sounds
        
        this.load.image();
    },
    
    create: function() {
        // This function is called after the preload function     
        // Here we set up the game, display sprites, etc.
        
    
        
    },
    
    update: function() {
        // This function is called 60 times per second    
        // It contains the game's logic
        
    },
};

// Create our 'main' state that will contain the game
var levelAtlantis = {
    preload: function() { 
        
        this.load.image('player', 'assets/player.png');
        this.load.image('wall', 'assets/wall.png');
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
        
        this.playerCreate();
        
        this.wallsCreate();
        
    },

    update: function() {
        
        // Display the fps counter
        game.debug.text(game.time.fps, 2, 14, "#00ff00");
        
        // Add collision betwen the player and the ground (walls)
        this.physics.arcade.collide(this.player, this.walls);
        
        // Player movement
        this.playerMove();
    },
    
    playerCreate: function() {
        
        // Add the player sprite
        this.player = this.add.sprite(70, 100, 'player');
        
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
        
        // Add the walls group
        this.walls = game.add.group();
        
        // Create the level Atlantis
        // Add every space is 20px another 30px is added to the left and right
        // Optimal size is 45 wide and 22 tall
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
        ];

        for(var i = 0; i < Atlantis.length; i++){
            for(var j = 0; j < Atlantis[i].length; j++){
        
                // Create the walls
                if (Atlantis[i][j] == 'x'){
                    var wall = this.game.add.sprite(30+20*j, 30+20*i, 'wall');
                    this.walls.add(wall);
                    wall.body.immovable = true;
                }           
            }
        }
    },
};

// Add the 'mainState' and call it 'main'
game.state.add('levelAtlantis', levelAtlantis); 

// Start the state to actually start the game
game.state.start('levelAtlantis');