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

//load audio
let starDustAudio = './audio/stardust_audio.mp3'
let bubbleAudio = './audio/bubble_audio.mp3'
let backgroundAudio = './audio/background_audio.mp3'

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
    cloudDisperseAnim = loadAnimation('./img/anim/CloudSplit/CloudSplit_00000.png', './img/anim/CloudSplit/CloudSplit_00033.png');
    cloudJoinAnim = loadAnimation('./img/anim/CloudJoin/CloudJoin_00002.png', './img/anim/CloudJoin/CloudJoin_00052.png');
    backgroundAnim = loadAnimation('./img/anim/Background/Background_00000.png', './img/anim/Background/Background_00162.png');
    rainAnim = loadAnimation('./img/anim/Rain/rain_00000.png', './img/anim/Rain/rain_00049.png');
    rainTransitionAnim = loadAnimation('./img/anim/rainTransition/RaindropTransition_00000.png', './img/anim/rainTransition/RaindropTransition_00049.png');
    
    gameoverTextAnim = loadAnimation('./img/anim/gameoverText/GameOverText_00002.png', './img/anim/gameoverText/GameOverText_00027.png');
    gameoverTextLoopAnim = loadAnimation('./img/anim/gameoverText/GameOverText_00027.png', './img/anim/gameoverText/GameOverText_00050.png');

    startscreenAnim = loadAnimation('./img/anim/startScreen/startScreen_00000.png', './img/anim/startScreen/startScreen_00098.png');
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
    this.isDead = false,
    this.currentLifespan = 0,
    

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
                animation(treeGrowAnim,x +  150,y + movement)

                if (treeGrowAnim.getFrame() == treeGrowAnim.getLastFrame()) {
                    treeGrowAnim.stop();
                    animation(treeAnim, x + 150, y + movement);
                }

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
                element.treeEaten = true;
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
                this.takeDamage(1)
                // killTree(element)
                element.burstBubble = true;

                setTimeout(() => {element.killed = true;}, 1000)

            }
        });

        bubbleArray = bubbleArray.filter(t => !t.killed);
    }

    // this.jumpMove = () => {
    //     if ( microBitFalling > 0 ) {
    //         this.currentPositionY = this.currentPositionY + (microBitFalling/100)
    //     }
    // }

    // UI

    this.healthBar = () => {

        let posY = windowHeight - 80;
        let posX = 40;
        let health = this.currentHealth;
        
        if ( health < 0 ) {
            health = 0;
        }

        push()
        textSize(16);
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

        let posY = windowHeight - 120;
        let posX = 40;

        push()
        textSize(16);
        text('Your cloud is at level ' + this.currentLevel, posX, posY - 20);
        pop()
    }

    this.noiseBar = () => {
        let posY = windowHeight - 80;
        let posX = windowWidth - 250;
        let noise = microBitNoiseLevel;
        let currentNoise;

        if ( microBitNoiseLevel > 90 ) {
            currentNoise = 'too noisy'
            screenShake(characterArray, 10, 0, 1)
            this.takeDamage(1);
        } else {
            currentNoise = 'quiet'
        }

        push()
        textSize(16);
        text('Your environment is ' + currentNoise, posX, posY - 20);
        pop()

        push()
        strokeWeight(0)
        fill(209, 232, 172);
        rect(posX, posY, 150, 25, 25);

        pop()
        push()
        strokeWeight(0)
        fill(232, 242, 216)
        rect(posX + 10, posY + 7, noise , 10, 25);
        pop()
    }

    this.displayLifespan = () => {
        let currentAge = this.currentLifespan - gameTimeArray[gameTimeArray.length-1];
        this.currentLifespan = currentAge;

        push()
        animation(bubbleAnim, windowWidth/2, windowHeight - 80);
        textSize(42);
        textAlign(CENTER);
        text(currentAge, windowWidth/2, windowHeight - 65);
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
                    animation(treeAnim, x, y);                
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
            case 'grow':
                push();
                animation(treeGrowAnim,x,y)

                if (treeGrowAnim.getFrame() == treeGrowAnim.getLastFrame()) {
                    this.currentAnimationState = 'normal';
                    this.treeGrow = false;
                    treeGrowAnim.rewind();
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
                    bubbleAudioLoaded.play()
                    setTimeout(() => {bubbleAudioLoaded.stop()}, 500)
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
let gameIsOver = false;
let gameRunning = false;
let gameRound = 0;
let gameTimeArray = [0];

let startGame = () => {
    gameIsOver = false;
    gameRunning = true;
    gameRound++
    if (cloudCount == 0) {
        addCloud()
        backgroundAudioLoaded.loop()
    } else {
        console.log(gameTimeArray)
    }
}

let restartGame = () => {

    gameIsOver = false;
    gameRunning = false;
    restartGameButton.hide()
    gameoverScreenAnimation.visible = false;

}

let gameOver = () => {
    gameTimeArray.push(characterArray[0].currentLifespan)
    console.log(gameTimeArray)

    gameIsOver = true;
    gameRunning = false;
    startGameButton.hide()
    connectMicrobitButton.hide()
    gameoverScreenAnimation.visible = true;

    
}

let treefightEvent = () => {
    for (i = 0; i < 6; i++) {
        let randomX = Math.random()*windowWidth;
        let randomY = Math.random()*windowHeight;
        newTree(i, randomX, randomY - windowHeight);
    }
}

let ballfightEvent = () => {
    for (i = 0; i < 10; i++) {
        let randomX = Math.random()*windowWidth;
        let randomY = Math.random()*windowHeight;
        newBubble(i, randomX, randomY - windowHeight);
    }
}

let rainToggle = false;

let rainEvent = () => {

    rainToggle = true;
    console.log('its raining!')
    characterArray.forEach((element, index) => {
        element.currentHealth = 2;
    })

}

let starDustToggle = false;

let giveStarDust = () => {
    console.log(delayTime)

    starDustToggle = true;
    console.log('stardust!!')

    characterArray.forEach((element) => {
        element.currentHealth = element.currentHealth + 3;
    })

    stardustAudioLoaded.play()
}

let addCloud = () => {
    cloudCount++
    newCharacter(cloudCount, 'happy');
}

let screenShaking = false;

let screenShake = (array, amplitudeX, amplitudeY, speed) => {
    screenShaking = true;

    array.forEach((element) => {
        element.currentPositionX = element.currentPositionX + (sin(frameCount / speed) * amplitudeX)
        element.currentPositionY = element.currentPositionY + (sin(frameCount / speed) * (amplitudeY/2))
    })
    
    setTimeout(() => {screenShaking = false}, 500)
}

let screenPushing = false;

let screenPush = (array, amplitudeX, amplitudeY) => {
    screenPushing = true;

    array.forEach((element) => {
        element.currentPositionX = element.currentPositionX + 1 * amplitudeX
        element.currentPositionY = element.currentPositionY + 1 * (amplitudeY/2)
    })
    
    setTimeout(() => {screenPushing = false}, 500)
}

let KillCloud = () => {
    characterArray.forEach((element) => {
        element.currentHealth = element.currentHealth - 10;
    })
}


// bluetooth microbit

let sortMessageArray = [];
let microBitIsShaking;
let microBitNoiseLevel;
let microBitIsSqueezed;
let microBitRotationX;
let microBitRotationY;
let numberOfDevices;

let accX = 0;
let accY = 0;

function microBitReceivedMessage(message){
    sortMessage = trim(message)
    sortMessageArray = sortMessage.split(',');

    sortMessageArray = sortMessageArray.map(v => +v);

    console.log(sortMessageArray)

    microBitIsShaking = sortMessageArray[0];
    microBitNoiseLevel = sortMessageArray[1];
    microBitIsSqueezed = sortMessageArray[2];
    microBitRotationY = sortMessageArray[3];
    microBitRotationX = sortMessageArray[4];
    numberOfDevices = sortMessageArray[5];

}

function microbitSpeed() {
    if ( microBitRotationX < 0 ) {
        accX = accX - 5
    } else if ( microBitRotationX > 0 ) {
        accX = accX + 5
    } else {
        accX = accX;
    }

    if ( microBitRotationY < 0 ) {
        accY = accY + 5
    } else if ( microBitRotationY > 0 ) {
        accY = accY - 5
    } else {
        accY = accY;
    }

    if ( microBitIsShaking == 1) {
        giveStarDust()
    } else if ( microBitIsSqueezed == 1 ) {
        rainEvent()
    }
}

function searchDevice() {
    microBitConnect();
}

let audioPhases = () => {
    if ( gameRunning == true && gameIsOver == false) {
            backgroundAudioLoaded.play()
    } else {
        backgroundAudioLoaded.stop()
    }

    if ( starDustToggle && stardustAudioLoaded.isPlaying() == false) {
        stardustAudioLoaded.play()
    } else {
        stardustAudioLoaded.stop()
    }
}

//p5 functions

let delayTime = 0;
let cloudCount = 0;
let logoAnimation;

let backgroundAudioLoaded;
let bubbleAudioLoaded;
let stardustAudioLoaded;

function setup() {

    textFont('Poppins');

    createCanvas(windowWidth, windowHeight);
    treefightEvent();
    ballfightEvent();

    //setup events

    backgroundAudioLoaded = loadSound(backgroundAudio);
    bubbleAudioLoaded = loadSound(bubbleAudio);
    stardustAudioLoaded = loadSound(starDustAudio);

    //setup animations


    // starDustButton = createButton('Feed Star Dust');
    // starDustButton.position(10,130);
    // starDustButton.mousePressed(giveStarDust);

    // rainButton = createButton('Shower with some Rain');
    // rainButton.position(10,70)
    // rainButton.mousePressed(rainEvent)

    // addButton = createButton('die');
    // addButton.position(10,100)
    // addButton.mousePressed(KillCloud)

    connectMicrobitButton = createButton('connect microbit');
    connectMicrobitButton.addClass('buttonStyle')
    connectMicrobitButton.mousePressed(searchDevice);
    connectMicrobitButton.hide()

    restartGameButton = createButton('restart game');
    restartGameButton.mousePressed(restartGame);
    restartGameButton.addClass('buttonStyle');
    restartGameButton.hide()

    startGameButton = createButton('make your own cloud!');
    startGameButton.mousePressed(startGame);
    startGameButton.addClass('buttonStyle');
    startGameButton.hide()

    logoAnimation = createSprite(windowWidth/2, windowHeight/2 - 50, 100, 100)
    logoAnimation.addAnimation('logo', startscreenAnim);
    logoAnimation.scale = 0.5;
    logoAnimation.visible = false;

    gameoverScreenAnimation = createSprite(windowWidth/2, windowHeight/2 - 50, 100, 100)
    gameoverScreenAnimation.addAnimation('gameover', gameoverTextAnim);
    gameoverScreenAnimation.addAnimation('gameoverloop', gameoverTextLoopAnim);
    gameoverScreenAnimation.scale = 0.5;
    gameoverScreenAnimation.visible = false;
}
  
function draw() {

        delayTime++;
        restartGameButton.hide()
        startGameButton.hide()
        connectMicrobitButton.hide()

        let floatMovement = sin(frameCount / 50) * 25

        //microbit get data every frame
    

        if ( gameRunning == true && gameIsOver == false ) {

            microbitSpeed();

            logoAnimation.visible = false;
            gameoverScreenAnimation.visible = false;

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
                    } else if ( element.treeGrow ) {
                        element.currentAnimationState = 'grow';
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

                    element.currentPositionX = accX;
                    element.currentPositionY = accY;
                    console.log(gameTimeArray)

                    if ( gameRunning == true && gameIsOver == false ) {
                        element.currentLifespan = Math.ceil((Math.ceil((1 + frameCount / 1 + getFrameRate())/100))) 
                    } else {
                        element.currentLifespan = element.currentLifespan;
                    }

            
                    //boundary
            
                    if (element.currentPositionX > windowWidth) {
                        element.currentPositionX = windowWidth;
                        accX = windowWidth;
                    } else if (element.currentPositionY > windowHeight) {
                        element.currentPositionY = windowHeight;
                        accY = windowHeight;
                    } else if (element.currentPositionX < 0) {
                        element.currentPositionX = 0;
                        accX = 0;
                    } else if (element.currentPositionY < 0) {
                        element.currentPositionY = 0;
                        accY = 0;
                    }
            
            
                    element.eatTree()
                    element.eatBubble()
                    element.displayLifespan()
                    // element.jumpMove()
            
                    if ( rainToggle ) {
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
            
                    if ( element.currentHealth <= 0 ) {
                        animation(rainTransitionAnim, windowWidth/2, windowHeight/2)
                            if (rainTransitionAnim.getFrame() == rainTransitionAnim.getLastFrame()) {
                                rainTransitionAnim.stop();
                                gameOver()

                                //stop from looping at 0 health after game is over
                                element.currentHealth = 300;
                            }

                    }
                    
                    if ( characterArray != 0 ) {
                        characterArray[0].healthBar()
                        characterArray[0].levelBar()
                        characterArray[0].noiseBar()
                    } 

                })
            
                //screenbased events
                if ( starDustToggle ) {
                    animation(stardustAnim, windowWidth/2, windowHeight/2)

                    //screen shake
                    screenShake(characterArray, 20, 5, 5)
                    screenShake(treeArray, 10, 5, 5)
                    screenShake(bubbleArray, 5, 2, 5)


                    if (stardustAnim.getFrame() == stardustAnim.getLastFrame()) {
                        stardustAnim.rewind();
                        starDustToggle = false
                    }
                } else if ( rainToggle ) {

                    rainAnim.play();

                    //screen shake
                    screenPush(characterArray, 0, 5)
                    screenPush(treeArray, 0, 10)
                    screenPush(bubbleArray, 0, 20)

                    animation(rainAnim, windowWidth/2, windowHeight/2)
                    if (rainAnim.getFrame() == rainAnim.getLastFrame()) {
                        rainAnim.stop();
                        rainToggle = false
                        rainAnim.rewind();
                    }
                }
            
                //reload when no more trees
                if ( treeArray.length == 0 || bubbleArray == 0 && gameIsOver == false) {
                    treefightEvent();
                    ballfightEvent();
                }
            
        } else if ( gameIsOver == false && gameRunning == false ) {
            push()
            background(226, 239, 247)
            
            logoAnimation.visible = true;
            logoAnimation.animation.play();
            startGameButton.position(windowWidth/2 - 350,windowHeight - 150 + floatMovement)
            startGameButton.show()  
            connectMicrobitButton.position(windowWidth/2 + 50,windowHeight - 150 + floatMovement)
            connectMicrobitButton.show()
            pop()
        } else if ( gameIsOver == true && gameRunning == false ) {
            push()
            background(60, 70, 73);
            textSize(16);
            fill(255,255,255)
            text('your cloud lasted ' + ( characterArray[0].currentLifespan ) + ' seconds.', windowWidth/2, windowHeight/2 + 120);
            restartGameButton.position(windowWidth/2 - 100,windowHeight - 150 + floatMovement)
            restartGameButton.show()
            
            gameoverScreenAnimation.animation.play();

            if (gameoverScreenAnimation.animation.getFrame() == gameoverScreenAnimation.animation.getLastFrame()) {
                gameoverScreenAnimation.changeAnimation('gameoverloop')
                gameoverScreenAnimation.animation.play();
            }

            pop()

        }

        drawSprites();
}

