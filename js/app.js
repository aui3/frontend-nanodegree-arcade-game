/*************************/
//      GLOBAL VARIABLES
/*************************/
var CANVAS_WIDTH=505;

var BLOCK_HEIGHT=80;//height of each element (grass,water,block/road) in the map


var STEP_Y=80;//player moves 80 px vertically across the canvas
var STEP_X=95;//player moves 95 pixels horizontally across the canvas

//height and width of bug to check for collision
var BUG_HEIGHT=70;
var BUG_WIDTH=101;
var BUG_SPEED =[80,100,120]; //randomly choose bug speeds from this array
var MAX_BUGS=3; //maximum number of bugs in the game
var SLIDE_BUG_Y=75;//the actual bug image starts after 75 pixels down vertically in the sprite

var HIGH_SCORE=0;
var PAUSED=true;

//initial position of player
var INITIAL_X_PLAYER=200;
var INITIAL_Y_PLAYER=400;
//height and width of player to check for collision
var PLAYER_HEIGHT=80; 
var PLAYER_WIDTH=75;
var SLIDE_PLAYER_X=15;//the actual player image starts after 15 pixels to the right horizontally in the sprite
var SLIDE_PLAYER_Y=60;//the actual player image starts after 75 pixels down vertically in the sprite 
var GAME_OVER=false;

//Gems
var MAX_GEMS=3;//this is the maximum number of gems at any given time. When player takes all gems displayed, new ones are shown 
var GEM_COLORS=['Blue','Green','Orange'];//new gem colors are chosen randomly from this array
var GEM_WIDTH=101;
//possible y locations where the gems can be i.e y locations on the grey blocks.
var GEM_Y_LOCATIONS=[25+BLOCK_HEIGHT,110+BLOCK_HEIGHT,190+BLOCK_HEIGHT];

//global arrays to store enemy and gem objects
var allEnemies= [];
var allGems=[];

//Timer for one game loop
var MAX_TIME=30;
var timerLoop=MAX_TIME;//set at 30 sec

//FAIL STATES
var TIMES_UP=false;//game finished because times up
var LIVES_UP=false;//game finished because lives up

/*************************/
//      ENEMY CLASS
/*************************/

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
    // all com          puters.
    
    
    if (!PAUSED) this.x=this.x+this.speed*dt;
    
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
    if(!GAME_OVER)//if game is not over, draw Image
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/*************************/
//      PLAYER CLASS
/*************************/
var Player=function(x,y,maxLife,score){
    this.x=x;
    this.y=y;
    this.sprite='images/char-cat-girl.png';
    this.lives=maxLife;
    this.maxLife=maxLife;
    this.score=score;

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
            this.lives=this.lives-1;
            //find the last visible child (heart) and make it invisible
            $(".heart-img").find(":visible:last").hide(); 
            
            if (this.lives==0) { //player has used all lives and the game loop is over
                PAUSED=true; //to freeze game objects
                //ctx.drawImage(Resources.get('images/gameover.png'),0,0);
                //disable Pause/Play Button and enable Start/restart Button
                $("#restartStartButton").prop("disabled",false);
                $("#pausePlayButton").prop("disabled",true);
                
                GAME_OVER=true;
                LIVES_UP=true;
                 //display high score   
                if (this.score>HIGH_SCORE) {
                 //alert("hello");
                    $("#new-high-score").show();
                    HIGH_SCORE=this.score;
                    $("#high-score").show();//("display:block");
                    $("#scoreHigh").html(HIGH_SCORE);
                }
            }       
            break;//avoid multiple life loss
        }

    }
    //Check for Gem Collision with player
    //loop through all gems
    for (gem in allGems) {
        gem1={
             'top':   allGems[gem].y+40,//adjust for start for gem image..25
             'bottom': allGems[gem].y+80,//block height is gem height..so if player is in that block
             'right': allGems[gem].x+GEM_WIDTH,
             'left': allGems[gem].x
        };
        if(allGems[gem].visible) { //if the hit gem is visible
            if(!(player1.left>(gem1.right) || player1.right < (gem1.left) ||player1.top>(gem1.bottom) || player1.bottom <(gem1.top))) {    
               //increase score
                this.score+=5;
                //UPDATE SCORE
                $("#score").html('<p>'+this.score+'</p>');
                //hide gem indicating it has been taken by player
                allGems[gem].visible=false;
                //play sound
                var audio = document.getElementById("audio");
                audio.play();
            }

        }
    }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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
