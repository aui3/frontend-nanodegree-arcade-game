// Enemies our player must avoid
var INITIAL_X_PLAYER=200;
var INITIAL_Y_PLAYER=435;
var STEP=75;
var PLAYER_HEIGHT=171;
var PLAYER_WIDTH=101;

var Enemy = function(x,y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x=x;
    this.y=y;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x+=5;
    if (this.x>=CANVAS_WIDTH) {
        this.x=0;
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player=function(x,y){
    this.x=x;
    this.y=y;
    this.sprite='images/char-pink-girl.png';

}
Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (allEnemies[0].x==this.x && allEnemies[0].y==this.y){
        //alert("collision");
        this.x=INITIAL_X_PLAYER;
        this.y=INITIAL_Y_PLAYER;
    }

}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
Player.prototype.handleInput = function(keycode) {

    var newpos;
    //ensure that the player stays in bound
    if (keycode=='up')
    {
        newpos=this.y-STEP;
        if(newpos>=0){
            this.y=newpos;
        }
        else {
            this.y=0;
        }
    }
    if (keycode=='down')
    {
       newpos=this.y+STEP;
        if(newpos<=INITIAL_Y_PLAYER){
            this.y=newpos;
        }
        else {
            this.y=INITIAL_Y_PLAYER;
        }
    }
    if (keycode=='left')
    {
        newpos=this.x-STEP;
        if(newpos>=0){
            this.x=newpos;
        }
        else {
            this.x=0;
        }
    }
    if (keycode=='right')
    {
        newpos=this.x+STEP;
        if((newpos +PLAYER_WIDTH)<=505){
            this.x=newpos;
        }
        else{
            this.x=505- PLAYER_WIDTH;
        }

        
    }

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player= new Player(INITIAL_X_PLAYER,INITIAL_Y_PLAYER);
var allEnemies= [];
var enemy= new Enemy(30,60);
allEnemies.push(enemy);



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
