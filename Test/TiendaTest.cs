using Xunit;

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

}
