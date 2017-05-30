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
// player1/2 is the sprite and ID1/2 is the selected character
var characterSelect = {
    player1: null,
    ID1: null,
    player2: null,
    ID2: null
};


var mainState = {

    preload: function() {

        // Logo
        this.load.image('logo', 'assets/ui/blockbattles.png');

        // Level Buttons
        this.load.spritesheet('aether', 'assets/ui/aether.png', 78, 18, 3);
        this.load.spritesheet('atlantis', 'assets/ui/atlantis.png', 100, 18, 3);
        this.load.spritesheet('flatland', 'assets/ui/flatland.png', 104, 18, 3);

        //Backgrounds
        this.load.image('Aether', 'assets/backgrounds/Aether.png');
        this.load.image('Desert', 'assets/backgrounds/Desert.png');
        this.load.image('Flatlands', 'assets/backgrounds/Flatlands.png');

        // Scripts
        this.load.script('BlurX', 'js/Script/BlurX.js');
        this.load.script('BlurY', 'js/Script/BlurY.js');

    },

    create: function() {

        // Scaling
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.maxWidth = this.scale.Exact_fit;
        this.scale.maxHeight = this.scale.Exact_fit;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.setScreenSize = true;

        // Stage background color
        this.stage.backgroundColor = '#56abec';

        this.backgroundImageCreate();

        // Create the inputs
        this.inputCreate();

        // Create the main menu
        this.mainMenu();

        // Keyboard shortcuts to start the game
        this.keyboardShorts();

    },

    update: function() {

        // Animate the logo
        this.logoAnimate();
        this.logo.scale.setTo(this.logoAnimateScale, this.logoAnimateScale);

    },

    /** Create Functions
     * **/

    inputCreate: function() {

        this.pad1 = this.input.gamepad.pad1;
        this.pad2 = this.input.gamepad.pad2;

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
        options.controls.player1.block = this.keyboardKey.R;
        options.controls.player2.left = this.keyboardKey.J;
        options.controls.player2.right = this.keyboardKey.L;
        options.controls.player2.up = this.keyboardKey.I;
        options.controls.player2.down = this.keyboardKey.K;
        options.controls.player2.attack1 = this.keyboardKey.U;
        options.controls.player2.attack2 = this.keyboardKey.O;
        options.controls.player2.block = this.keyboardKey.P;

        // Add the sprites and ID to the characterSelect var **TEMPORARY**
        characterSelect.player1 = 'player1';
        characterSelect.player2 = 'player2';
        characterSelect.ID1 = 1;
        characterSelect.ID2 = 2;

    },

    mainMenu: function () {

        // Create function for the main menu

        // Logo
        this.logo = this.add.image( this.world.centerX, 60, 'logo');
        this.logo.anchor.x = .5;
        this.logo.anchor.y = .5;
        this.logo.scale.setTo(5, 5);

        this.logoAnimateScale = 5;
        this.logoAnimateScaleChange = true;

        // Create the buttons
        this.buttonCreate();

    },

    backgroundImageCreate: function () {

        var X = Math.random()*10;

        if (X < 4)
            this.backgroundImage = this.add.tileSprite(0, 0, 960, 540, 'Aether');
        else if (X < 7)
            this.backgroundImage = this.add.tileSprite(0, 0, 960, 540, 'Flatlands');
        else
            this.backgroundImage = this.add.tileSprite(0, 0, 960, 540, 'Desert');

        var blurX = game.add.filter('BlurX');
        var blurY = game.add.filter('BlurY');

        blurX.blur = 8;
        blurY.blur = 8;

        this.backgroundImage.filters = [blurX, blurY];

    },

    keyboardShorts: function() {
        // Keyboard shortcuts to start the game

        this.keyboardKey.enter.onDown.add(function () {
            levelDecide = 1;
            game.state.start('playState');
        }, this);

        this.keyboardKey.backspace.onDown.add(function () {
            levelDecide = 2;
            game.state.start('playState');
        }, this);

        this.keyboardKey.home.onDown.add(function () {
            levelDecide = 3;
            game.state.start('playState');
        }, this);
    },

    buttonCreate: function () {

        /** Add all the sub buttons and add them to their specific groups
         * **/
        // Play buttons
        this.aether = this.add.button(900, this.world.centerY - 48, 'aether', function () {
            levelDecide = 1;
            game.state.start('playState');
        }, this, 1, 0, 2, 0);
        this.aether.anchor.x = 1;
        this.aether.scale.setTo(2,2);

        this.atlantis = this.add.button(900, this.world.centerY, 'atlantis', function () {
            levelDecide = 2;
            game.state.start('playState');
        }, this, 1, 0, 2, 0);
        this.atlantis.anchor.x = 1;
        this.atlantis.scale.setTo(2,2);

        this.flatland = this.add.button(900, this.world.centerY + 48, 'flatland', function () {
            levelDecide = 3;
            game.state.start('playState');
        }, this, 1, 0, 2, 0);
        this.flatland.anchor.x = 1;
        this.flatland.scale.setTo(2,2);
    },

    /** Animations
     * **/

    logoAnimate: function () {

        // Change the size of the logo
        if (this.logoAnimateScaleChange === true)
            this.logoAnimateScale += 0.005;
        else
            this.logoAnimateScale -= 0.005;

        // Decide whether to increase or decrease the logo's size
        if (this.logoAnimateScale >= 5.2)
            this.logoAnimateScaleChange = false;
        else if (this.logoAnimateScale <= 4.8)
            this.logoAnimateScaleChange = true;

    },

    /** Graphics
     * **/

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

    /** Debug
     * **/

    debug: function () {

        for (var prop in this.keyboardKey) {
            console.log("keybordKey" + prop + " = " + this.keyboardKey[prop]);
        }
    }
};


/** Initialize Phaser
 * and create a 960px by 640px game **/
var game = new Phaser.Game(960, 540, Phaser.AUTO, 'Stage', null, false, false);

// Add the 'mainState' and call it 'main'
game.state.add('mainState', mainState);
game.state.add('playState', playState); 

// Start the state to actually start the game
game.state.start('mainState');