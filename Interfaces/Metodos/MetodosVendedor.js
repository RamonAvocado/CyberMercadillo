//import { truncate } from "./GeneralMetodos";
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

function truncate(text) {
    const maxLength = 50; // Establece el tamaño máximo
    return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
}

async function CargarProductosVendedor(idUser) {
    console.log("Useriniciado"+idUser);
    try {
        console.log("Entra funcion cargarProductosVendedor");
        const response = await fetch(`${lugarDeEjecucion}/ObtenerProductosVendedor`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idusuario: idUser
            }),
        });
        if (response.ok) {
                //console.log("Texto y todo intro: " + data.productos.Models);
            const data = await response.json();
            console.log(data);
            console.log(data.productos.length);
            const prod = data.productos;
            console.log(prod);
            
            const productosPorPagina = 6;
            const totalPaginas = Math.ceil(prod.length / productosPorPagina);

            // Mostrar los productos de la primera página en la interfaz de usuario
            mostrarProductosVendedor(prod.slice(0, productosPorPagina));
            
            //mostrarProductosDestacados(productos.slice(0, productosPorPagina));
            generarEnlacesPaginacion(totalPaginas,idUser);
            //generarEnlacesPaginacionDest(totalPaginas);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

async function CargarProductosVendedorGuardados(idUser) {
    console.log("Useriniciado"+idUser);
    try {
        console.log("Entra funcion cargarProductosVendedor");
        const response = await fetch(`${lugarDeEjecucion}/ObtenerProductosVendedorGuardados`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idusuario: idUser
            }),
        });
        if (response.ok) {
                //console.log("Texto y todo intro: " + data.productos.Models);
            const data = await response.json();
            console.log(data);
            console.log(data.productos.length);
            const prod = data.productos;
            console.log(prod);

            const productosPorPaginaGuardados = 4;
            const totalPaginasGuardados = Math.ceil(prod.length / productosPorPaginaGuardados);

            mostrarProductosGuardadosVendedor(prod.slice(0, productosPorPaginaGuardados))
            // Generar enlaces de paginación
            
            generarEnlacesPaginacionGuardados(totalPaginasGuardados,5);
            //generarEnlacesPaginacionDest(totalPaginas);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
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

function generarEnlacesPaginacionGuardados(totalPaginas,idUsuarioIniciado) {
    const paginasContainer = document.getElementById('paginas-guardado');
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
            await cargarProductosPorPaginaGuardados(i,idUsuarioIniciado);
        });
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
            const productos = data.productos;

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

