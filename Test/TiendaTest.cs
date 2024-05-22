using Xunit;
using CyberMercadillo.Entities;


public class TiendaTest{
    [Fact]
    public void buscarCorreo(){
        //Arrange
        var tienda = new Tienda();
        //Act
        var result = tienda.buscarCorreo("juan@example.com");
        //Assert
        Assert.Equal(true,result);
        
    }

    public void comprobarCategorias(){

        var tienda = new Tienda();

        var result = tienda.GetCategorías();

        Assert.Equal(
            new List<String> {
            "Todas las categorias", "Hogar", "Electrónica", "Juguetes", "Ropa", "Amor puro"
        },result);
    }

    public void crearProducto(){

        var tienda = new Tienda();
        Producto p = new Producto();

        tienda.agregarProducto(p);
        List<Producto> result = tienda.GetProductos();

        Assert.Equal(new List<Producto> {p},result);
    }

}
