
class UI{
    drawUserInfo(x, y, size, avatar, persone, name, n) {
        const ratio = avatar.width / avatar.height;        
        const avatar_w = size / 2.5;        
        const avatar_h = avatar_w * ratio;

        var j = 10, j2 = 5, outdent_x1, outdent_x2;
        if(n > 0){
            outdent_x1 = 0 - j;            
            outdent_x2 = avatar_w - j;           
        }
        else{
            outdent_x1 = -(avatar_w - 20 - j2);            
            outdent_x2 = avatar_w - 20 + j2;
        }

        ctx.fillStyle = "rgba(28, 128, 128, 0.7)";
        ctx.fillRect(x + outdent_x1, y - 40, size + outdent_x2, y + 17 + 10)

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "25px Arial ";
        ctx.textAlign = "center";
        ctx.fillText(name, x + size / 2, y - 10);

        ctx.drawImage(avatar, x + n, 10, avatar_h, avatar_w);
    
        var rage;
        if(persone.rage.current >= persone.rage.max * 0.9){
            ctx.drawImage(images[persone.type + "_avatar_rage"], x + n, 10, avatar_h, avatar_w);            
            rage = size;
        }
        else{
            rage = size / persone.rage.max * persone.rage.current;
        }

        ctx.fillStyle = "FireBrick";
        ctx.fillRect(x, y + 5, size / persone.health.max * persone.health.current, 10);
        ctx.fillStyle = "DarkOrange";
        ctx.fillRect(x, y + 17, rage, 10);  

        if(persone.stopped || persone.stunCount > 0){
            ctx.drawImage(images.lock, x + n + outdent_x1 + 55, 10, 20, 20);             
        }
        if(persone.nemesis && persone.nemesis.coolDown > 0 || persone.block_ind){
            if(!persone.block_ind){
                setTimeout(function(){
                    persone.block_ind = false;
                }, 200, persone)
            }
            persone.block_ind = true;
            ctx.drawImage(images.block, x + n + outdent_x1 + 55, y + 17 + 10, 20, 20);             
        } 

        game.time_bar.caption = "Time left: " + String( game.round_time - game.seconds ); 

    }
    drawStartScreen(pers_image, bot_image, text_image, n, delay){
        this.clearAll();                    
        intro_ctx.beginPath();
            intro_ctx.moveTo(canvas.width - n, canvas.height);
            intro_ctx.lineTo(0 - n, canvas.height);
            intro_ctx.lineTo(canvas.width - n, 0);
            intro_ctx.closePath();
        intro_ctx.fill();
        intro_ctx.globalCompositeOperation="source-out"; 
        this.drawStartImage(intro_ctx, pers_image, -n - 1);
        intro_ctx.globalCompositeOperation="source-over";       
        this.drawStartImage(intro_ctx, bot_image, n + 1);                                 
    }   
    drawStartImage(ctx, image, n){
        if(n > 0){
            var x0 = canvas.width - image.width * 1.5;
        }
        else{
            var x0 = 0;            
        }
        ctx.drawImage(image,
        x0 + n, 0,
        image.width * 1.5, image.height * 1.5);
    }    
    drawGameCaption(ctx, image, mask, n){
        const scale = 1.5;

        ctx.drawImage(image,
        canvas.width / 2 - image.width / 2 / scale,
        canvas.height / 2 - image.height / 2 / scale,
        image.width / scale, image.height / scale);

        if(mask){
            ctx.globalCompositeOperation="source-out";
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.beginPath();
                ctx.moveTo(n * 2, canvas.height / 2 - 50);
                ctx.lineTo(n * 2 + 20, canvas.height / 2 + 50);
                ctx.lineTo(n * 2 + 30, canvas.height / 2 + 50);
                ctx.lineTo(n * 2 + 20, canvas.height / 2 - 50);
                ctx.moveTo(n * 2, canvas.height / 2 - 50);                                
                ctx.closePath();
            ctx.fill();             
        }
        else{
            ctx.globalCompositeOperation="source-over";
        }
    }
    clearAll(){
        intro_ctx.clearRect(0,0,canvas.width,canvas.height); 
        text_ctx.clearRect(0,0,canvas.width,canvas.height); 
    }
    drawTimeBar(ctx, image, mask, n, scale){
        ctx.drawImage(image,
        canvas.width / 2 - image.width / 2 * scale,
        canvas.height / 2 - image.height / 2 * scale,
        image.width * scale, image.height * scale);

        if(mask){
            ctx.globalCompositeOperation="source-out";
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = "red";            
            ctx.fillRect(0, 0, canvas.width, canvas.height)            
        }
        else{
            ctx.globalCompositeOperation="source-over";
        }
    }
}
class Square{
    constructor(ctx_name, x, y, width, height, background, value) {
        this.ctx = ctx_name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.background = background;
        this.value = value;
        this.v;
        this.cap;
    }   
    set value(value){
        this.v = value; 
    }
    get value(){
        return this.v;
    }
    set background(background){
        if (background == "" || background == undefined){
            // ctx.clearRect(this.x * this.width, this.y * this.height, this.width, this.height);
        }
        else{
            ctx.fillStyle = background;
            ctx.fillRect(this.x * this.width, this.y * this.height, this.width, this.height);         
        }

    }       
}
class Button extends Square {
    set caption(caption){
        this.cap = caption;
        type(ctx, caption, this.x * this.width, this.y * this.height, this.height / 2, "center", this.width, this.height);
    }
    get caption(){
        return this.cap;
    }
}