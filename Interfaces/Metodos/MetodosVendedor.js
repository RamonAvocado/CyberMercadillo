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


async function CargarProductosVendedor(idUsuarioIniciado) {
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
            
            const productosPorPagina = 6;
            const totalPaginas = Math.ceil(productos.length / productosPorPagina);

            // Mostrar los productos de la primera página en la interfaz de usuario
            mostrarProductosVendedor(productos.slice(0, productosPorPagina));

            // Generar enlaces de paginación
            generarEnlacesPaginacion(totalPaginas,idUsuarioIniciado);
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}


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
        
        productCard.addEventListener('click', (event) => {
            // Aquí puedes acceder al ID del producto seleccionado (producto.idproducto)
            // Puedes hacer lo que quieras con el ID del producto seleccionado aquí
            idProductoSeleccionado = producto.idproducto;
            console.log('ID del producto seleccionado:', idProductoSeleccionado);
            
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


function irRegistroVendedor() {

    window.location.href = `./NuevoUsuarioVendedor.html`;
    localStorage.setItem('tipoUsuRegistro', "vendedor");
    console.log("vendedor");
}//"vendedor"


async function agregarUsuarioVendedor(TipoUsuarioRegistrado){
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
                mostrarResultado(data.resultado); 
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
}