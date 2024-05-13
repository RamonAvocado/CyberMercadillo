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
        public int? idproducto { get; set; }

        [Column("nombreproducto")]
        public string? nombreproducto { get; set; }

        [Column("precio")]
        public string? precio { get; set; }

        [Column("categoria")]
        public string? categoria { get; set; }

        [Column("descripcion")]
        public string? descripcion { get; set; }

        [Column("imagenes")]
        public string? imagenes { get; set; }
        
        [Column("cantidad")]
        public int? cantidad { get; set; }

        [Column("idvendedor")]
        public int? idvendedor { get; set; }

        [Column("validado")]
        public bool? validado { get; set; }

        [Column("guardado")]
        public bool? guardado { get; set; }

        [Column("puntuacionEco")]
        public int? puntuacionEco { get; set; }

        [Column("certificadoEco")]
        public string? certificadoEco { get; set; }
        
        [Column("idtecnico")]
        public int? idtecnico { get; set; }

        [Column("llegada")]
        public string? llegada { get; set; }
    }

}
    