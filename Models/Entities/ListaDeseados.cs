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
    [Table("ListaDeseados")]
    public partial class ListaDeseados : BaseModel
    {
        [PrimaryKey("idlistdes", false)]
        public int idlistdes { get; set; }

        [Column ("idusuario")]
        public int idusuario { get; set; }

        [Column ("idproductos")]
        public string idproductos { get; set; }
    }

}
    