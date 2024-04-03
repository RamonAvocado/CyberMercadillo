
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

//  INICIO PRODUCTOS DESTACADOS

//carga los 6 primeros productos de la base de datos, deberían de ser los productos Recomendados por búsquedas
//pero todavía no tenemos Recomendaciones
async function CargarProductosDestacados() {
    try {
        // Realizar una solicitud GET al backend para obtener los 6 primeros productos
        const response = await fetch('http://localhost:5169/ObtenerProductosDestacados');
        if (response.ok) {
            const data = await response.json();
            mostrarProductosDestacados(data);// Llama a una función para mostrar los productos en la página
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

function mostrarProductosDestacados(respuesta) {
    const productos = respuesta.productos.Models;
    const container = document.querySelector('.featured-products');

    // Itera sobre los productos y crea elementos para mostrarlos
    productos.forEach((producto) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        // Agrega la imagen, nombre y precio del producto dentro de un enlace
        productCard.innerHTML = `
        <button class="favorite-btn"></button> <!-- Botón de favoritos fuera del enlace -->
            <a href="/Interfaces/InfoProducto.html?id=${producto.idproducto}">
                <img src="${producto.imagen}" alt="${producto.nombreproducto}"  style="width: 200px; height: 240px;">
                <h3>${producto.nombreproducto}</h3>
                <p>${producto.precio} €</p>
                <p>${producto.descripcion}</p>
            </a>
        `;

        container.appendChild(productCard);
    });
}
//  FIN PRODUCTOS DESTACADOS


//  INICIO PRODUCTOS RECOMENDADOS

//carga los 6 primeros productos de la base de datos, deberían de ser los productos Recomendados por búsquedas
//pero todavía no tenemos Recomendaciones
async function CargarProductosRecomendados(){
    try {
        // Realizar una solicitud GET al backend para obtener los 6 primeros productos
        const response = await fetch('http://localhost:5169/ObtenerProductosRecomendados');
        if (response.ok) {
            const data = await response.json();
            mostrarProductosRecomendados(data);// Llama a una función para mostrar los productos en la página
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

function mostrarProductosRecomendados(respuesta) {
    const productos = respuesta.productos.Models;
    const container = document.querySelector('.recommended-products');

    // Itera sobre los productos y crea elementos para mostrarlos
    productos.forEach((producto) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        // Agrega la imagen, nombre y precio del producto dentro de un enlace
        productCard.innerHTML = `
        <button class="favorite-btn"></button> <!-- Botón de favoritos fuera del enlace -->
            <a href="/Interfaces/InfoProducto.html?id=${producto.idproducto}">
                <img src="${producto.imagen}" alt="${producto.nombreproducto}"  style="width: 200px; height: 240px;">
                <h3>${producto.nombreproducto}</h3>
                <p>${producto.precio} €</p>
                <p>${producto.descripcion}</p>
            </a>
        `;

        container.appendChild(productCard);
    });
}
//  FIN PRODUCTOS RECOMENDADOS


async function CargarProductosVendedor() {
    try {
        // Realizar una solicitud GET al backend para obtener los 6 primeros productos
        const response = await fetch('http://localhost:5169/ObtenerProductosVendedor');
        if (response.ok) {
            const data = await response.json();
            mostrarProductosVendedor(data); // Llama a una función para mostrar los productos en la página
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

function mostrarProductosVendedor(respuesta) {
    const productos = respuesta.productos.Models;
    const container = document.querySelector('.seller-products');

    // Itera sobre los productos y crea elementos para mostrarlos
    productos.forEach((producto) => {
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
    window.location.href = "BuscarProducto.html"
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
                        nombre: nombre,
                        precio: precio,
                        categoria: categoria,
                        descripcion: descripcion,
                        img: img,
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

function mostrarResultado(resultado) {
    var resultadosDiv = document.getElementById('resultados');
    //Esto es la respuesta que a accedido al Controlador Program y lo muestra por pantalla en la Pagina Principal
    resultadosDiv.innerHTML = `<p>Resultado: ${resultado}</p>`;
}

function mostrarProducto(producto) {
    // Obtén referencias a los elementos del formulario
    /*const nombreInput = document.getElementById('nombre');
    const precioInput = document.getElementById('precio');
    const categoriaInput = document.getElementById('categoria');
    const descripcionInput = document.getElementById('descripcion');
    const imagenElement = document.getElementById('imagenProducto');
    const cantidadInput = document.getElementById('cantidad');

    // Define los valores para cada campo
    const nombreProducto = 'Producto de ejemplo';
    const precioProducto = 10.99;
    const categoriaProducto = 'Electrónica';
    const descripcionProducto = 'Esta es la descripción del producto';
    const urlImagenProducto = 'https://m.media-amazon.com/images/I/71nYTvuXGtL._AC_UF894,1000_QL80_.jpg';
    const cantidadProducto = 5;
    // Asigna los valores a los campos del formulario
    nombreInput.value = nombreProducto;
    precioInput.value = precioProducto;
    categoriaInput.value = categoriaProducto;
    descripcionInput.value = descripcionProducto;
    //urlImagenInput.value = urlImagenProducto;
    imagenElement.src = urlImagenProducto;
    cantidadInput.value = cantidadProducto;
*/
    document.getElementById('nombre').value = producto.nombreproducto;
    document.getElementById('precio').value = producto.precio;
    document.getElementById('categoria').value = producto.categoria;
    document.getElementById('descripcion').value = producto.descripcion;
    document.getElementById('imagenProducto').src = producto.url_imagen;
    document.getElementById('cantidad').src = producto.cantidad;

}/*
function mostrarProductosVendedor(respuesta) {
    const productos = respuesta.productos.Models;
    const container = document.querySelector('.seller-products');

    // Itera sobre los productos y crea elementos para mostrarlos
    productos.forEach((producto) => {
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

        container.appendChild(productCard);
    });
}*/


/*
async function CargarProductosVendedor() {
    try {
        // Realizar una solicitud GET al backend para obtener los 6 primeros productos
        const response = await fetch('http://localhost:5169/ObtenerProductosVendedor');
        if (response.ok) {
            const data = await response.json();
            mostrarProductosVendedor(data); (data);// Llama a una función para mostrar los productos en la página
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

function mostrarProductosVendedor(respuesta) {
    const productos = respuesta.productos.Models;
    const container = document.querySelector('.seller-products');

    // Itera sobre los productos y crea elementos para mostrarlos
    productos.forEach((producto) => {
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

        container.appendChild(productCard);
    });
}
*/


async function mostrarProd() {
    try {
        // Realizar una solicitud al servidor para obtener los detalles del producto
        const response = await fetch('http://localhost:5169/buscarProductoX');
        const nombreInput = document.getElementById('nombre');
        const nombreProducto = 'Producto de ejemplo';
        nombreInput.value = nombreProducto;
        if (response.ok) {
            const data = await response.json();
            //const productosP = data.productos.Models;
            //const primerProducto = productosP.result[0]; // Suponiendo que solo obtienes un producto
            const productos = data.productos.Models;
            // Llenar los campos del formulario con los detalles del producto
            const nombreInput2 = document.getElementById('nombre');
            const nombreProducto2 = 'Producto de ejemplo2';
            nombreInput2.value = nombreProducto2;
            productos.forEach((producto) => {
                const nombreInput = document.getElementById('nombre');
                const nombreProducto = 'Producto de ejemplo3';
                nombreInput.value = nombreProducto;
                document.getElementById('nombre').value = 'Producto de ejemplo1';
                document.getElementById('precio').value = producto.precio;
                document.getElementById('categoria').value = producto.categoria;
                document.getElementById('descripcion').value = producto.descripcion;
                document.getElementById('imagenProducto').src = producto.imagen;
                document.getElementById('cantidad').value = producto.cantidad;

            });
            
            const nombreInput = document.getElementById('nombre');
            const nombreProducto = 'Producto de ejemplo3';
            nombreInput.value = nombreProducto; 

        } else {
            console.error('Error al obtener los detalles del producto:', response.statusText);
            const nombreInput = document.getElementById('nombre');
        const nombreProducto = 'Producto de ejemplo2';
        nombreInput.value = nombreProducto;
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

async function mostrarProd1() {
    try {
        // Realizar una solicitud al servidor para obtener los detalles del producto
        const response = await fetch('http://localhost:5169/buscarProductoX'); // Realiza la solicitud GET
        if (response.ok) {
            const producto = await response.json();
            const productos = producto.result; // Suponiendo que el servidor devuelve un array de productos

            // Verificar si hay productos disponibles
            if (productos.length > 0) {
                const primerProducto = productos[0]; // Tomar el primer producto de la lista

                // Llenar los campos del formulario con los detalles del producto
                document.getElementById('nombre').value = primerProducto.nombreproducto;
                document.getElementById('precio').value = primerProducto.precio;
                document.getElementById('categoria').value = primerProducto.categoria;
                document.getElementById('descripcion').value = primerProducto.descripcion;
                document.getElementById('imagenProducto').src = primerProducto.imagen;
                document.getElementById('cantidad').value = primerProducto.cantidad;
            } else {
                console.error('No se encontraron productos.');
            }
        } else {
            console.error('Error al obtener los detalles del producto:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
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
document.addEventListener('DOMContentLoaded', function() {
    mostrarProd();
});