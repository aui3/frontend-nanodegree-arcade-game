// Enemies our player must avoid bug is 100x 70
var CANVAS_WIDTH=505;

var BLOCK_HEIGHT=80;//height of each element (grass,water,block/road) in the map


var STEP_Y=80;//move 80 px vertically across the canvas
var STEP_X=95;//move 95 pixels horizontally across the canvas


var BUG_HEIGHT=70;
var BUG_WIDTH=101;
var BUG_SPEED =[3,4,2]; //randomly choose bug speeds from this array
var MAX_BUGS=3;
var SLIDE_BUG_Y=75;//the actual player image starts after 75 pixels down vertically 

var SCORE=0;
var LIVES=3;
var PAUSED=true;
//initial position of player
var INITIAL_X_PLAYER=200;
var INITIAL_Y_PLAYER=400;
var PLAYER_HEIGHT=80;
var PLAYER_WIDTH=75;
var SLIDE_PLAYER_X=15;//the actual player image starts after 15 pixels to the right horizontally
var SLIDE_PLAYER_Y=60;//the actual player image starts after 75 pixels down vertically 
var GAME_OVER=false;

//Gems
var MAX_GEMS=3;
var GEM_COLORS=['Blue','Green','Orange'];
var GEM_WIDTH=101;
var GEM_Y_LOCATIONS=[25+BLOCK_HEIGHT,110+BLOCK_HEIGHT,190+BLOCK_HEIGHT];//possible locations where the gems can be


var allEnemies= [];
var allGems=[];

//Timer for game loop
var timerLoop=10;//set at 30 sec

