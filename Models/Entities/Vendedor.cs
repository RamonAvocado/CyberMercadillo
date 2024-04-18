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
    [Table("Vendedor")]
    public partial class Vendedor : Usuario
    {

        [Column("nombretienda")]
        public string? nombretienda { get; set; }

        [Column("telefonotienda")]
        public int? telefonotienda { get; set; }
    }

}