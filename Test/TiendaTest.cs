using Xunit;
using CyberMercadillo.Entities;


public class TiendaTest{
    [Fact]
    //BIEN
    public void buscarCorreo(){
        //Arrange
        var tienda = new Tienda();
        var user = new Comprador(1,"Juan", 666777888, "juan@example.com", "hola", "a", 10, "10", 10, "Comprador", "a");
        tienda.agregarUser(user);
        //Act
        var result = tienda.buscarCorreo("juan@example.com");
        //Assert
        Assert.Equal(true,result);
        
    }



    [Fact]
    //BIEN
    public void crearProducto(){

        var tienda = new Tienda();
        Producto p = new Producto();

        tienda.agregarProducto(p);
        List<Producto> result = tienda.GetProductos();

        Assert.Equal(new List<Producto> {p},result);
    }

     [Fact]
    //BIEN

    public void AsignarPro_ProductoEncontrado(){
        // Arrange
        var tienda = new Tienda();
        Producto producto = new Producto(1000,"Laptop","1200","Electrónica","Laptop de alta gama", "laptop.jpg", 10, 101,
                            true,true,4,"certificado.pdf","1 de Julio", 10);
        tienda.Productos.Add(producto);
        string idbuscado = "1000";
        int idusu = 1;

        // Act
        bool resultado = tienda.asignarPro(idbuscado, idusu);

        // Assert
        Assert.True(resultado);
        Assert.Equal(idusu, producto.idtecnico);
    }

    [Fact]
    //BIEN
    public void AsignarPro_ProductoNoEncontrado(){
        // Arrange
        var tienda = new Tienda();
        var producto = new Producto {};
        tienda.Productos.Add(producto);
        string idbuscado = "100000";
        int idusu = 123;

        // Act
        bool resultado = tienda.asignarPro(idbuscado, idusu);

        // Assert
        Assert.False(resultado);
        Assert.NotEqual(idusu, producto.idtecnico);
    }

    [Fact]
    //BIEN
    public void ActualizarVendedor_DatosValidos(){
        // Arrange
        var tienda = new Tienda();
        var vendedor= new Vendedor(1000,"Antiguo Nombre",123456,"antiguo@correo.com","antigua","Antigua Dirección",
                                             "Antigua Tienda", 654321,"antigua.jpg");
        tienda.Usuarios.Add(vendedor);

        // Act
        var vendedorActualizado = tienda.actualizarVendedor("Nuevo Nombre",789012,"nuevo@correo.com","nueva",
            "Nueva Dirección","Nueva Tienda",210987,"nueva.jpg","1000");

        // Assert
        Assert.Equal("Nuevo Nombre", vendedorActualizado.nombre);
        Assert.Equal(789012, vendedorActualizado.movil);
        Assert.Equal("nuevo@correo.com", vendedorActualizado.correo);
        Assert.Equal("nueva", vendedorActualizado.contraseña);
        Assert.Equal("Nueva Dirección", vendedorActualizado.direccion);
        Assert.Equal("Nueva Tienda", vendedorActualizado.nombretienda);
        Assert.Equal(210987, vendedorActualizado.telefonotienda);
        Assert.Equal("nueva.jpg", vendedorActualizado.fotoPerfil);
    }

    [Fact]
    //BIEN
    public void FiltrarProductosPorValoracion(){
        // Arrange
        var tienda = new Tienda();
        var prodPrec = new List<Producto>
        {
            new Producto(1, "Producto 1", "100", "Electrónica", "Descripción 1", "img1.jpg", 10, 1, true, false, 4, "cert1.pdf", "20 de Junio", 5),
            new Producto(2, "Producto 2", "200", "Electrónica", "Descripción 2", "img2.jpg", 5, 2, false, true, 3, "cert2.pdf", "21 de Junio", 10),
            new Producto(3, "Producto 3", "300", "Hogar", "Descripción 3", "img3.jpg", 15, 3, true, false, 4, "cert3.pdf", "22 de Junio", 15)
        };
        var prodCat = new List<Producto>();

        // Act
        var productosFiltrados = tienda.FiltrarProductosPorValoracion(prodCat, prodPrec, 4, "Electrónica");

        // Assert
        Assert.Equal(2, productosFiltrados.Count);
        Assert.Contains(productosFiltrados, p => p.idproducto == 1);
        Assert.Contains(productosFiltrados, p => p.idproducto == 3);
    }

    [Fact]
    public void GetProductosBusquedaTest(){
        // Arrange
        var tienda = new Tienda();

        var user = new Comprador(1,"Juan", 666777888, "juan@example.com", "hola", "a", 10, "10", 10, "Comprador", "a");
        tienda.agregarUser(user);

        tienda.agregarProducto(new Producto(10, "Laptop", "1000", "Electrónica", "Laptop de alta calidad", "img1.jpg", 10, 101, true, false, 4, "cert1.pdf", "20 de Junio", 5));
        tienda.agregarProducto(new Producto(20, "Teclado", "50", "Electrónica", "Teclado mecánico", "img2.jpg", 20, 102, false, true, 3, "cert2.pdf", "21 de Junio", 0));
        tienda.agregarProducto(new Producto(30, "Ratón", "30", "Electrónica", "Ratón inalámbrico", "img3.jpg", 30, 103, true, false, 2, "cert3.pdf", "22 de Junio", 10));
        tienda.agregarProducto(new Producto(40, "Tablet", "500", "Electrónica", "Tablet Android", "img4.jpg", 40, 104, false, false, 4, "cert4.pdf", "23 de Junio", 15));
            

        // Act
        var productosFiltrados = tienda.GetProductosBusqueda("Laptop;Electrónica", 1);

        // Assert
        Assert.Equal(1, productosFiltrados.Count);
        Assert.Contains(productosFiltrados, p => p.idproducto == 10);
    }
}

