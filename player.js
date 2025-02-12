class Player{
    constructor(w, h, image, dx, type, name, frameWidth = 224, frameHeight = 214,
        frameSpeed = 1){
        this.x = w / 10 + dx;
        this.y = canvas.height - this.frameHeight / 2;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.currentFrame = 0;
        this.currentAction = "stand_Right";
        this.frameSpeed = frameSpeed;
        this.speed = 30;
        this.dx = 0;
        this.dy = 0;
        this.direction = '_Right';
        this.image = image;
        this.stopped = false; // блокировка передвижения
        this.stopCount = 0; // счетчик блокировки передвижения, по достижении нужного значения
        // персонаж снова сможет передвигаться
        this.nemesis = null; // противник
        this.type = type; // тип персонажа: игрок или робот
        this.name = name;
        this.idleCount = 0; // счтечик бездействия
        this.health = {
            max: 100,
            current: 100
        }
        this.rage = { //Ярость
            max: 100,
            current: 0,
        }
        this.stunCount = 0; // оглушение, когда соперник бьет критом после накопления яорсти
        this.coolDown = 0; // кулдаун на все действия после обычного действия, например, блока
        this.coolDownArray = []; // массив кулдаунов конкретных ударов
    }
    collision(){
        if(this.type == "bot"){
            this.potential_nemesis = game.player;
        }
        else{
            this.potential_nemesis = game.characters.enemy;            
        }

        // бот всегда смотрит в сторону игрока
        if(this.type == "bot"){        
            if(this.potential_nemesis.x <= this.x){
                this.direction = "_Left";
            }
            else{
                this.direction = "_Right";                 
            }
        }

        if(this.potential_nemesis){
            this.collision_distance = Math.abs(this.potential_nemesis.x - this.x);            
        }

        // переходим в остояние боя, если дистанция меньше определенного значения
        if(this.collision_distance <= 70){                
            if(!this.potential_nemesis.dy && !this.dy){ // Если мы в прыжке, то коллизия не срабатывает
                this.nemesis = this.potential_nemesis;

                if(this.stopCount >= 50){
                    this.stopped = false;                 
                }
                else if(this.nemesis.stunCount == 0){
                    if(!this.stopped){
                        this.stopCount = 1;                        
                    }
                    this.stopped = true;                                        
                }
                if(this.stopCount > 100){
                    this.stopCount = 1;                     
                }      
                if(this.stopCount > 0){
                    this.stopCount++;
                }
            }              
        }
        else if(this.nemesis){ // вышли из коллизии           
            this.nemesis = null;
            this.stopped = false;
            this.stopCount = 0;             
        }

        // подбегаем, если дистанция между противниками меньше нужной величины
        // или бездействие больше определенной величины (увеличивается в update класса Player)
        
        if(this.collision_distance < 300 || this.idleCount > 10){
        }
        else{
            this.stopped = false;  
            this.stopCount = 0;              
        }
    }
    update(){
        this.idleCount++;
        if(this.stunCount && this.stunCount <= 30){
            this.stunCount++;
                const count = 5; // число шагов (чем выше, тем быстрее)
                // Если противник кританул, нас отталкивает за дистанцию боя,
                //  то есть меняется dx, замедляясь к концу движения
                if(this.nemesis && this.stunCount > 0 && this.stunCount < count){
                    this.nemesis.stopped = false;
                    this.doAction('stand' + this.direction);
                    // косинус менятеся от 1 (при аргументе 0) до 0 (при аргументе Math.PI/2)
                    // this.stunCount изначальо будет равен 2, поэтому чтобы получить ноль, пишем this.stunCount-2
                    // делим Math.PI / 2 на count и получаем число секторов, которые надо тпройти
                    // 27 — целое число, при умножении на которое при count = 5 получим целое число, ближайшее к 71 (дистанция боя)
                    // 71 = x * ( Math.cos( 0 * Math.PI / 2 / 5) + Math.cos( 1 * Math.PI / 2 / 5) + Math.cos( 2 * Math.PI / 2 / 5) )
                    //  x = 71 / 2.7 = 27
                    this.nemesis.dx = 27 * directions[this.nemesis.direction] * -1 * Math.cos( (this.stunCount - 2) * Math.PI / 2 / count)
                    // console.log(this.nemesis.dx, this.stunCount)
                }

        }
        else{
            this.stunCount = 0;
        }

        if(this.coolDown && this.coolDown <= 2){
            this.coolDown++;            
        }
        else{
            this.coolDown = 0;
        }

        this.collision();

        const my_action_params = frame_data[this.name][this.currentAction];
        if(!game.over){
            if(this.rage.current > 0){
                if(!this.nemesis){
                    this.rage.current -= 0.2;                    
                }
                else{
                    this.rage.current -= 0.1;                    
                }
            }
            else{
                this.rage.current = 0;                
            }

            if(this.nemesis){
                const nemesis_action_params = frame_data[this.nemesis.name][this.nemesis.currentAction];
                if(this.type == "bot"){
                    if(this.nemesis.currentAction.split("_")[0] != "walk"){
                        this.reaction(nemesis_action_params);                
                    }
                    // если идем во время боя, то реакция как на действие stand
                    else{
                        this.reaction(frame_data[this.name]["stand" + this.nemesis.direction]);                
                    }                    
                }
                this.block(nemesis_action_params, my_action_params);
            }
            this.countFrameData(my_action_params);            
        }
        this.draw();
    }
    countFrameData(my_action_params){
        // game.player.rage.current = 100;
        // Если анимаци продолжается, то есть номер кадра менбше разнициы end и start
        var key = frame_data[this.name][this.currentAction];
        if(key && this.currentFrame < frame_data[this.name][this.currentAction].end - frame_data[this.name][this.currentAction].start - 1){
            this.currentFrame += this.frameSpeed;
            // Если прыжок и нет верхнего удара
            if(this.dy && this.currentAction.split("_")[0] != "kick"
                && this.currentAction.split("_")[2] != "Up"){
                // узнаем номер кадра в прыжке делением текущего значения dy на восьмую часть максимального значения dy.
                // 8 — число кадров в анимации прыжка
                this.currentFrame = Math.ceil( this.dy / (Math.PI / 8) );
            }

            if(!this.stopped && this.x >= 0 && this.x <= canvas.width){
                this.x += this.dx;
                if(this.x < 0){
                    this.x = 0;
                }
                else if(this.x > canvas.width){
                    this.x = canvas.width;
                }                                             
            }
        }
        // Если анимация завершилась
        else{
            this.complex = false;
            // Если отжата кнопка,
            // то меняем действие на stand и обнуляем dx, на случай если персонаж шел
            if(!key_down || this.type == "bot"){
                if(this.type != "bot" && !arrow_down || this.type == "bot" && !this.crouch ||
                    this.stunCount > 0){
                    this.doAction('stand' + this.direction);
                    if(this.type != "bot" && this.nemesis && this.nemesis.crouch){
                        this.nemesis.crouch = false;
                    }
                }
                else{
                    this.currentAction = "crouch" + this.direction + "_Down";                 
                }                    
                this.dx = 0; 
            }
            // Иначе просто обнуляем currentFrame кадра и анимация начнется снова
            else if(!my_action_params.once){
                this.currentFrame = 0;
                if(!this.stopped && this.x >= 0 && this.x <= canvas.width){
                    this.x += this.dx; // добавляем для плавности перемещение в конце анимации walk
                    if(this.x < 0){
                        this.x = 0;
                    }
                    else if(this.x > canvas.width){
                        this.x = canvas.width;
                    }
                }
            }               
        }
        // условие для прыжка
        if(this.dy){
            // примем максимально значение dy за число пи
            if(this.dy <= Math.PI){
                // косинус менятеся от 1 (при dy = 0) до 0 (при dy = Math.PI/2) и снова до 1 (при dy = Math.PI)
                // Поэтому к середине прыжка скорость замедлится до 0 (5 * 0 = 0)
                this.y -= 50 * Math.cos(this.dy);
                this.dy += Math.PI / 8;
            }
            // прыжок закончился
            if(this.dy > Math.PI){
                this.dy = 0;
                this.y = canvas.height - this.frameHeight / 2;
                this.doAction('stand' + this.direction);
                this.currentFrame = 0;
            }
        }
        // если прыжка нет, то персонаж всегда внизу экрана, даже если изменили размер окна
        else{
            this.y = canvas.height - this.frameHeight / 2;
        }
    }
    block(nemesis_action_params, my_action_params){
        // Проверка на блок и пересчет здоровья
        const [action_name, action_hor_direct, action_vert_direct] = this.currentAction.split("_");
        const [nemesis_action_name, nemesis_action_hor_direct, nemesis_action_vert_direct] = this.nemesis.currentAction.split("_");        
        const start = frame_data[this.name][this.nemesis.currentAction].start;
        const condition = this.nemesis.currentFrame == Math.round((nemesis_action_params.end - nemesis_action_params.start) / 2);
        const condition2 = "active" in frame_data[this.name][this.nemesis.currentAction]
        && start + this.nemesis.currentFrame > frame_data[this.name][this.nemesis.currentAction].active.start
        && start + this.nemesis.currentFrame < frame_data[this.name][this.nemesis.currentAction].active.end;
        
            // if(this.type == "bot" && this.nemesis.currentAction == "kick_Right_Up"){
            //     console.log(nemesis_action_params)
            //     console.log(this.nemesis.currentFrame, nemesis_action_params.end, nemesis_action_params.start)

            // }


        if("damage" in nemesis_action_params &&
        (nemesis_action_hor_direct == "Left" && this.nemesis.x > this.x ||
        nemesis_action_hor_direct == "Right" && this.nemesis.x < this.x)
            && (condition || condition2) ){
            let resist = 0;

            // противодействие урону
            const start2 = frame_data[this.name][this.currentAction].start;
            const condition3 = "active" in frame_data[this.name][this.currentAction]
            && start2 + this.currentFrame > frame_data[this.name][this.currentAction].active.start
            && start2 + this.currentFrame < frame_data[this.name][this.currentAction].active.end;

            // if(this.type == "player"){
            //     console.log()            
            // }
            let damage = nemesis_action_params.damage * 3;
            // Чем выше урон от противника, тем выше ярость
            const rage_delta = 10 * damage;
            if(condition3 && "resist" in my_action_params){ // если действие содержит resist
                // проверяем разнонаправленность по горизонтали ("_Left", "_Right")

                if(action_hor_direct != nemesis_action_hor_direct){
                    // проверяем совпадение направления по вертиакали ("Up", "Down", undefined)
                    if(action_vert_direct == nemesis_action_vert_direct){
                        resist = my_action_params.resist;
                        this.nemesis.coolDown = 2;
                    }
                }
                else{
                    this.rage.current += rage_delta;
                }      
                this.stopCount += 25;
            }
            else{
                this.rage.current += rage_delta;
            }

            if(this.rage.current > this.rage.max){
                this.rage.current = this.rage.max;
            }

            if(this.nemesis.rage.current >= this.nemesis.rage.max * 0.9){
                damage *= 10;
                this.nemesis.stunCount = 1;
                if(this.type == "player"){
                    this.nemesis.doAction("punch" + this.nemesis.direction);                    
                }             
                this.nemesis.rage.current = 0;
            }

            this.health.current -= damage - resist;
            if(this.health.current <= 0){
                this.health.current = 0;
                game.over = true;
                if(this.type == "bot"){
                    player_win++; 
                }
                else{
                    bot_win++;                     
                }
                round++;
                game.checkWin();
            }
        }
    }
    draw(){
        const key = frame_data[this.name][this.currentAction];
        if(key){
            const { start, end } = key;
            ctx.drawImage(this.image,
                (start + this.currentFrame) * this.frameWidth, 0,
                this.frameWidth, this.frameHeight,
                this.x - this.frameWidth / 2, this.y - this.frameHeight / 2, this.frameWidth, this.frameHeight);            
        }
    }
    // метод объединяет вызов анимации и метода действия (чтобы не вызывать анимацию в каждом действии отдельно)
    doAction(action){
        if(this.type != "bot"){
            if(frame_data[this.name][action]){
                if("cool_down" in frame_data[this.name][action]){                    
                    if(!this.coolDownArray[action]){
                        this.coolDownArray[action] = 0;
                    }
                    if(action == this.currentAction){
                        this.coolDownArray[action]++;                        
                    }
                    else{
                        this.coolDownArray[action] = 0;                        
                    }
                    // console.log(this.coolDownArray[action], action, this.currentAction)
                }                                
            }            
        }
        // frame_data[this.name][action].cool_down - 1 — отсчет от нуля, а ключ объекта от единицы
        if(this.stunCount > 0 || this.coolDown > 0
            || frame_data[this.name][action] 
            && frame_data[this.name][action].cool_down
            && this.coolDownArray[action]
            && this.coolDownArray[action] >= frame_data[this.name][action].cool_down - 1 ){
            
            if(this.coolDownArray[action] >= frame_data[this.name][action].cool_down - 1){
                this.coolDownArray[action] = 0; 
                this.stunCount = 1;               
            }

            // перезаписываем action            
            action = "stand" + this.direction;
        }
        if(!this.dy){ // производим удар, только если мы не в прыжке
            // Сложные действия, состоящие из нескольких, вернут флаг true.
            let complicated_action_flag;
            if(this[action]){
                complicated_action_flag = this[action](action); // вызываем конкретный метод действия или удара
            }
            else{
                console.log("Нет такого действия "  + action + " в объекте frame_data[this.name]")                
            }

            //  Без этого флага будет пытаться названчить в this.currentAction несуществующее действие
            if(frame_data[this.name][action] && !complicated_action_flag){
                this.currentAction = action; // это в том числе идентификатор для анимации                            
            }
        }
        // если в прыжке, то выполняются только верхние удары (все верхние удары называются kick)
        else{
            if(action.split("_")[0] == "kick" && action.split("_")[2] == "Up"){
                this.currentAction = "kick_Right_Up";
            }
        }
        this.currentFrame = 0;            
    }
    jumpAside_Right(){
        this.doAction("walk_Right");
        this.doAction("jump_Right");
        return true;
    }
    jumpAside_Left(){
        this.doAction("walk_Left");
        this.doAction("jump_Left");
        return true;
    }
    jumpAsidePunch_Right(){
        this.doAction("walk_Right");
        this.doAction("jump_Right");
        let context = this;
        setTimeout(function(){
            context.complex = true;
            context.doAction("kick_Right_Up")
        } , 100);
        return true;              
    }
    jumpAsidePunch_Left(){
        this.doAction("walk_Left");
        this.doAction("jump_Left");
        let context = this;
        setTimeout(function(){
            context.complex = true;
            context.doAction("kick_Left_Up")
        } , 100);
        return true;
    }    
    walkAway_Left(){ 
        if(!this.crouch){
            this.doAction("walk_Right");
            return true;
        }       
    }
    walkAway_Right(){   
        if(!this.crouch){
            this.doAction("walk_Left");
            return true;
        }
    }    
    walk_Left(){
        if(!this.stopped){
            this.dx = -this.speed;
        }
        this.direction = '_Left';        
    }
    walk_Right(){
        if(!this.stopped){
            this.dx = this.speed;
        }             
        this.direction = '_Right';
    }
    punch_Right(){

    }
    punch_Left(){

    }
    punch_Right_Down(){

    }
    punch_Left_Down(){

    }    
    block_Right(){

    }
    block_Left(){

    }
    block_Right_Up(){

    }
    block_Left_Up(){

    }
    block_Right_Down(){

    }
    block_Left_Down(action){
        // if(this.currentAction != "crouch_Left"){
        //     this.doAction("crouch_Left");
        //     // let context = this;
        //     // setTimeout(function(){
        //     //     // context.complex = true;
        //     //     context.doAction("punch_Left")
        //     // } , 100);          
        // }
        // // else{
        // //     this.currentAction = action;
        // // }
        // return true;
    }
    jump_Right(){
        this.dy = 0.1;
    }
    jump_Left(){
        this.dy = 0.1;
    }
    crouch_Right_Down(){
        if(this.type == "bot"){
            this.crouch = true;
        }
    }
    crouch_Left_Down(){
        if(this.type == "bot"){
            this.crouch = true;
        }
    }
    crouch_Right_Up(){
        if(this.type == "bot"){
            this.crouch = false;
        }        
    }
    crouch_Left_Up(){
        if(this.type == "bot"){
            this.crouch = false;
        } 
    }    
    kick_Right_Up(){

    }
    kick_Left_Up(){

    }
    stand_Left(action){
        if(this.currentAction == "crouch_Left_Down"){
            this.currentAction = "crouch_Left_Up";           
        }
        else{
            this.currentAction = action;
        }
        return true;
    }
    stand_Right(action){
        if(this.currentAction == "crouch_Right_Down"){
            this.currentAction = "crouch_Right_Up";           
        }
        else{
            this.currentAction = action;
        }
        return true;
    }
}