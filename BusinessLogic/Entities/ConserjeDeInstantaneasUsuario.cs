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
    public class ConserjeDeInstantaneasUsuario
    {
        private Dictionary<int, InstantaneaUsuario> Instantaneas = new Dictionary<int, InstantaneaUsuario>();

        public void GuardarInstantanea(int idUsuario, InstantaneaUsuario instantanea)
        {
            Instantaneas[idUsuario] = instantanea;
        }

        public InstantaneaUsuario RecuperarInstantanea(int idUsuario)
        {
            return Instantaneas.ContainsKey(idUsuario) ? Instantaneas[idUsuario] : null;
        }
    }
}
