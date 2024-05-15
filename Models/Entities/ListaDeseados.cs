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
        [PrimaryKey("idusuario", false)]
        public int idusuario { get; set; }

        [PrimaryKey("idproductos", false)]
        public string idproductos { get; set; }
    }

}
    