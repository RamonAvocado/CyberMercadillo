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
    Producto prod = f1.CrearProducto("Smartphone XX","20","CatPrueba","Nuevo Smatphone Pro xx Max","imagen.jpg",5,7,false);
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
        var productos = await client.From<Producto>().Select("idproducto, nombreproducto, precio, descripcion, imagenes").Limit(12).Get();

        // Devolver los productos al frontend
        var jsonResponse = new { productos };
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
    }
    catch (Exception ex)
    {
        // Manejar cualquier error y devolver una respuesta de error al cliente
        errorDefault(context,ex);
    }
});

// Obtinene los 6 primeros productos, ya que no hay productos Recomendados
app.MapGet("/ObtenerProductosRecomendados", async (HttpContext context, Supabase.Client client) =>
{
    try
    {
        // Obtener los 6 primeros productos desde la base de datos
        var productos = await client.From<Producto>().Select("idproducto, nombreproducto, precio, descripcion, imagenes").Limit(12).Get();

        // Devolver los productos al frontend
        var jsonResponse = new { productos };
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
    }
    catch (Exception ex)
    {
        // Manejar cualquier error y devolver una respuesta de error al cliente
        errorDefault(context,ex);
    }
});

/*
//obtener los productos por página
app.MapGet("/ObtenerProductosPorPagina", async (HttpContext context, Supabase.Client client) =>
{
    try
    {
        // Obtener el número de página desde los parámetros de la solicitud
        var numeroPagina = Convert.ToInt32(context.Request.Query["pagina"]);

        // Calcular el índice de inicio y fin de los productos basado en el número de página
        var cantidadPorPagina = 6; // Cantidad de productos por página
        var indiceInicio = (numeroPagina - 1) * cantidadPorPagina;
        var indiceFin = indiceInicio + cantidadPorPagina;

        // Obtener los productos de la base de datos dentro del rango calculado
        var productos = await client.From<Producto>().Select("idproducto, nombreproducto, precio, descripcion, imagen").Range(indiceInicio, indiceFin).Get();

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

*/

//obtener Todos los productos de la BD, solo voy a mostrar 20, sobra...
app.MapGet("/ObtenerTodosProductos", async (HttpContext context, Supabase.Client client) =>
{
    try
    {
        // Obtener los 6 primeros productos desde la base de datos
        var productos = await client.From<Producto>().Select("idproducto, nombreproducto, precio, descripcion, categoria, imagenes").Limit(12).Get();

        // Devolver los productos al frontend
        var jsonResponse = new { productos };
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
    }
    catch (Exception ex)
    {
        // Manejar cualquier error y devolver una respuesta de error al cliente
        errorDefault(context,ex);
    }
});

//carga todas las categorías de todos los productos
app.MapGet("/CargarCategorias", async (HttpContext context, Supabase.Client client) =>
{
    try
    {      
        var CategoriasProductos = await client.From<Producto>().Select("categoria").Get();

        var jsonResponse = new { CategoriasProductos };

        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
    }
    catch (Exception ex)
    {
        // Manejar cualquier error y devolver una respuesta de error al cliente
        errorDefault(context,ex);
    }
});

//carga la dirección de un usuario
app.MapGet("/ObtenerDireccionUsuario", async (HttpContext context, Supabase.Client client) =>
{
    try
    {      
        // Obtener el ID del producto de la consulta
        //var idBuscado = context.Request.Query["idusuario"].ToString();
        var idBuscado = 1;
        
        var direcc = await client.From<Usuario>().Filter("idusuario", Postgrest.Constants.Operator.Equals, idBuscado).Select("direccion").Single();


        var jsonResponse = new { direcc };
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
    }
    catch (Exception ex)
    {
        // Manejar cualquier error y devolver una respuesta de error al cliente
        errorDefault(context,ex);
    }
});

app.MapGet("/ObtenerProductoPorID", async (HttpContext context, Supabase.Client client) =>
{
    try
    {
        // Obtener el ID del producto de la consulta
        var idBuscado = context.Request.Query["idproducto"].ToString();

        // Realizar la consulta para obtener el producto por su ID
        var producto = await client.From<Producto>().Filter("idproducto", Postgrest.Constants.Operator.Equals, idBuscado).Single();

        var jsonResponse = new { producto };
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
    }
    catch (Exception ex)
    {
        // Manejar cualquier error y devolver una respuesta de error al cliente
        errorDefault(context,ex);
    }
});

app.MapGet("/ObtenerProductosVendedor", async (HttpContext context, Supabase.Client client) =>
{
    try
    {      
        var productos = await client.From<Producto>()
        .Where(p => p.idvendedor == 5 && p.validado == true)
        .Select("idproducto, nombreproducto, precio, descripcion, imagenes")
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
        // Manejar cualquier error y devolver una respuesta de error al cliente
        errorDefault(context,ex);
    }
});

