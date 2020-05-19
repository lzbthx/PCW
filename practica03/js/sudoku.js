//VARIABLES GLOBALES
var checkbox, ctx,
    posX, posY,
    puntos, id, token,
    sudokuPequenyo, sudokuGrande,
    coord;


/*
window.onload = function() {
    console.log(sudokuPequenyo);
    console.log(sudokuGrande);

    if(document.getElementById('inicio')){
        document.getElementById('inicio').addEventListener("click", iniciar);
    }
    
};*/

// Función que se ejecuta cuando se ha cargado todo el DOM de la página
document.addEventListener('DOMContentLoaded', load, false);
function load() {
    document.getElementById('inicio').addEventListener("click", iniciar);
}



function prepararCanvas(x, y){
    let cv = document.querySelector('#cv01');

    cv.width = x;
    cv.height = y;
}

function iniciar(){
    let html = '',
        checkbox = document.querySelector('input[type="radio"]:checked').value;
    console.log('Empieza el juego...');

    console.log(checkbox);
    html = '<h2>Panel del juego</h2>';
    if (checkbox == '4') {
        html += `<form>
                <input type="radio" id="tam1" name="size" value="4" disabled checked><label for="tam1"> 4</label>
                <input type="radio" id="tam2" name="size" value="9" disabled><label for="tam2"> 9</label>
            </form>`;
    } else {
        html += `<form>
                <input type="radio" id="tam1" name="size" value="4" disabled><label for="tam1"> 4</label>
                <input type="radio" id="tam2" name="size" value="9" disabled checked><label for="tam2"> 9</label>
            </form>`;
    }
    html += '<h3 id="puntua">Puntos: </h3>';
    html += '<div class="crono">';
    html += '<output id="crono-si">00:00:00</output>';
    html += '</div>';
    html += '<button type="button" onclick="comprueba();">Comprobar</button>';
    html += '<button type="button" onclick="peticionFinalizarPartida()">Finalizar</button>';
    html += '<canvas id="cv01"></canvas>';
    html += '<div id="numeros"></div>';
    document.getElementById('canvas').innerHTML = html;

    if(checkbox == 4){
        sudokuPequenyo = new Array(4);
        for(let x = 0; x < 4; x++){
            sudokuPequenyo[x] = new Array(4);
        }
        prepararCanvas(480, 480);
        rejilla(4);
        //Llamamos otra vez para poner más gorda la linea central 
        //rejilla(2);
    }else{
        sudokuGrande = new Array(9);
        for(let x = 0; x < 9; x++){
            sudokuGrande[x] = new Array(9);
        }
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
                pintaSudoku(tam);
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

function peticionFinalizarPartida(){
    let idTemp = document.querySelector('#crono-si').getAttribute('data-id-temp'),
        xhr = new XMLHttpRequest(),
        url = 'api/sudoku/' + id,
        sudo = JSON.parse(sessionStorage['sudoku']),
        autorizacion = sudo.TOKEN;

    xhr.open('DELETE', url, true);
    xhr.onload = function() {
        let respuesta = JSON.parse(xhr.responseText);
        console.log(respuesta);
        if (respuesta.RESULTADO == 'OK') {
            //Para el temporizador
            clearInterval(idTemp);
            console.log("Se ha eliminado la partida. ");
            limpiar();
        } else {
            console.error('No se ha podido ELIMINAR la partida...');
        }
    };
    xhr.setRequestHeader('Authorization', autorizacion);
    xhr.send();
}

/*
function verCasillas(regiones){
    let cv = document.querySelector('canvas');

    // Mover el ratón por encima de las casillas...
    cv.onmousemove = function(evt) {
        let columna = Math.floor(evt.offsetX / ancho),
            fila    = Math.floor(evt.offsetY / alto),
            tablero = (checkbox == 4) ? sudokuPequenyo : sudokuGrande;

        console.log('Move: ' + fila + ' - ' + columna);
    }

    // Click sobre una casilla del sudoku...
    cv.onclick = function(evt){
        console.log("Regiones: " + regiones);
        console.log('CLICK: ' + evt.offsetX + ' - ' + evt.offsetY);

        let columna = Math.floor(evt.offsetX / ancho);
        let fila = Math.floor(evt.offsetY / alto);

        console.log(fila + ' - ' + columna);
    }
}
*/
function rejilla(value){
    let cv = document.querySelector('canvas'),
    ctx = cv.getContext('2d'),
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
    }
    
    for (let y=0; y < cv.height; y=y+alto){
        ctx.moveTo(0,y);
        ctx.lineTo(cv.height,y);
    }

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
}




function pintaSudoku(regiones){
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
                
                if(num == 4){
                    sudokuPequenyo[x][y] = tablero[x][y];
                }else{
                    sudokuGrande[x][y] = tablero[x][y];
                }
            }
            ctx.stroke();
        }
    }

    casillasDeNumeros(num);
}

