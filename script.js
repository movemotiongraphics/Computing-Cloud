// slider values and defaults
let hurricaneSlider;
let blowSlider;
let starDustButton;
let rainButton;

// arrays for object IDs

let characterArray = [];
let treeArray = [];
let bubbleArray = [];

//load faces 
let sadFace = './img/sad_face.png';
let xxFace = './img/xx_face.png';
let movingFace = './img/moving_face.png';
let levelupFace = './img/levelup_face.png';
let happyFace = './img/happy_face.png';
let deadFace = './img/dead_face.png';

let faceImage = [sadFace,xxFace,movingFace,levelupFace,happyFace,deadFace];
let loadedFaceImage = [];

//load trees and clouds

let treeImg = './img/tree.png';
let bubbleImg = './img/bubble.png';
let backgroundImg = './img/background.png';


let assetArray = [treeImg, bubbleImg, backgroundImg]
let loadedAssetArray = [];


function chooseFace(){
    for (let displayFace of faceImage) {
        loadedFaceImage.push(loadImage(displayFace));
        console.log('loaded face' + displayFace)
    }
}

function loadOtherAssets(){
    for (let displayImg of assetArray) {
        loadedAssetArray.push(loadImage(displayImg));
        console.log('loaded face' + displayImg)
    }
}

function preload() {
    chooseFace()
    loadOtherAssets()
}

function cloudBoy(id, emotion, health, level) {
    this.characterID = id,
    this.currentEmotion = emotion,
    this.currentHealth = health,
    this.currentLevel = level,
    this.currentPositionX = 1,
    this.currentPositionY = 1,


    this.levelUp = (e) => {
        let currentLevel = this.currentLevel
        this.currentLevel = currentLevel + e;
        //show level up animation here
        console.log("current level is " + currentLevel)
    },

    this.levelDown = (e) => {
        let currentLevel = this.currentLevel
        this.currentLevel = currentLevel - e;
        //show level up animation here
        console.log("current level is " + currentLevel)
    }

    this.switchEmotion = () => {
        switch (this.currentEmotion) {
            case 'happy':
                push();
                console.log("your cloud is happy");
                image(loadedFaceImage[faceImage.indexOf(happyFace)], this.currentPositionX + 66, this.currentPositionY, 340, 340)
                break;
            case 'sad':
                push();
                console.log("your cloud is sad");
                image(loadedFaceImage[faceImage.indexOf(sadFace)], this.currentPositionX + 66, this.currentPositionY, 340, 340)
                break;
            case 'dead':
                push();
                console.log("your cloud is dead");
                image(loadedFaceImage[faceImage.indexOf(deadFace)], this.currentPositionX + 66, this.currentPositionY, 340, 340)
                break;
            case 'levelup':
                push();
                console.log("your cloud is levellingup");
                image(loadedFaceImage[faceImage.indexOf(levelupFace)], mouseX + 66, mouseY, 340, 340)
                break;
            default:
                push();
                console.log("neutral");
                image(loadedFaceImage[faceImage.indexOf(movingFace)], mouseX + 66, mouseY, 340, 340)
        }
    }

    this.takeDamage = (e) => {
        let newHealth = this.currentHealth - e;
        this.currentHealth = newHealth;
        console.log(this.currentHealth);
    }

    //renders this object
    this.render = () => {

        push();

        let cloudSize = 150 + this.currentLevel*10;

        let posX = this.currentPositionX * this.characterID;
        let posY = this.currentPositionY * this.characterID;

        fill(255, 255, 255)
        strokeWeight(0)
        ellipse(posX + Math.sin(frameCount/10)*4, posY, cloudSize, cloudSize);
        ellipse(posX + 60 + Math.sin(frameCount/12)*3, posY - Math.sin(frameCount/15)*3, cloudSize, cloudSize);
        ellipse(posX + 120 + Math.sin(frameCount/11)*2, posY - Math.sin(frameCount/15)*2, cloudSize, cloudSize);
        ellipse(posX + 140 + Math.sin(frameCount/12)*6, posY + 40 + Math.sin(frameCount/15)*5, cloudSize, cloudSize);
        ellipse(posX + 60 + Math.sin(frameCount/13)*3, posY + 40 + Math.sin(frameCount/15)*3, cloudSize, cloudSize);
        ellipse(posX - 20 + Math.sin(frameCount/13)*3, posY + 40 + Math.sin(frameCount/15)*5, cloudSize, cloudSize);
        this.switchEmotion()
        imageMode(CENTER)

    }

    this.eatTree = () => {
        treeArray.forEach((element, index) => {

            let x1 = this.currentPositionX;
            let y1 = this.currentPositionY;
            let x2 = element.currentPositionX;
            let y2 = element.currentPositionY;
            // line(x1,y1,x2,y2)
            strokeWeight(2)

            var a = x1 - x2;
            var b = y1 - y2;

            var distance = dist(x1,y1,x2,y2);
            //console.log(distance)
            if ( distance < 100) {
                console.log('touch')
                this.takeDamage(3)
                element.killed = true;
            }
        });

        treeArray = treeArray.filter(t => !t.killed);
    }

    this.eatBubble = () => {
        bubbleArray.forEach((element, index) => {

            let x1 = this.currentPositionX;
            let y1 = this.currentPositionY;
            let x2 = element.currentPositionX;
            let y2 = element.currentPositionY;
            // line(x1,y1,x2,y2)
            strokeWeight(2)

            var a = x1 - x2;
            var b = y1 - y2;

            var distance = dist(x1,y1,x2,y2);
            //console.log(distance)
            if ( distance < 100) {
                console.log('touch')
                this.takeDamage(3)
                // killTree(element)
                element.killed = true;
            }
        });

        bubbleArray = bubbleArray.filter(t => !t.killed);
    }
}

