
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
                idvendedor: idUsuarioIniciado,
                validado: false,
                guardado: false,
                puntuacionHuella: parseInt(formData.get('valoracionHProd'))
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
                idvendedor: idUsuarioIniciado,
                validado: false,
                guardado: true,
                puntuacionHuella: parseInt(formData.get('valoracionHProd'))
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
            var imagen = localStorage.getItem('UrlImg');
            var img2 = formData.get('nuevo-url-imagen');
            var requestBody = {
                nombre: formData.get('nombre'),
                precio: formData.get('precio'),
                categoria: formData.get('categoria'),
                descripcion: formData.get('descripcion'),
                img: imagen ?? formData.get('imagenProducto'),
                cantidad: parseInt(formData.get('cantidad')),
                idproducto: idProductoSeleccionado,
                puntuacionHuella: parseInt(formData.get('valoracionHProd'))
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
        <p> Puntuación de Huella Ecológica:  ${producto.puntuacionEco}</p style="font-size: 18px;">
    `;
    productInfo.style.margin = '40px';
    productInfo.style.fontSize = '22px';
    productCard.appendChild(productInfo);

    // Crear el contenedor de botones
    const productButtons = document.createElement('div');
    productButtons.classList.add('product-buttons');

    /* Agregar botones y select al contenedor de botones
    const comprarButton = document.createElement('button');
    comprarButton.classList.add('comprarButton');
    comprarButton.textContent = 'Comprar';
    productButtons.appendChild(comprarButton);*/

    const carritoButton = document.createElement('button');
    carritoButton.classList.add('carritoButton');
    carritoButton.textContent = 'Añadir al Carrito de Compra';
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

    // Agregar el producto al carrito de la compra
    carritoButton.addEventListener('click', function() {
        // Voy a añadir al carrito de compra por el id del usuario y el id del producto
        idUsuarioIniciado = localStorage.getItem('UsuarioID');
        idProductoSeleccionado = localStorage.getItem('itemID');
        idProductoCantidadSelec = localStorage.getItem('itemCantSelec');

        //los convierto a int
        idUsuarioIniciado= parseInt(idUsuarioIniciado);
        idProductoSeleccionado= parseInt(idProductoSeleccionado);
        idProductoCantidadSelec= parseInt(idProductoCantidadSelec);

        añadirCarritoCompra(idUsuarioIniciado, idProductoSeleccionado, idProductoCantidadSelec);
    });


    selectCantidad.addEventListener('change', function() {
        const cantidadSeleccionada = parseInt(selectCantidad.value);
        localStorage.setItem('itemCantSelec', cantidadSeleccionada);
        console.log("Cantidad seleccionada:", cantidadSeleccionada);
        // Aquí puedes almacenar la cantidad seleccionada en una variable, en el local storage, o realizar cualquier otra acción que desees.
    });
}
async function añadirCarritoCompra(idusuario, idproducto, cantProducto){

    var requestBody = {
        idusuario: idusuario,
        idproducto: idproducto,
        cantProducto :  cantProducto,
    };

    try {//
        const response = await fetch(`${lugarDeEjecucion}/AñadirAlCarritoCompra`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            const data = await response.json();
            
            if(data.guay == true){
                //console.log('Producto añadido al carrito de compra');

                var titulo = "¡Producto añadido!";
                var mensaje = "El producto ha sido añadido al carrito de compra.";
            
                // Mostrar la ventana emergente con el título y el mensaje
                alert(titulo + "\n\n" + mensaje);

            }else {
                var titulo = "¡Producto en carrito!";
                var mensaje = "El producto ya está en el carrito de compra.";
            
                // Mostrar la ventana emergente con el título y el mensaje
                alert(titulo + "\n\n" + mensaje);
                
                //console.error("El usuario ya tiene este producto en el carrito de compra, así que no lo guardo");
            }

        } else {
            console.error('Problema con la solicitud a servicios: ', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

async function CargaCarritoCompra(){
    try{
        idUsuarioIniciado = localStorage.getItem('UsuarioID');
        idUsuarioIniciado= parseInt(idUsuarioIniciado);
        console.log("usuario: " +idUsuarioIniciado);

        var requestBody = {
            idusuario: idUsuarioIniciado,
        };

        //obtengo el carrito de compra, los id's y su cantidad
        const response = await fetch(`${lugarDeEjecucion}/ObtenerCarritoCompra`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        //obtengo la información del usuario para la tarjeta de crédito
        const respuestaUser = await fetch(`${lugarDeEjecucion}/ObtenerInfoComprador`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if(response.ok  && respuestaUser.ok){
            const data = await response.json();
            const carritoCompra = data.carritoCompra;
            //console.log("carrito compra: "+carritoCompra);
            console.log(carritoCompra);

            const dataDirec = await respuestaUser.json();
            const usuario = dataDirec.info;

            //le paso la información a esta función para recuperar los productos
            mostrarCarritoCompra(carritoCompra,usuario)

        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado al cargar el carrito de compra:', error);
    }
}

async function mostrarCarritoCompra (carritoCompra, usuario){
    const productsContainer = document.querySelector('.products-wrapper');
    let totalPrecio = 0;
    let descripc = "";

    if(carritoCompra.length == 0){
        //creo el elemento div y luego añado un p para decir que no hay productos
        const Noproduct = document.createElement('h1');

        Noproduct.textContent = `No hay productos en el carrito de compra`;
        Noproduct.style.fontSize = '30px';
        productsContainer.appendChild(Noproduct);
        
    }else{

        //para cada producto, quiero hacer mostrarUnProductoCompra
        for (const item of carritoCompra) {
            // Hacer una solicitud al servidor para obtener la información completa del producto por su ID
            const response = await fetch(`${lugarDeEjecucion}/ObtenerProductoPorID?idproducto=${item.idproducto}`);

            if (response.ok) {
                const data = await response.json();
                const producto = data.producto;

                // Mostrar la información del producto
                mostrarUnProductoCompra(producto, item, productsContainer);
                totalPrecio += producto.precio * item.cantidad ;

                //por si solo hay un producto, que no salga la coma
                if (carritoCompra.length == 1) {
                    descripc += item.cantidad + " " + producto.nombreproducto;
                } else {
                    descripc += item.cantidad + " " + producto.nombreproducto;
                    if (carritoCompra.indexOf(item) < carritoCompra.length - 1) {
                        descripc += ", ";
                    }
                }
                //console.log(producto.nombreproducto);
            }
        }

    //donde llegan los productos, lo pongo aqui porque tienen que haber productos en el carrito para poder decir el día que llega
    //ya que está puesto a mano el día que llega
    const diaLlegada = document.querySelector('.shipping-info h1');
    diaLlegada.textContent = 'Llegada el 25 de mayo';
    
    }
    const direccionEntre = document.querySelector('.shipping-info p');
    direccionEntre.textContent = `${"Enviar a: " +usuario.direccion}`;


    //información de la tarjeta
    const paymentInputs = document.querySelectorAll('.payment-info input');
    if (usuario.numeroTarjeta != null) {
        paymentInputs[0].value = usuario.numeroTarjeta;
        paymentInputs[1].value = usuario.fechaCaducidad;
        paymentInputs[2].value = usuario.CVV;
    }

    //descripción y precio total
    const ProdSeleccionados = document.querySelector('.ProdSeleccionados');
    ProdSeleccionados.textContent =  `Productos Seleccionados: ${descripc} `;

    const totalCost = document.querySelector('.total-cost');
    totalCost.textContent = `Total: ${totalPrecio} €`;
}

async function GuardarCarritoBDD(){
    await fetch(`${lugarDeEjecucion}/GuardarCarritoBDD`);
}


async function mostrarUnProductoCompra(producto, item, productsContainer) {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product-compra');

    // Crear elementos para la información del producto
    const img = document.createElement('img');
    img.src = producto.imagenes.split(' ')[0]; // Obtener la primera imagen

    const descripcion = document.createElement('div');
    descripcion.classList.add('descripción');
    descripcion.innerHTML = `<h1>${producto.nombreproducto + " " + producto.precio} €</h1>
    <p>Descripción: ${producto.descripcion}</p>
    <h2>Productos Seleccionados: ${item.cantidad} </h2 style="font-size: 18px;">
    <button onclick="aumentarCantidad( ${item.idproducto}, ${item.cantidad}, ${producto.cantidad})">+</button>
    <button onclick="disminuirCantidad(${item.idproducto}, ${item.cantidad})">-</button>
    <button onclick="eliminarProducto(${item.idproducto})">Eliminar</button>`;

    // Añadir elementos al contenedor del producto
    productDiv.appendChild(img);
    productDiv.appendChild(descripcion);
    
    productsContainer.appendChild(productDiv);
}

//botones productos
async function aumentarCantidad(idprod, cantidadSeleccionada, cantidadProducto) {
    console.log("idprod: "+ idprod + " cantidadSeleccionada: " + cantidadSeleccionada +" cantidadProducto: "+ cantidadProducto);
     
   //asi aumento la cantidad seleccionada hasta que ya no haya más productos
    if(cantidadSeleccionada < cantidadProducto){
        cantidadSeleccionada++;
        //le paso los parametros a la función para 
        actualizarCantidad(idprod, cantidadSeleccionada);

    }
    else{
        var titulo = "¡Cantidad limite de este producto!";
        var mensaje = "No existe más stock de este producto";
    
        // Mostrar la ventana emergente con el título y el mensaje
        alert(titulo + "\n\n" + mensaje);
    }
}

function disminuirCantidad(idprod, cantidadSeleccionada) {
    console.log("idprod: "+ idprod + " cantidadSeleccionada: " + cantidadSeleccionada);
     

   //asi disminuyo la cantidad seleccionada
    if(cantidadSeleccionada > 1){
        cantidadSeleccionada--;
        //le paso los parametros a la función para 
        actualizarCantidad(idprod, cantidadSeleccionada);
        //ahora actualizar el carrito con la nueva cantidad

    }
    else{
        //si la cantidad a reducir ya llega a 0
        eliminarProducto(idprod);
    }
}

async function actualizarCantidad(idprod, cantidadSeleccionada){
    try
        {
            var requestBody = {
                idproducto: idprod,
                nuevaCantidad: cantidadSeleccionada,
            };

            const response = await fetch(`${lugarDeEjecucion}/ActualizarCantidadProducto`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if(response.ok){
                console.log("La cantidad del producto ha sido actualizada");
                
                //recargo la página para mostrar la nueva cantidad o si el producto ha sido eliminado
                window.location.href = `./CarritoDeCompra.html`;
            }
        }catch (error) {
            console.error('Error al actualizar la cantidad en el carrito:', error);
        }
}

async function eliminarProducto(idprod) {
    console.log("Eliminar este producto del carrito: "+ idprod);

    try{    
        var requestBody = {
            idproducto: idprod,
        };

        const response = await fetch(`${lugarDeEjecucion}/EliminarProductoDelCarrito`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if(response.ok){
            console.log("El producto ha sido eliminado del carrito");

            var titulo = "¡Producto eliminado!";
            var mensaje = "El producto se ha eliminado del carrito de compra";
            alert(titulo + "\n\n" + mensaje);

            
            //recargo la página para mostrar la nueva cantidad
            window.location.href = `./CarritoDeCompra.html`;
        }
    }catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
    }
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
        <p> Puntuación de Huella Ecológica:  ${producto.puntuacionEco}</p style="font-size: 18px;">
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
        <p> Puntuación de Huella Ecológica:  ${producto.puntuacionEco}</p style="font-size: 18px;">
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

function handleFileSelect(event) {
    const fileInput = event.target;
    const selectedFiles = fileInput.files; // Accede a la lista de archivos seleccionados
    
    if (selectedFiles.length > 0) {
        // Crear un objeto FormData para enviar el archivo al servidor
        const formData = new FormData();
        formData.append('archivo', selectedFiles[0]); // Añadir el primer archivo seleccionado al FormData
        
        // Realizar una solicitud POST al servidor
        fetch('/guardar-archivo', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                console.log('Archivo enviado correctamente.');
            } else {
                console.error('Error al enviar el archivo al servidor.');
            }
        })
        .catch(error => {
            console.error('Error de red:', error);
        });
    } else {
        console.log("No se seleccionó ningún archivo.");
    }
}