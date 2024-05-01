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
    [Table("CarritoDeCompra")]
    public partial class CarritoDeCompra : BaseModel
    {
        [PrimaryKey("idusuario", false)]
        public int idusuario { get; set; }

        [Column("ListaProductos")]
        public String? listaProductos { get; set; }

    }

}
    