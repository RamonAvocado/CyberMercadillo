using Supabase;
using Newtonsoft.Json;
using CyberMercadillo.BusinessLogic;
using CyberMercadillo.Entities;
using Newtonsoft.Json.Linq;
using Microsoft.VisualBasic;


class Servicios{

    public Servicios(FachadaLogica fachadaLogica, WebApplication app){

        // Obtinene los 6 primeros productos, ya que no hay productos destacados
        app.MapGet("/ObtenerProductosDestacados",(HttpContext context, Supabase.Client client) =>
        {
            try{
                var productos = fachadaLogica.GetProductos();
                devolverFrontEnd(context, productos);
            }catch (Exception ex){errorDefault(context,ex);}
        });


        // Obtinene los 6 primeros productos, ya que no hay productos destacados
        app.MapGet("/ObtenerProductosRecomendados",(HttpContext context, Supabase.Client client) =>
        {
            try{
                var productos = fachadaLogica.GetProductosRecomendados();
                foreach (Producto p in productos){
                    //Console.WriteLine(p.nombreproducto + " descuento: " + p.descuento);
                }
                devolverFrontEnd(context, productos);
            }catch (Exception ex){errorDefault(context,ex);}
        });

        // Obtinene TODOS los productos
        app.MapGet("/ObtenerTodosProductos", (HttpContext context, Supabase.Client client) =>
        {
            try{
                //HABRÁ QUE HACER LA LÓGICA PARA CARGAR LOS PRODCUTOS RECOMENDADOS EN BASE A BUSQUEDAS Y COMPRAS
                var productos = fachadaLogica.GetProductos();
                devolverFrontEnd(context, productos);
            }catch (Exception ex){errorDefault(context,ex);}
        });

        app.MapGet("/ObtenerProductoPorID",(HttpContext context, Supabase.Client client) =>
        {
            try{
                var idBuscado = context.Request.Query["idproducto"].ToString();

                var producto = fachadaLogica.buscarIDTodos(idBuscado);
                devolverFrontEnd(context, new List<Producto>{producto});
            }catch (Exception ex){errorDefault(context,ex);}
        });

        app.MapPost("/ActualizarCantidadProducto", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
            try{
                //Leer frontend
                var requestBody = await reader.ReadToEndAsync();
                var datosProducto = JsonConvert.DeserializeObject<JObject>(requestBody);

                var idusuario = datosProducto["idusuario"].ToObject<int>();
                var idproducto = datosProducto["idproducto"].ToObject<int>();
                var nuevaCantidad = datosProducto["nuevaCantidad"].ToObject<int>();

                var guay = fachadaLogica.ActualizarCantidadProducto(idusuario, idproducto, nuevaCantidad);

                devolverFrontEnd(context, new List<Boolean> {guay});
            }catch (Exception ex){errorDefault(context,ex);}
        });

