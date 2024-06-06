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
    public class InstantaneaUsuario
    {
        private string contraseña = "null";

        public InstantaneaUsuario(string contraseña)
        {
            this.contraseña = contraseña;
        }

        public string ObtenerContraseña()
        {
            return contraseña;
        }
    }
}
