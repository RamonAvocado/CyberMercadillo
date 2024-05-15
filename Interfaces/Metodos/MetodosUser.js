var idProductoSeleccionado;
var idUsuarioIniciado;//guardo esto aquí para poder acceder en todas las páginas
var idProductoCantidadSelec;//cantidad de producto seleccionada
var idProductoCantidad;//cuantos producto hay en la base de datos
var categoriaSelect;
var numTarjeta;
var fechaCaducidad;
var cvv;

var paginaAnterior;
var searchTerm;
var category;
var TipoUsuarioRegistrado;


var lugarDeEjecucion = "http://localhost:5169";


function gestionarValorIDUser(valor) {
    if (valor === -1) {
        // Si se pasa -1, devolver el valor almacenado
        return idUsuarioIniciado;
    } else {
        // Si se pasa un valor distinto de -1, almacenarlo y devolver el mismo valor
        idUsuarioIniciado = valor;
        return idUsuarioIniciado;
    }
}




async function IniciarSesion(){
    try {
        LimpiarLocalStorage();
        // Pillar los datos del usuario
        const correo = document.getElementById("correoUser").value;
        const contraseña = document.getElementById("contraUser").value;
        console.log("El correo es: " + correo + " y la contraseña: " + contraseña);

        const response = await fetch(`${lugarDeEjecucion}/iniciarSesion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `correo=${encodeURIComponent(correo)}&contraseña=${encodeURIComponent(contraseña)}`,
        });

        if(response.ok){
            console.log("El usuario ha iniciado sesión");
            const data = await response.json();
            idUsuarioIniciado = data.Id;
            //console.log(data.TipoUsuario);
            //console.log('TipoUsuario:', typeof data.TipoUsuario);
            localStorage.setItem('UsuarioID', idUsuarioIniciado);
            // Determinar el tipo de usuario
            let tipoUsuario;
            
            if (data.TipoUsuario === "Vendedor" || data.TipoUsuario === "vendedor") {
                tipoUsuario = "vendedor";
                window.location.href = `./Interfaces/InterfazVendedor.html`;
            } else if (data.TipoUsuario === "Tecnico" || data.TipoUsuario === "tecnico") {
                tipoUsuario = "tecnico";
                window.location.href = `./Interfaces/ValidarProductos.html`;
            } else if (data.TipoUsuario === "Comprador" || data.TipoUsuario === "comprador") {
                tipoUsuario = "comprador";
                window.location.href = `./Interfaces/InterfazComprador.html`;
            }
            
            localStorage.setItem('tipoUserID', tipoUsuario);


        } else {
            console.error('Respuesta NO ok por:', response.statusText);
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        const mensajeError = document.getElementById("mensajeError");
        mensajeError.style.display = "block"; // Hacer visible el elemento
        console.error('Error al iniciar sesión:', error);
    }
}


function LimpiarLocalStorage() {
    localStorage.clear();
}


async function agregarCerrarSesion() {
    var usuarioLogueado = localStorage.getItem('UsuarioID');
    var tipoUsuarioLogueado = localStorage.getItem('tipoUserID');
    var sesionLink = document.getElementById('sesion-link');
    var sesionSUserLink = document.getElementById('sesion-user-link');
    if (!usuarioLogueado) {
        sesionLink.innerHTML = '<a href="../index.html">Iniciar Sesión</a>';
    } else {
        sesionLink.innerHTML = '<a href="#" onclick="cerrarSesion()">Cerrar Sesión</a>';
        if(tipoUsuarioLogueado == "vendedor"){
            sesionSUserLink.innerHTML += '<a href="./PaginaVendedor.html">Productos</a>';
            sesionSUserLink.innerHTML += '<a href="./InterfazVendedor.html">Mi Cuenta</a>';
        }else if(tipoUsuarioLogueado == "tecnico"){
            sesionSUserLink.innerHTML = '<a onclick="irAPagianValidaciones()">Validaciones</a>';
        }else{ 
            sesionSUserLink.innerHTML += '<a href="./ListaDeseados.html">Lista Deseados</a>';
            sesionSUserLink.innerHTML += '<a href="./CarritoDeCompra.html">Carrito De Compra</a>';
            sesionSUserLink.innerHTML += '<a href="./MisPedidos.html">Mis pedidos</a>';
            sesionSUserLink.innerHTML += '<a href="./InterfazComprador.html">Mi Cuenta</a>';
        }      
    }
}


function cerrarSesion() {
    localStorage.removeItem('UsuarioID');
    window.location.href = './NewPaginaPrincipal.html';
}

function iniciarSesionUser() {
    window.location.href = '../index.html';
}

//Se mantiene aquí pq solo user puede comprar, y no se reutiliza
//en ningun sitio
function irRegistroComprador() {
    // Obtener el ID del producto y la categoría de los atributos de datos (data-*) de la tarjeta de producto
    localStorage.setItem('tipoUsuRegistro', "Comprador");
    window.location.href = `./NuevoUsuarioComprador.html`;
    console.log("comprador");
}

/*function irAPagianVendedor() {
    window.location.href = './PaginaVendedor.html';
}*/
/*
function irAPagianValidaciones() {
    window.location.href = './ValidarProductos.html';
}*/

async function CargarPedidos(){
    try {

        idUsuarioIniciado = localStorage.getItem("UsuarioID");

        var requestBody = {
            idusuario: idUsuarioIniciado,
        };

        //obtengo el carrito de compra, los id's y su cantidad
        const response = await fetch(`${lugarDeEjecucion}/CargarPedidos`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        if(response.ok){
            var data = await response.json();
            var carritos = data.carritos;
            console.log(carritos);
            mostrarPedidos(carritos);
        }
        else {
        console.error('Error en la solicitud al backend:', response.statusText);
        }
    }
    catch(error){
        console.error('Error inesperado:', error);
    }
}

function mostrarPedidos(carritos){
    const tabla = document.getElementById("carritos-container");
    
    for(var i = 0; i < carritos.length; i++){
        var carrito = document.createElement("div");

        //esto es para saber que color darle
        if(carritos[i].estado == "En espera de pago"){
            carrito.classList.add('pedido', 'EnEspera');
        }else{
            carrito.classList.add('pedido', carritos[i].estado);
        }


        // Convertir la cadena de fecha a un objeto Date
        const fechaCompra = new Date(carritos[i].fecha);

        // Formatear la fecha y la hora
        const fechaFormateada = `${fechaCompra.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
        const horaFormateada = `${fechaCompra.getHours()}:${('0' + fechaCompra.getMinutes()).slice(-2)}`;

        // Información de cada carrito
        const info = document.createElement("div");
        info.classList.add('fecha');
        info.innerHTML = `<h2>Compra realizada el día: ${fechaFormateada} a la hora: ${horaFormateada}</h2>
        <h2>${carritos[i].estado}</h2>`;

        carrito.appendChild(info);

        tabla.appendChild(carrito);
    }
}
