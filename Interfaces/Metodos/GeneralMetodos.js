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

function getPaginaAnt(){
    return localStorage.getItem('paginaAnterior');
}

function getSearchTerm(){
    return localStorage.getItem('searchTerm');
}

function getCategory(){
    return localStorage.getItem('category');
}
