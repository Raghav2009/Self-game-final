var rider, riderImg;
var rockImg;
var tallGrass, tallGrassImg;
var ground;
var bg, bgImg;
var barrier, barrierImg;
var bird, birdImg;
var lives = 5;
var obstaclesGroup, birdsGroup, grassGroup;
var score = 0;
var gameState = "play"
var gameOver, gameOverImg;
var gameOverSound, jumpSound, hitSound, scoreSound;
var reset, resetImg;
var gameEnd, gameEndImg;

function preload() {
  riderImg = loadImage("assets/rider.png")
  rockImg = loadImage("assets/rock.png")
  tallGrassImg = loadImage("assets/tall_grass.png")
  barrierImg = loadImage("assets/barrier.png")
  bgImg = loadImage("assets/bg_grassland.png")
  birdImg = loadImage("assets/bird.png")
  gameOverImg = loadImage("assets/game over.png")
  gameOverSound = loadSound("assets/game over.wav")
  jumpSound = loadSound("assets/jump.mp3")
  hitSound = loadSound("assets/hit.wav")
  scoreSound = loadSound("assets/soft-click.mp3")
  resetImg = loadImage("assets/reset.png")
  gameEndImg = loadImage("assets/gameEnd.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rider = createSprite(width / 2 - 570, height / 2 + 200, 50, 50);
  rider.addImage(riderImg);
  rider.scale = 0.5;

  ground = createSprite(width / 2, height / 2 + 340, windowWidth + 500, 43)
  ground.visible = false;;
  ground.velocityX = -5;

  gameOver = createSprite(width / 2, height / 2 - 100, 70, 70);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;

  reset = createSprite(width / 2,height / 2 + 100, 50, 50);
  reset.addImage(resetImg)
  reset.scale= 0.2
  reset.visible = false;

  gameEnd = createSprite(width/2,height/2,70,70);
  gameEnd.addImage(gameEndImg)
  gameEnd.visible = false;

  obstaclesGroup = createGroup();
  birdsGroup = createGroup();
  grassGroup = createGroup();

  //rider.debug = true;
  rider.setCollider("circle", 0, 0, 250)
}

function draw() {
  background(bgImg);

  if (gameState == "play") {
    if (ground.x <= 0) {
      ground.x = width / 2;
    }

    if (keyIsDown(UP_ARROW)) {
      rider.velocityY = -15
      jumpSound.play();
      jumpSound.setVolume(0.1);
    }
    rider.velocityY = rider.velocityY + 1;

    spawnObstacles();
    spawnBirds();
    spawnGrass();

    if (rider.y < 100) {
      rider.y = 150;
    }

    for (var i = 0; i < obstaclesGroup.length; i++) {
      if (rider.isTouching(obstaclesGroup[i])) {
        lives = lives - 1;
        obstaclesGroup[i].destroy();
        hitSound.play()
      }
    }

    for (var j = 0; j < birdsGroup.length; j++) {
      if (rider.isTouching(birdsGroup[j])) {
        lives = lives - 1;
        birdsGroup[j].destroy();
        hitSound.play()
      }
    }

    for (var k = 0; k < grassGroup.length; k++) {
      if (rider.isTouching(grassGroup[k])) {
        score = score + 1;
        grassGroup[k].destroy();
        scoreSound.play()
      }
    }

    if (lives == 0) {
      gameState = "end"
      gameOverSound.play()
    }

    if(score == 10){
      gameState = "won"
    }

  }

  else if (gameState == "end") {
    obstaclesGroup.destroyEach()
    birdsGroup.destroyEach()
    grassGroup.destroyEach()

    rider.visible = false;

    gameOver.visible = true;
    reset.visible = true;

    if(mousePressedOver(reset)){
      restart()
    }
  }

  else if (gameState == "won"){
    obstaclesGroup.destroyEach()
    birdsGroup.destroyEach()
    grassGroup.destroyEach()

    rider.visible = false;

    gameEnd.visible = true;

  }

  rider.collide(ground);

  drawSprites();

  fill("green")
  textSize(25);
  text("Lives Remaining: " + lives, 100, 100);

  text("Score: " + score, 400, 100);

  if (rider.y < 150) {
    fill("red")
    text("Oops! You can't touch the sky!", 700, 100)
  }

}

function spawnObstacles() {
  if (frameCount % 250 == 0) {
    barrier = createSprite(width, height - 100);
    barrier.addImage(barrierImg)
    barrier.scale = 0.4;
    barrier.velocityX = -(5 + frameCount/400)
    barrier.y = random(height / 2 + 100, height - 100)
    obstaclesGroup.add(barrier)

    var x = Math.round(random(1, 2));
    if (x == 1) {
      barrier.addImage(barrierImg);
    }
    else {
      barrier.addImage(rockImg);
    }
  }
}

function spawnBirds() {
  if (frameCount % 170 == 0) {
    bird = createSprite(width, random(30, 150));
    bird.addImage(birdImg);
    bird.velocityX = -(5 + frameCount/475)
    bird.scale = 0.2;
    birdsGroup.add(bird);
  }
}

function spawnGrass() {
  if (frameCount % 110 == 0) {
    tallGrass = createSprite(width, random(height / 2 + 100, height - 100))
    tallGrass.addImage(tallGrassImg);
    tallGrass.velocityX = -10;
    tallGrass.scale = 0.4
    grassGroup.add(tallGrass);
  }
}

function restart() {
  gameState = "play"
  obstaclesGroup.destroyEach()
  birdsGroup.destroyEach()
  grassGroup.destroyEach()
  score = 0;
  lives = 5;
  gameOver.visible = false;
  reset.visible = false;
  rider.x = width / 2 - 570;
  rider.y = height / 2 + 200;
  rider.visible = true;
}