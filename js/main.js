// Variables that needs to be persistent

// Keeps the information on which level to load
var levelDecide;

// Options object - big ugly thing
var options = {
    controls: {
        player1: {
            up: null,
            down: null,
            left: null,
            right: null,
            attack1: null,
            attack2: null,
            block: null,
        },
        player2: {
            up: null,
            down: null,
            left: null,
            right: null,
            attack1: null,
            attack2: null,
            block: null,
        }
    },
    screenSize: {
        x800y600: {
            x: 800,
            y: 600,
        },
        x1920y1080: {
            x: 1920,
            y: 1080,
        }
    },
    volume: {
        master: 0,
        music: 0,
        effects: 0,
        voice: 0,
    }
};

// The players chosen character
var characterSelect = {
    player1: null,
    ID1: null,
    player2: null,
    ID2: null
};

// All the different main menu tabs and items, they need to be s I can create and delete them in different functions
var menuTabs = {
    play: null,
    options: null,
    credits: null,
};



// Create the 'mainState' that loads the game and contains the startup menu
var mainState = {
    preload: function() {
        // This function will be executed at the beginning
        // That's where we load the images and sounds

        /**
        this.load.spritesheet('playButton', 'assets/menuButtons/finishedButtons/play.png', 230, 24, 2);
        this.load.spritesheet('optionsButton', 'assets/menuButtons/finishedButtons/options.png', 230, 24, 2);
         **/

        // Logo
        this.load.image('logo', 'assets/words/image/blockbattles.png');

        // Main menu buttons
        this.load.spritesheet('playButton', 'assets/words/spritesheet/play.png', 54, 18, 3);
        this.load.spritesheet('optionsButton', 'assets/words/spritesheet/options.png', 86, 18, 3);
        this.load.spritesheet('creditsButton', 'assets/words/spritesheet/credits.png', 84, 18, 3);
        this.load.spritesheet('exitButton', 'assets/words/spritesheet/exit.png', 48, 18, 3);

        // Level Buttons
        this.load.spritesheet('aether', 'assets/words/spritesheet/aether.png', 78, 18, 3);

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
        this.stage.backgroundColor = '#56abec';

        // Create the inputs
        this.inputCreate();

        // Create the main menu
        this.mainMenu();

    },

    update: function() {
        // This function is called 60 times per second
        // It contains the game's logic

        // Keyboard shortcuts to start the game
        this.keyboardShorts();

    },

    inputCreate: function() {

        // Add the keyboard Keys
        this.keyboardKey = keyBinding(null, true);

        // Add the cursor Keys
        this.cursors = keyBinding(true, null);

        // Add input to the options object **TEMPORARY**
        options.controls.player1.left = this.keyboardKey.A;
        options.controls.player1.right = this.keyboardKey.D;
        options.controls.player1.up = this.keyboardKey.W;
        options.controls.player1.down = this.keyboardKey.S;
        options.controls.player1.attack1 = this.keyboardKey.Q;
        options.controls.player1.attack2 = this.keyboardKey.E;
        options.controls.player2.left = this.keyboardKey.J;
        options.controls.player2.right = this.keyboardKey.L;
        options.controls.player2.up = this.keyboardKey.I;
        options.controls.player2.down = this.keyboardKey.K;
        options.controls.player2.attack1 = this.keyboardKey.U;
        options.controls.player2.attack2 = this.keyboardKey.O;

        // Add the sprites and ID to the characterSelect var **TEMPORARY**
        characterSelect.player1 = 'player1';
        characterSelect.player2 = 'player2';
        characterSelect.ID1 = 1;
        characterSelect.ID2 = 1;

    },


    // Create functions for the different menus


    // Create function for the main menu
    mainMenu: function () {

        // Main menu background
        // this.mainMenuBack = this.add.image(this.world.centerX - 240, this.world.centerY - 135, 'mainMenuBack');

        // Logo
        this.logo = this.add.image( 60, 60, 'logo');
        this.logo.scale.setTo(2.5, 2.5);

        // Create the buttons
        this.buttonCreate();

        // Draw the menu graphics
        this.drawMenuGraphics();
    },

    keyboardShorts: function() {
        // Keyboard shortcuts to start the game

        if(this.keyboardKey.enter.isDown){
            levelDecide = 1;
            game.state.start('playState');
        }
        if(this.keyboardKey.backspace.isDown){
            levelDecide = 2;
            game.state.start('playState');
        }
        if(this.keyboardKey.home.isDown){
            levelDecide = 3;
            game.state.start('playState');
        }
    },

    // Create all the menu buttons
    buttonCreate: function () {

        // Create the menu buttons
        if (this.playButton == null)
            this.playButton = this.add.button(60, this.world.centerY - 48, 'playButton', this.playButtonClick, this, 1, 0, 2, 0);

        if (this.optionsButton == null)
            this.optionsButton = this.add.button(60, this.world.centerY - 0, 'optionsButton', this.optionsButtonClick, this, 1, 0, 2, 0);

        if (this.creditsButton == null)
            this.creditsButton = this.add.button(60, this.world.centerY + 48, 'creditsButton', this.creditsButtonClick, this, 1, 0, 2, 0);

        if (this.exitButton == null)
            this.exitButton = this.add.button(60, this.world.centerY + 96, 'exitButton', this.exitButtonClick, this, 1, 0, 2, 0);

        // Scale up the buttons
        this.playButton.scale.setTo(2,2);
        this.optionsButton.scale.setTo(2,2);
        this.creditsButton.scale.setTo(2,2);
        this.exitButton.scale.setTo(2,2);
    },

    buttonDestroy: function () {

        if (this.playButtonMenu != null)
            this.playButtonMenu.destroy();

    },

    playButtonClick: function() {

        this.buttonDestroy();

        this.playButtonMenu = {
            aether: this.add.button(900-156, this.world.centerY - 48, 'aether', this.playButtonClick, this, 1, 0, 2, 0),
            atlantis: this.add.button(),
            flatlands: this.add.button(),
        }

        this.playButtonMenu.aether.scale.setTo(2,2);
    },

    optionsButtonClick: function () {

    },

    creditsButtonClick: function () {

    },

    exitButtonClick: function () {

    },

    drawMenuGraphics: function () {

        // Create graphics
        this.graphics = this.add.graphics(0, 0);
        this.graphics.beginFill(0xFF3300);

        // Create the menu box on the right side
        this.graphics.moveTo(480, 0);
        this.graphics.lineTo(960, 0);
        this.graphics.lineTo(960, 600);
        this.graphics.lineTo(480, 600);
    },

    debug: function () {

        for (var prop in this.keyboardKey) {
            console.log("keybordKey" + prop + " = " + this.keyboardKey[prop]);
        }
    }
};

// Initialize Phaser, and create a 960px by 640px game
var game = new Phaser.Game(960, 540, Phaser.AUTO, 'Stage', null, false, false);

// Add the 'mainState' and call it 'main'
game.state.add('mainState', mainState);
game.state.add('playState', playState); 

// Start the state to actually start the game
game.state.start('mainState');