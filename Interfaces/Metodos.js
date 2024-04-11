var idProductoSeleccionado;
var idUsuarioIniciado;//guardo esto aquí para poder acceder en todas las páginas
var idProductoCantidadSelec;//cantidad de producto seleccionada
var idProductoCantidad;//cuantos producto hay en la base de datos
var numTarjeta;
var fechaCaducidad;
var cvv;


//funcion para guardar y acceder a idUsuario
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

//funcion para guardar y acceder a idProd
function gestionarValorIDProduct(valor) {
    if (valor === -1) {
        // Si se pasa -1, devolver el valor almacenado
        return idProductoSeleccionado;
    } else {
        // Si se pasa un valor distinto de -1, almacenarlo y devolver el mismo valor
        idProductoSeleccionado = valor;
        return idProductoSeleccionado;
    }
}

function LimpiarLocalStorage() {
    //localStorage.setItem('itemID', idProductoSeleccionado);
    //localStorage.setItem('UsuarioID', idUsuarioIniciado);

    localStorage.removeItem('itemID');
    localStorage.removeItem('UsuarioID');
}

async function buscar() {
    //window.location.href = "ResultadoBusqueda.html"
    var searchTerm = document.getElementById('searchInput').value;
    var category  = document.getElementById('categorySelect').value;

    const urlParams = new URLSearchParams(window.location.search);
    var idUser = urlParams.get('idUser');
    

    // Realizar una solicitud POST al backend con la información de búsqueda
    try {
        const response = await fetch('http://localhost:5169/BuscarProducto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            //le paso la búsqueda y la categoría 
            body: JSON.stringify({ searchTerm: searchTerm, category: category, idUser: idUser}),
        });

        if (response.ok) {
            const data = await response.json();
            mostrarResultado(data.resultado);  // Llama a una función para mostrar el resultado en la página
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

async function buscarProducto() {
    //window.location.href = "ResultadoBusqueda.html"
    var searchTerm = document.getElementById('searchInput').value;
    var category  = document.getElementById('categorySelect').value;

    // Realizar una solicitud POST al backend con la información de búsqueda
    try {
        const response = await fetch('http://localhost:5169/buscar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            //le paso la búsqueda y la categoría 
            body: JSON.stringify({ searchTerm: searchTerm, category: category  }),
        });

        if (response.ok) {
            const data = await response.json();
            mostrarProducto(data.resultado);  // Llama a una función para mostrar el resultado en la página
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

// INICIO BOTON FAVORITO PARA SELECCIONAR VARIOS Y PODER DESELECCIONAR

/*  NO FUNCIONA

Función para alternar el estado seleccionado/deseleccionado del botón de favoritos
document.addEventListener('DOMContentLoaded', function() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');

    favoriteButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // Evitar que el clic se propague al hacer clic fuera del botón
            this.classList.toggle('selected');
        });
    });

    // Evitar que los clics en otras partes de la página deseleccionen los botones
    document.addEventListener('click', function(event) {
        // Verificar si el clic se realizó en un botón favorito
        const isFavoriteButton = event.target.classList.contains('favorite-btn');
        
        if (!isFavoriteButton) {
            favoriteButtons.forEach(function(button) {
                // Verificar si el botón está seleccionado y el clic no fue en el botón mismo
                if (!button.contains(event.target) && button.classList.contains('selected')) {
                    button.classList.remove('selected');
                }
            });
        }
    });
});
*/
// FIN BOTON FAVORITO


/*
// botones para cambio de página para cargar más productos

// CARGA LOS PRODUCTOS DIRECTAMENTE
document.addEventListener('DOMContentLoaded', function() {
    // Agrega un evento click a cada número de página para los productos destacados
    document.getElementById('pagina1').addEventListener('click', function(event) {
        event.preventDefault();
        cargarProductosPorPagina(1, 'destacados'); // Cargar productos de la página 1 para productos destacados
    });

    // Agrega un evento click a cada número de página para los productos recomendados
    document.getElementById('pagina1_rec').addEventListener('click', function(event) {
        event.preventDefault();
        cargarProductosPorPagina(1, 'recomendados'); // Cargar productos de la página 1 para productos recomendados
    });
    //PAGINAS 2
    document.getElementById('pagina2').addEventListener('click', function(event) {
        event.preventDefault();
        cargarProductosPorPagina(2, 'destacados'); // Cargar productos de la página 1 para productos destacados
    });

    // Agrega un evento click a cada número de página para los productos recomendados
    document.getElementById('pagina2_rec').addEventListener('click', function(event) {
        event.preventDefault();
        cargarProductosPorPagina(2, 'recomendados'); // Cargar productos de la página 1 para productos recomendados
    });
    //PAGINAS 3
    document.getElementById('pagina3').addEventListener('click', function(event) {
        event.preventDefault();
        cargarProductosPorPagina(3, 'destacados'); // Cargar productos de la página 1 para productos destacados
    });

    // Agrega un evento click a cada número de página para los productos recomendados
    document.getElementById('pagina3_rec').addEventListener('click', function(event) {
        event.preventDefault();
        cargarProductosPorPagina(3, 'recomendados'); // Cargar productos de la página 1 para productos recomendados
    });
});


// Función para cargar productos de una página específica
async function cargarProductosPorPagina(numeroPagina, tipoProductos) {
    try {
        let url;
        // Determina la URL correspondiente según el tipo de productos
        if (tipoProductos === 'destacados') {
            url = `http://localhost:5169/ObtenerProductosPorPagina?pagina=${numeroPagina}`;
        } else if (tipoProductos === 'recomendados') {
            //url = `http://localhost:5169/ObtenerProductosRecomendados?pagina=${numeroPagina}`;
            url = `http://localhost:5169/ObtenerProductosPorPagina?pagina=${numeroPagina}`;
        } else {
            console.error('Tipo de productos no válido');
            return;
        }

        // Realiza una solicitud GET al backend para obtener los productos de la página especificada
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            // Llama a la función correspondiente para mostrar los productos en la página
            if (tipoProductos === 'destacados') {
                mostrarProductosDestacados(data);
            } else if (tipoProductos === 'recomendados') {
                mostrarProductosRecomendados(data);
            }
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

//fin botones cambio página
*/



//  INICIO PRODUCTOS DESTACADOS

//carga los 6 primeros productos de la base de datos, deberían de ser los productos Recomendados por búsquedas
//pero todavía no tenemos Recomendaciones
async function CargarProductosDestacados() {
    try {
        // Realizar una solicitud GET al backend para obtener los 6 primeros productos
        const response = await fetch('http://localhost:5169/ObtenerProductosDestacados');
        if (response.ok) {
            const data = await response.json();
            const productos = data.productos.Models;
            
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

async function cargarProductosPorPaginaDest(numeroPagina) {
    const productosPorPagina = 6;

    try {
        const response = await fetch('http://localhost:5169/ObtenerProductosDestacados');
        if (response.ok) {
            const data = await response.json();
            const productos = data.productos.Models;

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

//  FIN PRODUCTOS DESTACADOS


//  INICIO PRODUCTOS RECOMENDADOS

//carga los productos de la base de datos, deberían de ser los productos Recomendados por búsquedas
//pero todavía no tenemos Recomendaciones
async function CargarProductosRecomendados(){
    try {
        // Realizar una solicitud GET al backend para obtener los 6 primeros productos
        const response = await fetch('http://localhost:5169/ObtenerProductosRecomendados');
        if (response.ok) {
            const data = await response.json();
            const productos = data.productos.Models;

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

async function cargarProductosPorPaginaRec(numeroPagina) {
    const productosPorPagina = 6;

    try {
        const response = await fetch('http://localhost:5169/ObtenerProductosRecomendados');
        if (response.ok) {
            const data = await response.json();
            const productos = data.productos.Models;

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

//  FIN PRODUCTOS RECOMENDADOS


// MOSTRAR TODOS LOS PRODUCTOS A LA HORA DE BUSCAR CUALQUIERO COSA
async function CargaTodosProductos(){
    try {
        // Realizar una solicitud GET al backend para obtener los 6 primeros productos
        const response = await fetch('http://localhost:5169/ObtenerTodosProductos');
        if (response.ok) {
            const data = await response.json();
            const productos = data.productos.Models;
            mostrarTodosProductos(productos);// Llama a una función para mostrar los productos en la página
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

function mostrarTodosProductos(productos) {
    const container = document.querySelector('.resultado-busqueda');

    // Limpia el contenedor antes de agregar nuevos productos
    container.innerHTML = '';

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


//FUNCIONES CLICKS
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

    window.location.href = `/Interfaces/InfoProducto.html`;
}

/*
function irAInfoProducto2(productoParaInfo) {
    window.location.href = `InfoProducto.html?id=${productoParaInfo}`;
}*/

function irAInfoProducto2(productoParaInfo) {
    // Redirigir a la página de InfoProducto.html con el parámetro del producto
    window.location.href = `InfoBasicaProducto.html?id=${productoParaInfo}`;

    // Ocultar el botón después de la redirección
    const historialBtn = document.getElementById('historialBtnInfoProd');
    historialBtn.style.display = 'none';
}

// FIN MOSTRAR TODOS PRODUCTOS

//inicio información una unidad de producto
async function CargaUnProducto(){
    try{
        //pillar el id
        /*  LO DE ANTES 
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('idProd');
        */
        idProductoSeleccionado = localStorage.getItem('itemID');
        const response = await fetch(`http://localhost:5169/ObtenerProductoPorID?idproducto=${idProductoSeleccionado}`);

        if(response.ok){
            const data = await response.json();
            mostrarUnProducto(data);
        } else{
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

function mostrarUnProducto(respuesta) {
    const producto = respuesta.producto;
    const container = document.querySelector('.product-container');
    container.innerHTML = '';

    //guardo la cantidad
    idProductoCantidad = localStorage.setItem('itemCant', producto.cantidad);

    // Separar las URL de las imágenes
    const imagenes = producto.imagenes.split(' ');
    const primeraImagen = imagenes[0];

    // Crear elementos para mostrar el producto
    const productCard = document.createElement('div');
    productCard.classList.add('product-element');

    // Agregar la imagen principal del producto
    const imagenPrincipal = document.createElement('img');
    imagenPrincipal.src = primeraImagen;
    imagenPrincipal.alt = producto.nombreproducto;
    imagenPrincipal.style.width = '500px';
    imagenPrincipal.style.height = '540px';
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
        flechaSemiVisible.classList.add('flecha-semi-visible');
        contenedorFlecha.appendChild(flechaSemiVisible);
    }

    // Agregar el contenedor de fecha al producto
    productCard.appendChild(contenedorFlecha);

    // Agrega el nombre, precio y descripción del producto dentro de la tarjeta
    const productInfo = document.createElement('div');
    productInfo.id = 'productInfo'; // Puedes utilizar un ID único si lo deseas
    productInfo.innerHTML = `
        <h2>${producto.nombreproducto}</h2>
        <p>${producto.precio} €</p>
        <p> Acerca del producto: </p>
        <p>${producto.descripcion}</p>
    `;
    productInfo.style.margin = '40px';
    productInfo.style.fontSize = '22px';
    productCard.appendChild(productInfo);

    // Crear el contenedor de botones
    const productButtons = document.createElement('div');
    productButtons.classList.add('product-buttons');

    // Agregar botones y select al contenedor de botones
    const comprarButton = document.createElement('button');
    comprarButton.classList.add('comprarButton');
    comprarButton.textContent = 'Comprar';
    productButtons.appendChild(comprarButton);

    const carritoButton = document.createElement('button');
    carritoButton.classList.add('carritoButton');
    carritoButton.textContent = 'Carrito de Compra';
    productButtons.appendChild(carritoButton);

    const cantidadLabel = document.createElement('label');
    cantidadLabel.htmlFor = 'cantidad';
    cantidadLabel.textContent = 'Cantidad:';
    productButtons.appendChild(cantidadLabel);
    
    const selectCantidad = document.createElement('select');
    selectCantidad.id = 'cantidad';
    selectCantidad.name = 'cantidad';
    for (let i = 1; i <= producto.cantidad; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectCantidad.appendChild(option);
    }
    productButtons.appendChild(selectCantidad);
    
    const deseosButton = document.createElement('button');
    deseosButton.classList.add('deseosButton');
    deseosButton.textContent = 'Añadir lista de deseos';
    productButtons.appendChild(deseosButton);

    // Agregar el contenedor de botones al producto
    productCard.appendChild(productButtons);

    // Agregar el producto al contenedor principal
    container.appendChild(productCard);

    // Evento de clic en el contenedor de flecha semi visible para cambiar la imagen principal
    if (imagenes.length > 1) {
        contenedorFlecha.addEventListener('click', function() {
            const index = imagenes.indexOf(imagenPrincipal.src);
            const siguienteIndex = (index + 1) % imagenes.length;
            imagenPrincipal.src = imagenes[siguienteIndex];
        });
    }

    productCard.dataset.productId = producto.idproducto;

    // Agregar evento de clic al botón de comprar
    comprarButton.addEventListener('click', function() {

        // Redirigir a la página de compra del producto con el ID del producto en la URI
        window.location.href = `/Interfaces/CompraProducto.html`;
    });

    selectCantidad.addEventListener('change', function() {
        const cantidadSeleccionada = parseInt(selectCantidad.value);
        localStorage.setItem('itemCantSelec', cantidadSeleccionada);
        console.log("Cantidad seleccionada:", cantidadSeleccionada);
        // Aquí puedes almacenar la cantidad seleccionada en una variable, en el local storage, o realizar cualquier otra acción que desees.
    });

}

async function CargaUnProductoBasico(){
    try{
        //pillar el id
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        const response = await fetch(`http://localhost:5169/ObtenerProductoPorID?idproducto=${productId}`);

        if(response.ok){
            const data = await response.json();
            mostrarUnProductoBasico(data);
        } else{
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

function mostrarUnProductoBasico(respuesta) {
    const producto = respuesta.producto;
    const container = document.querySelector('.product-container');
    container.innerHTML = '';

    // Separar las URL de las imágenes
    const imagenes = producto.imagenes.split(' ');
    const primeraImagen = imagenes[0];

    // Crear elementos para mostrar el producto
    const productCard = document.createElement('div');
    productCard.classList.add('product-element');

    // Agregar la imagen principal del producto
    const imagenPrincipal = document.createElement('img');
    imagenPrincipal.src = primeraImagen;
    imagenPrincipal.alt = producto.nombreproducto;
    imagenPrincipal.style.width = '500px';
    imagenPrincipal.style.height = '540px';
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
        flechaSemiVisible.classList.add('flecha-semi-visible');
        contenedorFlecha.appendChild(flechaSemiVisible);
    }

    // Agregar el contenedor de fecha al producto
    productCard.appendChild(contenedorFlecha);

    // Agrega el nombre, precio y descripción del producto dentro de la tarjeta
    const productInfo = document.createElement('div');
    productInfo.id = 'productInfo'; // Puedes utilizar un ID único si lo deseas
    productInfo.innerHTML = `
        <h3>${producto.nombreproducto}</h3>
        <p>${producto.precio} €</p>
        <p> Descripción del producto: </p style="font-size: 18px;">
        <p>${producto.descripcion}</p>
    `;
    productCard.appendChild(productInfo);

    // Crear el contenedor de botones
    const productButtons = document.createElement('div');
   

    // Agregar el producto al contenedor principal
    container.appendChild(productCard);

    // Evento de clic en el contenedor de flecha semi visible para cambiar la imagen principal
    if (imagenes.length > 1) {
        contenedorFlecha.addEventListener('click', function() {
            const index = imagenes.indexOf(imagenPrincipal.src);
            const siguienteIndex = (index + 1) % imagenes.length;
            imagenPrincipal.src = imagenes[siguienteIndex];
        });
    }

    productCard.dataset.productId = producto.idproducto;

    // Agregar evento de clic al botón de comprar
    comprarButton.addEventListener('click', function() {
        // Obtener el ID del producto desde el atributo de datos del contenedor del producto
        const productId = productCard.dataset.productId;
        // Redirigir a la página de compra del producto con el ID del producto en la URI
        window.location.href = `/Interfaces/CompraProducto.html?id=${productId}`;
    });

}

// INICIO FUNCIONES PARA LA COMPRA DE UN PRODUCTO

async function CargaUnProductoCompra(){
    try{
        // Pillar el ID del producto de la URI
        idUsuarioIniciado = localStorage.getItem('UsuarioID');
        idProductoSeleccionado = localStorage.getItem('itemID')
    

        //solo falta que aqui le pasemos el id del usuario que ha iniciado sesión
        //idUser = 1;
        //console.log(idUser);
        const respuestaDirec = await fetch(`http://localhost:5169/ObtenerInfoUsuario?idusuario=${idUsuarioIniciado}`);


        // Obtener el producto por ID desde el backend
        const response = await fetch(`http://localhost:5169/ObtenerProductoPorID?idproducto=${idProductoSeleccionado}`);

        if(response.ok && respuestaDirec.ok){
            const data = await response.json();
            const producto = data.producto;
            console.log(producto); // Verifica la respuesta del servidor
            
            //muestra la información de la dirección correctamente
            const dataDirec = await respuestaDirec.json();
            const usuario = dataDirec.info;
            console.log(usuario); // Verifica la respuesta del servidor

            // Mostrar la información del producto
            mostrarUnProductoCompra(producto, usuario);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado al cargar un producto compra:', error);
    }
}

function mostrarUnProductoCompra(producto, usuario) {
    // Separar las URL de las imágenes
    const imagenes = producto.imagenes.split(' ');
    const primeraImagen = imagenes[0];

    const productImg = document.querySelector('.product-container-compra img');
    const productDescrip = document.querySelector('.product-container-compra h1');

    const productName = document.querySelector('.header h1');

    //const arrivalDate = document.querySelector('.product-container-compra p');
    const shippingInfo = document.querySelector('.shipping-info p');
    const paymentInputs = document.querySelectorAll('.payment-info input');
    const totalCost = document.querySelector('.total-cost');
    const cant = document.querySelector('.cantidad');
    idProductoCantidadSelec = localStorage.getItem('itemCantSelec')


    // Llenar la información del producto con los datos obtenidos del servidor
    productImg.src = primeraImagen; // Suponiendo que el servidor envía la URL de la imagen
    console.log(producto.descripcion);
    productDescrip.textContent = `Descripción: ${producto.descripcion} `;
    productName.textContent =  `Compra ahora: ${producto.nombreproducto} `;
    //arrivalDate.textContent = `Llegada el: ${respuesta.fecha_llegada}`;
    shippingInfo.textContent = `${usuario.direccion}`;
    totalCost.textContent = `Total: ${producto.precio} €`; // Suponiendo que el servidor envía el precio
    cant.textContent = `Cantidad Seleccionada: ${idProductoCantidadSelec} ${producto.nombreproducto}`;

    // Si el servidor envía más información sobre el pago, puedes llenarla aquí
    if (usuario.numeroTarjeta != null) {
        paymentInputs[0].value = usuario.numeroTarjeta;
        paymentInputs[1].value = usuario.fechaCaducidad;
        paymentInputs[2].value = usuario.CVV;
    }
}

// Función para verificar si los campos de la tarjeta están rellenados
function verificarCamposTarjeta() {
    const numTarjetaInput = document.querySelector('.payment-info input[type="text"][placeholder="Número de tarjeta"]');
    const fechaCaducidadInput = document.querySelector('.payment-info input[type="text"][placeholder="Fecha de caducidad"]');
    const cvvInput = document.querySelector('.payment-info input[type="text"][placeholder="CVV"]');
    
    localStorage.setItem('numTarjeta', numTarjetaInput);
    localStorage.setItem('fechCaduci', fechaCaducidadInput);
    localStorage.setItem('cvv', cvvInput);
    
    numTarjeta = localStorage.getItem("numTarjeta");
    fechaCaducidad = localStorage.getItem("fechCaduci");
    cvv = localStorage.getItem("cvv");


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


// Función para mostrar una ventana emergente para guardar los datos de la tarjeta
function mostrarVentanaEmergente() {
    const confirmacion = confirm('¿Desea guardar los datos de su tarjeta para futuras compras?');

    if (confirmacion) {
        // guardo los datos de su tarjeta en la base de datos
        try {
            idUsuarioIniciado = localStorage.getItem("UsuarioID");
            numTarjeta = localStorage.getItem("numTarjeta");
            fechaCaducidad = localStorage.getItem("fechCaduci");
            cvv = localStorage.getItem("cvv");

            
            console.log(idUsuarioIniciado + "idUsuarioIniciado");
            console.log(numTarjeta + "numTarjeta");
            console.log(fechaCaducidad + "fechaCaducidad");
            console.log(cvv + "cvv");

            const response = fetch(`http://localhost:5169/GuardarDatosUsuario`, {
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

// Función para finalizar la compra
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

                const response = await fetch(`http://localhost:5169/ActualizarCantidadProducto`, {
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



// FIN FUNCIONES PARA LA COMPRA DE UN PRODUCTO

// INCIO mostrar categorias

async function CargaCategorias() {
    try {
        const response = await fetch('http://localhost:5169/CargarCategorias');
        if (response.ok) {
            const data = await response.json();
            mostrarCategorias(data);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

function mostrarCategorias(data) {
    const selectElement = document.getElementById('categorySelect');
    const categoriasUnicas = [...new Set(data.map(item => item.categoria))];

    // Limpiar opciones existentes, excepto la primera (Todas las categorías)
    selectElement.options.length = 1;

    // Agregar nuevas opciones de categorías
    categoriasUnicas.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        selectElement.appendChild(option);
    });
}


async function buscarPorCategoria() {
    const categoriaSeleccionada = document.getElementById('categorySelect').value;
    // Realizar una consulta con la categoría seleccionada
    try {
        const response = await fetch(`http://localhost:5169/BuscarPorCategoria?categoria=${categoriaSeleccionada}`);
        if (response.ok) {
            const data = await response.json();
            // Lógica para mostrar los resultados de la consulta en el HTML
            console.log(data); // Aquí puedes procesar los datos y mostrarlos en el HTML
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

// FIN mostrar categorias

// AQUI HICE EL MERGE MANUAL YA QUE ERA IMPOSIBLE HACERLO AUTOMÁTICO



async function cargarYMostrarProductosPorPaginas() {
    try {
        // Llamar a la función para cargar todos los productos del vendedor
        const response = await fetch('http://localhost:5169/ObtenerProductosVendedor');
        
        if (response.ok) {
            const data = await response.json();
            const productos = data.productos.Models;

            // Dividir los productos en páginas de 6 productos cada una
            const productosPorPagina = 6;
            const totalPaginas = Math.ceil(productos.length / productosPorPagina);

            for (let pagina = 1; pagina <= totalPaginas; pagina++) {
                const inicio = (pagina - 1) * productosPorPagina;
                const fin = pagina * productosPorPagina;
                const productosPagina = productos.slice(inicio, fin);

                // Mostrar los productos de esta página en la interfaz de usuario
                mostrarProductosEnPagina(productosPagina);
            }
            generarEnlacesPaginacion(totalPaginas);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}


async function CargarProductosVendedor(idUsuarioIniciado) {
    try {
        console.log('ID del usuario seleccionado:', idUsuarioIniciado);
        // Realizar una solicitud GET al backend para obtener todos los productos del vendedor
        
        const response = await fetch('http://localhost:5169/ObtenerProductosVendedor',{
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
            
            const productosPorPagina = 6;
            const totalPaginas = Math.ceil(productos.length / productosPorPagina);

            // Mostrar los productos de la primera página en la interfaz de usuario
            mostrarProductosVendedor(productos.slice(0, productosPorPagina));

            // Generar enlaces de paginación
            generarEnlacesPaginacion(totalPaginas,idUsuarioIniciado);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

/*async function CargarProductosVendedor() {
    try {
        // Realizar una solicitud GET al backend para obtener todos los productos del vendedor
        const response = await fetch('http://localhost:5169/ObtenerProductosVendedor');
        
        if (response.ok) {
            const data = await response.json();
            const productos = data.productos.Models;
            
            const productosPorPagina = 6;
            const totalPaginas = Math.ceil(productos.length / productosPorPagina);

            // Mostrar los productos de la primera página en la interfaz de usuario
            mostrarProductosVendedor(productos.slice(0, productosPorPagina));

            // Generar enlaces de paginación
            generarEnlacesPaginacion(totalPaginas);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
} */
async function CargarProductosValidacion() {
    try {
        // Realizar una solicitud GET al backend para obtener todos los productos del vendedor
        const response = await fetch('http://localhost:5169/ObtenerProductosAValidar');
        
        if (response.ok) {
            const data = await response.json();
            const productos = data.productos.Models;
            
            const productosPorPagina = 6;
            const totalPaginas = Math.ceil(productos.length / productosPorPagina);

            // Mostrar los productos de la primera página en la interfaz de usuario
            mostrarProductosParaValidar(productos.slice(0, productosPorPagina));

            // Generar enlaces de paginación
            generarEnlacesPaginacion(totalPaginas);
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
        const response = await fetch('http://localhost:5169/ObtenerProductosVendedor',{
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

function mostrarProductos(respuesta) {
    const productos = respuesta.productos.Models;
    const container = document.querySelector('.featured-products');

    // Itera sobre los productos y crea elementos para mostrarlos
    productos.forEach((producto) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        // Agrega la imagen, nombre y precio del producto
        productCard.innerHTML = `
            <button class="favorite-btn"></button>
            <img src="${producto.imagen}" alt="${producto.nombreproducto}">
            <h3>${producto.nombreproducto}</h3>
            <p>${producto.precio} €</p>
            <p>${producto.descripcion}</p>
        `;

        container.appendChild(productCard);
    });
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

function mostrarProductosVendedor(productos) {
    //const productos = respuesta.productos.Models;
    const container = document.querySelector('.seller-products');
    container.innerHTML = '';
    // Itera sobre los productos y crea elementos para mostrarlos
    productos.forEach((producto) => {
        console.log(producto);
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        //imagenes de cada producto
        const imagenes = producto.imagenes.split(' ');
        const primeraImagen = imagenes[0];

        // Agrega la imagen, nombre y precio del producto
        // <img src="${producto.imagen}" alt="${producto.nombreproducto}"  style="width: 200px; height: 240px;">
        productCard.innerHTML = `
            <button class="favorite-btn"></button> 
            <img src="${primeraImagen}" alt="${producto.nombreproducto}"  style="width: 200px; height: 240px;">
            <h3>${producto.nombreproducto}</h3>
            <p>${producto.precio} €</p>
            <p>${producto.descripcion}</p>
        `;

        productCard.addEventListener('dblclick', (event) => {
            irAInfoProducto2(producto.idproducto);
        });
        
        productCard.addEventListener('click', (event) => {
            // Aquí puedes acceder al ID del producto seleccionado (producto.idproducto)
            // Puedes hacer lo que quieras con el ID del producto seleccionado aquí
            idProductoSeleccionado = producto.idproducto;
            console.log('ID del producto seleccionado:', idProductoSeleccionado);
            
            const editarBtn = document.getElementById('editarBtn');
            editarBtn.disabled = false;
            editarBtn.classList.add('enabled');

            const eliminarBtn = document.getElementById('eliminarBtn');
            eliminarBtn.disabled = false;
            eliminarBtn.classList.add('enabled');

            const allProductCards = document.querySelectorAll('.product-card');
            allProductCards.forEach(card => card.classList.remove('selected'));

            // Agrega la clase 'selected' al elemento seleccionado
            productCard.classList.add('selected');
            event.stopPropagation();

            document.getElementById('editarBtn').addEventListener('click', () => {
                const editarBtn = document.getElementById('editarBtn');
                if (editarBtn.disabled) {
                    editarBtn.classList.remove('enabled'); // Quita la clase 'enabled' para desactivar el nuevo estilo
                }
                console.log('ID del producto seleccionado al clicar:', idProductoSeleccionado);
                localStorage.setItem('itemID', idProductoSeleccionado);
                mostrarProd(idProductoSeleccionado);
            });

            document.getElementById('eliminarBtn').addEventListener('click', () => {
                const eliminarBtn = document.getElementById('eliminarBtn');
                if (eliminarBtn.disabled) {
                    eliminarBtn.classList.remove('enabled'); // Quita la clase 'enabled' para desactivar el nuevo estilo
                }
            });
        });

        
        container.appendChild(productCard);
    });
}

function mostrarProductosParaValidar(productos) {
    //const productos = respuesta.productos.Models;
    const container = document.querySelector('.validation-products');
    container.innerHTML = '';
    // Itera sobre los productos y crea elementos para mostrarlos
    productos.forEach((producto) => {
        console.log(producto);
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        //imagenes de cada producto
        const imagenes = producto.imagenes.split(' ');
        const primeraImagen = imagenes[0];

        // Agrega la imagen, nombre y precio del producto
        // <img src="${producto.imagen}" alt="${producto.nombreproducto}"  style="width: 200px; height: 240px;">
        productCard.innerHTML = `
            <button class="favorite-btn"></button> 
            <img src="${primeraImagen}" alt="${producto.nombreproducto}"  style="width: 200px; height: 240px;">
            <h3>${producto.nombreproducto}</h3>
            <p>${producto.precio} €</p>
            <p>${producto.descripcion}</p>
        `;

        productCard.addEventListener('dblclick', (event) => {
            irAInfoProducto2(producto.idproducto);
        });

        productCard.addEventListener('click', (event) => {
            // Aquí puedes acceder al ID del producto seleccionado (producto.idproducto)
            // Puedes hacer lo que quieras con el ID del producto seleccionado aquí
            idProductoSeleccionado = producto.idproducto;
            console.log('ID del producto seleccionado:', idProductoSeleccionado);
            
            const validarBtn = document.getElementById('validarBtn');
            validarBtn.disabled = false;
            validarBtn.classList.add('enabled');

            const eliminarBtn = document.getElementById('eliminarBtn');
            eliminarBtn.disabled = false;
            eliminarBtn.classList.add('enabled');

            const allProductCards = document.querySelectorAll('.product-card');
            allProductCards.forEach(card => card.classList.remove('selected'));

            // Agrega la clase 'selected' al elemento seleccionado
            productCard.classList.add('selected');
            event.stopPropagation();

            document.getElementById('validarBtn').addEventListener('click', () => {
                const editarBtn = document.getElementById('validarBtn');
                if (validarBtn.disabled) {
                    validarBtn.classList.remove('enabled'); // Quita la clase 'enabled' para desactivar el nuevo estilo
                }
                console.log('ID del producto seleccionado al clicar:', idProductoSeleccionado);
                localStorage.setItem('itemID', idProductoSeleccionado);
            });

            document.getElementById('eliminarBtn').addEventListener('click', () => {
                const eliminarBtn = document.getElementById('eliminarBtn');
                if (eliminarBtn.disabled) {
                    eliminarBtn.classList.remove('enabled'); // Quita la clase 'enabled' para desactivar el nuevo estilo
                }
            });
        });

        container.appendChild(productCard);
    });
}

function mostrarProductosDeVendedor(productos) {
    const container = document.getElementById('seller-products');

    productos.forEach(producto => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        const img = document.createElement('img');
        img.src = producto.imagen;
        img.alt = producto.nombre;
        productCard.appendChild(img);

        const h3 = document.createElement('h3');
        h3.textContent = producto.nombre;
        productCard.appendChild(h3);

        const precio = document.createElement('p');
        precio.textContent = producto.precio;
        productCard.appendChild(precio);

        const ubicacion = document.createElement('p');
        ubicacion.textContent = producto.ubicacion;
        productCard.appendChild(ubicacion);

        container.appendChild(productCard);
    });
}

//Ir a la página de búsqueda
function IrABuquedaProducto(){
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('idUser');

    window.location.href = `./ResultadoBusqueda.html?idUser=${userId}`
}

//boton para redirigir a la página de Búsqueda
function redirigirABusqueda(){
    window.location.href = `NewPaginaPrincipal.html?idUser=${userId}`
}


//Boton para volver a at´ras
function volverPaginaAnterior(){
    window.history.back();
}

//Boton para ir al historial de Busqueda
function irHistorialDeBúsqueda(){
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('idUser');

    window.location.href = `HistorialDeBusqueda.html?idUser=${userId}`
}

function irANuevoProducto(){
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('idUser');

    window.location.href = `NuevoProducto.html?idUser=${userId}`
}

function irAEditarProducto(){
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('idUser');

    window.location.href = `EditarProducto.html?idUser=${userId}`
}

function irALogin(){
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('idUser');

    window.location.href = `Login.html?idUser=${userId}`
}


// Función para mostrar el resultado en la página
function mostrarResultado(resultado) {
    var resultadosDiv = document.getElementById('resultados');
    //Esto es la respuesta que a accedido al Controlador Program y lo muestra por pantalla en la Pagina Principal
    resultadosDiv.innerHTML = `<p>Resultado: ${resultado}</p>`;
}


//Método agragar producto desde el frontend
async function agregarProd()
{
        document.getElementById('agregarProductoForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            const nombre = formData.get('nombreProd');
            console.log(formData.get('nombreProd'));
            const precio = formData.get('precioProd');
            const categoria = formData.get('categoriaProd');
            const descripcion = formData.get('descripcionProd');
            const img = formData.get('imgProd');
            const cantidad = parseInt(formData.get('cantProd'));

        
            try {
                const response = await fetch('http://localhost:5169/AgregarProducto', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nombreproducto: nombre,
                        precio: precio,
                        categoria: categoria,
                        descripcion: descripcion,
                        imagenes: img,
                        cantidad: cantidad
                    }),
                });
        
                if (response.ok) {
                    const data = await response.json();
                    console.log('Producto creado correctamente');
                    mostrarResultado(data.resultado); 

                    // Aquí podrías mostrar un mensaje de éxito o redirigir a otra página
                    // Borra los campos del formulario
                    window.location.reload();
                   /* document.getElementById('nombreProd').value = '';
                    document.getElementById('precioProd').value = '';
                    document.getElementById('categoriaProd').value = '';
                    document.getElementById('descripcionProd').value = '';
                    document.getElementById('imgProd').value = '';
                    document.getElementById('cantProd').value = '';
                    */
                } else {
                    console.error('Error al crear el producto:', response.statusText);
                }
            } catch (error) {
                console.error('Error inesperado:', error);
            }
        });
}

async function agregarProducto(idUsuarioIniciado)
{
        document.getElementById('agregarProductoForm2').addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(event.target);
            const nombre = formData.get('nombreProd');
            console.log(formData.get('nombreProd'));
            const precio = formData.get('precioProd');
            const categoria = formData.get('categoriaProd');
            const descripcion = formData.get('descripcionProd');
            const img = formData.get('imgProd');
            const cantidad = parseInt(formData.get('cantProd'));


            console.log('ID del usuario seleccionado:', idUsuarioIniciado);
            // Realizar una solicitud GET al backend para obtener todos los productos del vendedor
            

            try {
                const response = await fetch('http://localhost:5169/AgregarProducto', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nombreproducto: nombre,
                        precio: precio,
                        categoria: categoria,
                        descripcion: descripcion,
                        imagenes: img,
                        cantidad: cantidad,
                        idvendedor: idUsuarioIniciado,
                        validado: false,
                    }),
                });
        
                if (response.ok) {
                    const data = await response.json();
                    console.log('Producto creado correctamente');
                    mostrarResultado(data.resultado); 

                    // Aquí podrías mostrar un mensaje de éxito o redirigir a otra página
                    // Borra los campos del formulario
                    window.location.reload();
                   /* document.getElementById('nombreProd').value = '';
                    document.getElementById('precioProd').value = '';
                    document.getElementById('categoriaProd').value = '';
                    document.getElementById('descripcionProd').value = '';
                    document.getElementById('imgProd').value = '';
                    document.getElementById('cantProd').value = '';
                    */
                } else {
                    console.error('Error al crear el producto:', response.statusText);
                }
            } catch (error) {
                console.error('Error inesperado:', error);
            }
            alert("Producto creado correctamente")
            window.location.reload();
        });
}

/*
async function mostrarProd(idProductoSeleccionado) {
    try {
        console.log('ID del producto seleccionado:', idProductoSeleccionado);
        const response = await fetch('http://localhost:5169/buscarProductoX');
        /*
        const response = await fetch('http://localhost:5169/buscarProductoX',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idProductoSeleccionado: idProductoSeleccionado
            }),
        });*/
/*
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
                document.getElementById('nombre').value = primerProducto.nombreproducto;
                document.getElementById('precio').value = primerProducto.precio;
                document.getElementById('categoria').value = primerProducto.categoria;
                document.getElementById('descripcion').value = primerProducto.descripcion;
                document.getElementById('imagenProducto').src = primerProducto.imagen;
                document.getElementById('cantidad').value = primerProducto.cantidad;
                document.getElementById('nuevo-url-imagen').value = primerProducto.imagen;             
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
}*/


async function mostrarProd(idProductoSeleccionado) {
    try {
        console.log('ID del producto seleccionado:', idProductoSeleccionado);
        //const response = await fetch('http://localhost:5169/buscarProductoX');

        //const response = await fetch(`http://localhost:5169/buscarProductoX?idProductoSeleccionado=${idProductoSeleccionado}`);
        const response = await fetch('http://localhost:5169/buscarProductoX',{
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
                document.getElementById('nombre').value = primerProducto.nombreproducto;
                document.getElementById('precio').value = primerProducto.precio;
                document.getElementById('categoria').value = primerProducto.categoria;
                document.getElementById('descripcion').value = primerProducto.descripcion;
                document.getElementById('imagenProducto').src = primerProducto.imagenes;
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

async function validarProd() {
    try {
        console.log('ID del producto seleccionado:', idProductoSeleccionado);
        //const response = await fetch('http://localhost:5169/buscarProductoX');

        //const response = await fetch(`http://localhost:5169/buscarProductoX?idProductoSeleccionado=${idProductoSeleccionado}`);
        const response = await fetch('http://localhost:5169/validarProductoX',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idproducto: idProductoSeleccionado
            }),
        });

        const jsonResponse = await response.json(); // Convertir la respuesta a JSON

        if (response.ok) {

            console.log(jsonResponse);

            console.log('Producto validado exitosamente:', idProductoSeleccionado);
            console.log(jsonResponse.mensaje);
            alert("Producto validado correctamente")
        } else {
            console.error('Error al validar el producto:', jsonResponse.mensaje);
            console.log(jsonResponse.mensaje);
            // Manejar el error según sea necesario aquí
            // Por ejemplo, puedes mostrar un mensaje de error en tu interfaz de usuario
        }      
        window.location.reload();
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

async function eliminarProd() {
    try {
        console.log('ID del producto seleccionado:', idProductoSeleccionado);
        //const response = await fetch('http://localhost:5169/buscarProductoX');

        //const response = await fetch(`http://localhost:5169/buscarProductoX?idProductoSeleccionado=${idProductoSeleccionado}`);
        const response = await fetch('http://localhost:5169/eliminarProductoX',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idproducto: idProductoSeleccionado
            }),
        });
        location.reload();

    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

async function ActualizarProducto(idProductoSeleccionado,idUsuarioIniciado)
{
        document.getElementById('agregarProductoForm7').addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(event.target);
            const nombre = formData.get('nombre');
            console.log(formData.get('nombre'));
            const precio = formData.get('precio');
            const categoria = formData.get('categoria');
            const descripcion = formData.get('descripcion');
            const img = formData.get('nuevo-url-imagen') ?? formData.get('imagenProducto');
            const cantidad = parseInt(formData.get('cantidad'));

            try {
                const response = await fetch('http://localhost:5169/ActualizarProducto', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nombreproducto: nombre,
                        precio: precio,
                        categoria: categoria,
                        descripcion: descripcion,
                        imagenes: img,
                        cantidad: cantidad,
                        idvendedor: idUsuarioIniciado,
                        idproducto:idProductoSeleccionado,
                    }),
                });
        
                if (response.ok) {
                    const data = await response.json();
                    console.log('Producto creado correctamente');
                    mostrarResultado(data.resultado); 

                    // Aquí podrías mostrar un mensaje de éxito o redirigir a otra página
                    // Borra los campos del formulario
                    window.location.reload();
                   /* document.getElementById('nombreProd').value = '';
                    document.getElementById('precioProd').value = '';
                    document.getElementById('categoriaProd').value = '';
                    document.getElementById('descripcionProd').value = '';
                    document.getElementById('imgProd').value = '';
                    document.getElementById('cantProd').value = '';
                    */
                } else {
                    console.error('Error al actualizar el producto:', response.statusText);
                }
            } catch (error) {
                console.error('Error inesperado:', error);
            }
            alert("Producto creado correctamente")
            window.location.reload();
        });
}

function cambiarImagen() {
    // Obtén el valor del nuevo URL de imagen
    const nuevoUrlImagen = document.getElementById('nuevo-url-imagen').value;
    
    // Verifica si se ingresó un URL válido
    if (nuevoUrlImagen) {
        // Obtén el elemento de la imagen
        const imagenProducto = document.getElementById('imagenProducto');
        
        // Asigna el nuevo URL de imagen a la fuente de la imagen
        imagenProducto.src = nuevoUrlImagen;
        
        // Borra el valor del campo de entrada
        document.getElementById('nuevo-url-imagen').value = '';
    } else {
        alert('Por favor, ingrese un URL de imagen válido.');
    }
}
// Llama a la función agregarProd() cuando el DOM esté completamente cargado
/*document.addEventListener('DOMContentLoaded', function() {
    mostrarProd();
});*/
/*
document.getElementById('agregarProductoForm2').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const nombre = formData.get('nombreProd');
    const precio = parseFloat(formData.get('precioProd'));
    const categoria = formData.get('categoriaProd');
    const descripcion = formData.get('descripcionProd');
    const imagen = formData.get('imgProd');
    const cantidad = parseInt(formData.get('cantProd'));

    try {
        const response = await fetch('/http://localhost:5169/AgregarProducto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nombre,
                precio: precio,
                categoria: categoria,
                descripcion: descripcion,
                imagen: imagen,
                cantidad: cantidad
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Producto creado correctamente:', data);
            // Aquí podrías mostrar un mensaje de éxito o redirigir a otra página
            // Por ejemplo, redirigir al usuario a una página de confirmación
            window.location.href = '/confirmacion.html';
        } else {
            console.error('Error al crear el producto:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
});*/

//He elimando el resto de funciones de inicio de sesion
async function IniciarSesion(){
    try {
        // Pillar los datos del usuario
        const correo = document.getElementById("correoUser").value;
        const contraseña = document.getElementById("contraUser").value;
        console.log("El correo es: " + correo + " y la contraseña: " + contraseña);

        const response = await fetch('http://localhost:5169/iniciarSesion', {
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
                window.location.href = `./PaginaVendedor.html`;
            } else if (data.TipoUsuario === "Técnico") {
                tipoUsuario = "tecnico";
                window.location.href = `./ValidarProductos.html`;
            } else {
                tipoUsuario = "usuario";
                window.location.href = `./NewPaginaPrincipal.html`;
            }

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

async function getBusquedas() {
    const urlParams = new URLSearchParams(window.location.search);
    var idUser = urlParams.get('idUser');
    
    try {
        const response = await fetch('http://localhost:5169/getBusquedas')
        .then(response => response.json())
        .then(data => {
        
        const models = data.result.Models;
        const modelosFiltrados = models.filter(model => model.idusuario == idUser);
        

        // Selecciona el elemento con la clase "historial"
        const historialDiv = document.querySelector('.historial');
        if (modelosFiltrados.length == 0){
            const h1 = document.createElement('h1');
            h1.textContent = "No has buscado nada por ahora";
            historialDiv.appendChild(h1);
        } else {
            modelosFiltrados.forEach(model => {
                const busqueda = document.createElement('div');
                
                var texto_busqueda = document.createElement('span');
                var fecha_busqueda = document.createElement('span');

                // Asigna el texto al nuevo elemento <p>

                // Agrega la clase "small-text" al nuevo elemento <p>

                // Agrega el nuevo elemento <p> al final del elemento <div> seleccionado
                // Asigna el texto del objeto 'model' a la etiqueta <h1>
                texto_busqueda.textContent = model.texto;
                fecha_busqueda.textContent = model.fecha;

                texto_busqueda.classList.add('texto-historial');
                fecha_busqueda.classList.add('fecha-historial');
                busqueda.classList.add("busqueda-historial")

                // Agrega el elemento <h1> al elemento con la clase "historial"
                busqueda.appendChild(texto_busqueda);
                busqueda.appendChild(fecha_busqueda);
                historialDiv.appendChild(busqueda);
                

            });
        }})
        .catch(error => {
            // Manejar errores en caso de que la solicitud falle
            console.error('Error al obtener los datos:', error);
        });
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}
