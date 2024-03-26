using Postgrest.Attributes;
using Postgrest.Models;
using System;
using System.Collections.Generic;

namespace CyberMercadillo.Models
{
    [Table("Producto")]
    public class Producto : BaseModel
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


    }
}
    