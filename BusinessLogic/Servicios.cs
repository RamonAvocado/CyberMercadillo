using Supabase;
using Newtonsoft.Json;
using CyberMercadillo.BusinessLogic;
using CyberMercadillo.Entities;
using Newtonsoft.Json.Linq;


class Servicios{

    public Servicios(FachadaLogica fachadaLogica, WebApplication app){
        Console.WriteLine("Se ha creado los servicios");

        // Obtinene los 6 primeros productos, ya que no hay productos destacados
        app.MapGet("/ObtenerProductosDestacados", async (HttpContext context, Supabase.Client client) =>
        {
            try
            {
                var productos = fachadaLogica.GetProductos();
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

        // Obtinene los 6 primeros productos, ya que no hay productos destacados
        app.MapGet("/ObtenerProductosRecomendados", async (HttpContext context, Supabase.Client client) =>
        {
            try
            {
                //HABRÁ QUE HACER LA LÓGICA PARA CARGAR LOS PRODCUTOS RECOMENDADOS EN BASE A BUSQUEDAS Y COMPRAS
                var productos = fachadaLogica.GetProductos();
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

        // Obtinene TODOS los productos
        app.MapGet("/ObtenerTodosProductos", async (HttpContext context, Supabase.Client client) =>
        {
            try
            {
                //HABRÁ QUE HACER LA LÓGICA PARA CARGAR LOS PRODCUTOS RECOMENDADOS EN BASE A BUSQUEDAS Y COMPRAS
                var productos = fachadaLogica.GetProductos();
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

        app.MapGet("/ObtenerProductoPorID", async (HttpContext context, Supabase.Client client) =>
        {
            try
            {
                var idBuscado = context.Request.Query["idproducto"].ToString();

                var producto = fachadaLogica.returnTienda().buscarIDTodos(idBuscado);
                // Devolver los productos al frontend
                
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
            using var reader = new StreamReader(context.Request.Body);
            try
            {
                //Leer frontend
                var requestBody = await reader.ReadToEndAsync();
                var datosProducto = JsonConvert.DeserializeObject<JObject>(requestBody);

                var idproducto = datosProducto["idproducto"].ToObject<int>();
                var nuevaCantidad = datosProducto["nuevaCantidad"].ToObject<int>();

                var ok = fachadaLogica.returnTienda().ActualizarCantidadProducto(idproducto,nuevaCantidad);
                
                var jsonResponse = new { ok };
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
            }
            catch (Exception ex)
            {
                errorDefault(context,ex);   // Manejar cualquier error y devolver una respuesta de error al cliente
            }
        });

        app.MapPost("/EliminarProductoDelCarrito", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
            try
            {
                //Leer frontend
                var requestBody = await reader.ReadToEndAsync();
                var datosProducto = JsonConvert.DeserializeObject<JObject>(requestBody);

                var idproducto = datosProducto["idproducto"].ToObject<int>();

                fachadaLogica.returnTienda().EliminarProductoDelCarrito(idproducto);
                
                var jsonResponse = new { };
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
            }
            catch (Exception ex)
            {
                errorDefault(context,ex);   // Manejar cualquier error y devolver una respuesta de error al cliente
            }
        });

        //que las categorías de todos los productos
        app.MapGet("/CargarCategorias", async (HttpContext context, Supabase.Client client) =>
        {
            try
            {
                //HABRÁ QUE HACER LA LÓGICA PARA CARGAR LOS PRODCUTOS RECOMENDADOS EN BASE A BUSQUEDAS Y COMPRAS
                var categorias = fachadaLogica.returnTienda().GetCategorías();
                // Devolver los productos al frontend
  
                //quiero devolver categorías que van a ser un string
                var jsonResponse = new { categorias };
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
            }
            catch (Exception ex)
            {
                errorDefault(context,ex);   // Manejar cualquier error y devolver una respuesta de error al cliente
            }
        });

        app.MapPost("/ObtenerProductosVendedor", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
                try
                {      
                    var requestBody = await reader.ReadToEndAsync();
                    var usuarioData = JsonConvert.DeserializeObject<JObject>(requestBody);
                    var idBuscado = usuarioData["idusuario"].ToObject<int>();
                    
                    var productos = fachadaLogica.GetTodosProductosVendedor(idBuscado);
/*
                    var productos = await client.From<Producto>()
                    .Where(p => p.idvendedor == usuarioData.idusuario && p.validado == true)
                    .Select("idproducto, nombreproducto, precio, descripcion, imagenes")
                    .Get();*/
                    //var productos = fachadaLogica.GetProductos();
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

        app.MapPost("/ObtenerProductosVendedorGuardados", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
                try
                {      
                    var requestBody = await reader.ReadToEndAsync();
                    var usuarioData = JsonConvert.DeserializeObject<JObject>(requestBody);
                    var idBuscado = usuarioData["idusuario"].ToObject<int>();
                    
                    var productos = fachadaLogica.GetProductosVendedorGuardados(idBuscado);
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

        app.MapGet("/ObtenerProductosAValidar", async (HttpContext context, Supabase.Client client) =>
        {
            try
            {   
                var productos = fachadaLogica.GetProductosAValidar(); 
                /*var productos = await client.From<Producto>()
                .Where(p => p.validado == false)
                .Select("idproducto, nombreproducto, precio, descripcion, imagenes")
                .Get();*/

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

        app.MapPost("/ObtenerProductosAValidarTecnicoConcreto", async (HttpContext context) =>
        {
            using var reader = new StreamReader(context.Request.Body);
            try
            {   
                var requestBody = await reader.ReadToEndAsync();
                var usuarioData = JsonConvert.DeserializeObject<JObject>(requestBody);
                var idBuscado = usuarioData["idusuario"].ToObject<int>();

                var productos = fachadaLogica.GetProductosAValidarTecnico(idBuscado); 
                //var productos = fachadaLogica.GetProductosAValidar();
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

        app.MapPost("/AgregarProducto", async (HttpContext context,Supabase.Client client) =>
        {
            // Leer el cuerpo de la solicitud para obtener la información de búsqueda
             using var reader = new StreamReader(context.Request.Body);
                try{
                    var requestBody = await reader.ReadToEndAsync();
                    var productoData = JsonConvert.DeserializeObject<JObject>(requestBody);
                    var nombreP = productoData["nombre"].ToObject<string>();
                    var precioP = productoData["precio"].ToObject<string>();
                    var categoriaP = productoData["categoria"].ToObject<string>();
                    var descripcionP = productoData["descripcion"].ToObject<string>();
                    var imgP = productoData["img"].ToObject<string>();
                    var cantidadP = productoData["cantidad"].ToObject<int>();
                    var idvendedorP = productoData["idvendedor"].ToObject<int>();
                    var validadoP = productoData["validado"].ToObject<bool>();
                    var guardadoP = productoData["guardado"].ToObject<bool>();
                    var puntuacionH = productoData["puntuacionHuella"].ToObject<int>();

                    // Utiliza los datos recibidos para crear un nuevo producto
                    fachadaLogica.agregarProducto(nombreP ?? "Producto de Serie Creación",
                                                   precioP ?? "-1",
                                                   categoriaP ?? "CatPrueba",
                                                   descripcionP ?? "Este artículo es el predeterminado por si llega un null a esta función",
                                                   imgP ?? "/rutaPrueba",
                                                   cantidadP,
                                                   idvendedorP,
                                                   validadoP,
                                                   guardadoP,
                                                   puntuacionH);
                    // Inserta el nuevo producto en la base de datos
                   // await client.From<Producto>().Insert(new List<Producto> { nuevoProducto });

                    // Devuelve una respuesta al frontend (opcional)
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync("Producto creado exitosamente");
                } catch (Exception ex)
                {
                    // Manejar cualquier error y devolver una respuesta de error al cliente
                    errorDefault(context,ex);
                }
            return Results.Ok("Producto created successfully"); 
        });
/*
        app.MapPost("/GuardarProducto", async (HttpContext context,Supabase.Client client) =>
        {
            // Leer el cuerpo de la solicitud para obtener la información de búsqueda
             using var reader = new StreamReader(context.Request.Body);
                try{
                    var requestBody = await reader.ReadToEndAsync();
                    var productoData = JsonConvert.DeserializeObject<JObject>(requestBody);
                    var nombreP = productoData["nombre"].ToObject<string>();
                    var precioP = productoData["precio"].ToObject<string>();
                    var categoriaP = productoData["categoria"].ToObject<string>();
                    var descripcionP = productoData["descripcion"].ToObject<string>();
                    var imgP = productoData["img"].ToObject<string>();
                    var cantidadP = productoData["cantidad"].ToObject<int>();
                    var idvendedorP = productoData["idvendedor"].ToObject<int>();
                    var validadoP = productoData["validado"].ToObject<bool>();
                    var validadoP = productoData["validado"].ToObject<bool>();

                    // Utiliza los datos recibidos para crear un nuevo producto
                    fachadaLogica.guardarProducto(nombreP ?? "Producto de Serie Creación",
                                                   precioP ?? "-1",
                                                   categoriaP ?? "CatPrueba",
                                                   descripcionP ?? "Este artículo es el predeterminado por si llega un null a esta función",
                                                   imgP ?? "/rutaPrueba",
                                                   cantidadP,
                                                   idvendedorP,
                                                   validadoP);
                    // Inserta el nuevo producto en la base de datos
                   // await client.From<Producto>().Insert(new List<Producto> { nuevoProducto });

                    // Devuelve una respuesta al frontend (opcional)
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync("Producto creado exitosamente");
                } catch (Exception ex)
                {
                    // Manejar cualquier error y devolver una respuesta de error al cliente
                    errorDefault(context,ex);
                }
            return Results.Ok("Producto created successfully"); 
        });
*/
        app.MapPost("/buscarProductoSeleccionado", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
                try{
                    var requestBody = await reader.ReadToEndAsync();
                    var productoData = JsonConvert.DeserializeObject<JObject>(requestBody);
                    var idProductoBuscado = productoData["idproducto"].ToObject<string>();

                    //string nombreBuscado = "Smartphone X";
                /*    var result = await client.From<Producto>()
                                            .Where(p => p.idproducto == productoData.idproducto)
                                            .Select("precio, cantidad, categoria, descripcion, imagenes, nombreproducto")
                                            .Get(); */
                    var producto = fachadaLogica.returnTienda().buscarIDTodos(idProductoBuscado ?? "0");
                    // Devolver los productos al frontend
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

        app.MapPost("/validarProductoGuardado", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
                try{
                    var requestBody = await reader.ReadToEndAsync();
                    var productoData = JsonConvert.DeserializeObject<JObject>(requestBody);
                    var idProductoBuscado = productoData["idproducto"].ToObject<string>();

                    bool validado = fachadaLogica.validarProdGuardado(idProductoBuscado ?? "0");
                    if(validado){
                        var jsonResponse = new { mensaje = "El producto fue mandado a validar", existe = false };
                        context.Response.ContentType = "application/json";
                        await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
                    }else{
                        var jsonResponse = new { mensaje = "El producto no pudo ser mandado a validar", existe = true };
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

        app.MapPost("/asignarProducto", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
                try{
                    var requestBody = await reader.ReadToEndAsync();
                    var productoData = JsonConvert.DeserializeObject<JObject>(requestBody);
                    var idProductoBuscado = productoData["idproducto"].ToObject<string>();
                    var idTecnico = productoData["idusuario"].ToObject<int>();

                    bool asignado = fachadaLogica.asignarProductoTecnico(idProductoBuscado ?? "0",idTecnico);
                    if(asignado){
                        var jsonResponse = new { mensaje = "El producto fue mandado a validar", existe = false };
                        context.Response.ContentType = "application/json";
                        await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
                    }else{
                        var jsonResponse = new { mensaje = "El producto no pudo ser mandado a validar", existe = true };
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
/*
        app.MapPost("/buscarProductoSelec", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
                try{
                    var requestBody = await reader.ReadToEndAsync();
                    var productoData = JsonConvert.DeserializeObject<JObject>(requestBody);
                    var idProductoBuscado = productoData["idproducto"].ToObject<string>();
                    var producto = fachadaLogica.GetProductoPorID(idProductoBuscado ?? "0");
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
*/
        app.MapPost("/ActualizarProducto", async (HttpContext context,Supabase.Client client) =>
        {
            // Leer el cuerpo de la solicitud para obtener la información de búsqueda
            using var reader = new StreamReader(context.Request.Body);
            
                try{

                    var requestBody = await reader.ReadToEndAsync();
                    var productoData = JsonConvert.DeserializeObject<JObject>(requestBody);
                    var precioP = productoData["precio"].ToObject<string>();
                    var descripcionP = productoData["descripcion"].ToObject<string>();
                    var cantidadP = productoData["cantidad"].ToObject<int>();
                    var idproductoP = productoData["idproducto"].ToObject<string>();
                    fachadaLogica.actualizarProducto(precioP ?? "-1",
                                                   descripcionP ?? "Este artículo es el predeterminado por si llega un null a esta función",
                                                   cantidadP,                                       
                                                   idproductoP ?? "0");
                    Console.WriteLine("pedido");

                    // Devuelve una respuesta al frontend (opcional)
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync("Producto creado exitosamente");
                } catch (Exception ex)
                {
                    // Manejar cualquier error y devolver una respuesta de error al cliente
                    errorDefault(context,ex);
                }
            return Results.Ok("Producto created successfully"); 
        });

        app.MapPost("/ActualizarProductoGuardado", async (HttpContext context,Supabase.Client client) =>
        {
            // Leer el cuerpo de la solicitud para obtener la información de búsqueda
            using var reader = new StreamReader(context.Request.Body);
            
                try{

                    var requestBody = await reader.ReadToEndAsync();
                    var productoData = JsonConvert.DeserializeObject<JObject>(requestBody);
                    var nombreP = productoData["nombre"].ToObject<string>();
                    var precioP = productoData["precio"].ToObject<string>();
                    var categoriaP = productoData["categoria"].ToObject<string>();
                    var descripcionP = productoData["descripcion"].ToObject<string>();
                    var imgP = productoData["img"].ToObject<string>();
                    var cantidadP = productoData["cantidad"].ToObject<int>();
                    var idproductoP = productoData["idproducto"].ToObject<string>();
                    var puntuacionH = productoData["puntuacionHuella"].ToObject<int>();
                    fachadaLogica.actualizarProductoGuardado(nombreP ?? "Producto de Serie Creación",
                                                   precioP ?? "-1",
                                                   categoriaP ?? "CatPrueba",
                                                   descripcionP ?? "Este artículo es el predeterminado por si llega un null a esta función",
                                                   imgP ?? "/rutaPrueba",
                                                   cantidadP,                                       
                                                   idproductoP ?? "0",
                                                   puntuacionH);
                    Console.WriteLine("pedido");

                    // Devuelve una respuesta al frontend (opcional)
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync("Producto creado exitosamente");
                } catch (Exception ex)
                {
                    // Manejar cualquier error y devolver una respuesta de error al cliente
                    errorDefault(context,ex);
                }
            return Results.Ok("Producto created successfully"); 
        });


        app.MapPost("/eliminarProductoSeleccionado", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
                try{
                    var requestBody = await reader.ReadToEndAsync();
                    var productoData = JsonConvert.DeserializeObject<JObject>(requestBody);
                    var idproductoSeleccionado = productoData["idproducto"].ToObject<string>();

                    //string nombreBuscado = "Smartphone X";
                    /*await client.From<Producto>()
                                            .Where(p => p.idproducto == productoData.idproducto)
                                            .Delete();*/
                    fachadaLogica.returnTienda().eliminarProductoID(idproductoSeleccionado ?? "0");
                }
                catch (Exception ex)
                {
                    // Manejar cualquier error y devolver una respuesta de error al cliente
                    errorDefault(context,ex);
                }
        });

        app.MapPost("/DesasignarProducto", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
                try{
                    var requestBody = await reader.ReadToEndAsync();
                    var productoData = JsonConvert.DeserializeObject<JObject>(requestBody);
                    var idproductoSeleccionado = productoData["idproducto"].ToObject<string>();
                    bool desasignado = fachadaLogica.desasignarProducto(idproductoSeleccionado ?? "0");
                    if(desasignado){
                        var jsonResponse = new { mensaje = "El producto fue validado", existe = false };
                        context.Response.ContentType = "application/json";
                        await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
                    }else{
                        var jsonResponse = new { mensaje = "El producto no pudo ser validado", existe = true };
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

        app.MapPost("/validarProductoSeleccionado", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
                try{
                    var requestBody = await reader.ReadToEndAsync();
                    var productoData = JsonConvert.DeserializeObject<JObject>(requestBody);
                    var idproductoSeleccionado = productoData["idproducto"].ToObject<string>();
                    bool validado = fachadaLogica.validarProducto(idproductoSeleccionado ?? "0");
/*
                    var result = await client.From<Producto>()
                                            .Where(p => p.idproducto == productoData.idproducto && p.validado == true)
                                            .Select("precio, cantidad, categoria, descripcion, imagenes, nombreproducto")
                                            .Get();

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
*/
                    if(validado){
                        var jsonResponse = new { mensaje = "El producto fue validado", existe = false };
                        context.Response.ContentType = "application/json";
                        await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
                    }else{
                        var jsonResponse = new { mensaje = "El producto no pudo ser validado", existe = true };
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

        //NO TOCAR NADA DE INICIAR SESION
        app.MapPost("/iniciarSesion", async (HttpContext context, Supabase.Client client) =>
        {
        try
        {
            var correoUsuario = context.Request.Form["correo"].ToString();
            var contraUsuario = context.Request.Form["contraseña"].ToString();

            // Buscar el usuario por su correo electrónico
            var user = fachadaLogica.returnTienda().buscarUsuario(correoUsuario, contraUsuario);

            Console.WriteLine("Usuario que intenta iniciar sesion " + user.correo);

            var jsonResponse = new Dictionary<string, object>
                    {
                        { "Id", user.idusuario }, // Asumiendo que idusuario no puede ser nulo, pero ajusta esto según tus requisitos
                        { "Nombre", user.nombre ?? "UsuarioPorDefecto" }, // Si nombre es nullable, usa el operador de coalescencia nula para proporcionar un valor predeterminado en caso de que sea nulo
                        { "Correo", user.correo ?? "CorreoPorDefecto" },
                        { "TipoUsuario", user.tipoUsuario ?? "TipoUsuarioPorDefecto" }
                    }; 
                    
            context.Response.StatusCode = 200;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
        }
        catch (Exception ex)
        {
            errorDefault(context,ex);   // Manejar cualquier error y devolver una respuesta de error al cliente
        }
        });

/*      ya no buscamos por categorias, ahora filtramos

        //Busca un producto con categoria== Todas categorías y el texto de búsqueda
        app.MapPost("/BuscarProductoText", async (HttpContext context, Supabase.Client client) =>
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

                //recupero los productos con esta categoría
                var productos = fachadaLogica.returnTienda().GetProductosSoloText(category??"Todas las categorias", searchTerm, idBuscado);
                //var productos = fachadaLogica.GetProductos();


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
*/
        app.MapPost("/BuscarProductos", async (HttpContext context, Supabase.Client client) =>
        {
            // Leer el cuerpo de la solicitud para obtener la información de búsqueda
            using var reader = new StreamReader(context.Request.Body);
            try
            {
                var requestBody = await reader.ReadToEndAsync();
                var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);

                var idBuscado = searchData["idusuario"].ToObject<int>();
                var searchTerm = searchData["searchTerm"].ToObject<string>();

                //recupero los productos con esta categoría
                var productos = fachadaLogica.returnTienda().GetProductosBusqueda(searchTerm, idBuscado);

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

        app.MapPost("/GetProdBusquedas", async (HttpContext context, Supabase.Client client) =>
        {
            // Leer el cuerpo de la solicitud para obtener la información de búsqueda
            using var reader = new StreamReader(context.Request.Body);
            try
            {
                var requestBody = await reader.ReadToEndAsync();
                var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);

                var category = searchData["category"].ToObject<string>();

                //recupero los productos con esta categoría
                var productos = fachadaLogica.returnTienda().GetProdBusquedaFiltro(category);

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

        app.MapPost("/AñadirAlCarritoCompra", async (HttpContext context, Supabase.Client client) =>
        {
            // Leer el cuerpo de la solicitud para obtener la información de búsqueda
            using var reader = new StreamReader(context.Request.Body);
            try
            {
                var requestBody = await reader.ReadToEndAsync();
                var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);

                var idBuscado = searchData["idusuario"].ToObject<int>();
                var idproducto = searchData["idproducto"].ToObject<int>();
                var cantProducto = searchData["cantProducto"].ToObject<int>();
                
                //recupero los productos con esta categoría
                var guay = fachadaLogica.returnTienda().AñadirAlCarritoCompra(idBuscado, idproducto, cantProducto);

                //Console.WriteLine("idBuscado: " + idBuscado + ", idproducto: " + idproducto);

                var jsonResponse = new { guay };

                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));

            }
            catch (Exception ex)
            {
                // Manejar cualquier error y devolver una respuesta de error al cliente
                errorDefault(context, ex);
            }
        });

        app.MapPost("/ObtenerCarritoCompra", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
            try
            {
                var requestBody = await reader.ReadToEndAsync();
                var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);

                var idusuario = searchData["idusuario"].ToObject<int>();

                //recupero los productos con esta categoría
                var carritoCompra = fachadaLogica.returnTienda().ObtenerCarritoCompra(idusuario);

                var jsonResponse = new { carritoCompra };

                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));

            }
            catch (Exception ex)
            {
                // Manejar cualquier error y devolver una respuesta de error al cliente
                errorDefault(context, ex);
            }
        });
        app.MapPost("/ObtenerInfoComprador", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
            try
            {
                var requestBody = await reader.ReadToEndAsync();
                var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);

                var idusuario = searchData["idusuario"].ToObject<int>();

                //recupero la información del usuairo por su id
                var info = fachadaLogica.returnTienda().ObtenerInfoUsuario(idusuario);

                var jsonResponse = new { info };

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

        app.MapPost("/ObtenerInformacionProductos", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
            try
            {
                var requestBody = await reader.ReadToEndAsync();
                var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);
                Console.WriteLine("aw3ui: asdf" );

                var productos = searchData["idsProductos"].ToObject<string[]>();
                Console.WriteLine("aw3ui: "+ productos);

                //recupero la información del usuairo por su id
                var info = fachadaLogica.returnTienda().ObtenerProductos(productos);

                var jsonResponse = new { info };

                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));

            }
            catch (Exception ex)
            {
                // Manejar cualquier error y devolver una respuesta de error al cliente
                errorDefault(context, ex);
            }
        });*/

        app.MapPost("/crearCertificado", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
            try
            {
                //Leer frontend
                var requestBody = await reader.ReadToEndAsync();
                var idProductoSeleccionado = JsonConvert.DeserializeObject(requestBody);

                //Crear PDF
                var producto = fachadaLogica.GetProductoPorID(idProductoSeleccionado.ToString() ?? "0");
                
                //Devolver PDF
                context.Response.ContentType = "application/pdf";
                context.Response.Headers.Add("Content-Disposition", "attachment; filename=certificado.pdf");

            }
            catch (Exception ex)
            {
                errorDefault(context,ex);   // Manejar cualquier error y devolver una respuesta de error al cliente
            }
        });

        app.MapGet("/getBusquedas", async (HttpContext context, Supabase.Client client) =>
        {
            try
            {

                using (var reader = new StreamReader(context.Request.Body))
                        {
                            var tienda = fachadaLogica.returnTienda();
                            var busquedas = tienda.getBusquedasUsuario(tienda.UsuarioRegistrado);

                            // Devolver los productos al frontend
                            var jsonResponse = new {busquedas};
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

        async static void errorDefault(HttpContext context,Exception ex){
            context.Response.StatusCode = 500;
            context.Response.ContentType = "text/plain";
            await context.Response.WriteAsync($"Error al guardar el producto: {ex.Message}");
        }
    }
                
        /*
        app.MapPost("/añadir",  async (Supabase.Client client) => 
        {
            FabricaDeProductos f1 = new FabricaDeProductos();
            Producto prod = f1.CrearProducto("Smartphone XX","20","CatPrueba","Nuevo Smatphone Pro xx Max","imagen.jpg",5,7,false);
            await client.From<Producto>().Insert(new List<Producto> { prod });

            return Results.Ok("Producto created successfully");
        });

        //Crear objetos de manera manual
        app.MapPost("/añadir",  async (Supabase.Client client) => 
        {
            FabricaDeProductos f1 = new FabricaDeProductos();
            Producto prod = f1.CrearProducto("Smartphone XX","20","CatPrueba","Nuevo Smatphone Pro xx Max","imagen.jpg",5,7,false);
            await client.From<Producto>().Insert(new List<Producto> { prod });

            return Results.Ok("Producto created successfully");
        });
        */

/*
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
});*/

    
/*
*   Los metodos de SUPABASE, son:
    And, BaseUrl, Clear, Columns, Count, Delete, Equals, Filter<>, GenerateUrl, Get,
    GetHashCode, GetHeaders, GetType, Insert, Limit, Match, Match, Not, Not<>, Offset, 
    OnConflict, Or, Order, Range, Select, Set, Single, TableName, ToString, Update, Upsert, Where
*
*/
/*
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
app.MapPost("/BuscarPorCategoria", async (HttpContext context, Supabase.Client client) =>
{
    using var reader = new StreamReader(context.Request.Body);
    try
    {  
        var requestBody = await reader.ReadToEndAsync();
        var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);

        var idBuscado = searchData["idusuario"].ToObject<int>();
        var searchTerm = searchData["searchTerm"].ToObject<string>();
        var category = searchData["category"].ToObject<string>();
        var text = "Buscando solo con la categoría: " + category;
    

        //Añadir busqueda
#pragma warning disable CS8604 // Possible null reference argument.
        var b1 = new Busqueda(text, DateTime.Now, idBuscado, category);
#pragma warning restore CS8604 // Possible null reference argument.

        //Inserto la búsqueda en la base de datos
        await client.From<Busqueda>().Insert(new List<Busqueda> { b1 });

        var ProductosXCat = await client.From<Producto>()
        .Where(p => p.categoria == category).Get();


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
/*
//carga la dirección de un usuario
app.MapGet("/ObtenerInfoUsuario", async (HttpContext context, Supabase.Client client) =>
{
    try
    {      
        // Obtener el ID del producto de la consulta
        var idBuscado = context.Request.Query["idusuario"].ToString();
        //var idBuscado = 1;
        
        var infoC = await client.From<Comprador>().Filter("idusuario", Postgrest.Constants.Operator.Equals, idBuscado).Single();
        if(infoC != null){
             var jsonResponse = new { infoC };
             context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
        }else{
            var infoV = await client.From<Vendedor>().Filter("idusuario", Postgrest.Constants.Operator.Equals, idBuscado).Single();
            if(infoV != null){
                var jsonResponse = new { infoV };
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
            }else{
                var infoT = await client.From<Tecnico>().Filter("idusuario", Postgrest.Constants.Operator.Equals, idBuscado).Single();
                var jsonResponse = new { infoT };
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
            }
        }
    }
    catch (Exception ex)
    {
        // Manejar cualquier error y devolver una respuesta de error al cliente
        errorDefault(context,ex);
    }
});

/*
Codigo Viejo:
app.MapGet("/ObtenerInfoUsuario", async (HttpContext context, Supabase.Client client) =>
{
    try
    {      
        // Obtener el ID del producto de la consulta
        var idBuscado = context.Request.Query["idusuario"].ToString();
        //var idBuscado = 1;
        
        var infoC = await client.From<Comprador>().Filter("idusuario", Postgrest.Constants.Operator.Equals, idBuscado).Single();
        if(infoC != null){
             var jsonResponse = new { infoC };
             context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
        }else{
            var infoV = await client.From<Vendedor>().Filter("idusuario", Postgrest.Constants.Operator.Equals, idBuscado).Single();
            if(infoV != null){
                var jsonResponse = new { infoV };
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
            }else{
                var infoT = await client.From<Tecnico>().Filter("idusuario", Postgrest.Constants.Operator.Equals, idBuscado).Single();
                var jsonResponse = new { infoT };
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
            }
        }
    }
    catch (Exception ex)
    {
        // Manejar cualquier error y devolver una respuesta de error al cliente
        errorDefault(context,ex);
    }
});
*/
/*
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

/*
Codigo Viejo:
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
        var usuario = await client.From<Comprador>().Filter("idusuario", Postgrest.Constants.Operator.Equals, idusuario).Single();

        //guardo la tarjeta de crédito
       // usuario.CVV = cvv;
        //usuario.numeroTarjeta = numTarjeta;
        //usuario.fechaCaducidad = fechaCaducidad;

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
        await usuario.Update<Comprador>();

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
*/
/*
Codigo Viejo:
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
        var usuario = await client.From<Comprador>().Filter("idusuario", Postgrest.Constants.Operator.Equals, idusuario).Single();

        //guardo la tarjeta de crédito
       // usuario.CVV = cvv;
        //usuario.numeroTarjeta = numTarjeta;
        //usuario.fechaCaducidad = fechaCaducidad;

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
        await usuario.Update<Comprador>();

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

*/
/*


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
*/
/*
app.MapPost("/validarProductoX", async (HttpContext context, Supabase.Client client) =>
{
    using (var reader = new StreamReader(context.Request.Body))
    {
        try{
            var requestBody = await reader.ReadToEndAsync();
            var productoData = JsonConvert.DeserializeObject<Producto>(requestBody);

            var result = await client.From<Producto>()
                                    .Where(p => p.idproducto == productoData.idproducto && p.validado == true)
                                    .Select("precio, cantidad, categoria, descripcion, imagenes, nombreproducto")
                                    .Get();

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

#pragma warning disable CS8602 // Esto es para quitar un warning raro
#pragma warning restore CS8602 // Y aqui para volver a instaurarlo

            var result2 = await client.From<Producto>()
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


});
*/
/*
Codigo Viejo:

app.MapPost("/iniciarSesion", async (HttpContext context, Supabase.Client client) =>
{
    try
    {
        var correoUsuario = context.Request.Form["correo"].ToString();
        var contraUsuario = context.Request.Form["contraseña"].ToString();

        // Buscar el usuario por su correo electrónico
         var usuario = await client.From<Usuario>().Filter("correo", Postgrest.Constants.Operator.Equals, correoUsuario).Single();

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
                var vendedor = await client.From<Vendedor>().Where(v => v.idusuario == usuario.idusuario).Single();
                var tecnico = await client.From<Tecnico>().Where(t => t.idusuario == usuario.idusuario).Single();

                //Asigna valor al ID_USUARIO del backend
                ID_USUARIO = usuario.idusuario;
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
*/
/*


app.MapPost("/iniciarSesion", async (HttpContext context, Supabase.Client client) =>
{
    try
    {
        var correoUsuario = context.Request.Form["correo"].ToString();
        var contraUsuario = context.Request.Form["contraseña"].ToString();

        // Buscar el usuario por su correo electrónico
         //var usuario = await client.From<Usuario>().Filter("correo", Postgrest.Constants.Operator.Equals, correoUsuario).Single();
         var vendedor = await client.From<Vendedor>().Filter("correo", Postgrest.Constants.Operator.Equals, correoUsuario).Single();
        if (vendedor != null)
        {
             if (vendedor.contraseña == contraUsuario)
            {
               var jsonResponse = new Dictionary<string, object>
                {
                    { "Id", vendedor.idusuario }, // Asumiendo que idusuario no puede ser nulo, pero ajusta esto según tus requisitos
                    { "Nombre", vendedor.nombre ?? "UsuarioPorDefecto" }, // Si nombre es nullable, usa el operador de coalescencia nula para proporcionar un valor predeterminado en caso de que sea nulo
                    { "Correo", vendedor.correo ?? "CorreoPorDefecto" },
                    { "TipoUsuario", "TipoUusarioPorDefecto" }
                }; 
                jsonResponse["TipoUsuario"] = "Vendedor";
                context.Response.StatusCode = 200;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
            }else{
                    // La contraseña es incorrecta
                    context.Response.StatusCode = 401; // Unauthorized
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(new { error = "Contraseña incorrecta" }));
                }
        }else{
            var tecnico = await client.From<Tecnico>().Filter("correo", Postgrest.Constants.Operator.Equals, correoUsuario).Single();
            if (tecnico != null){
                if (tecnico.contraseña == contraUsuario)
                {
                var jsonResponse = new Dictionary<string, object>
                    {
                        { "Id", tecnico.idusuario }, // Asumiendo que idusuario no puede ser nulo, pero ajusta esto según tus requisitos
                        { "Nombre", tecnico.nombre ?? "UsuarioPorDefecto" }, // Si nombre es nullable, usa el operador de coalescencia nula para proporcionar un valor predeterminado en caso de que sea nulo
                        { "Correo", tecnico.correo ?? "CorreoPorDefecto" },
                        { "TipoUsuario", "TipoUusarioPorDefecto" }
                    }; 
                    jsonResponse["TipoUsuario"] = "Técnico";
                    context.Response.StatusCode = 200;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
                }else{
                        // La contraseña es incorrecta
                        context.Response.StatusCode = 401; // Unauthorized
                        context.Response.ContentType = "application/json";
                        await context.Response.WriteAsync(JsonConvert.SerializeObject(new { error = "Contraseña incorrecta" }));
                    }
            }else{
                var comprador = await client.From<Comprador>().Where(c => c.correo == correoUsuario).Single();
                if (comprador != null){
                    if(comprador.contraseña == contraUsuario)
                        {
                        var jsonResponse = new Dictionary<string, object>
                            {
                                { "Id", comprador.idusuario }, // Asumiendo que idusuario no puede ser nulo, pero ajusta esto según tus requisitos
                                { "Nombre", comprador.nombre ?? "UsuarioPorDefecto" }, // Si nombre es nullable, usa el operador de coalescencia nula para proporcionar un valor predeterminado en caso de que sea nulo
                                { "Correo", comprador.correo ?? "CorreoPorDefecto" },
                                { "TipoUsuario", "TipoUusarioPorDefecto" }
                            }; 
                            jsonResponse["TipoUsuario"] = "Usuario Común";
                            context.Response.StatusCode = 200;
                            context.Response.ContentType = "application/json";
                            await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
                        }else{
                            // La contraseña es incorrecta
                            context.Response.StatusCode = 401; // Unauthorized
                            context.Response.ContentType = "application/json";
                            await context.Response.WriteAsync(JsonConvert.SerializeObject(new { error = "Contraseña incorrecta" }));
                        }
                    }else{
                            // No se encontró ningún usuario con ese correo electrónico
                            context.Response.StatusCode = 401; // Unauthorized
                            context.Response.ContentType = "application/json";
                            await context.Response.WriteAsync(JsonConvert.SerializeObject(new { error = "Usuario no encontrado" }));
                        }
                }
        }
    }
    catch (Exception ex)
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "text/plain";
        await context.Response.WriteAsync($"Error interno del servidor: {ex.Message}");
    }

app.MapGet("/getID", async (HttpContext context) =>
{
    var jsonResponse = new { ID_USUARIO };
    context.Response.ContentType = "application/json";
    await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
});


app.MapPost("/AgregarComprador", async (HttpContext context,Supabase.Client client) =>
{
    using (var reader = new StreamReader(context.Request.Body))
    {
        try{
            Console.WriteLine("Hola, mundo!"); 
            var requestBody = await reader.ReadToEndAsync();
            var productoData = JsonConvert.DeserializeObject<Comprador>(requestBody);
            
            // Utiliza los datos recibidos para crear un nuevo producto
            var fabrica = new FabricaDeUsuarios();

#pragma warning disable CS8602 // Esto es para quitar un warning raro
//CrearUsuario(string tipoUsuario, string nombre, int movil, string correo, string contraseña, string direccion, string nombreTienda = "", 
                                           // int telefonoTienda = 0,int CVV = 0, int numTarjeta = 0,string fechaCaducidad = "")
            var nuevoUsuario = fabrica.CrearUsuario(
                productoData.tipoUsuario ?? "",
                productoData.nombre ?? "Usuario de Serie Creación", //Este tmb
                productoData.movil ?? 0, 
                productoData.correo ?? "Correo Usuario", 
                productoData.contraseña ?? "xxxx", 
                productoData.direccion ?? "direccion usuario",
                "",
                0000,
                productoData.CVV ?? 0,
                productoData.numeroTarjeta ?? 0,
                productoData.fechaCaducidad ?? "/rutaPrueba");
                

#pragma warning restore CS8602 // Y aqui para volver a instaurarlo

            // Inserta el nuevo producto en la base de datos
            
            await client.From<Comprador>().Insert(new List<Comprador> { (Comprador) nuevoUsuario });
           // await client.From<Usuario>().Insert(new List<Usuario> {  nuevoUsuario });

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

app.MapPost("/AgregarVendedor", async (HttpContext context,Supabase.Client client) =>
{
    using (var reader = new StreamReader(context.Request.Body))
    {
        try{
            var requestBody = await reader.ReadToEndAsync();
            var productoData = JsonConvert.DeserializeObject<Vendedor>(requestBody);
            var fabrica = new FabricaDeUsuarios();
            var nuevoUsuario = fabrica.CrearUsuario(
                productoData.tipoUsuario ?? "",
                productoData.nombre ?? "Usuario de Serie Creación", //Este tmb
                productoData.movil ?? 0, 
                productoData.correo ?? "Correo Usuario", 
                productoData.contraseña ?? "xxxx", 
                productoData.direccion ?? "direccion usuario",
                productoData.nombretienda ?? "nombre tienda",
                productoData.telefonotienda ?? 0000,
                0,
                0,
                "");
            
            await client.From<Vendedor>().Insert(new List<Vendedor> { (Vendedor) nuevoUsuario });
    

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

    */
}