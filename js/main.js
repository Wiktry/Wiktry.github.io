// Keeps the information on which level to load
var levelDecide;

// Create the 'mainState' that loads the game and contains the startup menu
var mainState = {
    preload: function() {
        // This function will be executed at the beginning     
        // That's where we load the images and sounds
        
        this.load.atlas('playButton', 'assets/SpriteSheets/playButton.png', 'assets/SpriteSheets/playButton.json', Phaser.Loader.TEXTURE_LOADER_JSON_HASH);
        this.load.atlas('optionsButton', 'assets/SpriteSheets/optionsButton.png', 'assets/SpriteSheets/optionsButton.json', Phaser.Loader.TEXTURE_LOADER_JSON_HASH);
        this.load.image('logo', 'assets/SingleSprites/logo.png');
        this.load.image('mainMenuBack', 'assets/SingleSprites/mainMenuBack.png');
        
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
        
        // Main menu background
        this.mainMenuBack = this.add.image(this.world.centerX - 240, this.world.centerY - 135, 'mainMenuBack');
        
        // Button to start the game
        this.playButton = this.add.button(this.world.centerX - 35.5, this.world.centerY - 26, 'playButton', this.playButtonClick, this, 'PlayButtonHoover.png', 'PlayButton.png', 'PlayButtonHoover.png');
        
        // Options button
        this.optionsButton = this.add.button(this.world.centerX - 55, this.world.centerY + 26, 'optionsButton', this.playButtonClick, this, 'optionsButtonHoover.png', 'optionsButton.png', 'optionsButtonHoover.png');
        
        // Logo
        this.logo = this.add.image(this.world.centerX -121, this.world.centerY - 80, 'logo');
        
        // Enable the keyboard
        this.enter = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.backspace = this.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
        this.home = this.input.keyboard.addKey(Phaser.Keyboard.HOME);
        
    },
    
    update: function() {
        // This function is called 60 times per second    
        // It contains the game's logic
        
        // Keyboard shortcuts to start the game
        this.keyboardShorts();
        
    },
    
    keyboardShorts: function() {
        // Keyboard shortcuts to start the game
        
        if(this.enter.isDown){
            levelDecide = 1;
            this.playButtonClick();
        }
        if(this.backspace.isDown){
            levelDecide = 2;
            this.playButtonClick();
        }
        if(this.home.isDown){
            levelDecide = 3;
            this.playButtonClick();
        }
    },
    
    playButtonClick: function() {
        // Changes to the 'playGame' state
        game.state.start('playState');
    },
    
    playButtonOver: function() {
        
    },
};

// Initialize Phaser, and create a 960px by 640px game
var game = new Phaser.Game(960, 540, Phaser.AUTO, 'Stage', null, false, false);

// Add the 'mainState' and call it 'main'
game.state.add('mainState', mainState);
game.state.add('playState', playState); 

// Start the state to actually start the game
game.state.start('mainState');