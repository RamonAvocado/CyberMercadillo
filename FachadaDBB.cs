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
        var compras = await supabase.From<Compra>().Get();
        var carritos = await supabase.From<CarritoDeCompra>().Get();

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
        foreach(var carrito in carritos.Models){
            tienda.CarritoDeCompras.Add(carrito);
        }

        TodoCargadoCargados = true;   
        tienda.pregunta();     
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
        var productos = tienda.Productos;
        var busquedas = tienda.Busquedas;
        var compradores = tienda.Compradores;
        var vendedores = tienda.Vendedores;
        var tecnicos = tienda.Tecnicos;
        var compras = tienda.Compras;
        var carritos = tienda.CarritoDeCompras;

        Busqueda b1 = new Busqueda {
            texto = "Smart",
            fecha = DateTime.Now,
            idusuario = 2,
        };
        
        //Añade 10

        await supabase.From<Busqueda>().Where(x => x.idbusqueda != 0).Delete();
        await supabase.From<Busqueda>().Insert(busquedas);

        Console.WriteLine("Ha actualizado las tablas");

    });

    //Este metodo guarda el carrito de compra en la base de datos para no guardar todo, que es peligroso
    app.MapGet("/GuardarCarritoBDD", async (HttpContext context, Supabase.Client supabase) =>
    { 
        //tengo que coger el carrito cuando lo haya actualizado
        var Carrito = tienda.CarritoDeCompras;
        
        if(Carrito.Count == 0){
            Console.WriteLine("nada, no hay productos en el carrito");
        }
        else
        {
            // Insertar los nuevos registros del carrito de compra
            foreach(var prod in Carrito)
            {
                Console.WriteLine("Id ususario: " + prod.idusuario + " id producto: " + prod.idproducto + " cantidad: " + prod.cantidad);

                // Eliminar todos los registros del carrito de compra asociados al usuario, para actualizarlo
                await supabase.From<CarritoDeCompra>().Where(x => x.idusuario == prod.idusuario).Delete();
                //Console.WriteLine(producto);

                    CarritoDeCompra producto = new CarritoDeCompra {
                    idusuario = prod.idusuario,
                    idproducto = prod.idproducto,
                    cantidad = prod.cantidad,
                    };

                await supabase.From<CarritoDeCompra>().Insert(producto);
            }

            Console.WriteLine("Ha actualizado el carrito de compra en la base de datos");
        }
    });

    app.Run();
    }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.

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

