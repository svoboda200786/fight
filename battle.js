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

var game, images, key_down;

const frameWidth = 224; // Ширина одного кадра
const frameHeight = 214; // Высота одного кадра

const directions = {
    "_Left" : -1,
    "_Right" : 1,    
};

const actions = ["punch", "jump", "block"];

// reaction — ответная рекация бота на наши действия
// chance — вероятность того, что это действие будет выбрано ботом
// name — имя реакции, отсылающее к названию действия (метода классов Player и Enemy)
// damage — урон
// resist — уменьшение урона
// complex — сложное действие, состоящее из двух или более. У него нет параметров,
// оно просто отсылает к методу классов Player и Enemy
// start и end — номера кадров начала и конца анимации
// once — действие, выванное единожды за одно нажатие клавиши (если зажали кнопку и не отпускаем),
// например walk вызывается постоянно, пока зажата клавиша, а блок при зажатой клавише
// вызовется только один раз — чтобы вызвать его еще раз надо отпустить клавишу и снова нажать
const frame_data = {
    punch_Right: { start: 0, end: 8,
        damage: 01,
        reaction: [{name: "block", chance: "0-50"}, {name: "punch", chance: "50-80"}, {name: "stand", chance: "80-100"}]
    },
    punch_Left: { start: 9, end: 17,
        damage: 01,
        reaction: [{name: "block", chance: "0-50"}, {name: "punch", chance: "50-80"}, {name: "stand", chance: "80-100"}]
    },
    block_Right: { start: 18, end: 26, resist: 1, once: false, active: {start:20, end:24},
        reaction: [{name: "punch", chance: "00-80"}, {name: "stand", chance: "80-100"}]
    },
    block_Left: { start: 27, end: 35, resist: 1 , once: false, active: {start:29, end:33},
        reaction: [{name: "punch", chance: "00-80"}, {name: "stand", chance: "80-100"}]
    },
    block_Right_Up: { start: 37, end: 45, resist: 1, once: false, active: {start:39, end:42},
        reaction: [{name: "punch", chance: "00-80"}, {name: "stand", chance: "80-100"}]    
    },
    block_Left_Up: { start: 46, end: 54, resist: 1, once: false, active: {start:48, end:52},
        reaction: [{name: "punch", chance: "00-80"}, {name: "stand", chance: "80-100"}]    
    },
    stand_Left: { start: 55, end: 60,
        reaction: [{name: "punch", chance: "0-60"}, {name: "kick", chance: "60-80"}, {name: "stand", chance: "80-100"}]
    },
    stand_Right: { start: 61, end: 67,
        reaction: [{name: "punch", chance: "0-60"}, {name: "kick", chance: "60-80"}, {name: "stand", chance: "80-100"}]
    },
    jump_Right: { start: 68, end: 75 },
    jump_Left: { start: 76, end: 83 },
    crouch_Right: {start: 85, end: 90, resist: 0.2, once: true },
    crouch_Right_Up: { start: 91, end: 93 , once: true },    
    crouch_Left: {start: 94, end: 98, resist: 0.2, once: true},
    crouch_Left_Up: { start: 99, end: 103 , once: true},   
    walk_Right: { start: 146, end: 154,
        reaction: [{name: "walk", chance: "0-50"}, {name: "jumpAsidePunch", chance: "50-60"}, {name: "stand", chance: "60-80"}, {name: "jumpAside", chance: "80-100"}]
    },
    walk_Left: { start: 155, end: 162,
        reaction: [{name: "walk", chance: "0-50"}, {name: "jumpAsidePunch", chance: "50-60"}, {name: "stand", chance: "60-80"}, {name: "jumpAside", chance: "80-100"}]
    },
    kick_Right_Up: { start: 163, end: 167, damage: 1,
        reaction: [{name: "block", chance: "0-50"}, {name: "punch", chance: "50-80"}, {name: "stand", chance: "80-100"}]
    },
    kick_Left_Up: { start: 168, end: 172, damage: 1,
        reaction: [{name: "block", chance: "0-50"}, {name: "punch", chance: "50-80"}, {name: "stand", chance: "80-100"}]
    },
    jumpAside_Right: {},
    jumpAside_Left: {},
    jumpAsidePunch_Right: {},
    jumpAsidePunch_Left: {},           
};

