var idProductoSeleccionado;

async function buscar() {
    //window.location.href = "ResultadoBusqueda.html"
    var searchTerm = document.getElementById('searchInput').value;
    var category  = document.getElementById('categorySelect').value;

    // Realizar una solicitud POST al backend con la información de búsqueda
    try {
        const response = await fetch('http://localhost:5169/BuscarProducto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            //le paso la búsqueda y la categoría 
            body: JSON.stringify({ searchTerm: searchTerm, category: category  }),
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
        const imagenes = producto.imagenes.split(',');
        const primeraImagen = imagenes[0];

        // Agrega la imagen, nombre y precio del producto dentro de un enlace
        productCard.innerHTML = `
            <button class="favorite-btn"></button> <!-- Botón de favoritos -->
            <img src="${primeraImagen}" alt="${producto.nombreproducto}"  style="width: 200px; height: 240px;">
            <h3>${producto.nombreproducto}</h3>
            <p>${producto.precio} €</p>
            <p>${producto.descripcion}</p>
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
        const imagenes = producto.imagenes.split(',');
        const primeraImagen = imagenes[0];

        // Agrega la imagen, nombre y precio del producto dentro de un enlace       
        productCard.innerHTML = `
            <button class="favorite-btn"></button> <!-- Botón de favoritos -->
            <img src="${primeraImagen}" alt="${producto.nombreproducto}"  style="width: 200px; height: 240px;">
            <h3>${producto.nombreproducto}</h3>
            <p>${producto.precio} €</p>
            <p>${producto.descripcion}</p>
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
            mostrarTodosProductos(data);// Llama a una función para mostrar los productos en la página
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

function mostrarTodosProductos(respuesta) {
    const productos = respuesta.productos.Models;
    const container = document.querySelector('.resultado-busqueda');

    // Limpia el contenedor antes de agregar nuevos productos
    container.innerHTML = '';

    // Itera sobre los productos y crea elementos para mostrarlos
    productos.forEach((producto) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        //imagenes de cada producto
        const imagenes = producto.imagenes.split(',');
        const primeraImagen = imagenes[0];
        // Agrega la imagen, nombre y precio del producto dentro de la tarjeta
        productCard.innerHTML = `
            <button class="favorite-btn"></button> <!-- Botón de favoritos -->
            <img src="${primeraImagen}" alt="${producto.nombreproducto}"  style="width: 200px; height: 240px;">
            <h3>${producto.nombreproducto}</h3>
            <p>${producto.precio} €</p>
            <p>${producto.descripcion}</p>
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
    const categoryProd = productoParaInfo.querySelector('#CategoriaSelec').dataset.info;

    // Redirigir a la página de información del producto
    window.location.href = `/Interfaces/InfoProducto.html?id=${productId}`;
}


// FIN MOSTRAR TODOS PRODUCTOS

//inicio información una unidad de producto
async function CargaUnProducto(){
    try{
        //pillar el id
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        const response = await fetch(`http://localhost:5169/ObtenerProductoPorID?idproducto=${productId}`);

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

    // Separar las URL de las imágenes
    const imagenes = producto.imagenes.split(',');
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
        // Obtener el ID del producto desde el atributo de datos del contenedor del producto
        const productId = productCard.dataset.productId;
        // Redirigir a la página de compra del producto con el ID del producto en la URI
        window.location.href = `/Interfaces/CompraProducto.html?id=${productId}`;
    });

}


async function CargaUnProductoCompra(){
    try{
        // Pillar el ID del producto de la URI
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        // Obtener el producto por ID desde el backend
        const response = await fetch(`http://localhost:5169/ObtenerProductoPorID?idproducto=${productId}`);

        if(response.ok){
            const data = await response.json();
            // Mostrar la información del producto
            mostrarUnProductoCompra(data);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

function mostrarUnProductoCompra(respuesta) {
    const producto = respuesta.producto;
    // Separar las URL de las imágenes
    const imagenes = producto.imagenes.split(',');
    const primeraImagen = imagenes[0];

    const productImg = document.querySelector('.product-container-compra img');
    const productName = document.querySelector('.header h1');

    //const arrivalDate = document.querySelector('.product-container-compra p');
    //const shippingInfo = document.querySelector('.shipping-info p');
    const paymentInputs = document.querySelectorAll('.payment-info input');
    const totalCost = document.querySelector('.total-cost');

    // Llenar la información del producto con los datos obtenidos del servidor
    productImg.src = primeraImagen; // Suponiendo que el servidor envía la URL de la imagen
    productName.textContent =  `Compra ahora: ${producto.nombreproducto} `;
    //arrivalDate.textContent = `Llegada el: ${respuesta.fecha_llegada}`;
    //shippingInfo.textContent = `Enviar a: ${respuesta.direccion_envio}`;
    totalCost.textContent = `Total: ${producto.precio} €`; // Suponiendo que el servidor envía el precio

    // Si el servidor envía más información sobre el pago, puedes llenarla aquí
    if (respuesta.metodo_pago) {
        const paymentData = respuesta.metodo_pago;
        paymentInputs[0].value = paymentData.numero_tarjeta;
        paymentInputs[1].value = paymentData.fecha_caducidad;
        paymentInputs[2].value = paymentData.cvv;
    }
}
/*
sucio

function mostrarUnProductoCompra(respuesta) {
    const producto = respuesta.producto;
    const container = document.querySelector('.product-container-compra');
    container.innerHTML = '';

    // Separar las URL de las imágenes
    const imagenes = producto.imagenes.split(',');
    const primeraImagen = imagenes[0];

    // Agrega la imagen, nombre y precio del producto dentro de la tarjeta
    productCard.innerHTML = `
        <button class="favorite-btn"></button> <!-- Botón de favoritos -->
        <img src="${primeraImagen}" alt="${producto.nombreproducto}"  style="width: 200px; height: 240px;">
        <h3>${producto.nombreproducto}</h3>
        <p>${producto.precio} €</p>
        <p>${producto.descripcion}</p>
        <div hidden>
            <div id="CategoriaSelec" data-info="${producto.categoria}"> </div>
            <div id="idProducto" data-info="${producto.idproducto}"> </div>
        </div>
    `;

    const productImg = document.querySelector('.product-container-compra img');
    const arrivalDate = document.querySelector('.product-container-compra p');
    const shippingInfo = document.querySelector('.shipping-info p');
    const paymentInputs = document.querySelectorAll('.payment-info input');
    const totalCost = document.querySelector('.total-cost');

    // Llenar la información del producto con los datos obtenidos del servidor
    productImg.src = primeraImagen; // Suponiendo que el servidor envía la URL de la imagen
    arrivalDate.textContent = `Llegada el: ${respuesta.fecha_llegada}`;
    shippingInfo.textContent = `Enviar a: ${respuesta.direccion_envio}`;
    totalCost.textContent = `${producto.precio} euros`; // Suponiendo que el servidor envía el precio

    // Si el servidor envía más información sobre el pago, puedes llenarla aquí
    if (respuesta.metodo_pago) {
        const paymentData = respuesta.metodo_pago;
        paymentInputs[0].value = paymentData.numero_tarjeta;
        paymentInputs[1].value = paymentData.fecha_caducidad;
        paymentInputs[2].value = paymentData.cvv;
    }
}
*/

// inicio mostrar categorias

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

// fin mostrar categorias

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


async function CargarProductosVendedor() {
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
}

async function cargarProductosPorPagina(numeroPagina) {
    const productosPorPagina = 6;

    try {
        const response = await fetch('http://localhost:5169/ObtenerProductosVendedor');
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


function generarEnlacesPaginacion(totalPaginas) {
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
            await cargarProductosPorPagina(i);
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

        // Agrega la imagen, nombre y precio del producto
        productCard.innerHTML = `
            <button class="favorite-btn"></button>
            <img src="${producto.imagen}" alt="${producto.nombreproducto}"  style="width: 200px; height: 240px;">
            <h3>${producto.nombreproducto}</h3>
            <p>${producto.precio} €</p>
            <p>${producto.descripcion}</p>
        `;

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
    window.location.href = "ResultadoBusqueda.html"
}

//boton para redirigir a la página de Búsqueda
function redirigirABusqueda(){
    window.location.href = "NewPaginaPrincipal.html"
}


//Boton para volver a at´ras
function volverPaginaAnterior(){
    window.history.back();
}

//Boton para ir al historial de Busqueda
function irHistorialDeBúsqueda(){
    window.location.href = "HistorialDeBusqueda.html"
}

function irANuevoProducto(){
    window.location.href = "NuevoProducto.html"
}

function irAEditarProducto(){
    window.location.href = "EditarProducto.html"
}

function irALogin(){
    window.location.href = "Login.html"
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
                        imagen: img,
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

async function agregarProducto()
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
                        imagen: img,
                        cantidad: cantidad,
                        idvendedor: 5,
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

async function ActualizarProducto(idProductoSeleccionado)
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
                        imagen: img,
                        cantidad: cantidad,
                        idvendedor: 5,
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


// Método para iniciar sesión
async function iniciarSesion() {
    document.getElementById('loginForm').addEventListener('iniciar-btt', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const correo = formData.get('correoUser');
        const contraseña = formData.get('contraUser');

        try {
            const response = await fetch('http://localhost:5169/IniciarSesion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ correo: correo, contraseña: contraseña }),
            });

            if (response.ok) {
                window.location.href = "NewPaginaPrincipal.html";
            
            } else {
                // No existe user
                document.getElementById('mensajeError').style.display = 'block';
            }
        } catch (error) {
            console.error('Error inesperado:', error);
        }
    });
}