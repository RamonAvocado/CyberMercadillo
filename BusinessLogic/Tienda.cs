using CyberMercadillo.BusinessLogic;
using CyberMercadillo.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using System.Reflection;
using Microsoft.AspNetCore.SignalR;

class Tienda
{
    private List<Producto> productos = new List<Producto>();
    public List<Producto> Productos
    {
        get { return productos; }
        private set { productos = value; }
    }

//esto son los productos de la búsqueda, para aplicar filtros sobre ellos
    private List<Producto> productosBus = new List<Producto>();
    public List<Producto> ProductosBus
    {
        get { return productosBus; }
        private set { productosBus = value; }
    }

    private List<Busqueda> busquedas= new List<Busqueda>();
    public List<Busqueda> Busquedas
    {
        get { return busquedas; }
        private set { busquedas = value; }
    }
    private List<Comprador> compradores= new List<Comprador>();
    public List<Comprador> Compradores
    {
        get { return compradores; }
        private set { compradores = value; }
    }
    private List<Vendedor> vendedores= new List<Vendedor>();
    public List<Vendedor> Vendedores
    {
        get { return vendedores; }
        private set { vendedores = value; }
    }
    private List<Tecnico> tecnicos= new List<Tecnico>();
    public List<Tecnico> Tecnicos
    {
        get { return tecnicos; }
        private set { tecnicos = value; }
    }
    private List<Compra> compras = new List<Compra>();
    public List<Compra> Compras
    {
        get { return compras; }
        private set { compras = value; }
    }
    
    private List<Usuario> usuarios = new List<Usuario>();
    public List<Usuario> Usuarios
    {
        get { return usuarios; }
        private set { usuarios = value; }
    }

    private List<CarritosDeCompra> carritos = new List<CarritosDeCompra>();

    public List<CarritosDeCompra> CarritosDeCompra
    {
        get { return carritos; }
        private set { carritos = value; }
    }


    private Usuario usuarioRegistrado = new Comprador(0,"x", 1, "x", "x", "x", 1, "x", 1, "x","x");
    public Usuario UsuarioRegistrado
    {
        get { return usuarioRegistrado;}
        private set { usuarioRegistrado = value; }
    }

    public void pregunta()
    {
            Console.WriteLine("Hay " + Busquedas.Count + " busquedas ");
            Console.WriteLine("Hay " + Productos.Count + " productos ");
            Console.WriteLine("Hay " + Compradores.Count + " Compradores ");
            Console.WriteLine("Hay " + Vendedores.Count + " Vendedores ");
            foreach(var tecnico in tecnicos){
                Console.WriteLine("Nombre tecnico" + tecnico.nombre);
            }
            Console.WriteLine("Hay " + Tecnicos.Count + " Tecnicos ");
            Console.WriteLine("Hay " + Usuarios.Count + " Usuarios ");
            Console.WriteLine("Hay " + CarritosDeCompra.Count + " CarritoDeCompras ");
            
    }


    public void CrearCarrito(int idusuario){
        CarritosDeCompra carrito = new CarritosDeCompra
        {
            idusuario = idusuario,
            estado = "En espera de pago"
        };
 
        Console.WriteLine("Se ha creado un carrito de compra ");
        Console.WriteLine("Ahora hay: " + CarritosDeCompra.Count() + " CarritoDeCompras");
        CarritosDeCompra.Add(carrito);
    }

