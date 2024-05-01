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
    public partial class CarritoDeCompra{
        public CarritoDeCompra(){}
        public CarritoDeCompra(int usuarioCompr, String listProductos) {
            idusuario = usuarioCompr;
            listaProductos = listProductos;
        }
    }
}



