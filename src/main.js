var wall_sound = new Audio();
wall_sound.src = 'audio/click.wav';

var player_sound = new Audio();
player_sound.src = 'audio/click2.wav';

var score_sound = new Audio();
score_sound.src = 'audio/clapping.mp3';

// declare "global" variables
var playing;  //continue game
var ball;
var paddle; //left paddle
var paddle2;  //right paddle
var hit;  //if ball collides with paddle
var w, h; //width & height
var player_score; //records player 1(human controlled)
var comp_score;   //records computer score

// define "callback" function for animation
window.requestFrame = (function(callback){
  return( window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback){ 
      window.setTimeout( callback, 1000 / 600 );
    }); 
})();

// define function that animates the objects in the canvas
function animate(){  
// get graphics context
  var c = document.getElementById("myCanvas");
  var cntxt = c.getContext( "2d" );

  // save dimensions of graphics context 
  w = c.width;
  h = c.height;
  var bg = cntxt.createRadialGradient(ball.x, ball.y+3,3,ball.x+5,ball.y,20);
  bg.addColorStop(0, "#9B26AF"); 
  bg.addColorStop(1, "#9B26AF");
  cntxt.fillStyle=bg;
  cntxt.fillRect(0,0,c.width,c.height);

  //drawing dashed line
  cntxt.fillStyle = "#68EFAD";
  for (i=0; i<30; i++){
    a = (i*10) + (i*5);
    cntxt.fillRect((w/2)-2, a, 4, 10);//drawing dashed line
  }  

  // -----draw  ball-------------
  cntxt.beginPath();
  cntxt.save(); 
  cntxt.fillStyle = "white";
  cntxt.arc(ball.x,ball.y,7.5,0,2*Math.PI);
  cntxt.fill(); 
  cntxt.closePath();

  // ----draw left paddle-----------
  cntxt.beginPath();
  cntxt.fillStyle = "#68EFAD";
  cntxt.fillRect( paddle.x, paddle.y, paddle.w, paddle.h );
  cntxt.closePath();

  //----Draw right paddle----------------
  cntxt.beginPath();
  cntxt.fillStyle = "#68EFAD";
  cntxt.fillRect( paddle2.x, paddle2.y, paddle2.w, paddle2.h);
  cntxt.closePath();

  //---draw scoreboard----------------------
  var w_pos= c.width/4;
  cntxt.fillStyle= "#68EFAD";
  cntxt.font= "40px Impact";
  cntxt.fillText(player_score,(w_pos),50);
  cntxt.fillText(comp_score,w_pos*3,50);     
  
  //---GAME STATUS ----------------------------------
  if( comp_score >=5){
    cntxt.font = "bold 30px sans-serif";
    var gradient = cntxt.createLinearGradient(20, 0, 150, 200);
    gradient.addColorStop(0, "rgb(255, 255, 0)");
    gradient.addColorStop(.5, "rgb(212, 0, 222)");      
    gradient.addColorStop(1, "rgb(184, 225, 57");
    cntxt.fillStyle = gradient;
    cntxt.fillText("YOU LOSE", 50, 150);
    cntxt.fillText("Game Over", 50, 200);
    playing = "false"
    score_sound.play();
  }
  
  if( player_score >=5){
    cntxt.font = "bold 30px sans-serif";
    var gradient = cntxt.createLinearGradient(20, 0, 150, 200);
    gradient.addColorStop(0, "rgb(255, 255, 0)");
    gradient.addColorStop(.5, "rgb(212, 0, 222)");      
    gradient.addColorStop(1, "rgb(184, 225, 57");
    cntxt.fillStyle = gradient;
    cntxt.fillText("YOU WIN", 50, 150);
    cntxt.fillText("Game Over", 50, 200);     
    playing = "false"
    score_sound.play();
  }
  
  //----move ball----------------------
  if ( isHit() ==1 ){
    hit = "true";   
        
    //moves ball in opposite direction using unary negation
    ball.vx = -(ball.vx);//set incrementer/decrementers
    ball.vy = -(ball.vy);     
  }

  //position of ball increments in units of one, vx & vy =1

  ball.x += 1.2*ball.vx;
  ball.y += 1.2*ball.vy;
  
  //---KEEPING SCORE---------------------------
  if (ball.x < 0){
    comp_score++;
    ball.x = w/2 -5; 
    ball.y = h/2;
  }    
  
  if (ball.x > c.width-ball.r){
    player_score++;
    ball.x = w/2 -7; 
    ball.y = h/2;}
  
  //top & bottom boundary/wall
  if (( ball.y < 0 ) || ( ball.y > c.height-ball.r )){
    ball.vy = -(ball.vy);
    wall_sound.play();
  } 
  
  //--COMP PADDLE AI------------------------------- 
  if(( ball.y > paddle2.y) && (paddle2.y< h-paddle.h)){
    paddle2.y += 5.3;
  }
      
  if( (ball.y<paddle2.y ) && (paddle2.y>0) ){
    paddle2.y -= 5.3;
  }

  // ----REQUEST NEW FRAME------------------------------
  if ( playing == "true" ){
    requestFrame(function() { animate(); } );
  }     
} // end of animate()


