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

let backgroundImg = './img/background.png';

let cloudAnim;
let treeAnim;
let bubbleAnim;
let disperseAnim;
let starAnim;

let treeGroup;
let bubleGroup;

var direction = 90; 


function chooseFace(){
    for (let displayFace of faceImage) {
        loadedFaceImage.push(loadImage(displayFace));
        console.log('loaded face' + displayFace)
    }
}

function loadOtherAssets(){
    //load animations
    
    treeAnim = loadAnimation('./img/anim/Tree/Tree_00000.png', './img/anim/Tree/Tree_00051.png');
    cloudAnim = loadAnimation('./img/anim/Cloud/Cloud_00000.png', './img/anim/Cloud/Cloud_00052.png');
    bubbleAnim = loadAnimation('./img/anim/Bubble/Bubble_00000.png', './img/anim/Bubble/Bubble_00050.png');
    starAnim = loadAnimation('./img/anim/Star/Star_00000.png', './img/anim/Star/Star_00052.png');
    disperseAnim = loadAnimation('./img/anim/CloudSplit/CloudSplit_00000.png', './img/anim/CloudSplit/CloudSplit_00052.png');

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
    this.currentAnimationState = 'floating',


    this.levelUp = (e) => {
        let currentLevel = this.currentLevel
        this.currentLevel = currentLevel + e;
        //show level up animation here
        this.currentAnimationState = 'levelup';
        this.currentEmotion = 'levelup';
        
        console.log("current level is " + currentLevel)
    },

    this.levelDown = (e) => {
        let currentLevel = this.currentLevel
        this.currentLevel = currentLevel - e;
        //show level up animation here
        console.log("current level is " + currentLevel)
    }

    this.switchEmotion = (x,y) => {
        switch (this.currentEmotion) {
            case 'happy':
                push();
                console.log("your cloud is happy");
                image(loadedFaceImage[faceImage.indexOf(happyFace)], x - 160, y - 180, 340, 340)
                break;
            case 'sad':
                push();
                console.log("your cloud is sad");
                image(loadedFaceImage[faceImage.indexOf(sadFace)], x - 160, y - 180, 340, 340)
                break;
            case 'dead':
                push();
                console.log("your cloud is dead");
                image(loadedFaceImage[faceImage.indexOf(deadFace)], x - 160, y - 180, 340, 340)
                break;
            case 'levelup':
                push();
                console.log("your cloud is levellingup");
                image(loadedFaceImage[faceImage.indexOf(levelupFace)], x - 160, y - 180, 340, 340)
                break;
            default:
                push();
                console.log("neutral");
                image(loadedFaceImage[faceImage.indexOf(movingFace)], x - 160, y - 180, 340, 340)
        }
    }

    this.switchAnimation = (x,y) => {
        switch (this.currentAnimationState) {
            case 'floating':
                push();
                animation(cloudAnim,x,y)
                pop();
                break;
            case 'levelup':
                push();
                animation(disperseAnim,x,y)
                disperseAnim.play()

                if (disperseAnim.getFrame() == disperseAnim.getLastFrame()) {
                    this.currentAnimationState = 'floating';
                    disperseAnim.rewind();
                }

                pop();
                break;
            default:
                push();
                animation(cloudAnim,x,y)
                pop();
            }
    }

    this.treeWall = (x,y) => {
        for ( i = 0; i < this.currentLevel && i < 7; i++ ) {

            if ( i == 0 ) {
                animation(treeAnim, x + 150, y);
            } else if ( i == 1 ) {
                animation(treeAnim, x + 150, y + 100);
            } else if ( i == 2 ) {
                animation(treeAnim, x, y + 200);
            } else if ( i == 3 ) {
                animation(treeAnim, x - 150, y + 100);
            } else if ( i == 4) {
                animation(treeAnim, x - 150, y);
            } else if ( i == 5) {
                animation(treeAnim, x - 150, y);
            } else if ( i == 6) {
                animation(treeAnim, x + 50, y + 50);
            }

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
        let posX = this.currentPositionX
        let posY = this.currentPositionY 

        this.switchAnimation(posX,posY);
        this.switchEmotion(posX,posY);
        this.treeWall(posX,posY)
        
        pop()
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
                element.killed = true;
                this.levelUp(1)
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

    // UI

    this.healthBar = () => {

        let posY = windowHeight - 80;
        let posX = 40;

        push()
        textSize(25);
        text('Health', posX, posY - 20);
        pop()

        push()
        strokeWeight(0)
        fill(234, 203, 195);
        rect(posX, posY, windowWidth/2, 25, 25);

        pop()
        push()
        strokeWeight(0)
        fill(250, 241, 237)
        rect(posX + 10, posY + 7, windowWidth/2 - 20, 10, 25);
        pop()
    }

    this.levelBar = () => {

        let posY = windowHeight - 160;
        let posX = 40;
        if (this.currentLevel = this.currentLevel)

        push()
        textSize(25);
        text('Your cloud is at level ' + this.currentLevel, posX, posY - 20);
        pop()
    }
}

function treeBoy(id, x, y) {
    this.treeID = id,
    this.alive = true,
    this.currentPositionX = x,
    this.currentPositionY = y,

    this.render = () => {
        push();
        //translate(p5.Vector.fromAngle(millis() / 4000, 10))
        animation(treeAnim, this.currentPositionX, this.currentPositionY);
        pop();
        //rotate(frameCount/50 * hurricaneSlider)
    }
}


function bubbleBoy(id, x, y) {
    this.bubbleID = id,
    this.alive = true,
    this.currentPositionX = x,
    this.currentPositionY = y,

    this.render = () => {
        push();
        animation(bubbleAnim, this.currentPositionX, this.currentPositionY);
        pop();
    }
}

let newCharacter = (id, emotion) => {
    let character = new cloudBoy(id, emotion, 100, 1);
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

    setTimeout(() => {starDustToggle = false}, 300)

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

        accX = microBit.getAccelerometer().x/10
        accY = microBit.getAccelerometer().y/10

        if (accX > 5) {
            moveX = moveX + 5;
        } else if (accX < -5 ) {
            moveX = moveX - 5;
        } else {
            moveX = moveX;
        }

        if (accY > 5) {
            moveY = moveY + 5;
        } else if (accY < -5 ) {
            moveY = moveY - 5;
        } else {
            moveY = moveY;
        }


        console.log(accX,accY)
}

//p5 functions

let delayTime = 0;
let cloudCount = 0;

function setup() {

    textFont('Poppins');


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

    //setup animations


    //make test buttons
    starDustButton = createButton('Feed Star Dust');
    starDustButton.position(10,130);
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

    //microbit get data every frame

    getAcc()

    hurricaneSlider = blowSlider.value();
    background(228, 241, 245)

    //render every element from array

    treeArray.forEach((element, index) => {
        element.render();

    })

    bubbleArray.forEach((element, index) => {
        element.render();
        
    })

    characterArray.forEach((element, index) => {
        element.render();
        element.currentPositionX = mouseX;
        element.currentPositionY = mouseY;


        //boundary

        if (element.currentPositionX > windowWidth) {
            element.currentPositionX = windowWidth;
            moveX = windowWidth;
        } else if (element.currentPositionY > windowHeight) {
            element.currentPositionY = windowHeight;
            moveY = windowHeight;
        } else if (element.currentPositionX < 0) {
            element.currentPositionX = 0;
            moveX = 0;
        } else if (element.currentPositionY < 0) {
            element.currentPositionY = 0;
            moveY = 0;
        }

        console.log(element.currentPositionX)
        console.log(moveX)

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

        element.healthBar()
        element.levelBar()
    })

    drawSprites();
    //render UI on top
}

