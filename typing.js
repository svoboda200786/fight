

function type(ctx_name, mystring, x0, y0, size, align, input_width, input_height){
	var newline = 0;
	var outdent = 0;
	texgo = letters["a"];
		
	if(align == "center"){
		var cell_size = Math.floor(size / texgo.length);
		x0 = x0 + input_width / 2 - mystring.length * ((texgo[0].length + 1) * cell_size ) / 2;
		y0 = y0 + input_height / 2- ((texgo.length + 1) * cell_size ) / 2;
	}
	else{
		var cell_size = size;		
	}

	// ctx_name.clearRect(x0, y0, x0 + mystring.length * ((texgo[0].length + 1) * cell_size ), y0 + texgo.length * cell_size);
	for (var i = 0; i < mystring.length; i++){

		if (mystring[i] == "&"){
			newline+= 8 + 4;
			outdent = 0;
		}
		else{
			texgo = letters[mystring[i]];				
			for (var x = 0; x < texgo.length; x++){
				for (var y = 0; y <= texgo[0].length; y++){	
					if (texgo[x][y] == 1){
						ctx_name.fillStyle = "white";						
						ctx_name.fillRect(x0 + (y + (texgo[0].length + 1) *outdent)*cell_size, y0 + (newline + x)*cell_size, cell_size, cell_size);
					}
				}	
			}
		outdent++;	
		}
	}	
}