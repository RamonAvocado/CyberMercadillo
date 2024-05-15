using CyberMercadillo.Entities;
using CyberMercadillo.BusinessLogic;

class FachadaLogica{

    private Tienda tienda;

    private FabricaDeUsuarios fabrica;
    public FachadaLogica(){
        tienda = new Tienda();
        fabrica = new FabricaDeUsuarios();
    }

    public Tienda returnTienda(){
        return tienda;
    }

    public FabricaDeUsuarios returnFabrica(){
        return fabrica;
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
                                                        string imgProd, int cantProd,int idvendedorProd,bool validProd, bool saveProd, int puntHuella,string certiEco, string llegada,int descuento){
        int idProd = tienda.MayorIDProd() +1;
        Producto product = new Producto(idProd,nombreProd,precioProd,categoriaProd,descripcionProd, imgProd, cantProd,idvendedorProd,validProd,saveProd, puntHuella, certiEco, llegada,descuento);
        tienda.agregarProducto(product);
    }

    public void agregarUsuario(string tipoUsuario, string nombre, int movil, string correo, string contraseña, string direccion, string nombreTienda , 
                                            int telefonoTienda,int CVV , int numTarjeta ,string fechaCaducidad, string dirFact){
        int idUsu = tienda.MayorIDUsuario() +1;
        var nuevoUsuario = fabrica.CrearUsuario(
                        idUsu,
                        tipoUsuario ?? "Usuario por defecto",
                        nombre ?? "Usuario de Serie Creación",
                        movil,
                        correo ?? "Correo Usuario",
                        contraseña ?? "1234",
                        direccion ?? "direccion usuario",
                        nombreTienda ?? "nombre tienda",
                        telefonoTienda,
                        CVV,
                        numTarjeta,
                        fechaCaducidad,
                        dirFact);
        tienda.agregarUser(nuevoUsuario);
    }

    public bool GuardarDatosUsuario(int idusuario, int numTarjeta, string fechaCaducidad, int cvv){
        return tienda.GuardarDatosUsuario(idusuario, numTarjeta, fechaCaducidad, cvv);
    }

    public bool TramitarPedido(int idusuario){
        return tienda.TramitarPedido(idusuario);
    }

    public List<CarritosDeCompra> CargarPedidos(int idusuario){
        return tienda.CargarPedidos(idusuario);
    }

    public void borrarCuenta(int idusuario, string tipoUsuario){
        tienda.borrarCuenta(idusuario, tipoUsuario);
    }

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


    public void actualizarProducto(string precioProd,string descripcionProd, int cantProd,string idProducto, int descuento){
        tienda.actualizarProd(idProducto,precioProd,descripcionProd, cantProd,descuento);
    }

    public void actualizarProductoGuardado(string nombreProd, string precioProd, string categoriaProd,string descripcionProd,string imgProd, int cantProd,string idProducto, int puntHuella,string certiH,int descuento
    ){
        tienda.actualizarProdGuardado(idProducto,nombreProd,precioProd,categoriaProd,descripcionProd, imgProd, cantProd,puntHuella,certiH,descuento);
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

    public bool buscarCorreoUsu(string correo){
        return tienda.buscarCorreo(correo);
    }

    public Vendedor buscarVendedor(string idbuscado){
        return tienda.buscarUserVendedor(idbuscado);
    }

    public Comprador buscarComprador(string idbuscado){
        return tienda.buscarUserComprador(idbuscado);
    }

    public Vendedor actualizarVendedor(string nombre, int movil, string correo, string contraseña,
                                   string direccion, string nombreTienda,int telefonoTienda,string imagPerfil,string idvendedor){
        return tienda.actualizarVendedor(nombre,movil,correo,contraseña,direccion,nombreTienda,telefonoTienda,imagPerfil,idvendedor);
    }

}
