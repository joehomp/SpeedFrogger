/**
 * This class represents properties of any character
 * playing on the specific map created by the game engine.
 */
var MapCharacter = function () {
    this.x = 0;
    this.y = 0;
};

/** Used to reduce collision rectangle to prevent 'phantom'
 * collisions of the transparent image area. */
MapCharacter.prototype.collisionBuffer = 26;

// Various MapCharacter values that are intended constant for all MapCharacters.
MapCharacter.prototype.MAP_ROWS = 6;
MapCharacter.prototype.MAP_COLS = 5;
MapCharacter.prototype.X_START = 0;
MapCharacter.prototype.X_OFFSET = 101;
MapCharacter.prototype.Y_START = 45;
MapCharacter.prototype.Y_OFFSET = 83;
MapCharacter.prototype.CHAR_SIZE_X = 101;
MapCharacter.prototype.CHAR_SIZE_Y = 83;

/**
 * Get the Y pixel value for displaying a character
 * image in the specified row.
 *
 * @param rowNum        The 0-based row number.
 * @returns {number}    The y pixel offset to display a character image.
 */
MapCharacter.prototype.getYOffsetForRow = function (rowNum) {
    return this.Y_START + (rowNum * this.Y_OFFSET);
};

/**
 * Get the X pixel value for displaying a character
 * image in the specified column.
 *
 * @param colNum        The 0-based column number.
 * @returns {number}    The y pixel offset to display a character image.
 */
MapCharacter.prototype.getXOffsetForCol = function (colNum) {
    return this.X_START + (colNum * this.X_OFFSET);
};

/**
 * Get the character position and size for collision detections.  The
 * collision detection size is smaller than the actual image bounds to
 * ensure a good collision and avoid 'phantom' collisions in the
 * transparent regions of the image.
 *
 * @returns {{xPos: number, yPos: number, width: number, height: number}}
 */
MapCharacter.prototype.getCollisionDims = function () {
    var halfBuff = this.collisionBuffer / 2;
    var dims = {
        xPos: this.x + halfBuff,
        yPos: this.y + halfBuff,
        width: this.CHAR_SIZE_X - this.collisionBuffer,
        height: this.CHAR_SIZE_Y - this.collisionBuffer
    };
    return dims;
};

// --------------------- Enemy Class ------------------------

// Enemies our player must avoid
/**
 * Enemy is a MapCharacter that moves across the paved area of the board.
 *
 * @constructor
 */
var Enemy = function () {
    MapCharacter.call(this);

    // Establish initial enemy position
    this.reset();

    // The image/sprite for our enemies.
    this.sprite = 'images/enemy-bug.png';
};

/** Make Enemy a subclass of MapCharacter. */
Enemy.prototype = Object.create(MapCharacter.prototype);
Enemy.prototype.constructor = Enemy;

// Shared Enemy Constants
Enemy.prototype.MIN_SPEED = 75;
Enemy.prototype.MAX_SPEED = 320;

/**
 * Update the enemy's position.
 *
 * @param dt    Time delta since last update.
 */
Enemy.prototype.update = function (dt) {
    this.x += dt * this.speed;
    if (this.x > this.getXOffsetForCol(this.MAP_COLS) + this.X_OFFSET) {
        this.reset();
    }
};

/**
 * Draw the enemy on the screen.
 */
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), 0, 65, this.CHAR_SIZE_X, this.CHAR_SIZE_Y,
        this.x, this.y, this.CHAR_SIZE_X, this.CHAR_SIZE_Y);
};

/**
 * Reset an enemy to be reused for another attack.
 */
Enemy.prototype.reset = function () {
    this.x = this.X_START - this.X_OFFSET;
    this.y = this.getYOffsetForRow(Math.floor(Math.random() * (4 - 1)) + 1);
    this.speed = Math.random() * (this.MAX_SPEED - this.MIN_SPEED) + this.MIN_SPEED;
};


// --------------------- Player Class -----------------------

/**
 * Player is a MapCharacter that represents the users playing piece.
 *
 * @constructor
 */
var Player = function () {
    MapCharacter.call(this);

    this.reset();
    this.movingEnabled = true;
    this.sprite = 'images/char-boy.png';
};

/** Make Player a subclass of MapCharacter. */
Player.prototype = Object.create(MapCharacter.prototype);
Player.prototype.constructor = Player;

/** Reset the player to an initial starting state. */
Player.prototype.reset = function () {
    this.row = this.MAP_ROWS - 1;
    this.col = Math.floor(this.MAP_COLS / 2.0);
    this.x = this.getXOffsetForCol(this.col);
    this.y = this.getYOffsetForRow(this.row);
};

