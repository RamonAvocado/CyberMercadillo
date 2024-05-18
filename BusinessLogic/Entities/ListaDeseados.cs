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
        public ListaDeseados(int listid, int usuarioCompr, string idsprod) {
            idlistdes = listid;
            idusuario = usuarioCompr;
            idproductos = idsprod;
        }
    }
}