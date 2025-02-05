class Enemy extends  Player{
  constructor(w, h, image, dx, enemy){
      super(w, h, image, dx, enemy);
  }
  collision(){
    if(game.player.x <= this.x){
        this.direction = "_Left";  
    }
    else{
        this.direction = "_Right";                 
    }

    const distance = Math.abs(game.player.x - this.x);
    const count = 10;

    // переходим в остояние боя, если дистанция меньше определенного значения
    if(distance < 70){                
        if(!game.player.dy && !this.dy){ // Если мы в прыжке, то коллизия не срабатывает
            game.player.nemesis = this;
            this.nemesis = game.player;

            game.player.stopped = true;
            game.player.dx = 0;
            this.stopped = true;

            if(game.player.stopCount >= count){
                game.player.stopped = false;
            }
        }              
    }
    else{ // вышли из коллизии
        game.player.nemesis = null;
        this.nemesis = null;
        game.player.stopCount = 0;
    }

    // подбегаем, если дистанция между противниками меньше нужной величины
    // или бездействие больше определенной величины (увеличивается в update класса Player)
    if(distance < 300 || this.idleCount > 10){
        if(!game.player.dy){
            if(!this.stopped){
              if(distance > 70){
                // если игрок на дистанции больше и меньше определенного значения,
                // то бот реагирует как на действие walk в его направлении
                if(!this.complex){
                    this.reaction(frame_data["walk" + game.player.direction]);                     
                }                                
              }
            }
        }
        this.idleCount = 0;
        game.player.inverse = true;
    }
    else{
        this.stopped = false;
        game.player.inverse = false;                
    }
  }
}
