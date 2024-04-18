using Postgrest.Attributes;
using Postgrest.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks; 

namespace CyberMercadillo.Entities
{
    [Table("Comprador")]
    public partial class Comprador : Usuario
    {

        [Column("numeroTarjeta")]
        public int? numeroTarjeta { get; set; }

        [Column("fechaCaducidad")]
        public string? fechaCaducidad { get; set; }

        [Column("CVV")]
        public int? CVV { get; set; }
    }

}