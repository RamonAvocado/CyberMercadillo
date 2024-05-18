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
    public partial class CarritosDeCompra{
        public CarritosDeCompra(){}
        public CarritosDeCompra(int idCarrito, int usuarioCompr, string idsprod, string cantiProds, DateTime fech, string est) {
            idcarrito = idCarrito;
            idusuario = usuarioCompr;
            idproductos = idsprod;
            cantidadProds = cantiProds;
            fecha = fech;
            estado = est;
        }
    }
}



