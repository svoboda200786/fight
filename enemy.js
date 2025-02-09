class Enemy extends  Player{
    constructor(w, h, image, dx, type, name){
        super(w, h, image, dx, type, name);
    }
    reaction(nemesis_action_params){
        // Если противник встал, то мы тоже встаем
        if(this.nemesis && this.nemesis.currentAction == "crouch" + this.nemesis.direction + "_Up"){
            this.currentFrame = 0;
            this.crouch = false;
        }
        // Если предыдущая анимация завершилась или мы присели (тогда
        // текущий кадр будет равен последнему кадру анимации)            
        if(this.currentFrame == 0 || this.crouch){
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
                        // по горизонтали ("_Left" или "_Right"), плюс направление по вертикали —
                        // "Up", "Down", или "". Направление по вертикали это либо имя реакции плюс
                        // вертикальное направление удара врага (например, враг бьет сверху kick_Left_Up,
                        // тогда наша рекация будет "block" + "_Right" + "_Up"), либо имя реакции может отсылать
                        // к действию, которое само содержит в названии "_Up", тогда так же добавляем его к имени/
                        // Либо это удары "punch", "block", "crouch" — тогда добавляем третий параметр
                        // после "_" в названии удара противника (то есть верхним ударам соотвествуют верхние,
                        // средним средние, нижним нижние)
                        if(this.nemesis){
                            const nemesis_action = this.nemesis.currentAction;
                            var nemesis_action_name = this.nemesis.currentAction.split("_")[0];
                            var nemesis_action_vert_direct = this.nemesis.currentAction.split("_")[2];
                        }
                        if( (obj.name == "punch" || obj.name == "block" || obj.name == "crouch")
                            && this.nemesis && nemesis_action_vert_direct){
                            // у kick только верхняя она удара
                            if(nemesis_action_name != "kick"){
                                var vert_direct = "_" + nemesis_action_vert_direct;                               
                            }
                            else{
                                var vert_direct = "";
                            }
                        }
                        else if(obj.name == "kick"){
                            var vert_direct = "_Up" ;
                        }
                        else{
                            var vert_direct = "";                                
                        }

                        const action_name = obj.name + this.direction + vert_direct;
                        // Если бот присел и ничего не делает (то есть action_name == "crouch"),
                        // то doAction не вызываем,
                        // вызывается, если он производит действие — блок, удар и тп

                        const condition = !this.crouch || action_name != "crouch" + this.direction + "_Down";
                        if(condition){
                            this.doAction(action_name);
                            break;
                        }
                    }
                }
            }
        }
    }
    collision(){
        super.collision();
        if(!this.potential_nemesis.dy){
            if(!this.stopped){
              if(this.collision_distance > 70){
                // если игрок на дистанции больше и меньше определенного значения,
                // то бот реагирует как на действие walk в его направлении
                if(!this.complex){
                    this.reaction(frame_data[this.name]["walk" + this.potential_nemesis.direction]);                     
                }                                
              }
            }
        }
        this.idleCount = 0; 
    }
}