    public bool AñadirAlCarritoCompra(int idusuario, string idproducto, string cantProducto)
    {

        // Verificar si el usuario ya tiene el producto en el carrito, si existe el producto, no quiero añadirlo al carrito
        if (CarritosDeCompra.Any(c => c.idusuario == idusuario && c.estado == "En espera de pago" && c.idproductos.Contains(idproducto)))
        {
            Console.WriteLine("El usuario ya tiene este producto en el carrito de compra, así que no lo guardo");
            return false;
        }
        else{
            //cogo el carrito que estoy bucando
            var carritoUsuario = CarritosDeCompra.FirstOrDefault(c => c.idusuario == idusuario && c.estado== "En espera de pago");

            // Si el carrito de compra no es null, añadir el producto y su cantidad
            if (carritoUsuario != null)
            {
                carritoUsuario.idproductos += "," + idproducto;
                carritoUsuario.cantidadProds += "," + cantProducto;
            }
            else // Si el usuario no tiene un carrito de compra existente, crear uno nuevo
            {
                CarritosDeCompra carrito = new CarritosDeCompra
                {
                    idusuario = idusuario,
                    estado = "En espera de pago",
                    idproductos = idproducto, // Agregar el primer producto
                    cantidadProds = cantProducto // Agregar la cantidad del primer producto
                };

                Console.WriteLine("Se ha creado un carrito de compra ");
                Console.WriteLine("Ahora hay: " + CarritosDeCompra.Count() + " CarritoDeCompras");

                CarritosDeCompra.Add(carrito);

                return true;
            }
        }
        
    Console.WriteLine("Ahora hay: " + CarritosDeCompra.Count() + " Productos en CarritoDeCompras");
            
    return true;
    }

    public bool TramitarPedido(int idusuario)
    {
        var hecho = false;
        var carritoUsuario = CarritosDeCompra.FirstOrDefault(c => c.idusuario == idusuario && c.estado == "En espera de pago");
        if (carritoUsuario!= null)
        {
            carritoUsuario.estado = "Enviado";
            carritoUsuario.fecha = DateTime.Now;

            // Ahora he de actualizar cada producto en la lista de productos restándole su cantidad debida
            // Recorrer los productos en el carrito y actualizar la cantidad en la lista de productos
            for (int i = 0; i < carritoUsuario.idproductos.Split(',').Length; i++)
            {
                var productosCarrito = carritoUsuario.idproductos.Split(',').ToList();
                var cantidadesCarrito = carritoUsuario.cantidadProds.Split(',').ToList();

                // Convertir el id del producto a entero
                if (int.TryParse(productosCarrito[i], out int idProducto))
                {
                    var productoEnLista = Productos.FirstOrDefault(p => p.idproducto == idProducto);
                    if (productoEnLista != null)
                    {
                        // Restar la cantidad debida del producto en la lista de productos
                        if (int.TryParse(cantidadesCarrito[i], out int cantidad))
                        {
                            productoEnLista.cantidad -= cantidad;
                            Console.WriteLine("Ahora hay " + productoEnLista.cantidad + " unidades de " + productoEnLista.nombreproducto);
                        }
                    }
                }
            }
            hecho = true;
        }
        return hecho;
    }


//cargo los pedidos, independientemente de si han sido pagados o no
    public List<CarritosDeCompra> CargarPedidos(int idusuario){

        List<CarritosDeCompra> carritos = new List<CarritosDeCompra>();

        foreach(var carrito in CarritosDeCompra){
            if(carrito.idusuario == idusuario){
                carritos.Add(carrito);
            }
        }

        return carritos;
    }

    public List<CarritosDeCompra> ObtenerCarritoCompra(int idusuario){
            
        List<CarritosDeCompra> carritoDeCompras = new List<CarritosDeCompra>();

        carritoDeCompras = CarritosDeCompra.Where(c => c.idusuario == idusuario && c.estado == "En espera de pago").ToList();

        return carritoDeCompras;
    }

    public List<Producto> ObtenerProductos(String idproductos){
            
        List<Producto> prod = new List<Producto>();

        //prod = Productos.Where(c => c.idproducto == idproducto).ToList();

        return prod;
    }


    
    public List<String> GetCategorías(){

        List<string> categoriasUnicas = new List<string>();

        foreach (Producto prod in Productos){

            if (!categoriasUnicas.Contains(prod.categoria??"va mal en cargacat fachada"))
            {
                categoriasUnicas.Add(prod.categoria??"va mal en cargacat fachada");
            }
        }
        return categoriasUnicas;
    }

