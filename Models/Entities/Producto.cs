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
    [Table("Producto")]
    public partial class Producto : BaseModel
    {
        [PrimaryKey("idproducto", false)]
        public int idproducto { get; set; }

        [Column("nombreproducto")]
        public string? nombreproducto { get; set; }

        [Column("precio")]
        public string? precio { get; set; }

        [Column("categoria")]
        public string? categoria { get; set; }

        [Column("descripcion")]
        public string? descripcion { get; set; }

        [Column("imagen")]
        public string? imagen { get; set; }
        
        [Column("cantidad")]
        public int? cantidad { get; set; }

        [Column("idvendedor")]
        public int? idvendedor { get; set; }
    }

}
    