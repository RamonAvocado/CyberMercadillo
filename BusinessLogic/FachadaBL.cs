using CyberMercadillo.BusinessLogic;
using CyberMercadillo.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

    class FachadaBL
    {
        List<Producto> productos= new List<Producto>();
        List<Busqueda> busquedas= new List<Busqueda>();
        List<Usuario> usuarios= new List<Usuario>();
        List<Compra> compras= new List<Compra>();
        List<Tecnico> tecnicos= new List<Tecnico>();
        public void main(List<Producto> p1, List<Busqueda> p2, List<Usuario> p3, List<Compra> p4, List<Tecnico> p5)
        {
            productos = p1;
            busquedas = p2;
            usuarios = p3;
            compras = p4;
            tecnicos = p5;
            Console.WriteLine(productos.Count);
        }
        
    }
    
