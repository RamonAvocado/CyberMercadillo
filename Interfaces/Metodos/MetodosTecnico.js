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


async function CargarProductosValidacion() {
    try {
        // Realizar una solicitud GET al backend para obtener todos los productos del vendedor
        const response = await fetch(`${lugarDeEjecucion}/ObtenerProductosAValidar`);
        if (response.ok) {
            const data = await response.json();
            //const productos = data.productos.Models;
            const prod = data.objeto;
            console.log(prod);
            const productosPorPagina = 6;
            //const totalPaginas = Math.ceil(productos.length / productosPorPagina);
            const totalPaginas = Math.ceil(prod.length / productosPorPagina);
            // Mostrar los productos de la primera página en la interfaz de usuario
            //mostrarProductosVendedor(prod.slice(0, productosPorPagina));
            mostrarProductosParaValidar(prod.slice(0, productosPorPagina));

            // Generar enlaces de paginación
            generarEnlacesPaginacionTecnico(totalPaginas);
            //generarEnlacesPaginacion(totalPaginas);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

async function CargarProductosValidacionTecnico(idUser) {
    console.log("Useriniciado"+idUser);
    try {
        // Realizar una solicitud GET al backend para obtener todos los productos del vendedor
        const response = await fetch(`${lugarDeEjecucion}/ObtenerProductosAValidarTecnicoConcreto`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idusuario: idUser
            }),
        });
        if (response.ok) {
            const data = await response.json();
            const prod = data.objeto;
            console.log(prod);
            const productosPorPagina = 6;
            const totalPaginas = Math.ceil(prod.length / productosPorPagina);
            // Mostrar los productos de la primera página en la interfaz de usuario
            mostrarProductosParaValidarTecnico(prod.slice(0, productosPorPagina));

            // Generar enlaces de paginación
            generarEnlacesPaginacionDelTecnico(totalPaginas,idUser);
            //generarEnlacesPaginacion(totalPaginas);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

function generarEnlacesPaginacionTecnico(totalPaginas) {
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
            await cargarProductosPorPaginaTecnico(i);
        });
    }
}

function generarEnlacesPaginacionDelTecnico(totalPaginas,idUsu) {
    const paginasContainer = document.getElementById('paginas2');
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
            await cargarProductosPorPaginaTecnicoConcreto(i,idUsu);
        });
    }
}

