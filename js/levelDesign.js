/** Old Level Creator

 Create the level
/* Add every space is 20px another 30px is added to the left and right
/* Optimal size is 45 wide and 22 tall, the last five is for the restart block at the bottom
/* x = walls / o = enemies

        
// Level identifier '1'
var Aether = [
    '                                             ',// 0
    '                                             ',// 20
    '                                             ',// 40
    '                                             ',// 60
    '                                             ',// 80
    '                                             ',// 100
    '                                             ',// 120
    '                                             ',// 140
    '                   xxxxxxx                   ',// 160
    '    xxxxxxxxxx                 xxxxxxxxxx    ',// 180
    '                                             ',// 200
    '                                             ',// 220
    '           xxx      xxxxx      xxx           ',// 240
    '                                             ',// 260
    '                xx         xx                ',// 280
    '                                             ',// 300
    '    fffff  ffff   ee     ee   ffff  fffff    ',// 320
];

// Level identifier '2'
var Atlantis = [
    '                                             ',// 0
    '                                             ',// 20
    '                                             ',// 40
    '                                             ',// 60
    '                                             ',// 80
    '                                             ',// 100
    '                                             ',// 120
    '                                             ',// 140
    '                                             ',// 160
    '                                             ',// 180
    '          xxxx     xxxxxxx     xxxx          ',// 200
    '                                             ',// 220
    '                                             ',// 240
    '  xx                                     xx  ',// 260
    '                                             ',// 280
    '                                             ',// 300
    '    fffff  fff  ee  fffff  ee  fff  fffff    ',// 320
];

// Level identifier '3'
var Flatlands = [
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
    '                   xxxxxxx                   ',
    '    xxxxxxxxxx                 xxxxxxxxxx    ',
    '                                             ',
    '                                             ',
    '           xxx      xxxxx      xxx           ',
    '                                             ',
    '     xxxxxx     xx         xx     xxxxxx     ',
    '                                             ',
    'fffffffffffffffffffffffffffffffffffffffffffff',
];

function levelCreate(levelDecide, floors, platforms, jumpPads) {

    // Decide the the level to create and add it to 'levelToBuild'
    if (levelDecide == 1)
        this.levelToBuild = Atlantis;
    else if (levelDecide == 2)
        this.levelToBuild = Aether;
    else if (levelDecide == 3)
        this.levelToBuild = Flatlands;

    // I need to rebuild the whole block and either move it to another doc or
    // figure out a way of making it smaller
    // Gets the level info from 'levelDecide' and builds the right level
    // Creates the level
    for(var i = 0; i < this.levelToBuild.length; i++){
        for(var j = 0; j < this.levelToBuild[i].length; j++){

            // Create the floor
            if (this.levelToBuild[i][j] == 'f'){
                var floor = this.game.add.sprite(30+20*j, 30+20*i, 'lava');
                floors.add(floor);
                floor.body.immovable = true;
            }
            // Create the walls
            else if (this.levelToBuild[i][j] == 'x'){
                var wall = this.game.add.sprite(30+20*j, 30+20*i, 'wall');
                platforms.add(wall);
                wall.body.immovable = true;
            }
            // Create jumpPads
            else if (this.levelToBuild[i][j] == 'e'){
                var jumpPad = this.game.add.sprite(30+20*j, 30+20*i, 'jumpPad');
                jumpPads.add(jumpPad);
                jumpPad.body.immovable = true;
            }
        }
    }

};

**/

function levelCreate(levelDecide, floors, platforms, jumpPads) {

    var levelToBuild;

    if (levelDecide == 1)
        levelToBuild = level1;
    else if (levelDecide == 2)
        levelToBuild = level2;
    else if (levelDecide == 3)
        levelToBuild = level3;

    for (var i = 0; i < levelToBuild.length; i++ ) {

        var temp = levelToBuild[i].split('/');

        temp[0] = parseInt(temp[0]);
        temp[1] = parseInt(temp[1]);
        temp[2] = parseInt(temp[2]);

        for (var j = 0; j < temp[2]; j++) {

            // Create the floor
            if (temp[3] == 'f'){
                var floor = this.game.add.sprite(temp[0]+20*j, temp[1], 'platform');
                floors.add(floor);
                floor.body.immovable = true;
            }
            // Create the platforms
            else if (temp[3] == 'p'){
                var platform = this.game.add.sprite(temp[0]+20*j, temp[1], 'platform');
                platforms.add(platform);
                platform.body.immovable = true;
            }
            // Create jumpPads
            else if (temp[3] == 'j'){
                var jumpPad = this.game.add.sprite(temp[0]+20*j, temp[1], 'platform');
                jumpPads.add(jumpPad);
                jumpPad.body.immovable = true;
            }

        }
    }
}

// Platform format is [X/Y/Number/Type]
var level1 = ['52/293/4/f', '830/293/4/f', '259/365/2/j', '661/365/2/j', '360/340/12/f', '409/131/7/p'];
var level2 = ['535/405/7/f', '735/405/7/f', '5/405/21/f', '525/156/21/p', '385/300/7/p', '45/300/7/p', '214/189/7/p', '364/75/7/p'];
var level3 = ['0/378/48/f']