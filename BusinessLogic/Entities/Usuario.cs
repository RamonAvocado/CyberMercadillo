
using Postgrest.Attributes;
using Postgrest.Models;
using System;
using System.Collections.Generic;
using CyberMercadillo;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;


namespace CyberMercadillo.Entities
{       
    public partial class Usuario{
        public Usuario(){}
        public Usuario(string nombreUser, int movilUser, string correoUser, string contraUser, string dirUser,string tipoUser) {
            nombre = nombreUser;
            movil = movilUser;
            correo = correoUser;
            contraseña = contraUser;
            direccion = dirUser;
            tipoUsuario = tipoUser;
        }
    }
}