    public Producto buscarID(string idbuscado)
    {
        Producto producto = new Producto
        {
            //por si no existe ese id
            idproducto = -1
        };
        //Buscar en la lista de productos de la tienda el id y devolver ese productos
        foreach (Producto prod in Productos)
            {
                if (prod.idproducto.ToString() == idbuscado)
                {
                    producto = prod;
                }
            }
            return producto;
    }

    public Producto buscarIDTodos(string idbuscado)
    {
        Producto producto = new Producto
        {
            //por si no existe ese id
            idproducto = -1
        };
        //Buscar en la lista de productos de la tienda el id y devolver ese productos
        foreach (Producto prod in Productos)
            {
                if (prod.idproducto.ToString() == idbuscado)
                {
                    producto = prod;
                }
            }

        return producto;
    }


/* ANTIGUO ACTUALIZAR CANTIDAD
public bool ActualizarCantidadProducto(int idusuario, int idproducto, int nuevaCantidad)
{
    var productoEncontrado = false;
    foreach (Producto prod in Productos)
    {
        if (prod.idproducto == idproducto)
        {
            // Actualizar la cantidad del producto
            prod.cantidad -= nuevaCantidad;
            productoEncontrado = true;

            //la lógica para cambiar el estado del producto en el carrito del usuario 
            var carritoUsuario = CarritosDeCompra.FirstOrDefault(c => c.idusuario == idusuario && c.estado== "En espera de pago");
            //ahora quiero actualizar  su respectiva cantidad, que está en la misam posición que el idprodcuto
            
            if (carritoUsuario != null)
            {
                // Encontrar la posición del producto en el carrito del usuario
                int index = Array.IndexOf(carritoUsuario.idproductos.Split(','), idproducto.ToString());

            if (index != -1)
                {
                    // Convertir la cantidad de productos a un array de strings
                    string[] cantidades = carritoUsuario.cantidadProds.Split(',');

                    // Actualizar la cantidad del producto en el carrito del usuario
                    int cantidadActual = int.Parse(cantidades[index]);
                    cantidadActual -= nuevaCantidad;
                    cantidades[index] = cantidadActual.ToString();

                    // Unir el array de cantidades en una cadena
                    carritoUsuario.cantidadProds = string.Join(',', cantidades);
                }
            }
        }
    }

    if (productoEncontrado)
    {
        //guardar el carrito en la base de datos y eliminar el producto actual
        Console.WriteLine("Cantidad producto acutalizada");
    }
    
    return productoEncontrado;
}

*/
public bool ActualizarCantidadProducto(int idusuario, int idproducto, int nuevaCantidad)
{
    var productoEncontrado = false;

    //la lógica para cambiar el estado del producto en el carrito del usuario 
    var carritoUsuario = CarritosDeCompra.FirstOrDefault(c => c.idusuario == idusuario && c.estado== "En espera de pago");
    //ahora quiero actualizar  su respectiva cantidad, que está en la misam posición que el idprodcuto
    
    if (carritoUsuario != null)
    {
        // Encontrar la posición del producto en el carrito del usuario
        int index = Array.IndexOf(carritoUsuario.idproductos.Split(','), idproducto.ToString());

    if (index != -1)
        {
            // Convertir la cantidad de productos a un array de strings
            string[] cantidades = carritoUsuario.cantidadProds.Split(',');

            // Actualizar la cantidad del producto en el carrito del usuario
            int cantidadActual = int.Parse(cantidades[index]);
            cantidadActual = nuevaCantidad;
            cantidades[index] = cantidadActual.ToString();

            // Unir el array de cantidades en una cadena
            carritoUsuario.cantidadProds = string.Join(',', cantidades);
        }
    }

    if (productoEncontrado)
    {
        //guardar el carrito en la base de datos y eliminar el producto actual
        Console.WriteLine("Cantidad producto acutalizada");
    }
    
    return productoEncontrado;
}

