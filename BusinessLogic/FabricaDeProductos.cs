using Postgrest.Attributes;
using Postgrest.Models;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Postgrest.Models;
using Supabase;
using Supabase.Interfaces;
using CyberMercadillo.Models;
using Newtonsoft.Json;

//Crear objetos


//Terminar de mirar esto que es el método de creación de Fabrica
namespace CyberMercadillo.BusinessLogic{ 
    public class FabricaDeProductos{

        public FabricaDeProductos(){}
        public Producto CrearProducto(string nombre, string precioProducto, string cantidadPro, string descripcionProd, string img) {
            return new Producto(nombre,precioProducto,cantidadPro,descripcionProd,img);
        }
    }
    /*app.MapPost("/añadir",  async (Supabase.Client client) => 
    {
        var producto = new Producto{
            nombreproducto = "Producto CCC"
        };
        return producto;
    });
    */
}
