function hacerLogin(frm){
	let xhr = new XMLHttpRequest(),
		url = 'api/usuarios/login',
		fd = new FormData(frm);

	xhr.open('POST', url, true);

	xhr.onload = function(){
        console.log(xhr.responseText);
        
        let r = JSON.parse(xhr.responseText);
        
		if (r.RESULTADO == 'OK') {
			console.log(r);
			sessionStorage['usuario'] = xhr.responseText;

			mostrarMensaje(r);
		}else{
			console.log('Error en el inicio de sesión. ');
			mostrarMensajeError();
		}
	};

	xhr.send(fd);
	return false;
}

/*
function comprobar(){
	var comprueba;

	console.log("¿Estamos logueados?");

	if(window.sessionStorage){
		if(sessionStorage["login"] != null){
			if (page == 'login.html'  ||  page == 'registro.html') {
				getAbsolutePath();
				location.href = './index.html';
				comprueba = true;
            }
		}else{
			console.log("No estás logueado. Por favor, inicie sesión.");
			mostrarMensajeError();
			comprueba = false;
		}
	}

	return comprueba;
}


function getAbsolutePath() {
    var loc = window.location;
	var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);

	console.log(pathName);

    return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
}*/

function mostrarMensaje(datos){
    let titulo, texto, div, html;

    titulo = 'LOGIN';
    texto = 'El usuario <b>' + datos.login + '</b> se ha logueado de forma correcta';

    div = document.createElement('div');
    
    div.setAttribute('id', 'capa-fondo');
	
    html = '<article>';
    html += '<h2>' + titulo + '</h2>';
    html += '<p>' + texto + '</p>';
    html += '<button onclick="cerrar();">Aceptar</button>';
    html += '</article>';

    div.innerHTML = html;

    document.body.appendChild(div);
}

function mostrarMensajeError() {
	let titulo, texto, div, html;

    titulo = 'Acceso denegado';
	texto = 'Se ha producido un error al intentar iniciar sesión. Por favor, vuelve a intentarlo.';

    div = document.createElement('div');
    
	div.id = 'capa-fondo';
	
    html = '<article>';
    html += '<h2>' + titulo + '</h2>';
    html += '<p>' + texto + '</p>';
    html += '<button onclick="cerrarError();">Aceptar</button>';
    html += '</article>';

    div.innerHTML = html;

    document.body.appendChild(div);
}

function cerrar(){
	document.querySelector('#capa-fondo').remove();
	location.href = './index.html';
}

function cerrarError(){
	document.querySelector('#capa-fondo').remove();
	document.getElementById('mylog').reset();
	document.getElementById('login').focus();
}

function hacerRegistro(frm){
	let url = 'api/usuarios/registro',
		fd  = new FormData(frm);

	fetch(url, {method:'POST',body:fd}).then(function(respuesta){
		if(respuesta.ok){
			respuesta.json().then(function(datos){
				console.log("Datos del método hacerRegistro(): \n");
				console.log(datos);
				//Limpiamos formulario
				document.getElementById('myreg').reset();
				mensajeRegistro(datos.LOGIN);
			});
		}else
			console.log('Error en la petición fetch');
	});

	return false;
}

function mensajeRegistro(datos){
	let titulo, texto, div, html;

    titulo = 'REGISTRO';
    texto = 'El usuario <b>' + datos + '</b> se ha registrado correctamente. ';

    div = document.createElement('div');
    div.setAttribute('id', 'capa-fondo');
	
    html = '<article>';
    html += '<h2>' + titulo + '</h2>';
    html += '<p>' + texto + '</p>';
    html += '<button onclick="window.location.href=\'login.html\';">Aceptar</button>';
    html += '</article>';

    div.innerHTML = html;
    document.body.appendChild(div);
}

function compruebaUsuario(value){
	let url = `api/usuarios/${value}`,
	    html;

	fetch(url, {method:'GET'}).then(function(respuesta){
		if(respuesta.ok){
			respuesta.json().then(function(datos){
				//Comprobamos el estado del usuario por consola
				console.log("Datos del método compruebaUsuario(): \n");
				console.log(datos);
				if(datos.DISPONIBLE == false){
					console.log('Usuario no disponible.');
	
					html = '<p class="user"> (*) El nombre de usuario no se encuentra disponible. </p>';
					document.querySelector('#mensaje').innerHTML = html;
					document.getElementById('mensaje').style.display = "block";
					document.getElementById('mensaje').style.color = 'red';
				}else{
					//No enseñamos ningún mensaje
					html = '';
					document.querySelector('#mensaje').innerHTML = html;
					console.log('Usuario disponible :D');
				}
			});
		}else{
			console.log('Error(' + respuesta.status + '): ' + respuesta.statusText);      
			return;    
		}
	});
}

function compruebaPassword(){
	let pwd = document.getElementById('pass').value,
		pwd2 = document.getElementById('pass2').value,
		html;

	if(pwd != null && pwd2 != null && pwd != '' && pwd2 != ''){
		console.log('Contraseña: ' + pwd + '\n' + "Repite contraseña: " + pwd2);
		if(pwd != pwd2){
			html = '<p class="user"> (*) Las contraseñas no coinciden </p>';
			document.querySelector('#mensaje2').innerHTML = html;
			document.getElementById('mensaje2').style.display = "block";
			document.getElementById('mensaje2').style.color = 'red';
		}else{
			html = '';
			document.querySelector('#mensaje2').innerHTML = html;
			console.log('Contraseñas correctas');
		}
	}
}

function logout(){
	console.log("Vamos a cerrar sesión.");
	sessionStorage.clear();
}