//using Xunit;

public class TiendaTest{
    //[Fact]
    public void buscarCorreo(){
        //Arrange
        var tienda = new Tienda();
        //Act
        var result = tienda.buscarCorreo("juan@example.com");
        //Assert
        //Assert.Equal(true,result);
    }

}


/*
public List<Producto> GetProductos(){
        ProductosBus = Productos;
        return Productos;
    }
*/

/*
public bool buscarCorreo(string correo){
            var usuarioEncontrado = Usuarios.Find(u => u.correo == correo);
            if(usuarioEncontrado != null){
                return true;
            }else{
                return false;
            }
    }
*/