app.MapGet("/ObtenerProductosAValidar", async (HttpContext context, Supabase.Client client) =>
{
    try
    {      
        var productos = await client.From<Producto>()
        .Where(p => p.idvendedor == 5 && p.validado == false)
        .Select("idproducto, nombreproducto, precio, descripcion, imagenes")
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

//Busca un producto desde el forntend
app.MapPost("/BuscarProducto", async (HttpContext context,Supabase.Client client) =>
{
    // Leer el cuerpo de la solicitud para obtener la información de búsqueda
    using (var reader = new StreamReader(context.Request.Body))
    {
        try{
            var requestBody = await reader.ReadToEndAsync();
            var searchData = JsonConvert.DeserializeObject<SearchData>(requestBody);

            //Usuario que está haciendo la busqueda
            var usuario = await client.From<Usuario>().Select("idusuario").Single();

            //Añadir busqueda
            var b1 = new Busqueda(searchData.searchTerm ?? "SmartPhone X", DateTime.Now, 1);
            await client.From<Busqueda>().Insert(new List<Busqueda> { b1 });

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
            // Manejar cualquier error y devolver una respuesta de error al cliente
            errorDefault(context,ex);
        }
        
    }
});

/*
app.MapGet("/buscarProductoX", async (HttpContext context, Supabase.Client client) =>
{
    try
    {      
        //string nombreBuscado = "Smartphone X";
        var result = await client.From<Producto>()
                                .Where(p => p.idproducto== 237)
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
});*/

app.MapPost("/buscarProductoX", async (HttpContext context, Supabase.Client client) =>
{
    using (var reader = new StreamReader(context.Request.Body))
    {
        try{
            var requestBody = await reader.ReadToEndAsync();

            var productoData = JsonConvert.DeserializeObject<Producto>(requestBody);

            //string nombreBuscado = "Smartphone X";
            var result = await client.From<Producto>()
                                    .Where(p => p.idproducto == productoData.idproducto)
                                    .Select("precio, cantidad, categoria, descripcion, imagenes, nombreproducto")
                                    .Get();

            // Devolver los productos al frontend
            var jsonResponse = new { result };
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
        }
        catch (Exception ex)
        {
            // Manejar cualquier error y devolver una respuesta de error al cliente
            errorDefault(context,ex);
        }
    }
});


app.MapPost("/validarProductoX", async (HttpContext context, Supabase.Client client) =>
{
    using (var reader = new StreamReader(context.Request.Body))
    {
        try{
            var requestBody = await reader.ReadToEndAsync();
            var productoData = JsonConvert.DeserializeObject<Producto>(requestBody);

            //string nombreBuscado = "Smartphone X";
            var result = await client.From<Producto>()
                                    .Where(p => p.idproducto == productoData.idproducto && p.validado == true)
                                    .Select("precio, cantidad, categoria, descripcion, imagenes, nombreproducto")
                                    .Get();
            //var jsonResponse = new { result };
            //context.Response.ContentType = "application/json";
            //await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));

            if (result.Model == null) {
                // Si se encuentra el producto, devolverlo como JSON
                
                var result2 = await client.From<Producto>()
                    .Where(p => p.idproducto == productoData.idproducto)
                    .Single();
                      // Use supabase.eq for comparison
                result2.validado = true;
                
                await result2.Update<Producto>();

                var jsonResponse = new { mensaje = "El producto no existe", existe = true };
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
            } else {
                // Si  encuentra el producto, devolver un mensaje indicando que ya existe
                var jsonResponse = new { mensaje = "El producto ya existe", existe = true };
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
            }

        }
        catch (Exception ex)
        {
            // Manejar cualquier error y devolver una respuesta de error al cliente
            errorDefault(context,ex);
        }
    }
});

app.MapPost("/eliminarProductoX", async (HttpContext context, Supabase.Client client) =>
{
    using (var reader = new StreamReader(context.Request.Body))
    {
        try{
            var requestBody = await reader.ReadToEndAsync();
            var productoData = JsonConvert.DeserializeObject<Producto>(requestBody);

            //string nombreBuscado = "Smartphone X";
            await client.From<Producto>()
                                    .Where(p => p.idproducto == productoData.idproducto)
                                    .Delete();


            // Devolver los productos al frontend
           /* var jsonResponse = new { result };
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));*/
        }
        catch (Exception ex)
        {
            // Manejar cualquier error y devolver una respuesta de error al cliente
            errorDefault(context,ex);
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
                productoData.imagenes ?? "/rutaPrueba",  //Este lo pone siempre
                productoData.cantidad ?? -1,//predeterminado que si llega un nulo, sea -1 
                productoData.idvendedor ?? -1,
                productoData.validado ?? false);

#pragma warning restore CS8602 // Y aqui para volver a instaurarlo

            // Inserta el nuevo producto en la base de datos
            await client.From<Producto>().Insert(new List<Producto> { nuevoProducto });

            // Devuelve una respuesta al frontend (opcional)
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync("Producto creado exitosamente");
        } catch (Exception ex)
        {
            // Manejar cualquier error y devolver una respuesta de error al cliente
            errorDefault(context,ex);
        }
    }
    return Results.Ok("Producto created successfully"); 
});

app.MapPost("/ActualizarProducto", async (HttpContext context,Supabase.Client client) =>
{
    // Leer el cuerpo de la solicitud para obtener la información de búsqueda
    using (var reader = new StreamReader(context.Request.Body)){
    
        try{
            var requestBody = await reader.ReadToEndAsync();
            var productoData = JsonConvert.DeserializeObject<Producto>(requestBody);

            // Utiliza los datos recibidos para crear un nuevo producto
            //var fabrica = new FabricaDeProductos();

#pragma warning disable CS8602 // Esto es para quitar un warning raro
/*
            var nuevoProducto = fabrica.CrearProducto(
                productoData.nombreproducto ?? "Producto de Serie Creación", //Este tmb
                productoData.precio ?? "-1", 
                productoData.categoria ?? "CatPrueba", 
                productoData.descripcion ?? "Este articulo es el predeterminado por si llega un null a esta funcion", 
                productoData.imagen ?? "/rutaPrueba",  //Este lo pone siempre
                productoData.cantidad ?? -1,//predeterminado que si llega un nulo, sea -1 
                productoData.idvendedor ?? -1);
*/
#pragma warning restore CS8602 // Y aqui para volver a instaurarlo

            // Inserta el nuevo producto en la base de datos
            //await client.From<Producto>().Insert(new List<Producto> { nuevoProducto });
           /* await client.From<Producto>()
                    .Where(p => p.idproducto== 237)
                    .Update(nuevoProducto);

                */    
    //string nombreBuscado = "Smartphone X";
            /*var result2 = await client.From<Producto>()
                    .Where(p => p.idproducto== 237)  // Use supabase.eq for comparison
                    .Set(p => p.cantidad, 5)                       // Set the value directly (number)
                    .Update();
*/          var result2 = await client.From<Producto>()
                    .Where(p => p.idproducto == productoData.idproducto)
                    .Single();
                      // Use supabase.eq for comparison
            result2.nombreproducto = productoData.nombreproducto ?? "Producto de Serie Creación";          
            result2.cantidad = productoData.cantidad ?? -1;
            result2.precio = productoData.precio ?? "-1";
            result2.categoria = productoData.categoria ?? "CatPrueba";
            result2.descripcion = productoData.descripcion ?? "Este articulo es el predeterminado por si llega un null a esta funcion";
            result2.imagenes = productoData.imagenes ?? "/rutaPrueba";
            
            await result2.Update<Producto>();

            Console.WriteLine("pedido");

            // Devuelve una respuesta al frontend (opcional)
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync("Producto creado exitosamente");
        } catch (Exception ex)
        {
            // Manejar cualquier error y devolver una respuesta de error al cliente
            errorDefault(context,ex);
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
                imagenes = productoData.imagenes,
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
        errorDefault(context,ex);
    }
});


app.MapPost("/iniciarSesion", async (HttpContext context, Supabase.Client client) =>
{
    using (var reader = new StreamReader(context.Request.Body))
    {
        try
        {
            var requestBody = await reader.ReadToEndAsync();
            var userData = JsonConvert.DeserializeObject<Usuario>(requestBody);

            var query = client.From<Usuario>().Filter("correo", Postgrest.Constants.Operator.Equals, userData.correo)
                                             .Filter("contraseña", Postgrest.Constants.Operator.Equals, userData.contraseña);
                                            

            // Ejecutar la consulta
            var usuario = await query.Single();

            if (usuario != null)
            {
                context.Response.StatusCode = 200;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(new { token }));
            }
            else
            {
                // Si no se encuentra el usuario
                context.Response.StatusCode = 401; // Unauthorized
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(new { error = "Credenciales inválidas" }));
            }
        }
        catch (Exception ex)
        {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "text/plain";
            await context.Response.WriteAsync($"Error interno del servidor: {ex.Message}");
        }
    }
});

app.MapGet("/status", () => Results.Ok("El backend está en funcionamiento correctamente."));


app.MapGet("/getBusquedas", async (HttpContext context, Supabase.Client client) =>
{
    try
    {
        // Leer el cuerpo de la solicitud para obtener los datos del producto
        using (var reader = new StreamReader(context.Request.Body))
        {
            var requestBody = await reader.ReadToEndAsync();
            var productoData = JsonConvert.DeserializeObject<Producto>(requestBody);
            var result = await client.From<Busqueda>()
                            .Select("*")
                            .Get();

            // Devolver los productos al frontend
            var jsonResponse = new { result };
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
        }
    }
    catch (Exception ex)
    {
        // Manejar cualquier error y devolver una respuesta de error al cliente
        errorDefault(context,ex);    
    }
});

app.Run();


async static void errorDefault(HttpContext context,Exception ex){
    context.Response.StatusCode = 500;
    context.Response.ContentType = "text/plain";
    await context.Response.WriteAsync($"Error al guardar el producto: {ex.Message}");
}

public class SearchData
{
    public string? searchTerm { get; set;}
    public string? category {get; set;}
}

