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
        private List<Usuario> usuarios= new List<Usuario>();
        private List<Compra> compras= new List<Compra>();
        private List<Tecnico> tecnicos= new List<Tecnico>();

    
        
        public void inic(List<Producto> p1, List<Busqueda> p2, List<Usuario> p3, List<Compra> p4, List<Tecnico> p5)
        {
            productos = p1;
            busquedas = p2;
            usuarios = p3;
            compras = p4;
            tecnicos = p5;
            Console.WriteLine(productos.Count);
            //main();
        }

        public void pregunta(){
            Console.WriteLine("Hay x busquedas : " + busquedas.Count);
        }


        public void buscar(String texto){
            List<string> nombresProductos = new List<string>();

            Action<Producto> getNombre = (Producto prod) =>
            {
                nombresProductos.Add(prod.nombreproducto ?? "nkjsdns");
            };

            productos.ForEach(getNombre);
        }
        
        
    }
    
