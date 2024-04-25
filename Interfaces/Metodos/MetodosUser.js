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





function seleccionarProducto(productoSeleccionado) {
    // Desmarcar todos los productos seleccionados
    const selectedProducts = document.querySelectorAll('.product-card.selected');
    selectedProducts.forEach(product => product.classList.remove('selected'));

    // Marcar el producto actualmente seleccionado
    productoSeleccionado.classList.add('selected');
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


function validarFormatoFecha(fechaCaducidadInput) {
    //es un formato año, mes, dia
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(fechaCaducidadInput);
}



// NO FUNCIONA +++++
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
            localStorage.setItem('UsuarioID', idUsuarioIniciado);
            
            // Determinar el tipo de usuario
            let tipoUsuario;
            console.log(data.TipoUsuario);
            
            if (data.TipoUsuario === "Vendedor") {
                tipoUsuario = "vendedor";
                window.location.href = `./Interfaces/PaginaVendedor.html`;
            } else if (data.TipoUsuario === "Técnico") {
                tipoUsuario = "tecnico";
                window.location.href = `./Interfaces/ValidarProductos.html`;
            } else {
                tipoUsuario = "usuario";
                window.location.href = `./Interfaces/NewPaginaPrincipal.html`;
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


async function agregarCerrarSesion() {
    var usuarioLogueado = localStorage.getItem('UsuarioID');
    var tipoUsuarioLogueado = localStorage.getItem('tipoUserID');
    var sesionLink = document.getElementById('sesion-link');
    var sesionSUserLink = document.getElementById('sesion-user-link');
    console.log(tipoUsuarioLogueado);
    if (!usuarioLogueado) {
        sesionLink.innerHTML = '<a href="../index.html">Iniciar Sesión</a>';
    } else {
        sesionLink.innerHTML = '<a href="#" onclick="cerrarSesion()">Cerrar Sesión</a>';
        if(tipoUsuarioLogueado == "vendedor"){
            sesionSUserLink.innerHTML = '<a href="./PaginaVendedor.html">Productos</a>';
        }else if(tipoUsuarioLogueado == "tecnico"){
            sesionSUserLink.innerHTML = '<a onclick="irAPagianValidaciones()">Validaciones</a>';
        }else sesionSUserLink.innerHTML = '<a href="./ListaDeseados.html">Lista Deseados</a>';        
    }
}


function cerrarSesion() {
    localStorage.removeItem('UsuarioID');
    window.location.href = './NewPaginaPrincipal.html';
}

function iniciarSesionUser() {
    window.location.href = '../index.html';
}


function irRegistroComprador() {
    // Obtener el ID del producto y la categoría de los atributos de datos (data-*) de la tarjeta de producto

    window.location.href = `./NuevoUsuarioComprador.html`;
    localStorage.setItem('tipoUsuRegistro', "comprador");
    console.log("comprador");
}


async function agregarUsuarioComprador(TipoUsuarioRegistrado)
{
        console.log('ID del usuario registrado:', TipoUsuarioRegistrado);
        document.getElementById('agregarCompradorForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const nombreUsu = formData.get('nombreUsuC');
            const telefono = formData.get('TelUsuC');
            const correoUsu = formData.get('CorreoUsuC');
            const contraseña = formData.get('ContraseñaUsuC');
            const contraseñaR = formData.get('RContraseñaUsuC');
            const direccion = formData.get('DirUsuC');
            const cvv = parseInt(formData.get('CVV'));
            const numTarj = parseInt(formData.get('NumTarj'));
            const FechaCad = formData.get('FechaCad');

            try {
                const response = await fetch(`http://localhost:5169/AgregarComprador`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nombre: nombreUsu,
                        movil: telefono,
                        correo: correoUsu,
                        contraseña: contraseña,
                        direccion: direccion,
                        CVV: cvv,
                        fechaCaducidad: FechaCad,
                        numeroTarjeta: numTarj,
                        tipoUsu:TipoUsuarioRegistrado,
                    }),
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('Producto creado correctamente');
                    mostrarResultado(data.resultado); 
                    window.location.reload();
                } else {
                    console.error('Error al crear el usuario:', response.statusText);
                }
            } catch (error) {
                console.error('Error inesperado:', error);
            }
            alert("Usuario creado correctamente")
            window.location.reload();
        });
}

function irAPagianVendedor() {
    window.location.href = './PaginaVendedor.html';
}

function irAPagianValidaciones() {
    window.location.href = './ValidarProductos.html';
}