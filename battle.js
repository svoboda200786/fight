function loaderPicture(path){
    const image = new Image();
    image.src = path;
    return new Promise((resolve, reject) => {
        image.addEventListener('load', ()=>{
            resolve(image);
        });
        image.addEventListener('error', ()=>{
            reject("Error of load");
        });
    })
}

/////////////////////
const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext('2d');

var game, key_down;

const frameWidth = 224; // Ширина одного кадра
const frameHeight = 214; // Высота одного кадра

const frames = {
    punch_Right: { start: 0, end: 8 },
    punch_Left: { start: 9, end: 18 },
    block_Right: { start: 19, end: 27 },
    block_Left: { start: 28, end: 36 },
    blockUp_Right: { start: 37, end: 45 },
    blockUp_Left: { start: 46, end: 54 },
    stand_Left: { start: 55, end: 61 },
    stand_Right: { start: 62, end: 68 },
    jump_Right: { start: 68, end: 75 },
    jump_Left: { start: 76, end: 83 },
    crouch_Right: { start: 85, end: 90 },
    crouch_Right_Up: { start: 91, end: 93 },    
    crouch_Left: { start: 94, end: 98 },
    crouch_Left_Up: { start: 99, end: 103 },   
    walk_Right: { start: 146, end: 154 },
    walk_Left: { start: 155, end: 162 },
    jumpPunch_Right: { start: 163, end: 167 },
    jumpPunch_Left: { start: 168, end: 172 }
};

const keyToFrame = {
    'a': 'punch_Right',
    'q': 'punch_Left',
    'ArrowLeft': 'walk_Left',
    'ArrowRight': 'walk_Right',   
    'a': 'punch_Right',
    'q': 'punch_Left',
    'd': 'block_Right',
    'e': 'block_Left',
    'r': 'blockUp_Right',
    'f': 'blockUp_Left',
    'c': 'crouch_Right', 
    'x': 'crouch_Left',
    'y': 'jumpPunch_Right', 
    't': 'jumpPunch_Left',     
    ' ': null  // обновляется при нажатии пробела ниже 
};

class Game{
    constructor(canvas, images){
        this.images = images;
        this.player = new Player(canvas.width, canvas.height, images.player);
        this.delta = 0;
        this.interval = 10;
    }
    drawAll(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.images.background, 0, 0, canvas.width, canvas.height);
        this.player.draw();
    }
    update(){

    }
    run(){
        this.delta++;
        if (this.delta > this.interval) {
            // if(this.player.currentAction){
            //     this.update();               
            // }            
            if(this.player.currentAction){
                this.drawAll();               
            }         
            this.delta = 0;
        }
        window.requestAnimationFrame(this.run.bind(this));
    }
}

class Player{
    constructor(w, h, image){
        this.x0 = w / 10;
        this.y0 = h/ 1.37;        
        this.x = w / 10;
        this.y = h/ 1.37;
        this.currentFrame = 0;
        this.currentAction = "stand_Right";
        this.speed = 10;
        this.dx = 1;
        this.dy = 0;
        this.direction = '_Right';
        this.image = image;        
    }
    update(){ 
        if(this.currentFrame < frames[this.currentAction].end - frames[this.currentAction].start){
            this.currentFrame += 1;
            if(this.dy){
                this.currentFrame = Math.ceil( this.dy / (Math.PI / 8) );                
            }
            //console.log(this.currentFrame, this.currentAction)
            this.x += this.dx;                  
        }
        else{
            if(!key_down){
                //console.log(this.currentAction, this.currentFrame)
                this.currentAction = 'stand' + this.direction; 
                this.dx = 0;  
                this.currentFrame = 0;                                                          
            }
            else if(this.dx != 0){ // не анимируем больше одного раза, если кнопка зажата и действие не walk (this.dx == 0) 
                this.currentFrame = 0;                
                this.x += this.dx; // добавляем для плавности перемещение в конце анимации                              
            }                               
        }
        if(this.dy){
            if(this.dy <= Math.PI){
                this.dy += Math.PI / 8;
                this.y -= 5 * Math.cos(this.dy);            
            }
            if(this.dy > Math.PI){
                this.dy = 0;
                this.y = this.y0; 
                this.currentAction = 'stand' + this.direction;
                this.currentFrame = 0;    
            }            
        }
    }
    draw(){
        this.update();
        const { start, end } = frames[this.currentAction];            
        ctx.drawImage(this.image,
            (start + this.currentFrame) * frameWidth, 0,
            frameWidth, frameHeight,
            this.x, this.y, frameWidth, frameHeight);            
    }
    punch_Right(){

    }
    punch_Left(){

    }
    walk_Left(e){
        // e.preventDefault();
        this.dx = -this.speed;
        this.direction = '_Left';
    }
    walk_Right(e){
        // e.preventDefault();                   
        this.dx = this.speed;
        this.direction = '_Right';
    }
    punch_Right(){

    }
    punch_Left(){

    }
    block_Right(){

    }
    block_Left(){

    }
    blockUp_Right(){

    }
    blockUp_Left(){
            
    }
    jump_Right(){
        this.dy = 0.1;
    }
    jump_Left(){
        this.dy = 0.1;
    }
    crouch_Right(){

    } 
    crouch_Left(){

    } 
    jumpPunch_Right(){

    }     
    jumpPunch_Left(){

    } 
}

window.addEventListener("load", async ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;  
    canvas.style._Left = 0;
    canvas.style.top = 0;
    document.body.style.overflow = "hidden"; 
    document.body.style.margin = "0";        
    const images = {
        background: await loaderPicture("./content/background.png"),
        player: await loaderPicture("./content/player.png"),
    }
    game = new Game(canvas, images);
    game.run();
    window.addEventListener('resize', event => { 
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    })   
    document.addEventListener('keydown', event => {
        var index;
        if(event.code.toLowerCase().split("key")[1]){
            index = event.code.toLowerCase().split("key")[1]; // e.key привязан к раскладке, поэтому берем e.code.
            // Если клавиша с буквой, то забираем код и берем из него название буквы.
            // Например, для клавиши "А" код "KeyA", значит  переменная index будет "A".       
        }
        else{ // Клавиши без букв, например, стрелки. Для них можно использовать и e.code
            index = event.key;
        }

        keyToFrame[' '] = game.player.direction == '_Right' ? 'jump_Right' : 'jump_Left'; // назначаем прыжок на пробел

        if(keyToFrame[index] && game.player.currentAction != keyToFrame[index]){
            game.player.currentAction = keyToFrame[index];                    
            if(game.player[game.player.currentAction]){
                game.player[game.player.currentAction](event);       
                game.player.currentFrame = 0; 
                game.player.currentFrame = 0;                            
            }
        }
        key_down = true;
    });
    document.addEventListener('keyup', event => {
        key_down = false;
        if(game.player.currentAction == "crouch" + game.player.direction){
            game.player.currentAction = "crouch" + game.player.direction + "_Up";
            game.player.currentFrame = 0;
            // console.log(game.player.currentAction)
        }
        
    });        
})