async function cargarProductosPorPaginaGuardados(numeroPagina,idUsuarioIniciado) {
    const productosPorPagina = 4;

    try {

        console.log('ID del usuario seleccionado:', idUsuarioIniciado);
        // Realizar una solicitud GET al backend para obtener todos los productos del vendedor
        const response = await fetch(`${lugarDeEjecucion}/ObtenerProductosVendedorGuardados`,{
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
            const productos = data.productos;

            const inicio = (numeroPagina - 1) * productosPorPagina;
            const fin = numeroPagina * productosPorPagina;
            const productosPagina = productos.slice(inicio, fin);

            mostrarProductosGuardadosVendedor(productosPagina);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
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
        const response = await fetch(`${lugarDeEjecucion}/eliminarProductoSeleccionado`,{
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


/*function generarEnlacesPaginacion(totalPaginas,idUsuarioIniciado) {


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
            await 
            (i,idUsuarioIniciado);
        });
    }
}*/
//CargarProductosRecomendados CargarProductosValidacion DEPENDE DE EL
/*en caso de que se tenga que usar este metodo tener en cuenta CargarProductosValidacion
puesto que depende de este y estan en arhivos diferentes*/

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
            <h3>${truncate(producto.nombreproducto)}</h3>
            <p>${producto.precio} €</p>
            <p>${truncate(producto.descripcion)}</p>
        `;

        productCard.addEventListener('dblclick', (event) => {
            irAInfoProducto2(producto.idproducto);
        });
        
        document.addEventListener('click', (event) => {
            const editarBtn = document.getElementById('editarBtn');
            const allProductCards = document.querySelectorAll('.product-card');
            const selectedProductCard = document.querySelector('.product-card.selected');

            // Si se hace clic fuera de la tarjeta de producto seleccionada
            if (selectedProductCard && !selectedProductCard.contains(event.target)) {
                selectedProductCard.classList.remove('selected');
                editarBtn.disabled = true;
                editarBtn.classList.remove('enabled');
            }
        });

        productCard.addEventListener('click', (event) => {
            // Aquí puedes acceder al ID del producto seleccionado (producto.idproducto)
            // Puedes hacer lo que quieras con el ID del producto seleccionado aquí
            idProductoSeleccionado = producto.idproducto;
            console.log('ID del producto seleccionado:', idProductoSeleccionado);
            localStorage.setItem('itemID', idProductoSeleccionado);
            const editarBtn = document.getElementById('editarBtn');
            editarBtn.disabled = false;
            editarBtn.classList.add('enabled');

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
        });
        
        container.appendChild(productCard);
    });
}

function mostrarProductosGuardadosVendedor(productos) {
    //const productos = respuesta.productos.Models;
    const container = document.querySelector('.saved-product-seller');
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
            <h3>${truncate(producto.nombreproducto)}</h3>
            <p>${producto.precio} €</p>
            <p>${truncate(producto.descripcion)}</p>
        `;

        productCard.addEventListener('dblclick', (event) => {
            irAInfoProducto2(producto.idproducto);
        });

        document.addEventListener('click', function(event) {
            const productCard = document.querySelector('.product-card');
            const editarBtn = document.getElementById('editarBtn');
            const eliminarBtn = document.getElementById('eliminarBtn');
        
            // Verificar si se hizo clic fuera de la tarjeta del producto
            if (!productCard.contains(event.target) && event.target !== editarBtn && event.target !== eliminarBtn) {
                // Deseleccionar la tarjeta del producto y deshabilitar los botones de editar y eliminar
                productCard.classList.remove('selected');
                editarBtn.disabled = true;
                editarBtn.classList.remove('enabled');
                eliminarBtn.disabled = true;
                eliminarBtn.classList.remove('enabled');
            }
        });

        productCard.addEventListener('click', (event) => {
            // Aquí puedes acceder al ID del producto seleccionado (producto.idproducto)
            // Puedes hacer lo que quieras con el ID del producto seleccionado aquí
            idProductoSeleccionado = producto.idproducto;
            console.log('ID del producto seleccionado >3:', idProductoSeleccionado);
            localStorage.setItem('itemID', idProductoSeleccionado);
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

function irAInfoProducto2(productoParaInfo) {
    // Redirigir a la página de InfoProducto.html con el parámetro del producto
    window.location.href = `InfoBasicaProducto.html?id=${productoParaInfo}`;

    // Ocultar el botón después de la redirección
    const historialBtn = document.getElementById('historialBtnInfoProd');
    historialBtn.style.display = 'none';
}

async function mostrarProd(idProductoSeleccionado) {
    try {
        console.log('ID del producto seleccionado:', idProductoSeleccionado);
        const response = await fetch(`${lugarDeEjecucion}/buscarProductoSeleccionado`,{
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
            //const productos = data.result.Models;
            const prod = data.producto;
            console.log(prod);
            var tipoUsuarioLogueado = localStorage.getItem('tipoUserID');
            var botonValidar = document.getElementById('ValidarProdGua');

            // Verificar si el botón existe
            if (botonValidar && tipoUsuarioLogueado == "tecnico") {
                // Ocultar el botón estableciendo su propiedad de visualización en "none"
                botonValidar.style.display = "none";
            }
            
                const container = document.querySelector('.recommended-products');

                const imagenes = prod.imagenes.split(' ');
                const primeraImagen = imagenes[0];

                // Crear elementos para mostrar el producto
                const productCard = document.createElement('div');
                productCard.classList.add('product-element');

                // Agregar la imagen principal del producto
                const imagenPrincipal = document.createElement('img');
                imagenPrincipal.src = primeraImagen;
                imagenPrincipal.alt = prod.nombreproducto;
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

                document.getElementById('nombre').value = prod.nombreproducto;
                document.getElementById('precio').value = prod.precio;
                document.getElementById('categoria').value = prod.categoria;
                document.getElementById('descripcion').value = prod.descripcion;
                document.getElementById('cantidad').value = prod.cantidad;
                document.getElementById('nuevo-url-imagen').value = prod.imagenes; 
                document.getElementById('valoracionHProd').value = prod.puntuacionEco;             
            //}
        } else {
            console.error('Error al obtener los detalles del producto:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
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

//PODRIA IR EN GENERAL +++++ NO DEPENDE DE NADIE
function irRegistroVendedor() {

    window.location.href = `./NuevoUsuarioVendedor.html`;
    localStorage.setItem('tipoUsuRegistro', "vendedor");
    console.log("vendedor");
}




//PODRIA IR EN GENERAL +++++
/*function irAInfoProducto2(productoParaInfo) {
    // Redirigir a la página de InfoProducto.html con el parámetro del producto
    window.location.href = `InfoBasicaProducto.html?id=${productoParaInfo}`;

    // Ocultar el botón después de la redirección
    const historialBtn = document.getElementById('historialBtnInfoProd');
    historialBtn.style.display = 'none';
}*/

//PODRIA IR EN GENERAL +++++
/*async function mostrarProd(idProductoSeleccionado) {
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
}*/

//PODRIA IR EN GENERAL +++++
/*function mostrarResultado(resultado) {
    var resultadosDiv = document.getElementById('resultados');
    //Esto es la respuesta que a accedido al Controlador Program y lo muestra por pantalla en la Pagina Principal
    resultadosDiv.innerHTML = `<p>Resultado: ${resultado}</p>`;
}*/


/*async function agregarUsuarioVendedor(TipoUsuarioRegistrado){
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
}*/