function treeBoy(id, x, y) {
    this.treeID = id,
    this.alive = true,
    this.currentPositionX = x,
    this.currentPositionY = y,

    this.render = () => {
        push();

        translate(p5.Vector.fromAngle(millis() / 4000, 10))
        image(loadedAssetArray[assetArray.indexOf(treeImg)], this.currentPositionX, this.currentPositionY, 170, 170)
        rotate(frameCount/50 * hurricaneSlider)
    }
}


function bubbleBoy(id, x, y) {
    this.bubbleID = id,
    this.alive = true,
    this.currentPositionX = x,
    this.currentPositionY = y,

    this.render = () => {
        push();

        image(loadedAssetArray[assetArray.indexOf(bubbleImg)], this.currentPositionX, this.currentPositionY, 170, 170);
    }
}

let newCharacter = (id, emotion) => {
    let character = new cloudBoy(id, emotion, 100, 2);
    console.log('added new character with ID ' + id)
    characterArray.push(character);
}

let newTree = (e, x, y) => {
    let character = new treeBoy(e, x, y);
    console.log('added new friendly tree with ID ' + e)
    treeArray.push(character);
}

let newBubble = (e, x, y) => {
    let character = new bubbleBoy(e, x, y);
    console.log('added new enemy bubble with ID ' + e)
    bubbleArray.push(character)
}

//events
let treefightEvent = () => {
    for (i = 0; i < 10; i++) {
        let randomX = Math.random()*windowWidth;
        let randomY = Math.random()*windowHeight;
        newTree(i, randomX, randomY);
    }
}

let ballfightEvent = () => {
    for (i = 0; i < 10; i++) {
        let randomX = Math.random()*windowWidth;
        let randomY = Math.random()*windowHeight;
        newBubble(i, randomX, randomY);
    }
}

let rainToggle = false;

let rainEvent = () => {

    rainToggle = true;
    console.log('its raining!')

    characterArray.forEach((element, index) => {
        element.levelDown(2)
    })

    setTimeout(() => {rainToggle = false}, 300)
}

let starDustToggle = false;

let giveStarDust = () => {
    console.log(delayTime)

    starDustToggle = true;
    console.log('stardust!!')

    characterArray.forEach((element) => {
        element.levelUp(3)
    })

    setTimeout(() => {rainToggle = false}, 300)

}

let addCloud = () => {
    cloudCount++
    newCharacter(cloudCount, 'happy');
}

// bluetooth microbit

let microBit = new uBit();
let accX;
let accY;
let moveX = 0;
let moveY = 0;

function searchDevice(){
    microBit.searchDevice();
    addCloud()
  }

function getAcc() {

        accX = microBit.getAccelerometer().x/30
        accY = microBit.getAccelerometer().y/30

        console.log(accX,accY)
}

//p5 functions

let delayTime = 0;
let cloudCount = 0;

function setup() {

    microBit.onConnect(function(){
        console.log("connected");
      });
    
    microBit.onDisconnect(function(){
        console.log("disconnected");
      });

    createCanvas(windowWidth, windowHeight);
    treefightEvent();
    ballfightEvent();

    //setup events
    characterArray.forEach((element, index) => {
        element.eatBubble();
    })

    //make test buttons
    starDustButton = createButton('Feed Star Dust');
    starDustButton.position(10,100);
    starDustButton.mousePressed(giveStarDust);

    blowSlider = createSlider(0, 5, 0.01);
    blowSlider.position(10,40)
    blowSlider.style('width', '80px');

    rainButton = createButton('Shower with some Rain');
    rainButton.position(10,70)
    rainButton.mousePressed(rainEvent)

    addButton = createButton('Add a Cloud Boy');
    addButton.position(10,100)
    addButton.mousePressed(addCloud)

    connectMicrobitButton = createButton('connect microbit');
    connectMicrobitButton.position(10,10)
    connectMicrobitButton.mousePressed(searchDevice);
    
}
  
function draw() {
    delayTime++;

    hurricaneSlider = blowSlider.value();
    background(228, 241, 245)
    //render every element from array

    treeArray.forEach((element, index) => {
        element.render();

    })

    bubbleArray.forEach((element, index) => {
        element.render();
        
    })

    getAcc()

    characterArray.forEach((element, index) => {
        element.render();
        element.currentPositionX = windowWidth/2 + moveX;
        element.currentPositionY = windowHeight/2 + moveY;


        //boundary

        if (element.currentPositionX > windowWidth) {
            element.currentPositionX = windowWidth;
        } else if (element.currentPositionY > windowHeight) {
            element.currentPositionY = windowHeight;
        } else if (element.currentPositionX < 0) {
            element.currentPositionX = 0
        } else if (element.currentPositionY < 0) {
            element.currentPositionY = 0
        }

        console.log(element.currentPositionX)

        element.eatTree()
        element.eatBubble()

        if ( hurricaneSlider > 1 ) {
            element.currentEmotion = 'dead';
        } else if ( rainToggle ) {
                element.currentEmotion = 'dead';
        } else if ( starDustToggle ) {
                element.currentEmotion = 'levelup';
        } else {
            element.currentEmotion = 'happy';
        }
    })

}

