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
    public partial class Comprador:Usuario{
        public Comprador(){}

        public Comprador(string nombre, int movil, string correo, string contraseña, string direccion, int CVV, string fechaCaducidad,int numeroTarjetaU,string tipoUser)
            : base(nombre, movil, correo, contraseña, direccion,tipoUser)
        {
            this.CVV = CVV;
            this.fechaCaducidad = fechaCaducidad;
            this.numeroTarjeta = numeroTarjetaU;
        }
    }
}

