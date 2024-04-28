import GeneralMetodos from './GeneralMetodos.js';
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

function IrABuquedaProducto(){

    window.location.href = `./ResultadoBusqueda.html`
}


function redirigirABusqueda(){
    window.location.href = `./NewPaginaPrincipal.html`
}

function volverPaginaAnterior(){
    window.history.back();
}

function irAHistorialDeBúsqueda(){
    //localStorage.setItem('itemID', idProductoSeleccionado);
    //localStorage.setItem('UsuarioID', idUsuarioIniciado);
    window.location.href = `./HistorialDeBusqueda.html`
}


function irANuevoProducto(){
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('idUser');

    window.location.href = `./NuevoProducto.html?idUser=${userId}`
}


function irAEditarProducto(){
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('idUser');

    window.location.href = `./EditarProducto.html?idUser=${userId}`
}


function irALogin(){
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('idUser');

    window.location.href = `../index.html?idUser=${userId}`
}