    public void EliminarProductoDelCarrito(int idusuario, string idproducto)
    {
        var carritoUsuario = CarritosDeCompra.FirstOrDefault(c => c.idusuario == idusuario && c.estado == "En espera de pago");

        if (carritoUsuario != null)
        {
            // Separar los id de los productos y cantidades en listas
            List<string> productos = carritoUsuario.idproductos.Split(',').ToList();
            List<string> cantidades = carritoUsuario.cantidadProds.Split(',').ToList();

            // Buscar la posición del producto en la lista
            int index = productos.IndexOf(idproducto);

            if (index != -1)
            {
                // Eliminar el producto y su cantidad
                productos.RemoveAt(index);
                cantidades.RemoveAt(index);

                // Actualizar el carrito
                carritoUsuario.idproductos = string.Join(",", productos);
                carritoUsuario.cantidadProds = string.Join(",", cantidades);

                // Si no quedan productos, eliminar el carrito
                if (productos.Count == 0)
                {
                    CarritosDeCompra.Remove(carritoUsuario);
                    Console.WriteLine("Carrito eliminado");
                }
                else
                {
                    Console.WriteLine("Producto eliminado del carrito");
                }
            }
            else
            {
                Console.WriteLine("El producto no se encontró en el carrito");
            }
        }
        else
        {
            Console.WriteLine("No se encontró un carrito para el usuario especificado");
        }
    }

    public bool validarUnProducto(string idBuscado)
    {
        Producto producto = new Producto
        {
            //por si no existe ese id
            idproducto = -1
        };

        foreach (Producto prod in Productos)
        {
            if (prod.idproducto.ToString() == idBuscado)
            {
                producto = prod;
            }
        }
        if(producto.idproducto != -1 && producto.validado == false){
            producto.validado = true;
            producto.idtecnico = -1;
            return true;
        }else return false;
    }


    public bool validarProductoGuardado(string idBuscado)
    {
        Producto producto = new Producto
        {
            //por si no existe ese id
            idproducto = -1
        };

        foreach (Producto prod in Productos)
        {
            if (prod.idproducto.ToString() == idBuscado)
            {
                prod.guardado = false;
            }
        }
        if(producto.idproducto != -1 && producto.validado == false){
            return true;
        }else return false;
    }


    public int MayorIDProd()
    {
        int mayorID = 0;

        foreach (Producto prod in Productos)
        {
            if (prod.idproducto > mayorID)
            {
                mayorID = prod.idproducto ?? 0;
            }
        }

        return mayorID;
    }

     public int MayorIDUsuario(){
        int mayorID = 0;

        foreach (Usuario usu in Usuarios)
        {
            if (usu.idusuario > mayorID)
            {
                mayorID = usu.idusuario;
            }
        }

        return mayorID;
    }

    public void agregarUser(Usuario usuario){
        if (usuario is Tecnico tecnico) {
            tecnicos.Add(tecnico);
        } else if (usuario is Vendedor vendedor) {
            vendedores.Add(vendedor);
        } else if (usuario is Comprador comprador) {
            compradores.Add(comprador);
        }
    }

    public void actualizarProdGuardado(string idbuscado,string nombreProd, string precioProd, string categoriaProd,string descripcionProd,
                                                        string imgProd, int cantProd,int puntHuella,string certiH)
    {
        Producto producto = new Producto
        {
            //por si no existe ese id
            idproducto = -1
        };
        //Buscar en la lista de productos de la tienda el id y devolver ese productos
        foreach (Producto prod in Productos)
            {
                if (prod.idproducto.ToString() == idbuscado)
                {
                    producto = prod;
                }
            }
        producto.nombreproducto = nombreProd;    
        producto.precio = precioProd;
        producto.categoria = categoriaProd;
        producto.descripcion = descripcionProd;
        producto.imagenes = imgProd;
        producto.cantidad = cantProd;
        producto.puntuacionEco = puntHuella;
        producto.certificadoEco = certiH;
    }

public void actualizarProd(string idbuscado, string precioProd,string descripcionProd, int cantProd)
    {
        Producto producto = new Producto
        {
            //por si no existe ese id
            idproducto = -1
        };
        //Buscar en la lista de productos de la tienda el id y devolver ese productos
        foreach (Producto prod in Productos)
            {
                if (prod.idproducto.ToString() == idbuscado)
                {
                    producto = prod;
                }
            }   
        producto.precio = precioProd;
        producto.descripcion = descripcionProd;
        producto.cantidad = cantProd;
    }

