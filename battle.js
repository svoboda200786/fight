/////////////////////
const canvas = document.querySelector("#gameCanvas");

const intro_canvas = document.querySelector("#introCanvas");
const text_canvas = document.querySelector("#textCanvas");

const ctx = canvas.getContext('2d');
const intro_ctx = intro_canvas.getContext('2d');
const text_ctx = text_canvas.getContext('2d');

var game, round = 1, bot_win = 0, player_win = 0, images, key_down, arrow_down, mouse_down;

const frame_data = [];

var selected_level = 1;

const directions = {
    "_Left" : -1,
    "_Right" : 1,    
};

const actions = ["punch", "jump", "block"];

const levels = ["gg_cabinet", "bar", "car_salon"];

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

function setFrameData(level){ 
    frame_data["Игрок"] = new FrameData(timing["player"]);
    frame_data["Компьютер"] = new FrameData(timing[levels[level] + "_enemy_timing"]);

    // frame_data["Бармэн"] = new FrameData(bar_enemy_timing);

    for(var name in frame_data){
        for(var key in frame_data[name]){
            // есть start  в свойстве класса и есть такой же ключ в тайминге
            if("start" in frame_data[name][key] && frame_data[name].timing[key]){
                frame_data[name][key].start = frame_data[name].timing[key].start;
                frame_data[name][key].end = frame_data[name].timing[key].end;              
            }
        } 
    }    
}

