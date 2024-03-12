using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Postgrest.Models;
using Supabase;
using Supabase.Interfaces;
using CyberMercadillo.Models;
using Newtonsoft.Json;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<Supabase.Client>(cliente =>
    new Supabase.Client(
        builder.Configuration["https://eymloqwpndmgytltgyjn.supabase.co"] ?? "https://eymloqwpndmgytltgyjn.supabase.co",
        builder.Configuration["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bWxvcXdwbmRtZ3l0bHRneWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1NjMzMzEsImV4cCI6MjAyNTEzOTMzMX0.pd32IFNMJSpXH2vpB9EG0BrR-yjASIF6LAvBzeRuamc"] ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bWxvcXdwbmRtZ3l0bHRneWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1NjMzMzEsImV4cCI6MjAyNTEzOTMzMX0.pd32IFNMJSpXH2vpB9EG0BrR-yjASIF6LAvBzeRuamc",
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



//Crear objetos
app.MapPost("/añadir",  async (Supabase.Client client) => 
{
    var producto = new Producto
    {
        Name = "Producto CCC"
    };

    await client.From<Producto>().Insert(new List<Producto> { producto });

    return Results.Ok("Producto created successfully");
});


//Buscar Productos
app.MapPost("/buscar",  async (Supabase.Client client) => 
{
    string nombreBuscado = "Producto B";
    var result = await client.From<Producto>().Filter("Nombre",Postgrest.Constants.Operator.Equals,nombreBuscado).Single();

    #nullable disable
    var respuesta = result.id!.ToString() ?? "No existe ese producto";
    #nullable restore
    return Results.Ok(respuesta);

});


app.MapPost("/producto", async (HttpContext context,Supabase.Client client) =>
{
    // Leer el cuerpo de la solicitud para obtener la información de búsqueda
    using (var reader = new StreamReader(context.Request.Body))
    {
        try{
            var requestBody = await reader.ReadToEndAsync();
            var searchData = JsonConvert.DeserializeObject<SearchData>(requestBody);

            // Utilizar searchData.searchTerm en la lógica de búsqueda
            var nombreBuscado = searchData!.searchTerm ?? "Producto B";
            var result = await client.From<Producto>().Filter("Nombre", Postgrest.Constants.Operator.Equals, nombreBuscado).Single();

            // Devolver la respuesta al frontend
            var jsonResponse = new { resultado = result?.id.ToString() ?? "No existe ese producto" };
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

app.MapGet("/status", () => Results.Ok("El backend está en funcionamiento correctamente."));

app.Run();


public class SearchData
{
    public string? searchTerm { get; set;}
}