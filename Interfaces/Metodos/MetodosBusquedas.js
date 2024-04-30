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
    var searchTerm = document.getElementById('searchInput').value;
    var category  = localStorage.getItem('categoriaSeleccionada');
    localStorage.setItem('searchTerm', searchTerm);

    var limpiarResult = document.getElementById('resultados');
    limpiarResult.innerHTML = `<p></p>`;

    buscarProd(searchTerm,category);
}

async function buscarProd(searchTerm, category) {
    // Realizar una solicitud POST al backend con la información de búsqueda
    idUsuarioIniciado = localStorage.getItem("UsuarioID");

    var requestBody = {
        idusuario: idUsuarioIniciado,
        searchTerm: searchTerm,
        category: category
    };   

    console.log("idUsuarioIniciado: " + idUsuarioIniciado, "searchTerm: " + searchTerm, "category: " + category);
    try {
        //console.log("esto es ante sd ela a:" + category);
         //si es igual a todas las categorías, obtener como resultado solo el texto vacío -> mostrarTodo
        if (category == "Todas las categorías" && searchTerm == ""){
            //No has introducido ningún campo de búsqueda, recargo la página
            window.location.href = `./ResultadoBusqueda.html`;
        
        //ahora el texto ya tiene contendio y es con TODAS LAS CATEGORÍAS
        }else if(category == "Todas las categorías")
        {
            const response = await fetch(`${lugarDeEjecucion}/BuscarProductoText`,{
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
                console.log(productos);
                console.log(productos.length);

                productos.forEach((producto) => {
                    console.log("Nombre: "+ producto.nombreproducto);
                });

                if(productos.length == 0){
                    //Poner que no hay productos con estos criterios de búsqueda
                    mostrarResultado("No existen productos con estos términos de búsqueda");  // Llama a una función para mostrar todos los productos
                }
                mostrarProductosCat(productos);//cargar los productos relacionados
            } else {
                console.error('Error en la solicitud al backend:', response.statusText);
            }
        }
        //ahora ya hay que buscar por texto y la categoría seleccionada
        else
        {
            const response = await fetch(`${lugarDeEjecucion}/BuscarProductoTodo`, {
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
                console.log(productos);
                console.log(productos.length);
                if(productos.length==0){
                    //Poner que no hay productos con estos criterios de búsqueda
                    mostrarResultado("No existen productos con estos términos de búsqueda");  // Llama a una función para mostrar todos los productos
                }
                mostrarProductosCat(productos);//cargar los productos relacionados
            } else {
                console.error('Error en la solicitud al backend:', response.statusText);
            }
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}




function mostrarProductosCat(productos) {
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
            <p class="price">${producto.precio}</p>
            <p class="description">${truncate(producto.descripcion)}</p>
            <div hidden>
                <div id="CategoriaSelec" data-info="${producto.categoria}"> </div>
                <div id="idProducto" data-info="${producto.idproducto}"> </div>
            </div>
        `;

        // Agregar evento de clic para seleccionar el producto
        productCard.addEventListener('click', (event) => {
            GeneralMetodos.seleccionarProducto(event.currentTarget);
        });

        // Agregar evento de doble clic para ir a la página de información del producto
        productCard.addEventListener('dblclick', (event) => {
            localStorage.setItem('itemID', productCard.idproducto);
            idProductoSeleccionado = localStorage.getItem('itemID');
            console.log(idProductoSeleccionado);
            GeneralMetodos.irAInfoProducto(event.currentTarget);
        });
        container.appendChild(productCard);
    });

    //Muestro la categoría por la que he buscado
    const categoriaTitle = document.createElement('h2');
    //console.log(container);
    categoriaSelect = localStorage.getItem("categoriaSeleccionada");
    categoriaTitle.textContent = `Categoría: ${categoriaSelect}`;
    container.insertBefore(categoriaTitle, container.firstChild);
}

//puesto en general por varias funciones depender de el
/*function seleccionarProducto(productoSeleccionado) {
    // Desmarcar todos los productos seleccionados
    const selectedProducts = document.querySelectorAll('.product-card.selected');
    selectedProducts.forEach(product => product.classList.remove('selected'));

    // Marcar el producto actualmente seleccionado
    productoSeleccionado.classList.add('selected');
}*/


//puesto en general por varias funciones depender de el
/*function irAInfoProducto(productoParaInfo) {
    // Obtener el ID del producto y la categoría de los atributos de datos (data-*) de la tarjeta de producto
    const productId = productoParaInfo.querySelector('#idProducto').dataset.info;
    localStorage.setItem('itemID', productId);

    window.location.href = `./InfoProducto.html`;
}*/

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
    const selectElement = document.getElementById('categorySelect');
    //console.log(selectElement.options);
    //console.log(selectElement.options[0]);


    // Limpiar opciones existentes, excepto la primera (Todas las categorías)
    selectElement.options.length = 1;

    categoriaSelect = selectElement.options[0].value;
    console.log("categoría seleccinonada: " + categoriaSelect);

    localStorage.setItem('categoriaSeleccionada', categoriaSelect);

    // Agregar nuevas opciones de categorías
    array.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        selectElement.appendChild(option);
    });

    selectElement.addEventListener('change', function() {
        const selectedCategory = selectElement.value;
        localStorage.setItem('categoriaSeleccionada', selectedCategory);
        categoriaSelect = localStorage.getItem("categoriaSeleccionada");

        console.log('Categoría seleccionada:', categoriaSelect);
        // Aquí puedes hacer lo que necesites con la categoría seleccionada
    });
}

// MOSTRAR TODOS LOS PRODUCTOS A LA HORA DE BUSCAR CUALQUIERO COSA
//le paso un 1 y es para mostrarProductosCat, sino que funcione con normalidad
async function CargaTodosProductos(valor){
    try {
        // Realizar una solicitud GET al backend para obtener los 6 primeros productos
        CargaCategorias();
        const response = await fetch(`${lugarDeEjecucion}/ObtenerTodosProductos`);
        if (response.ok) {
            const data = await response.json();
            const productos = data.productos;
            if(valor ==  1){
                mostrarProductosCat(productos);
            }
            else{
                mostrarTodosProductos(productos);// Llama a una función para mostrar los productos en la página
            }
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}
async function CargaTodosProductos(valor){
    try {
        // Realizar una solicitud GET al backend para obtener los 6 primeros productos
        CargaCategorias();
        const response = await fetch(`${lugarDeEjecucion}/ObtenerTodosProductos`);
        if (response.ok) {
            const data = await response.json();
            const productos = data.productos;
            if(valor ==  1){
                mostrarProductosCat(productos);
            }
            else{
                GeneralMetodos.mostrarTodosProductos(productos);// Llama a una función para mostrar los productos en la página
            }
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

async function getBusquedas() {
    
    try {
        await fetch(`${lugarDeEjecucion}/getBusquedas`)
        .then(response => response.json())
        .then(data => {
        
        const models = data.result.Models;

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