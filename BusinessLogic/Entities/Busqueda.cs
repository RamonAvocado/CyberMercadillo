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
    public partial class Busqueda{
        public Busqueda(){}
        public Busqueda(string textoBusq, DateTime fechaBusq, int usuario, string categ) {
            texto = textoBusq;
            fecha = fechaBusq;
            idusuario = usuario;
            categoria = categ;
        }

    }
}



