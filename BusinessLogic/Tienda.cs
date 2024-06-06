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

public class Tienda
{
    public UnitOfWork<Producto> unitOfWorkProducto = new UnitOfWork<Producto>();
    public UnitOfWork<Busqueda> unitOfWorkBusqueda = new UnitOfWork<Busqueda>();
    public UnitOfWork<CarritosDeCompra> unitOfWorkCarritos = new UnitOfWork<CarritosDeCompra>();
    public UnitOfWork<Usuario> unitOfWorkUsuario = new UnitOfWork<Usuario>();
    public UnitOfWork<ListaDeseados> unitOfWorkListaDeseados = new UnitOfWork<ListaDeseados>();


    public List<Producto> Productos = new List<Producto>();

    //esto son los productos de la búsqueda, para aplicar filtros sobre ellos
    //DEJARLO PARA EL FINAL
    public List<Producto> ProductosBus = new List<Producto>();
    public List<Busqueda> Busquedas = new List<Busqueda>();
    public List<Usuario> Usuarios = new List<Usuario>();
    public List<CarritosDeCompra> CarritosDeCompra = new List<CarritosDeCompra>();
    public List<ListaDeseados> ListaDeseados = new List<ListaDeseados>();

    public Usuario UsuarioRegistrado = new Comprador(0,"x", 1, "x", "x", "x", 1, "x", 1, "x","x");

    public void Pregunta()
    {
            Console.WriteLine("\nHay " + Busquedas.Count + " busquedas ");
            Console.WriteLine("Hay " + Productos.Count + " productos ");
            Console.WriteLine("Hay " + Usuarios.Count + " Usuarios ");
            Console.WriteLine("Hay " + CarritosDeCompra.Count + " CarritoDeCompras");
            Console.WriteLine("Hay " + ListaDeseados.Count + " ListaDeseados");
            
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
            var carritoUsuarioAntesDeMod = carritoUsuario;

            // Si el carrito de compra no es null, añadir el producto y su cantidad
            if (carritoUsuario != null)
            {
                carritoUsuario.idproductos += "," + idproducto;
                carritoUsuario.cantidadProds += "," + cantProducto;
                //RAMON AQUI HACE FALTA ACTUALIZAR EL UNITOFWORK DE CARRITO? -> como se hace?
                //CAMBIAR
                //unitOfWorkCarritos.UpdateItem(carritoUsuarioAntesDeMod, carritoUsuario);

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
        
    Console.WriteLine("Ahora hay: " + CarritosDeCompra.Count() + " CarritoDeCompras");
            
    return true;
    }


    public bool AñadirADeseos(int idusuario, string idproducto)
    {
        if (ListaDeseados.Any(c => c.idusuario == idusuario && c.idproductos.Contains(idproducto)))
        {
            Console.WriteLine("El usuario ya tiene este producto en la Lista de Deseados así que no lo guardo");
            return false;
        }
        else{
            var listaUser = ListaDeseados.FirstOrDefault(c => c.idusuario == idusuario);

            if (listaUser != null)
            {
                listaUser.idproductos += "," + idproducto;
                Console.WriteLine("Se ha añadido un producto a la Lista de Deseados");
                unitOfWorkListaDeseados.UpdatedList.Push(listaUser);
            }
            else // Si el usuario no tiene lista, la crea
            {
                ListaDeseados listaDeseados = new ListaDeseados
                {
                    idusuario = idusuario,
                    idproductos = idproducto
                };

                unitOfWorkListaDeseados.AddedList.Push(listaDeseados);
                Console.WriteLine("Se ha creado una lista de deseados ");
                Console.WriteLine("Ahora hay: " + ListaDeseados.Count() + " Lista de Deseados");

                ListaDeseados.Add(listaDeseados);

                return true;
            }
        }
        
    Console.WriteLine("\nAhora hay: " + ListaDeseados.Count() + " Listas de Deseados");      
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
                            Console.WriteLine("\nAhora hay " + productoEnLista.cantidad + " unidades de " + productoEnLista.nombreproducto);
                            if(productoEnLista.cantidad == 0){
                            Console.WriteLine("El producto " + productoEnLista.nombreproducto + " se eliminará en BDD porque hay: "+ productoEnLista.cantidad +" unidades");
                                Productos.Remove(productoEnLista);
                                unitOfWorkProducto.DeletedList.Push(productoEnLista);
                            }
                            else
                            {
                                unitOfWorkProducto.UpdatedList.Push(productoEnLista);
                            }
                        }
                    }
                }
            }
        //guardar el carrito siempre
        unitOfWorkCarritos.AddedList.Push(carritoUsuario);
        hecho = true;
        }
        return hecho;
    }


