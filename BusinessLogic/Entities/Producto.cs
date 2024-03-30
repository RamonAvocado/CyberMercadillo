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
    public partial class Producto{
        public Producto(){}
        public Producto(string nombreProd, string precioProd, string categoriaProd, string descripcionProd, string imgProd, int cantProd) {
            nombreproducto = nombreProd;
            precio = precioProd;
            categoria = categoriaProd;
            descripcion = descripcionProd;
            imagen = imgProd;
            cantidad = cantProd;
        }

    }
}