//welcome screen
function intro(){
  var c = document.getElementById( "myCanvas" );
  var cntxt = c.getContext( "2d" );
           
  //----BACKGROUND COLOR------------------------
  var grd = cntxt.createRadialGradient(238, 50, 10, 238, 50, 200);
  grd.addColorStop(0, "#8ED6FF"); // light blue
  grd.addColorStop(1, "#004CB3"); // dark blue
  cntxt.fillStyle=grd;
  cntxt.fillRect(0,0,c.width,c.height);
          
  //----ADD SHADOW TO TEXT----------------------
  cntxt.save();  
  cntxt.shadowBlur = 10;  
  cntxt.shadowColor = "rgb(1, 1, 1)"; 
    
  cntxt.font = "bold 80px Impact";
  var gradient = cntxt.createLinearGradient(20, 0, 150, 200);
  gradient.addColorStop(0, "rgb(255, 255, 0)");
  gradient.addColorStop(.5, "rgb(212, 0, 222)");      
  gradient.addColorStop(1, "rgb(184, 225, 57");
  cntxt.fillStyle = gradient;
  cntxt.fillText("PONG-TIA", (w/2-70),(h/2-30) ); 
  cntxt.fillStyle= "#0000ff";
  cntxt.fillStyle= "#ffffff";
  cntxt.font= "17px Impact";
  cntxt.fillText("Press 'Play' to begin...", w/2,h/2);

  //---REQUEST NEW FRAME-----------------------
  if ( playing == "true" ) {
    requestFrame( function() { animate(); } );
  }
}//end of intro

//-----COLLISION--------------------------------------------
function isHit() {  
  if((( ball.x > paddle.x ) && ( ball.x < paddle.x + paddle.w ) && 
        ( ball.y > paddle.y ) && ( ball.y < paddle.y + paddle.h )) ||

        (( ball.x > paddle.x ) && ( ball.x < paddle.x + paddle.w ) && 
        ( ball.y + ball.h > paddle.y ) && ( ball.y + ball.h < paddle.y + paddle.h )) ||
      
        (( ball.x + ball.w > paddle.x ) && ( ball.x + ball.w < paddle.x + paddle.w ) &&
        ( ball.y + ball.h > paddle.y ) && ( ball.y + ball.h < paddle.y + paddle.h )) ||
        
        (( ball.x + ball.w > paddle.x ) && ( ball.x + ball.w < paddle.x + paddle.w ) && 
        ( ball.y > paddle.y ) && ( ball.y < paddle.y + paddle.h )) ||   
        
        //computer paddle
        ((ball.x < paddle2.x + paddle2.w) && (ball.x > paddle2.x) &&
        ( ball.y > paddle2.y ) && ( ball.y < paddle2.y + paddle2.h )) ||
      
        ((ball.x < paddle2.x + paddle2.w) && (ball.x > paddle2.x) &&
        ( ball.y + ball.h > paddle2.y ) && ( ball.y + ball.h < paddle2.y + paddle2.h )) ||
          
     
        ((ball.x + ball.w < paddle2.y + paddle2.h) && (ball.x + ball.w > paddle2.x) && 
        ( ball.y + ball.h > paddle2.y ) && ( ball.y + ball.h < paddle2.y + paddle2.h )) ||
        
        ((ball.x + ball.w < paddle2.y + paddle2.h) && (ball.x + ball.w > paddle2.x) && 
        ( ball.y > paddle2.y ) && ( ball.y < paddle2.y + paddle2.h ))   ) { 
        return ( 1 );
  }else{
    return( 0 );
  }//end of else
} // end of isHit()

//-----"start" button----------------------------------------------------
function startPlaying(){
  playing = "true";
  hit = "false";
  startTime = new Date();
  animate();
} // end of startPlaying()

// ------"stop" button------------------------------------------
function stopPlaying() {
  playing = "false";
} // end of stopPlaying()

// -----PAGE LOADS-----------------------------------------------
function init(){

  // get graphics context
  var c = document.getElementById( "myCanvas" );
  var cntxt = c.getContext("2d");

  // save dimensions of graphics context
  w = c.width;
  h = c.height;  
     
  // initialize ball object
  ball = new Object();
  ball.r = 10;//radius

  //place ball in middle at loading
  ball.x = w/2 -5; 
  ball.y = h/2;       
  ball.vx = 2.5;
  ball.vy = 2.5;        
  
  // initialize paddle object
  paddle = new Object();
  paddle.w = 10;
  paddle.h = 60;
  paddle.x = 2;
  paddle.y = (h-paddle.h)/2;
  
  //initialize right paddle
  paddle2 = new Object();
  paddle2.w = 10;
  paddle2.h = 60;
  paddle2.x = w-12;
  paddle2.y = (h-paddle2.h)/2;
     
  comp_score = 0;
  player_score = 0;
      
  // initialize all this
  playing = new Boolean();
  playing = "false";
  hit = new Boolean();
  hit = "false";
  intro();  //call welcome screen 
  wall_sound.play();
} // end of init()

//----Up/DOwn key events for Left Paddle----------------
function keyPressed(evt){      
  switch(evt.keyCode){

    case 38:  /* Up arrow was pressed */
      if(paddle.y < 0){ //check to keep paddle in boundaries
            paddle.y=0;
      }else{
        paddle.y -= 15;
      }
        break;
        
    case 40:  /* Down arrow was pressed */
      if(paddle.y > h-paddle.h ){
        paddle.y=  h-paddle.h ;
    }else{ 
      paddle.y += 15;}
      break;
    }//end of switch
    player_sound.play();
} // end of keyPressed()

//---ADDING LISTENER-----------------------------------
window.addEventListener( 'keydown', keyPressed, true );