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
    [Table("CarritosDeCompra")]
    public partial class CarritosDeCompra : BaseModel
    {
        [PrimaryKey("idcarrito", false)]
        public int? idcarrito { get; set; }
        
        [Column("idusuario")]
        public int idusuario { get; set; }

        [Column("idproductos")]
        public string idproductos { get; set; }

        [Column("cantidadProds")]
        public string? cantidadProds { get; set; }

        [Column("fecha")]
        public DateTime? fecha { get; set; }

        [Column("estado")]
        public string? estado { get; set; }
    }

}
    