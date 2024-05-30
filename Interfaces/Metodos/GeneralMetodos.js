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

//import Usuario  from '/BusinessLogic/Usuario.cs';
//import InstantaneaUsuario  from '/BusinessLogic/InstantaneaUsuario.cs';
//import conserjeDeInstantaneasUsuario  from '/BusinessLogic/conserjeDeInstantaneasUsuario.cs';




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
    var errorMessage1 = document.getElementById('error-message');
    var errorMessage2 = document.getElementById('TelUsuError');
    var errorMessage3 = document.getElementById('CorreoUsuError');
    var errorMessage4 = document.getElementById('NumTarjError1');
    var errorMessage5 = document.getElementById('NumTarjError2');
    var errorMessage6 = document.getElementById('CVVError1');
    var errorMessage7 = document.getElementById('CVVError2');
    var errorMessage8 = document.getElementById('FechaCadError1');
    var errorMessage9 = document.getElementById('FechaCadError2');
    var errorMessage10 = document.getElementById('FechaCadError3');
    if (errorMessage1.style.display == 'block' || errorMessage2.style.display == 'block' ||
        errorMessage3.style.display == 'block' || errorMessage4.style.display == 'block' ||
        errorMessage5.style.display == 'block' || errorMessage6.style.display == 'block' ||
        errorMessage7.style.display == 'block' || errorMessage8.style.display == 'block' ||
        errorMessage9.style.display == 'block' || errorMessage10.style.display == 'block' 
    ) {
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
        const response = await fetch(`${lugarDeEjecucion}/ObtenerProductosRecomendados`);
        if (response.ok) {
            const data = await response.json();
            const productos = data.objeto;


            const productosPorPagina = 6;
            const totalPaginas = Math.ceil(productos.length / productosPorPagina);

            // Mostrar los productos de la primera página en la interfaz de usuario
            mostrarProductosConDescuento(productos.slice(0, productosPorPagina));
            // Generar enlaces de paginación
            generarEnlacesPaginacionRec(totalPaginas);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

async function CargarProductosRelacionados(){
    try {
        console.log("Entra funcion cargarProductosRecomendados");
        const response = await fetch(`${lugarDeEjecucion}/ObtenerProductosDestacados`);
        if (response.ok) {
            const data = await response.json();
            const productos = data.objeto;

            var productosFiltrados = [];
            for (var i = 0; i < productos.length; i++) {
                if(productos[i].categoria == localStorage.getItem("categoria")){
                    productosFiltrados.push(productos[i]);
                }
            }


            const productosPorPagina = 6;
            const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

            // Mostrar los productos de la primera página en la interfaz de usuario
            mostrarProductosRelacionados(productosFiltrados.slice(0, productosPorPagina));
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

            mostrarProductosConDescuento(productos.slice(0, productosPorPagina));

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

function mostrarProductosConDescuento(productos) {
    const container = document.querySelector('.recommended-products');
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

function mostrarProductosRelacionados(productos) {
    const container = document.querySelector('.related-products');
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

//Relacionados DE un PRODUCTOS DENTRO DE INFO DE UN PRODUCTO
/*
async function CargarProductosRelacionados(){
    try {
        var categoria = localStorage.getItem('categoria')
        console.log("CATEGORIA PRODUCTO SELEC : " + categoria);

        const response = await fetch(`${lugarDeEjecucion}/ObtenerProductosDestacados`);
    
        if (response.ok) {
            const data = await response.json();
            const productos = data.objeto;
            
            const productosPorPagina = 6;
            const totalPaginas = Math.ceil(productos.length / productosPorPagina);

            // Mostrar los productos de la primera página en la interfaz de usuario
            mostrarProductosRelacionados(productos.slice(0, productosPorPagina), categoria);
            // Generar enlaces de paginación
            //generarEnlacesPaginacionRel(totalPaginas);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

function generarEnlacesPaginacionRel(totalPaginas) {
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
            await cargarProductosPorPaginaRel(i);
        });
    }
}

async function cargarProductosPorPaginaRel(numeroPagina) {
    const productosPorPagina = 6;
    try {
        var categoria = localStorage.getItem('categoria')
        console.log("CATEGORIA PRODUCTO SELEC : " + categoria);

        const response = await fetch(`${lugarDeEjecucion}/ObtenerProductosDestacados`);
    
        if (response.ok) {
            const data = await response.json();
            const productos = data.objeto;
                        
            mostrarProductosRelacionados(productos.slice(numeroPagina, productosPorPagina), categoria);

        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

async function mostrarProductosRelacionados(productos, category){
    const container = document.querySelector('.recommended-products');
    container.innerHTML = '';

    // Itera sobre los productos y crea elementos para mostrarlos
    productos.forEach((producto) => {
        var idProductoSeleccionado = localStorage.getItem('itemID');
        if(producto.categoria == category && producto.idproducto!= idProductoSeleccionado){
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            //imagenes de cada producto
            const imagenes = producto.imagenes.split(' ');
            const primeraImagen = imagenes[0];
            
            // Agrega la imagen, nombre y precio del producto dentro de un enlace       
            productCard.innerHTML = `
                <button class="favorite-btn"></button>
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
        }
    });
}

*/

//productos destacados

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

        const favoriteBtn = productCard.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', function() {
            idUsuarioIniciado = localStorage.getItem('UsuarioID');
            //idProductoSeleccionado = localStorage.getItem('itemID');
            console.log("idProductoSeleccionado: " + producto.idproducto);
            idUsuarioIniciado= parseInt(idUsuarioIniciado);
            idProductoSeleccionado= parseInt(producto.idproducto);

        AñadirListaDeseos(idUsuarioIniciado, idProductoSeleccionado);
            
            
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

function showRepeatPassword() {
    var repeatPasswordContainer = document.getElementById('repeat-password-container');
    repeatPasswordContainer.style.display = 'block';
}

async function combinedFunction() {
    var password = document.getElementById('ContraseñaUsu').value;
    var repeatPassword = document.getElementById('RContraseñaUsu').value;
    var errorMessage1 = document.getElementById('error-message1');
    var errorMessage2 = document.getElementById('error-message2');

    // Validar si las contraseñas coinciden
    if (password !== repeatPassword) {
        errorMessage1.style.display = 'block';
        errorMessage2.style.display = 'none';
        return; // Salir de la función si las contraseñas no coinciden
    } else {
        errorMessage1.style.display = 'none';

        var idUser = localStorage.getItem('UsuarioID');
        console.log('ID del vendedor seleccionado: ' + idUser);

        var requestBody = {
            idUser: idUser,
            password: password
        };

        try {
            const response = await fetch(`${lugarDeEjecucion}/VerificarContraseñas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                console.log("respuesta ok");
                const jsonResponse = await response.json();
                const guay = jsonResponse.guay;

                if (guay == false)
                {
                    console.log("las contraseña anterior es IGUAL que la nueva");
                    errorMessage2.style.display = 'block';
                }
                else {
                    console.log("las contraseña anterior es DISTINTA de la nueva");
                    errorMessage2.style.display = 'none';
                }
            } else {
                console.error('Error en el backend: ', response.statusText);
            }
        } catch (error) {
            console.error('Error inesperado:', error);
        }
    }
}

function validateTel() {
    var telefonoInput = document.getElementById('TelUsu');
    var telefonoInputT = document.getElementById('TelUsuT');
    var errorSpan = document.getElementById('TelUsuError');
    var errorSpan2 = document.getElementById('TelUsuError2');
    
    // Verificar si el valor es un número entero
    if (!Number.isInteger(Number(telefonoInput.value))) {
        // Muestra el mensaje de error si no es un número entero
        errorSpan.style.display = 'block';
    } else {
        // Oculta el mensaje de error si es un número entero
        errorSpan.style.display = 'none';
    }

    if (!Number.isInteger(Number(telefonoInputT.value))) {
        // Muestra el mensaje de error si no es un número entero
        errorSpan2.style.display = 'block';
    } else {
        // Oculta el mensaje de error si es un número entero
        errorSpan2.style.display = 'none';
    }
    
}

function validateTelComprador() {
    var telefonoInputC = document.getElementById('TelUsuC');
    var errorSpan = document.getElementById('TelUsuError');
    
    // Verificar si el valor es un número entero
    if (!Number.isInteger(Number(telefonoInputC.value))) {
        // Muestra el mensaje de error si no es un número entero
        errorSpan.style.display = 'block';
    } else {
        // Oculta el mensaje de error si es un número entero
        errorSpan.style.display = 'none';
    }
    
}
function validateEmail() {
    var correoInput = document.getElementById('CorreoUsu');
    var errorSpan = document.getElementById('CorreoUsuError');

    // Expresión regular para validar correo electrónico
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Verificar si el valor es un correo electrónico válido
    if (!emailRegex.test(correoInput.value)) {
        // Muestra el mensaje de error si no es válido
        errorSpan.style.display = 'block';
        return false;
    } else {
        // Oculta el mensaje de error si es válido
        errorSpan.style.display = 'none';
        return true;
    }
}

function validateEmailComprador() {
    var correoInput = document.getElementById('CorreoUsuC');
    var errorSpan = document.getElementById('CorreoUsuError');

    // Expresión regular para validar correo electrónico
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Verificar si el valor es un correo electrónico válido
    if (!emailRegex.test(correoInput.value)) {
        // Muestra el mensaje de error si no es válido
        errorSpan.style.display = 'block';
        return false;
    } else {
        // Oculta el mensaje de error si es válido
        errorSpan.style.display = 'none';
        return true;
    }
}

function validarCVV() {
    var cvv = document.getElementById("CVV").value;
    var errorSpan = document.getElementById('CVVError1');
    var errorSpan2 = document.getElementById('CVVError2');

    // Verificar que el CVV tenga la longitud correcta
    if (cvv != ""){
        if (cvv.length !== 3 && cvv.length !== 4) {
            errorSpan.style.display = 'block';
            return;
        }else{
            errorSpan.style.display = 'none';
        }

        // Verificar que el CVV sea numérico
        if (isNaN(cvv)) {
            errorSpan2.style.display = 'block';
            return;
        }else{
            errorSpan2.style.display = 'none';
        }
    }else{
        errorSpan.style.display = 'none';
        errorSpan2.style.display = 'none';
    }
}

function validarFechaDeCaducidad() {
    var fechaCaducidad = document.getElementById("FechaCad").value;
    var errorSpan1 = document.getElementById('FechaCadError1');
    var errorSpan2 = document.getElementById('FechaCadError2');
    var errorSpan3 = document.getElementById('FechaCadError3');

    // Verificar que se haya ingresado una fecha
    if (fechaCaducidad != "") {
        // Verificar el formato de la fecha (MM/AA)
        var fechaArray = fechaCaducidad.split('/');
        if (fechaArray.length !== 2) {
            errorSpan1.style.display = 'block';
            return;
        }else errorSpan1.style.display = 'none';

        var mes = parseInt(fechaArray[0], 10);
        var ano = parseInt(fechaArray[1], 10);

        // Verificar que el mes esté entre 1 y 12
        if (mes < 1 || mes > 12) {
            errorSpan2.style.display = 'block';
            return;
        }else errorSpan2.style.display = 'none';

        // Obtener el año actual
        var fechaActual = new Date();
        var anoActual = fechaActual.getFullYear() % 100; // Obtenemos los últimos dos dígitos del año actual

        // Verificar que el año sea mayor o igual al año actual
        if (ano < anoActual) {
            errorSpan3.style.display = 'block';
            return;
        }else errorSpan3.style.display = 'none';
    }else{  errorSpan1.style.display = 'none';
            errorSpan2.style.display = 'none';
            errorSpan3.style.display = 'none';
    }
}

function validarNumeroTarjeta() {
    var numTarjeta = document.getElementById("NumTarj").value;
    var errorSpan1 = document.getElementById('NumTarjError1');
    var errorSpan2 = document.getElementById('NumTarjError2');
 
    // Verificar que se haya ingresado un número de tarjeta
    if (numTarjeta != "") {
        // Verificar la longitud del número de tarjeta (generalmente entre 12 y 19 dígitos)
        if (numTarjeta.length < 12 || numTarjeta.length > 19) {
            errorSpan1.style.display = 'block';
            return;
        }else errorSpan1.style.display = 'none';
        if (isNaN(numTarjeta)) {
            errorSpan2.style.display = 'block';
            return;
        }else{
            errorSpan2.style.display = 'none';
        }
    }else{errorSpan1.style.display = 'none';
          errorSpan2.style.display = 'none';
         } 
}