    public void eliminarProductoID(string idbuscado)
    {
        Producto producto = new Producto
        {
            //por si no existe ese id
            idproducto = -1
        };
        //Buscar en la lista de productos de la tienda el id y devolver ese productos
        foreach (Producto prod in Productos)
            {
                if (prod.idproducto.ToString() == idbuscado)
                {
                    Productos.Remove(prod);
                }
            }
    }

    public List<Producto> GetProductosVendedor(int idVendedor)
    {
            
        List<Producto> productos = new List<Producto>();

        //Buscar en la lista de productos de la tienda el id y devolver ese productos
        foreach (Producto prod in Productos)
            {
                if (prod.idvendedor == idVendedor && prod.validado == true)
                {
                    productos.Add(prod);
                }
            }
        return productos;
    }

    public void GuardarBusqueda(string searchTerm, int idBuscado)
    {
        var texto = searchTerm.Split(';');
        Busqueda busqueda = new Busqueda
        {
            texto = texto[0]+ "   [Filtros: " + texto[1] + "]",
            fecha = DateTime.Now,
            idusuario = idBuscado,
        };
            Busquedas.Add(busqueda);         
    }

    public Usuario buscarUsuario(String correo, String password)
    {
            Usuario usuarioFalso = new Tecnico(0,"Prueba", 1000, "Pruebacorreo", "Pruebacontra", "Yo que se", "Tecnico");
            Usuario usuarioEncontrado;

            usuarioEncontrado = Compradores.Find(u => u.correo == correo && u.contraseña == password) ?? usuarioFalso;
            if(usuarioEncontrado.correo == correo && usuarioEncontrado.contraseña == password){
                UsuarioRegistrado = usuarioEncontrado;
                return usuarioEncontrado;
            }

            usuarioEncontrado = Vendedores.Find(u => u.correo == correo && u.contraseña == password) ?? usuarioFalso;
            if(usuarioEncontrado.correo == correo && usuarioEncontrado.contraseña == password){
                UsuarioRegistrado = usuarioEncontrado;
                return usuarioEncontrado;
            }

            usuarioEncontrado = Tecnicos.Find(u => u.correo == correo && u.contraseña == password) ?? usuarioFalso;
            if(usuarioEncontrado.correo == correo && usuarioEncontrado.contraseña == password){
                UsuarioRegistrado = usuarioEncontrado;
                return usuarioEncontrado;
            }

            else{return usuarioFalso;}
    }

    public Usuario ObtenerInfoUsuario(int idusuario)
    {
            Usuario usuarioFalso = new Tecnico(0,"Prueba", 1000, "Pruebacorreo", "Pruebacontra", "Yo que se", "Tecnico");
            Usuario usuarioEncontrado;

            usuarioEncontrado = Compradores.Find(u => u.idusuario == idusuario) ?? usuarioFalso;
            if(usuarioEncontrado.idusuario == idusuario){
                return usuarioEncontrado;
            }

            usuarioEncontrado = Vendedores.Find(u => u.idusuario == idusuario) ?? usuarioFalso;
            if(usuarioEncontrado.idusuario == idusuario){
                return usuarioEncontrado;
            }

            usuarioEncontrado = Tecnicos.Find(u => u.idusuario == idusuario) ?? usuarioFalso;
            if(usuarioEncontrado.idusuario == idusuario){
                return usuarioEncontrado;
            }

            else{return usuarioFalso;}
    }

