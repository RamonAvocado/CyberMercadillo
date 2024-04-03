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



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<Supabase.Client>(cliente =>
    new Supabase.Client(
        builder.Configuration["https://mkuspisvkpkvyxfxcgfk.supabase.co"] ?? "https://mkuspisvkpkvyxfxcgfk.supabase.co",
        builder.Configuration["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rdXNwaXN2a3Brdnl4ZnhjZ2ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk3NTgyNjEsImV4cCI6MjAyNTMzNDI2MX0.5meCQtNIfiAIgsiWJppLHQ_tMfD0Y5hM4hhNFdntokM"] ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rdXNwaXN2a3Brdnl4ZnhjZ2ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk3NTgyNjEsImV4cCI6MjAyNTMzNDI2MX0.5meCQtNIfiAIgsiWJppLHQ_tMfD0Y5hM4hhNFdntokM",
        new SupabaseOptions
        {
            AutoRefreshToken = true,
            AutoConnectRealtime = true
        }));
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        //https://ramonavocado.github.io/CyberMercadillo/
        //http://127.0.0.1:5500
        builder.AllowAnyOrigin();
        builder.AllowAnyHeader();
        builder.AllowAnyMethod();
    });
});



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigin");


/*
*   Los metodos de SUPABASE, son:
    And, BaseUrl, Clear, Columns, Count, Delete, Equals, Filter<>, GenerateUrl, Get,
    GetHashCode, GetHeaders, GetType, Insert, Limit, Match, Match, Not, Not<>, Offset, 
    OnConflict, Or, Order, Range, Select, Set, Single, TableName, ToString, Update, Upsert, Where
*
*/

//Crear objetos de manera manual
app.MapPost("/añadir",  async (Supabase.Client client) => 
{
    FabricaDeProductos f1 = new FabricaDeProductos();
    Producto prod = f1.CrearProducto("Smartphone XX","20","CatPrueba","Nuevo Smatphone Pro xx Max","imagen.jpg",5,7);
    await client.From<Producto>().Insert(new List<Producto> { prod });

    return Results.Ok("Producto created successfully");
});


//Buscar Productos de manera manual
app.MapPost("/buscar",  async (Supabase.Client client) => 
{
    string nombreBuscado = "Smartphone X";
    var result = await client.From<Producto>().Filter("nombreproducto",Postgrest.Constants.Operator.Equals,nombreBuscado).Single();

    #nullable disable
    var respuesta = result.idproducto!.ToString() ?? "No existe ese producto";
    #nullable restore
    return Results.Ok(respuesta);

});

// Obtinene los 6 primeros productos, ya que no hay productos destacados
app.MapGet("/ObtenerProductosDestacados", async (HttpContext context, Supabase.Client client) =>
{
    try
    {
        // Obtener los 6 primeros productos desde la base de datos
        var productos = await client.From<Producto>().Select("idproducto, nombreproducto, precio, descripcion, imagen").Limit(6).Get();

        // Devolver los productos al frontend
        var jsonResponse = new { productos };
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
    }
    catch (Exception ex)
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "text/plain";
        await context.Response.WriteAsync($"Error interno del servidor: {ex.Message}");
    }
});

app.MapGet("/ObtenerProductosVendedor", async (HttpContext context, Supabase.Client client) =>
{
    try
    {      
        var productos = await client.From<Producto>()
        .Where(p => p.idvendedor == 5)
        .Select("idproducto, nombreproducto, precio, descripcion, imagen")
        .Get();

        var jsonResponse = new { productos };
        //var productos = await client.From<Producto>().Select("idproducto, nombreproducto, precio, descripcion, imagen").Limit(6).Get();

        // Devolver los productos al frontend
        //var jsonResponse = new { productos };
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
    }
    catch (Exception ex)
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "text/plain";
        await context.Response.WriteAsync($"Error interno del servidor: {ex.Message}");
    }
});

/*Busca un producto desde el forntend
app.MapPost("/BuscarProducto", async (HttpContext context,Supabase.Client client) =>
{
    // Leer el cuerpo de la solicitud para obtener la información de búsqueda
    using (var reader = new StreamReader(context.Request.Body))
    {
        try{
            var requestBody = await reader.ReadToEndAsync();
            var searchData = JsonConvert.DeserializeObject<SearchData>(requestBody);

            // Utilizar searchData.searchTerm en la lógica de búsqueda
            var nombreBuscado = searchData!.searchTerm ?? "Producto de Serie Busqueda";
            var result = await client.From<Producto>().Filter("nombreproducto", Postgrest.Constants.Operator.Equals, nombreBuscado).Single();

            // Devolver la respuesta al frontend
            var jsonResponse = new { resultado = result?.idproducto.ToString() ?? "No existe ese producto" };
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
        } catch (Exception ex)
        {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "text/plain";  // Establecer el tipo de contenido si no es JSON
            await context.Response.WriteAsync($"Error interno del servidor: {ex.Message}");
        }
        
    }
});*/


