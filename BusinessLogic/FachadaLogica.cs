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


}