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

        public void pregunta(){
            Console.WriteLine("Hay " + Busquedas.Count + " busquedas ");
            Console.WriteLine("Hay " + Productos.Count + " productos ");
        }


        public void buscar(String texto){
            List<string> nombresProductos = new List<string>();

            Action<Producto> getNombre = (Producto prod) =>
            {
                nombresProductos.Add(prod.nombreproducto ?? "nkjsdns");
            };

            productos.ForEach(getNombre);
        }

        public Producto buscarID(string idbuscado){

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

        public Usuario buscarUsuario(String correo, String password){
            Tecnico usuarioFalso = new Tecnico("Prueba", 1000, "Pruebacorreo", "Pruebacontra", "Yo que se", "Tecnico");
            Usuario usuarioEncontrado = usuarios.Find(u => u.correo == correo && u.contraseña == password) ?? usuarioFalso;
            Console.WriteLine("usuario encontrado "+ usuarioEncontrado.correo);
            if (usuarioEncontrado != null && usuarioEncontrado.contraseña == password)
            {return usuarioEncontrado;}
            else{return usuarioFalso;}
        }
       
        
    }
    
