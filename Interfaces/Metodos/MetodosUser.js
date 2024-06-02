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
let formSubmitEventListenerAddedVend = false;
let formSubmitEventListenerAddedComp = false;

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
            console.log(idUsuarioIniciado);
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
    var sesionUserLink = document.getElementById('sesion-user-link');
    var sesionSUserLink = document.getElementById('sesion-carro-link');

    if (!usuarioLogueado) {
        sesionLink.innerHTML = '<button class="styled-button" onclick="location.href=\'../index.html\'">Iniciar Sesión</button>';
    } else {
        // sesionLink.innerHTML = '<button class="styled-button" onclick="cerrarSesion()">Cerrar Sesión</button>';
        if (tipoUsuarioLogueado == "vendedor") {
            sesionUserLink.innerHTML = '<button class="styled-button" onclick="location.href=\'./InterfazVendedor.html\'">Mi Cuenta</button>';
            sesionUserLink.innerHTML += '<button class="styled-button" onclick="location.href=\'./PaginaVendedor.html\'">Productos</button>';
        } else if (tipoUsuarioLogueado == "tecnico") {
            sesionUserLink.innerHTML = '<button class="styled-button" onclick="location.href=\'./InterfazVendedor.html\'">Mi Cuenta</button>';
            sesionUserLink.innerHTML += '<button class="styled-button" onclick="irAPagianValidaciones()">Validaciones</button>';
        } else { 
            sesionUserLink.innerHTML = '<button class="styled-button" onclick="location.href=\'./InterfazComprador.html\'">Mi Cuenta</button>';
            sesionUserLink.innerHTML += '<button class="styled-button" onclick="location.href=\'./ListaDeseados.html\'">Lista de Deseados</button>';
            sesionSUserLink.innerHTML = `
                <div data-tooltip="Carrito de compra" class="boton-carro" onclick="location.href='./CarritoDeCompra.html'">
                    <div class="button-wrapper">
                        <div class="text">CARRITO DE COMPRA</div>
                        <span class="icon">
                            <svg viewBox="0 0 16 16" class="bi bi-cart2" fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"></path>
                            </svg>
                        </span>
                    </div>
                </div>`;
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

        // Información de cada carrito
        const info = document.createElement("div");
        info.classList.add('fecha');
        info.innerHTML = `<h2>Compra realizada el día: ${fechaFormateada}</h2>
        <h2>${carritos[i].estado}</h2>`;

        carrito.appendChild(info);

        tabla.appendChild(carrito);
    }
}
    


    async function mostrarVendedor() {
        try {
            var idUser= localStorage.getItem('UsuarioID');
            console.log('ID del vendedor seleccionado:', idUser);
            const response = await fetch(`${lugarDeEjecucion}/buscarUsuario`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idusuario: idUser
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                const user = data.objeto[0];
                document.getElementById('nombreUsu').value = user.nombre;
                document.getElementById('TelUsu').value = user.movil;
                document.getElementById('CorreoUsu').value = user.correo;
                document.getElementById('ContraseñaUsu').value = user.contraseña;
                document.getElementById('RContraseñaUsu').value = user.contraseña;
                document.getElementById('DirUsu').value = user.direccion;
                document.getElementById('NomTUsu').value = user.nombretienda;
                document.getElementById('TelUsuT').value = user.telefonotienda;
                if (user.fotoPerfil !== null && user.fotoPerfil !== "") {
                    document.getElementById('imagen').src = user.fotoPerfil;
                }

            } else {
                console.error('Error al obtener los detalles del vendedor:', response.statusText);
            }

        } catch (error) {
            console.error('Error inesperado:', error);
        }
    }

    async function mostrarComprador() {
        try {
            var idUser= localStorage.getItem('UsuarioID');
            console.log('ID del vendedor seleccionado:', idUser);
            const response = await fetch(`${lugarDeEjecucion}/buscarUsuario`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idusuario: idUser
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const user = data.objeto[0];
                console.log(user);
                document.getElementById('nombreUsuC').value = user.nombre;
                document.getElementById('TelUsuC').value = user.movil;
                document.getElementById('CorreoUsuC').value = user.correo;
                document.getElementById('ContraseñaUsu').value = user.contraseña;
                document.getElementById('RContraseñaUsu').value = user.contraseña;
                document.getElementById('DirUsuEnvio').value = user.direccion;
                document.getElementById('DirUsuFact').value = user.direccionFacturacion;
                document.getElementById('NumTarj').value = user.numeroTarjeta;
                document.getElementById('CVV').value = user.CVV;
                document.getElementById('FechaCad').value = user.fechaCaducidad;
                if (user.fotoPerfil !== null) {
                    document.getElementById('imagen').src = user.fotoPerfil;
                }

            } else {
                console.error('Error al obtener los detalles del vendedor:', response.statusText);
            }

        } catch (error) {
            console.error('Error inesperado:', error);
        }
    }

    function ActualizarVendedor() {
        if (!formSubmitEventListenerAddedVend) {
            document.getElementById('agregarProductoForm7').addEventListener('submit', async (event) => {
                event.preventDefault();
                await handleFormSubmitVend();
            });
            formSubmitEventListenerAddedVend = true;
        }
    }
    async function handleFormSubmitVend() 
    {
        var errorMessage = document.getElementById('error-message');
        if (errorMessage.style.display == 'block') {
            alert("Por favor ingrese los datos correctamente");
        } else {
                const formData = new FormData(event.target);             
                //var imagen = localStorage.getItem('UrlImg');
                var img2 = formData.get('nuevo-url-imagen');
                console.log(img2);
                var imagen;
                if (img2 !== "") {
                    imagen = img2;
                }else{
                    imagen = document.getElementById('imagen').src
                }

                var requestBody = {
                    nombreUsu: formData.get('nombreUsu'),
                    telefono: formData.get('TelUsu'),
                    correoUsu: formData.get('CorreoUsu'),
                    contraseña: formData.get('ContraseñaUsu'),
                    contraseñaR: formData.get('RContraseñaUsu'),
                    direccion: formData.get('DirUsu'),
                    telTienda: parseInt(formData.get('TelUsuT')),
                    nombreTienda: formData.get('NomTUsu'),
                    idvendedor:localStorage.getItem('UsuarioID'),
                    imgPerfil: imagen 
                };

                try {
                    const response = await fetch(`${lugarDeEjecucion}/ActualizarVendedor`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody)
                    });
            
                    if (response.ok) {
                        const data = await response.json();
                        const user = data.objeto[0];
                        console.log(user);
                        //const data = await response.json();
                        console.log('Usuario actualizado correctamente');
                        //mostrarResultado(data.resultado); 
                        GuardarInstantaneaUsuario();

                        window.location.href = `./InterfazVendedor.html`;
                    } else {
                        console.error('Error al actualizar el producto:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error inesperado:', error);
                }  
        } 
}

