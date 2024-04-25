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
        var result1 = await client.From<Producto>().Get();
        var result2 = await client.From<Busqueda>().Get();
        var result3 = await client.From<Comprador>().Get();
        var result4 = await client.From<Vendedor>().Get();
        var result5 = await client.From<Tecnico>().Get();
        var result6 = await client.From<Compra>().Get();


        foreach (var item1 in result1.Models){
            tienda.Productos.Add(item1);
        }
        foreach (var item2 in result2.Models){
            tienda.Busquedas.Add(item2);
        }
        foreach (var item3 in result3.Models){
            tienda.Compradores.Add(item3);
        }
        foreach (var item4 in result4.Models){
            tienda.Vendedores.Add(item4);
        }
        foreach (var item5 in result5.Models){
            tienda.Tecnicos.Add(item5);
        }
        foreach (var item6 in result6.Models){
            tienda.Compras.Add(item6);
        }


        tienda.pregunta();
    });


    app.Run();
    }
}

