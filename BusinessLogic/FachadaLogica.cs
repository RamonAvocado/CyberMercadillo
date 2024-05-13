using CyberMercadillo.Entities;
class FachadaLogica{

    private Tienda tienda;
    public FachadaLogica(){
        tienda = new Tienda();
    }

    public Tienda returnTienda(){
        return tienda;
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
                                                        string imgProd, int cantProd,int idvendedorProd,bool validProd, bool saveProd, int puntHuella,string certiEco, string llegada){
        int idProd = tienda.MayorIDProd() +1;
        Producto product = new Producto(idProd,nombreProd,precioProd,categoriaProd,descripcionProd, imgProd, cantProd,idvendedorProd,validProd,saveProd, puntHuella, certiEco, llegada);
        tienda.Productos.Add(product);
    }

    public bool GuardarDatosUsuario(int idusuario, int numTarjeta, string fechaCaducidad, int cvv){
        return tienda.GuardarDatosUsuario(idusuario, numTarjeta, fechaCaducidad, cvv);
    }

/* ahora cambia
    public List<CarritoDeCompra> CargarPedidos(int idusuario){
        return tienda.CargarPedidos(idusuario);
    }
    */
/*
    public void guardarProducto(string nombreProd, string precioProd, string categoriaProd,string descripcionProd,
                                                        string imgProd, int cantProd,int idvendedorProd,bool validProd,bool saveProd){
        int idProd = tienda.MayorIDProd() +1;
        Producto product = new Producto(idProd,nombreProd,precioProd,categoriaProd,descripcionProd, imgProd, cantProd,idvendedorProd,validProd,saveProd, 1234567);
        /*Vendedor seller = tienda.Vendedores.FirstOrDefault(v => v.idusuario == idvendedorProd);
        if (seller != null)
        {
            seller.ProductosGuardados.Add(product);
        }*/
       // tienda.ProductosGuardados.Add(product);
   // }


    public void actualizarProducto(string precioProd,string descripcionProd, int cantProd,string idProducto){
        tienda.actualizarProd(idProducto,precioProd,descripcionProd, cantProd);
    }

    public void actualizarProductoGuardado(string nombreProd, string precioProd, string categoriaProd,string descripcionProd,string imgProd, int cantProd,string idProducto, int puntHuella,string certiH){
        tienda.actualizarProdGuardado(idProducto,nombreProd,precioProd,categoriaProd,descripcionProd, imgProd, cantProd,puntHuella,certiH);
    }

    public bool validarProducto(string idbuscado){
            bool validado = tienda.validarUnProducto(idbuscado);
             if(validado)
                return true;
             else{
                return false;
             }
    }

    public bool validarProdGuardado(string idbuscado){
            bool validado = tienda.validarProductoGuardado(idbuscado);
             if(validado)
                return true;
             else{
                return false;
             }
    }

    public List<Producto> GetProductosAValidar(){
        List<Producto> prod = tienda.Productos;
        return prod.Where(p => p.validado == false && p.guardado == false && p.idtecnico == -1).ToList();
    }

    public List<Producto> GetProductosAValidarTecnico(int idbuscado){
        List<Producto> prod = tienda.GetProductosAValidarTecnico(idbuscado);
        return prod;
    }

    public Producto GetProductoPorID(string idbuscado){
            //hacer la lógica para buscar el producto
            return tienda.buscarID(idbuscado);
    }

    public bool asignarProductoTecnico(string idbuscado,int idusuario){
            //hacer la lógica para buscar el producto
            return tienda.asignarPro(idbuscado,idusuario);
    }
    public bool desasignarProducto(string idbuscado){
            //hacer la lógica para buscar el producto
            return tienda.desasignarPro(idbuscado);
    }

}