var Enemy = function(x,y,speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x=x;
    this.y=y;
    this.speed=speed;
    
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    
    
    if (!PAUSED) this.x+=this.speed;
    
    if (this.x>=CANVAS_WIDTH) {
        this.x=0; // reset enemy to the left of the canvas
        //generate a random number between 0 and 3 to decide what row the bug re-appears from
        var rand1=generateRandom(3,0);//Math.floor(Math.random() *3 + 0);
        if (rand1==0) this.y=65;
        if (rand1==1) this.y=145;
        if (rand1==2) this.y=225;
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    
    if(!GAME_OVER)
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    /*ctx.rect(this.x,(this.y+75),101,70);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();*/
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
    
    /*Format for defining the bounding rectangle for player and bug
        r1 = {
        top:  The y-value of the top of the rectangle
        bottom:  the y-value of the bottom of the rectangle
        right: the x-value of the right side of the rectangle
        left:  the x-value of the left side of the rectangle
    };*/
    player1= {
         'top':   this.y+SLIDE_PLAYER_Y,
         'bottom': this.y+SLIDE_PLAYER_Y+PLAYER_HEIGHT,
         'right': this.x+SLIDE_PLAYER_X+PLAYER_WIDTH,
         'left': this.x+SLIDE_PLAYER_X
    };
    //loop through all bugs
    for (enemyBug in allEnemies){
        bug={
             'top':   allEnemies[enemyBug].y+SLIDE_BUG_Y,
             'bottom': allEnemies[enemyBug].y+SLIDE_BUG_Y+BUG_HEIGHT,
             'right': allEnemies[enemyBug].x+BUG_WIDTH-20,
             'left': allEnemies[enemyBug].x+20
        };

        if(!(player1.left>(bug.right-10) || player1.right < (bug.left+10) ||player1.top>=(bug.bottom-10) || player1.bottom <=(bug.top+10))) {
            //reset to initial player position
            this.x=INITIAL_X_PLAYER;
            this.y=INITIAL_Y_PLAYER;
             //decrease life hearts
            LIVES=LIVES-1;
            //$(".life1:last").hide();
            $(".life").find(":visible:last").hide();
            if (LIVES==0){

                PAUSED=true;
                //ctx.drawImage(Resources.get('images/gameover.png'),0,0);
                $("#restartStartButton").prop("disabled",false);
                $("#pausePlayButton").prop("disabled",true);
                GAME_OVER=true;

            }
            
        }
    }

    //Gem Collision
    //loop through all gems

    for (gem in allGems){
        //console.log("collision");    

        gem1={
             'top':   allGems[gem].y+40,//adjust for start for gem image..25
             'bottom': allGems[gem].y+80,//block height is gem height..so if player is in that block
             'right': allGems[gem].x+GEM_WIDTH,
             'left': allGems[gem].x
        };
        if(allGems[gem].visible){
            if(!(player1.left>(gem1.right) || player1.right < (gem1.left) ||player1.top>(gem1.bottom) || player1.bottom <(gem1.top))) {
                //console.log("collision");    
               //increase score
                SCORE++;

                //UPDATE SCORE
                $("#score").html('<p>'+SCORE+'</p>');
                //hide gem
                allGems[gem].visible=false;
                

                //if (LIVES==0) ctx.drawImage('images/gameover1.png',0,0);
            }
        }
    }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    //if (LIVES==0) ctx.drawImage(Resources.get('images/gameover.png'),0,0);
    /*
    ctx.rect(this.x+15,(this.y+60),75,80);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();*/
}
Player.prototype.handleInput = function(keycode) {

    var newpos;
    if(!PAUSED){
        //ensure that the player stays in bound
        switch (keycode) {
            case 'up':
                newpos=this.y-STEP_Y;
                this.y= (newpos>BLOCK_HEIGHT) ? newpos : BLOCK_HEIGHT;
                break;
            case 'down':
                newpos=this.y+STEP_Y;
                this.y= (newpos<=INITIAL_Y_PLAYER) ? newpos : INITIAL_Y_PLAYER;  
                break;
            case 'left':
                newpos=this.x-STEP_X;
                if(newpos>=0) this.x=newpos;
                break;
            case 'right':
                newpos=this.x+STEP_X;
                //incorpotate for the point where the actual image starts
                if((newpos+SLIDE_PLAYER_X +PLAYER_WIDTH)<=CANVAS_WIDTH) this.x=newpos;   
        } 
    }
}

var Gems =function(color,x,y,visible){
    this.sprite='images/Gem'+color+'.png';
    this.x=x;
    this.y=y;
    this.visible=true;
}

Gems.prototype.update=function(){
    //if all gems taken, generate new positions and colors for gems
    var allgone=0;
    for (g in allGems) {
        //allgone=(!allGems[g].visible) ? true : false;
        if (allGems[g].visible==false) allgone++;
    }
    //console.log(allgone);
    if (allgone==allGems.length){//generate random positions and make gems visible
        for ( g in allGems){
            var randX=generateRandom(5,0);//Math.floor(Math.random() *5 + 0);    
            //select random y position i.e what row to show bug in
            var randY=generateRandom(3,0);//Math.floor(Math.random() *3 + 0);
            //select random color for the bug
            var rand2=generateRandom(3,0)//Math.floor(Math.random() *3 + 0);
            allGems[g].visible=true;
            allGems[g].x=randX*GEM_WIDTH;
            allGems[g].y=GEM_Y_LOCATIONS[randY];
            allGems[g].sprite='images/Gem'+GEM_COLORS[rand2]+'.png';
        }    
    //var gem1= new Gems(GEM_WIDTHM_COLORS[rand2],randX*GEM_WIDTH,GEM_Y_LOCATIONS[randY],true);
    }


}

Gems.prototype.render=function(){
    if(this.visible) ctx.drawImage(Resources.get(this.sprite), this.x, this.y,100,100);
    //ctx.drawImage(Resources.get(this.sprite), 0, GEM_Y_LOCATIONS[0],100,100);
    //ctx.drawImage(Resources.get(this.sprite), GEM_WIDTH, GEM_Y_LOCATIONS[1],100,100);
    //ctx.drawImage(Resources.get(this.sprite), GEM_WIDTH*2, GEM_Y_LOCATIONS[2],100,100);
    /*
    ctx.rect(this.x,(this.y+25),101,80);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();
*/
    //alert(this.sprite);
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
//if(!PAUSED){
    var player= new Player(INITIAL_X_PLAYER,INITIAL_Y_PLAYER);
    
    instantiateGameObjects(); //create enemy bugs and push them to the global allEnemies array
//}
function instantiateGameObjects() {

    for (i=0; i<MAX_BUGS;i++) {
        //generate a random starting position in the row
        var randX=generateRandom((CANVAS_WIDTH-BUG_WIDTH),0);//Math.floor((Math.random() *(CANVAS_WIDTH-BUG_WIDTH)) + 0);
        //select a random speed for the bug
        var rand2=generateRandom(3,0);//Math.floor(Math.random() *3 + 0);
        
        //select random y position i.e what row to show bug in
        var randY=generateRandom(3,0);//Math.floor(Math.random() *3 + 0);
        var y;
        if (randY==0) y=65;
        if (randY==1) y=145;
        if (randY==2) y=225;
        
        var enemy1= new Enemy(randX,y,BUG_SPEED[rand2]);
        allEnemies.push(enemy1);
    }

    for (i=0; i<MAX_GEMS;i++) {
        //generate a random x position in the row
        var randX=generateRandom(4,0);//Math.floor(Math.random() *4 + 0);
        
        //select random y position i.e what row to show gem in
        var randY=generateRandom(3,0);//Math.floor(Math.random() *3 + 0);
        /*var y;
        if (rand3==0) y=65;
        if (rand3==1) y=145;
        if (rand3==2) y=225;    
        */
        //select random color for the GEM
        var rand2=generateRandom(3,0);//Math.floor(Math.random() *3 + 0);

        var gem1= new Gems(GEM_COLORS[rand2],randX*GEM_WIDTH,GEM_Y_LOCATIONS[randY],true);
        allGems.push(gem1);
    }


}
/*var rand2=Math.floor((Math.random() *(CANVAS_WIDTH-BUG_WIDTH)) + 0);
var rand22=Math.floor(Math.random() *3 + 0);
var enemy2= new Enemy(rand2,145,BUG_SPEED[rand22]);

var rand3=Math.floor((Math.random() *(CANVAS_WIDTH-BUG_WIDTH)) + 0);
var rand33=Math.floor(Math.random() *3 + 0);
var enemy3= new Enemy(rand3,225,BUG_SPEED[rand33]);
//var enemy3=new Enemy(0,140)


allEnemies.push(enemy1);
allEnemies.push(enemy2);
allEnemies.push(enemy3);
//allEnemies.push(enemy3);
*/





function generateRandom(x,y){
    return Math.floor(Math.random() *x + y);
}

function gamePause(){

    if($("#pausePlayButton").html()=='Play'){
        PAUSED=false;
        $("#pausePlayButton").html('Pause');        
    }
    else if($("#pausePlayButton").html()=='Pause'){
        PAUSED=true;
        $("#pausePlayButton").html('Play');
    }
    
}

function gameReset(){

    var HTML_Life="<img class='life1' src='images/Heart.png' height='50' width='50'>";
    livesToDraw=MAX_LIFE-LIVES;
    //console.log(MAX_LIFE);
    //for (i=0;i<MAX_LIFE;i++){
      //  $(".life").append(HTML_Life);
    //}
    $(".life1").show();

    SCORE=0;
    LIVES=3;
    $("#score").html("<p id='score'>"+SCORE+'</p>');
    player.x=INITIAL_X_PLAYER;
    player.y=INITIAL_Y_PLAYER;
    //handleTimer('pause');
}
function displayTimer(){
    if(!PAUSED){//if game is paused do not decrement the timer
        
        timerLoop--;
        $("#countdown").html("<p id='countdown'>"+timerLoop+'</p>');
        if (timerLoop==0){//game over

          PAUSED=true;
          //var restartButtonHTML=
          //$(".buttonControls").append(restartButtonHTML);
          //$("#restart").show();
          $("#restartStartButton").prop("disabled",false);
          $("#pausePlayButton").prop("disabled",true);

          //disbale pause and reset

            
        } 
    }


}

function gameStartRestart(){
     gameReset();//reset game
     timerLoop=10; //resetTimer
     PAUSED=false;
     GAME_OVER=false;
     //update Timer
     $("#countdown").html("<p id='countdown'>"+timerLoop+'</p>');
     //empty all gems and enemies array and recreate them
     while(allEnemies.length > 0) {
        allEnemies.pop();
    }
    while(allGems.length > 0) {
          allGems.pop();
    }       

    instantiateGameObjects();//recreate bugs and gems
    
    //enable reset pause
    //$("#reset").prop("disabled",false);
    $("#pausePlayButton").prop("disabled",false);
    //$("#restart").hide();
    //$("#restartStart")
    console.log("here");
    if($("#restartStartButton").html()=="Start"){
        //PAUSED=false;
        $("#restartStartButton").html("Restart");
        $("#restartStartButton").prop("disabled",true);        
    }
    else if($("#restartStartButton").html()=='ReStart'){
        //PAUSED=true;
        $("#restartStartButton").html('Start');
    }    



    


}
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

    