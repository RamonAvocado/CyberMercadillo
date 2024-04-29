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
async function agregarUsuarioVendedor(TipoUsuarioRegistrado){
    document.getElementById('agregarVendedorForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const nombreUsu = formData.get('nombreUsuV');
        const telefono = formData.get('TelUsuV');
        const correoUsu = formData.get('CorreoUsuV');
        const contraseña = formData.get('ContraseñaUsuV');
        const contraseñaR = formData.get('RContraseñaUsuV');
        const direccion = formData.get('DirUsuV');
        const telTienda = parseInt(formData.get('TelUsuT'));
        const nombreTienda = formData.get('NomTUsu');
        try {
            const response = await fetch(`http://localhost:5169/AgregarVendedor`, {
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
                    telefonotienda: telTienda,
                    nombretienda: nombreTienda,
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
}

function irAPagianValidaciones() {
    window.location.href = './ValidarProductos.html';
}

function irAPagianVendedor() {
    window.location.href = './PaginaVendedor.html';
}


//INICIO METODOS CARGA/MUESTRA PRODUCTOS
async function CargarProductosRecomendados(){
    try {
        // Realizar una solicitud GET al backend para obtener los 6 primeros productos
        const response = await fetch(`${lugarDeEjecucion}/ObtenerProductosRecomendados`);
        if (response.ok) {
            const data = await response.json();
            const productos = data.productos;

            const productosPorPagina = 6;
            const totalPaginas = Math.ceil(productos.length / productosPorPagina);

            // Mostrar los productos de la primera página en la interfaz de usuario
            mostrarProductosRecomendados(productos.slice(0, productosPorPagina));

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
            const productos = data.productos;

            const inicio = (numeroPagina - 1) * productosPorPagina;
            const fin = numeroPagina * productosPorPagina;
            const productosPagina = productos.slice(inicio, fin);

            mostrarProductosRecomendados(productosPagina);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

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

async function cargarProductosPorPaginaDest(numeroPagina) {
    const productosPorPagina = 6;

    try {
        const response = await fetch(`${lugarDeEjecucion}/ObtenerProductosDestacados`);
        if (response.ok) {
            const data = await response.json();
            const productos = data.productos;

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

function mostrarProductosRecomendados(productos) {
    const container = document.querySelector('.recommended-products');
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
        
            const productos = data.productos;
            
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
    localStorage.setItem('itemID', productId);

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


    if (response.ok) {
        // Crear una URL para el blob (archivo binario)
        const blobUrl = URL.createObjectURL(await response.blob());

        // Crear un enlace <a> para descargar el archivo
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', 'certificado.pdf');

        // Simular clic en el enlace para iniciar la descarga
        link.click();
    } else {
        console.error('Error al crear el certificado');
    }
}

async function GuardarBDD(){
    await fetch(`${lugarDeEjecucion}/guardarBDD`);
}