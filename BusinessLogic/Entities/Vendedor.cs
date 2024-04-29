using Postgrest.Attributes;
using Postgrest.Models;
using System;
using System.Collections.Generic;
using CyberMercadillo;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CyberMercadillo.Entities
{       
    public partial class Vendedor:Usuario{

        public Vendedor(){}

        public Vendedor(string nombre, int movil, string correo, string contraseña, string direccion, string nombretienda, int telefonotienda,string tipoUser)
            : base(nombre, movil, correo, contraseña, direccion,tipoUser)
        {
            this.nombretienda = nombretienda;
            this.telefonotienda = telefonotienda;
        }

        private List<Producto> productosGuardados = new List<Producto>();
        public List<Producto> ProductosGuardados
        {
            get { return productosGuardados; }
            private set { productosGuardados = value; }
        }

        public List<Producto> GetProductosVendedorG(){
            
            List<Producto> productos = new List<Producto>();

            //Buscar en la lista de productos de la tienda el id y devolver ese productos
            foreach (Producto prod in ProductosGuardados)
                {
                    productos.Add(prod);
                }
            return productos;
        }

    }
}