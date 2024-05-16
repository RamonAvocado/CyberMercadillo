using CyberMercadillo.Entities;

namespace CyberMercadillo.BusinessLogic{ 
    public class GestorDeBusqueda
    {
        private IComando comando;

        public void SetComando(IComando comando)
        {
            comando = comando;
        }

        public List<Producto> solicitarBusqueda()
        {
            return comando?.Ejecutar();
        }
    }
}