/*************************/
//      GEMS CLASS
//player must collide with gems to score points
/*************************/
var Gems =function(color,x,y,visible){
    this.sprite='images/Gem'+color+'.png';
    this.x=x;
    this.y=y;
    this.visible=true;//gems are hidden when player collides with them
                    //and are re-positioned and re-appear when all displayed
                    // gems are taken by player
}

Gems.prototype.update=function(){
    
    //if all gems taken i.e. not visible, generate new positions and colors for gems and make them visible
    var allgone=0;
    for (g in allGems) {
        if (allGems[g].visible==false) allgone++;
    }
   
    if (allgone==allGems.length){//generate random positions and make gems visible
        for ( g in allGems){
            //select random x position i.e one of the five blocks in a row
            var randX=generateRandom(5,0);    
            //select random y position i.e what row to show bug in
            var randY=generateRandom(3,0);
            //select random color for the bug
            var rand2=generateRandom(3,0);
            
            allGems[g].visible=true;
            allGems[g].x=randX*GEM_WIDTH;
            allGems[g].y=GEM_Y_LOCATIONS[randY];
            allGems[g].sprite='images/Gem'+GEM_COLORS[rand2]+'.png';
        }    
    }
}

Gems.prototype.render=function(){
    if(!GAME_OVER)//if game is not over and Gem is visible draw it
        if(this.visible) ctx.drawImage(Resources.get(this.sprite), this.x, this.y,100,100);
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player= new Player(INITIAL_X_PLAYER,INITIAL_Y_PLAYER,5,0);    
//instantiateGameObjects(); //create enemy bugs, gems and push them to the global allEnemies, allGems array
//load all heart images..do this in game  start/restart
    //load heart image to represent life
    var HTML_Life="<img class='life1' src='images/Heart.png' height='15%' width='15%'>"; 
    
    for (i=0;i<player.maxLife;i++){
        $(".heart-img").append(HTML_Life);
    }
    $(".life1").hide();

/************************************/
        //Helper Functions
/************************************/        

//Instantiate all enemy and gems
function instantiateGameObjects() {
    for (i=0; i<MAX_BUGS;i++) {
        //generate a random starting position in the row
        var randX=generateRandom((CANVAS_WIDTH-BUG_WIDTH),0);
        //select a random index to choose speed of the bug from the array BUG_SPEED
        var rand2=generateRandom(3,0);
        
        //select random y position i.e what row to show bug in
        var randY=generateRandom(3,0);//generate a number in the range [0,3) to pick from on the three rows in the map
        var y;
        if (randY==0) y=65; //y location for the first row
        if (randY==1) y=145; //y location for the second row
        if (randY==2) y=225; //y location for the third row
        
        //start bugs from the left of the canvas, makes the game easier to play instead of a random location
        var enemy1= new Enemy(0,y,BUG_SPEED[rand2]);
        allEnemies.push(enemy1);
    }

    for (i=0; i<MAX_GEMS;i++) {
        //generate a random x position in the row from the five blocks in each row
        var randX=generateRandom(4,0);
        
        //select random y position i.e what row to show gem in
        var randY=generateRandom(3,0);
    
        //select random index to choose color from the GEM_COLORS array 
        var rand2=generateRandom(3,0);

        //last argument initially make the gem visible    
        var gem1= new Gems(GEM_COLORS[rand2],randX*GEM_WIDTH,GEM_Y_LOCATIONS[randY],true);
        allGems.push(gem1);
    }
    
    

    $("#pausePlayButton").prop("disabled",true);

}

//Generate a random Rumber between 'x' and 'y'
function generateRandom(x,y) {
    return Math.floor(Math.random() *x + y);
}

//Call back function when Pause/Play button is pressed.
//Set the PAUSE variable to control the and rename Pause/Play button
/*
    Player has one button to Pause or Play the Game. When the game is running, the button displays
    'Pause', when the user clicks 'Pause', the game is paused and the button label changes to 'Play'.Now 
    the player can press 'Play' to resume the game.
*/
function gamePause() {
    //game already in pause state when button is pressed and player wants to resume game
    if($("#pausePlayButton").html()=='Play'){
        PAUSED=false;
        ctx.globalAlpha=1; //restore normal display
        $("#pausePlayButton").html('Pause');//re-label button to Pause        
    }
    //Game in play and player wants to pause
    else if($("#pausePlayButton").html()=='Pause'){
        PAUSED=true;
        ctx.globalAlpha=0.5;//change opacity of canvas to indicate pause state
        $("#pausePlayButton").html('Play');
    }    
}

//Call back function for the Start/Restart button
function gameReset() {
    $(".life1").show();//show all lives i.e. heart images
    //reset SCORE & player.lives
    player.score=0; 
    player.lives=player.maxLife;
    $("#score").html("<p id='score'>"+player.score+'</p>');//Display SCORE 
    //reset player to original position
    player.x=INITIAL_X_PLAYER; 
    player.y=INITIAL_Y_PLAYER;

}

//Call back function for the setInterval(...) method. Called every second to update the Game timer
function displayTimer() {
    if(!PAUSED) {//if game is paused do not decrement the timer
        timerLoop--;
        
        $("#countdown").html("<h1 id='countdown1'>"+timerLoop+'</h1>'); 
        
        if (timerLoop==0) { //game loop is over
            TIMES_UP=true;
            PAUSED=true;//control variable to stop the motion of game objects is set to true
            GAME_OVER=true; //bugs and gems to stop displaying
            player.x=INITIAL_X_PLAYER;
            player.y=INITIAL_Y_PLAYER;
            
            //disable  Play/Pause Button and Enable Start/Restart Button
            $("#restartStartButton").prop("disabled",false);
            $("#pausePlayButton").prop("disabled",true);
            //if high_score greater than player score, update High Score
            if (player.score>HIGH_SCORE) {
                $("#new-high-score").show();
                HIGH_SCORE=player.score;
                $("#high-score").show();//("display:block");
                $("#scoreHigh").html(HIGH_SCORE);
            }
        } 
    }
}

function gameStartRestart(){
     //$(".life1").hide();
     timerLoop=MAX_TIME; //resetTimer
     PAUSED=false;
     GAME_OVER=false;
     TIMES_UP=false;
     LIVES_UP=false;
    
    //update Timer
    $("#countdown").html("<h1 id='countdown1'>"+timerLoop+'</h1>');
    //$("#countdown").append(timerLoop);
    //empty all gems and enemies array and recreate them
    while(allEnemies.length > 0) {
        allEnemies.pop();
    }
    while(allGems.length > 0) {
          allGems.pop();
    }       

    instantiateGameObjects();//recreate bugs and gems
    
    gameReset();//reset game
    //enable play/pause and disable start/restart button
    $("#pausePlayButton").prop("disabled",false);
    $("#restartStartButton").prop("disabled",true);
    
    //switch the button labels between Start and Restart
    if($("#restartStartButton").html()=="Start") {
        $("#restartStartButton").html("Restart");        
    }
    else if($("#restartStartButton").html()=='ReStart') {
        $("#restartStartButton").html('Start'); 
    }
    $("#new-high-score").hide();

    

    
    
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

    