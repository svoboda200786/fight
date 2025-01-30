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
const frameWidth = 224; // Ширина одного кадра
const frameHeight = 214; // Высота одного кадра

const frames = {
    punchRight: { start: 0, end: 8 },
    punchLeft: { start: 9, end: 18 },
    blockRight: { start: 19, end: 27 },
    blockLeft: { start: 28, end: 36 },
    blockUpRight: { start: 37, end: 45 },
    blockUpLeft: { start: 46, end: 54 },
    standLeft: { start: 55, end: 61 },
    standRight: { start: 62, end: 68 },
    jumpRight: { start: 69, end: 76 },
    jumpLeft: { start: 77, end: 84 },
    crouchRight: { start: 85, end: 90 },
    crouchLeft: { start: 91, end: 95 },
    walkRight: { start: 146, end: 154 },
    walkLeft: { start: 155, end: 162 },
    jumpPunchRight: { start: 163, end: 167 },
    jumpPunchLeft: { start: 168, end: 172 }
};


class Game{
    constructor(canvas, images){
        this.canvas  = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.images = images;
        this.player = new Player(canvas.width, canvas.height);
    }
    draw(){
        const { start, end } = frames[this.player.currentAction];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.images.background, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.images.player,
            (start + this.player.currentFrame) * frameWidth, 0,
            frameWidth, frameHeight,
            this.player.x, this.player.y, frameWidth, frameHeight);
    }

    update(){
        if(this.player.currentFrame < frames[this.player.currentAction].end - frames[this.player.currentAction].start){
            this.player.currentFrame += 1;
        }
    }
    run(){
        this.update();
        this.draw()
       // alert(this.player.currentFrame);
        window.requestAnimationFrame(this.run.bind(this));
        //window.setTimeout(this.run.bind(this), 1000);
    }
}

class Player{
    constructor(w, h){
        this.x = w / 10;
        this.y = h/ 1.37;
        this.currentFrame = 0;
        this.currentAction = "walkRight";
    }

}

window.addEventListener("load", async ()=>{
    const canvas = document.querySelector("#gameCanvas");
    const images = {
        background: await loaderPicture("./content/background.png"),
        player: await loaderPicture("./content/player.png"),
    }
    const game = new Game(canvas, images);
    game.run();
})