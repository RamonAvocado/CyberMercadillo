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

    private List<CarritoDeCompra> carritos = new List<CarritoDeCompra>();

    public List<CarritoDeCompra> CarritoDeCompras
    {
        get { return carritos; }
        private set { carritos = value; }
    }

    private Usuario usuarioRegistrado = new Comprador("x", 1, "x", "x", "x", 1, "x", 1, "x");
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
            Console.WriteLine("Hay " + CarritoDeCompras.Count + " CarritoDeCompras ");
            
    }


    public bool AñadirAlCarritoCompra(int idusuario, int idproducto, int cantProducto)
    {
        // Verificar si el usuario ya tiene el producto en el carrito
        if (CarritoDeCompras.Any(c => c.idusuario == idusuario && c.idproducto == idproducto))
        {
            Console.WriteLine("El usuario ya tiene este producto en el carrito de compra, así que no lo guardo");
            return false;
        }

        // Crear la nueva línea del carrito de compra
        CarritoDeCompra ProductoCarrito = new CarritoDeCompra(idusuario, idproducto, cantProducto);

        // Agregar el producto al carrito de compras
        CarritoDeCompras.Add(ProductoCarrito);

        /*Console.WriteLine("El id del usuario: " + ProductoCarrito.idusuario);
        Console.WriteLine("El producto seleccionado: " + ProductoCarrito.idproducto);
        Console.WriteLine("Cantidad de producto: " + ProductoCarrito.cantidad);*/
        Console.WriteLine("Ahora hay: " + CarritoDeCompras.Count() + " Productos en CarritoDeCompras");
        
    return true;
    }

    public List<CarritoDeCompra> ObtenerCarritoCompra(int idusuario){
            
        List<CarritoDeCompra> carritoDeCompras = new List<CarritoDeCompra>();

        carritoDeCompras = CarritoDeCompras.Where(c => c.idusuario == idusuario).ToList();

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

    public bool ActualizarCantidadProducto(int idproducto, int nuevaCantidad)
    {
        
        var productoEncontrado = false;
        for (int i = 0; i < CarritoDeCompras.Count; i++)
        {
            if (CarritoDeCompras[i].idproducto == idproducto)
            {
                // Actualizar la cantidad del producto
                CarritoDeCompras[i].cantidad = nuevaCantidad;
                productoEncontrado = true;
                break; // Salir del bucle una vez que se actualice la cantidad
            }
        }
        return productoEncontrado;
    }

    public void EliminarProductoDelCarrito(int idproducto)
    {
        List<CarritoDeCompra> NuevoCarritoDeCompras = new List<CarritoDeCompra>();

        foreach(CarritoDeCompra producto in CarritoDeCompras)
        {
            //la logica para coger todos los productos del carrito menos el que quiero eliminar
            if(producto.idproducto != idproducto){
                NuevoCarritoDeCompras.Add(producto);
            }
        }
        CarritoDeCompras = NuevoCarritoDeCompras;
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

    public void actualizarProdGuardado(string idbuscado,string nombreProd, string precioProd, string categoriaProd,string descripcionProd,
                                                        string imgProd, int cantProd,int puntHuella)
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
        Busqueda busqueda = new Busqueda
        {
            texto = searchTerm,
            fecha = DateTime.Now,
            idusuario = idBuscado,
        };
            Busquedas.Add(busqueda);         
    }

    public Usuario buscarUsuario(String correo, String password)
    {
            Usuario usuarioFalso = new Tecnico("Prueba", 1000, "Pruebacorreo", "Pruebacontra", "Yo que se", "Tecnico");
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
            Usuario usuarioFalso = new Tecnico("Prueba", 1000, "Pruebacorreo", "Pruebacontra", "Yo que se", "Tecnico");
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
            //Console.WriteLine("searchTermLower: "+ searchTerm);

        var searchTermLower = searchTerm.ToLowerInvariant();
        //Buscar en la lista de productos de la tienda el id y devolver ese productos
        foreach (Producto prod in Productos)
            {
                if(prod.nombreproducto.IndexOf(searchTermLower, StringComparison.OrdinalIgnoreCase) >= 0 || prod.descripcion.IndexOf(searchTermLower, StringComparison.OrdinalIgnoreCase) >= 0)
                {
                productos.Add(prod);
                //Console.WriteLine("prod: " + prod.nombreproducto);
                }
            }
            
            Console.WriteLine("total: "+ productos.Count());
        //guardo la búsqueda
        GuardarBusqueda(searchTerm,idBuscado);

    ProductosBus = productos;

    return ProductosBus;
    }

    public List<Producto> GetProdBusquedaFiltro(string category)
    {
        List<Producto> productos = new List<Producto>();
            //Console.WriteLine("searchTermLower: "+ searchTerm);

        //Buscar en la lista de productos de la tienda el id y devolver ese productos
        foreach (Producto prod in ProductosBus)
        {
            if(prod.categoria == category)
            {
            productos.Add(prod);
            }
        }
        // ¿guardo la búsqueda con la categoría que ahora es un filtro?
        //GuardarBusqueda(searchTerm,idBuscado);
        Console.WriteLine("total: "+ productos.Count());

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
}
    