function ActualizarComprador() {
    if (!formSubmitEventListenerAddedComp) {
        document.getElementById('agregarProductoForm7').addEventListener('submit', async (event) => {
            event.preventDefault();
            await handleFormSubmitCompr();
        });
        formSubmitEventListenerAddedComp = true;
    }
}


async function handleFormSubmitCompr()
{   
    var errorMessage1 = document.getElementById('error-message1');
    var errorMessage2 = document.getElementById('error-message2');
    if (errorMessage1.style.display == 'block' || errorMessage2.style.display == 'block') {
        alert("Por favor ingrese los datos correctamente");
    } else {
            const formData = new FormData(event.target);             
            //var imagen = localStorage.getItem('UrlImg');
            var img2 = formData.get('nuevo-url-imagen');
            console.log(img2);
            var imagen;
            if (img2 !== "") {
                imagen = img2;
            }else{
                imagen = document.getElementById('imagen').src
            }

            var requestBody = {
                nombreUsu: formData.get('nombreUsuC'),
                telefono: formData.get('TelUsuC'),
                correoUsu: formData.get('CorreoUsuC'),
                contraseña: formData.get('ContraseñaUsu'),
                contraseñaR: formData.get('RContraseñaUsu'),
                direccion: formData.get('DirUsuEnvio'),
                dirFacturacion: formData.get('DirUsuFact'),
                NumTarjeta: parseInt(formData.get('NumTarj')),
                cvv: parseInt(formData.get('CVV')),
                fechaCaducidad: formData.get('FechaCad'),
                idcomprador:localStorage.getItem('UsuarioID'),
                imgPerfil: imagen 
            };

            try {
                const response = await fetch(`${lugarDeEjecucion}/ActualizarComprador`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });
        
                if (response.ok) {
                    const data = await response.json();
                    const user = data.objeto[0];
                    console.log(user);
                    //const data = await response.json();
                    console.log('Usuario actualizado correctamente');
                    GuardarInstantaneaUsuario();
                    //mostrarResultado(data.resultado); 

                    window.location.href = `./InterfazComprador.html`;
                } else {
                    console.error('Error al actualizar el producto:', response.statusText);
                }
            } catch (error) {
                console.error('Error inesperado:', error);
            }
    }
}



async function GuardarInstantaneaUsuario() {
    var password = document.getElementById('ContraseñaUsu').value;
    var idUser = localStorage.getItem('UsuarioID');

    var requestBody = {
        idUser: idUser,
        password: password
    };

    try {
        const response = await fetch(`${lugarDeEjecucion}/GuardarInstantaneaUsuario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            console.log("Respuesta ok");
        } else {
            console.error('Error en el backend: ', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}
