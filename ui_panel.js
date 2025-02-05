class UI{
    drawUserInfo(x, y, size, avatar, obj, name) {
        const persone = obj;

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "25px Arial ";
        ctx.textAlign = "center";
        ctx.fillText(name, x + size / 2, y - 10);
        // ctx.drawImage(avatar, x, y, size, size);
        var j = 0; 
                   
        ctx.fillStyle = "red";
        ctx.fillRect(x, 3 + y + (j+1) *2 + 10 * j, size / persone.health.max * persone.health.current, 10);
        ctx.fillStyle = "orange";
        ctx.fillRect(x, 3 + y + 12 + (j+1) *2 + 10 * j, size / persone.rage.max * persone.rage.current, 10);
    }
    drawStartScreen(pers_image1, pers_image2, text_image, n, delay){
        this.drawStartImage(pers_image1, n);
        this.drawStartImage(pers_image2, -n);
        this.drawGameCaption(text_image);            
    }   
    drawStartImage(image, n){
        ctx.drawImage(image,
        0, 0,
        image.width, image.height,
        n, 0,
        canvas.width, canvas.height);
    }    
    drawGameCaption(image){
        const scale = 1.5;
        ctx.drawImage(image,
        0, 0,
        image.width, image.height,
        canvas.width / 2 - image.width / 2 / scale,
        canvas.height / 2 - image.height / 2 / scale,
        image.width / scale, image.height / scale);
    }
}