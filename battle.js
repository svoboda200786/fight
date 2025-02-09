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
const intro_canvas = document.querySelector("#introCanvas");
const text_canvas = document.querySelector("#textCanvas");

const ctx = canvas.getContext('2d');
const intro_ctx = intro_canvas.getContext('2d');
const text_ctx = text_canvas.getContext('2d');

var game, images, key_down, arrow_down;
var start_screen_timer = 0;
var start_screen_delta = 0;

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
// например walk вызывается постоянно, пока зажата клавиша, а удар при зажатой клавише
// вызовется только один раз — чтобы вызвать его еще раз надо отпустить клавишу и снова нажать
// no_return — значит, мы не возвращаемся в стойку после действия once. Например, мы присели crouch
// active — активные кадры, когда персонаж способен наносить урон, если не указано,
// то активна середина анимации
// cool_down — число ударов, после которых наступит заморозка


class FrameData{
    constructor(timing){
        this.timing = timing;
        this.punch_Right = {once: true, start: undefined, end: undefined,
            damage: 0.5,
            reaction: [{name: "block", chance: "0-50"}, {name: "punch", chance: "50-80"}, {name: "stand", chance: "80-100"}]
        };
        this.punch_Left = {once: true, start: undefined, end: undefined,
            damage: 0.5,
            reaction: [{name: "block", chance: "0-50"}, {name: "punch", chance: "50-80"}, {name: "stand", chance: "80-100"}]
        };
        this.punch_Right_Down = {once: true, start: undefined, end: undefined,
            damage: 0.5,
            reaction: [{name: "block", chance: "0-50"}, {name: "punch", chance: "50-80"}, {name: "crouch", chance: "80-100"}]
        };
        this.punch_Left_Down = {once: true, start: undefined, end: undefined,
            damage: 0.5,
            reaction: [{name: "block", chance: "0-50"}, {name: "punch", chance: "50-80"}, {name: "crouch", chance: "80-100"}]
        };
        this.block_Right = { start: undefined, end: undefined, resist: 1, active: {start:20, end:24},
            reaction: [{name: "punch", chance: "00-80"}, {name: "stand", chance: "80-100"}]
        };
        this.block_Left = { start: undefined, end: undefined, resist: 1 , active: {start:29, end:33},
            reaction: [{name: "punch", chance: "00-80"}, {name: "stand", chance: "80-100"}]
        };
        this.block_Right_Up = { start: undefined, end: undefined, resist: 1, active: {start:39, end:42},
            reaction: [{name: "punch", chance: "00-80"}, {name: "stand", chance: "80-100"}]    
        };
        this.block_Left_Up = { start: undefined, end: undefined, resist: 1, active: {start:48, end:52},
            reaction: [{name: "punch", chance: "00-80"}, {name: "stand", chance: "80-100"}]    
        };
        this.block_Right_Down = { start: undefined, end: undefined, resist: 1, active: {start:39, end:42},
            reaction: [{name: "punch", chance: "00-80"}, {name: "stand", chance: "80-100"}]    
        };
        this.block_Left_Down = { start: undefined, end: undefined, resist: 1, active: {start:48, end:52},
            reaction: [{name: "punch", chance: "00-80"}, {name: "stand", chance: "80-100"}]    
        };    
        this.stand_Left = { start: undefined, end: undefined,
            reaction: [{name: "punch", chance: "0-60"}, {name: "kick", chance: "60-80"}, {name: "stand", chance: "80-90"}, {name: "walkAway", chance: "90-100"}]
        };
        this.stand_Right = { start: undefined, end: undefined,
            reaction: [{name: "punch", chance: "0-60"}, {name: "kick", chance: "60-80"}, {name: "stand", chance: "80-90"}, {name: "walkAway", chance: "90-100"}]
        };
        this.jump_Right = { start: undefined, end: 76 },
        this.jump_Left = { start: undefined, end: 84 },
        this.crouch_Right_Down = {start: undefined, end: undefined, resist: 0.2, once: true , no_return: true,
            reaction: [{name: "crouch", chance: "0-50"}, {name: "punch", chance: "50-100"}]
        };
        this.crouch_Right_Up = { start: undefined, end: 94 , once: true , no_return: true,
            reaction: [{name: "crouch", chance: "0-100"}]
        };    
        this.crouch_Left_Down = {start: undefined, end: undefined, resist: 0.2, once: true, no_return: true,
            reaction: [{name: "crouch", chance: "0-50"}, {name: "punch", chance: "50-100"}]
        };
        this.crouch_Left_Up = { start: undefined, end: 104 , once: true, no_return: true,
            reaction: [{name: "crouch", chance: "0-100"}]
        };   
        this.walk_Right = { start: undefined, end: undefined,
            reaction: [{name: "walk", chance: "0-50"}, {name: "jumpAsidePunch", chance: "50-60"}, {name: "stand", chance: "60-80"}, {name: "jumpAside", chance: "80-100"}]
        };
        this.walk_Left = { start: undefined, end: undefined,
            reaction: [{name: "walk", chance: "0-50"}, {name: "jumpAsidePunch", chance: "50-60"}, {name: "stand", chance: "60-80"}, {name: "jumpAside", chance: "80-100"}]
        };
        this.kick_Right_Up = { start: undefined, end: undefined, once: true, damage: 1, cool_down: 3,
            reaction: [{name: "block", chance: "0-50"}, {name: "punch", chance: "50-80"}, {name: "stand", chance: "80-100"}]
        };
        this.kick_Left_Up = { start: undefined, end: undefined, once: true, damage: 1, cool_down: 4,
            reaction: [{name: "block", chance: "0-50"}, {name: "punch", chance: "50-80"}, {name: "stand", chance: "80-100"}]
        };
        this.jumpAside_Right = {};
        this.jumpAside_Left = {};
        this.jumpAsidePunch_Right = {};
        this.jumpAsidePunch_Left = {}; 
        this.walkAway_Right = {};
        this.walkAway_Left = {};         
    }
}

