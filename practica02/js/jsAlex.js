/////////////   VARIABLES GLOBALES  /////////////
var paginaActual = 0,
    totalPaginas,
    paramConsulta = '';



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

        // Averiguamos la página en la que estamos...
        page = (page.lastIndexOf('buscar.html') != -1) ? 'buscar.html' : page;
        page = (page.lastIndexOf('articulo.html') != -1) ? 'articulo.html' : page;
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






////////////////////////////////// ÍNDICE //////////////////////////////////////////////////////////////////

// Función para cargar un contenido en función de la página
function cargarInicio(pagina) {

    switch (pagina) {
        
        case 'index.html':
            peticionPaginaArticulos();
            $('#busqueda>form').onsubmit = function() {
                return busquedaRapida();
            };
            cambioPagina();
            break;

        case 'buscar.html':
            consultaInicial();
            $('#busquedaGold>form').onsubmit = function() {
                return consultaConParametros();
            };
            break;

        case 'articulo.html':
            informacionArticulo();
            break;

        default:
            console.log('Página desconocida...');
            break;

    }
}

////////////////////////////////// ÍNDICE //////////////////////////////////////////////////////////////////






// Función para pedir los artículos de una determinada página
function peticionPaginaArticulos() {
    let xhr = new XMLHttpRequest(),
        url = 'api/articulos?',
        section = $('#articulos>div:nth-child(2)'),
        fotos;
    
    // Completamos la url para el servidor...
    if (paramConsulta != ''  &&  location.href.indexOf('buscar.html') != -1) {
        url += paramConsulta + '&pag=' + paginaActual + '&lpag=6';
    } else if (location.href.indexOf('index.html') != -1) {
        url += 'pag=' + paginaActual + '&lpag=6';
    } else {
        return;
    }

    // Abrimos la petición al servidor...
    xhr.open('GET', url, true);

    // Se ejecuta con problemas en la petición ajenos al servidor...
    xhr.onerror = function() {
        console.warn('Se ha producido un error en la petición...');
    };

    // Si finaliza la conexión con éxito...
    xhr.onload = function() {
        fotos = JSON.parse(xhr.responseText);
        borrarArticulos();

        if (fotos.FILAS.length > 0) {

            // Actualizamos paginación...
            totalPaginas = Math.ceil(fotos.TOTAL_COINCIDENCIAS / 6);
            $$('#articulos>div:last-child>p', 2).innerHTML = ` ${paginaActual+1}/${totalPaginas} `;

            // Creamos e incluimos artículos...
            fotos.FILAS.forEach(function(foto) {
                section.appendChild(crearFoto(foto));
            });
        } else {
            $('#articulos>div:nth-child(2)').innerHTML = `<p style="font-size: 1.5em;">No se encontraron resultados.</p>`;
            $$('#articulos>div:last-child>p', 2).innerHTML = ` 0/0 `;
        }
    };

    // Para pasar estos parámetros necesita cabecera con autorización...
    if (paramConsulta.indexOf('mios') != -1  ||  paramConsulta.indexOf('siguiendo') != -1) {
        let usu = JSON.parse(sessionStorage.get('usuario')),
            autorizacion = usu.login + ':' + usu.token;

        xhr.setRequestHeader('Authorization', autorizacion);
    }

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
    titulo.innerHTML = `<a href="articulo.html?id=${foto.id}">${foto.nombre}</a>`;
    articleFoto.appendChild(titulo);

    // Parte 2: Imagen
    enlace.textContent = '';
    img.setAttribute('src', 'fotos/articulos/'+foto.imagen);
    img.setAttribute('alt', 'Foto no disponible');
    img.setAttribute('width', '400');
    img.setAttribute('height', '300');
    enlace.setAttribute('href', 'articulo.html?id=' + foto.id);
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

    // Para que no se recargue, y ejecute a redirección...
    return false;
}



// Función para ejecutar el cambio de pagina de artículos en función del botón
function cambioPagina() {
    let botonera = $All('#articulos>div:last-child>p');
    
    // Volver al inicio...
    botonera[0].onclick = function() {
        if (paginaActual > 0) {
            paginaActual = 0;
            borrarArticulos();
            peticionPaginaArticulos();
        }
    };

    // Una página atrás...
    botonera[1].onclick = function() {
        if (paginaActual > 0) {
            paginaActual--;
            borrarArticulos();
            peticionPaginaArticulos();
        }
    };

    // Una página adelante...
    botonera[3].onclick = function() {
        if (paginaActual < totalPaginas-1) {
            paginaActual++;
            borrarArticulos();
            peticionPaginaArticulos();
        }
    };

    // Ir a la última página...
    botonera[4].onclick = function() {
        if (paginaActual < totalPaginas-1) {
            paginaActual = totalPaginas-1;
            borrarArticulos();
            peticionPaginaArticulos();
        }
    };
}



// Función para limpiar todos los artículos de una página para añadir nuevos
function borrarArticulos() {
    let lista = $('#articulos>div:nth-child(2)');

    while (lista.hasChildNodes()) {
        lista.removeChild(lista.firstChild);
    }
}



// Función para ejecutar la posible consulta inicial que pueda instanciarse en la url
function consultaInicial() {
    let url = location.href,
        ultimoSlash = url.lastIndexOf('?'),
        cadena, parametro;

    if (ultimoSlash > -1) {
        parametro = url.charAt(ultimoSlash+1);
        cadena = url.substring(ultimoSlash+3, url.length);
        if (parametro == 't') {
            $('#buscar').value = corrigeCodificacion(cadena);
        } else {
            $('#vendedor').value = corrigeCodificacion(cadena);
        }
        consultaConParametros();
    }
}



