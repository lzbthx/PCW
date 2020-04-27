var video;

function prepararCanvas(){
    let cv = document.querySelector('canvas');
    cv.width = 640;
    cv.height = 480;

    //Cuando estamos dentro del canvas
    cv.onmousemove = function(evt){
        //Como saber la posicion en la que estamos en el canvas
        //console.log(evt);

        //console.log(evt.offsetX + ' - ' + evt.offsetY);
        //Cuando hay valores negativos, es porque se refiere
        //al borde del canvas que está fuera de él
    }

    cv.onclick = function(evt){
        //console.log('CLICK: ' + evt.offsetX + ' - ' + evt.offsetY);
       
        let cv = document.querySelector('canvas'),
            fila, columna,
            regiones = 2,
            ancho = cv.width / regiones,
            alto = cv.height / regiones;

        //Saber en que celda estamos haciendo click
        //Nos da la parte entera
        columna = Math.floor(evt.offsetX / ancho);
        fila    = Math.floor(evt.offsetY / alto);

        console.log(fila + ' - ' + columna);
    }

    /*Arrastrar etc
    cv.onmousedown = function(evt){
        //Cuando suelto el ratón
        console.log('DOWN: ' + evt.offsetX + ' - ' + evt.offsetY);
    }

    cv.onmouseup = function(evt){
        //Cuando suelto el ratón
        console.log('UP: ' + evt.offsetX + ' - ' + evt.offsetY);
    }

    cv.onmouseenter = function(evt){
        console.log('ENTER: ' + evt.offsetX + ' - ' + evt.offsetY);
    }

    cv.onmouseout = function(evt){
        console.log('OUT: ' + evt.offsetX + ' - ' + evt.offsetY);
    }*/
}

function pintarImagen(f,c){
    let cv = document.querySelector('canvas'),
        ctx = cv.getContext('2d'),
        regiones = 2,
        ancho = cv.width / regiones,
        alto = cv.height / regiones;
        imagen;

    imagen = new Image();
    imagen.onload = function(){
        ctx.drawImage(imagen, c * ancho, f * alto, ancho, alto);
        rejilla();
    }
    imagen.src = 'imgs/img01.jpg';
}

function mostrarFotograma(){

    if(video.paused || video.ended)
        return;
    
    let cv = document.querySelector('canvas'),
    ctx = cv.getContext('2d');

    ctx.drawImage(video, 0, 0, cv.width, cv.height);

    setTimeout(mostrarFotograma, 1000/60);
}

function empezarVideo(){
    //Cada fotograma del video vamos a ir dibujandolo en el canvas
    //Cada cierto tiempo, vamos a capturar un fotograma
    video = document.createElement('video');
    video.onplay = mostrarFotograma;
    video.src = 'video/video.mp4';
    video.play();

}

function pararVideo(){
    video.pause();
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