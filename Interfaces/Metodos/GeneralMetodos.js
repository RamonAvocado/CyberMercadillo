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
let formSubmitEventListenerAdded = false;
let formSubmitEventListenerAdded2 = false;




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

function LimpiarLocalStorage() {
    localStorage.clear();
}

function mostrarResultado(resultado) {
    var resultadosDiv = document.getElementById('resultados');
    //Esto es la respuesta que a accedido al Controlador Program y lo muestra por pantalla en la Pagina Principal
    resultadosDiv.innerHTML = `<p>Resultado: ${resultado}</p>`;
}
/*
async function mostrarProd(idProductoSeleccionado) {
    try {
        console.log('ID del producto seleccionado:', idProductoSeleccionado);
        //const response = await fetch('http://localhost:5169/buscarProductoX');

        //const response = await fetch(`http://localhost:5169/buscarProductoX?idProductoSeleccionado=${idProductoSeleccionado}`);
        const response = await fetch(`${lugarDeEjecucion}/buscarProductoX`,{
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
            console.log(data);

            const nombreInput = document.getElementById('nombre');
            const nombreProducto = 'Producto de ejemplo24';
            nombreInput.value = nombreProducto;

            const productos = data.result.Models;
            console.log(productos);
            if (productos.length > 0) {
                const primerProducto = productos[0]; // Obtener el primer producto (suponiendo que hay al menos uno)
                // Separar las URL de las imágenes
                
                
                const container = document.querySelector('.recommended-products');

                const imagenes = primerProducto.imagenes.split(' ');
                const primeraImagen = imagenes[0];

                // Crear elementos para mostrar el producto
                const productCard = document.createElement('div');
                productCard.classList.add('product-element');

                // Agregar la imagen principal del producto
                const imagenPrincipal = document.createElement('img');
                imagenPrincipal.src = primeraImagen;
                imagenPrincipal.alt = primerProducto.nombreproducto;
                imagenPrincipal.style.width = '200px';
                imagenPrincipal.style.height = '240px';
                productCard.appendChild(imagenPrincipal);

                // Contenedor para la flecha semi visible
                const contenedorFlecha = document.createElement('div');
                contenedorFlecha.classList.add('contenedor-flecha');

                // Verificar si hay más de una imagen para mostrar la flecha
                if (imagenes.length > 1) {
                    // Agrega la imagen semi visible de la flecha al contenedor
                    const flechaSemiVisible = document.createElement('img');
                    flechaSemiVisible.src = 'Imagenes/flecha.png'; // Ruta a la imagen de la fecha
                    flechaSemiVisible.alt = 'Flecha';
                    flechaSemiVisible.style.width = '40px';
                    flechaSemiVisible.style.height = '40px';
                    flechaSemiVisible.classList.add('flecha-semi-visible');
                    contenedorFlecha.appendChild(flechaSemiVisible);
                }

                productCard.appendChild(contenedorFlecha);

                if (imagenes.length > 1) {
                    contenedorFlecha.addEventListener('click', function() {
                        const index = imagenes.indexOf(imagenPrincipal.src);
                        const siguienteIndex = (index + 1) % imagenes.length;
                        imagenPrincipal.src = imagenes[siguienteIndex];
                        //nuevoUrlImagenInput.value = imagenes[siguienteIndex]; 
                    });
                }
                container.appendChild(productCard);

                document.getElementById('nombre').value = primerProducto.nombreproducto;
                document.getElementById('precio').value = primerProducto.precio;
                document.getElementById('categoria').value = primerProducto.categoria;
                document.getElementById('descripcion').value = primerProducto.descripcion;
                document.getElementById('cantidad').value = primerProducto.cantidad;
                document.getElementById('nuevo-url-imagen').value = primerProducto.imagenes;             
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

function irAInfoProducto2(productoParaInfo) {
    // Redirigir a la página de InfoProducto.html con el parámetro del producto
    window.location.href = `InfoBasicaProducto.html?id=${productoParaInfo}`;

    // Ocultar el botón después de la redirección
    const historialBtn = document.getElementById('historialBtnInfoProd');
    historialBtn.style.display = 'none';
}
*/
function agregarUsuarioVendedor(TipoUsuarioRegistrado) {
    if (!formSubmitEventListenerAdded) {
        document.getElementById('agregarVendedorForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            await handleFormSubmit(TipoUsuarioRegistrado);
        });
        formSubmitEventListenerAdded = true;
    }
}