const frame_data = []; 
frame_data["Игрок"] = new FrameData(timing);
frame_data["Компьютер"] = new FrameData(timing);

frame_data["Бармэн"] = new FrameData(bar_enemy_timing);

for(var name in frame_data){
    for(var key in frame_data[name]){
        // есть start  в свойстве класса и есть такой же ключ в тайминге
        if("start" in frame_data[name][key] && frame_data[name].timing[key]){
            frame_data[name][key].start = frame_data[name].timing[key].start;
            frame_data[name][key].end = frame_data[name].timing[key].end;              
        }
    } 
}

const keyToFrame = {
    'ArrowLeft': 'walk_Left',
    'ArrowRight': 'walk_Right', 
    'ArrowDown': 'crouch',       
    'q': 'punch',
    'w': 'block',
    'e': 'block_Up',  
    's': 'kick_Up',     
    ' ': 'jump' 
};

const test_actions = [
    'punch_Left',
    'kick_Left_Up',
    'crouch_Left_Down',
    'block_Left_Up',
    'stand_Left',
    'jump_Left',
]

function getRand(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min
}

class Game{
    constructor(canvas, images){
        this.images = images;
        let player = new Player(canvas.width, canvas.height, images.player, 0, "player", "Игрок");
        this.player = player;
        this.characters = {
            player: player,
            enemy: new Enemy(canvas.width, canvas.height, images.enemy, 500, "bot", "Компьютер"),
            npc: new Player(canvas.width, canvas.height, images.enemy2, 800, "npc", "Бармэн", 148, 200, 2)
        }
        this.ui = null;
        this.over = true;
        this.intro = true;        
        this.delta = 0;
        this.interval = 3; // скорость обновления канваса
    }

