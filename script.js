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
let cloudDisperseAnim;
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
    
    treeGrowAnim = loadAnimation('./img/anim/TreeGrow/TreeGrow_00000.png', './img/anim/TreeGrow/TreeGrow_00033.png');
    treeAnim = loadAnimation('./img/anim/Tree/Tree_00000.png', './img/anim/Tree/Tree_00051.png');
    treeEatenAnim = loadAnimation('./img/anim/TreeEaten/TreeEaten_00000.png', './img/anim/TreeEaten/TreeEaten_00026.png');
    cloudAnim = loadAnimation('./img/anim/Cloud/Cloud_00000.png', './img/anim/Cloud/Cloud_00052.png');
    bubbleAnim = loadAnimation('./img/anim/Bubble/Bubble_00000.png', './img/anim/Bubble/Bubble_00050.png');
    bubblePopAnim = loadAnimation('./img/anim/BubblePop/BubblePop_00000.png', './img/anim/BubblePop/BubblePop_00024.png');
    starAnim = loadAnimation('./img/anim/Star/Star_00000.png', './img/anim/Star/Star_00052.png');
    cloudDisperseAnim = loadAnimation('./img/anim/CloudSplit/CloudSplit_00000.png', './img/anim/CloudSplit/CloudSplit_00052.png');
    cloudJoinAnim = loadAnimation('./img/anim/CloudJoin/CloudJoin_00002.png', './img/anim/CloudJoin/CloudJoin_00052.png');
    backgroundAnim = loadAnimation('./img/anim/Background/Background_00000.png', './img/anim/Background/Background_00162.png');

    stardustAnim = loadAnimation('./img/anim/stardust/stardust_00009.png', './img/anim/stardust/stardust_00091.png');

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
    this.isDead = false;
    

    this.levelUp = (e) => {
        let currentLevel = this.currentLevel
        this.currentLevel = currentLevel + e;
        levelupToggle = true;
        setTimeout(() => {levelupToggle = false}, 1000)

        //show level up animation here
        this.currentAnimationState = 'disperse';
        console.log("current level is " + currentLevel)
    },

    this.levelDown = (e) => {
        let currentLevel = this.currentLevel
        this.currentLevel = currentLevel - e;
        hurtToggle = true;
        setTimeout(() => {hurtToggle = false}, 1000)

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
                console.log("your cloud is levelling up");
                image(loadedFaceImage[faceImage.indexOf(levelupFace)], x - 160, y - 180, 340, 340)
                break;
            case 'xxFace':
                push();
                console.log("your cloud is dead");
                image(loadedFaceImage[faceImage.indexOf(xxFace)], x - 160, y - 180, 340, 340)
                break;
            case 'moving':
                push();
                console.log("your cloud is moving");
                image(loadedFaceImage[faceImage.indexOf(movingFace)], x - 160, y - 180, 340, 340)
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
            case 'disperse':
                push();
                animation(cloudDisperseAnim,x,y)
                cloudDisperseAnim.play()

                if (cloudDisperseAnim.getFrame() == cloudDisperseAnim.getLastFrame()) {
                    this.currentAnimationState = 'join';
                    cloudDisperseAnim.rewind();
                }

                pop();
                break;
            case 'join':
                push();
                animation(cloudJoinAnim,x,y)
                cloudJoinAnim.play()

                if (cloudJoinAnim.getFrame() == cloudJoinAnim.getLastFrame()) {
                    this.currentAnimationState = 'floating';
                    cloudJoinAnim.rewind();
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
        push()
        let movement = sin(frameCount / 50) * 25
        for ( i = 0; i < this.currentLevel && i < 8; i++ ) {

            if ( i == 0 ) {
                animation(treeAnim, x + 150, y + movement);
            } else if ( i == 1 ) {
                animation(treeAnim, x + 125, y + 100 + movement);
            } else if ( i == 2 ) {
                animation(treeAnim, x, y + 150 + movement);
            } else if ( i == 3 ) {
                animation(treeAnim, x - 125, y + 100 + movement);
            } else if ( i == 4) {
                animation(treeAnim, x - 150, y + movement);
            } else if ( i == 5) {
                animation(treeAnim, x - 125, y - 105 + movement);
            } else if ( i == 6) {
                animation(treeAnim, x, y - 150 + movement);
            } else if ( i == 7) {
                animation(treeAnim, x + 125, y - 105 + movement);
            }


        }
        pop()
    }

    this.takeDamage = (e) => {
        let newHealth = this.currentHealth - e;
        this.currentHealth = newHealth;
        hurtToggle = true;
        setTimeout(() => {hurtToggle = false}, 1000)

        console.log(this.currentHealth);
    }

    //renders this object
    this.render = () => {

        push();
        let movement = cos(frameCount / 50) * 50
        let cloudSize = 150 + this.currentLevel*10;
        let posX = this.currentPositionX
        let posY = this.currentPositionY + movement

        this.treeWall(posX,posY)
        this.switchAnimation(posX,posY);
        this.switchEmotion(posX,posY);
        
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
                element.killed = true;
                this.levelUp(1)

                element.treeEaten = true;

                setTimeout(() => {element.killed = true;}, 1000)
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
                this.takeDamage(1)
                // killTree(element)
                element.burstBubble = true;

                setTimeout(() => {element.killed = true;}, 1000)

            }
        });

        bubbleArray = bubbleArray.filter(t => !t.killed);
    }

    // UI

    this.healthBar = () => {

        let posY = windowHeight - 80;
        let posX = 40;
        let health = this.currentHealth;
        
        if ( health < 0 ) {
            health = 0;
        }

        push()
        textSize(25);
        text('Your current health is ' + health, posX, posY - 20);
        pop()

        push()
        strokeWeight(0)
        fill(234, 203, 195);
        rect(posX, posY, 320, 25, 25);

        pop()
        push()
        strokeWeight(0)
        fill(250, 241, 237)
        rect(posX + 10, posY + 7, health , 10, 25);
        pop()
    }

    this.levelBar = () => {

        let posY = windowHeight - 160;
        let posX = 40;

        push()
        textSize(25);
        text('Your cloud is at level ' + this.currentLevel, posX, posY - 20);
        pop()
    }
}

