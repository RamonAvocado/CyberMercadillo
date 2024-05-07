using Supabase;
using Newtonsoft.Json;
using CyberMercadillo.BusinessLogic;
using CyberMercadillo.Entities;
using Newtonsoft.Json.Linq;


class Servicios{

    public Servicios(FachadaLogica fachadaLogica, WebApplication app){

        // Obtinene los 6 primeros productos, ya que no hay productos destacados
        app.MapGet("/ObtenerProductosDestacados", async (HttpContext context, Supabase.Client client) =>
        {
            try
            {
                var productos = fachadaLogica.returnTienda().GetProductos();
                // Devolver los productos al frontend
                
                var jsonResponse = new { productos };
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));

            }catch (Exception ex){errorDefault(context,ex);}
        });

        // Obtinene los 6 primeros productos, ya que no hay productos destacados
        app.MapGet("/ObtenerProductosRecomendados", async (HttpContext context, Supabase.Client client) =>
        {
            try
            {
                //HABRÁ QUE HACER LA LÓGICA PARA CARGAR LOS PRODCUTOS RECOMENDADOS EN BASE A BUSQUEDAS Y COMPRAS
                var productos = fachadaLogica.returnTienda().GetProductos();
                // Devolver los productos al frontend
                
                var jsonResponse = new { productos };
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
            }catch (Exception ex){errorDefault(context,ex);}
        });

        // Obtinene TODOS los productos
        app.MapGet("/ObtenerTodosProductos", async (HttpContext context, Supabase.Client client) =>
        {
            try
            {
                //HABRÁ QUE HACER LA LÓGICA PARA CARGAR LOS PRODCUTOS RECOMENDADOS EN BASE A BUSQUEDAS Y COMPRAS
                var productos = fachadaLogica.returnTienda().GetProductos();
                // Devolver los productos al frontend
                
                var jsonResponse = new { productos };
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
            }catch (Exception ex){errorDefault(context,ex);}
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
            }catch (Exception ex){errorDefault(context,ex);}
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
            }catch (Exception ex){errorDefault(context,ex);}
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
            }catch (Exception ex){errorDefault(context,ex);}
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
            }catch (Exception ex){errorDefault(context,ex);}
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

                    var jsonResponse = new { productos };
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
            }catch (Exception ex){errorDefault(context,ex);}
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
            }catch (Exception ex){errorDefault(context,ex);}
        });

        app.MapGet("/ObtenerProductosAValidar", async (HttpContext context, Supabase.Client client) =>
        {
            try
            {   
                var productos = fachadaLogica.GetProductosAValidar(); 

                var jsonResponse = new { productos };
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
            }catch (Exception ex){errorDefault(context,ex);}
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
            }catch (Exception ex){errorDefault(context,ex);}
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
                    var certiEco = productoData["certificadoHuella"].ToObject<string>();
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
                                                   puntuacionH,
                                                   certiEco ?? "pdf");
                    // Inserta el nuevo producto en la base de datos
                   // await client.From<Producto>().Insert(new List<Producto> { nuevoProducto });

                    // Devuelve una respuesta al frontend (opcional)
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync("Producto creado exitosamente");
                }catch (Exception ex){errorDefault(context,ex);}

            return Results.Ok("Producto created successfully"); 
        });

        app.MapPost("/buscarProductoSeleccionado", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
                try{
                    var requestBody = await reader.ReadToEndAsync();
                    var productoData = JsonConvert.DeserializeObject<JObject>(requestBody);
                    var idProductoBuscado = productoData["idproducto"].ToObject<string>();

                    
                    var producto = fachadaLogica.returnTienda().buscarIDTodos(idProductoBuscado ?? "0");
                    // Devolver los productos al frontend
                    var jsonResponse = new { producto };
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
                }catch (Exception ex){errorDefault(context,ex);}
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
                }catch (Exception ex){errorDefault(context,ex);}
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
                }catch (Exception ex){errorDefault(context,ex);}
        });

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
                }catch (Exception ex){errorDefault(context,ex);}
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
                    var certificadoH = productoData["certificadoHuella"].ToObject<string>();
                    fachadaLogica.actualizarProductoGuardado(nombreP ?? "Producto de Serie Creación",
                                                   precioP ?? "-1",
                                                   categoriaP ?? "CatPrueba",
                                                   descripcionP ?? "Este artículo es el predeterminado por si llega un null a esta función",
                                                   imgP ?? "/rutaPrueba",
                                                   cantidadP,                                       
                                                   idproductoP ?? "0",
                                                   puntuacionH,
                                                   certificadoH);
                    Console.WriteLine("pedido");

                    // Devuelve una respuesta al frontend (opcional)
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync("Producto creado exitosamente");
                }catch (Exception ex){errorDefault(context,ex);}

            return Results.Ok("Producto created successfully"); 
        });


        app.MapPost("/eliminarProductoSeleccionado", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
                try{
                    var requestBody = await reader.ReadToEndAsync();
                    var productoData = JsonConvert.DeserializeObject<JObject>(requestBody);
                    var idproductoSeleccionado = productoData["idproducto"].ToObject<string>();

                    fachadaLogica.returnTienda().eliminarProductoID(idproductoSeleccionado ?? "0");
                }
                catch (Exception ex){errorDefault(context,ex);}

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
                catch (Exception ex){errorDefault(context,ex);}
        });

        app.MapPost("/validarProductoSeleccionado", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
                try{
                    var requestBody = await reader.ReadToEndAsync();
                    var productoData = JsonConvert.DeserializeObject<JObject>(requestBody);
                    var idproductoSeleccionado = productoData["idproducto"].ToObject<string>();
                    bool validado = fachadaLogica.validarProducto(idproductoSeleccionado ?? "0");
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
                var productos = fachadaLogica.returnTienda().GetProductosBusqueda(searchTerm ?? "", idBuscado);

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
                var searchTerm = searchData["searchTerm"].ToObject<string>();
                var idBuscado = searchData["idBuscado"].ToObject<int>();
                

                //recupero los productos con esta categoría
                var productos = fachadaLogica.returnTienda().GetProdBusquedaFiltro(category ?? "Todas las categorias");
                fachadaLogica.returnTienda().GuardarBusqueda(searchTerm ?? "", idBuscado);

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

        app.MapPost("/FiltroPorPrecio", async (HttpContext context, Supabase.Client client) =>
        {
            // Leer el cuerpo de la solicitud para obtener la información de búsqueda
            using var reader = new StreamReader(context.Request.Body);
            try
            {
                var requestBody = await reader.ReadToEndAsync();
                var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);

                 var precioMin = searchData["minPrice"].ToObject<int>();
                 var precioMax = searchData["maxPrice"].ToObject<int>();
                 var category = searchData["category"].ToObject<string>();
                

                Console.WriteLine("Preciomin y PrecioMax" + precioMin + " " + precioMax); 
                var productosCat = fachadaLogica.returnTienda().GetProdBusquedaFiltro(category ?? "Todas las categorías");
                var productos = fachadaLogica.returnTienda().FiltrarProductosPorPrecio(productosCat, precioMin, precioMax, category ?? "Todas las categorías");

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


        app.MapPost("/FiltroPorEco", async (HttpContext context, Supabase.Client client) =>
        {
            // Leer el cuerpo de la solicitud para obtener la información de búsqueda
            using var reader = new StreamReader(context.Request.Body);
            try
            {
                var requestBody = await reader.ReadToEndAsync();
                var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);

                 var minPrice = searchData["minPrice"].ToObject<int>();
                 var maxPrice = searchData["maxPrice"].ToObject<int>();
                 var category = searchData["category"].ToObject<string>();
                 var valoracion = searchData["valoracion"].ToObject<int>();
                 Console.WriteLine(valoracion);  

                 Console.WriteLine("Preciomin y PrecioMax" + minPrice + " " + maxPrice + "valoracion" + "category" + category);  
                

                Console.WriteLine("Preciomin y PrecioMax" + minPrice + " " + maxPrice); 
                var productosCat = fachadaLogica.returnTienda().GetProdBusquedaFiltro(category ?? "");
                var productosPrec = fachadaLogica.returnTienda().FiltrarProductosPorPrecio(productosCat, minPrice, maxPrice, category ?? "Todas las categorías");
                var productos = fachadaLogica.returnTienda().FiltrarProductosPorValoracion(productosCat,productosPrec, valoracion, category ?? "Todas las categorías");

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

        app.MapGet("/guardar-archivo", async (HttpContext context, Supabase.Client client) =>
        {
            try
            {
                var archivo = context.Request.Form.Files.GetFile("archivo");

                if (archivo != null && archivo.Length > 0)
                {
                    // Ruta donde deseas guardar el archivo
                    string rutaDestino = "./CERTIFICADOS" + archivo.FileName;
                    using (var stream = new FileStream(rutaDestino, FileMode.Create))
                    {
                        await archivo.CopyToAsync(stream);
                    }
                    // Archivo guardado correctamente
                    await context.Response.WriteAsync("Archivo guardado correctamente.");
                }
                else
                {
                    // Manejar el caso donde no se seleccionó ningún archivo.
                    context.Response.StatusCode = 400; // Bad Request
                    await context.Response.WriteAsync("No se seleccionó ningún archivo.");
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
        
}