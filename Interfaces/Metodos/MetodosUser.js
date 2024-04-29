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


function LimpiarLocalStorage() {
    localStorage.clear();
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

//Se mantiene aquí pq solo user puede comprar, y no se reutiliza
//en ningun sitio
function irRegistroComprador() {
    // Obtener el ID del producto y la categoría de los atributos de datos (data-*) de la tarjeta de producto

    window.location.href = `./NuevoUsuarioComprador.html`;
    localStorage.setItem('tipoUsuRegistro', "comprador");
    console.log("comprador");
}

/*
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
                    GeneralMetodos.mostrarResultado(data.resultado);
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
}*/

/*function irAPagianVendedor() {
    window.location.href = './PaginaVendedor.html';
}*/
/*
function irAPagianValidaciones() {
    window.location.href = './ValidarProductos.html';
}*/