async function handleFormSubmit(TipoUsuarioRegistrado) {
    console.log(TipoUsuarioRegistrado);
    var errorMessage = document.getElementById('error-message');
    if (errorMessage.style.display == 'block') {
        alert("Por favor ingrese los datos correctamente");
    } else {
        const formData = new FormData(document.getElementById('agregarVendedorForm'));
        var requestBody = {
            nombreUsu: formData.get('nombreUsu'),
            telefono: formData.get('TelUsu'),
            correoUsu: formData.get('CorreoUsu'),
            contraseña: formData.get('ContraseñaUsu'),
            contraseñaR: formData.get('RContraseñaUsu'),
            direccion: formData.get('DirUsu'),
            telTienda: parseInt(formData.get('TelUsuT')),
            nombreTienda: formData.get('NomTUsu'),
            tipoUsu: TipoUsuarioRegistrado
        };

        try {
            const response = await fetch(`${lugarDeEjecucion}/AgregarVendedor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const jsonResponse = await response.json();
                const message = jsonResponse.mensaje;
                const existe = jsonResponse.existe;

                if (existe == true)
                    alert("Usuario ya existe con ese correo")
                else {
                    alert(message);
                    window.location.href = `../index.html`
                }
            } else {
                console.error('Error al crear el usuario:', response.statusText);
            }
        } catch (error) {
            console.error('Error inesperado:', error);
        }
    }
}
/*
async function agregarUsuarioComprador(TipoUsuarioRegistrado){
    document.getElementById('agregarCompradorForm').addEventListener('submit', async (event) => {
        event.preventDefault();
            var errorMessage = document.getElementById('error-message');
            if (errorMessage.style.display == 'block'){
                alert("Por favor ingrese los datos correctamente");
            }else{
                const formData = new FormData(event.target);
                const cvv = formData.get('CVV');
                const numTarj = formData.get('NumTarj');
                const fechaCad = formData.get('FechaCad');
                var requestBody = {
                    nombreUsu : formData.get('nombreUsuC'),
                    telefono : formData.get('TelUsuC'),
                    correoUsu : formData.get('CorreoUsuC'),
                    contraseña : formData.get('ContraseñaUsu'),
                    contraseñaR : formData.get('RContraseñaUsu'),
                    direccion : formData.get('DirUsuEnvio'),
                    cvv : cvv ? parseInt(cvv) : 0,
                    numTarj : numTarj ? parseInt(numTarj) : 0,
                    FechaCad : fechaCad ? fechaCad : "",
                    tipoUsu: TipoUsuarioRegistrado,
                    dirFacturaccion : formData.get('DirUsuFact'),
                };

                console.log('Llegamos acá');
                // Realizar una solicitud GET al backend para obtener todos los productos del vendedor
                
                try {

                    const response = await fetch(`${lugarDeEjecucion}/AgregarComprador`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody)
                    });

                    if (response.ok) {
                        //const data = await response.json();
                        console.log('Usuario creado correctamente');
                        //mostrarResultado(data.resultado); 
                        //window.location.reload();
                        window.location.href = `../index.html`
                    } else {
                        console.error('Error al crear el usuario:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error inesperado:', error);
                }
                //alert("Error crear Producto")
                //window.location.reload();
            }
    });
}*/

function agregarUsuarioComprador(TipoUsuarioRegistrado) {
    if (!formSubmitEventListenerAdded2) {
        document.getElementById('agregarCompradorForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            await handleFormSubmitComprador(TipoUsuarioRegistrado);
        });
        formSubmitEventListenerAdded2 = true;
    }
}

async function handleFormSubmitComprador(TipoUsuarioRegistrado) {
    var errorMessage = document.getElementById('error-message');
    if (errorMessage.style.display == 'block') {
        alert("Por favor ingrese los datos correctamente");
    } else {
        const formData = new FormData(document.getElementById('agregarCompradorForm'));
        const cvv = formData.get('CVV');
        const numTarj = formData.get('NumTarj');
        const fechaCad = formData.get('FechaCad');
        var requestBody = {
            nombreUsu: formData.get('nombreUsuC'),
            telefono: formData.get('TelUsuC'),
            correoUsu: formData.get('CorreoUsuC'),
            contraseña: formData.get('ContraseñaUsu'),
            contraseñaR: formData.get('RContraseñaUsu'),
            direccion: formData.get('DirUsuEnvio'),
            cvv: cvv ? parseInt(cvv) : 0,
            numTarj: numTarj ? parseInt(numTarj) : 0,
            FechaCad: fechaCad ? fechaCad : "",
            tipoUsu: TipoUsuarioRegistrado,
            dirFacturaccion: formData.get('DirUsuFact'),
        };

        console.log('Llegamos acá');
        // Realizar una solicitud GET al backend para obtener todos los productos del vendedor

        try {
            const response = await fetch(`${lugarDeEjecucion}/AgregarComprador`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const jsonResponse = await response.json();
                const message = jsonResponse.mensaje;
                const existe = jsonResponse.existe;

                if (existe == true)
                    alert("Usuario ya existe con ese correo")
                else {
                    alert(message);
                    window.location.href = `../index.html`
                }
            } else {
                console.error('Error al crear el usuario:', response.statusText);
            }
        } catch (error) {
            console.error('Error inesperado:', error);
        }
    }
}

function irAPagianValidaciones() {
    window.location.href = './ValidarProductos.html';
}

function irAPagianVendedor() {
    window.location.href = './PaginaVendedor.html';
}


//INICIO METODOS CARGA/MUESTRA PRODUCTOS

async function InicializarProductos() {
    try {
        console.log("Entra funcion InicializarProductos");
        
        const response = await fetch(`${lugarDeEjecucion}/inicializar`);
    
        if (response.ok) {
            const data = await response.json();
            CargarProductosDestacados();
            CargarProductosRecomendados();
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

async function CargarProductosRecomendados(){
    try {
        console.log("Entra funcion cargarProductosRecomendados");
        // Realizar una solicitud GET al backend para obtener los 6 primeros productos
        const response = await fetch(`${lugarDeEjecucion}/ObtenerProductosRecomendados`);
        if (response.ok) {
            const data = await response.json();
            const productos = data.objeto;

            const productosPorPagina = 6;
            const totalPaginas = Math.ceil(productos.length / productosPorPagina);

            // Mostrar los productos de la primera página en la interfaz de usuario
            mostrarProductosRecomendados(productos, "Todas las categorias", productosPorPagina);

            // Generar enlaces de paginación
            generarEnlacesPaginacionRec(totalPaginas);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

async function cargarProductosPorPaginaRec(numeroPagina) {
    const productosPorPagina = 6;
    try {
        const response = await fetch(`${lugarDeEjecucion}/ObtenerProductosRecomendados`);
        if (response.ok) {
            const data = await response.json();
            const productos = data.objeto;

            const inicio = (numeroPagina - 1) * productosPorPagina;
            const fin = numeroPagina * productosPorPagina;
            const productosPagina = productos.slice(inicio, fin);

            mostrarProductosRecomendados(productos, "Todas las categorias", productosPorPagina);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}
/*
async function cargarProductosPorPagina(numeroPagina,idUsuarioIniciado) {
    const productosPorPagina = 6;

    try {

        console.log('ID del usuario seleccionado:', idUsuarioIniciado);
        // Realizar una solicitud GET al backend para obtener todos los productos del vendedor
        const response = await fetch(`${lugarDeEjecucion}/ObtenerProductosVendedor`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idusuario: idUsuarioIniciado
            }),
        });

        if (response.ok) {
            const data = await response.json();
            const productos = data.productos.Models;

            const inicio = (numeroPagina - 1) * productosPorPagina;
            const fin = numeroPagina * productosPorPagina;
            const productosPagina = productos.slice(inicio, fin);

            mostrarProductosVendedor(productosPagina);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}
*/
async function cargarProductosPorPaginaDest(numeroPagina) {
    const productosPorPagina = 6;

    try {
        const response = await fetch(`${lugarDeEjecucion}/ObtenerProductosDestacados`);
        if (response.ok) {
            const data = await response.json();
            const productos = data.objeto;

            const inicio = (numeroPagina - 1) * productosPorPagina;
            const fin = numeroPagina * productosPorPagina;
            const productosPagina = productos.slice(inicio, fin);

            mostrarProductosDestacados(productosPagina);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

function mostrarProductosRecomendados(productos, categoria, cantidad) {
    var cant = 0;
    const container = document.querySelector('.recommended-products');
    container.innerHTML = '';
    console.log("HAY TANTOS PRODUCTOS : " + productos.length);
    console.log("CATEGORIA PRODUCTO SELEC : " + cantidad);
    // Itera sobre los productos y crea elementos para mostrarlos
    productos.forEach((producto) => {
        if(producto.categoria == categoria && cant < cantidad && producto.idproducto != localStorage.getItem("itemID")){
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            //imagenes de cada producto
            const imagenes = producto.imagenes.split(' ');
            const primeraImagen = imagenes[0];
            cant++;

            // Agrega la imagen, nombre y precio del producto dentro de un enlace       
            productCard.innerHTML = `
                <button class="favorite-btn"></button> <!-- Botón de favoritos -->
                <img src="${primeraImagen}" alt="${producto.nombreproducto}"  style="width: 200px; height: 240px;">
                <h3>${truncate(producto.nombreproducto)}</h3>
                <p class="price">${producto.precio} €</p>
                <p class="description">${truncate(producto.descripcion)}</p>
                <div hidden>
                    <div id="CategoriaSelec" data-info="${producto.categoria}"> </div>
                    <div id="idProducto" data-info="${producto.idproducto}"> </div>
                    <div id="categoriaProducto" data-info="${producto.categoria}"> </div>
                    <p> Puntuación de Huella Ecológica:  ${producto.puntuacionEco}</p style="font-size: 18px;">
                </div>
            `;

            // Agregar evento de clic para seleccionar el producto
            productCard.addEventListener('click', (event) => {
                seleccionarProducto(event.currentTarget);
            });

            // Agregar evento de doble clic para ir a la página de información del producto
            productCard.addEventListener('dblclick', (event) => {
                irAInfoProducto(event.currentTarget);
            });

            container.appendChild(productCard);
            }
    });
}

function generarEnlacesPaginacionRec(totalPaginas) {
    const paginasContainer = document.getElementById('paginasRec');
    paginasContainer.innerHTML = ''; // Limpiar los enlaces de paginación antes de generarlos nuevamente

    for (let i = 1; i <= totalPaginas; i++) {
        const pagina = document.createElement('li');
        pagina.classList.add('pagina-item');
        const enlace = document.createElement('a');
        enlace.href = `#pagina-${i}`;
        enlace.textContent = i;
        pagina.appendChild(enlace);
        paginasContainer.appendChild(pagina);

        // Agregar event listener para cargar los productos de la página seleccionada
        enlace.addEventListener('click', async function(event) {
            event.preventDefault();
            await cargarProductosPorPaginaRec(i);
        });
    }
}
/*
function generarEnlacesPaginacion(totalPaginas,idUsuarioIniciado) {
    const paginasContainer = document.getElementById('paginas');
    paginasContainer.innerHTML = ''; // Limpiar los enlaces de paginación antes de generarlos nuevamente

    for (let i = 1; i <= totalPaginas; i++) {
        const pagina = document.createElement('li');
        pagina.classList.add('pagina-item');
        const enlace = document.createElement('a');
        enlace.href = `#pagina-${i}`;
        enlace.textContent = i;
        pagina.appendChild(enlace);
        paginasContainer.appendChild(pagina);

        // Agregar event listener para cargar los productos de la página seleccionada
        enlace.addEventListener('click', async function(event) {
            event.preventDefault();
            await cargarProductosPorPagina(i,idUsuarioIniciado);
        });
    }
}
*/

async function CargarProductosDestacados() {
    try {
        console.log("Entra funcion cargarProductosDestacados");
        // Realizar una solicitud GET al archvo SERVICIOS para obtener los productos del archivo de fachada logica y luego de tienda
        //await fetch(`${lugarDeEjecucion}/inicializar`);
        const response = await fetch(`${lugarDeEjecucion}/ObtenerProductosDestacados`);
    
        if (response.ok) {
            const data = await response.json();

            //comprobar desde f12 consola que salen todos los productos
            /*
            data.productos.forEach((prod) => {
                console.log(`Nombre: ${prod.nombreproducto}, Precio: ${prod.precio}`);
            });*/
        
            const productos = data.objeto;
            
            const productosPorPagina = 6;
            const totalPaginas = Math.ceil(productos.length / productosPorPagina);

            // Mostrar los productos de la primera página en la interfaz de usuario
            mostrarProductosDestacados(productos.slice(0, productosPorPagina));

            // Generar enlaces de paginación
            generarEnlacesPaginacionDest(totalPaginas);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}


function mostrarProductosDestacados(productos) {
    const container = document.querySelector('.featured-products');
    container.innerHTML = '';


    // Itera sobre los productos y crea elementos para mostrarlos
    productos.forEach((producto) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        //imagenes de cada producto
        const imagenes = producto.imagenes.split(' ');
        const primeraImagen = imagenes[0];

        // Agrega la imagen, nombre y precio del producto dentro de un enlace
        productCard.innerHTML = `
            <button class="favorite-btn"></button> <!-- Botón de favoritos -->
            <img src="${primeraImagen}" alt="${producto.nombreproducto}"  style="width: 200px; height: 240px;">
            <h3>${truncate(producto.nombreproducto)}</h3>
            <p class="price">${producto.precio} €</p>
            <p class="description">${truncate(producto.descripcion)}</p>
            <div hidden>
                <div id="CategoriaSelec" data-info="${producto.categoria}"> </div>
                <div id="idProducto" data-info="${producto.idproducto}"> </div>
                <div id="categoriaProducto" data-info="${producto.categoria}"> </div>
            </div>
        `;

        // Agregar evento de clic para seleccionar el producto
        productCard.addEventListener('click', (event) => {
            seleccionarProducto(event.currentTarget);
        });

        // Agregar evento de doble clic para ir a la página de información del producto
        productCard.addEventListener('dblclick', (event) => {
            irAInfoProducto(event.currentTarget);
        });
        container.appendChild(productCard);
    });
}


function generarEnlacesPaginacionDest(totalPaginas) {
    const paginasContainer = document.getElementById('paginasDest');
    paginasContainer.innerHTML = ''; // Limpiar los enlaces de paginación antes de generarlos nuevamente

    for (let i = 1; i <= totalPaginas; i++) {
        const pagina = document.createElement('li');
        pagina.classList.add('pagina-item');
        const enlace = document.createElement('a');
        enlace.href = `#pagina-${i}`;
        enlace.textContent = i;
        pagina.appendChild(enlace);
        paginasContainer.appendChild(pagina);

        // Agregar event listener para cargar los productos de la página seleccionada
        enlace.addEventListener('click', async function(event) {
            event.preventDefault();
            await cargarProductosPorPaginaDest(i);
        });
    }
}

function seleccionarProducto(productoSeleccionado) {
    // Desmarcar todos los productos seleccionados
    const selectedProducts = document.querySelectorAll('.product-card.selected');
    selectedProducts.forEach(product => product.classList.remove('selected'));

    // Marcar el producto actualmente seleccionado
    productoSeleccionado.classList.add('selected');
}


function irAInfoProducto(productoParaInfo) {
    // Obtener el ID del producto y la categoría de los atributos de datos (data-*) de la tarjeta de producto
    const productId = productoParaInfo.querySelector('#idProducto').dataset.info;
    const productoCategoria = productoParaInfo.querySelector('#categoriaProducto').dataset.info;
    localStorage.setItem('itemID', productId);
    localStorage.setItem('categoria', productoCategoria);

    window.location.href = `./InfoProducto.html`;
}

function mostrarTodosProductos(productos) {
    const container = document.querySelector('.resultado-busqueda');

    // Limpia el contenedor antes de agregar nuevos productos
    container.innerHTML = '';
    
    // Agregar el botón "Añadir al Carrito de Compra" fuera del bucle
    const cartButtonContainer = document.createElement('div');
    cartButtonContainer.classList.add('cart-button-container');
    const cartButton = document.createElement('button');
    cartButton.classList.add('cart-btn');
    cartButton.textContent = 'Añadir al Carrito de Compra';
    cartButtonContainer.appendChild(cartButton);
    container.appendChild(cartButtonContainer);

    // Itera sobre los productos y crea elementos para mostrarlos
    productos.forEach((producto) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        //imagenes de cada producto
        const imagenes = producto.imagenes.split(' ');
        const primeraImagen = imagenes[0];
        // Agrega la imagen, nombre y precio del producto dentro de la tarjeta
        productCard.innerHTML = `
            <button class="favorite-btn"></button> <!-- Botón de favoritos -->
            <img src="${primeraImagen}" alt="${producto.nombreproducto}"  style="width: 200px; height: 240px;">
            <h3>${truncate(producto.nombreproducto)}</h3>
            <p class="price">${producto.precio} €</p>
            <p class="description">${truncate(producto.descripcion)}</p>
            <div hidden>
                <div id="CategoriaSelec" data-info="${producto.categoria}"> </div>
                <div id="idProducto" data-info="${producto.idproducto}"> </div>
                <div id="categoriaProducto" data-info="${producto.categoria}"> </div>
            </div>
        `;

        // Agregar evento de clic para seleccionar el producto
        productCard.addEventListener('click', (event) => {
            seleccionarProducto(event.currentTarget);
        });

        // Agregar evento de doble clic para ir a la página de información del producto
        productCard.addEventListener('dblclick', (event) => {
            irAInfoProducto(event.currentTarget);
        });

        container.appendChild(productCard);
    });
}

//fin funciones de mostrar/cargar productos

// Función para truncar el texto si supera el tamaño máximo
function truncate(text) {
    const maxLength = 50; // Establece el tamaño máximo
    return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
}

async function getID() {
    try {
        const response = await fetch(`${lugarDeEjecucion}/getID`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        if (response.ok) {
            const responseBody = await response.json(); // Guarda el cuerpo de la respuesta en una variable
            return(responseBody.ID_USUARIO);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

async function crearCertificado() {
    const response = await fetch(`${lugarDeEjecucion}/crearCertificado`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(idProductoSeleccionado)
    });
}

async function GuardarBDD(){
    await fetch(`${lugarDeEjecucion}/guardarBDD`);
}

async function CierroSesionCuenta() {
    localStorage.removeItem('UsuarioID');
    alert("Estas cerrando sesion en tu cuenta");
    window.location.href = '../index.html';
}

function validatePasswords() {
    var password = document.getElementById('ContraseñaUsu').value;
    var repeatPassword = document.getElementById('RContraseñaUsu').value;
    var errorMessage = document.getElementById('error-message');

    if (password !== repeatPassword) {
        errorMessage.style.display = 'block';
    } else {
        errorMessage.style.display = 'none';
    }
}