        app.MapPost("/EliminarProductoDelCarrito", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
            try{
                //Leer frontend
                var requestBody = await reader.ReadToEndAsync();
                var datosProducto = JsonConvert.DeserializeObject<JObject>(requestBody);

                var idusuario = datosProducto["idusuario"].ToObject<int>();
                var idproducto = datosProducto["idproducto"].ToObject<string>();


                fachadaLogica.EliminarProductoDelCarrito(idusuario, idproducto??"1");
                
                //HERNAN ES NECESARIO ESTE JSONRESPONSE???
                var jsonResponse = new { };
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
            }catch (Exception ex){errorDefault(context,ex);}
        });

        app.MapPost("/EliminarProductoDeListaDeseados", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
            try{
                //Leer frontend
                var requestBody = await reader.ReadToEndAsync();
                var datosProducto = JsonConvert.DeserializeObject<JObject>(requestBody);

                var idusuario = datosProducto["idusuario"].ToObject<int>();
                var idproducto = datosProducto["idproducto"].ToObject<string>();


                fachadaLogica.EliminarProductoDeListaDeseados(idusuario, idproducto??"1");
                
                var jsonResponse = new { };
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
            }catch (Exception ex){errorDefault(context,ex);}
        });

        //que las categorías de todos los productos
        app.MapGet("/CargarCategorias", (HttpContext context, Supabase.Client client) =>
        {
            try{
                //HABRÁ QUE HACER LA LÓGICA PARA CARGAR LOS PRODCUTOS RECOMENDADOS EN BASE A BUSQUEDAS Y COMPRAS
                var categorias = fachadaLogica.GetCategorías();
                devolverFrontEnd(context, categorias);
            }catch (Exception ex){errorDefault(context,ex);}
        });

        app.MapPost("/ObtenerProductosVendedor", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
                try{      
                    var requestBody = await reader.ReadToEndAsync();
                    var usuarioData = JsonConvert.DeserializeObject<JObject>(requestBody);
                    var idBuscado = usuarioData["idusuario"].ToObject<int>();
                    
                    var productos = fachadaLogica.GetTodosProductosVendedor(idBuscado);
                    devolverFrontEnd(context, productos);
            }catch (Exception ex){errorDefault(context,ex);}
        });

        app.MapPost("/ObtenerProductosVendedorGuardados", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
                try{      
                    var requestBody = await reader.ReadToEndAsync();
                    var usuarioData = JsonConvert.DeserializeObject<JObject>(requestBody);
                    var idBuscado = usuarioData["idusuario"].ToObject<int>();
                    
                    var productos = fachadaLogica.GetProductosVendedorGuardados(idBuscado);
                    devolverFrontEnd(context, productos);
            }catch (Exception ex){errorDefault(context,ex);}
        });

        app.MapGet("/ObtenerProductosAValidar", (HttpContext context, Supabase.Client client) =>
        {
            try{   
                var productos = fachadaLogica.GetProductosAValidar(); 
                devolverFrontEnd(context, productos);
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
                devolverFrontEnd(context, productos);
            }catch (Exception ex){errorDefault(context,ex);}
        });

        //RARO
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
                    var llegada = productoData["llegada"].ToObject<string>();
                    var descuento = productoData["descuento"].ToObject<int>();
                    
                    
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
                                                   certiEco ?? "pdf",
                                                   llegada ?? "18 de Junio",
                                                   descuento);
                    // Inserta el nuevo producto en la base de datos
                   // await client.From<Producto>().Insert(new List<Producto> { nuevoProducto });
                }catch (Exception ex){errorDefault(context,ex);}
        });

        app.MapPost("/buscarProductoSeleccionado", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
                try{
                    var requestBody = await reader.ReadToEndAsync();
                    var productoData = JsonConvert.DeserializeObject<JObject>(requestBody);
                    var idProductoBuscado = productoData["idproducto"].ToObject<string>();

                    
                    var producto = fachadaLogica.buscarIDTodos(idProductoBuscado ?? "0");

                    devolverFrontEnd(context, new List<Producto>{producto});
                }catch (Exception ex){errorDefault(context,ex);}
        });
        app.MapPost("/buscarUsuario", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
                try{
                    var requestBody = await reader.ReadToEndAsync();
                    var userData = JsonConvert.DeserializeObject<JObject>(requestBody);
                    var idUserSelect = userData["idusuario"].ToObject<int>();
                    var usuario = fachadaLogica.buscarUsuario(idUserSelect);

                    if (usuario != null){devolverFrontEnd(context, new List<Usuario>{usuario});
                    }else{devolverFrontEnd(context, new List<String>{"User no existe"});}              
                }catch (Exception ex){errorDefault(context,ex);}
        });

        app.MapPost("/buscarVendedor", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
                try{
                    var requestBody = await reader.ReadToEndAsync();
                    var userData = JsonConvert.DeserializeObject<JObject>(requestBody);
                    var idUserSelect = userData["idusuario"].ToObject<string>();
                    var vendedor = fachadaLogica.buscarVendedor(idUserSelect ?? "0");
                    if (vendedor != null){
                        devolverFrontEnd(context, new List<Vendedor>{vendedor});
                    }else{
                        var jsonResponse = new { mensaje = "User no existe"};
                        context.Response.ContentType = "application/json";
                        await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
                    }              
                }catch (Exception ex){errorDefault(context,ex);}
        });
        
        app.MapPost("/buscarComprador", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
                try{
                    var requestBody = await reader.ReadToEndAsync();
                    var userData = JsonConvert.DeserializeObject<JObject>(requestBody);
                    var idUserSelect = userData["idusuario"].ToObject<string>();
                    var comprador = fachadaLogica.buscarComprador(idUserSelect ?? "0");

                    devolverFrontEnd(context, new List<Comprador>{comprador});
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
                var descuento = productoData["descuento"].ToObject<int>();
                var idproductoP = productoData["idproducto"].ToObject<string>();
                fachadaLogica.actualizarProducto(precioP ?? "-1",
                                                descripcionP ?? "Este artículo es el predeterminado por si llega un null a esta función",
                                                cantidadP,                                       
                                                idproductoP ?? "0",
                                                descuento);
                Console.WriteLine("pedido");
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
                    var descuento = productoData["descuento"].ToObject<int>();
                    fachadaLogica.actualizarProductoGuardado(nombreP ?? "Producto de Serie Creación",
                                                   precioP ?? "-1",
                                                   categoriaP ?? "CatPrueba",
                                                   descripcionP ?? "Este artículo es el predeterminado por si llega un null a esta función",
                                                   imgP ?? "/rutaPrueba",
                                                   cantidadP,                                       
                                                   idproductoP ?? "0",
                                                   puntuacionH,
                                                   certificadoH ?? "",
                                                   descuento);
                    Console.WriteLine("pedido");
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

                fachadaLogica.eliminarProductoID(idproductoSeleccionado ?? "0");
            }catch (Exception ex){errorDefault(context,ex);}
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
            }catch (Exception ex){errorDefault(context,ex);}
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
            }catch (Exception ex){errorDefault(context,ex);}
        });

        app.MapPost("/iniciarSesion", async (HttpContext context, Supabase.Client client) =>
        {
            try{
                var correoUsuario = context.Request.Form["correo"].ToString();
                var contraUsuario = context.Request.Form["contraseña"].ToString();

                // Buscar el usuario por su correo electrónico
                var user = fachadaLogica.buscarUsuario(correoUsuario, contraUsuario);

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
            }catch (Exception ex){errorDefault(context,ex);}
        });

        app.MapPost("/BuscarProductos", async (HttpContext context, Supabase.Client client) =>
        {
            // Leer el cuerpo de la solicitud para obtener la información de búsqueda
            using var reader = new StreamReader(context.Request.Body);
            try{
                var requestBody = await reader.ReadToEndAsync();
                var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);

                var idBuscado = searchData["idusuario"].ToObject<int>();
                var searchTerm = searchData["searchTerm"].ToObject<string>();

                //recupero los productos con esta categoría
                var productos = fachadaLogica.GetProductosBusqueda(searchTerm ?? "", idBuscado);
                devolverFrontEnd(context, productos);
            }catch (Exception ex){errorDefault(context,ex);}
        });

        app.MapPost("/GetProdBusquedas", async (HttpContext context, Supabase.Client client) =>
        {
            // Leer el cuerpo de la solicitud para obtener la información de búsqueda
            using var reader = new StreamReader(context.Request.Body);
            try{
                var requestBody = await reader.ReadToEndAsync();
                var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);

                var category = searchData["category"].ToObject<string>();
                var searchTerm = searchData["searchTerm"].ToObject<string>();
                var idBuscado = searchData["idBuscado"].ToObject<int>();

                //recupero los productos con esta categoría
                var productos = fachadaLogica.GetProdBusquedaFiltro(category ?? "Todas las categorias");
                fachadaLogica.GuardarBusqueda(searchTerm ?? "", idBuscado);

                devolverFrontEnd(context, productos);
            }catch (Exception ex){errorDefault(context,ex);}
        });

        app.MapPost("/FiltroPorPrecio", async (HttpContext context, Supabase.Client client) =>
        {
            // Leer el cuerpo de la solicitud para obtener la información de búsqueda
            using var reader = new StreamReader(context.Request.Body);
            try{
                var requestBody = await reader.ReadToEndAsync();
                var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);

                 var precioMin = searchData["minPrice"].ToObject<int>();
                 var precioMax = searchData["maxPrice"].ToObject<int>();
                 var category = searchData["category"].ToObject<string>();
                

                Console.WriteLine("Preciomin y PrecioMax" + precioMin + " " + precioMax); 
                var productosCat = fachadaLogica.GetProdBusquedaFiltro(category ?? "Todas las categorías");
                var productos = fachadaLogica.FiltrarProductosPorPrecio(productosCat, precioMin, precioMax, category ?? "Todas las categorías");

                devolverFrontEnd(context, productos);
            }catch (Exception ex){errorDefault(context,ex);}
        });

        app.MapPost("/FiltroPorEco", async (HttpContext context, Supabase.Client client) =>
        {
            // Leer el cuerpo de la solicitud para obtener la información de búsqueda
            using var reader = new StreamReader(context.Request.Body);
            try{
                var requestBody = await reader.ReadToEndAsync();
                var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);

                 var minPrice = searchData["minPrice"].ToObject<int>();
                 var maxPrice = searchData["maxPrice"].ToObject<int>();
                 var category = searchData["category"].ToObject<string>();
                 var valoracion = searchData["valoracion"].ToObject<int>();
                 Console.WriteLine(valoracion);  

                 Console.WriteLine("Preciomin y PrecioMax" + minPrice + " " + maxPrice + "valoracion" + "category" + category);  
                

                Console.WriteLine("Preciomin y PrecioMax" + minPrice + " " + maxPrice); 
                var productosCat = fachadaLogica.GetProdBusquedaFiltro(category ?? "");
                var productosPrec = fachadaLogica.FiltrarProductosPorPrecio(productosCat, minPrice, maxPrice, category ?? "Todas las categorías");
                var productos = fachadaLogica.FiltrarProductosPorValoracion(productosCat,productosPrec, valoracion, category ?? "Todas las categorías");

                devolverFrontEnd(context, productos);
            }catch (Exception ex){errorDefault(context,ex);}
        });


        app.MapPost("/AñadirAlCarritoCompra", async (HttpContext context, Supabase.Client client) =>
        {
            // Leer el cuerpo de la solicitud para obtener la información de búsqueda
            using var reader = new StreamReader(context.Request.Body);
            try{
                var requestBody = await reader.ReadToEndAsync();
                var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);

                var idBuscado = searchData["idusuario"].ToObject<int>();
                var idproducto = searchData["idproducto"].ToObject<string>();
                var cantProducto = searchData["cantProducto"].ToObject<string>();

                //recupero los productos con esta categoría
                var guay = fachadaLogica.AñadirAlCarritoCompra(idBuscado, idproducto??"1", cantProducto??"1");

                //Console.WriteLine("idBuscado: " + idBuscado + ", idproducto: " + idproducto);

                devolverFrontEnd(context, new List<Boolean> {guay});
            }catch (Exception ex){errorDefault(context,ex);}
        });

        app.MapPost("/AñadirADeseos", async (HttpContext context, Supabase.Client client) =>
        {
            // Leer el cuerpo de la solicitud para obtener la información de búsqueda
            using var reader = new StreamReader(context.Request.Body);
            try{
                var requestBody = await reader.ReadToEndAsync();
                var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);

                var idBuscado = searchData["idusuario"].ToObject<int>();
                var idproducto = searchData["idproducto"].ToObject<string>();
                Console.WriteLine("idBuscado: " + idBuscado + ", idproducto: " + idproducto);
                //recupero los productos con esta categoría
                var recupero = fachadaLogica.AñadirADeseos(idBuscado, idproducto??"1");

                //Console.WriteLine("idBuscado: " + idBuscado + ", idproducto: " + idproducto);

                devolverFrontEnd(context, new List<Boolean> {recupero});
            }catch (Exception ex){errorDefault(context,ex);}
        });

        app.MapPost("/ObtenerCarritoCompra", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
            try{
                var requestBody = await reader.ReadToEndAsync();
                var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);

                var idusuario = searchData["idusuario"].ToObject<int>();

                //recupero los productos con esta categoría
                var carritoCompra = fachadaLogica.ObtenerCarritoCompra(idusuario);

                devolverFrontEnd(context, carritoCompra);
            }catch (Exception ex){errorDefault(context,ex);}
        });

        app.MapPost("/ObtenerListaDeseados", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
            try{
                var requestBody = await reader.ReadToEndAsync();
                var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);
                
                var idusuario = searchData["idusuario"].ToObject<int>();

                var listaDeseados = fachadaLogica.ObtenerListaDeseados(idusuario);
                devolverFrontEnd(context, listaDeseados);
                
            }catch (Exception ex){errorDefault(context,ex);}
         });
         

        app.MapPost("/TramitarPedido", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
            try
            {
                var requestBody = await reader.ReadToEndAsync();
                var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);

                var idusuario = searchData["idusuario"].ToObject<int>();

                var guay = fachadaLogica.TramitarPedido(idusuario);

                devolverFrontEnd(context, new List<Boolean> {guay});
            }
            catch (Exception ex)
            {
                // Manejar cualquier error y devolver una respuesta de error al cliente
                errorDefault(context, ex);
            }
        });
        
        app.MapPost("/CargarPedidos", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
            try
            {
                var requestBody = await reader.ReadToEndAsync();
                var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);

                var idusuario = searchData["idusuario"].ToObject<int>();

                //recupero los productos con esta categoría
                var carritos = fachadaLogica.CargarPedidos(idusuario);

                var jsonResponse = new { carritos };

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
            try{
                var requestBody = await reader.ReadToEndAsync();
                var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);

                var idusuario = searchData["idusuario"].ToObject<int>();

                //recupero la información del usuairo por su id
                var info = fachadaLogica.buscarUsuario(idusuario);

                var jsonResponse = new { info };

                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
            }catch (Exception ex){errorDefault(context,ex);}
        });

    app.MapPost("/GuardarDatosUsuario", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
            try
            {
                var requestBody = await reader.ReadToEndAsync();
                var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);

                var idusuario = searchData["idusuario"].ToObject<int>();
                var numTarjeta = searchData["numTarjeta"].ToObject<int>();
                var fechaCaducidad = searchData["fechaCaducidad"].ToObject<string>();
                var cvv = searchData["cvv"].ToObject<int>();

                //recupero la información del usuairo por su id
                var guay = fachadaLogica.GuardarDatosUsuario(idusuario, numTarjeta, fechaCaducidad??"0", cvv);

                devolverFrontEnd(context, new List<Boolean> {guay});
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
            try{
                //Leer frontend
                var requestBody = await reader.ReadToEndAsync();
                var idProductoSeleccionado = JsonConvert.DeserializeObject(requestBody);

                //Crear PDF
                var producto = fachadaLogica.GetProductoPorID(idProductoSeleccionado.ToString() ?? "0");
                
                //Devolver PDF
                context.Response.ContentType = "application/pdf";
                context.Response.Headers.Add("Content-Disposition", "attachment; filename=certificado.pdf");
            }catch (Exception ex){errorDefault(context,ex);}
        });

        app.MapPost("/VerificarContraseñas", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
            try
            {
                var requestBody = await reader.ReadToEndAsync();
                var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);

                var idUser = searchData["idUser"].ToObject<int>();
                var password = searchData["password"].ToObject<string>();

                var guay = fachadaLogica.VerificarContraseñas(password ?? "", idUser);
                
                var jsonResponse = new { guay };
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
                   
            }catch (Exception ex){errorDefault(context,ex);}
        });


        app.MapGet("/getBusquedas", (HttpContext context, Supabase.Client client) =>
        {
            try{
                using (var reader = new StreamReader(context.Request.Body))
                    {
                        var tienda = fachadaLogica.returnTienda();
                        var busquedas = tienda.getBusquedasUsuario(tienda.UsuarioRegistrado);
                        devolverFrontEnd(context, busquedas);
                    }
            }catch (Exception ex){errorDefault(context,ex);}
        });

        app.MapGet("/guardar-archivo", async (HttpContext context, Supabase.Client client) =>
        {
            try{
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
            }catch (Exception ex){errorDefault(context,ex);}
        });

        app.MapPost("/AgregarVendedor", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
            try{      
                var requestBody = await reader.ReadToEndAsync();
                var userData = JsonConvert.DeserializeObject<JObject>(requestBody);

                    var correo = userData["correoUsu"].ToObject<string>();
                    var user = fachadaLogica.buscarCorreoUsu(correo ?? "");
                    if(user == true){
                        var jsonResponse = new { mensaje = "Usuario ya registrado con ese correo", existe = true };
                        context.Response.ContentType = "application/json";
                        await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
                    }else{
                        var nombreV = userData["nombreUsu"].ToObject<string>();
                        var nombreTiendaV = userData["nombreTienda"].ToObject<string>();
                        var tipoUsuario = userData["tipoUsu"].ToObject<string>();
                        var contraseña = userData["contraseña"].ToObject<string>();
                        var direccion = userData["direccion"].ToObject<string>();
                        var movilV = userData["telefono"].ToObject<int>();
                        var telefonotienda = userData["telTienda"].ToObject<int>();
                        fachadaLogica.agregarUsuario(
                            tipoUsuario ?? "Usuario por defecto",
                            nombreV ?? "Usuario de Serie Creación",
                            movilV,
                            correo ?? "Correo Usuario",
                            contraseña ?? "xxxx",
                            direccion ?? "direccion usuario",
                            nombreTiendaV ?? "nombre tienda",
                            telefonotienda,
                            0,
                            0,
                            "",
                            "");
                        var jsonResponse = new { mensaje = "Usuario registrado correctamente", existe = false };
                        context.Response.ContentType = "application/json";
                        await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
                    }
                    
    
            }catch (Exception ex){errorDefault(context,ex);}
        });

