
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
    public abstract partial class Usuario{
        public Usuario(){
            nombre = string.Empty;
            movil = 0; // o null si es nullable
            correo = string.Empty;
            contraseña = string.Empty;
            direccion = string.Empty;
            tipoUsuario = string.Empty;
        }
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