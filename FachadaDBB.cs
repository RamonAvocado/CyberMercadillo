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
        //usuarios nuevos
        var usuarios = tienda.unitOfWorkUsuario;
        var usu = usuarios.AddedList;
        while (usu.Count > 0)
        {
            var u = usu.Pop();
            Console.WriteLine("usuario nuevo: " + u.idusuario);
            if (u.GetType().FullName == "CyberMercadillo.Entities.Comprador")
            {await supabase.From<Comprador>().Insert((Comprador) u);} 
            else if (u.GetType().FullName == "CyberMercadillo.Entities.Vendedor")
            {await supabase.From<Vendedor>().Insert((Vendedor) u);}
            else{
                await supabase.From<Tecnico>().Insert((Tecnico) u);
            }
        }

        //usuarios eliminados
        usu = usuarios.DeletedList;
        while (usu.Count > 0)
        {
            var u = usu.Pop();
            Console.WriteLine("usuario eliminao: " + u.idusuario);
            if (u.GetType().FullName == "CyberMercadillo.Entities.Comprador")
            {await supabase.From<Comprador>().Delete((Comprador) u);} 
            else if (u.GetType().FullName == "CyberMercadillo.Entities.Vendedor")
            {await supabase.From<Vendedor>().Delete((Vendedor) u);}
            else{
                await supabase.From<Tecnico>().Delete((Tecnico) u);
            }
        }

        //usuarios modificados
        usu = usuarios.UpdatedList;
        while (usu.Count > 0)
        {
            var u = usu.Pop();
            Console.WriteLine("usuario modificado: " + u.idusuario);
            if (u.GetType().FullName == "CyberMercadillo.Entities.Comprador")
            {await supabase.From<Comprador>().Update((Comprador) u);} 
            else if (u.GetType().FullName == "CyberMercadillo.Entities.Vendedor")
            {await supabase.From<Vendedor>().Update((Vendedor) u);}
            else{
                await supabase.From<Tecnico>().Update((Tecnico) u);
            }
        }

        //productos nuevos
        var productos = tienda.unitOfWorkProducto;
        var pro = productos.AddedList;
        while (pro.Count > 0)
        {
            var p = pro.Pop();
            Console.WriteLine("producto nuevo: " + p.idproducto);
            await supabase.From<Producto>().Insert(p);
        }

        //productos eliminados
        pro = productos.DeletedList;
        while (pro.Count > 0)
        {
            var p = pro.Pop();
            Console.WriteLine("producto eliminado: " + p.idproducto);
            await supabase.From<Producto>().Delete(p);
        }

        //productos actualizdos
        pro = productos.UpdatedList;
        while (pro.Count > 0)
        {
            var p = pro.Pop();
            Console.WriteLine("producto actualizado: " + p.idproducto);
            await supabase.From<Producto>().Update(p);
        }

        //busquedas nuevas (solo tiene busquedas nuevas)
        /*var busquedas = tienda.unitOfWorkBusqueda.AddedList;
        while (busquedas.Count > 0)
        {
            var b = busquedas.Pop();
            Console.WriteLine("Busqueda nueva: " + b.texto);
            await supabase.From<Busqueda>().Insert(b);
        }*/

        //carritos nuevos
        var carritos = tienda.unitOfWorkCarritos.AddedList;
        while (carritos.Count > 0)
        {
            var c = carritos.Pop();
            
            Console.WriteLine($"Debug: Procesando carrito con idusuario: {c.idusuario}, idproductos: {c.idproductos}, estado: {c.estado}, cantidadProds: {c.cantidadProds}, fecha: {c.fecha}");

            if (c.idusuario == null)
            {
                Console.WriteLine("Error: idusuario es nulo antes de la inserción");
                continue;
            }

            var nuevoCarrito = new CarritosDeCompra {
                idusuario = c.idusuario, // Asegúrate de que este valor no sea nulo
                idproductos = c.idproductos.ToString(), 
                estado = c.estado,
                cantidadProds = c.cantidadProds.ToString(), 
                fecha = c.fecha,
            };            
            try
            {
                await supabase.From<CarritosDeCompra>().Insert(nuevoCarrito);
            }
            catch (PostgrestException ex)
            {
                Console.WriteLine("Failed to insert carrito: " + ex.Message);
            }
        }


        //Lista deseados nueva
        var lisDes = tienda.unitOfWorkListaDeseados.AddedList;
        while (lisDes.Count > 0)
        {
            var lis = lisDes.Pop();
            Console.WriteLine("Carrito modificado: " + lis.idproductos);
            await supabase.From<ListaDeseados>().Insert(lis);
        }

        Console.WriteLine("Ha actualizado las tablas");
    });

    //Este metodo guarda el carrito de compra en la base de datos para no guardar todo, que es peligroso
    //cambiar el estado
/*
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
            foreach(var prod in tienda.CarritoDeCompras)
            {//cambiar el estado
                Console.WriteLine("Id ususario: " + prod.idusuario + ", id producto: " + prod.idproducto + ", cantidad: " + prod.cantidad + ", estado: " + prod.estado);

                // Eliminar todos los registros del carrito de compra asociados al usuario, para actualizarlo
                await supabase.From<CarritoDeCompra>().Where(x => x.idusuario == prod.idusuario).Delete();
                //Console.WriteLine(producto);

                    CarritoDeCompra producto = new CarritoDeCompra {
                    idusuario = prod.idusuario,
                    idproducto = prod.idproducto,
                    cantidad = prod.cantidad,
                    //cambiar el estado
                    //estado = prod.estado,
                    };

                await supabase.From<CarritoDeCompra>().Insert(producto);
            }

            Console.WriteLine("Ha actualizado el carrito de compra en la base de datos");
        }
    });*/

    app.Run();
    }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.

}

