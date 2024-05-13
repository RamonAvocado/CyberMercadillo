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


async function CargaFinCompra(){
    try{
        idUsuarioIniciado = localStorage.getItem('UsuarioID');
        idUsuarioIniciado= parseInt(idUsuarioIniciado);
        console.log("usuario: " +idUsuarioIniciado);

        var requestBody = {
            idusuario: idUsuarioIniciado,
        };

        //obtengo la información del usuario para la tarjeta de crédito
        const respuestaUser = await fetch(`${lugarDeEjecucion}/ObtenerInfoComprador`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if(respuestaUser.ok){
            const dataDirec = await respuestaUser.json();
            const usuario = dataDirec.info;

            //le paso la información a esta función para recuperar los productos
            mostrarInfoCompra(usuario)

        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado al cargar el carrito de compra:', error);
    }
}

async function mostrarInfoCompra (usuario){
    
    // Mostrar la información de dirección de envío
    const direccionEnvio = document.querySelector('.direccion_envio');
    direccionEnvio.textContent = `Dirección de envío: ${usuario.direccion}`;

    // Mostrar la información de dirección de facturación
    const direccionFac = document.querySelector('.direccion_facturacion');
    direccionFac.textContent = `Dirección de facturación: Calle Pepe Botella`;

    // Habilitar el botón para modificar la dirección
    const modificarButton = document.querySelector('.modificar-direc');

    modificarButton.addEventListener('click', () => {
        console.log("Hace como que modifica la dirección");

    });

    //información de la tarjeta
    const paymentInputs = document.querySelectorAll('.payment-info input');
    if (usuario.numeroTarjeta != null) {
        paymentInputs[0].value = usuario.numeroTarjeta;
        paymentInputs[1].value = usuario.fechaCaducidad;
        paymentInputs[2].value = usuario.CVV;
    }

    
    let descripc =  localStorage.getItem('descripc');
    let totalPrecio = localStorage.getItem('totalPrecio');

    
    const prodSelecc = document.querySelector('.prod-selecc');
    prodSelecc.textContent = `Productos Seleccionados: ${descripc}`;
    
    const totalCost = document.querySelector('.total-cost');
    totalCost.textContent = `Total: ${totalPrecio} €`;
}


function ModificarTarjeta(){
    const camposRellenados = verificarCamposTarjeta();
    
    if (camposRellenados) {
        // Mostrar ventana emergente para guardar los datos de la tarjeta
        mostrarVentanaEmergenteCompra();
    }
}

//boton de finalizar la compra
async function FinalizarCompra() {
    // Verificar si los campos de la tarjeta están rellenados
    const camposRellenados = verificarCamposTarjeta();

    if (camposRellenados) {
        try {

            idUsuarioIniciado = localStorage.getItem('UsuarioID');
            idUsuarioIniciado= parseInt(idUsuarioIniciado);

            var requestBody = {
                idusuario: idUsuarioIniciado,
            };
    
            var response = await fetch(`${lugarDeEjecucion}/TramitarPedido`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })

            if(response.ok){
                alert("Pedido enviado");
                window.location.href = `./NewPaginaPrincipal.html`;
            }
        } catch (error) {
            console.error('Error inesperado:', error);
        }
    }
}


function verificarCamposTarjeta() {
    
    const numTarjetaInput = document.querySelector('.tarjeta-info input[placeholder="Ingresa el número de tarjeta"]');
    const fechaCaducidadInput = document.querySelector('.tarjeta-info input[placeholder="Ingresa la fecha de caducidad"]');
    const cvvInput = document.querySelector('.tarjeta-info input[placeholder="Ingresa el CVV"]');

    localStorage.setItem('numTarjeta', numTarjetaInput.value);
    localStorage.setItem('fechCaduci', fechaCaducidadInput.value);
    localStorage.setItem('cvv', cvvInput.value);

    numTarjeta = localStorage.getItem('numTarjeta');
    fechaCaducidad = localStorage.getItem('fechCaduci');
    cvv = localStorage.getItem('cvv');

    // Verificar que todos los campos estén completos
    if (numTarjeta.trim() === '') {
        alert('Por favor, ingrese el número de tarjeta.');
        numTarjetaInput.focus();
        return false;
    }
    if (fechaCaducidad.trim() === '') {
        alert('Por favor, ingrese la fecha de caducidad de la tarjeta.');
        fechaCaducidadInput.focus();
        return false;
    }
    if (cvv.trim() === '') {
        alert('Por favor, ingrese el código CVV.');
        cvvInput.focus();
        return false;
    }

    /*
        NO BORRAR   

    if (!validarFormatoFecha(fechaCaducidad)) {
        alert('El formato de la fecha de caducidad no es válido. Por favor, ingrese en formato MM/AA.');
        fechaCaducidadInput.focus();
        return false;
    }*/
return true;
}

function validarFormatoFecha(fechaCaducidadInput) {
    //es un formato año, mes, dia
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(fechaCaducidadInput);
}


async function mostrarVentanaEmergenteCompra() {
    const confirmacion = confirm('¿Desea guardar los datos de su tarjeta para futuras compras?');

    if (confirmacion) {
        // guardo los datos de su tarjeta en la base de datos
        try {
            idUsuarioIniciado = localStorage.getItem('UsuarioID');
            numTarjeta = localStorage.getItem('numTarjeta');
            fechaCaducidad = localStorage.getItem('fechCaduci');
            cvv = localStorage.getItem('cvv');

            console.log("idUsuarioIniciado: " + idUsuarioIniciado + ", numTarjeta: " + numTarjeta + ", fechaCaducidad: " + fechaCaducidad + ", cvv: " + cvv);

            var response = await fetch(`${lugarDeEjecucion}/GuardarDatosUsuario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idusuario: idUsuarioIniciado,
                    numTarjeta: numTarjeta,
                    fechaCaducidad: fechaCaducidad,
                    cvv: cvv
                })
            });

            if(response.ok) {
                alert('Los datos de su tarjeta han sido guardados.');
            }
            else {
                console.error('Error en la solicitud al backend:', response.statusText);
            }
        } catch (error) {
            console.error('Error inesperado:', error);
        }
        return true;
    } else {
        alert('Los datos de su tarjeta no han sido guardados.');
    }
}


async function TramitarPedido(){
    window.location.href = `./FinalizarCompra.html`;
}
