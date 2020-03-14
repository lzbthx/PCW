

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