app.MapPost("/ActualizarVendedor", async (HttpContext context, Supabase.Client client) =>
        {
            using var reader = new StreamReader(context.Request.Body);
            try{      
                var requestBody = await reader.ReadToEndAsync();
                var userData = JsonConvert.DeserializeObject<JObject>(requestBody);

                    var correo = userData["correoUsu"].ToObject<string>();
                    //var user = fachadaLogica.buscarCorreoUsu(correo ?? "");
                        var nombreV = userData["nombreUsu"].ToObject<string>();
                        var nombreTiendaV = userData["nombreTienda"].ToObject<string>();
                        var contraseña = userData["contraseña"].ToObject<string>();
                        var direccion = userData["direccion"].ToObject<string>();
                        var idvendedor = userData["idvendedor"].ToObject<string>();
                        var imgPerfil = userData["imgPerfil"].ToObject<string>();
                        var movilV = userData["telefono"].ToObject<int>();
                        var telefonotienda = userData["telTienda"].ToObject<int>();
                        var vendedor= fachadaLogica.actualizarVendedor(
                            nombreV ?? "Usuario de Serie Creación",
                            movilV,
                            correo ?? "Correo Usuario",
                            contraseña ?? "xxxx",
                            direccion ?? "direccion usuario",
                            nombreTiendaV ?? "nombre tienda",
                            telefonotienda,
                            //CAMBIAR PONER DIRECCION DE LA FOTO DEFAULT
                            imgPerfil ?? "imagenDefault",
                            idvendedor ?? "0"
                        );
                        devolverFrontEnd(context, new List<Vendedor>{vendedor});
            }catch (Exception ex){errorDefault(context,ex);}
        });

    app.MapPost("/AgregarComprador", async (HttpContext context, Supabase.Client client) =>
    {
        using var reader = new StreamReader(context.Request.Body);
        try{      
            var requestBody = await reader.ReadToEndAsync();
            var userData = JsonConvert.DeserializeObject<JObject>(requestBody);
                var correo = userData["correoUsu"].ToObject<string>();
                var user = fachadaLogica.buscarCorreoUsu(correo ?? "");
                if(user == true){
                    var jsonResponse = new { mensaje = "Usuario ya registrado con ese correo", existe = true };
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
                }else{

                    var nombreV = userData["nombreUsu"].ToObject<string>();
                    var tipoUsuario = userData["tipoUsu"].ToObject<string>();
                    var contraseña = userData["contraseña"].ToObject<string>();
                    var direccion = userData["direccion"].ToObject<string>();
                    var movilV = userData["telefono"].ToObject<int>();
                    var cvv = userData["cvv"].ToObject<int>();
                    var numTarj = userData["numTarj"].ToObject<int>();
                    var FechaCad = userData["FechaCad"].ToObject<string>();
                    var dirFact = userData["dirFacturaccion"].ToObject<string>();
                    fachadaLogica.agregarUsuario(
                        tipoUsuario ?? "Usuario por defecto",
                        nombreV ?? "Usuario de Serie Creación",
                        movilV,
                        correo ?? "Correo Usuario",
                        contraseña ?? "xxxx",
                        direccion ?? "direccion usuario",
                        "Sin tienda",
                        0000,
                        cvv,
                        numTarj,
                        FechaCad ?? "00/00/0000",
                        dirFact ?? "direccion  de facturacion"); 
                    var jsonResponse = new { mensaje = "Usuario registrado correctamente", existe = false };
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
                }

        }catch (Exception ex){errorDefault(context,ex);}
    });

    app.MapPost("/ActualizarComprador", async (HttpContext context, Supabase.Client client) =>
    {
        using var reader = new StreamReader(context.Request.Body);
        try{      
            var requestBody = await reader.ReadToEndAsync();
            var userData = JsonConvert.DeserializeObject<JObject>(requestBody);

                var correo = userData["correoUsu"].ToObject<string>();
                //var user = fachadaLogica.buscarCorreoUsu(correo ?? "");
                    var nombreC = userData["nombreUsu"].ToObject<string>();
                    var contraseña = userData["contraseña"].ToObject<string>();
                    var direccionEnvio = userData["direccion"].ToObject<string>();
                    var direccionFacturacion = userData["dirFacturacion"].ToObject<string>();
                    var idcomprador = userData["idcomprador"].ToObject<string>();
                    var imgPerfil = userData["imgPerfil"].ToObject<string>();
                    var fechaCaducidad = userData["fechaCaducidad"].ToObject<string>();
                    var movilV = userData["telefono"].ToObject<int>();
                    var NumTarjeta = userData["NumTarjeta"].ToObject<int>();
                    var cvv = userData["cvv"].ToObject<int>();
                    var comprador= fachadaLogica.actualizarComprador(
                        nombreC ?? "Usuario de Serie Creación",
                        movilV,
                        correo ?? "Correo Usuario",
                        contraseña ?? "xxxx",
                        direccionEnvio ?? "direccion usuario",
                        fechaCaducidad ?? "nombre tienda",
                        direccionFacturacion ?? "direccion",
                        NumTarjeta,
                        cvv,
                        //CAMBIAR PONER DIRECCION DE LA FOTO DEFAULT
                        imgPerfil ?? "imagenDefault",
                        idcomprador ?? "0"
                    );
                    devolverFrontEnd(context, new List<Comprador>{comprador});
        }catch (Exception ex){errorDefault(context,ex);}
    });

    app.MapPost("/borrarCuenta", async(HttpContext context, Supabase.Client client) =>
    {
        using var reader = new StreamReader(context.Request.Body);
            try{
                var requestBody = await reader.ReadToEndAsync();
                var searchData = JsonConvert.DeserializeObject<JObject>(requestBody);

                var idusuario = searchData["idusuario"].ToObject<int>();

                fachadaLogica.borrarCuenta(idusuario);
            }catch (Exception ex){errorDefault(context,ex);}
    });

    async static void errorDefault(HttpContext context,Exception ex){
        context.Response.StatusCode = 500;
        context.Response.ContentType = "text/plain";
        await context.Response.WriteAsync($"Error al guardar el producto: {ex.Message}");
    }

    async static void devolverFrontEnd<T>(HttpContext context,List<T> objeto){
        var jsonResponse = new {objeto};
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonConvert.SerializeObject(jsonResponse));
    }
}
    
}