//cargo los pedidos, independientemente de si han sido pagados o no
    public List<CarritosDeCompra> CargarPedidos(int idusuario){
        List<CarritosDeCompra> carritos = new List<CarritosDeCompra>();
        foreach(var carrito in CarritosDeCompra){
            if(carrito.idusuario == idusuario){carritos.Add(carrito);}
        }

        return carritos;
    }

    public List<CarritosDeCompra> ObtenerCarritoCompra(int idusuario){
        List<CarritosDeCompra> carritoDeCompras = new List<CarritosDeCompra>();
        carritoDeCompras = CarritosDeCompra.Where(c => c.idusuario == idusuario && c.estado == "En espera de pago").ToList();
        return carritoDeCompras;
    }

    public List<ListaDeseados> ObtenerListaDeseados(int idusuario){
        
        List<ListaDeseados> listadeDeseados = new List<ListaDeseados>();
        listadeDeseados = ListaDeseados.Where(c => c.idusuario == idusuario).ToList();
        return listadeDeseados;
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
                Producto producto = new Producto{idproducto = -1};

        //Buscar en la lista de productos de la tienda el id y devolver ese productos
        foreach (Producto prod in Productos)
            {
                if (prod.idproducto.ToString() == idbuscado){producto = prod;}
            }
            return producto;
    }

    public Producto buscarIDTodos(string idbuscado)
    {
        Producto producto = new Producto{idproducto = -1};
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


    public void EliminarProductoDeListaDeseados(int idusuario, string idproducto)
    {
        var listaUser = ListaDeseados.FirstOrDefault(c => c.idusuario == idusuario);

        if (listaUser != null)
        {
            // Separar los id de los productos y cantidades en listas
            List<string> productos = listaUser.idproductos.Split(',').ToList();

            // Buscar la posición del producto en la lista
            int index = productos.IndexOf(idproducto);

            if (index != -1)
            {
                // Eliminar el producto y su cantidad
                productos.RemoveAt(index);

                // Actualizar el carrito
                listaUser.idproductos = string.Join(",", productos);
                // Si no quedan productos, eliminar el carrito
                if (productos.Count == 0)
                {
                    ListaDeseados.Remove(listaUser);
                    unitOfWorkListaDeseados.DeletedList.Push(listaUser);
                    Console.WriteLine("Lista de Deseados eliminada");
                }
                else
                {
                    Console.WriteLine("Producto eliminado de la Lista de Deseados");
                    unitOfWorkListaDeseados.UpdatedList.Push(listaUser);

                }
            }
            else
            {
                Console.WriteLine("El producto no esta en Lista de Deseados");
            }
        }
        else
        {
            Console.WriteLine("No se encontró Lista de Deseados para el usuario especificado");
        }
    }

    public bool validarUnProducto(string idBuscado)
    {
        Producto producto = new Producto{idproducto = -1};
        foreach (Producto prod in Productos)
        {
            if (prod.idproducto.ToString() == idBuscado){producto = prod;}
        }
        if(producto.idproducto != -1 && producto.validado == false){
            producto.validado = true;
            producto.idtecnico = -1;
            return true;
        }else return false;
    }

    public List<Producto> GetProductosRecomendados(){
        List<Producto> productosRecomendados = new List<Producto>();
        foreach (Producto prod in Productos) {
        if (prod.descuento != 0){productosRecomendados.Add(prod);}}
        productosRecomendados = productosRecomendados.OrderByDescending(p => p.descuento).ToList();
        return productosRecomendados;
    }


    public bool validarProductoGuardado(string idBuscado)
    {
        Producto producto = new Producto{idproducto = -1};
        foreach (Producto prod in Productos)
        {
            if (prod.idproducto.ToString() == idBuscado){prod.guardado = false;}
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
            if (prod.idproducto > mayorID){mayorID = prod.idproducto ?? 0;}
        }

        return mayorID;
    }

    public int MayorIDUsuario(){
        int mayorID = 0;
        foreach (Usuario usu in Usuarios)
        {
            if (usu.idusuario > mayorID){mayorID = usu.idusuario;}
        }
        return mayorID;
    }

    public void agregarUser(Usuario usuario){
        Usuarios.Add(usuario);
        unitOfWorkUsuario.AddedList.Push(usuario);
    }

    public void agregarProducto(Producto prod){
        Productos.Add(prod);
        unitOfWorkProducto.AddedList.Push(prod);
    }

    public void actualizarProdGuardado(string idbuscado,string nombreProd, string precioProd, string categoriaProd,string descripcionProd,
                                                        string imgProd, int cantProd,int puntHuella,string certiH,int descuento)
    {
        Producto producto = new Producto{idproducto = -1};
        //Buscar en la lista de productos de la tienda el id y devolver ese productos
        foreach (Producto prod in Productos)
            {
                if (prod.idproducto.ToString() == idbuscado){producto = prod;}
            }
        producto.nombreproducto = nombreProd;    
        producto.precio = precioProd;
        producto.categoria = categoriaProd;
        producto.descripcion = descripcionProd;
        producto.imagenes = imgProd;
        producto.cantidad = cantProd;
        producto.puntuacionEco = puntHuella;
        producto.certificadoEco = certiH;
        producto.descuento = descuento;
        unitOfWorkProducto.UpdatedList.Push(producto);
    }

public void actualizarProd(string idbuscado, string precioProd,string descripcionProd, int cantProd, int descuento)
    {
        Producto producto = new Producto{idproducto = -1};
        //Buscar en la lista de productos de la tienda el id y devolver ese productos
        foreach (Producto prod in Productos)
            {
                if (prod.idproducto.ToString() == idbuscado){producto = prod;}
            }   
        producto.precio = precioProd;
        producto.descripcion = descripcionProd;
        producto.cantidad = cantProd;
        producto.descuento = descuento;
    }

    public void eliminarProductoID(string idbuscado)
    {
        Producto producto = new Producto{idproducto = -1};
        //Buscar en la lista de productos de la tienda el id y devolver ese productos
        foreach (Producto prod in Productos)
            {
                if (prod.idproducto.ToString() == idbuscado)
                {
                    Productos.Remove(prod);
                    unitOfWorkProducto.DeletedList.Push(prod);
                }
            }
    }

    public List<Producto> GetProductosVendedor(int idVendedor)
    {     
        List<Producto> productos = new List<Producto>();
        //Buscar en la lista de productos de la tienda el id y devolver ese productos
        foreach (Producto prod in Productos)
            {
                if (prod.idvendedor == idVendedor && prod.validado == true){productos.Add(prod);}
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
            unitOfWorkBusqueda.AddedList.Push(busqueda);       
    }

    public Usuario buscarUsuario(String correo, String password)
    {
            Usuario usuarioFalso = new Tecnico(0,"Prueba", 1000, "Pruebacorreo", "Pruebacontra", "Yo que se", "Tecnico");
            Usuario usuarioEncontrado;

            usuarioEncontrado = Usuarios.Find(u => u.correo == correo && u.contraseña == password) ?? usuarioFalso;
            if(usuarioEncontrado.correo == correo && usuarioEncontrado.contraseña == password){
                UsuarioRegistrado = usuarioEncontrado;
                return usuarioEncontrado;
            }

            else{return usuarioFalso;}
    }

    public Usuario buscarUsuario(int idusuario){
        Usuario usuarioFalso = new Tecnico(0,"Prueba", 1000, "Pruebacorreo", "Pruebacontra", "Yo que se", "Tecnico");
        Usuario usuarioEncontrado;

        usuarioEncontrado = Usuarios.Find(u => u.idusuario == idusuario) ?? usuarioFalso;
        return usuarioEncontrado;
    }

    public bool GuardarDatosUsuario(int idusuario, int numTarjeta, string fechaCaducidad, int cvv){
    var ok= false;
        foreach(Usuario usuario in Usuarios){
            if(usuario.idusuario == idusuario){
                var comprador = usuario as Comprador;
                comprador.numeroTarjeta = numTarjeta;
                comprador.fechaCaducidad = fechaCaducidad;
                comprador.CVV = cvv;
                ok = true;
                unitOfWorkUsuario.UpdatedList.Push(usuario);
                Console.WriteLine("Usuario modificado\n");
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
    // Esta operacion seria la de buscar() en patron comando   
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
                if (prod.idvendedor == idVendedor && prod.guardado == true){productos.Add(prod);}
            }
        return productos;
    }

    public List<Producto> GetProductosAValidarTecnico(int idTecnico){
            
        List<Producto> productos = new List<Producto>();

        //Buscar en la lista de productos de la tienda el id y devolver ese productos
        foreach (Producto prod in Productos)
            {
                if (prod.idtecnico == idTecnico && prod.validado == false){productos.Add(prod);}
            }
        return productos;
    }

    public bool asignarPro(string idbuscado,int idusu)
    {
        Producto producto = new Producto{idproducto = -1};
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
        Producto producto = new Producto{idproducto = -1};
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

    public void borrarCuenta(int idusuario){
        Usuario usuarioFalso = new Comprador(0,"Prueba", 1000, "Pruebacorreo", "Pruebacontra", "Yo que se",1 , "Tecnico", 1, "Yo que se", "Yo que se");
        Usuario usuarioEncontrado = Usuarios.Find(x => x.idusuario == idusuario) ?? usuarioFalso;
        Usuarios.Remove(usuarioEncontrado);
        unitOfWorkUsuario.DeletedList.Push(usuarioEncontrado);
    }

    public bool buscarCorreo(string correo){
            var usuarioEncontrado = Usuarios.Find(u => u.correo == correo);
            if(usuarioEncontrado != null){
                return true;
            }else{
                return false;
            }
    }

    //VANESA HE HECHO LA FUNCION BUSCARUSUARIO(IDUSUARIO), CREO QUE FUNCIONA IGUAL, COMPRUEBA QUE ES VERDAD
    //Y BORRA LO DE BUSCARUSERVENDEDOR Y BUSCARUSERCOMPRADOR
    public Vendedor buscarUserVendedor(string idbuscado){
        var usuarioEncontrado = Usuarios.Find(u => u.idusuario.ToString() == idbuscado);
        if (usuarioEncontrado != null) {
            return (Vendedor) usuarioEncontrado;
        } else {
            Vendedor vendedor = new Vendedor{
                idusuario = -1
            };
            return vendedor;
        }
    }

    public Comprador buscarUserComprador(string idbuscado){
        var usuarioEncontrado = Usuarios.Find(u => u.idusuario.ToString() == idbuscado);
        return (Comprador) usuarioEncontrado;
    }

    public Vendedor actualizarVendedor(string nombre, int movil, string correo, string contraseña,
                                   string direccion, string nombreTienda,int telefonoTienda,string imagPerfil,string idvendedor){
            var vendedor = (Vendedor) Usuarios.Find(u => u.idusuario.ToString() == idvendedor);
            vendedor.nombre=nombre;
            vendedor.movil=movil;
            vendedor.correo=correo;
            vendedor.contraseña=contraseña;
            vendedor.direccion=direccion;
            vendedor.nombretienda=nombreTienda;
            vendedor.telefonotienda=telefonoTienda;
            vendedor.fotoPerfil=imagPerfil;
            return vendedor;
    }

    public Comprador actualizarComprador(string nombre, int movil, string correo, string contraseña,
                                   string direccionEnvio, string fechaCaducidad,string direccionFacturacion,int NumTarjeta,
                                   int cvv,string imgPerfil,string idcomprador){
            var comprador = (Comprador) Usuarios.Find(u => u.idusuario.ToString() == idcomprador);
            comprador.nombre=nombre;
            comprador.movil=movil;
            comprador.correo=correo;
            comprador.contraseña=contraseña;
            comprador.direccion=direccionEnvio;
            comprador.fechaCaducidad=fechaCaducidad;
            comprador.direccionFacturacion=direccionFacturacion;
            comprador.numeroTarjeta=NumTarjeta;
            comprador.CVV=cvv;
            comprador.fotoPerfil=imgPerfil;
            return comprador;
    }


//no puedo tener instantáneas en la clase tienda. Hay que manejarlas en la calse Usuario  

bool PrimInstantCreada = false;

public bool VerificarContraseñas(string nuevaContraseña, int idUsuario)
{
    // Usuario por defecto en caso de no encontrar el usuario buscado
    Usuario usuarioFalso = new Tecnico(0, "Prueba", 1000, "PruebaCorreo", "PruebaContra", "Yo que se", "Tecnico");
    Usuario usuarioEncontrado = Usuarios.Find(u => u.idusuario == idUsuario) ?? usuarioFalso;

    //creo la primera instantánea del usuario
    if(!PrimInstantCreada){
        Console.WriteLine("No xiste instantánea, guardo la primera contraseña");
        usuarioEncontrado.CrearInstantaneaUsuario(usuarioEncontrado.contraseña??"");
        PrimInstantCreada = true;
    }

    //NO utilizamos el memento para vovler atrás, sino para utilizarlo como simple comparación para luego actualizarlo
    var ok = usuarioEncontrado.ComprobarContraseña(nuevaContraseña);
    return ok;
}


//Este método no te deja usarlo, hasta que no hayas hecho algún cambio en el usuario
// por lo tanto, si el usuario ha modificado la contraseña, va a existir instantánea y asi la "ACTUALIZO", 
//guardándola en el diccionario en el mismo sito. Si no ha modificado la contraseña, creo la instantánea con la contraseña vieja
public void GuardarInstantaneaUsuario(string nuevaContraseña, int idUsuario){
    // Usuario por defecto en caso de no encontrar el usuario buscado
    Usuario usuarioFalso = new Tecnico(0, "Prueba", 1000, "PruebaCorreo", "PruebaContra", "Yo que se", "Tecnico");
    Usuario usuarioEncontrado = Usuarios.Find(u => u.idusuario == idUsuario) ?? usuarioFalso;

    usuarioEncontrado.CrearInstantaneaUsuario(nuevaContraseña);
    usuarioEncontrado.contraseña = nuevaContraseña;
}

}


    
