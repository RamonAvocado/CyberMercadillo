
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

function gestionarValorIDProduct(valor) {
    if (valor === -1) {
        // Si se pasa -1, devolver el valor almacenado
        return idProductoSeleccionado;
    } else {
        // Si se pasa un valor distinto de -1, almacenarlo y devolver el mismo valor
        idProductoSeleccionado = valor;
        return idProductoSeleccionado;
    }
}

async function agregarProducto(idUsuarioIniciado)
{
        document.getElementById('agregarProductoForm2').addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(event.target);
            var requestBody = {
                nombre: formData.get('nombreProd'),
                precio: formData.get('precioProd'),
                categoria: formData.get('categoriaProd'),
                descripcion: formData.get('descripcionProd'),
                img: formData.get('imgProd'),
                cantidad: parseInt(formData.get('cantProd')),
                idvendedor: 5,
                validado: false,
                guardado: false,
            };

            console.log('ID del usuario seleccionado:', idUsuarioIniciado);
            // Realizar una solicitud GET al backend para obtener todos los productos del vendedor
            
            try {

                const response = await fetch(`${lugarDeEjecucion}/AgregarProducto`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });
        
                if (response.ok) {
                    //const data = await response.json();
                    console.log('Producto creado correctamente');
                    //mostrarResultado(data.resultado); 
                    window.location.reload();
                } else {
                    console.error('Error al crear el producto:', response.statusText);
                }
            } catch (error) {
                console.error('Error inesperado:', error);
            }
            //alert("Error crear Producto")
            //window.location.reload();
        });
}

async function validarProductoGuardado(idProductoSeleccionado){
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('idUser');
        const response = await fetch(`${lugarDeEjecucion}/validarProductoGuardado`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idproducto: idProductoSeleccionado
            }),
        });

        if (response.ok) {
            //const data = await response.json();
            //console.log("Producto Validado"+data.producto.idproducto);
            //alert("Producto a Validar");
            window.location.href = `./PaginaVendedor.html`
        } else {
            console.error('Error al validar producto:', response.statusText);

        }
        //window.location.href = `./EditarProducto.html?idUser=${userId}`

    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

async function guardarProducto(idUsuarioIniciado)
{
        document.getElementById('agregarProductoForm2').addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(event.target);
            var requestBody = {
                nombre: formData.get('nombreProd'),
                precio: formData.get('precioProd'),
                categoria: formData.get('categoriaProd'),
                descripcion: formData.get('descripcionProd'),
                img: formData.get('imgProd'),
                cantidad: parseInt(formData.get('cantProd')),
                idvendedor: 5,
                validado: false,
                guardado: true,
            };
            // Realizar una solicitud GET al backend para obtener todos los productos del vendedor
            
            try {

                const response = await fetch(`${lugarDeEjecucion}/AgregarProducto`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });
        
                if (response.ok) {
                    //const data = await response.json();
                    console.log('Producto guardado correctamente');
                    //mostrarResultado(data.resultado); 
                    window.location.reload();
                } else {
                    console.error('Error al guardar el producto:', response.statusText);
                }
            } catch (error) {
                console.error('Error inesperado:', error);
            }
            //alert("Error crear Producto")
            //window.location.reload();
        });
}


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
                const response = await fetch(`${lugarDeEjecucion}/AgregarProducto`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nombreproducto: nombre,
                        precio: precio,
                        categoria: categoria,
                        descripcion: descripcion,
                        imagenes: img,
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

async function ActualizarProducto(idProductoSeleccionado,idUsuarioIniciado)
{
        document.getElementById('agregarProductoForm7').addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(event.target);
         
            var requestBody = {
                precio: formData.get('precio'),
                descripcion: formData.get('descripcion'),
                cantidad: parseInt(formData.get('cantidad')),
                idproducto: idProductoSeleccionado,
            };

            try {
                const response = await fetch(`${lugarDeEjecucion}/ActualizarProducto`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });
        
                if (response.ok) {
                    //const data = await response.json();
                    console.log('Producto actualizado correctamente');
                    //mostrarResultado(data.resultado); 

                    window.location.reload();
                } else {
                    console.error('Error al actualizar el producto:', response.statusText);
                }
            } catch (error) {
                console.error('Error inesperado:', error);
            }
            //alert("Producto actualizado correctamente")
            window.location.reload();
        });
}

