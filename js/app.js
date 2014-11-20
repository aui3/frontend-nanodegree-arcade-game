// Enemies our player must avoid bug is 100x 70
var INITIAL_X_PLAYER=200;
var INITIAL_Y_PLAYER=400;
var STEP_Y=80;
var STEP_X=95;
var PLAYER_HEIGHT=80;
var PLAYER_WIDTH=75;
var BUG_HEIGHT=70;
var BUG_WIDTH=101;
var BLOCK_HEIGHT=80;//height of block elements of the map
var SLIDE_PLAYER_X=15;//the actual player image starts after 15 pixels to the right horizontally
var SLIDE_PLAYER_Y=75;//the actual player image starts after 75 pixels down vertically 


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
    ctx.rect(this.x,(this.y+75),101,70);/* PLAYER_WIDTH, PLAYER_HEIGHT);*/
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player=function(x,y){
    this.x=x;
    this.y=y;
    this.sprite='images/char-cat-girl.png';

}
Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
     //r1 = {
//      top: // The y-value of the top of the rectangle
//      bottom: // the y-value of the bottom of the rectangle
//      right: // the x-value of the right side of the rectangle
//      left: // the x-value of the left side of the rectangle
// };
    bug={
         'top':   allEnemies[0].y+75,
         'bottom': allEnemies[0].y+75+70,
         'right': allEnemies[0].x+101,
         'left': allEnemies[0].x

    };
    player1={
         'top':   this.y+60,
         'bottom': this.y+60+80,
         'right': this.x+15+75,
         'left': this.x+15

    };
    if(!(player1.left>(bug.right-10) || player1.right < (bug.left+10) ||player1.top>(bug.bottom-10) || player1.bottom <(bug.top+10)))
    {
        this.x=INITIAL_X_PLAYER;
        this.y=INITIAL_Y_PLAYER;

    }


    //ctx.rect(this.x,(this.y+75),101,70); bug
    //ctx.rect(this.x+15,(this.y+60),75,80);player
    /*bugRectangle=[
                    [allEnemies[0].x,(allEnemies[0].y+75)],//topleft
                    [(allEnemies[0].x+101),(allEnemies[0].y+75)],//topright
                    [(allEnemies[0].x+101), (allEnemies[0].y+75+70)],//bottpmright
                    [allEnemies[0].x,(allEnemies[0].y+70+75)]//bottomleft
                ];//topleft,topright,bottomright,bottomleft
    playerRectangle=[
                        [(this.x+15),(this.y+60)],
                        [(this.x+15+75),(this.y+60)],
                        [(this.x+15+75),(this.y+60+80)],
                        [(this.x+15),(this.y+60+80)]
                    ];
    //checkCollision(bugRectangle,playerRectangle);
    if(playerRectangle[0][0]<bugRectangle[2][0] && playerRectangle[0][0]>bugRectangle[3][0] ){
            if(playerRectangle[0][1]>bugRectangle[0][1] && playerRectangle[0][1]<bugRectangle[3][1]){

                //inital
                 this.x=INITIAL_X_PLAYER;
                thhis.y=INITIAL_Y_PLAYER;
            }

    }
//scenario 4 
    if(playerRectangle[1][0]<bugRectangle[2][0] && playerRectangle[1][0]>bugRectangle[3][0] ){
            if(playerRectangle[1][1]>bugRectangle[0][1] && playerRectangle[1][1]<bugRectangle[3][1]){
                 this.x=INITIAL_X_PLAYER;
                this.y=INITIAL_Y_PLAYER;    
                //inital
            }

    }*/
                    /*
    var pendx=this.x+PLAYER_WIDTH;
    var pendy=this.y+PLAYER_HEIGHT;
    var bendx=allEnemies[0].x+BUG_WIDTH;
    var bendy=allEnemies[0].y+BUG_HEIGHT;
    

    if (bendx<pendx && bendx>this.x){//top right of bug between top left and top right of player
        if(bendy<pendy && bendy>this.y){//bottom right of bug(bendx,bendy) is inside player rect
            this.x=INITIAL_X_PLAYER;
            this.y=INITIAL_Y_PLAYER;   
        }
        if(allEnemies[0].y>this.y && allEnemies[0].y<pendy){//top right of bug inside
            this.x=INITIAL_X_PLAYER;
            this.y=INITIAL_Y_PLAYER;

        }
    }
    if(allEnemies[0].x<pendx && allEnemies[0].x>this.x){//left edge of bug inside  player
        if(bendy<pendy && bendy>this.y){//bottom left of bug
            this.x=INITIAL_X_PLAYER;
            this.y=INITIAL_Y_PLAYER;

        }
        if(allEnemies[0].y<pendy && allEnemies[0].x>this.y){//top leftt og buy
                this.x=INITIAL_X_PLAYER;
            this.y=INITIAL_Y_PLAYER;

        }


    }   */
    /*if ( (allEnemies[0].x<this.x)  && (this.x<=(allEnemies[0].x+101)) && (allEnemies[0].y<this.y && this.y<(allEnemies[0].y+71))){
        //alert("collision");
        this.x=INITIAL_X_PLAYER;
        this.y=INITIAL_Y_PLAYER;
    }*/
    
    //bug is up
    /*if(   (this.y<bendy && bendy<pendy) && (bendx>this.x && bendx <pendx)    ){
        this.x=INITIAL_X_PLAYER;
        this.y=INITIAL_Y_PLAYER;
    }
    if (this.y==allEnemies[0].y)
    {
        this.x=INITIAL_X_PLAYER;
        this.y=INITIAL_Y_PLAYER;

    }*/
    


}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    
    ctx.rect(this.x+15,(this.y+60),75,80);/* PLAYER_WIDTH, PLAYER_HEIGHT);*/
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();
}
Player.prototype.handleInput = function(keycode) {

    var newpos;
    //ensure that the player stays in bound
    if (keycode=='up')
    {
        newpos=this.y-STEP_Y;
        if(newpos>=BLOCK_HEIGHT){//top block is river
            this.y=newpos;
        }
        else {
            this.y=BLOCK_HEIGHT;
        }
    }
    if (keycode=='down')
    {
       newpos=this.y+STEP_Y;
        if(newpos<=INITIAL_Y_PLAYER){
            this.y=newpos;
        }
        else {
            this.y=INITIAL_Y_PLAYER;
        }
    }
    if (keycode=='left')
    {
        newpos=this.x-STEP_X;
        if(newpos>=0){
            this.x=newpos;
        }
        //else {
          //  this.x=-SLIDE_PLAYER_X;
        //} 
    }
    if (keycode=='right')
    {
        newpos=this.x+STEP_X;
        if((newpos+SLIDE_PLAYER_X +PLAYER_WIDTH)<=505){//incorpotate for the point where the actual image starts
            this.x=newpos;
        }
        //else{
          //  this.x=505- PLAYER_WIDTH-SLIDE_PLAYER_X;
        //}

        
    }

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player= new Player(INITIAL_X_PLAYER,INITIAL_Y_PLAYER);
//var player= new Player(0,0);
var allEnemies= [];
//var enemy= new Enemy(0,0);
//var enemy1= new Enemy(100,0);
//var enemy= new Enemy(0,65);
var enemy1= new Enemy(0,145);
//var enemy2= new Enemy(0,70);
//var enemy3=new Enemy(0,140)


//allEnemies.push(enemy);
allEnemies.push(enemy1);
//allEnemies.push(enemy2);
//allEnemies.push(enemy3);






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

clickLocations = [];

function logClicks(x,y) {
  clickLocations.push(
    {
      "x": x,
      "y": y
    }
  );
  console.log("x location: " + x + "; y location: " + y);
}


$(document).click(function(loc){
    logClicks(loc.pageX,loc.pageY);
    });