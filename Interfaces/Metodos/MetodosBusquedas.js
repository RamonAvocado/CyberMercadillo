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

//Para ejecutar en localhost : "http://localhost:5169";
//Para ejecutar en WEB : "https://cybermercadillo.onrender.com";
var lugarDeEjecucion = "http://localhost:5169";

async function buscarHist(TextBuscar, CatBuscar, pagina) {
    buscarProd(TextBuscar,CatBuscar);
}


async function buscar() {

    localStorage.setItem('categoriaSeleccionada', "Todas las categorías");
    var category  = localStorage.getItem('categoriaSeleccionada');
    
    var searchTerm = document.getElementById('searchInput').value;
    localStorage.setItem('searchTerm', searchTerm);

    var limpiarResult = document.getElementById('resultados');
    limpiarResult.innerHTML = `<p></p>`;

    buscarProd(searchTerm, category);

    //CargaTodosProductos();
}


// ahora ya no se tienen que mostrar productos hasta la búsqueda
var CategoriasCargadas = false;

async function CargaTodosProductos(){
    try {
        // Realizar una solicitud GET al backend para obtener los 6 primeros productos

        const response = await fetch(`${lugarDeEjecucion}/ObtenerTodosProductos`);
        if (response.ok) {
            const data = await response.json();
            const productos = data.productos;

            var category  = localStorage.getItem('categoriaSeleccionada');
            mostrarProductosCat(productos, category);

        if(CategoriasCargadas==false)
        {
            CargaCategorias();
            CategoriasCargadas = true;
        }

        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

async function buscarProd(searchTerm, category) {
    // Realizar una solicitud POST al backend con la información de búsqueda
    idUsuarioIniciado = localStorage.getItem("UsuarioID");

    var requestBody = {
        idusuario: idUsuarioIniciado,
        searchTerm: searchTerm + ";" + category,
    };   
        searchTerm: searchTerm + ";" + category,
    };   

    console.log("idUsuarioIniciado: " + idUsuarioIniciado, "searchTerm: " + searchTerm);
    try {
        
        const response = await fetch(`${lugarDeEjecucion}/BuscarProductos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            const data = await response.json();
            var productos = data.productos;
            if(productos.length==0){
                //Poner que no hay productos con estos criterios de búsqueda
                mostrarResultado("No existen productos con estos términos de búsqueda");  // Llama a una función para mostrar todos los productos
            }
            mostrarProductosCat(productos, category);//cargar los productos relacionados
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

function mostrarProductosCat(productos, category) {
    const container = document.querySelector('.resultado-busqueda-container');
    container.innerHTML = '';

    // Itera sobre los productos y crea elementos para mostrarlos
    const cartButtonContainer = document.createElement('div');
    cartButtonContainer.classList.add('cart-button-container');
    const cartButton = document.createElement('button');
    cartButton.classList.add('cart-btn');
    cartButton.textContent = 'Añadir al Carrito de Compra';
    cartButtonContainer.appendChild(cartButton);
    container.appendChild(cartButtonContainer);
    
    productos.forEach((producto) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        // Verificar si las imágenes existen y obtener la primera
        const imagenes = producto.imagenes.split(' ');
        const primeraImagen = imagenes[0];

        // Agregar la imagen, nombre y precio del producto dentro de un enlace
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
            localStorage.setItem('itemID', productCard.idproducto);
            idProductoSeleccionado = localStorage.getItem('itemID');
            console.log(idProductoSeleccionado);
            irAInfoProducto(event.currentTarget);
        });
        container.appendChild(productCard);
    });

    //Muestro la categoría por la que he buscado
    const categoriaTitle = document.createElement('h2');
    categoriaTitle.textContent = `Categoría: ${category}`;
    container.insertBefore(categoriaTitle, container.firstChild);
}

async function CargaCategorias() {
    try {
        const response = await fetch(`${lugarDeEjecucion}/CargarCategorias`);
        if (response.ok) {
            const data = await response.json();
            console.log("Categorías de todos los productos: " + data.categorias);
            mostrarCategorias(data.categorias);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

function mostrarCategorias(array) {
    const categoryButtonsContainer = document.getElementById('categoryButtons');
    categoryButtonsContainer.innerHTML = '';

    // Obtener la última categoría seleccionada del localStorage
    let categoriaSeleccionada = localStorage.getItem('categoriaSeleccionada');
    if (!categoriaSeleccionada) {
        categoriaSeleccionada = 'Todas las categorías';
    }

    // Agregar botón "Todas las categorías"
    const todasLasCategoriasButton = document.createElement('button');
    todasLasCategoriasButton.textContent = 'Todas las categorías';
    todasLasCategoriasButton.classList.add('category-button');
    todasLasCategoriasButton.addEventListener('click', function() {

        categoriaSeleccionada = 'Todas las categorías';
        localStorage.setItem('categoriaSeleccionada', categoriaSeleccionada);

        var limpiarResult = document.getElementById('resultados');
        limpiarResult.innerHTML = `<p></p>`;

        var searchTerm = localStorage.getItem('searchTerm');

        buscarProd(searchTerm, categoriaSeleccionada);
    });
    categoryButtonsContainer.appendChild(todasLasCategoriasButton);  
    array.forEach(categoria => {
        const categoryButton = document.createElement('button');
        categoryButton.textContent = categoria;
        categoryButton.classList.add('category-button');
        categoryButton.addEventListener('click', function() {
            
            categoriaSeleccionada = categoria;
            localStorage.setItem('categoriaSeleccionada', categoriaSeleccionada);          
            var limpiarResult = document.getElementById('resultados');
            limpiarResult.innerHTML = `<p></p>`;
            var searchTerm = localStorage.getItem('searchTerm');
            if (categoriaSeleccionada === 'Todas las categorías') {
                buscarProd(searchTerm, categoriaSeleccionada);
            } else {
                ProductosFiltroCategoria(categoriaSeleccionada);
            }
        });
        categoryButtonsContainer.appendChild(categoryButton);
    });
    localStorage.setItem('categoriaSeleccionada', categoriaSeleccionada);
}

function selectCategory(){
    
}
// async function ProductosFiltroPrecio(minPrice, maxPrice) {
//     try {
//         const requestBody = {
//             minPrice: minPrice,
//             maxPrice: maxPrice
//         };

//         const response = await fetch(`${lugarDeEjecucion}/FiltrarPorPrecio`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(requestBody)
//         });

//         if (response.ok) {
//             const data = await response.json();
//             const productos = data.productos;

//             if (productos.length === 0) {
//                 mostrarResultado("No existen productos en este rango de precios.");
//             }

//             mostrarProductosCat(productos, "Precios entre $" + minPrice + " y $" + maxPrice);
//         } else {
//             console.error('Error en la solicitud al backend:', response.statusText);
//         }
//     } catch (error) {
//         console.error('Error inesperado:', error);
//     }
// }


// async function filtrarPorPrecio(precioMinimo, precioMaximo) {
//     // Realizar la búsqueda de productos por precio dentro del rango especificado
//     try {
//         // Llamar a la función buscar para actualizar el término de búsqueda y la categoría seleccionada
//         localStorage.setItem('categoriaSeleccionada', "Todas las categorías");
//         var category = localStorage.getItem('categoriaSeleccionada');
//         var searchTerm = document.getElementById('searchInput').value;
//         localStorage.setItem('searchTerm', searchTerm);
//         var limpiarResult = document.getElementById('resultados');
//         limpiarResult.innerHTML = `<p></p>`;
//         await buscarProd(searchTerm, category);

//         // Realizar una solicitud POST al backend para filtrar los productos por precio
//         const response = await fetch(`${lugarDeEjecucion}/FiltrarPorPrecio`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 precioMinimo: precioMinimo,
//                 precioMaximo: precioMaximo
//             })
//         });

//         if (response.ok) {
//             const data = await response.json();
//             const productosFiltrados = data.productosFiltrados;

//             if (productosFiltrados.length === 0) {
//                 // Mostrar un mensaje indicando que no hay productos dentro del rango de precio especificado
//                 mostrarResultado("No existen productos dentro del rango de precio especificado");
//             } else {
//                 // Mostrar los productos filtrados
//                 mostrarProductosCat(productosFiltrados, category);
//             }
//         } else {
//             console.error('Error en la solicitud al backend:', response.statusText);
//         }
//     } catch (error) {
//         console.error('Error inesperado:', error);
//     }
// }


// function mostrarCategorias(array) {
//     const selectElement = document.getElementById('categorySelect');

//     // Limpiar opciones existentes, excepto la primera (Todas las categorías)
//     selectElement.options.length = 1;

//     categoriaSelect = selectElement.options[0].value;
//     console.log("categoría seleccinonada: " + categoriaSelect);

//     localStorage.setItem('categoriaSeleccionada', categoriaSelect);

//     // Agregar nuevas opciones de categorías
//     array.forEach(categoria => {
//         const option = document.createElement('option');
//         option.value = categoria;
//         option.textContent = categoria;
//         selectElement.appendChild(option);
//     });

//     selectElement.addEventListener('change', function() {
//         const selectedCategory = selectElement.value;
//         localStorage.setItem('categoriaSeleccionada', selectedCategory);
//         categoriaSelect = localStorage.getItem("categoriaSeleccionada");

//         console.log('Categoría seleccionada:', categoriaSelect);

//         //ahora falta filtrar por categorías
//         if(categoriaSelect == "Todas las categorías"){
//             //window.location.href = './ResultadoBusqueda.html';
//             //que cargue todos los productos y au
    
//             var searchTerm = localStorage.getItem('searchTerm');

//                 buscarProd(searchTerm, categoriaSelect);

//         }
//         else
//         {
//             ProductosFiltroCategoria(categoriaSelect);
//         }
//         var limpiarResult = document.getElementById('resultados');
//         limpiarResult.innerHTML = `<p></p>`;
    
//     });
// }

//le paso los productos para reloguearlos con el filtro de la categoría


async function ProductosFiltroCategoria(categoriaSelect){
    try{
        
        requestBody = {
            category: categoriaSelect,
        };

        var response = await fetch(`${lugarDeEjecucion}/GetProdBusquedas`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        if (response.ok) {
            const data = await response.json();
            //console.log("Texto y todo intro: " + data.productos.Models);
            var productos = data.productos;

            if(productos.length==0){
                //Poner que no hay productos con estos criterios de búsqueda
                mostrarResultado("No existen productos con estos términos de búsqueda");
            }
            mostrarProductosCat(productos, categoriaSelect);//cargar los productos con este filtro
          
    //al final le paso los nuevos prodcutos y la categoria para que la ponga en el texto

        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

// MOSTRAR TODOS LOS PRODUCTOS A LA HORA DE BUSCAR CUALQUIERO COSA
//le paso un 1 y es para mostrarProductosCat, sino que funcione con normalidad

async function getBusquedas() {
    
    try {
        await fetch(`${lugarDeEjecucion}/getBusquedas`)
        .then(response => response.json())
        .then(data => {
        
        const models = data.busquedas;

        // Selecciona el elemento con la clase "historial"
        const historialDiv = document.querySelector('.historial');
        if (models.length == 0){
            const h1 = document.createElement('h1');
            h1.textContent = "No has buscado nada por ahora";
            historialDiv.appendChild(h1);
        } else {
            models.forEach(model => {
                const busqueda = document.createElement('div');
                
                var texto_busqueda = document.createElement('span');
                var fecha_busqueda = document.createElement('span');

                //Pone valor a las variables
                texto_busqueda.textContent = model.texto;
                fecha_busqueda.textContent = model.fecha;

                //Añade los css
                texto_busqueda.classList.add('texto-historial');
                fecha_busqueda.classList.add('fecha-historial');
                busqueda.classList.add("busqueda-historial")

                // Agrega el elemento <h1> al elemento con la clase "historial"
                busqueda.appendChild(texto_busqueda);
                busqueda.appendChild(fecha_busqueda);
                historialDiv.appendChild(busqueda);

                
                texto_busqueda.addEventListener('click', function() {
                    localStorage.setItem('paginaAnterior', "HistorialDeBusqueda.html");
                    localStorage.setItem('searchTerm', texto_busqueda.textContent);
                    localStorage.setItem('category', model.categoria);
                    //console.log(paginaAnterior); // Esto imprimirá el nombre del archivo actual, por ejemplo, "ResultadoBusqueda.html" o "HistorialBusqueda.html"
                    window.location.href = './ResultadoBusqueda.html';
                });
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