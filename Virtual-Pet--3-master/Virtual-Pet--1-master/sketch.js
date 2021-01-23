//Create variables here
var dog,dogImage,happyDogImage,sadImage,database;
var feed,addFood;
var food1;
var gameState;
var bedroom,washroom,garden;
var changeGameState;
var readGameState;
var currenttime;
//var milkImage;
var addTheImages
function preload()
{
  //load images here
  dogImage=loadImage("images/dogImg.png");
  happyDogImage=loadImage("images/dogImg1.png");
  sadImage=loadImage("virtualpetimages/Lazy.png");
  washroom=loadImage("virtualpetimages/WashRoom.png");
  bedroom=loadImage("virtualpetimages/BedRoom.png");
  garden=loadImage("virtualpetimages/Garden.png");
  //milkImage=loadImage("images/Milk.png");
}

function setup() {
  createCanvas(1000, 1000);
  dog=createSprite(200,250,1,1);
  dog.addImage(dogImage);
  database=firebase.database();
  foodStock=database.ref("Food")
  foodStock.on("value",readStock);
  food1=new Foodclass(10,12);
  feed=createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food")
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  currenttime = hour();
  fedTime=database.ref('FeedTime');
  fedTime.on("value",readLastFed);  
  readGameState=database.ref('gamestate');
  readGameState.on("value",function(data){
    gameState=data.val();
  });
  
  dogImage.resize(100, 100);
  happyDogImage.resize(100, 100);
  sadImage.resize(100, 100);
}


function draw() {  
  background(46, 139, 87);
  lastFed = food1.getLastFed();

  if(keyDown("r")){
    currenttime++;
    if (currenttime >= 24)
      currenttime=0;
  }

  if(currenttime===(lastFed+1)){
    this.showgarden();
    gameState="playing";
    update(gameState);
  }else if(currenttime===(lastFed+2)) {
    gamestate="sleeping";
    this.showbedroom();
    update(gameState);
  }
  else if(currenttime>= (lastFed+2) && currenttime<=(lastFed+4)) {
    gamestate="bathing";
    this.showwashroom();
    update(gameState);
  }
  else {
    gameState="Hungry";
    update(gameState);

    //dog.display();
    //feed.show();
  }

  if(gameState!=="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove()
  }
  else {

    feed.show();
    addFood.show();
    dog.addImage(sadImage);
  }
fill("black");
  text("Current time : "+ currenttime%12 + "PM, Last Feed : "+ lastFed%12 + "PM", 350,30 );
  fill("black")
  text(food1.getFoodStock(),250,250);  

  food1.display();
  drawSprites();
}

function showbedroom() {
  background(bedroom,550,500);
}

function showgarden(){
  background(garden,550,500);
}

function showwashroom(){
  background(washroom,550,500);
}

function readStock(data){
  food1.updateFoodStock(data.val);

}

function readLastFed(data){
  food1.updateLastFed(data.val);

}

function writeStock(m){
  if(m<=0){
    m=0;
  }
  else{
    m=m-1;
  }
  database.ref("/").update({
    Food:m
  });
}


 


function addFoods(){
  
  food1.addFoods();
  database.ref('/').update({
    Food:food1.getFoodStock()    
  });

}


function feedDog (){
  dog.addImage(happyDogImage);
  
  food1.feedDog();
  database.ref('/').update({
    Food:food1.getFoodStock(),
    FeedTime:food1.getLastFed()
  });
}

function update (state){
  //database.ref('/').update({
  //  gamestate:state
  //});
}
