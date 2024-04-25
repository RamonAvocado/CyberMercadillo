

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
                    mostrarResultado("No existen productos con estos términos de búsqueda");  // Llama a una función para mostrar todos los productos
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
                    mostrarResultado("No existen productos con estos términos de búsqueda");  // Llama a una función para mostrar todos los productos
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

function mostrarResultado(resultado) {
    var resultadosDiv = document.getElementById('resultados');
    //Esto es la respuesta que a accedido al Controlador Program y lo muestra por pantalla en la Pagina Principal
    resultadosDiv.innerHTML = `<p>Resultado: ${resultado}</p>`;
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

function irAInfoProducto2(productoParaInfo) {
    // Redirigir a la página de InfoProducto.html con el parámetro del producto
    window.location.href = `InfoBasicaProducto.html?id=${productoParaInfo}`;

    // Ocultar el botón después de la redirección
    const historialBtn = document.getElementById('historialBtnInfoProd');
    historialBtn.style.display = 'none';
}
