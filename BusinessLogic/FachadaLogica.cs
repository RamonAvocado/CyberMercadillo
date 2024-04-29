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

    public List<Producto> GetTodosProductosVendedor(int user){
        List<Producto> prod = tienda.GetProductosVendedor(user);
        return prod;
    }

    public List<Producto> GetProductosVendedorGuardados(int user){
        //Vendedor seller = tienda.Vendedores.FirstOrDefault(v => v.idusuario == user);
        //return seller.GetProductosVendedorG();
        List<Producto> prod = tienda.GetProductosVendedorG(user);
        return prod;
    }

    public void agregarProducto(string nombreProd, string precioProd, string categoriaProd,string descripcionProd,
                                                        string imgProd, int cantProd,int idvendedorProd,bool validProd){
        int idProd = tienda.MayorIDProd() +1;
        Producto product = new Producto(idProd,nombreProd,precioProd,categoriaProd,descripcionProd, imgProd, cantProd,idvendedorProd,validProd, 1234567);
        tienda.Productos.Add(product);
    }

    public void guardarProducto(string nombreProd, string precioProd, string categoriaProd,string descripcionProd,
                                                        string imgProd, int cantProd,int idvendedorProd,bool validProd){
        int idProd = tienda.MayorIDProd() +1;
        Producto product = new Producto(idProd,nombreProd,precioProd,categoriaProd,descripcionProd, imgProd, cantProd,idvendedorProd,validProd, 1234567);
        /*Vendedor seller = tienda.Vendedores.FirstOrDefault(v => v.idusuario == idvendedorProd);
        if (seller != null)
        {
            seller.ProductosGuardados.Add(product);
        }*/
        tienda.ProductosGuardados.Add(product);
    }


    public void actualizarProducto(string nombreProd, string precioProd, string categoriaProd,string descripcionProd,
                                                        string imgProd, int cantProd,string idProducto){
        tienda.actualizarProd(idProducto,nombreProd,precioProd,categoriaProd,descripcionProd, imgProd, cantProd);
    }

    public bool validarProducto(string idbuscado){
            bool validado = tienda.validarUnProducto(idbuscado);
             if(validado)
                return true;
             else{
                return false;
             }
    }

    public void eliminarProducto(string idbuscado){
             tienda.eliminarProductoID(idbuscado);
    }

    public List<Producto> GetProductosAValidar(){
        List<Producto> prod = tienda.Productos;
        return prod.Where(p => p.validado == false).ToList();
    }
    public Producto GetProductoPorID(string idbuscado){

            //hacer la lógica para buscar el producto
            return tienda.buscarID(idbuscado);
    }

    public Producto GetProductoPorIDTodos(string idbuscado){

            //hacer la lógica para buscar el producto
            return tienda.buscarIDTodos(idbuscado);
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
