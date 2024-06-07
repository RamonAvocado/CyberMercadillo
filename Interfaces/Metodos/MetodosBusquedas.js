var idProductoSeleccionado;
var idUsuarioIniciado;//guardo esto aquí para poder acceder en todas las páginas
var idProductoCantidadSelec;//cantidad de producto seleccionada
var idProductoCantidad;//cuantos producto hay en la base de datos
var categoriaSelect;
var numTarjeta;
var fechaCaducidad;
var cvv;
 
var todosLosProductos;
 
var paginaAnterior;
var searchTerm;
var category;
var TipoUsuarioRegistrado;
var contadorBusquedas = 0 ;
var busquedasAnteriores = [];
 
//Para ejecutar en localhost : "http://localhost:5169";
//Para ejecutar en WEB : "https://cybermercadillo.onrender.com";
var lugarDeEjecucion = "http://localhost:5169";
 
 
 
async function buscar() {
    localStorage.setItem('categoriaSeleccionada', "Todas las categorías");
    var category  = localStorage.getItem('categoriaSeleccionada');
   
    localStorage.setItem('paginaAnterior', "ResultadoBusqueda.html");
   
    var searchTerm = document.getElementById('searchInput').value;
   
    localStorage.setItem('searchTerm', searchTerm);
 
    document.getElementById('minPrice').value = "";
    document.getElementById('maxPrice').value = "";
 
    var limpiarResult = document.getElementById('resultados');
    limpiarResult.innerHTML = `<p></p>`;
 
 
    CargaCategorias();
    buscarProd(searchTerm, category);
 
    if(category != "Todas las categorías"){
        ProductosFiltroCategoria(searchTerm, category);
    }
 
 
    document.getElementById('categorySelect').selectedIndex = 0;
}
 
 
// ahora ya no se tienen que mostrar productos hasta la búsqueda
var CategoriasCargadas = false;
async function CargaTodosProductos(){
    try {
        // Realizar una solicitud GET al backend para obtener los 6 primeros productos
        const response = await fetch(`${lugarDeEjecucion}/ObtenerTodosProductos`);
        if (response.ok) {
            const data = await response.json();
            const productos = data.objeto;
            todosLosProductos = productos;
 
        if(CategoriasCargadas==false)
        {
            CargaCategorias();
            CategoriasCargadas = true;
        }
 
        var category  = "Todas las categorías";
        mostrarProductosCat(productos, category);
 
 
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
        //RESULTADO QUE SALE EN HISTORIAL
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
            console.log(data);
            var productos = data.objeto;
 
            if(productos.length==0){
                //Poner que no hay productos con estos criterios de búsqueda
                if(localStorage.getItem('searchTerm') != ''){
                    mostrarResultado("No existen productos con estos términos de búsqueda");  // Llama a una función para mostrar todos los productos
                }
            }
            mostrarProductosCat(productos, category);//cargar los productos relacionados
           
            //EXTRA++++
            BusquedaBackButton(productos);
            contadorBusquedas++;
            console.log("contadorBusquedas: " + contadorBusquedas);
 
            // contadorBusquedas++;
            // console.log("contadorBusquedas: " + contadorBusquedas)
            // busquedasAnteriores.push(productos);
            // localStorage.setItem('busquedasAnteriores', JSON.stringify(busquedasAnteriores));
            //HASTA AQUI+++++
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}
 
function BusquedaBackButton(productos) {
    // Recuperar el historial de búsquedas anteriores
    var busquedasAnteriores = JSON.parse(localStorage.getItem('busquedasAnteriores')) || [];
    // Agregar la búsqueda actual al historial
    busquedasAnteriores.push(productos);
    // Guardar el historial actualizado en el almacenamiento local
    localStorage.setItem('busquedasAnteriores', JSON.stringify(busquedasAnteriores));
}
 
function mostrarProductosCat(productos) {
    const container = document.querySelector('.resultado-busqueda-container');
    container.innerHTML = '';
   
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
        productCard.addEventListener('dblclick', (event) => {
            irAInfoProducto(event.currentTarget);
        });
        const favoriteBtn = productCard.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', function() {
            idUsuarioIniciado = localStorage.getItem('UsuarioID');
            idProductoSeleccionado = localStorage.getItem('itemID');
 
            idUsuarioIniciado= parseInt(idUsuarioIniciado);
            idProductoSeleccionado= parseInt(idProductoSeleccionado);
 
        AñadirListaDeseos(idUsuarioIniciado, idProductoSeleccionado);
        });
       
        container.appendChild(productCard);
    });
 
    //Muestro la categoría por la que he buscado
    const categoriaTitle = document.createElement('h2');
    var paginaAnterior = localStorage.getItem('paginaAnterior');
   
    if(paginaAnterior == "HistorialDeBusqueda.html"){
        categoriaTitle.textContent = `Categoría: ${localStorage.getItem('categoriaProductoBusqueda')}`;
    } else {
        categoriaTitle.textContent = `Categoría: ${localStorage.getItem('categoriaSeleccionada')}`;
    }
    container.insertBefore(categoriaTitle, container.firstChild);
}
//CAMBIANDO
function mostrarProductosConDescuent(productos) {
    const container = document.querySelector('.resultado-busqueda-container');
    container.innerHTML = '';
    console.log("HAY: " + productos.length + " PRODUCTOS con descuento");
 
    // Itera sobre los productos y crea elementos para mostrarlos
    productos.forEach((producto) => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            //imagenes de cada producto
            const imagenes = producto.imagenes.split(' ');
            const primeraImagen = imagenes[0];
           
            // Agrega la imagen, nombre y precio del producto dentro de un enlace      
            productCard.innerHTML = `
                <button class="favorite-btn"></button>
                <img src="${primeraImagen}" alt="${producto.nombreproducto}"  style="width: 200px; height: 240px;">
                <p class="descuento"> Descuento del ${producto.descuento} %</p>
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
            productCard.addEventListener('dblclick', (event) => {
                irAInfoProducto(event.currentTarget);
            });
            const favoriteBtn = productCard.querySelector('.favorite-btn');
            favoriteBtn.addEventListener('click', function() {
                idUsuarioIniciado = localStorage.getItem('UsuarioID');
                idProductoSeleccionado = localStorage.getItem('itemID');
   
                idUsuarioIniciado= parseInt(idUsuarioIniciado);
                idProductoSeleccionado= parseInt(idProductoSeleccionado);
   
            AñadirListaDeseos(idUsuarioIniciado, idProductoSeleccionado);
            });
 
            container.appendChild(productCard);
    });
}
async function CargarProductosRecomendad(){
    try {
        console.log("Entra funcion cargarProductosRecomendados");
        const response = await fetch(`${lugarDeEjecucion}/ObtenerProductosRecomendados`);
        if (response.ok) {
            const data = await response.json();
            const productos = data.objeto;
            // Mostrar los productos de la primera página en la interfaz de usuario
            mostrarProductosConDescuent(productos);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}
//CAMBIANDO
 
 
async function filtrarPrecio() {
    var minPrice = document.getElementById('minPrice').value;
    var maxPrice = document.getElementById('maxPrice').value;
    const category = localStorage.getItem('categoriaSeleccionada');
 
    var limpiarResult = document.getElementById('resultados');
    limpiarResult.innerHTML = `<p></p>`;
 
    if (minPrice == "" ){
        minPrice = 1;
    }
 
    if(maxPrice == "" ){
        maxPrice = 1000;
    }
 
    console.log("minPrice: " + minPrice + " maxPrice: " + maxPrice);
    const requestBody = {
        minPrice: minPrice,
        maxPrice: maxPrice,
        category: category,
    };
 
    try {
        const response = await fetch(`${lugarDeEjecucion}/FiltroPorPrecio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
 
        if (response.ok) {
            const data = await response.json();
            //console.log("Texto y todo intro: " + data.productos.Models);
            var productos = data.objeto;
 
            if(productos.length==0){
                //Poner que no hay productos con estos criterios de búsqueda
                if(localStorage.getItem('searchTerm') != ''){
                    mostrarResultado("No existen productos con estos términos de búsqueda");  // Llama a una función para mostrar todos los productos
                }
            }
       
        // Llamar a la función para mostrar los productos filtrados
        mostrarProductosCat(productos);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error al filtrar precio productos:', error);
    }
}
 
 
async function filtrarValorEco() {
    const valoracion = document.getElementById('rating').value;
    var minPrice = document.getElementById('minPrice').value;
    var maxPrice = document.getElementById('maxPrice').value;
    const category = localStorage.getItem('categoriaSeleccionada');
 
    var limpiarResult = document.getElementById('resultados');
    limpiarResult.innerHTML = `<p></p>`;
 
 
    if(minPrice == ""){
        minPrice = 1;
    }    
   
    if(maxPrice == ""){
        maxPrice = 1000;
    }
 
    // idUsuarioIniciado = localStorage.getItem("UsuarioID");
    console.log("estamos aqui: "+ valoracion);
    console.log("estamos aqui: "+ minPrice);
    console.log("estamos aqui: "+ maxPrice);
 
    const requestBody = {
        minPrice: minPrice,
        maxPrice: maxPrice,
        category: category,
        valoracion: valoracion,    
    };
            // idusuario: idUsuarioIniciado,
 
    console.log("estamos aqui 2: "+ valoracion);
 
 
    try {
        const response = await fetch(`${lugarDeEjecucion}/FiltroPorEco`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
 
        console.log("estamos aqui 4: "+ valoracion);
 
        if (response.ok) {
            const data = await response.json();
            //console.log("Texto y todo intro: " + data.productos.Models);
            var productos = data.objeto;
 
            if(productos.length==0){
                //Poner que no hay productos con estos criterios de búsqueda
                if(localStorage.getItem('searchTerm') != ''){
                    mostrarResultado("No existen productos con estos términos de búsqueda");  // Llama a una función para mostrar todos los productos
                }
            }
       
        // Llamar a la función para mostrar los productos filtrados
        mostrarProductosCat(productos);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error al filtrar precio productos:', error);
    }
}
 
async function CargaCategorias() {
    try {
        const response = await fetch(`${lugarDeEjecucion}/CargarCategorias`);
        if (response.ok) {
            const data = await response.json();
            console.log("Categorías de todos los productos: " + data.objeto);
            mostrarCategorias(data.objeto);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}
 
/*
function mostrarCategorias(array) {
    const categoryButtonsContainer = document.getElementById('categoryButtons');
    categoryButtonsContainer.innerHTML = '';
 
    // Obtener la última categoría seleccionada del localStorage
    //PREGUNTAR
    if(localStorage.getItem('categoriaSeleccionada') == "null"){localStorage.setItem('categoriaSeleccionada', localStorage.getItem('categoriaProductoBusqueda'));}
    let categoriaSeleccionada = localStorage.getItem('categoriaSeleccionada');
   
 
    // Agregar botón "Todas las categorías"
    const todasLasCategoriasButton = document.createElement('button');
    todasLasCategoriasButton.textContent = 'Todas las categorías';
    todasLasCategoriasButton.classList.add('category-button');
    todasLasCategoriasButton.addEventListener('click', function() {
 
        localStorage.setItem('categoriaSeleccionada', 'Todas las categorias');
 
        var limpiarResult = document.getElementById('resultados');
        limpiarResult.innerHTML = `<p></p>`;
 
        var searchTerm = localStorage.getItem('searchTerm');
 
        buscarProd(searchTerm, 'Todas las categorias');
       
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
 
 
            //PREGUNTAR
            //var searchTerm = localStorage.getItem('searchTerm');
            var searchTerm = document.getElementById('searchInput').value;
 
 
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
*/
 
function mostrarCategorias(array) {
    const selectElement = document.getElementById('categorySelect');
 
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
 
    //cuando selecciono una categoría
    selectElement.addEventListener('change', function() {
        const selectedCategory = selectElement.value;
        localStorage.setItem('categoriaSeleccionada', selectedCategory);
        categoriaSelect = localStorage.getItem("categoriaSeleccionada");
 
        console.log('Categoría seleccionada:', categoriaSelect);
 
        //buscarProd(searchTerm, categoriaSelect);
        var searchTerm = localStorage.getItem('searchTerm');
       
        //ESTO ES EL PROBLEMA
 
        localStorage.setItem('paginaAnterior', "ResultadoBusqueda.html");
       
       
        //ESTO RESETEA LOS PRECIOS
        document.getElementById('minPrice').value = "";
        document.getElementById('maxPrice').value = "";
 
        //ahora falta filtrar por categorías
        if(categoriaSelect == "Todas las categorías"){
            //window.location.href = './ResultadoBusqueda.html';
            //que cargue todos los productos y au
   
            buscarProd(searchTerm, categoriaSelect);
        }
        else
        {
            ProductosFiltroCategoria(searchTerm, categoriaSelect);
        }
        var limpiarResult = document.getElementById('resultados');
        limpiarResult.innerHTML = `<p></p>`;
 
    });
 }
 
//le paso los productos para reloguearlos con el filtro de la categoría
 
 
async function ProductosFiltroCategoria(searchTerm, categoriaSelect){
    try{
        var requestBody = {
            category: categoriaSelect,
            //RESULTADO QUE SALE EN HISTORIAL
            searchTerm: searchTerm + ";" + categoriaSelect,
            idBuscado: idUsuarioIniciado,
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
            var productos = data.objeto;
            console.log("Productos después de aplicar el filtro de categorías: " + productos.length);
 
            if(productos.length==0){
                if(localStorage.getItem('searchTerm') != ''){
                    mostrarResultado("No existen productos con estos términos de búsqueda");  // Llama a una función para mostrar todos los productos
                }
            }
            mostrarProductosCat(productos);//cargar los productos con este filtro
         
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
       
        const models = data.objeto;
 
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
                    var busc = texto_busqueda.textContent.split(' ');
 
                    var cat = busc[4].split(']')[0];
 
                    if(cat == "Todas"){cat = "Todas las categorias";}
 
                    localStorage.setItem('paginaAnterior', "HistorialDeBusqueda.html");
                    localStorage.setItem('searchTerm', busc[0]);
                    localStorage.setItem('categoriaProductoBusqueda', cat);
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
 
async function borrarCuenta() {
    try{
 
        var requestBody = {
            idusuario: localStorage.getItem('UsuarioID'),
        };
       
        await fetch(`${lugarDeEjecucion}/borrarCuenta`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        alert("Cuenta borrada con éxito");
        localStorage.removeItem('UsuarioID');
        window.location.href = `./NewPaginaPrincipal.html`
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}