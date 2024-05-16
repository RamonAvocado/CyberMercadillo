using CyberMercadillo.Entities;
using CyberMercadillo.BusinessLogic;

namespace CyberMercadillo.BusinessLogic{ 
    public class ComandoBusqueda : IComando{
        private readonly Tienda _tienda;
        private readonly string _searchTerm;
        private readonly int _idBuscado;

        public ComandoBusqueda(Tienda tienda, string searchTerm, int idBuscado)
        {
            _tienda = tienda;
            _searchTerm = searchTerm;
            _idBuscado = idBuscado;
        }

        public void Ejecutar()
        {
           // _tienda.BuscarProductos(searchTerm, idBuscado);
        }
    }
}