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
    [Table("Compra")]
    public partial class Compra : BaseModel
    {
        [PrimaryKey("idcompra", false)]
        public int idcompra { get; set; }

        [Column("idusuario")]
        public int idusuario { get; set; }

        [Column("idproducto")]
        public int? idproducto { get; set; }

        [Column("comentario")]
        public String? comentario { get; set; }

        [Column("valoracion")]
        public int? valoracion { get; set; }
    }

}
    