using CyberMercadillo.Entities;

public class GestorDeBusqueda
    {
        private IComando comando;

        public void SetComando(IComando comando)
        {
            this.comando = comando;
        }

        public List<Producto> solicitarBusqueda()
        {
            return comando?.Ejecutar();
        }
}
