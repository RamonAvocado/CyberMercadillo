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
    [Table("Usuario")]
    public abstract partial class Usuario : BaseModel
    {
        [PrimaryKey("idusuario", false)]
        public int idusuario { get; set; }

        [Column("nombre")]
        public string? nombre { get; set; }

        [Column("movil")]
        public int? movil { get; set; }

        [Column("correo")]
        public string? correo { get; set; }

        [Column("contraseña")]
        public string? contraseña { get; set; }

        [Column("direccion")]
        public string? direccion { get; set; }

        [Column("fotoPerfil")]
        public string? fotoPerfil { get; set; }

        [Column("tipoUsuario")]
        public string? tipoUsuario { get; set; }
        
    }

}