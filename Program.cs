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

//Si sesion no iniciada ID_USUARIO = 0, al cerrar sesion este valor debería volver a ser 0
var ID_USUARIO = 0;
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
        var productos = await client.From<Producto>().Select("idproducto, nombreproducto, precio, descripcion, imagenes").Limit(18).Get();

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
        var productos = await client.From<Producto>().Select("idproducto, nombreproducto, precio, descripcion, imagenes").Limit(18).Get();

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
        var productos = await client.From<Producto>().Select("idproducto, nombreproducto, precio, descripcion, categoria, imagenes").Get();

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

        // Extraer categorías únicas
        var categoriasUnicas = CategoriasProductos.Models
            .Select(p => p.categoria)
            .Distinct()
            .ToList();

        var jsonResponse = new { Categorias = categoriasUnicas };

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
app.MapGet("/BuscarPorCategoria", async (HttpContext context, Supabase.Client client) =>
{
    try
    {  
        var categoriaSelected = context.Request.Query["categoria"].ToString();

        var ProductosXCat = await client.From<Producto>()
        .Where(p => p.categoria == categoriaSelected).Get();


        var jsonResponse = new { ProductosXCat };

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
app.MapGet("/ObtenerInfoUsuario", async (HttpContext context, Supabase.Client client) =>
{
    try
    {      
        // Obtener el ID del producto de la consulta
        var idBuscado = context.Request.Query["idusuario"].ToString();
        //var idBuscado = 1;
        
        var info = await client.From<Usuario>().Filter("idusuario", Postgrest.Constants.Operator.Equals, idBuscado).Single();
       
        /*string rutaArchivo = "C:/Users/2003h/OneDrive/Escritorio/UPV/3º/2º Cuatri/PSW. Proyecto Software/outputs.txt";
        using (StreamWriter writer = new StreamWriter(rutaArchivo))
        {
            // Redirigir la salida estándar de la consola al archivo
            Console.SetOut(writer);

            // Ahora, todo lo que se imprima con Console.WriteLine() se guardará en el archivo

            // Ejemplo:
            Console.WriteLine(idBuscado);
            Console.WriteLine(info);
            // Informar al usuario que se han guardado los outputs
            Console.WriteLine("Los outputs se han guardado en el archivo: " + rutaArchivo);
        }*/

        var jsonResponse = new { info };
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

app.MapPost("/ActualizarCantidadProducto", async (HttpContext context, Supabase.Client client) =>
{
    // Leer el cuerpo de la solicitud para obtener la información del producto
    using (var reader = new StreamReader(context.Request.Body))
    {
        try
        {
            var requestBody = await reader.ReadToEndAsync();
            var requestData = JsonConvert.DeserializeObject<JObject>(requestBody);

            // Obtener el ID del producto y la cantidad seleccionada
            var idProducto = requestData["idproducto"].ToObject<int>();
            var cantidadSeleccionada = requestData["idProductoCantidadSelec"].ToObject<int>();

            // Obtener el producto de la base de datos
            var producto = await client.From<Producto>().Filter("idproducto", Postgrest.Constants.Operator.Equals, idProducto).Single();

            // Calcular la nueva cantidad restando la cantidad actual del producto y la cantidad seleccionada
            var nuevaCantidad = producto.cantidad - cantidadSeleccionada;


            //VAS A BORRAR UN PRUDCUTO SI TE METES AQUI
            if (nuevaCantidad <= 0)
            {
                // Si la nueva cantidad es menor o igual a cero, borrar el producto de la base de datos
                await producto.Delete<Producto>();
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync("Producto eliminado correctamente");
            }
            else
            {
                // Actualizar la cantidad del producto con la nueva cantidad calculada
                producto.cantidad = nuevaCantidad;

                // Actualizar el producto en la base de datos
                await producto.Update<Producto>();

                // Devolver una respuesta de éxito al cliente
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync("Cantidad del producto actualizada correctamente");
            }
        }
        catch (Exception ex)
        {
            // Manejar cualquier error y devolver una respuesta de error al cliente
            errorDefault(context, ex);
        }
    }
});


app.MapPost("/GuardarDatosUsuario", async (HttpContext context, Supabase.Client client) =>
{
    // Leer el cuerpo de la solicitud para obtener la información del producto
    using var reader = new StreamReader(context.Request.Body);
    try
    {
        var requestBody = await reader.ReadToEndAsync();
        var requestData = JsonConvert.DeserializeObject<JObject>(requestBody);

        // Obtener el ID del producto y la cantidad seleccionada

        //faltaría ver que el formato en el que lo guardamos casa
        var idusuario = requestData["idusuario"].ToObject<int>();
        var numTarjeta = requestData["numTarjeta"].ToObject<int>();
        var fechaCaducidad = requestData["fechaCaducidad"].ToObject<string>();
        var cvv = requestData["cvv"].ToObject<int>();

        // Obtener el producto de la base de datos
        var usuario = await client.From<Usuario>().Filter("idusuario", Postgrest.Constants.Operator.Equals, idusuario).Single();

        //guardo la tarjeta de crédito
        usuario.CVV = cvv;
        usuario.numeroTarjeta = numTarjeta;
        usuario.fechaCaducidad = fechaCaducidad;

        string rutaArchivo = "C:/Users/2003h/OneDrive/Escritorio/UPV/3º/2º Cuatri/PSW. Proyecto Software/outputs.txt";
        using (StreamWriter writer = new StreamWriter(rutaArchivo))
        {
            // Redirigir la salida estándar de la consola al archivo
            Console.SetOut(writer);

            // Ahora, todo lo que se imprima con Console.WriteLine() se guardará en el archivo

            // Ejemplo:
            Console.WriteLine(idusuario + "idusuario");
            Console.WriteLine(numTarjeta + "numTarjeta");
            Console.WriteLine(fechaCaducidad + "fechaCaducidad");
            Console.WriteLine(cvv + "cvv");
            Console.WriteLine(usuario + "usuario");
            // Informar al usuario que se han guardado los outputs
            Console.WriteLine("Los outputs se han guardado en el archivo: " + rutaArchivo);
        }

        // Actualizar el producto en la base de datos
        await usuario.Update<Usuario>();

        // Devolver una respuesta de éxito al cliente
        //context.Response.ContentType = "application/json";
        await context.Response.WriteAsync("Cantidad del producto actualizada correctamente");

    }
    catch (Exception ex)
    {
        // Manejar cualquier error y devolver una respuesta de error al cliente
        errorDefault(context, ex);
    }
});




app.MapPost("/ObtenerProductosVendedor", async (HttpContext context, Supabase.Client client) =>
{
    using (var reader = new StreamReader(context.Request.Body))
    {
        try
        {      
            var requestBody = await reader.ReadToEndAsync();

            var usuarioData = JsonConvert.DeserializeObject<Usuario>(requestBody);

            var productos = await client.From<Producto>()
            .Where(p => p.idvendedor == usuarioData.idusuario && p.validado == true)
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
    }
});


app.MapGet("/ObtenerProductosAValidar", async (HttpContext context, Supabase.Client client) =>
{
    try
    {      
        var productos = await client.From<Producto>()
        .Where(p => p.validado == false)
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


//Busca un producto con categoria== Todas categorías y el texto de búsqueda
app.MapPost("/BuscarProductoText", async (HttpContext context,Supabase.Client client) =>
{
    // Leer el cuerpo de la solicitud para obtener la información de búsqueda
    using var reader = new StreamReader(context.Request.Body);
    try
    {
        var requestBody = await reader.ReadToEndAsync();
        var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);

        var idBuscado = searchData["idusuario"].ToObject<int>();
        var searchTerm = searchData["searchTerm"].ToObject<string>();
        var category = searchData["category"].ToObject<string>();

        //Añadir busqueda
#pragma warning disable CS8604 // Possible null reference argument.
        var b1 = new Busqueda(searchTerm, DateTime.Now, idBuscado, category);
#pragma warning restore CS8604 // Possible null reference argument.

        //Inserto la búsqueda en la base de datos
        await client.From<Busqueda>().Insert(new List<Busqueda> { b1 });

        //convierto la consulta a minusculas para diferencias más productos
        var searchTermLower = searchTerm.ToLowerInvariant();
        //busco el texto parecido
        var productos = client.From<Producto>().Filter("nombreproducto", Postgrest.Constants.Operator.ILike, $"%{searchTerm}%").Get();

        // Devolver la respuesta al frontend
        var jsonResponse = new { productos };
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
    }
    catch (Exception ex)
    {
        // Manejar cualquier error y devolver una respuesta de error al cliente
        errorDefault(context, ex);
    }
});

/*
//Busca un producto con categoria!= Todas categorías y el texto de búsqueda
app.MapPost("/BuscarProducto", async (HttpContext context,Supabase.Client client) =>
{
    // Leer el cuerpo de la solicitud para obtener la información de búsqueda
    using var reader = new StreamReader(context.Request.Body);
    try
    {
        var requestBody = await reader.ReadToEndAsync();
        var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);

        var idBuscado = searchData["idusuario"].ToObject<int>();
        var searchTerm = searchData["searchTerm"].ToObject<string>();
        var category = searchData["category"].ToObject<string>();

        //Añadir busqueda
#pragma warning disable CS8604 // Possible null reference argument.
        var b1 = new Busqueda(searchTerm, DateTime.Now, idBuscado, category);
#pragma warning restore CS8604 // Possible null reference argument.

        //Inserto la búsqueda en la base de datos
        await client.From<Busqueda>().Insert(new List<Busqueda> { b1 });

        var query = client.From<Producto>().Filter("nombreproducto", Postgrest.Constants.Operator.ILike, searchTerm)
        .And.Filter("categoria",  Postgrest.Constants.Operator.ILike, category);
    

        //var query = client.From<Producto>().Filter("nombreproducto", Postgrest.Constants.Operator.Equals, nombreBuscado);

        // Ejecutar la consulta
        var producto = await query.Single();


        // Devolver la respuesta al frontend
        var jsonResponse = new { producto };
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
    }
    catch (Exception ex)
    {
        // Manejar cualquier error y devolver una respuesta de error al cliente
        errorDefault(context, ex);
    }
});
*/

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
    try
    {
        var correoUsuario = context.Request.Form["correo"].ToString();
        var contraUsuario = context.Request.Form["contraseña"].ToString();

        //var correoUsuario = "hernan@example.com";
        //var contraUsuario = "hernan1234";

        // Buscar el usuario por su correo electrónico
         var usuario = await client.From<Usuario>().Filter("correo", Postgrest.Constants.Operator.Equals, correoUsuario).Single();

/*      ESTO ES PARA VER LOS OTUPUTS EN UN ARCHIVO

        string rutaArchivo = "C:/Users/2003h/OneDrive/Escritorio/UPV/3º/2º Cuatri/PSW. Proyecto Software/outputs.txt";
        using (StreamWriter writer = new StreamWriter(rutaArchivo))
        {
            // Redirigir la salida estándar de la consola al archivo
            Console.SetOut(writer);

            // Ahora, todo lo que se imprima con Console.WriteLine() se guardará en el archivo

            // Ejemplo:
            Console.WriteLine(correoUsuario);
            Console.WriteLine(contraUsuario);
            Console.WriteLine(usuario);
            // Informar al usuario que se han guardado los outputs
            Console.WriteLine("Los outputs se han guardado en el archivo: " + rutaArchivo);
        }
*/

if (usuario != null)
        {
            // Verificar si la contraseña coincide
            if (usuario.contraseña == contraUsuario)
            {
                // Las credenciales son válidas
                var jsonResponse = new Dictionary<string, object>
                {
                    { "Id", usuario.idusuario }, // Asumiendo que idusuario no puede ser nulo, pero ajusta esto según tus requisitos
                    { "Nombre", usuario.nombre ?? "UsuarioPorDefecto" }, // Si nombre es nullable, usa el operador de coalescencia nula para proporcionar un valor predeterminado en caso de que sea nulo
                    { "Correo", usuario.correo ?? "CorreoPorDefecto" },
                    { "TipoUsuario", "TipoUusarioPorDefecto" }
                };
                var vendedor = await client.From<Vendedor>().Where(v => v.idvendedor == usuario.idusuario).Single();
                var tecnico = await client.From<Tecnico>().Where(t => t.idtecnico == usuario.idusuario).Single();
                if (vendedor != null)
                {
                    jsonResponse["TipoUsuario"] = "Vendedor";
                }
                else if (tecnico != null)
                {
                    jsonResponse["TipoUsuario"] = "Técnico";
                }
                else
                {
                    jsonResponse["TipoUsuario"] = "Usuario Común";
                }
                context.Response.StatusCode = 200;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
            }
            else
            {
                // La contraseña es incorrecta
                context.Response.StatusCode = 401; // Unauthorized
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(new { error = "Contraseña incorrecta" }));
            }
        }
        else
        {
            // No se encontró ningún usuario con ese correo electrónico
            context.Response.StatusCode = 401; // Unauthorized
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonConvert.SerializeObject(new { error = "Usuario no encontrado" }));
        }
    }
    catch (Exception ex)
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "text/plain";
        await context.Response.WriteAsync($"Error interno del servidor: {ex.Message}");
    }
});

//fin prueba de inicio sesion

app.MapGet("/status", () => Results.Ok("El backend está en funcionamiento correctamente."));


app.MapGet("/getBusquedas", async (HttpContext context, Supabase.Client client) =>
{
    try
    {
        Console.WriteLine(ID_USUARIO);
        // Leer el cuerpo de la solicitud para obtener los datos del producto
        using (var reader = new StreamReader(context.Request.Body))
        {
            var result = await client.From<Busqueda>()
                            .Where(x => x.idusuario == ID_USUARIO)
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


