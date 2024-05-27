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
var contadorBusquedas;
var busquedasAnteriores = [];



var lugarDeEjecucion = "http://localhost:5169";

function IrABuquedaProducto(){
    window.location.href = `./ResultadoBusqueda.html`
}


function redirigirABusqueda(){
    window.location.href = `./NewPaginaPrincipal.html`
}

function IrAMisPedidos(){
    window.location.href = `./MisPedidos.html`
}


function volverPaginaAnterior(){
    if(contadorBusquedas > 0){
        var busquedasAnteriores = JSON.parse(localStorage.getItem('busquedasAnteriores'));
        if(busquedasAnteriores && busquedasAnteriores.length >= 0){
        // Si hay búsquedas anteriores en la pila, mostrar las últimas
        var ultimaBusqueda = busquedasAnteriores.pop();
        localStorage.setItem('busquedasAnteriores', JSON.stringify(busquedasAnteriores));
        mostrarProductosCat(ultimaBusqueda, 'Todas las categorías');
        contadorBusquedas--;
        console.log("contadorBusquedas: " + contadorBusquedas);
        } else {
            // Si no hay búsquedas anteriores, simplemente regresar una página en el historial
            window.history.back();
        }
    } else {
        // Si el contador de búsquedas es 0 o menos, simplemente regresar una página en el historial
        window.history.back();
    }
}
//POSIBLE METODO PARA VOLVER A ULTIMA BUSQUEDA DESDE PRODUCTO. Falta testear mas,pero primera vez funciaba
/**
 * function volverPaginaAnterior() {
    if (window.location.pathname.includes("InfoProducto.html")) {
        var seAccedioDesdeBusqueda = localStorage.getItem("seAccedioDesdeBusqueda");
        if (seAccedioDesdeBusqueda === "true") {
            var busquedasAnteriores = JSON.parse(localStorage.getItem('busquedasAnteriores'));
            if (busquedasAnteriores && busquedasAnteriores.length > 0) {
                var ultimaBusqueda = busquedasAnteriores.pop();
                localStorage.setItem('busquedasAnteriores', JSON.stringify(busquedasAnteriores));
                window.location.href = "ResultadoBusqueda.html";
            } else {
                // Si no hay búsquedas anteriores, redirigir al inicio
                window.location.href = "Inicio.html";
            }
        } else {
            // Si no se accedió desde la búsqueda, simplemente regresar una página en el historial
            window.history.back();
        }
    } else {
        // Si no está en la página de InfoProducto.html, simplemente regresar una página en el historial
        window.history.back();
    }
}
*/


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
            const response = await fetch(`${lugarDeEjecucion}/buscarProductoSeleccionado`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify({
                    idproducto: idProductoSeleccionado
                }),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data.objeto[0]);
                console.log("dfvndfnv"+data.objeto[0].idproducto);
                var validado = data.objeto[0].validado;
                console.log(validado);
                if (validado == false) {
                    window.location.href = `./EditarProductoGuardado.html?idUser=${userId}`;
                }
                if (validado == true) {
                    window.location.href = `./EditarProducto.html?idUser=${userId}`;
                }
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

async function irAProductosVendedor() {
    window.location.href = `./PaginaVendedor.html`
}

async function irACarritoDeCompra() {
    window.location.href = `./CarritoDeCompra.html`
}

async function irAListaDeDeseos() {
    window.location.href = `./ListaDeseados.html`
}

async function irAEditarPerfil(tipoUsuario) {
    if (tipoUsuario == "Vendedor" || tipoUsuario == "vendedor"){
        window.location.href = `./EditarVendedor.html`
    }else{
        window.location.href = `./EditarComprador.html`	
    }
}






