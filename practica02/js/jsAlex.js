

// Funciones para acercarme a JQuery
function $(elemento) {
    return document.querySelector(elemento);
}

function $$(elementos, indice) {
    return document.querySelectorAll(elementos)[indice];
}

function $All(elementos) {
    return document.querySelectorAll(elementos);
}



// Función que se ejecuta cuando se ha cargado todo el DOM de la página
document.addEventListener('DOMContentLoaded', load, false);
function load() {

    if (comprobarSoporteWebStorage()) {

        // Página actual
        let url = location.href,
            ultimoSlash = url.lastIndexOf('/'),
            page = url.substring(ultimoSlash+1);

        page = (page == ''  ||  page == 'index.html#cabecera') ? 'index.html' : page;

        // Cargamos el contenido dinámico...
        cargarInicio(page);

        // Obtenemos los elementos de las páginas
        let paginas = $All('nav>ul>li>a>span:last-child');

        // Comprobamos si el usuario está logueado o no...
        if (sessionStorage.getItem('usuario')) {

            if (page == 'login.html'  ||  page == 'registro.html') {
                location.href = 'index.html';
            }

            paginas.forEach(function(pagina) {
                let paginaActual = pagina.parentNode.href,
                    ultimoSlash = paginaActual.lastIndexOf('/'), pageActual = paginaActual.substring(ultimoSlash+1);

                if (pagina.innerHTML == 'Entrar'  ||  pagina.innerHTML == 'Registro'  ||  (pageActual == page  &&  pagina.innerHTML != 'Salir')) {
                    pagina.parentNode.parentNode.style.display = 'none';
                }
            });
            
        } else {

            if (page == 'nuevo.html') {
                location.href = 'index.html';
            }

            paginas.forEach(function(pagina) {
                let paginaActual = pagina.parentNode.href,
                    ultimoSlash = paginaActual.lastIndexOf('/'), pageActual = paginaActual.substring(ultimoSlash+1);

                if (pagina.innerHTML == 'Nuevo artículo'  ||  pagina.innerHTML == 'Salir'  ||  pageActual == page) {
                    
                    pagina.parentNode.parentNode.style.display = 'none';
                }
            });

        }
    }
    
}



// Función para comprobar si el navegador soporta WebStorage
function comprobarSoporteWebStorage() {
    if (typeof(Storage) !== 'undefined') {
        return true;
    } else {
        console.warn('WebStorage no soportado. Por favor, actualice su navegador...');
        return false;
    }
}



// Función para cargar un contenido en función de la página
function cargarInicio(pagina) {

    switch(pagina) {
        
        case 'index.html':
            peticionPaginaArticulos(0);
            $('#busqueda>form').onsubmit = function() {
                return busquedaRapida();
            };
            break;

        default:
            console.log('Página desconocida...');
            break;

    }
}



// Función para pedir los artículos de una determinada página
function peticionPaginaArticulos(numeroPagina) {
    let xhr = new XMLHttpRequest(),
        url = 'api/articulos?pag=' + numeroPagina + '&lpag=6',
        section = $('#articulos>div:nth-child(2)'),
        fotos;

    // Abrimos la petición al servidor...
    xhr.open('GET', url, true);

    // Se ejecuta con problemas en la petición ajenos al servidor...
    xhr.onerror = function() {
        console.warn('Se ha producido un error en la petición...');
    };

    // Si finaliza la conexión con éxito...
    xhr.onload = function() {
        fotos = JSON.parse(xhr.responseText);
        fotos.FILAS.forEach(function(foto) {
            section.appendChild(crearFoto(foto));
        });
    };

    // Enviamos la petición al servidor...
    xhr.send();
}



// Función para crear una foto e incluirla en la página
function crearFoto(foto) {
    let articleFoto = document.createElement('article'),
        titulo = document.createElement('h5'),
        enlace = document.createElement('a'),
        parrafo1 = document.createElement('p'),
        parrafo2 = document.createElement('p'),
        parrafo3 = document.createElement('p'),
        img = document.createElement('img'),
        div = document.createElement('div');

    // Parte 1: Encabezados
    enlace.setAttribute('href', 'articulo.html?id='+foto.id);
    enlace.textContent = foto.nombre;
    titulo.appendChild(enlace);
    articleFoto.appendChild(titulo);

    // Parte 2: Imagen
    enlace.textContent = '';
    img.setAttribute('src', 'fotos/articulos/'+foto.imagen);
    img.setAttribute('alt', 'Foto no disponible');
    img.setAttribute('width', '400');
    enlace.appendChild(img);
    parrafo1.appendChild(enlace);
    articleFoto.appendChild(parrafo1);

    // Parte 3: Características
    parrafo2 = document.createElement('p');
    parrafo2.innerHTML = `<i class="fas fa-columns"></i> ${foto.nfotos}`;
    articleFoto.appendChild(parrafo2);

    let p1 = document.createElement('p');
    p1.innerHTML = `<i class="fas fa-coins"></i> ${foto.precio}`;
    div.appendChild(p1);

    let p2 = document.createElement('p');
    p2.innerHTML = `<i class="fas fa-eye"></i> ${foto.veces_visto}`;
    div.appendChild(p2);

    let p3 = document.createElement('p');
    p3.setAttribute('class', 'icon-user');
    p3.textContent = ' ' + foto.nsiguiendo;
    div.appendChild(p3);

    articleFoto.appendChild(div);
    parrafo3.textContent = foto.descripcion;
    articleFoto.appendChild(parrafo3);

    return articleFoto;
}



// Función para ejecutar la búsqueda rápida
function busquedaRapida() {
    let texto = $('#busqueda>form>p>input').value;
    
    if (texto != '') {
        location.href = 'buscar.html?t=' + texto;
    }

    // Para que no se recargue y ejecute a redirección...
    return false;
}