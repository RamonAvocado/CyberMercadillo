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
    public partial class Tecnico:Usuario{
        public Tecnico(){}
        public Tecnico(int idUser, string nombre, int movil, string correo, string contraseña, string direccion,string tipoUser)
            : base(idUser,nombre, movil, correo, contraseña, direccion,tipoUser)
        {}
    }
}