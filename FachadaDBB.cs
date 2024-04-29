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
    bool TodoCargadoCargados = false;


    //EL BOTON INICIAR SESION DEBERÁ LLAMAR TAMBIÉN A ESTA FUNCION
    app.MapGet("/inicializar", async (HttpContext context, Supabase.Client supabase) =>
    { 
        if(!TodoCargadoCargados){

        var productos = await supabase.From<Producto>().Get();
        var busquedas = await supabase.From<Busqueda>().Get();
        var compradores = await supabase.From<Comprador>().Get();
        var vendedores = await supabase.From<Vendedor>().Get();
        var tecnicos = await supabase.From<Tecnico>().Get();
        var compras = await supabase.From<Compra>().Get();

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
    });


    app.MapGet("/guardarBDD", async (HttpContext context, Supabase.Client supabase) =>
    { 
        var productos = tienda.Productos;
        var busquedas = tienda.Busquedas;
        var compradores = tienda.Compradores;
        var vendedores = tienda.Vendedores;
        var tecnicos = tienda.Tecnicos;
        var compras = tienda.Compras;

        Busqueda b1 = new Busqueda {
            texto = "Smart",
            fecha = DateTime.Now,
            idusuario = 2,
            categoria = "Todas las categorias",
        };

        busquedas.Add(b1);
        
        //Añade 10

        await supabase.From<Busqueda>().Where(x => x.idbusqueda != 0).Delete();
        await supabase.From<Busqueda>().Insert(busquedas);

        Console.WriteLine("Ha actualizado las tablas");

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

