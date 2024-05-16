using CyberMercadillo.Entities;

namespace CyberMercadillo.BusinessLogic{ 
    public interface IComando
    {
        List<Producto> Ejecutar();
    }
}