    public bool GuardarDatosUsuario(int idusuario, int numTarjeta, string fechaCaducidad, int cvv){
    var ok= false;
        foreach(Comprador usuario in Compradores){
            if(usuario.idusuario == idusuario){
                usuario.numeroTarjeta = numTarjeta;
                usuario.fechaCaducidad = fechaCaducidad;
                usuario.CVV = cvv;
                ok = true;
                //Console.WriteLine("ok: " + ok + ", numTarjeta: " + usuario.numeroTarjeta + ", fechaCaducidad: " + usuario.fechaCaducidad + ", cvv: " + usuario.CVV);

            }
        }
        return ok;
    }

    public List<Busqueda> getBusquedasUsuario(Usuario user){
        List<Busqueda> busquedasUsuario = new List<Busqueda>();
        foreach(var busqueda in Busquedas){
            if(busqueda.idusuario == user.idusuario){
                busquedasUsuario.Add(busqueda);
            }
        }
        return busquedasUsuario;
    }
       
    public List<Producto> GetProductosBusqueda(string searchTerm, int idBuscado)
    {
        List<Producto> productos = new List<Producto>();
        var busqueda = searchTerm.Split(';');

        var searchTermLower = busqueda[0].ToLowerInvariant();
        //Buscar en la lista de productos de la tienda el id y devolver ese productos
        foreach (Producto prod in Productos)
            {
                if(prod.nombreproducto.IndexOf(searchTermLower, StringComparison.OrdinalIgnoreCase) >= 0 || prod.descripcion.IndexOf(searchTermLower, StringComparison.OrdinalIgnoreCase) >= 0)
                {
                productos.Add(prod);
                }
            }
            
        //guardo la búsqueda
        GuardarBusqueda(searchTerm,idBuscado);

        ProductosBus = productos;

        return ProductosBus;
    }

    public List<Producto> GetProductos(){
        ProductosBus = Productos;
        return Productos;
    }

    public List<Producto> GetProdBusquedaFiltro(string category)
    {
        List<Producto> productos = new List<Producto>();
        Console.WriteLine("category: "+ category);

        //Buscar en la lista de productos de la tienda el id y devolver ese productos
        Console.WriteLine("productos en las busquedas anteriores: "+ ProductosBus.Count());

        foreach (Producto prod in ProductosBus)
        {
            //Console.WriteLine("Nombre: "+ prod.nombreproducto + ",  Categoria: " + prod.categoria);
            if(prod.categoria == category)
            {
                productos.Add(prod);
            }
        }
        // ¿guardo la búsqueda con la categoría que ahora es un filtro?
        //GuardarBusqueda(searchTerm,idBuscado);
        Console.WriteLine("total productos con filtro categoría: "+ productos.Count());

        //ProductosBus = productos;

        return productos;
    }


public List<Producto> FiltrarProductosPorPrecio (List<Producto>ProdCat, int precioMin, int precioMax, string category)
{
    List<Producto> productos = new List<Producto>();

    if (category == "Todas las categorías"){
        // Filtrar por rango de precios
        foreach (Producto prod in ProductosBus)
        {
            // Convertir el precio de string a double para la comparación
            if (int.TryParse(prod.precio, out int precio))
            {
                if (precio >= precioMin && precio <= precioMax)
                {
                    productos.Add(prod);
                }
            }
            else
            {
                // Manejar el caso en el que el valor de precio no sea un número válido
                Console.WriteLine($"El precio del producto {prod.nombreproducto} no es un número válido.");
            }
        }
    }else{
        // Filtrar por rango de precios
        foreach (Producto prod in ProdCat)
        {
            // Convertir el precio de string a double para la comparación
            if (int.TryParse(prod.precio, out int precio))
            {
                if (precio >= precioMin && precio <= precioMax)
                {
                    productos.Add(prod);
                }
            }
            else
            {
                // Manejar el caso en el que el valor de precio no sea un número válido
                Console.WriteLine($"El precio del producto {prod.nombreproducto} no es un número válido.");
            }
        }
    }

    return productos;
}


public List<Producto> FiltrarProductosPorValoracion(List<Producto>ProdCat,List<Producto>ProdPrec, int puntuacionEco, string category)
{
    List<Producto> productos = new List<Producto>();

    //if (category == "Todas las categorías"){
    if(ProdPrec.Count() != 0)
    {
        foreach (Producto prod in ProdPrec)
            {
                // Convertir el precio de string a double para la comparación
                if (prod.puntuacionEco == puntuacionEco)
                {
                    productos.Add(prod);
                }
                else
                {
                    // Manejar el caso en el que el valor de precio no sea un número válido
                    Console.WriteLine($"El precio del producto {prod.nombreproducto} no es un número válido.");
                }
            }
    }else if(ProdCat.Count() != 0)
            {
                // Filtrar por rango de precios
                foreach (Producto prod in ProductosBus)
                {
                    // Convertir el precio de string a double para la comparación
                    if (prod.puntuacionEco == puntuacionEco)
                    {
                        productos.Add(prod);
                    }
                    else
                    {
                        // Manejar el caso en el que el valor de precio no sea un número válido
                        Console.WriteLine($"El precio del producto {prod.nombreproducto} no es un número válido.");
                    }
                }
            }else
            {
                foreach (Producto prod in ProductosBus)
                {
                    // Convertir el precio de string a double para la comparación
                    if (prod.puntuacionEco == puntuacionEco)
                    {
                        productos.Add(prod);
                    }
                    else
                    {
                        // Manejar el caso en el que el valor de precio no sea un número válido
                        Console.WriteLine($"El precio del producto {prod.nombreproducto} no es un número válido.");
                    }
                }
            }

return productos;
}

