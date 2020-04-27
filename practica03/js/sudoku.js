
window.onload = function() {
    if(document.getElementById('inicio')){
        document.getElementById('inicio').addEventListener("click", iniciar);
    }
};

function iniciar(){
    console.log('Hellou');

    let html = '';
    //var checkbox = document.getElementById("modo");
    var text = document.getElementById("text");

    // If the checkbox is checked, display the output text
    //if (checkbox.checked == true){
        html = '<h2>Panel del juego</h2>';
        html += '<h3 id="puntua">Puntos: </h3>';
        html += '<canvas id="cv01" width="480" height="360"></canvas>';
    //} else {
    //    text.style.display = "none";
    //}

    document.getElementById('canvas').innerHTML = html;
}