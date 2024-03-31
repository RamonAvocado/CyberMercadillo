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
    public partial class Compra{
        public Compra(){}
        public Compra(int usuarioCompr, int productoComp, String comentarioComp, int valoracionComp) {
            idusuario = usuarioCompr;
            idproducto = productoComp;
            comentario = comentarioComp;
            valoracion = valoracionComp;
        }
    }
}