//Tree

function treeBoy(id, x, y) {
    this.treeID = id,
    this.alive = true,
    this.currentPositionX = x,
    this.currentPositionY = y,
    this.currentAnimationState = 'normal',
    this.treeEaten = false;
    this.treeGrow = false;

    this.render = () => {
        push();
        //translate(p5.Vector.fromAngle(millis() / 4000, 10))
        posX = this.currentPositionX
        posY = this.currentPositionY
        this.switchAnimation(posX,posY)
        pop();
        //rotate(frameCount/50 * hurricaneSlider)
    }

    this.switchAnimation = (x,y) => {
        switch (this.currentAnimationState) {
            case 'normal':
                push();
                animation(treeGrowAnim,x,y)

                if (treeGrowAnim.getFrame() == treeGrowAnim.getLastFrame()) {
                    treeGrowAnim.stop();
                    animation(treeAnim, x, y);
                }
                
                pop();
                break;
            case 'eaten':
                push();
                animation(treeEatenAnim,x,y)

                if (treeEatenAnim.getFrame() == treeEatenAnim.getLastFrame()) {
                    this.currentAnimationState = 'normal';
                    this.treeEaten = false;
                    treeEatenAnim.rewind();
                }

                pop();
                break;
            default:
                push();
                animation(bubbleAnim,x,y)
                pop();
            }
    }
}


function bubbleBoy(id, x, y) {
    this.bubbleID = id,
    this.alive = true,
    this.currentPositionX = x,
    this.currentPositionY = y,
    this.currentAnimationState = 'normal'
    this.burstBubble = false;

    this.render = () => {
        push();
        posX = this.currentPositionX
        posY = this.currentPositionY
        this.switchAnimation(posX,posY)
        pop();
    }

    this.switchAnimation = (x,y) => {
        switch (this.currentAnimationState) {
            case 'normal':
                push();
                animation(bubbleAnim, x, y);
                pop();
                break;
            case 'burst':
                push();
                animation(bubblePopAnim,x,y)

                if (bubblePopAnim.getFrame() == bubblePopAnim.getLastFrame()) {
                    this.currentAnimationState = 'normal';
                    this.burstBubble = false;
                    bubblePopAnim.rewind();
                }

                pop();
                break;
            default:
                push();
                animation(bubbleAnim,x,y)
                pop();
            }
    }
}

let newCharacter = (id, emotion) => {
    let character = new cloudBoy(id, emotion, 300, 1);
    character.gameOver = false;
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
let levelupToggle = false;
let hurtToggle = false;

let treefightEvent = () => {
    for (i = 0; i < 5; i++) {
        let randomX = Math.random()*windowWidth;
        let randomY = Math.random()*windowHeight;
        newTree(i, randomX, randomY);
    }
}

let ballfightEvent = () => {
    for (i = 0; i < 5; i++) {
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
        element.currentHealth = 0;
    })
}

let starDustToggle = false;

let giveStarDust = () => {
    console.log(delayTime)

    starDustToggle = true;
    console.log('stardust!!')

    characterArray.forEach((element) => {
        element.levelUp(3)
    })

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
    //background
    animation(backgroundAnim, windowWidth/2, windowHeight/2)

    //render every element from array

    treeArray.forEach((element, index) => {

        //scrolling screen
        element.currentPositionY = element.currentPositionY + 3;
        element.currentPositionX = element.currentPositionX + cos(frameCount / 10)*2;

        if ( element.currentPositionY > (windowHeight + 100) ) {
            element.currentPositionY = -100;
            element.currentPositionY = element.currentPositionY + 3;
        }

        element.render();

        if ( element.treeEaten ) {
            element.currentAnimationState = 'eaten';
        } else {
            element.currentAnimationState = 'normal';
        }

    })

    bubbleArray.forEach((element, index) => {

        //scrolling screen
        element.currentPositionY = element.currentPositionY + 3;
        element.currentPositionX = element.currentPositionX + cos(frameCount / 30)*2;

        if ( element.currentPositionY > (windowHeight + 100) ) {
            element.currentPositionY = -100;
            element.currentPositionY = element.currentPositionY + 3;
        }

        element.render();

        if ( element.burstBubble ) {
            element.currentAnimationState = 'burst';
        } else {
            element.currentAnimationState = 'normal'
        }
        
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
 
        } else if ( levelupToggle ) {
            element.currentEmotion = 'levelup';
        } else if ( hurtToggle ) {
            element.currentEmotion = 'xxFace';
        } else {
            element.currentEmotion = 'happy';
        }

        element.healthBar()
        element.levelBar()
    })

    //screenbased events
    if ( starDustToggle ) {
        animation(stardustAnim, windowWidth/2, windowHeight/2)
        if (stardustAnim.getFrame() == stardustAnim.getLastFrame()) {
            stardustAnim.rewind();
            starDustToggle = false
        }
    }


    //reload when no more trees
    if ( treeArray.length == 0 || bubbleArray == 0 && gameOverToggle == false) {
        treefightEvent();
        ballfightEvent();
    }

    drawSprites();
    //render UI on top
}

