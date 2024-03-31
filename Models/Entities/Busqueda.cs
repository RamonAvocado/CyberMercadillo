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
    [Table("Busqueda")]
    public partial class Busqueda : BaseModel
    {
        [PrimaryKey("idbusqueda", false)]
        public int idbusqueda { get; set; }

        [Column("texto")]
        public string? texto { get; set; }

        [Column("fecha")]
        public DateTime? fecha { get; set; }

        [Column("idusuario")]
        public int? idusuario { get; set; }
    }

}
    