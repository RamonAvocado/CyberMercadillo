using CyberMercadillo.Entities;
using CyberMercadillo.BusinessLogic;

public class ComandoBusqueda : IComando{
        private Tienda tienda;
        private string searchTerm;
        private int idBuscado;

        public ComandoBusqueda(Tienda tienda, string searchTerm, int idBuscado)
        {
            this.tienda = tienda;
            this.searchTerm = searchTerm;
            this.idBuscado = idBuscado;
        }

        public List<Producto> Ejecutar()
        {
            return tienda.GetProductosBusqueda(searchTerm, idBuscado);
        }
}
