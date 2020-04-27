var checkbox; 

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
    html += '<canvas id="cv01"></canvas>';
    document.getElementById('canvas').innerHTML = html;

    if(checkbox == 4){
        prepararCanvas(480,360);
    }else{
        prepararCanvas(640,480);
    }

    rejilla();
}

function rejilla(){
    let cv = document.querySelector('canvas'),
    ctx = cv.getContext('2d'),
    regiones = 2,
    ancho = cv.width / regiones,
    alto = cv.height / regiones;

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#a00';

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