function beforeGame(){
    game.start_menu = false;
    game.over = true;
    game.intro = true;
    setFrameData(selected_level);
    let player = new Player(canvas.width, canvas.height, game.images.player, 0, "player", "Игрок");
    game.player = player;
    game.characters = {
        player: player,
        enemy: new Enemy(canvas.width, canvas.height, game.images["enemy" + (selected_level + 1)], 500, "bot", "Компьютер"),
        // npc: new Player(canvas.width, canvas.height, images.enemy2, 800, "npc", "Бармэн", 148, 200, 2)
    } 
    game.buttons.button1.caption = "";                
    game.buttons.button2.caption = "";
    game.buttons.button3.caption = "";
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
    constructor(canvas, images, start = true){
        this.images = images;
        this.ui = null;
        this.start_menu = start;
        this.over = true;
        this.intro = false;
        this.timer = 0;        
        this.delta = 0;
        this.interval = 3; // скорость обновления канваса
        this.start_screen_timer = 0;
        this.start_screen_delta = 0;    

        this.round_time = 60;
        this.round_amount = 3;        

        this.time_bar = new Button(text_ctx, 5 * 1.5, 0.2, 100 / 1.5, 50 / 1.5 );            
        this.buttons = [];
        this.buttons["button1"] = new Button(text_ctx, 0.82, 2, 400, 50 );         
        this.buttons["button2"] = new Button(text_ctx, 0.82, 3.5, 400, 50 );
        this.buttons["button3"] = new Button(text_ctx, 0.82, 5, 400, 50 ); 

        this.ui = new UI();                   
    }

    updateAll(key){
        // if(this.characters.npc.currentFrame == 0){
        //     this.characters.npc.currentAction = test_actions[getRand(0, 5)];            
        // }
        if(!this.start_menu){
            ctx.drawImage(this.images["background" + (selected_level + 1)], 0, 0, canvas.width, canvas.height);
        }
        else{
            ctx.fillStyle = "#1B1212";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        if(this.over){
            if(!this.start_menu){
                if(!this.intro){
                    if(!this.buttons.button2.caption){
                        setTimeout(function(){
                            game.ui.clearAll();
                            game.buttons.button2.background = "purple";
                            game.buttons.button2.caption = "Press to continue";
                        }, 1000);
                    }                       
                    else{
                        this.buttons.button2.background = "purple";
                        this.buttons.button2.caption = "Press to continue";
                    }                    
                }
            }
            else if(this.ui){
                for(var i in this.buttons){
                    var button = this.buttons[i];
                    if(button.focus){
                        button.background = "orange";                        
                    } 
                    else{
                        button.background = "purple";                                             
                    }
                }
                this.buttons.button1.caption = "Chief cabinet";                
                this.buttons.button2.caption = "Bar room";
                this.buttons.button3.caption = "Car showroom";                
            }
        }
        // for(let key in this.characters){           
        //     this.characters[key].update();
        // }
        if(this.player){
            this.characters.enemy.update();             
            this.player.update();         
        }      

        this.start_screen_timer += 1;
        const vs_delay = 60;
        if(this.start_screen_timer > vs_delay){
            this.start_screen_delta += 20; 
        }

        if(!this.over && this.characters.enemy){
            this.ui.drawUserInfo(50, 50, 200, images.player_avatar, this.player, this.player.name, 210);
            this.ui.drawUserInfo(canvas.width - 250, 50, 200, images["bot_avatar" + (selected_level + 1)], this.characters.enemy, this.characters.enemy.name, -70);
            // this.ui.clearAll();
            // this.ui.drawTimeBar(intro_ctx, images.time_bar, false, 0, 1.5);
            // this.ui.drawTimeBar(text_ctx, images.time_bar_mask, true, 0, 1.5);
        }

        if(this.intro){
            this.ui.drawStartScreen(images.player_avatar, images["bot_avatar" + (selected_level + 1)], "", this.start_screen_delta, vs_delay);      
            if(this.start_screen_timer > vs_delay){
                this.ui.drawGameCaption(intro_ctx, images.fight, false, this.start_screen_delta);
                this.ui.drawGameCaption(text_ctx, images.fight, true, this.start_screen_delta);
            }
            else if(this.start_screen_timer > vs_delay / 2){               
                this.ui.drawGameCaption(text_ctx, images["round" + round], false, this.start_screen_delta); 
            }
            else{
                this.ui.drawGameCaption(text_ctx, images.vs, false, this.start_screen_delta);
            }
            if(this.start_screen_delta >= canvas.width / 2){
                this.ui.clearAll();
                this.intro = false;
                this.over = false;
            }
        }

        if(!this.over){
            this.timer++;        
        }
         // 60 fps канваса, но функция выывается в interval раз реже
        this.seconds = Math.floor(this.timer / (60 / this.interval) );

        if(this.seconds >= this.round_time && !this.over && this.characters.enemy){        
            this.over = true;
            if(this.player.health.current < this.characters.enemy.health.current){
                bot_win++;
                round++; 
            }
            if(this.player.health.current >= this.characters.enemy.health.current){
                player_win++;
                round++;  
            }
            this.checkWin();
        }            
    }
    checkWin(){
        if(round <= this.round_amount && player_win != 2 && bot_win != 2){
            firstState(false);
            beforeGame();            
        }
        else if(!this.buttons.button2.caption){
            if(bot_win > player_win){
                this.ui.drawGameCaption(text_ctx, images.over, false, this.start_screen_delta);
            }
            else{
                this.ui.drawGameCaption(text_ctx, images.win, false, this.start_screen_delta);
            }
        }
    }
}

function runGame(){
    game.delta++;
    if (game.delta > game.interval) {

        game.updateAll();                

        game.delta = 0;
    }
    requestAnimationFrame(runGame);
}

window.addEventListener("load", start);

function firstState(start = true){
    const container = document.querySelector(".container");  

    const css_string = "position: absolute;"  
    canvas.style.cssText = css_string + "z-index: 0";
    intro_canvas.style.cssText = css_string + "z-index: 1";     
    text_canvas.style.cssText = css_string + "z-index: 2";    
    document.body.style.cssText = "display: flex; justify-content: center; height: 100vh; align-items: center"; 
    // document.body.style.background = "black";    
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";

    canvas.width = intro_canvas.width = text_canvas.width = images.background1.width;
    canvas.height = intro_canvas.height = text_canvas.height = images.background1.height;

    container.style.width = canvas.width + "px";
    container.style.height = canvas.height + "px";    

    game = new Game(canvas, images, start); 
}

async function start(){   
    images = {
        background1: await loaderPicture("./content/background1.png"),
        background2: await loaderPicture("./content/background2.png"),
        background3: await loaderPicture("./content/background3.png"),                
        player: await loaderPicture("./content/player.png"),
        enemy1: await loaderPicture("./content/enemy1.png"),
        enemy2: await loaderPicture("./content/enemy2.png"),  
        enemy3: await loaderPicture("./content/enemy3.png"),                      
        over: await loaderPicture("./content/over.png"),
        win: await loaderPicture("./content/win.png"), 
        player_avatar: await loaderPicture("./content/player_avatar.png"), 
        bot_avatar1: await loaderPicture("./content/bot_avatar1.png"),
        bot_avatar2: await loaderPicture("./content/bot_avatar2.png"),
        bot_avatar3: await loaderPicture("./content/bot_avatar3.png"),        
        player_avatar_rage: await loaderPicture("./content/player_avatar_rage.png"), 
        bot_avatar_rage: await loaderPicture("./content/bot_avatar_rage.png"),                
        fight: await loaderPicture("./content/fight.png"),         
        vs: await loaderPicture("./content/vs.png"), 
        round1: await loaderPicture("./content/round1.png"), 
        round2: await loaderPicture("./content/round2.png"),         
        round3: await loaderPicture("./content/round3.png"),
        time_bar: await loaderPicture("./content/time_bar.png"),         
        time_bar_mask: await loaderPicture("./content/time_bar_mask.png"),                         
        lock: await loaderPicture("./content/lock.png"),  
        block: await loaderPicture("./content/block.png"),                                              
    }
    firstState();
    runGame(game);
    window.addEventListener('resize', event => { 
        canvas.width = images.background1.width;
        canvas.height = images.background1.height;
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
    text_canvas.addEventListener('mousemove', event => {
        for(var i in game.buttons){
            var button = game.buttons[i];
            if(button && button.caption){
                if(event.offsetX > button.x * button.width
                    && event.offsetX < button.x * button.width + button.width
                    && event.offsetY > button.y * button.height
                    && event.offsetY < button.y * button.height + button.height){
                    button.focus = true;
                    return;
                }
                else{
                    button.focus = false;                                    
                }            
            }            
        }
    });
    text_canvas.addEventListener('mousedown', event => {
        for(var i in game.buttons){
            var button = game.buttons[i];
            if(button && button.caption){
                if(event.offsetX > button.x * button.width
                    && event.offsetX < button.x * button.width + button.width
                    && event.offsetY > button.y * button.height
                    && event.offsetY < button.y * button.height + button.height){
                    button.pressed = true;
                    selected_level = Number(i.split("button")[1]) - 1;
                    if(selected_level != 1){
                        beforeGame();
                    }
                    else{
                        if(game.start_menu){
                            alert("Нет персонажа")
                            beforeGame();                            
                        }
                        else{
                            alert("Следующий уровень")
                            game.over = true; 
                            return;                            
                        }
                    }
                    return;
                }
                else{
                    button.pressed = false;                                    
                }            
            }            
        }
    });    
}