// Función que corrige los carácteres que no se pueden mostrar con la codificación UTF-8
function corrigeCodificacion(frase) {
	var frase = frase;

	while (frase.search("%") > -1) {
		frase = frase.replace("%20", " ");
		frase = frase.replace("%C3%A1", "á");
		frase = frase.replace("%C3%A9", "é");
		frase = frase.replace("%C3%AD", "í");
		frase = frase.replace("%C3%B3", "ó");
		frase = frase.replace("%C3%BA", "ú");
		frase = frase.replace("%C3%81", "Á");
		frase = frase.replace("%C3%89", "É");
		frase = frase.replace("%C3%8D", "Í");
		frase = frase.replace("%C3%93", "Ó");
		frase = frase.replace("%C3%9A", "Ú");
		frase = frase.replace("%C3%B1", "ñ");
		frase = frase.replace("%C3%91", "Ñ");
	}

	return frase;
}



// Función para realizar una consulta de artículos mediante filtrados
function consultaConParametros() {
    let devuelve = '',
        fd = new FormData($('#busquedaGold>form'));

    if (fd.get('buscar') != ''  &&  fd.get('buscar') != ' ') {
        devuelve += '&t=' + fd.get('buscar');
    }

    if (fd.get('vendedor') != ''  &&  fd.get('vendedor') != ' ') {
        devuelve += '&v=' + fd.get('vendedor');
    }

    if (fd.get('categoria') != ''  &&  fd.get('categoria') != ' ') {
        devuelve += '&c=' + fd.get('categoria');
    }

    // Si está logueado necesitar una cabecera de autorización...
    if (sessionStorage.getItem('usuario')) {
        if (fd.get('seguidos') != ''  &&  fd.get('seguidos') != ' ') {
            devuelve += '&siguiendo';
        }

        if (fd.get('venta') != ''  &&  fd.get('venta') != ' ') {
            devuelve += '&mios';
        }
    }

    if (devuelve != '') {
        devuelve = devuelve.substring(1, devuelve.length);
    }

    // Una vez tenemos los parametros ejecutamos petición...
    paramConsulta = devuelve;
    peticionPaginaArticulos();

    return false;
}



// Función para cargar la información de un artículo
function informacionArticulo() {
    let xhr = new XMLHttpRequest(),
        url = 'api/articulos/',
        pagina = location.href,
        parametro = pagina.substring(pagina.lastIndexOf('?') + 4);

    // Si no hay parametro redirigimos a index...
    if (parametro == '') {
        location.href = 'index.html';
    }

    // Efectuamos la petición...
    xhr.open('GET', url+parametro, true);
    xhr.onload = function() {
        let respuesta = JSON.parse(xhr.responseText);
        console.log(respuesta);

        // Se ejecuta si existe dicha foto
        if (respuesta.FILAS.length > 0) {
            let articulo = respuesta.FILAS[0],
                sectionInfo = $('#infoArticulo');

            sectionInfo.appendChild(crearCabeceraInfoArticulo(articulo));
            sectionInfo.appendChild(crearCuerpoInfoVendedor(articulo));
            sectionInfo.innerHTML += `<p>${articulo.descripcion}</p>`;
        } else {
            location.href = index.html;
        }

    };
    
    if (sessionStorage.getItem('usuario')) {
        let usu = JSON.parse(sessionStorage.get('usuario')),
            autorizacion = usu.login + ':' + usu.token;

        xhr.setRequestHeader('Authorization', autorizacion);
    }
    xhr.send();
}



// Función para crear la cabecera de la información de una foto
function crearCabeceraInfoArticulo(articulo) {
    let div = document.createElement('div');

    div.innerHTML = `<figure>
                        <img src="fotos/articulos/${articulo.imagen}" alt="Foto no disponible" width="400">
                        <p><i class="fas fa-arrow-left"></i> <span>  1 de ${articulo.nfotos}  </span> <i class="fas fa-arrow-right"></i></p>
                    </figure>
                    <article>
                        <h5>${articulo.nombre}</h5>
                        <p><i class="fas fa-coins"></i> ${articulo.precio} €</p>
                        <p><i class="fas fa-eye"></i> ${articulo.veces_visto}</p>
                        <p class="icon-user"> ${articulo.nsiguiendo}</p>
                        <p class="icon-comment"> <a href="#grupoPreguntas">${articulo.npreguntas}</a></p>`;

    if (sessionStorage.getItem('usuario')) {
        if (articulo.estoy_siguiendo == '0') {
            div.innerHTML += `<p>
                                <button class="boton">Seguir</button>
                            </p>`;
        } else {
            div.innerHTML += `<p>
                                <button class="boton">Dejar de seguir</button>
                            </p>`;
        }
    }
                        
    div.innerHTML += `</article>`;

    return div;
}



// Función para crear la información de un vendedor que vende un determinado producto
function crearCuerpoInfoVendedor(articulo) {
    let div = document.createElement('div');

    div.innerHTML += `<article>
                        <h5><img src="fotos/usuarios/${articulo.foto_vendedor}" alt="Foto no disponible" width="200"></h5>
                        <p>Vendedor: <a href="buscar.html?v=${articulo.vendedor}">${articulo.vendedor}</a></p>
                    </article>`;

    return div;
}