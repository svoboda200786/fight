function drawPanel(x, y, size, image, obj, name) {
    const persone = obj;
    const pic = image;

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "25px Arial ";
    ctx.textAlign = "center";
    ctx.fillText(name, x + size / 2, y - 10);
    // ctx.drawImage(pic, x, y, size, size);
    var j = 0;
    // for(let j = 0; j < persone.bioparam.length; j++){
        // ctx.fillStyle = "#B0E0E6";
        // ctx.fillRect(x + bigotstup, size + 3 + y + otstup + (j+1) *2 + 10 * j, size, 10);
        ctx.fillStyle = "red";
        // ctx.fillRect(x, size + 3 + y + (j+1) *2 + 10 * j, size / persone.health.max * persone.health.current, 10);
        ctx.fillRect(x, 3 + y + (j+1) *2 + 10 * j, size / persone.health.max * persone.health.current, 10);
        ctx.fillStyle = "orange";
        ctx.fillRect(x, 3 + y + 12 + (j+1) *2 + 10 * j, size / persone.rage.max * persone.rage.current, 10);
    // }
}