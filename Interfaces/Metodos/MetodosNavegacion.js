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


async function irAEditarProducto(idProductoSeleccionado){
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const userId = urlParams.get('idUser');
            //const response = await fetch('http://localhost:5169/buscarProductoX');
    
            //const response = await fetch(`http://localhost:5169/buscarProductoX?idProductoSeleccionado=${idProductoSeleccionado}`);
            const response = await fetch(`${lugarDeEjecucion}/buscarProductoSelec`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idproducto: idProductoSeleccionado
                }),
            });
    
            if (response.ok) {
                const data = await response.json();
                const prod = data.producto;
                console.log(prod);
                if(prod.idproducto == -1){
                    window.location.href = `./EditarProductoGuardado.html?idUser=${userId}`
                }else
                    window.location.href = `./EditarProducto.html?idUser=${userId}`        
    
            } else {
                console.error('Error al obtener los detalles del producto:', response.statusText);
                const nombreInput = document.getElementById('nombre');
                const nombreProducto = 'Producto de ejemplo233';
                nombreInput.value = nombreProducto;
            }
        } catch (error) {
            console.error('Error inesperado:', error);
        }
}


function irALogin(){
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('idUser');

    window.location.href = `../index.html?idUser=${userId}`
}