async function ActualizarProductoGuardado(idProductoSeleccionado,idUsuarioIniciado)
{
        document.getElementById('agregarProductoForm7').addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(event.target);
         
            var requestBody = {
                nombre: formData.get('nombre'),
                precio: formData.get('precio'),
                categoria: formData.get('categoria'),
                descripcion: formData.get('descripcion'),
                img: formData.get('nuevo-url-imagen') ?? formData.get('imagenProducto'),
                cantidad: parseInt(formData.get('cantidad')),
                idproducto: idProductoSeleccionado,
            };

            try {
                const response = await fetch(`${lugarDeEjecucion}/ActualizarProductoGuardado`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });
        
                if (response.ok) {
                    //const data = await response.json();
                    console.log('Producto actualizado correctamente');
                    //mostrarResultado(data.resultado); 

                    window.location.reload();
                } else {
                    console.error('Error al actualizar el producto:', response.statusText);
                }
            } catch (error) {
                console.error('Error inesperado:', error);
            }
            //alert("Producto actualizado correctamente")
            window.location.reload();
        });
}


async function CargaUnProductoCompra(){
    try{
        // Pillar el ID del producto de la URI
        idUsuarioIniciado = localStorage.getItem('UsuarioID');
        idProductoSeleccionado = localStorage.getItem('itemID')
    

        //solo falta que aqui le pasemos el id del usuario que ha iniciado sesión
        //idUser = 1;
        //console.log(idUser);
        const respuestaDirec = await fetch(`${lugarDeEjecucion}/ObtenerInfoUsuario?idusuario=${idUsuarioIniciado}`);


        // Obtener el producto por ID desde el backend
        const response = await fetch(`${lugarDeEjecucion}/ObtenerProductoPorID?idproducto=${idProductoSeleccionado}`);

        if(response.ok && respuestaDirec.ok){
            const data = await response.json();
            const producto = data.producto;
            console.log(producto); // Verifica la respuesta del servidor
            
            //muestra la información de la dirección correctamente
            const dataDirec = await respuestaDirec.json();
            const usuario = dataDirec.info;
            console.log(usuario); // Verifica la respuesta del servidor

            // Mostrar la información del producto
            mostrarUnProductoCompra(producto, usuario);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado al cargar un producto compra:', error);
    }
}

function mostrarUnProductoCompra(producto, usuario) {
    // Separar las URL de las imágenes
    const imagenes = producto.imagenes.split(' ');
    const primeraImagen = imagenes[0];

    const productImg = document.querySelector('.product-container-compra img');
    const productDescrip = document.querySelector('.product-container-compra h1');

    const productName = document.querySelector('.header h1');

    //const arrivalDate = document.querySelector('.product-container-compra p');
    const shippingInfo = document.querySelector('.shipping-info p');
    const paymentInputs = document.querySelectorAll('.payment-info input');
    const totalCost = document.querySelector('.total-cost');
    const cant = document.querySelector('.cantidad');
    idProductoCantidadSelec = localStorage.getItem('itemCantSelec')


    // Llenar la información del producto con los datos obtenidos del servidor
    productImg.src = primeraImagen; // Suponiendo que el servidor envía la URL de la imagen
    console.log(producto.descripcion);
    productDescrip.textContent = `Descripción: ${producto.descripcion} `;
    productName.textContent =  `Compra ahora: ${producto.nombreproducto} `;
    //arrivalDate.textContent = `Llegada el: ${respuesta.fecha_llegada}`;
    shippingInfo.textContent = `${usuario.direccion}`;
    totalCost.textContent = `Total: ${(producto.precio * idProductoCantidadSelec)} €`; // Suponiendo que el servidor envía el precio
    cant.textContent = `Cantidad Seleccionada: ${idProductoCantidadSelec} ${producto.nombreproducto}`;

    // Si el servidor envía más información sobre el pago, puedes llenarla aquí
    if (usuario.numeroTarjeta != null) {
        paymentInputs[0].value = usuario.numeroTarjeta;
        paymentInputs[1].value = usuario.fechaCaducidad;
        paymentInputs[2].value = usuario.CVV;
    }
}

async function CargaUnProducto(){
    try{
        idProductoSeleccionado = localStorage.getItem('itemID');
        const response = await fetch(`${lugarDeEjecucion}/ObtenerProductoPorID?idproducto=${idProductoSeleccionado}`);

        if(response.ok){
            const data = await response.json();
            var usuarioLogueado = localStorage.getItem('UsuarioID');
            var tipoUsuarioLogueado = localStorage.getItem('tipoUserID');
            console.log(usuarioLogueado);
            if (usuarioLogueado && tipoUsuarioLogueado == "usuario") {
                mostrarUnProducto(data);
            } else {
                mostrarUnProductoNoLogeado(data);
            }
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

    //guardo la cantidad
    localStorage.setItem('itemCant', producto.cantidad);
    idProductoCantidad = localStorage.getItem('itemCant');

    localStorage.setItem('categoriaSeleccionada', categoriaSelect); 

    // Separar las URL de las imágenes
    const imagenes = producto.imagenes.split(' ');
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
        <h2>${producto.nombreproducto}</h2>
        <p>${producto.precio} €</p>
        <p> Acerca del producto: </p>
        <p>${producto.descripcion}</p>
    `;
    productInfo.style.margin = '40px';
    productInfo.style.fontSize = '22px';
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
    
    localStorage.setItem('itemCantSelec',1);

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

        // Redirigir a la página de compra del producto con el ID del producto en la URI
        window.location.href = `./CompraProducto.html`;
    });

    selectCantidad.addEventListener('change', function() {
        const cantidadSeleccionada = parseInt(selectCantidad.value);
        localStorage.setItem('itemCantSelec', cantidadSeleccionada);
        console.log("Cantidad seleccionada:", cantidadSeleccionada);
        // Aquí puedes almacenar la cantidad seleccionada en una variable, en el local storage, o realizar cualquier otra acción que desees.
    });

}

function mostrarUnProductoNoLogeado(respuesta) {
    const producto = respuesta.producto;
    const container = document.querySelector('.product-container');
    container.innerHTML = '';

    //guardo la cantidad
    localStorage.setItem('itemCant', producto.cantidad);
    idProductoCantidad = localStorage.getItem('itemCant');

    localStorage.setItem('categoriaSeleccionada', categoriaSelect); 

    // Separar las URL de las imágenes
    const imagenes = producto.imagenes.split(' ');
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
        <h2>${producto.nombreproducto}</h2>
        <p>${producto.precio} €</p>
        <p> Acerca del producto: </p>
        <p>${producto.descripcion}</p>
    `;
    productInfo.style.margin = '40px';
    productInfo.style.fontSize = '22px';
    productCard.appendChild(productInfo);



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
}

async function CargaUnProductoBasico(){
    try{
        //pillar el id
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        console.log("id del producto es" + productId);
        const response = await fetch(`${lugarDeEjecucion}/ObtenerProductoPorID?idproducto=${productId}`);

        if(response.ok){
            const data = await response.json();
            console.log(data);
            mostrarUnProductoBasico(data);
        } else{
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

function mostrarUnProductoBasico(respuesta) {
    const producto = respuesta.producto;
    const container = document.querySelector('.product-container');
    container.innerHTML = '';

    // Separar las URL de las imágenes
    const imagenes = producto.imagenes.split(' ');
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
}

//RECOMENDACION DE PRODUCTOS DENTRO DE INFO DE UN PRODUCTO
//PODRIA IR EN GENERAL+++++
async function CargarProductosRecomendadosInfoProd(){
    try {
        // Realizar una solicitud GET al backend para obtener los 6 primeros productos
        const response = await fetch(`${lugarDeEjecucion}/ObtenerProductosRecomendados`);
        if (response.ok) {
            const data = await response.json();
            const productos = data.productos;

            const productosPorPagina = 8;
            const totalPaginas = Math.ceil(productos.length / productosPorPagina);

            // Mostrar los productos de la primera página en la interfaz de usuario
            mostrarProductosRecomendados(productos, localStorage.getItem('categoria'), productosPorPagina);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}