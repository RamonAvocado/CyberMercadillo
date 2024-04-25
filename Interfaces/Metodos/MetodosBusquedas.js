import GeneralMetodos from './GeneralMetodos.js';
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
    /*localStorage.setItem('searchTerm', TextBuscar);
    localStorage.setItem('searchTerm', categoriaSelect);*/
    //console.log("llegue aqui")

    //esto no va, hay que darle una vuelta
    buscarProd(TextBuscar,CatBuscar);
}

async function buscarProd(searchTerm, category) {
    // Realizar una solicitud POST al backend con la información de búsqueda
    idUsuarioIniciado = localStorage.getItem("UsuarioID");

    var requestBody = {
        idusuario: idUsuarioIniciado,
        searchTerm: searchTerm,
        category: category
    };   

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
                console.log(data);
                console.log(data.productos.Models.length);
                if(data.productos.Models.length==0){
                    //Poner que no hay productos con estos criterios de búsqueda
                    GeneralMetodos.mostrarResultado("No existen productos con estos términos de búsqueda");
                }
                mostrarProductosCat(data.productos.Models);//cargar los productos relacionados
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
                console.log(data);
                console.log(data.productos.Models);
                console.log("ENTRA AQUI"); //REVISAR!!!!!!!!!
                if(data.productos.Models.length==0){
                    //Poner que no hay productos con estos criterios de búsqueda
                    GeneralMetodos.mostrarResultado("No existen productos con estos términos de búsqueda");
                }
                mostrarProductosCat(data.productos.Models);//cargar los productos relacionados
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
    //console.log(container);
    categoriaSelect = localStorage.getItem("categoriaSeleccionada");
    categoriaTitle.textContent = `Categoría: ${categoriaSelect}`;
    container.insertBefore(categoriaTitle, container.firstChild);
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

async function buscar() {
    var searchTerm = document.getElementById('searchInput').value;
    var category  = localStorage.getItem('categoriaSeleccionada');
    localStorage.setItem('searchTerm', searchTerm);

    var limpiarResult = document.getElementById('resultados');
    limpiarResult.innerHTML = `<p></p>`;

    buscarProd(searchTerm,category);
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
    const selectElement = document.getElementById('categorySelect');
    //console.log(selectElement.options);
    //console.log(selectElement.options[0]);
    categoriaSelect = selectElement.options[0].value;
    console.log("categoría seleccinonada: " + categoriaSelect);

    localStorage.setItem('categoriaSeleccionada', categoriaSelect);


    // Limpiar opciones existentes, excepto la primera (Todas las categorías)
    selectElement.options.length = 1;

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

async function buscarPorCategoria() {
    categoriaSelect = localStorage.getItem("categoriaSeleccionada");
    idUsuarioIniciado = localStorage.getItem("UsuarioID");
    searchTerm = localStorage.getItem("searchTerm");

    var limpiarResult = document.getElementById('resultados');
    limpiarResult.innerHTML = `<p></p>`;

    // Realizar una consulta con la categoría seleccionada

    var requestBody = {
        idusuario: idUsuarioIniciado,
        searchTerm: searchTerm,
        category: categoriaSelect
    };   

    try {
        if(categoriaSelect == "Todas las categorías")
        {
            //le paso un 1 y es para mostrarProductosCat
            CargaTodosProductos(1);
            console.log("Todas las categorías mostradas")    
        }
        else{
            const response = await fetch(`${lugarDeEjecucion}/BuscarPorCategoria`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            if (response.ok) {
                const data = await response.json();
                productos = data.ProductosXCat.Models;
                console.log(productos); 
                mostrarProductosCat(productos);
            } else {
                console.error('Error en la solicitud al backend:', response.statusText);
            }
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}