    public List<Producto> GetProductosVendedorG(int idVendedor){
            
            List<Producto> productos = new List<Producto>();

        //Buscar en la lista de productos de la tienda el id y devolver ese productos
        foreach (Producto prod in Productos)
            {
                if (prod.idvendedor == idVendedor && prod.guardado == true)
                {
                    productos.Add(prod);
                }
            }
        return productos;
    }

    public List<Producto> GetProductosAValidarTecnico(int idTecnico){
            
            List<Producto> productos = new List<Producto>();

        //Buscar en la lista de productos de la tienda el id y devolver ese productos
        foreach (Producto prod in Productos)
            {
                if (prod.idtecnico == idTecnico && prod.validado == false)
                {
                    productos.Add(prod);
                }
            }
        return productos;
    }

    public bool asignarPro(string idbuscado,int idusu)
    {
        Producto producto = new Producto
        {
            //por si no existe ese id
            idproducto = -1
        };
        //Buscar en la lista de productos de la tienda el id y devolver ese productos
        foreach (Producto prod in Productos)
            {
                if (prod.idproducto.ToString() == idbuscado)
                {
                    producto = prod;
                    prod.idtecnico = idusu;
                }
            }
        if(producto.idproducto != -1)
            return true;
        else 
            return false; 
    } 

    public bool desasignarPro(string idbuscado)
    {
        Producto producto = new Producto
        {
            //por si no existe ese id
            idproducto = -1
        };
        //Buscar en la lista de productos de la tienda el id y devolver ese productos
        foreach (Producto prod in Productos)
            {
                if (prod.idproducto.ToString() == idbuscado)
                {
                    producto = prod;
                    prod.idtecnico = -1;
                }
            }
        if(producto.idproducto != -1)
            return true;
        else 
            return false; 
    } 

    public void borrarCuenta(int idusuario, string tipoUsuario){
        Comprador usuarioFalso1 = new Comprador(0,"Prueba", 1000, "Pruebacorreo", "Pruebacontra", "Yo que se",1 , "Tecnico", 1, "Yo que se", "Yo que se");
        Vendedor usuarioFalso2 = new Vendedor(0,"Prueba", 1000, "Pruebacorreo", "Pruebacontra", "Yo que se","Yo que se",1 , "Tecnico");
        Usuario usuarioEncontrado = Compradores.Find(x => x.idusuario == idusuario) ?? usuarioFalso1;
        if(tipoUsuario == "Comprador"){
            Compradores.Remove((Comprador)usuarioEncontrado);
        }else{
            Vendedores.Remove((Vendedor)usuarioEncontrado);
        }
    }
}
    
