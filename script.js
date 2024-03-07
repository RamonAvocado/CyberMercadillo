async function buscar() {
    var searchTerm = document.getElementById('searchInput').value;

    // Realizar una solicitud POST al backend con la información de búsqueda
    try {
        const response = await fetch('http://localhost:5169/producto', {
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

// Función para mostrar el resultado en la página
function mostrarResultado(resultado) {
    var resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = `<p>Resultado: ${resultado}</p>`;
}