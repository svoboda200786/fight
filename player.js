class Player{
    constructor(w, h, image, dx, type){
        this.x = w / 10 + dx;
        this.y = canvas.height - frameHeight / 2;
        this.currentFrame = 0;
        this.currentAction = "stand_Right";
        this.speed = 30;
        this.stopped = false;
        this.dx = 1;
        this.dy = 0;
        this.direction = '_Right';
        this.image = image;
        this.stop = false; // блокировка передвижения
        this.stopCount = 0; // счетчик блокировки передвижения, по достижении нужного значения
        // персонаж снова сможет передвигаться
        this.nemesis = null; // противник
        this.type = type; // тип персонажа: игрок или робот
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
        this.coolDown = 0; // кулдаун после обычного действия, например, блока
    }
    update(){
        this.idleCount++;
        if(this.stunCount && this.stunCount <= 30){
            this.stunCount++;            
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

        const my_action_params = frame_data[this.currentAction];
        if(!game.over){
            if(this.nemesis){
                const nemesis_action_params = frame_data[this.nemesis.currentAction];
                if(this.nemesis.currentAction.split("_")[0] != "walk"){
                    this.reaction(nemesis_action_params);                
                }
                // если идем во время боя, то реакция как на действие stand
                else{
                    this.reaction(frame_data["stand" + this.nemesis.direction]);                
                }

                this.block(nemesis_action_params, my_action_params);
            }
            this.countFrameData(my_action_params);            
        }

        this.draw();
    }
    reaction(nemesis_action_params){
        if(this.type == "bot"){
            if(this.currentFrame == 0){ // Если предыдущая анимация завершилась
                this.idleCount = 0;
                if( "reaction" in nemesis_action_params){
                    const rand = getRand(1, 100); // число для случайного ответа
                    for(var obj of nemesis_action_params.reaction){
                        const range = obj.chance.split("-");
                         // если число в диапазоне
                        if(rand >= range[0] && rand < range[1]){
                            // В это условие мы попадаем в двух случаях: Если идет бой
                            // или мы приблизились на расстояние, когда бот начинает подбегать к нам.
                            // Здесь мы вызываем реакцию из объекта nemesis_action_params
                            // Реакция это имя действия ("walk", "punch", "stand") плюс направление
                            // по горизонтали ("_Left" или "_Right") плюс направление по вертикали —
                            // "Up" или "". Направление по вертикали это либо имя реакции плюс
                            // вертикальное направление удара врага (например, враг бьет сверху kick_Left_Up,
                            // тогда наша рекация будет "block" + "_Right" + "_Up"), либо имя реакции может отсылать
                            // к действию, которое само содержит в названии "_Up", тогда так же добавляем его к имени

                            if(obj.name == "kick" ||
                                obj.name == "block" && this.nemesis && this.nemesis.currentAction.split("_")[2] ){
                                var vert_direct = "_Up";
                            }
                            else{
                                var vert_direct = "";                                
                            }

                            this.doAction(obj.name + this.direction + vert_direct);
                            break;
                        }
                    }
                }
            }
        }
    }
    block(nemesis_action_params, my_action_params){
        // Проверка на блок и пересчет здоровья
        const [action_name, action_hor_direct, action_vert_direct] = this.currentAction.split("_");
        const [nemesis_action_name, nemesis_action_hor_direct, nemesis_action_vert_direct] = this.nemesis.currentAction.split("_");        
        const start = frame_data[this.nemesis.currentAction].start;
        const condition = this.nemesis.currentFrame == Math.round((nemesis_action_params.end - nemesis_action_params.start) / 2);
        const condition2 = "active" in frame_data[this.nemesis.currentAction]
        && start + this.nemesis.currentFrame > frame_data[this.nemesis.currentAction].active.start
        && start + this.nemesis.currentFrame < frame_data[this.nemesis.currentAction].active.end;
        
        if("damage" in nemesis_action_params &&
        (nemesis_action_hor_direct == "Left" && this.nemesis.x > this.x ||
        nemesis_action_hor_direct == "Right" && this.nemesis.x < this.x)
            && (condition || condition2) ){
            let resist = 0;

            // противодействие урону
            const start2 = frame_data[this.currentAction].start;
            const condition3 = "active" in frame_data[this.currentAction]
            && start2 + this.currentFrame > frame_data[this.currentAction].active.start
            && start2 + this.currentFrame < frame_data[this.currentAction].active.end;

            // if(this.type == "player"){
            //     console.log()            
            // }
            const rage_delta = 10;
            if(condition3 && "resist" in my_action_params){ // если действие содержит resist
                // проверяем разнонаправленность по горизонтали ("_Left", "_Right")

                if(action_hor_direct != nemesis_action_hor_direct){
                    // проверяем совпадение направления по вертиакали ("Up", undefined)
                    if(action_vert_direct == nemesis_action_vert_direct){
                        resist = my_action_params.resist;
                        this.nemesis.coolDown = 2;
                    }
                }
                else{
                    this.rage.current += rage_delta;
                }      
                this.stopCount += 5;
            }
            else{
                this.rage.current += rage_delta;
            }

            let damage = nemesis_action_params.damage;

            if(this.rage.current > this.rage.max){
                this.rage.current = this.rage.max;
            }

            if(this.nemesis.rage.current == this.nemesis.rage.max){
                damage *= 10;
                this.stunCount = 1;
                this.nemesis.doAction("punch" + this.nemesis.direction);
                this.nemesis.rage.current = 0;
            }

            this.health.current -= damage - resist;
            if(this.health.current <= 0){
                this.health.current = 0;
                game.over = true;
                if(this.type == "bot"){
                    game.player_win = true; 
                }
                else{
                    game.bot_win = true;                    
                }
            }

        }
    }
    countFrameData(my_action_params){
        // Если анимаци продолжается, то есть номер кадра менбше разнициы end и start
        if(this.currentFrame < frame_data[this.currentAction].end - frame_data[this.currentAction].start){
            this.currentFrame += 1;
            if(this.dy){
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
            else{
                this.stopCount++;
            }
        }
        // Если анимация завершилась
        else{
            this.complex = false;
            // Если отжата кнопка, то меняем действие на stand и обнуляем dx, на случай если персонаж шел
            if(!key_down || this.type == "bot"){
                this.doAction('stand' + this.direction);
                this.dx = 0;
                this.currentFrame = 0;
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
            else if(!my_action_params.no_return){
                this.currentFrame = 0;
                this.doAction('stand' + this.direction);
            }                
        }
        // условие для прыжка
        if(this.dy){
            // примем максимально значение dy за число пи
            if(this.dy <= Math.PI){
                // косинус менятеся от 1 (при dy = 0) до 0 (при dy = Math.PI/2) и снова до 1 (при dy =Math.PI)
                // Поэтому к середине прыжка скорость замедлится до 0 (5 * 0 = 0)
                this.y -= 50 * Math.cos(this.dy);
                this.dy += Math.PI / 8;
            }
            // прыжок закончился
            if(this.dy > Math.PI){
                this.dy = 0;
                this.y = canvas.height - frameHeight / 2;
                this.doAction('stand' + this.direction);
                this.currentFrame = 0;
            }
        }
        // если прыжка нет, то персонаж всегда внизу экрана, даже если изменили размер окна
        else{
            this.y = canvas.height - frameHeight / 2;
        }
    }
    draw(){
        const { start, end } = frame_data[this.currentAction];
        ctx.drawImage(this.image,
            (start + this.currentFrame) * frameWidth, 0,
            frameWidth, frameHeight,
            this.x - frameWidth / 2, this.y - frameHeight / 2, frameWidth, frameHeight);
    }
    doAction(action){
        if(this.stunCount > 0 || this.coolDown > 0){
            action = "stand" + this.direction;
        }
        // обрываем прыжок, если удар ногой kick            
        if(action == "kick_Right_Up" || action == "kick_Left_Up"){
            this.dy = 0;
        }
        if(!this.dy){ // производим удар, только если мы не в прыжке
            if(frame_data[action]){
                this.currentAction = action; // это в том числе идентификатор для анимации                            
            }
            if(this[action]){
                this[action](); // вызываем конкретный метод действия или удара
            }
            else{
                console.log("Нет такого действия "  + action + " в объекте frame_data")                
            }
        }
        this.currentFrame = 0;            
    }
    jumpAside_Right(){
        this.doAction("walk_Right");
        this.doAction("jump_Right");
    }
    jumpAside_Left(){
        this.doAction("walk_Left");
        this.doAction("jump_Left");
    }
    jumpAsidePunch_Right(){
        this.doAction("walk_Right");
        this.doAction("jump_Right");
        let context = this;
        setTimeout(function(){
            context.complex = true;
            context.doAction("kick_Right_Up")
        } , 100);
               
    }
    jumpAsidePunch_Left(){
        this.doAction("walk_Left");
        this.doAction("jump_Left");
        let context = this;
        setTimeout(function(){
            context.complex = true;
            context.doAction("kick_Left_Up")
        } , 100);
    }    
    punch_Right(){

    }
    punch_Left(){

    }
    walkAway_Left(){
        // this.doAction("block_Left");         
        // this.doAction("block_Left");        
        this.doAction("walk_Right");
    }
    walkAway_Right(){
        // this.doAction("block_Left");         
        // this.doAction("block_Left");        
        this.doAction("walk_Left");
    }    
    walk_Left(){
        if(!this.stopped){
            this.dx = -this.speed;
            this.direction = '_Left';
        }
        // if(this.inverse){
        //     this.currentAction = "walk_Right";
        // } 
    }
    walk_Right(){
        if(!this.stopped){
            this.dx = this.speed;
            this.direction = '_Right';
        }
        // if(this.inverse){
        //     this.currentAction = "walk_Left";
        // } 
    }
    punch_Right(){

    }
    punch_Left(){

    }
    block_Right(){

    }
    block_Left(){

    }
    block_Right_Up(){

    }
    block_Left_Up(){

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
    crouch_Right_Up(){

    }
    crouch_Left_Up(){

    }    
    kick_Right_Up(){

    }
    kick_Left_Up(){

    }
    stand_Left(){

    }
    stand_Right(){

    }
}