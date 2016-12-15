/**
 * Created by General on 2016-12-09.
 */

function keyBinding(cursor, keyboard) {

    // Add the cursor keys
    if (cursor != null) {
        this.cursors = game.input.keyboard.createCursorKeys();

        return this.cursors;
    }
    else if (keyboard != null) {
        // Add the necessary keyboard keys
        this.keyboardKey = {
            // Add letters
            A: game.input.keyboard.addKey(Phaser.Keyboard.A),
            B: game.input.keyboard.addKey(Phaser.Keyboard.B),
            C: game.input.keyboard.addKey(Phaser.Keyboard.C),
            D: game.input.keyboard.addKey(Phaser.Keyboard.D),
            E: game.input.keyboard.addKey(Phaser.Keyboard.E),
            F: game.input.keyboard.addKey(Phaser.Keyboard.F),
            G: game.input.keyboard.addKey(Phaser.Keyboard.G),
            H: game.input.keyboard.addKey(Phaser.Keyboard.H),
            I: game.input.keyboard.addKey(Phaser.Keyboard.I),
            J: game.input.keyboard.addKey(Phaser.Keyboard.J),
            K: game.input.keyboard.addKey(Phaser.Keyboard.K),
            L: game.input.keyboard.addKey(Phaser.Keyboard.L),
            M: game.input.keyboard.addKey(Phaser.Keyboard.M),
            N: game.input.keyboard.addKey(Phaser.Keyboard.N),
            O: game.input.keyboard.addKey(Phaser.Keyboard.O),
            P: game.input.keyboard.addKey(Phaser.Keyboard.P),
            Q: game.input.keyboard.addKey(Phaser.Keyboard.Q),
            R: game.input.keyboard.addKey(Phaser.Keyboard.R),
            S: game.input.keyboard.addKey(Phaser.Keyboard.S),
            T: game.input.keyboard.addKey(Phaser.Keyboard.T),
            U: game.input.keyboard.addKey(Phaser.Keyboard.U),
            V: game.input.keyboard.addKey(Phaser.Keyboard.V),
            W: game.input.keyboard.addKey(Phaser.Keyboard.W),
            X: game.input.keyboard.addKey(Phaser.Keyboard.X),
            Y: game.input.keyboard.addKey(Phaser.Keyboard.Y),
            Z: game.input.keyboard.addKey(Phaser.Keyboard.Z),

            // Add special Keys
            enter: game.input.keyboard.addKey(Phaser.Keyboard.ENTER),
            backspace: game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE),
            home: game.input.keyboard.addKey(Phaser.Keyboard.HOME),
        };

        return this.keyboardKey;
    }
};

function keyRebinding(keyToRebind, currentKey) {

};