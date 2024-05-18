using CyberMercadillo.Entities;
using CyberMercadillo.BusinessLogic;

class FachadaLogica{

    private Tienda tienda;
    private GestorDeBusqueda gestorBusqueda;

    private FabricaDeUsuarios fabrica;
    public FachadaLogica(){
        tienda = new Tienda();
        fabrica = new FabricaDeUsuarios();
        gestorBusqueda = new GestorDeBusqueda();
    }

    public Tienda returnTienda(){
        return tienda;
    }

    public List<Producto> GetProductos(){
        return tienda.GetProductos();
    }

    public Producto buscarIDTodos(string idBuscado){
        return tienda.buscarIDTodos(idBuscado);
    }

    public List<String> GetCategorías(){
        return tienda.GetCategorías();
    }

    public void eliminarProductoID(string idproductoSeleccionado){
        tienda.eliminarProductoID(idproductoSeleccionado);
    }

    public  List<Producto> GetProductosBusqueda(string searchTerm, int idBuscado){
        var comandoBusqueda = new ComandoBusqueda(tienda, searchTerm, idBuscado);
        gestorBusqueda.SetComando(comandoBusqueda);
        return gestorBusqueda.solicitarBusqueda();
    }
    
   /*
    public  List<Producto> GetProductosBusqueda(string searchTerm, int idBuscado){
        return tienda.GetProductosBusqueda(searchTerm, idBuscado);
    }*/

    public List<Producto> GetProdBusquedaFiltro(string category){
        return tienda.GetProdBusquedaFiltro(category);
    }

    public void GuardarBusqueda(string searchTerm, int idBuscado){
        tienda.GuardarBusqueda(searchTerm, idBuscado);
    }

    public List<Producto> GetProductosRecomendados(){
        return tienda.GetProductosRecomendados();
    }

    public List<Producto> FiltrarProductosPorPrecio(List<Producto>productosCat, int precioMin, int precioMax, string category){
        return tienda.FiltrarProductosPorPrecio(productosCat, precioMin, precioMax, category);
    }

    public List<Producto> FiltrarProductosPorValoracion(List<Producto>productosCat,List<Producto>productosPrec, int valoracion, string category){
        return tienda.FiltrarProductosPorValoracion(productosCat,productosPrec, valoracion, category);
    }

    public bool AñadirAlCarritoCompra(int idBuscado, string idproducto, string cantProducto){
        return tienda.AñadirAlCarritoCompra(idBuscado, idproducto, cantProducto);
    }

    public bool AñadirADeseos(int idBuscado, string idproducto){
        return tienda.AñadirADeseos(idBuscado, idproducto);
    }

    public List<ListaDeseados> ObtenerListaDeseados(int idusuario){
        return tienda.ObtenerListaDeseados(idusuario);
    }
    public List<CarritosDeCompra> ObtenerCarritoCompra(int idusuario){
        return tienda.ObtenerCarritoCompra(idusuario);
    }

    public bool ActualizarCantidadProducto(int idusuario, int idproducto,int nuevaCantidad){
        return tienda.ActualizarCantidadProducto(idusuario, idproducto, nuevaCantidad);
    }

    public void EliminarProductoDelCarrito(int idusuario, string idproducto){
        tienda.EliminarProductoDelCarrito(idusuario, idproducto);
    }
    public void EliminarProductoDeListaDeseados(int idusuario, string idproducto){
        tienda.EliminarProductoDeListaDeseados(idusuario, idproducto);
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

    public Usuario buscarUsuario(string correoUsuario, string contraUsuario){
        return tienda.buscarUsuario(correoUsuario, contraUsuario);
    }

    public Usuario buscarUsuario(int idusuario){
        return tienda.buscarUsuario(idusuario);
    }

    public List<CarritosDeCompra> CargarPedidos(int idusuario){
        return tienda.CargarPedidos(idusuario);
    }

    public void borrarCuenta(int idusuario){
        tienda.borrarCuenta(idusuario);
    }

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
    public Comprador actualizarComprador(string nombre, int movil, string correo, string contraseña,
                                   string direccionEnvio, string fechaCaducidad,string direccionFacturacion,int NumTarjeta,int cvv,string imgPerfil,string idcomprador){
        return tienda.actualizarComprador(nombre,movil,correo,contraseña,direccionEnvio,fechaCaducidad,direccionFacturacion,NumTarjeta,cvv,imgPerfil,idcomprador);
    }
}
