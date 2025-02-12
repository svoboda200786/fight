const timing = {
    player: {
        punch_Right: {start: 0, end: 9},
        punch_Left: {start: 10, end: 18},
        punch_Right_Down: {start: 105, end: 112},
        punch_Left_Down: {start: 113, end: 120},
        block_Right: {start: 19, end: 27},
        block_Left: {start: 28, end: 36},
        block_Right_Up: {start: 37, end: 44},
        block_Left_Up: {start: 45, end: 54},
        block_Right_Down: {start: 126, end: 133},
        block_Left_Down: {start: 134, end: 146},    
        stand_Left: {start: 55, end: 60},
        stand_Right: {start: 61, end: 67},
        jump_Right: {start: 68, end: 76 },
        jump_Left: {start: 77, end: 84 },
        crouch_Right_Down: {start: 85, end: 90},
        crouch_Right_Up: {start: 91, end: 94},    
        crouch_Left_Down: {start: 95, end: 100},
        crouch_Left_Up: {start: 101, end: 104},   
        walk_Right: {start: 146, end: 154},
        walk_Left: {start: 155, end: 162},
        kick_Right_Up: {start: 163, end: 167},
        kick_Left_Up: {start: 168, end: 172},          
    },
    bar_enemy_timing: {
        // punch_Right: {start: 32, end: 48},
        // punch_Left: {start: 15, end: 31},
        // punch_Right_Down: {start: 180, end: 196},
        // punch_Left_Down: {start: 163, end: 179},
        // // block_Right: {start: 19, end: 27},
        // // block_Left: {start: 28, end: 36},
        // block_Right_Up: {start: 64, end: 78},
        // block_Left_Up: {start: 49, end: 63},
        // // block_Right_Down: {start: 126, end: 133},
        // // block_Left_Down: {start: 134, end: 146},    
        // stand_Left: {start: 0, end: 7},
        // stand_Right: {start: 8, end: 14},
        // jump_Right: {start: 104, end: 128 },
        // jump_Left: {start: 79, end: 103 },
        // crouch_Right_Down: {start: 146, end: 154},
        // crouch_Right_Up: {start: 155, end: 162},    
        // crouch_Left_Down: {start: 129, end: 139},
        // crouch_Left_Up: {start: 140, end: 145},   
        // // walk_Right: {start: 146, end: 154},
        // // walk_Left: {start: 155, end: 162},
        // kick_Right_Up: {start: 197, end: 202},
        // kick_Left_Up: {start: 203, end: 208}
        punch_Right: {start: 0, end: 9},
        punch_Left: {start: 10, end: 18},
        punch_Right_Down: {start: 105, end: 112},
        punch_Left_Down: {start: 113, end: 120},
        block_Right: {start: 19, end: 27},
        block_Left: {start: 28, end: 36},
        block_Right_Up: {start: 37, end: 44},
        block_Left_Up: {start: 45, end: 54},
        block_Right_Down: {start: 126, end: 133},
        block_Left_Down: {start: 134, end: 146},    
        stand_Left: {start: 55, end: 60},
        stand_Right: {start: 61, end: 67},
        jump_Right: {start: 68, end: 76 },
        jump_Left: {start: 77, end: 84 },
        crouch_Right_Down: {start: 85, end: 90},
        crouch_Right_Up: {start: 91, end: 94},    
        crouch_Left_Down: {start: 95, end: 100},
        crouch_Left_Up: {start: 101, end: 104},   
        walk_Right: {start: 146, end: 154},
        walk_Left: {start: 155, end: 162},
        kick_Right_Up: {start: 163, end: 167},
        kick_Left_Up: {start: 168, end: 172}, 
    },
    car_salon_enemy_timing: {
        punch_Right: {start: 159, end: 166},
        punch_Left: {start: 8, end: 15},
        punch_Right_Down: {start: 64, end: 70},
        punch_Left_Down: {start: 134, end: 140},
        block_Right: {start: 0, end: 7},
        block_Left: {start: 39, end: 45},
        block_Right_Up: {start: 18, end: 22},
        block_Left_Up: {start: 26, end: 30},
        block_Right_Down: {start: 125, end: 133},
        block_Left_Down: {start: 149, end: 157},    
        stand_Left: {start: 56, end: 63},
        stand_Right: {start: 47, end: 55},
        jump_Right: {start: 80, end: 86 },
        jump_Left: {start: 87, end: 93 },
        crouch_Right_Down: {start: 101, end: 107},
        crouch_Right_Up: {start: 106, end: 109},    
        crouch_Left_Down: {start: 169, end: 172},
        crouch_Left_Up: {start: 173, end: 174},   
        walk_Right: {start: 117, end: 124},
        walk_Left: {start: 141, end: 148},
        kick_Right_Up: {start: 109, end: 116},
        kick_Left_Up: {start: 93, end: 100},          
    },
    gg_cabinet_enemy_timing: {
        punch_Right: {start: 9, end: 17},
        punch_Left: {start: 0, end: 8},
        punch_Right_Down: {start: 124, end: 129},
        punch_Left_Down: {start: 118, end: 123},
        block_Right: {start: 26, end: 33},
        block_Left: {start: 18, end: 25},
        block_Right_Up: {start: 42, end: 49},
        block_Left_Up: {start: 34, end: 41},
        block_Right_Down: {start: 154, end: 161},
        block_Left_Down: {start: 130, end: 137},    
        stand_Left: {start: 50, end: 57},
        stand_Right: {start: 58, end: 65},
        jump_Right: {start: 74, end: 81 },
        jump_Left: {start: 66, end: 73 },
        crouch_Right_Down: {start: 110, end: 114},
        crouch_Right_Up: {start: 115, end: 117},    
        crouch_Left_Down: {start: 98, end: 104},
        crouch_Left_Up: {start: 105, end: 109},   
        walk_Right: {start: 146, end: 153},
        walk_Left: {start: 138, end: 145},
        kick_Right_Up: {start: 90, end: 97},
        kick_Left_Up: {start: 82, end: 89},          
    },
}

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
        this.kick_Right_Up = { start: undefined, end: undefined, once: true, damage: 1, cool_down: 4,
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