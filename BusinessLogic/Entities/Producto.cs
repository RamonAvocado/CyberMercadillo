using Postgrest.Attributes;
using Postgrest.Models;
using System;
using System.Collections.Generic;
using CyberMercadillo;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Markup;

namespace CyberMercadillo.Entities
{       
    public partial class Producto{
        public Producto(){}
        public Producto(string nombreProd, string precioProd, string categoriaProd, string descripcionProd, string imgsProd, int cantProd, int idvendedorProd, bool validadoProd) {
            nombreproducto = nombreProd;
            precio = precioProd;
            categoria = categoriaProd;
            descripcion = descripcionProd;
            imagenes = imgsProd;
            cantidad = cantProd;
            idvendedor = idvendedorProd;
            validado = validadoProd;
        }

    }
}



