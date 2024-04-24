using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Postgrest.Models;
using Supabase;
using Newtonsoft.Json;
using CyberMercadillo.BusinessLogic;
using CyberMercadillo.Entities;
using System.Linq;
using Postgrest;
using Postgrest.Responses;
using Newtonsoft.Json.Linq;

class FachadaDBB{

    public FachadaDBB(String[] args, WebApplication app, Tienda tienda){

    //EL BOTON INICIAR SESION DEBERÁ LLAMAR TAMBIÉN A ESTA FUNCION
    app.MapGet("/inicializar", async (HttpContext context, Supabase.Client client) =>
    { 
        List<Producto> productos= new List<Producto>();
        List<Busqueda> busquedas= new List<Busqueda>();
        List<Usuario> usuarios= new List<Usuario>();
        List<Compra> compras= new List<Compra>();
        List<Tecnico> tecnicos= new List<Tecnico>();
        var result1 = await client.From<Producto>().Get();
        var result2 = await client.From<Busqueda>().Get();
        //var result3 = await client.From<Usuario>().Get();
        var result3 = await client.From<Comprador>().Get();
        var result6 = await client.From<Vendedor>().Get();
        var result7 = await client.From<Tecnico>().Get();
        var result4 = await client.From<Compra>().Get();
        var result5 = await client.From<Tecnico>().Get();
        foreach (var item1 in result1.Models){
            tienda.Productos.Add(item1);
        }
        foreach (var item2 in result2.Models){
            tienda.Busquedas.Add(item2);
        }

        tienda.pregunta();
        /*
        foreach (var item3 in result3.Models){
            usuarios.Add(item3);
        }
        //nuevos foreach
        foreach (var item6 in result6.Models){
            usuarios.Add(item6);
        }
        foreach (var item7 in result7.Models){
            usuarios.Add(item7);
        }
        foreach (var item4 in result4.Models){
            compras.Add(item4);
        }
        foreach (var item5 in result5.Models){
            tecnicos.Add(item5);
        }

        tienda.inic(productos, busquedas, usuarios, compras, tecnicos);
        */
    });


    app.Run();
    }
}

