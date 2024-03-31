
async function buscar() {
    var searchTerm = document.getElementById('searchInput').value;

    // Realizar una solicitud POST al backend con la información de búsqueda
    try {
        const response = await fetch('http://localhost:5169/BuscarProducto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchTerm: searchTerm }),
        });

        if (response.ok) {
            const data = await response.json();
            mostrarResultado(data.resultado);  // Llama a una función para mostrar el resultado en la página
        } else {
            console.error('Error en la solicitud al backend:', response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

/*
    NO BORRAR    

    Esto es lo que había antes en PaginaPrincipal, NO BORRAR, lo usaré más tarde,
    ya que tenemos que hacer bien la pagina principal y más cosas


        <h1>Búsqueda de Productos</h1>
        <input type="text" id="searchInput" placeholder="Ingrese su búsqueda...">
        <button onclick="buscar()">Buscar</button>
        <div id ="resultados"></div>
*/

function redirigirABusqueda(){
    window.location.href = "BuscarProducto.html"
}

function redirigirArandom(){
    window.location.href = "Random.html"
}


function volverPaginaAnterior(){
    window.history.back();
}

// Función para mostrar el resultado en la página
function mostrarResultado(resultado) {
    var resultadosDiv = document.getElementById('resultados');
    //Esto es la respuesta que a accedido al Controlador Program y lo muestra por pantalla en la Pagina Principal
    resultadosDiv.innerHTML = `<p>Resultado: ${resultado}</p>`;
}


//Método agragar producto desde el frontend
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
                const response = await fetch('http://localhost:5169/AgregarProducto', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nombre: nombre,
                        precio: precio,
                        categoria: categoria,
                        descripcion: descripcion,
                        img: img,
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