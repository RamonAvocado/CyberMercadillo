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

        public Vendedor(int idUser,string nombre, int movil, string correo, string contraseña, string direccion, string nombretienda, int telefonotienda,string tipoUser)
            : base(idUser,nombre, movil, correo, contraseña, direccion,tipoUser)
        {
            this.nombretienda = nombretienda;
            this.telefonotienda = telefonotienda;
        }

        
    }
}