//Función que despliega los números a insertar en las casillas mediante botones
function casillasDeNumeros(regiones){
    let sudo = JSON.parse(sessionStorage['sudoku']),
        cv = document.querySelector('canvas'),
        ctx = cv.getContext('2d'), x, y,
        tablero = sudo.SUDOKU, html = '',
        ancho = cv.width / regiones,
        alto = cv.height / regiones;

    
    // Mover el ratón por encima de las casillas...
    cv.onmousemove = function(evt) {
        let columna = Math.floor(evt.offsetX / ancho),
            fila    = Math.floor(evt.offsetY / alto),
            pinta   = false;

        if (checkbox == 4) {
            if (sudokuPequenyo[fila][columna] == 0)
                pinta = true;
        } else {
            if (sudokuGrande[fila][columna] == 0)
                pinta = true;
        }

        if (pinta) {
            ctx.beginPath();
            ctx.fillStyle = '#f09c1e';
            ctx.fillRect(ancho * columna + 1, alto * fila + 1, ancho-2, alto-2);
            ctx.stroke();
        }
        
    }
    

    cv.onclick = function(evt){
        console.log("Click " + evt.offsetX + '-' + evt.offsetY);
        x = Math.floor(evt.offsetX/(cv.width/sudo.SUDOKU.length)),
        y = Math.floor(evt.offsetY/(cv.height/sudo.SUDOKU.length));

        console.log(y + " - " + x);

        if(tablero[y][x] == 0){
            html = '<h3>Números disponibles</h3>';
            if(sudo.SUDOKU.length == 4){
                for(let i = 1; i < 5; i++){
                    if(i == 1)
                        html += `<button onclick="pintarCasilla(${y}, ${x}, 1)">1</button>`;
                    else
                        html += `<button onclick="pintarCasilla(${y}, ${x}, ${i})">${i}</button>`;
                }
            }else{
                for(let i = 1; i < 10; i++){
                    if(i == 1)
                        html += `<button onclick="pintarCasilla(${y}, ${x}, 1)">1</button>`;
                    else
                        html += `<button onclick="pintarCasilla(${y}, ${x}, ${i})">${i}</button>`;
                }
            }
            document.querySelector('div#numeros').innerHTML = html;
        }
    }
}

//Función que pinta aquella casilla del canvas del nuevo número que inserta el usuario
function pintarCasilla(coorX, coorY, num){
    console.log("Número: "+num);
    console.log("CoorX: "+coorX);
    console.log("CoorY: "+coorY);

    let cv = document.querySelector('canvas'),
        ctx = cv.getContext('2d'),
        sudo = JSON.parse(sessionStorage['sudoku']),
        ancho = cv.width / sudo.SUDOKU.length,
        alto = cv.height / sudo.SUDOKU.length;

    ctx.fillStyle = '#cfd8dc';
    ctx.fillRect(ancho * coorY + 1, alto * coorX + 1, ancho-2, alto-2);
    ctx.beginPath();
    ctx.fillStyle = '#ff8300';
    ctx.textAlign = 'center';
    ctx.font = 'bold 36px sans-serif, arial';
    ctx.fillText(num, coorY * ancho+(ancho/2), coorX * alto+(alto/1.6));
    ctx.stroke();

    //Nos guardamos el nuevo número en la matriz global 
    if(sudo.SUDOKU.length == 4){
        sudokuPequenyo[coorX][coorY] = num;
        console.log(sudokuPequenyo);
    }else{
        sudokuGrande[coorX][coorY] = num;
        console.log(sudokuGrande);
    }
    
    //Para volver a poner la rejilla central
    if(sudo.SUDOKU.length == 4)
        rejilla(2);
    else    
        rejilla(3);
}

//BOTÓN PARA COMPROBAR ERRORES
function comprueba(){
    let sudo = JSON.parse(sessionStorage['sudoku']),
        url, header;

    url = `api/sudoku/${sudo.ID}/comprobar`;
    header = sudo.TOKEN;
    fd = new FormData;

    if(sudo.SUDOKU.length == 4){
        juego = JSON.stringify(sudokuPequenyo);
    }else{
        juego = JSON.stringify(sudokuGrande);
    }

    fd.append('juego', juego);

    fetch(url, {method:'POST', body:fd, headers:{'Authorization':header}}).then(function(respuesta){
		if(respuesta.ok){
			respuesta.json().then(function(datos){
                console.log(datos);
                if(datos.FALLOS == 0 || datos.FALLOS == null || datos.FALLOS == undefined){
                    /*ventanaModal('¡¡¡ENHORABUENA!!!', 
                                 'Has completado el sudoku correctamente en... ');*/
                    console.log("No hay fallos en el juego.");
                }else{
                    ventanaModal('¡ATENCIÓN!', `Hay ${datos.FALLOS.length} errores. ¿Quieres intentar corregirlos?`);
                }
			});
		}else
			console.log('Error en la petición fetch');
	});

	return false;
}

function ventanaModal(asunto, body){
    let div, html;

    div = document.createElement('div');
    div.id = 'capa-fondo';
	
    html = '<article>';
    html += `<h2>${asunto}</h2>`;
    html += `<p>${body}</p>`;
    if(asunto != '¡ATENCIÓN!'){
        html += '<button onclick="cerrar(true);">Aceptar</button>';
    }else{
        html += '<button onclick="cerrar(true);">SÍ</button>';
        html += '<button onclick="cerrar(false);">NO</button>';
    }
    html += '</article>';

    div.innerHTML = html;

    document.body.appendChild(div);
}

function cerrar(value){
    if(value == true){
        document.querySelector('#capa-fondo').remove();
    }else{
        let idTemp = document.querySelector('#crono-si').getAttribute('data-id-temp');

        clearInterval(idTemp);
        document.querySelector('#capa-fondo').remove();
        limpiar();
    }
}

function limpiar(){
    let cv = document.querySelector('#cv01'),
    ctx = cv.getContext('2d');
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,cv.width,cv.height);

    sessionStorage.clear();
    location.href = './index.html';
}

