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
    public partial class ListaDeseados{
        public ListaDeseados(){}
        public ListaDeseados(int usuarioCompr, string idsprod) {
            idusuario = usuarioCompr;
            idproductos = idsprod;
        }
    }
}