const keyToFrame = {
    'ArrowLeft': 'walk_Left',
    'ArrowRight': 'walk_Right',   
    'q': 'punch',
    'w': 'block',
    'e': 'block_Up',
    'a': 'crouch',    
    's': 'kick_Up',     
    ' ': 'jump' 
};

function getRand(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min
}

class Game{
    constructor(canvas, images){
        this.images = images;
        let player = new Player(canvas.width, canvas.height, images.player, 0, "player");
        this.player = player;
        this.characters = {
            player: player,
            enemy: new Enemy(canvas.width, canvas.height, images.enemy, 500, "bot"),
        }
        this.delta = 0;
        this.interval = 3; // скорость обновления канваса
    }

    updateAll(key){
        ctx.drawImage(this.images.background, 0, 0, canvas.width, canvas.height);
        
        for(let key in this.characters){
            if(key !== "player"){
                this.characters[key].collision();
            }

            this.characters[key].update();
        }

        if(game.over){
            ctx.drawImage(images.over,
            0, 0,
            images.over.width, images.over.height,
            canvas.width / 2 - images.over.width / 2 / 4,
            canvas.height / 2 - images.over.height / 2 / 4,
            images.over.width / 4, images.over.height / 4);
        }

        drawPanel(50, 50, 200, images.avatar, this.player, "Игрок");
        drawPanel(canvas.width - 250, 50, 200, images.avatar, this.characters.enemy, "Компьютер");        
    }


    run(){
        this.delta++;
        if (this.delta > this.interval) {

            this.updateAll();                

            this.delta = 0;
        }
        window.requestAnimationFrame(this.run.bind(this));
    }
}



window.addEventListener("load", async ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;  
    canvas.style._Left = 0;
    canvas.style.top = 0;
    document.body.style.cssText = "display: flex; justify-content: center; height: 100vh; align-items: center"; 
    document.body.style.background = "black";    
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";        
    images = {
        background: await loaderPicture("./content/background.png"),
        player: await loaderPicture("./content/player.png"),
        enemy: await loaderPicture("./content/enemy.png"),
        avatar: await loaderPicture("./content/1.jpg"), 
        over: await loaderPicture("./content/over.png"),               
    }
    game = new Game(canvas, images);
    game.run(); 

    canvas.width = images.background.width;
    canvas.height = images.background.height;   
    window.addEventListener('resize', event => { 
        canvas.width = images.background.width;
        canvas.height = images.background.height;
    })   
    document.addEventListener('keydown', event => {
        if(!key_down){
            var index;
            if(event.code.toLowerCase().split("key")[1]){
                index = event.code.toLowerCase().split("key")[1]; // e.key привязан к раскладке, поэтому берем e.code.
                // Если клавиша с буквой, то забираем код и берем из него название буквы.
                // Например, для клавиши "А" код "KeyA", значит  переменная index будет "A".       
            }
            else{// Клавиши без букв, например, стрелки. Для них можно использовать и e.code
                index = event.key;
            }

            const direction_hor = game.player.direction;

            if(!keyToFrame[index]){
                return; // нет такого действия, выходим
            }

            const name = keyToFrame[index].split("_");

            const str = name[0];
            const str2 = name[1];

            if(str2){
                var direction_vert = "_" + str2;                
            }
            else{
                var direction_vert = "";                 
            }

            // console.log(str + direction_hor + direction_vert)
            if(keyToFrame[index] && game.player.currentAction != keyToFrame[index]
                + direction_hor + direction_vert){
                // если нажаты стрелки, от отправляем в doAction значение как есть
                if(index == "ArrowLeft" || index == "ArrowRight"){
                    game.player.doAction(keyToFrame[index]);                    
                }
                // иначе проверяем, есть ли такой метод в классе Player,
                //  и делаем некоторые манипуляции с названием                
                else if(game.player[str + direction_hor + direction_vert]){                    
                    game.player.doAction(str + direction_hor
                    + direction_vert);       
                }
            }
            key_down = true;                       
        }
    });
    document.addEventListener('keyup', event => {
        key_down = false;
        // Поднимаемся с колен
        if(game.characters.player.currentAction == "crouch_Left"){
            game.characters.player.doAction("crouch_Left_Up")
        }
        if(game.characters.player.currentAction == "crouch_Right"){
            game.characters.player.doAction("crouch_Right_Up")
        }        
    });        
})

