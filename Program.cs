using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Postgrest.Models;
using Supabase;
using Supabase.Interfaces;
using Newtonsoft.Json;
using CyberMercadillo.BusinessLogic;
using CyberMercadillo.Entities;


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
*   Estos métodos no se utilizan en ningun momento en el frontEnd, son comprobaciones de que el swagger, la conexión
*   con la base de datos funciona, no eliminarlos ya que realmente da igual
*
*/

//Crear objetos de manera manual
app.MapPost("/añadir",  async (Supabase.Client client) => 
{
    FabricaDeProductos f1 = new FabricaDeProductos();
    Producto prod = f1.CrearProducto("Smartphone XX","20","CatPrueba","Nuevo Smatphone Pro xx Max","imagen.jpg",5);
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
                productoData.cantidad ?? -1);//predeterminado que si llega un nulo, sea -1 

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


app.MapGet("/status", () => Results.Ok("El backend está en funcionamiento correctamente."));

app.Run();


public class SearchData
{
    public string? searchTerm { get; set;}
}

