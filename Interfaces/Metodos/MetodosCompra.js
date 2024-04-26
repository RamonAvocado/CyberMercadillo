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


function validarFormatoFecha(fechaCaducidadInput) {
    //es un formato año, mes, dia
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(fechaCaducidadInput);
}


function mostrarVentanaEmergente() {
    const confirmacion = confirm('¿Desea guardar los datos de su tarjeta para futuras compras?');

    if (confirmacion) {
        // guardo los datos de su tarjeta en la base de datos
        try {
            idUsuarioIniciado = localStorage.getItem('UsuarioID');
            numTarjeta = localStorage.getItem('numTarjeta');
            fechaCaducidad = localStorage.getItem('fechCaduci');
            cvv = localStorage.getItem('cvv');

            const response = fetch(`${lugarDeEjecucion}/GuardarDatosUsuario`, {
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
            

        } catch (error) {
            console.error('Error inesperado:', error);
        }
        return true;
    } else {
        alert('Los datos de su tarjeta no han sido guardados.');
        return true;
    }
}



function verificarCamposTarjeta() {
    const numTarjetaInput = document.querySelector('.payment-info input[type="text"][placeholder="Número de tarjeta"]');
    const fechaCaducidadInput = document.querySelector('.payment-info input[type="text"][placeholder="Fecha de caducidad"]');
    const cvvInput = document.querySelector('.payment-info input[type="text"][placeholder="CVV"]');
    
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


async function FinalizarCompra() {
    // Verificar si los campos de la tarjeta están rellenados
    const camposRellenados = verificarCamposTarjeta();

    if (camposRellenados) {
        // Mostrar ventana emergente para guardar los datos de la tarjeta
        const guardarDatosTarjeta =  mostrarVentanaEmergente();

        if (guardarDatosTarjeta) {
            // Aquí puedes agregar el código para proceder con la compra
            // Primero, actualiza la cantidad del producto en la base de datos
            try {
                const idProductoCantidadSelec = localStorage.getItem("itemCantSelec");
                const idProductoSeleccionado = localStorage.getItem("itemID");

                const response = await fetch(`${lugarDeEjecucion}/ActualizarCantidadProducto`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        idproducto: idProductoSeleccionado,
                        idProductoCantidadSelec: idProductoCantidadSelec
                    })
                });

                if (response.ok) {
                    //const data = await response.json();
                    alert("Gracias por su compra");
                    window.location.href = `./NewPaginaPrincipal.html`;
                } else {
                    console.error('Error en la solicitud al backend:', response.statusText);
                }
            } catch (error) {
                console.error('Error inesperado:', error);
            }
        }
    }
}
