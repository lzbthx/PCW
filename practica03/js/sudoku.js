var checkbox, ctx; 

window.onload = function() {
    if(document.getElementById('inicio')){
        document.getElementById('inicio').addEventListener("click", iniciar);
    }
};

function prepararCanvas(x, y){
    let cv = document.querySelector('#cv01');

    cv.width = x;
    cv.height = y;
}

function iniciar(){
    console.log('Empieza el juego.');

    let html = '',
        checkbox = document.querySelector('input[type="radio"]:checked').value;

    html = '<h2>Panel del juego</h2>';
    html += '<h3 id="puntua">Puntos: </h3>';
    html += '<div class="crono">';
    html += '<output id="crono-si">00:00:00</output>';
    html += '</div>';
    html += '<button type="button">Comprobar</button>';
    html += '<button type="button">Finalizar</button>';
    html += '<canvas id="cv01"></canvas>';
    document.getElementById('canvas').innerHTML = html;

    if(checkbox == 4){
        prepararCanvas(480, 480);
        rejilla(4);
        //Llamamos otra vez para poner más gorda la linea central 
        rejilla(2);
        generarSudoku('4');
    }else{
        prepararCanvas(640, 640);
        rejilla(9);
        rejilla(3);
        generarSudoku('9');
    }

    document.querySelector('#crono-si').innerHTML = '00:00:00';
    document.querySelector('#crono-si').setAttribute('data-valor', '0');
    //No hace falta volverlo a llamar ya que él solo establece un tiempo
    let idTemp = setInterval(actualizarSI, 1000); //Ejecutará la función cada segundo
    document.querySelector('#crono-si').setAttribute('data-id-temp', idTemp);
}

function actualizarSI(){
    //Tomar el nº de segundos que tengo acumulados en el query selector
    let valor = parseInt(document.querySelector('#crono-si').getAttribute('data-valor')) + 1,
    horas = Math.floor(valor/3600); //nos quedamos con la parte entera, etc
    minutos = Math.floor((valor - horas * 3600) / 60), 
    segundos = valor - horas * 3600 - minutos * 60;
    //Transformarlo en el formato de horas, minutos, segundos

    horas = (horas < 10?'0':'') + horas;
    minutos = (minutos < 10?'0':'') + minutos;
    segundos = (segundos < 10?'0':'') + segundos;

    document.querySelector('#crono-si').innerHTML = `${horas}:${minutos}:${segundos}`;
    document.querySelector('#crono-si').setAttribute('data-valor', valor);
}

function rejilla(value){
    let cv = document.querySelector('canvas'),
    ctx = cv.getContext('2d');
    regiones = value,
    ancho = cv.width / regiones,
    alto = cv.height / regiones;

    if(value == 2 || value == 3){
        ctx.lineWidth = 5;
    }else{
        ctx.lineWidth = 2;
    }

    ctx.beginPath();
    ctx.strokeStyle = '#727272';

    for (var x=0; x < cv.width; x=x+ancho){
        ctx.moveTo(x,0);
        ctx.lineTo(x,cv.width);
    }
    
    for (var y=0; y < cv.height; y=y+alto){
        ctx.moveTo(0,y);
        ctx.lineTo(cv.height,y);
    }

    for(let i = 0; i < regiones; i++){
        //Verticales
        ctx.moveTo(i * ancho, 0);
        ctx.lineTo(i * ancho, cv.height);
        //Horizontales
        ctx.moveTo(0, i * alto);
        ctx.lineTo(cv.width, i * alto);
    }

    ctx.stroke();
}

function generarSudoku(tam){
    let url = `api/sudoku/generar/`;
    console.log(url);

    if(tam == 4)
        url += '4';
    else if(tam == 9)
        url += '9';

    fetch(url, {method:'POST'}).then(function(respuesta){
		if(respuesta.ok){
			respuesta.json().then(function(datos){
                console.log(datos);
                sessionStorage['sudoku'] = JSON.stringify(datos);
                console.log(datos.TOKEN);
                arraySudoku();
                let token = datos.TOKEN;
			});
		}else
			console.log('Error en la petición fetch');
	});

	return false;
}

function arraySudoku(){
    let cv = document.querySelector('canvas'),
        ctx = cv.getContext('2d');

    let sudoku = JSON.parse(sessionStorage['sudoku']),
        //regiones = value,
        ancho = cv.width,
        alto = cv.height;

    console.log(sudoku);
    console.log(sudoku.SUDOKU);

    cv.onclick = function(evt){
        console.log('CLICK: ' + evt.offsetX + ' - ' + evt.offsetY);
    }

    let X,Y;
    X = 60, Y = 70;
    
    ctx.fillStyle = '#FF8300';
    ctx.textAlign = 'center';
    ctx.font = 'bold 32px sans-serif, arial';

    for(let x = 0; x < sudoku.SUDOKU.length; x++){
        for(let y = 0; y < sudoku.SUDOKU[x].length; y++){
            ctx.beginPath();
            //if(sudoku.SUDOKU[x][y] != 0){}

            if(x != 0 && y < 1){
                X += 60;
            }

            if(x != 0 && y >= 1){
                X += 120;
            }

            switch(x){
                case 0:
                    if(sudoku.SUDOKU[x][y] != 0){
                        ctx.fillText(sudoku.SUDOKU[x][y], X, Y);
                        X += 120;
                    }
                    break;
                case 1:
                    if(sudoku.SUDOKU[x][y] != 0){
                        Y = 190;
                        ctx.moveTo(X, Y);
                        ctx.fillText(sudoku.SUDOKU[x][y], X, Y);
                    }
                    break;
                case 2:
                    if(sudoku.SUDOKU[x][y] != 0){
                        Y = 310;
                        ctx.moveTo(X, Y);
                        ctx.fillText(sudoku.SUDOKU[x][y], X, Y);
                    }
                    break;
                case 3:
                    if(sudoku.SUDOKU[x][y] != 0){
                        Y = 430;
                        ctx.moveTo(X, Y);
                        ctx.fillText(sudoku.SUDOKU[x][y], X, Y);
                    }
                    break;
            }
        }
        ctx.stroke();
        X = 0;
    }
}
/*
function escribirNumeros(posX, posY){
    for(let i = 0; i < )
}*/


//Cuando le demos al boton de reset
function limpiar(){
    let cv = document.querySelector('#cv01'),
    ctx = cv.getContext('2d');

    //Limpiar el canvas
    //ctx.clearRect(0,0,cv.width,cv.height);

    //Otra forma de borrarlo
    //cv.width = cv.width;

    //Tercera forma de borrar
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,cv.width,cv.height);
}