async function cargarProductosPorPaginaTecnico(numeroPagina,idUsuarioIniciado) {
    const productosPorPagina = 6;

    try {

        console.log('ID del usuario seleccionado:', idUsuarioIniciado);
        // Realizar una solicitud GET al backend para obtener todos los productos del vendedor
        const response = await fetch(`${lugarDeEjecucion}/ObtenerProductosAValidar`);

        if (response.ok) {
            const data = await response.json();
            const productos = data.objeto;

            const inicio = (numeroPagina - 1) * productosPorPagina;
            const fin = numeroPagina * productosPorPagina;
            const productosPagina = productos.slice(inicio, fin);

            mostrarProductosParaValidar(productosPagina);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

async function cargarProductosPorPaginaTecnicoConcreto(numeroPagina,idUser) {
    const productosPorPagina = 6;

    try {

        console.log('ID del usuario seleccionado:', idUsuarioIniciado);
        // Realizar una solicitud GET al backend para obtener todos los productos del vendedor
        const response = await fetch(`${lugarDeEjecucion}/ObtenerProductosAValidarTecnicoConcreto`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idusuario: idUser
            }),
        });
        if (response.ok) {
            const data = await response.json();
            const productos = data.objeto;

            const inicio = (numeroPagina - 1) * productosPorPagina;
            const fin = numeroPagina * productosPorPagina;
            const productosPagina = productos.slice(inicio, fin);

            mostrarProductosParaValidarTecnico(productosPagina);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
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
            await cargarProductosPorPagina(i,idUsuarioIniciado);
        });
    }
}*/
//CargarProductosValidacion depende de este metodo

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
            <h3>${truncate(producto.nombreproducto)}</h3>
            <p>${producto.precio} €</p>
            <p>${truncate(producto.descripcion)}</p>
        `;

        productCard.addEventListener('dblclick', (event) => {
            irAInfoProducto2(producto.idproducto);
        });

        document.addEventListener('click', (event) => {
            const validarBtn = document.getElementById('validarBtn');
        
            // Verifica si el clic no fue dentro de un productCard
            if (!event.target.closest('.product-card')) {
                const allProductCards = document.querySelectorAll('.product-card');
                allProductCards.forEach(card => card.classList.remove('selected'));
                // Deshabilita los botones
                validarBtn.disabled = true;
                // Quita la clase 'enabled' si está presente
                validarBtn.classList.remove('enabled');
            }
        });
        productCard.addEventListener('click', (event) => {
            // Aquí puedes acceder al ID del producto seleccionado (producto.idproducto)
            // Puedes hacer lo que quieras con el ID del producto seleccionado aquí
            idProductoSeleccionado = producto.idproducto;
            console.log('ID del producto seleccionado:', idProductoSeleccionado);
            
            const validarBtn = document.getElementById('validarBtn');
            validarBtn.disabled = false;
            validarBtn.classList.add('enabled');

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
        });

        container.appendChild(productCard);
    });
}

function mostrarProductosParaValidarTecnico(productos) {
    //const productos = respuesta.productos.Models;
    const container = document.querySelector('.validation-products-tecnico');
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
            const eliminarBtn = document.getElementById('eliminarBtn');
            const desasignarBtn = document.getElementById('desasignarBtn');
            const validarVddBtn = document.getElementById('validarVddBtn');
            const editarBtn = document.getElementById('editarBtn');
        
            // Verifica si el clic no fue dentro de un productCard
            if (!event.target.closest('.product-card')) {
                // Deshabilita los botones
                const allProductCards = document.querySelectorAll('.product-card');
                allProductCards.forEach(card => card.classList.remove('selected'));

                eliminarBtn.disabled = true;
                desasignarBtn.disabled = true;
                validarVddBtn.disabled = true;
                editarBtn.disabled = true;
                // Quita la clase 'enabled' si está presente
                eliminarBtn.classList.remove('enabled');
                desasignarBtn.classList.remove('enabled');
                validarVddBtn.classList.remove('enabled');
                editarBtn.classList.remove('enabled');
            }
        });

        productCard.addEventListener('click', (event) => {
            // Aquí puedes acceder al ID del producto seleccionado (producto.idproducto)
            // Puedes hacer lo que quieras con el ID del producto seleccionado aquí
            idProductoSeleccionado = producto.idproducto;
            console.log('ID del producto seleccionado:', idProductoSeleccionado);
            localStorage.setItem('itemID', idProductoSeleccionado);
            /*const validarBtn = document.getElementById('validarBtn');
            validarBtn.disabled = false;
            validarBtn.classList.add('enabled');*/

            const eliminarBtn = document.getElementById('eliminarBtn');
            eliminarBtn.disabled = false;
            eliminarBtn.classList.add('enabled');

            const desasignarBtn = document.getElementById('desasignarBtn');
            desasignarBtn.disabled = false;
            desasignarBtn.classList.add('enabled');

            const validarVddBtn = document.getElementById('validarVddBtn');
            validarVddBtn.disabled = false;
            validarVddBtn.classList.add('enabled');

            const editarBtn = document.getElementById('editarBtn');
            editarBtn.disabled = false;
            editarBtn.classList.add('enabled');

            const allProductCards = document.querySelectorAll('.product-card');
            allProductCards.forEach(card => card.classList.remove('selected'));

            // Agrega la clase 'selected' al elemento seleccionado
            productCard.classList.add('selected');
            event.stopPropagation();

            document.getElementById('validarBtn').addEventListener('click', () => {
                const validarBtn = document.getElementById('validarBtn');
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

function irAInfoProducto2(productoParaInfo) {
    // Redirigir a la página de InfoProducto.html con el parámetro del producto
    window.location.href = `InfoBasicaProducto.html?id=${productoParaInfo}`;

    // Ocultar el botón después de la redirección
    const historialBtn = document.getElementById('historialBtnInfoProd');
    historialBtn.style.display = 'none';
}

async function validarProd(idUsuarioIniciado) {
    try {
        console.log('ID del producto seleccionado :', idProductoSeleccionado);
        //const response = await fetch('http://localhost:5169/buscarProductoX');

        //const response = await fetch(`http://localhost:5169/buscarProductoX?idProductoSeleccionado=${idProductoSeleccionado}`);
        const response = await fetch(`${lugarDeEjecucion}/validarProductoSeleccionado`,{
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
            //alert("Producto validado correctamente")
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

async function asignarProd(idUsuarioIniciado) {
    try {
        console.log('ID del producto seleccionado :', idProductoSeleccionado);
        //const response = await fetch('http://localhost:5169/buscarProductoX');

        //const response = await fetch(`http://localhost:5169/buscarProductoX?idProductoSeleccionado=${idProductoSeleccionado}`);
        const response = await fetch(`${lugarDeEjecucion}/asignarProducto`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idproducto: idProductoSeleccionado,
                idusuario: idUsuarioIniciado
            }),
        });

        if (response.ok) {
            const jsonResponse = await response.json(); // Convertir la respuesta a JSON
            console.log(jsonResponse);

            console.log('Producto validado exitosamente:', idProductoSeleccionado);
            console.log(jsonResponse.mensaje);
            //alert("Producto validado correctamente")
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

async function desasignarProd() {
    try {
        console.log('ID del producto seleccionado :', idProductoSeleccionado);
        const response = await fetch(`${lugarDeEjecucion}/DesasignarProducto`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idproducto: idProductoSeleccionado
            }),
        });

        if (response.ok) {
            const jsonResponse = await response.json(); 
            console.log(jsonResponse);

            console.log('Producto desasignado exitosamente:', idProductoSeleccionado);
            console.log(jsonResponse.mensaje);
            //alert("Producto validado correctamente")
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