    updateAll(key){
        if(this.characters.npc.currentFrame == 0){
            this.characters.npc.currentAction = test_actions[getRand(0, 5)];            
        }

        ctx.drawImage(this.images.background, 0, 0, canvas.width, canvas.height);
        
        for(let key in this.characters){
            this.characters[key].update();
        }

        start_screen_timer += 1;
        const vs_delay = 20;
        if(start_screen_timer > vs_delay){
            start_screen_delta += 20; 
        }

        if(!game.over){
            game.ui.drawUserInfo(50, 50, 200, images.player_avatar, this.player, this.player.name, 210);
            game.ui.drawUserInfo(canvas.width - 250, 50, 200, images.bot_avatar, this.characters.enemy, this.characters.enemy.name, -70);
        }

        if(game.over){
            if(game.bot_win){
                game.ui.drawGameCaption(text_ctx, images.over, false, start_screen_delta);
            }
            else if(game.player_win){
                game.ui.drawGameCaption(text_ctx, images.win, false, start_screen_delta);
            }
        }

        if(game.intro){
            game.ui.drawStartScreen(images.player_avatar, images.bot_avatar, "", start_screen_delta, vs_delay);      
            if(start_screen_delta > vs_delay){
                game.ui.drawGameCaption(intro_ctx, images.fight, false, start_screen_delta);
                game.ui.drawGameCaption(text_ctx, images.fight, true, start_screen_delta);
            }
            else{
                game.ui.drawGameCaption(text_ctx, images.vs, false, images.fight_start_screen_delta); 
            }
            if(start_screen_delta >= canvas.width / 2){
                game.ui.clearAll();
                game.intro = false;
                game.over = false;
            }
        }           
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
    const container = document.querySelector(".container");  

    const css_string = "position: absolute;"  
    canvas.style.cssText = css_string + "z-index: 0";
    intro_canvas.style.cssText = css_string + "z-index: 1";     
    text_canvas.style.cssText = css_string + "z-index: 2";    
    document.body.style.cssText = "display: flex; justify-content: center; height: 100vh; align-items: center"; 
    // document.body.style.background = "black";    
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";        
    images = {
        background: await loaderPicture("./content/background.png"),
        player: await loaderPicture("./content/player.png"),
        enemy: await loaderPicture("./content/enemy.png"),
        enemy2: await loaderPicture("./content/enemy2.png"),         
        over: await loaderPicture("./content/over.png"),
        win: await loaderPicture("./content/win.png"), 
        player_avatar: await loaderPicture("./content/player_avatar.png"), 
        bot_avatar: await loaderPicture("./content/bot_avatar.png"),
        player_avatar_rage: await loaderPicture("./content/player_avatar_rage.png"), 
        bot_avatar_rage: await loaderPicture("./content/bot_avatar_rage.png"),                
        fight: await loaderPicture("./content/fight.png"),         
        vs: await loaderPicture("./content/vs.png"),  
        lock: await loaderPicture("./content/lock.png"),  
        block: await loaderPicture("./content/block.png"),                                                 
    }

    canvas.width = intro_canvas.width = text_canvas.width = images.background.width;
    canvas.height = intro_canvas.height = text_canvas.height = images.background.height;

    container.style.width = canvas.width + "px";
    container.style.height = canvas.height + "px";    

    game = new Game(canvas, images);
    game.run(); 

    game.ui = new UI();
   
    window.addEventListener('resize', event => { 
        canvas.width = images.background.width;
        canvas.height = images.background.height;
    })   
    document.addEventListener('keydown', event => {  
        if(!key_down){           
            if(event.code.toLowerCase().split("key")[1]){
                var index = event.code.toLowerCase().split("key")[1]; // e.key привязан к раскладке, поэтому берем e.code.
                // Если клавиша с буквой, то забираем код и берем из него название буквы.
                // Например, для клавиши "А" код "KeyA", значит  переменная index будет "A".       
            }
            else{// Клавиши без букв, например, стрелки. Для них можно использовать и e.code
                var index = event.key;
            }

            if(!keyToFrame[index]){
                // продолжаем, если есть такое действие, иначе выходим
                return;
            }

            const direction_hor = game.player.direction;
            
            const name = keyToFrame[index].split("_");

            const str = name[0];

            // содержит "_Up" в конце
            const str2 = name[1];

            // флаг для нижних ударов.          
            if(index == "ArrowDown"){
                arrow_down = true;
            }

            if(str2){
                var direction_vert = "_" + str2;                
            }
            else if(arrow_down){
                var direction_vert = "_Down";                
            }
            else{
                var direction_vert = "";                 
            }

            if(keyToFrame[index] && game.player.currentAction != keyToFrame[index]
                + direction_hor + direction_vert){
                // если нажаты стрелки, от отправляем в doAction значение как есть
                if(index == "ArrowLeft" || index == "ArrowRight"){
                    game.player.doAction(keyToFrame[index]);                    
                }
                // иначе проверяем, есть ли такой метод в классе Player,
                //  и делаем некоторые манипуляции с названием                
                else if(game.player[str + direction_hor + direction_vert]){                 
                    game.player.doAction(str + direction_hor + direction_vert);       
                }
            }
            if(index != "ArrowDown"){
                key_down = true;
            }                       
        }
    });
    document.addEventListener('keyup', event => {
        const index = event.key;
        // Если не зажата кнопка "Вниз", сбрасываем индикатор зажатой клавиши
        if(index == "ArrowDown"){
            arrow_down = false;                                     
        }

        key_down = false;
    });        
})

