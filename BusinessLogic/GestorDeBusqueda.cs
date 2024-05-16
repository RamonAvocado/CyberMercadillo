namespace CyberMercadillo.BusinessLogic{ 
    public class GestorDeBusqueda
    {
        private IComando comando;

        public void SetComando(IComando comando)
        {
            comando = comando;
        }

        public void solicitarBusqueda()
        {
            comando?.Ejecutar();
        }
    }
}