/** Update the player's screen position. */
Player.prototype.update = function () {
    // Update player position based on moves.
    this.x = this.getXOffsetForCol(this.col);
    this.y = this.getYOffsetForRow(this.row);
};

/** Render the layer at the current screen position. */
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), 0, 55, this.CHAR_SIZE_X, this.CHAR_SIZE_Y,
        this.x, this.y, this.CHAR_SIZE_X, this.CHAR_SIZE_Y);
};

/**
 * Enable/Disable the player's ability to move the character.
 *
 * @param shouldEnable  true to allow movement, false to prevent movement
 */
Player.prototype.enableMoves = function (shouldEnable) {
    this.movingEnabled = shouldEnable;
};

/**
 * Respond to requests to move the player via the keyboard.
 *
 * @param inputKey  {string} key indicating the key pressed.
 */
Player.prototype.handleInput = function (inputKey) {
    if (this.movingEnabled) {
        switch (inputKey) {
            case "left":
                console.log("LEFT");
                if (this.col > 0) {
                    this.col--;
                }
                break;
            case "right":
                console.log("RIGHT");
                if (this.col < (this.MAP_COLS - 1)) {
                    this.col++;
                }
                break;
            case "up":
                console.log("UP");
                if (this.row > 0) {
                    this.row--;
                }
                break;
            case "down":
                console.log("DOWN");
                if (this.row < (this.MAP_ROWS - 1)) {
                    this.row++;
                }
                break;
            default:
            // Unsupported input -> NO-OP
        }
    }
};

// --------------------- BonusItem Class -----------------------------

/**
 * This class is map item that gives the player bonus points when collected.
 *
 * @constructor
 */
var BonusItem = function () {
    MapCharacter.call(this);

    this.x = this.getXOffsetForCol(Math.floor(Math.random() * (this.MAP_COLS)));
    this.y = this.getYOffsetForRow(Math.floor(Math.random() * (3 - 1)) + 1);
    this.sprite = 'images/Gem Blue.png';
};

/** Inherit from MapCharacter. */
BonusItem.prototype = Object.create(MapCharacter.prototype);
BonusItem.prototype.constructor = BonusItem;

/** This item does not move or update any behavior. */
BonusItem.prototype.update = function () { };

/** Draw the bonus item at the item's location. */
BonusItem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), -50, 0, this.CHAR_SIZE_X * 2, this.CHAR_SIZE_Y * 2.5,
        this.x, this.y, this.CHAR_SIZE_X, this.CHAR_SIZE_Y);
};


// --------------------- Scoreboard Class -----------------------------

/**
 * The Scoreboard class is responsible for maintaining and
 * rendering the game time, game score and scoring messages
 * to the player.
 *
 * @constructor
 */
var Scoreboard = function () {
    this.score = 0;
    this.won = false;
    this.lost = false;
    this.bonus = false;
    this.currentTime = this.GAME_TIME;
    this.running = false;
    this.gameOver = false;

    player.enableMoves(false);
};

/** Indicates the gameplay duration. */
Scoreboard.prototype.GAME_TIME = 60;

/** Perform scoreboard updates as the game state changes. */
Scoreboard.prototype.update = function () {
    this.checkWinAndCollision();
};

/** Draw the scoreboard UI including the score, game time, and player messages. */
Scoreboard.prototype.render = function () {
    var oldStyle = ctx.fillStyle;

    if (this.score >= 0) {
        ctx.fillStyle = "white";
    } else {
        ctx.fillStyle = "red";
    }
    ctx.font = "20px serif";
    ctx.fillText('Score: ' + this.score.toString(), 10, 75);

    ctx.fillStyle = "white";
    ctx.font = "20px serif";
    ctx.fillText('Time: ' + this.currentTime.toString(), 420, 75);

    if (this.won) {
        ctx.font = "52px serif";
        ctx.fillStyle = "green";
        ctx.fillText('Success!', 165, 275);
    }

    if (this.bonus) {
        ctx.font = "52px serif";
        ctx.fillStyle = "green";
        ctx.fillText('Bonus!', 165, 275);
    }

    if (this.lost) {
        ctx.font = "52px serif";
        ctx.fillStyle = "red";
        ctx.fillText('Ouch!', 175, 275);
    }

    if (this.gameOver && !this.won && !this.lost) {
        ctx.font = "60px serif";
        ctx.fillStyle = "red";
        ctx.fillText('GAME OVER', 75, 275);
    }

    ctx.fillStyle = oldStyle;
};

