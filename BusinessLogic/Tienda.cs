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
    private List<Producto> productosGuardados = new List<Producto>();
    public List<Producto> ProductosGuardados
    {
        get { return productosGuardados; }
        private set { productosGuardados = value; }
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
            
    }


    public void buscar(String texto)
    {
            List<string> nombresProductos = new List<string>();

            Action<Producto> getNombre = (Producto prod) =>
            {
                nombresProductos.Add(prod.nombreproducto ?? "nkjsdns");
            };

            productos.ForEach(getNombre);
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
        if(producto.idproducto == -1){
            foreach (Producto prod in ProductosGuardados)
            {
                if (prod.idproducto.ToString() == idbuscado)
                {
                    producto = prod;
                }
            }
        }  

        return producto;
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
                                                        string imgProd, int cantProd)
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
        foreach (Producto prod in ProductosGuardados)
            {
                if (prod.idproducto.ToString() == idbuscado)
                {
                    ProductosGuardados.Remove(prod);
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

    public void GuardarBusqueda(string categoriaBuscada, string searchTerm, int idBuscado)
    {

        Busqueda busqueda = new Busqueda
        {
            texto = searchTerm,
            categoria = categoriaBuscada,
            fecha = DateTime.Now,
            idusuario = idBuscado,
        };
            Busquedas.Add(busqueda);
            //FALTA GUARDARLA EN LA BASE DE DATOS
            Console.WriteLine("La busqueda es: "+ busqueda.texto);
            Console.WriteLine("Hay un total de búsquedas: "+ Busquedas.Count);
            
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

    public List<Busqueda> getBusquedasUsuario(Usuario user){
        List<Busqueda> busquedasUsuario = new List<Busqueda>();
        foreach(var busqueda in Busquedas){
            if(busqueda.idusuario == user.idusuario){
                busquedasUsuario.Add(busqueda);
            }
        }
        return busquedasUsuario;
    }
       
    public List<Producto> GetProductosBusqueda(string categoriaBuscada, string searchTermLower, int idBuscado)
    {
            
        List<Producto> productos = new List<Producto>();
            Console.WriteLine("categoriaBuscada: "+ categoriaBuscada);
            Console.WriteLine("searchTermLower: "+ searchTermLower);

        //Buscar en la lista de productos de la tienda el id y devolver ese productos
        foreach (Producto prod in Productos)
            {
                if (prod.categoria == categoriaBuscada )
                {
                    if(prod.nombreproducto.IndexOf(searchTermLower, StringComparison.OrdinalIgnoreCase) >= 0 || prod.descripcion.IndexOf(searchTermLower, StringComparison.OrdinalIgnoreCase) >= 0){
                    productos.Add(prod);
                    Console.WriteLine("prod: " + prod.nombreproducto);
                }}
            }
            
            Console.WriteLine("total: "+ productos.Count());
        //guardo la búsqueda
        GuardarBusqueda(categoriaBuscada,searchTermLower,idBuscado);

    return productos;
    } 

    public List<Producto> GetProductosSoloText(string categoriaBuscada, string searchTermLower, int idBuscado)
    {
            
        List<Producto> productos = new List<Producto>();

        //Buscar en la lista de productos de la tienda el id y devolver ese productos
        foreach (Producto prod in Productos)
            {
                if (prod.nombreproducto.IndexOf(searchTermLower, StringComparison.OrdinalIgnoreCase) >= 0)
                {
                    productos.Add(prod);
                    Console.WriteLine("prod: " + prod.nombreproducto);
                }
            }
            
            Console.WriteLine("total: "+ productos.Count());
        //guardo la búsqueda
        GuardarBusqueda(categoriaBuscada,searchTermLower,idBuscado);

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
}
    
