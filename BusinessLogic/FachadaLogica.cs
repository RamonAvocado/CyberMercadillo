using CyberMercadillo.Entities;
class FachadaLogica{

    private Tienda tienda;
    public FachadaLogica(){
        tienda = new Tienda();
    }

    public Tienda returnTienda(){
        return tienda;
    }

    public void insertarBusqueda(Busqueda busqueda){
        tienda.Busquedas.Add(busqueda);
    }

    public List<Producto> GetProductos(){
        return tienda.Productos;
    }

    public Producto GetProductoPorID(string idbuscado){

            //hacer la lógica para buscar el producto
            return tienda.buscarID(idbuscado);
    }

//no se si la lógica tiene que estar aquí
    public List<String> GetCategorías(){

        List<string> categoriasUnicas = new List<string>();

        foreach (Producto prod in tienda.Productos){

            if (!categoriasUnicas.Contains(prod.categoria??"va mal en cargacat fachada"))
            {
                categoriasUnicas.Add(prod.categoria??"va mal en cargacat fachada");
            }
        }
        return categoriasUnicas;
    }

    public List<Producto> GetProductosMismaCategoria(string categoriaBuscada){
        return tienda.GetProductosMismaCategoria(categoriaBuscada);
    }
    public void GuardarBusqueda(string categoriaBuscada, string searchTerm, int idBuscado){
        tienda.GuardarBusqueda(categoriaBuscada, searchTerm, idBuscado);
    }
    public List<Producto> GetProductosBusqueda(string categoriaBuscada, string searchTermLower, int idBuscado){
        return tienda.GetProductosBusqueda(categoriaBuscada, searchTermLower, idBuscado);
    }
    
}
