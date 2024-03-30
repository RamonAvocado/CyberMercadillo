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
    [Table("Validacion")]
    public partial class Validacion : BaseModel
    {
        [PrimaryKey("idproducto", false)]
        public int idproducto { get; set; }

        [PrimaryKey("idusuario", false)]
        public int idusuario { get; set; }

    }

}