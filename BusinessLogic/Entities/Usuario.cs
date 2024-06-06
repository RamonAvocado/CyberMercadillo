
using Postgrest.Attributes;
using Postgrest.Models;
using System;
using System.Collections.Generic;
using CyberMercadillo;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;


namespace CyberMercadillo.Entities
{       
    public abstract partial class Usuario{
         public Usuario(){
            idusuario = 0;
            nombre = string.Empty;
            movil = 0; // o null si es nullable
            correo = string.Empty;
            contraseña = string.Empty;
            direccion = string.Empty;
            tipoUsuario = string.Empty;
            fotoPerfil = string.Empty;
        }
        public Usuario(int IdUser,string nombreUser, int movilUser, string correoUser, string contraUser, string dirUser,string tipoUser) {
            idusuario = IdUser;
            nombre = nombreUser;
            movil = movilUser;
            correo = correoUser;
            contraseña = contraUser;
            direccion = dirUser;
            tipoUsuario = tipoUser;
            fotoPerfil = string.Empty;
        }

//El conserje va a manejar las intantáneas del usuario, asi que creo la colección de instantáneas aquí
    public ConserjeDeInstantaneasUsuario conserje = new ConserjeDeInstantaneasUsuario();


//Creo la instanánea del usuario y la guardo en la lísta coserje
        public void CrearInstantaneaUsuario(string contra)
        {
            var instantánea = new InstantaneaUsuario(contra);
            conserje.GuardarInstantanea(idusuario, instantánea);
        }


//Función donde recupero la instantánea y comparo las contraseñas
        public bool ComprobarContraseña( string nuevaContraseña)
        {
            //recupero la instantánea del usuario para comparar la contraseña
            var instantanea = conserje.RecuperarInstantanea(idusuario);
            var oldPassword = instantanea.ObtenerContraseña();

            if (oldPassword == nuevaContraseña){
                    Console.WriteLine("La nueva contraseña es igual a la antigua");
                    return false;
                }
                else{
                    Console.WriteLine("La nueva contraseña es diferente a la antigua");
                    return true;
                }
        }
    }
}