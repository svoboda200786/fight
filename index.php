<!DOCTYPE html>
<html>
<meta Content-Type: application/javascript; charset=UTF-8>
<link rel="stylesheet" type="text/css" href="style.css">
<meta name="viewport" content="width=device-width, initial-scale=1.0" charset="utf-8">
<style type="text/css">
	@media screen and (max-width: 500px) {
		body{
			margin: 0;
		}
		img{
			width: 100vw;
		}
		input{
			margin: 10px;
		}
	}
</style>
<body>
		<div>
			<input type="file" id="files">
			<label for"number">Model number</label>
		  <select id="number">
		  	<?
		  		for($i = 1; $i <= 54; $i++){
			  		echo "<option value=''>".$i."</option>";
		  		}
		  	?>
		  </select>
			<input type="button" id="put" onclick = "encodeImageFileAsURL(document.querySelector('#files'))" value="Отправить файл">
		</div>
		<div>
			<input id="url">
			<input type="button" id="put2" onclick = "sendUrl()" value="Отправить url">
			<div id="field"></div>			
		</div>			
</div>
<script>
	var server_adress = 'https://placeimage.oleg-okhotnikov.ru';
	function sendFile(my_img){
	    var element = document.querySelector("#files");  
	    var totalfiles = element.files.length;
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", server_adress, true);
		xhttp.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {
		        var response = this.responseText;
		        document.querySelector("#field").innerHTML = "<img style='height: 90vh'  src='" + response + "'>";
		   }
		};
		xhttp.send(JSON.stringify({"image":my_img, "image2":my_img, "num": document.querySelector("#number").selectedIndex }));
	}
	function sendUrl(){
		var xhttp = new XMLHttpRequest();
		var path = document.querySelector("#url").value.split('://').pop().trim();
		console.log(path);
		xhttp.open("GET", server_adress + "/?url=" + path + "&num=" + document.querySelector("#number").selectedIndex, true);
		xhttp.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {
		        var response = this.responseText;
		        document.querySelector("#field").innerHTML = "<img style='height: 90vh' src='" + response + "'>";
		   }
		};
		xhttp.send();		
	}
	
	function encodeImageFileAsURL(element) {
		var my_img;	
		var file = element.files[0];
		var reader = new FileReader();
		reader.onloadend = function() {
			my_img = reader.result.split("base64,").pop().trim();
			sendFile(my_img);
		}
		reader.readAsDataURL(file);
	}
</script>
</body>
</html>