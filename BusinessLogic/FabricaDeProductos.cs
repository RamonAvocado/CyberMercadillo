using Postgrest.Attributes;
using Postgrest.Models;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Supabase;
using Supabase.Interfaces;
using CyberMercadillo.Entities;
using Newtonsoft.Json;

//Crear objetos


//Terminar de mirar esto que es el método de creación de Fabrica
namespace CyberMercadillo.BusinessLogic{ 
    public class FabricaDeProductos{

        public FabricaDeProductos(){}
        public Producto CrearProducto(string nombreProd, string precioProd, string categoriaProd, string descripcionProd, string imgProd, int cantProd) {
            return new Producto(nombreProd,precioProd,categoriaProd,descripcionProd, imgProd, cantProd);
        }
    }
}