//Busca un producto desde el forntend
app.MapPost("/BuscarProducto", async (HttpContext context,Supabase.Client client) =>
{
    // Leer el cuerpo de la solicitud para obtener la información de búsqueda
    using (var reader = new StreamReader(context.Request.Body))
    {
        try{
            var requestBody = await reader.ReadToEndAsync();
            var searchData = JsonConvert.DeserializeObject<SearchData>(requestBody);

            // Utilizar searchData.searchTerm en la lógica de búsqueda
            var nombreBuscado = searchData!.searchTerm ?? "Auriculares Bluetooth";
            var categoriaBuscada = searchData!.category ?? "Electrónica";

            var query = client.From<Producto>().Filter("nombreproducto", Postgrest.Constants.Operator.Equals, nombreBuscado);


           // Aplicar el filtro de la categoría si existe
           /*
            if (!string.IsNullOrEmpty(categoriaBuscada))
            {
                query = query.Filter("categoria", Postgrest.Constants.Operator.Equals, categoriaBuscada);
            }
*/
            // Ejecutar la consulta
            var producto = await query.Single();


            // Devolver la respuesta al frontend
            var jsonResponse = new { resultado = producto?.idproducto.ToString() ?? "No existe ese producto" };
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
        } catch (Exception ex)
        {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "text/plain";  // Establecer el tipo de contenido si no es JSON
            await context.Response.WriteAsync($"Error interno del servidor: {ex.Message}");
        }
        
    }
});

app.MapGet("/ObtenerProductoPorID", async (HttpContext context, Supabase.Client client) =>
{
    using (var reader = new StreamReader(context.Request.Body))
    {
        try{      
            var requestBody = await reader.ReadToEndAsync();
                var searchData = JsonConvert.DeserializeObject<SearchData>(requestBody);

                // Utilizar searchData.searchTerm en la lógica de búsqueda
                var idBuscado = searchData!.searchTerm ?? "3";
                var query = client.From<Producto>().Filter("idProducto", Postgrest.Constants.Operator.Equals, idBuscado);
                var producto = await query.Single();


                // Devolver la respuesta al frontend
                var jsonResponse = new { resultado = producto?.idproducto.ToString() ?? "No existe ese producto" };
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
        }
        catch (Exception ex)
        {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "text/plain";
            await context.Response.WriteAsync($"Error interno del servidor: {ex.Message}");
        }
    }
});


app.MapGet("/buscarProductoX", async (HttpContext context, Supabase.Client client) =>
{
    try
    {      
        //string nombreBuscado = "Smartphone X";
        var result = await client.From<Producto>()
                                .Where(p => p.idproducto== 3)
                                .Select("precio, cantidad, categoria, descripcion, imagen, nombreproducto")
                                .Get();

        // Devolver los productos al frontend
        var jsonResponse = new { result };
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
    }
    catch (Exception ex)
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "text/plain";
        await context.Response.WriteAsync($"Error interno del servidor: {ex.Message}");
    }
});
//Metodo para agreagar producto desde el frontend
app.MapPost("/AgregarProducto", async (HttpContext context,Supabase.Client client) =>
{
    // Leer el cuerpo de la solicitud para obtener la información de búsqueda
    using (var reader = new StreamReader(context.Request.Body))
    {
        try{
            var requestBody = await reader.ReadToEndAsync();
            var productoData = JsonConvert.DeserializeObject<Producto>(requestBody);

            // Utiliza los datos recibidos para crear un nuevo producto
            var fabrica = new FabricaDeProductos();

#pragma warning disable CS8602 // Esto es para quitar un warning raro

            var nuevoProducto = fabrica.CrearProducto(
                productoData.nombreproducto ?? "Producto de Serie Creación", //Este tmb
                productoData.precio ?? "-1", 
                productoData.categoria ?? "CatPrueba", 
                productoData.descripcion ?? "Este articulo es el predeterminado por si llega un null a esta funcion", 
                productoData.imagen ?? "/rutaPrueba",  //Este lo pone siempre
                productoData.cantidad ?? -1,//predeterminado que si llega un nulo, sea -1 
                productoData.idvendedor ?? -1);

#pragma warning restore CS8602 // Y aqui para volver a instaurarlo

            // Inserta el nuevo producto en la base de datos
            await client.From<Producto>().Insert(new List<Producto> { nuevoProducto });

            // Devuelve una respuesta al frontend (opcional)
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync("Producto creado exitosamente");
        } catch (Exception ex)
        {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "text/plain";  // Establecer el tipo de contenido si no es JSON
            await context.Response.WriteAsync($"Error al crear el producto: {ex.Message}");
        }
    }
    return Results.Ok("Producto created successfully"); 
});


app.MapPost("/guardar_producto", async (HttpContext context, Supabase.Client client) =>
{
    try
    {
        // Leer el cuerpo de la solicitud para obtener los datos del producto
        using (var reader = new StreamReader(context.Request.Body))
        {
            var requestBody = await reader.ReadToEndAsync();
            var productoData = JsonConvert.DeserializeObject<Producto>(requestBody);

            // Utilizar los datos recibidos para crear un nuevo producto
            var nuevoProducto = new Producto
            {
                nombreproducto = productoData.nombreproducto,
                precio = productoData.precio,
                categoria = productoData.categoria,
                descripcion = productoData.descripcion,
                imagen = productoData.imagen,
                cantidad = productoData.cantidad
            };

            // Insertar el nuevo producto en la base de datos
            await client.From<Producto>().Insert(new List<Producto> { nuevoProducto });

            // Devolver una respuesta al cliente
            context.Response.StatusCode = 200;
            context.Response.ContentType = "text/plain";
            await context.Response.WriteAsync("Producto creado exitosamente");
        }
    }
    catch (Exception ex)
    {
        // Manejar cualquier error y devolver una respuesta de error al cliente
        context.Response.StatusCode = 500;
        context.Response.ContentType = "text/plain";
        await context.Response.WriteAsync($"Error al guardar el producto: {ex.Message}");
    }
});

app.MapGet("/status", () => Results.Ok("El backend está en funcionamiento correctamente."));

app.Run();


public class SearchData
{
    public string? searchTerm { get; set;}
    public string? category {get; set;}
}