/** This will start gameplay. */
Scoreboard.prototype.startGame = function () {
    this.running = true;
    this.currentTime = this.GAME_TIME;
    this.gameOver = false;
    for (var i = 0; i < 7; i++) { allEnemies.push(new Enemy()) }
    player.enableMoves(true);
    this.countdown();
    this.manageBonusItems();
};

/** Perform game ending activities. */
Scoreboard.prototype.handleGameOver = function () {
    this.running = false;
    player.enableMoves(false);
    player.reset();
    allEnemies.length = 0;
    bonusItems.length = 0;
    this.gameOver = true;
};

/**
 * This function provides the game clock functionality.
 * It manages an interval timer to countdown the remaining game time.
 */
Scoreboard.prototype.countdown = function () {
    var that = this;
    var intervalID = setInterval(function () {
        if(that.currentTime === 0) {
            clearInterval(intervalID);
            that.handleGameOver();
        } else {
            that.currentTime--;
        }
    }, 1000);
};

/** Check for scoring scenarios and take appropriate action. */
Scoreboard.prototype.checkWinAndCollision = function () {
    if(this.running) {
        // Either win, lose or do nothing
        if (player.row <= 0) {
            // 1) Check for reaching water - Win - Score!.
            this.won = true;
            this.score++;
            player.reset();
            player.enableMoves(false);
            this.endWinState();
        } else {
            // 2) Check for enemy collision - Lose - Negative Score!
            var playerDims = player.getCollisionDims();
            for (var i = 0; i < allEnemies.length; i++) {
                if (isCollision(playerDims, allEnemies[i].getCollisionDims())) {
                    this.score--;
                    this.lost = true;
                    player.reset();
                    player.enableMoves(false);
                    this.endLoseState();
                    break;
                }
            }

            // 3) Check for bonus collision - Bonus - Score!
            for (var i = 0; i < bonusItems.length; i++) {
                if (isCollision(playerDims, bonusItems[i].getCollisionDims())) {
                    this.score++;
                    this.bonus = true;
                    bonusItems.length = 0;
                    this.endBonusState();
                    break;
                }
            }
        }
    }
};

/** This function puts an end to the 'win' state after a small delay. */
Scoreboard.prototype.endWinState = function () {
    var that = this;
    setTimeout(function () {
        that.won = false;
        if(that.running) { player.enableMoves(true); }
    }, 750);
};

/** This function puts an end to the 'lose' state after a small delay. */
Scoreboard.prototype.endLoseState = function () {
    var that = this;
    setTimeout(function () {
        that.lost = false;
        if(that.running) { player.enableMoves(true); }
    }, 750);
};

/** This function puts an end to the 'bonus' state after a small delay. */
Scoreboard.prototype.endBonusState = function () {
    var that = this;
    setTimeout(function () {
        that.bonus = false;
    }, 500);
};

/** This function manages the appearance of bonus items in the game. */
Scoreboard.prototype.manageBonusItems = function () {
    var that = this;
    var intervalID = setInterval(function () {
        if(that.running) {
            bonusItems.length = 0;
            bonusItems.push(new BonusItem());
            setTimeout(function () {
                bonusItems.length = 0;
            }, 4000);
        } else {
            clearInterval(intervalID);
            bonusItems.length = 0;
        }
    }, 6000);
};

// ----------------- Global Functions ---------------------------------------

/**
 * This function simply returns true if there is any intersection of the two rectangles.
 *
 * @param rect1 The first rectangle.
 * @param rect2 The second rectangle.
 * @returns {boolean}   true if the rectangles intersect, false otherwise.
 */
var isCollision = function (rect1, rect2) {
    var noIntersectionX = rect1.xPos > (rect2.xPos + rect2.width) || rect1.xPos < (rect2.xPos - rect1.width);
    var noIntersectionY = rect1.yPos > (rect2.yPos + rect2.height) || rect1.yPos < (rect2.yPos - rect1.height);
    return !noIntersectionX && !noIntersectionY
};

// --------------------------------------------------------------------------


// Create our gameplay objects in global variables to interact with our gameplay engine.

player = new Player();
scoreboard = new Scoreboard();
otherItems = [scoreboard];
bonusItems = [];  // Items created at runtime.
allEnemies = [];  // Items created at runtime (game start).

/** This listens for key presses and sends the keys to the Player.handleInput() method. */
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
