//VARIABLES GLOBALES
var checkbox, ctx,
    posX, posY,
    puntos, id, token, 
    sudokuPequeño = new Array(4),
    sudokuGrande = new Array(9),
    filas = [], columnas = [], cuadritos = [];

//Inicializamos ambas matrices
for(let x = 0; x < 4; x++){
    sudokuPequeño[x] = new Array(4);
}

for(let y = 0; y < 4; y++){
    sudokuGrande[y] = new Array(9);
}

window.onload = function() {
    console.log(sudokuPequeño);
    console.log(sudokuGrande);
    
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

    console.log(checkbox);
    html = '<h2>Panel del juego</h2>';
    html += '<h3 id="puntua">Puntos: </h3>';
    html += '<div class="crono">';
    html += '<output id="crono-si">00:00:00</output>';
    html += '</div>';
    html += '<button type="button" onclick="comprueba()">Comprobar</button>';
    html += '<button type="button" onclick="pararSI()">Finalizar</button>';
    html += '<canvas id="cv01"></canvas>';
    document.getElementById('canvas').innerHTML = html;

    if(checkbox == 4){
        prepararCanvas(480, 480);
        rejilla(4);
        //Llamamos otra vez para poner más gorda la linea central 
        //rejilla(2);
    }else{
        prepararCanvas(640, 640);
        rejilla(9);
        //rejilla(3);
    }

    generarSudoku(checkbox);

    document.querySelector('#crono-si').innerHTML = '00:00:00';
    document.querySelector('#crono-si').setAttribute('data-valor', '0');
    //No hace falta volverlo a llamar ya que él solo establece un tiempo
    let idTemp = setInterval(actualizarSI, 1000); //Ejecutará la función cada segundo
    document.querySelector('#crono-si').setAttribute('data-id-temp', idTemp);
}

function generarSudoku(tam){
    let url = `api/sudoku/generar/`;
    url += tam;

    console.log("Envío esta url: " + url);

    fetch(url, {method:'POST'}).then(function(respuesta){
        console.log(respuesta)
		if(respuesta.ok){
			respuesta.json().then(function(datos){
                console.log(datos);
                sessionStorage['sudoku'] = JSON.stringify(datos);
                console.log(datos.TOKEN);
                //arraySudoku();
                pintarCasillas(tam);
                id = datos.ID;
			});
		}else
			console.log('Error en la petición fetch');
	});

	return false;
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

function pararSI(){
    let idTemp = document.querySelector('#crono-si').getAttribute('data-id-temp');
    clearInterval(idTemp);
    peticionFinalizarPartida(idTemp);
}

function peticionFinalizarPartida(){
    let xhr = new XMLHttpRequest(),
        url = 'api/sudoku/' + id,
        sudo = JSON.parse(sessionStorage['sudoku']),
        autorizacion = sudo.TOKEN;

    xhr.open('DELETE', url, true);
    xhr.onload = function() {
        let respuesta = JSON.parse(xhr.responseText);
        console.log(respuesta);
        if (respuesta.RESULTADO == 'OK') {
            console.log("Se ha eliminado la partida. ");
            //location.href = 'index.html';
        } else {
            console.error('No se ha podido ELIMINAR la partida...');
        }
    };
    xhr.setRequestHeader('Authorization', autorizacion);
    xhr.send();
}

function verCasillas(regiones){
    let cv = document.querySelector('canvas');

    cv.onclick = function(evt){
        console.log("Regiones: " + regiones);
        console.log('CLICK: ' + evt.offsetX + ' - ' + evt.offsetY);

        let columna = Math.floor(evt.offsetX / ancho);
        let fila = Math.floor(evt.offsetY / alto);

        console.log(fila + ' - ' + columna);
    }
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

    //Dibuja la rejilla entera
    for (let x=0; x < cv.width; x=x+ancho){
        ctx.moveTo(x,0);
        ctx.lineTo(x,cv.width);
        if(value != 2 && value != 3)
            columnas.push(x);
    }
    
    for (let y=0; y < cv.height; y=y+alto){
        ctx.moveTo(0,y);
        ctx.lineTo(cv.height,y);
        if(value != 2 && value != 3)
        filas.push(y);
    }

    if(value != 2 && value != 3){
        columnas.push(0);
        filas.push(0);
    }
    
    for (x = 0; x < columnas.length; x++) {
        for (y = 0; y < filas.length; y++) {
            cuadritos.push([columnas[x], filas[y], 0, 0]);
        }
    }

    console.log(cuadritos);

    //Dibuja las líneas horizontales y verticales centrales
    for(let i = 0; i < regiones; i++){
        //Verticales
        ctx.moveTo(i * ancho, 0);
        ctx.lineTo(i * ancho, cv.height);
        //Horizontales
        ctx.moveTo(0, i * alto);
        ctx.lineTo(cv.width, i * alto);
    }

    ctx.stroke();

    console.log(filas);
    console.log(columnas);
}

function pintarCasillas(regiones){
    let cv = document.querySelector('canvas'),
        ctx = cv.getContext('2d'),
        ancho = cv.width / regiones,
        alto = cv.height / regiones,
        sudo = JSON.parse(sessionStorage['sudoku']),
        tablero = sudo.SUDOKU;

    console.log("Regiones: " + regiones);
    ctx.beginPath();

    for(let i = 0; i < regiones; i++){
        for(let j = 0; j < regiones; j++){
            if(tablero[i][j] != 0){
                ctx.fillStyle = '#B2B6B7';
            }else{
                ctx.fillStyle = '#CFD8DC';
            }
            ctx.fillRect(ancho * j + 1, alto * i + 1, ancho-2, alto-2);
            ctx.stroke();
        }
    }

    if(regiones == 4)
        rejilla(2);
    else
        rejilla(3);

    escribirNumeros(regiones);
}

function escribirNumeros(num){
    let cv = document.querySelector('canvas'),
        ctx = cv.getContext('2d'),
        sudo = JSON.parse(sessionStorage['sudoku']),
        ancho = Math.floor(cv.width / sudo.SUDOKU.length),
        alto = Math.floor(cv.height /sudo.SUDOKU[0].length),
        tablero = sudo.SUDOKU;

    ctx.textAlign = 'center';
    ctx.font = 'bold 36px sans-serif, arial';
    
    for(let x = 0; x < num; x++){
        for(let y = 0; y < num; y++){
            ctx.beginPath();
            if(tablero[x][y] != 0){
                ctx.fillStyle = '#FF8300';
                ctx.fillText(tablero[x][y], y * ancho+(ancho/2), x * alto+(alto/1.6));
            }
            ctx.stroke();
        }
    }
}

function numeros(){
    let div, html;

    div = document.createElement('div');
    div.id = 

    html = '<img src="images/num1>';
    html += '<img src="images/num2>';
    html += '<img src="images/num3>';
    html += '<img src="images/num4>';

    div.innerHTML = html;
    document.body.appendChild(div);
}

//BOTÓN PARA COMPROBAR ERRORES
function comprueba(juego){
    let sudo = JSON.parse(sessionStorage['sudoku']),
        url, header;

    url = `api/sudoku/${sudo.ID}/comprobar`;
    header = sudo.TOKEN;
    fd = null;

    fetch(url, {method:'POST', headers:{'Authorization':header}, body:fd}).then(function(respuesta){
		if(respuesta.ok){
			respuesta.json().then(function(datos){
                console.log(datos);
			});
		}else
			console.log('Error en la petición fetch');
	});

	return false;
}

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

