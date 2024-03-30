using Postgrest.Attributes;
using Postgrest.Models;
using System;
using System.Collections.Generic;
using Postgrest.Models;
using CyberMercadillo.Models;
using CyberMercadillo;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CyberMercadillo.BusinessLogic
{       
    public partial class Producto{
        public Producto(){}
        public Producto(string nombre, string precioProducto, string cantidadPro, string descripcionProd, string img) {
            nombreproducto = nombre;
            precio = precioProducto;
            categoria = cantidadPro;
            descripcion = descripcionProd;
            imagen = img;
        }

    }
}


