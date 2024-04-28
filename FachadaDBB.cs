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
    private Supabase.Client client;
    public FachadaDBB(String[] args, WebApplication app, Tienda tienda){
    this.client = client;
    bool TodoCargadoCargados = false;


    //EL BOTON INICIAR SESION DEBERÁ LLAMAR TAMBIÉN A ESTA FUNCION
    app.MapGet("/inicializar", async (HttpContext context, Supabase.Client client) =>
    { 
        if(!TodoCargadoCargados){

        
        var productos = await client.From<Producto>().Get();
        var busquedas = await client.From<Busqueda>().Get();
        var compradores = await client.From<Comprador>().Get();
        var vendedores = await client.From<Vendedor>().Get();
        var tecnicos = await client.From<Tecnico>().Get();
        var compras = await client.From<Compra>().Get();
        


        foreach (var producto in productos.Models){
            tienda.Productos.Add(producto);
        }
        foreach (var busqueda in busquedas.Models){
            tienda.Busquedas.Add(busqueda);
        }
        foreach (var comprador in compradores.Models){
            tienda.Compradores.Add(comprador);
        }
        foreach (var vendedor in vendedores.Models){
            tienda.Vendedores.Add(vendedor);
        }
        foreach (var tecnico in tecnicos.Models){
            tienda.Tecnicos.Add(tecnico);
        }
        foreach (var compra in compras.Models){
            tienda.Compras.Add(compra);
        }

        TodoCargadoCargados = true;   
        tienda.pregunta();     
        }
        else{
            Console.WriteLine("Ya has cargado todo lo de la base de datos, y no puedes volver a cargarlo  :p");
        }

        //para cargar los productos al iniciar
        var jsonResponse = new {};
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
    });
    app.Run();
    }

    public async Task AgregarProductoBDD(Producto prod){
        try
        {
            await client.From<Producto>().Insert(new List<Producto> { prod });
        }
        catch (Exception ex)
        {
            // Manejar cualquier excepción que pueda ocurrir durante la inserción
            Console.WriteLine($"Error al agregar el producto en la base de datos: {ex.Message}");
        }
    }
}

