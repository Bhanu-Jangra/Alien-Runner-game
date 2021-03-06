var PLAY = 1;
var END = 0;
var gameState = PLAY;

var background1,backgroundImage;

var alien, alien_running, alien_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5;

var sun,sunImage;

var score=0;

var gameOver,gameOverSound, restart;


function preload(){
  
  backgroundImage = loadImage("sky.PNG");
  
  alien_running =   loadAnimation("alien_1.png","alien_2.png");
  alien_collided = loadAnimation("alien_collided.png");
  
  groundImage = loadImage("desert.png");
  sunImage = loadImage("sun_2.png");
  cloudImage = loadImage("cloud-1.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");

  gameOverImg = loadImage("gameOverText.jpg");
  restartImg = loadImage("restart_button.PNG");
  
  gameOverSound = loadSound("gameover_1.mp3")
  
}

function setup() {
  createCanvas(windowWidth,windowHeight);
    
  background1 = createSprite(width-300,height-190,windowWidth,windowHeight);
  background1.addImage("background",backgroundImage);
  background1.scale = 10;
  
  sun = createSprite(width-40,height-480,20,20);
  sun.addImage(sunImage);
  sun.scale = 0.7;
  
  ground = createSprite(width,height+290,200,20);
  ground.addImage("ground",groundImage);
  ground.scale = 3;
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  alien = createSprite(50,180,20,50);
  alien.addAnimation("running", alien_running);
  alien.addAnimation("collided", alien_collided);
  alien.scale = 0.6;
  
  gameOver = createSprite(width-320,height-320);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width-280,height-220);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width-500,height-30,10000,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(255);
    
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/30);
    ground.velocityX = -(6 + 3*score/100);
  
    if(touches > 0 && alien.y >= height-160) {
      alien.velocityY = -12;
      touches = []
    }
  
    alien.velocityY = alien.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    alien.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(alien)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    gameOverSound.play();
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    alien.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    alien.changeAnimation("collided",alien_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches > 0){
       reset(); 
       touches = []
}    
  }
  
  
  drawSprites();
  text("Score: "+ score, width-500,height-500);
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+50,height-120,40,10);
    cloud.y = Math.round(random(height-350,height-370));
    cloud.addImage(cloudImage);
    cloud.scale = 0.2;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = width-320;
    
    //adjust the depth
    cloud.depth = alien.depth;
    alien.depth = alien.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width-60,height-50,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,5));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  alien.changeAnimation("running",alien_running);
    
  score = 0;
  
}