using Postgrest.Attributes;
using Postgrest.Models;
using System;
using System.Collections.Generic;

namespace CyberMercadillo.Models
{
    [Table("Producto")]
    public class Producto : BaseModel
    {
        [PrimaryKey("id", false)]
        public int id { get; set; }

        [Column("Nombre")]
        public string? Name { get; set; }

    }
}
    