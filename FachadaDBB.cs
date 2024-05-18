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
using Postgrest.Exceptions;

class FachadaDBB{
    // PREGUNTA
    private Supabase.Client client;
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
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
        var carritos = await supabase.From<CarritosDeCompra>().Get();
        var listaDes = await supabase.From<ListaDeseados>().Get();

        foreach (var producto in productos.Models){
            tienda.Productos.Add(producto);
        }
        foreach (var busqueda in busquedas.Models){
            tienda.Busquedas.Add(busqueda);
        }
        foreach (var comprador in compradores.Models){
            tienda.Usuarios.Add(comprador);
        }
        foreach (var vendedor in vendedores.Models){
            tienda.Usuarios.Add(vendedor);
        }
        foreach (var tecnico in tecnicos.Models){
            tienda.Usuarios.Add(tecnico);
        }
        foreach(var carrito in carritos.Models){
            tienda.CarritosDeCompra.Add(carrito);
        }
        foreach(var listaDeseados in listaDes.Models){
            tienda.ListaDeseados.Add(listaDeseados);
        }
        
        TodoCargadoCargados = true;   
        tienda.Pregunta();     
        }
        else{
            Console.WriteLine("Ya has cargado todo lo de la base de datos, y no puedes volver a cargarlo  :p");
        }

        //dejad la respuesta del json, es para poder comprobar el GeneralMetodos que se han cargado los productos
        var jsonResponse = new {};
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
    });


    app.MapGet("/guardarBDD", async (HttpContext context, Supabase.Client supabase) =>
    { 
        var usuarios = tienda.unitOfWorkUsuario;
        var usu = usuarios.AddedList;
        while (usu.Count > 0)
        {
            var u = usu.Pop();
            if (u.GetType().FullName == "CyberMercadillo.Entities.Comprador")
            {await supabase.From<Comprador>().Insert((Comprador) u);} 
            else if (u.GetType().FullName == "CyberMercadillo.Entities.Vendedor")
            {await supabase.From<Vendedor>().Insert((Vendedor) u);}
            else{await supabase.From<Tecnico>().Insert((Tecnico) u);}
        }

        usu = usuarios.DeletedList;
        while (usu.Count > 0)
        {
            var u = usu.Pop();
            if (u.GetType().FullName == "CyberMercadillo.Entities.Comprador")
            {await supabase.From<Comprador>().Delete((Comprador) u);} 
            else if (u.GetType().FullName == "CyberMercadillo.Entities.Vendedor")
            {await supabase.From<Vendedor>().Delete((Vendedor) u);}
            else{await supabase.From<Tecnico>().Delete((Tecnico) u);}
        }

        usu = usuarios.UpdatedList;
        while (usu.Count > 0)
        {
            var u = usu.Pop();
            if (u.GetType().FullName == "CyberMercadillo.Entities.Comprador")
            {await supabase.From<Comprador>().Update((Comprador) u);} 
            else if (u.GetType().FullName == "CyberMercadillo.Entities.Vendedor")
            {await supabase.From<Vendedor>().Update((Vendedor) u);}
            else{await supabase.From<Tecnico>().Update((Tecnico) u);}
        }

        //productos nuevos
        var productos = tienda.unitOfWorkProducto;
        var pro = productos.AddedList;
        while (pro.Count > 0){var p = pro.Pop();await supabase.From<Producto>().Insert(p);}

        //productos eliminados
        pro = productos.DeletedList;
        while (pro.Count > 0){var p = pro.Pop();await supabase.From<Producto>().Delete(p);}

        //productos actualizdos
        pro = productos.UpdatedList;
        while (pro.Count > 0){var p = pro.Pop();await supabase.From<Producto>().Update(p);}

        //busquedas nuevas (solo tiene busquedas nuevas)
        var busquedas = tienda.unitOfWorkBusqueda.AddedList;
        while (busquedas.Count > 0){var b = busquedas.Pop();await supabase.From<Busqueda>().Insert(b);} 

        //carritos nuevos (solo tiene carritos nuevos)
        var carritos = tienda.unitOfWorkCarritos.AddedList;
        while (carritos.Count > 0){var c = carritos.Pop();await supabase.From<CarritosDeCompra>().Insert(c);}

        //Lista deseados nueva
        var lisDes = tienda.unitOfWorkListaDeseados.AddedList;
        while (lisDes.Count > 0){var lis = lisDes.Pop();await supabase.From<ListaDeseados>().Insert(lis);}

        //Lista deseados actualizada
        lisDes = tienda.unitOfWorkListaDeseados.UpdatedList;
        while (lisDes.Count > 0){var lis = lisDes.Pop();await supabase.From<ListaDeseados>().Update(lis);}

        //Lista deseados eliminada
        /*lisDes = tienda.unitOfWorkListaDeseados.DeletedList;
        while (lisDes.Count > 0)
        {
            var lis = lisDes.Pop();
            await supabase.From<ListaDeseados>().Delete(lis);
        }*/

        Console.WriteLine("\nHa actualizado las tablas");
    });


    app.Run();
    }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.

}

