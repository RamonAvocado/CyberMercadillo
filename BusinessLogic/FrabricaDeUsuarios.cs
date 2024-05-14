using Postgrest.Attributes;
using Postgrest.Models;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Supabase;
using Supabase.Interfaces;
using CyberMercadillo.Entities;
using Newtonsoft.Json;

//Crear objetos


//Terminar de mirar esto que es el método de creación de Fabrica
namespace CyberMercadillo.BusinessLogic{ 
    public class FabricaDeUsuarios{

        public FabricaDeUsuarios(){}
        public Usuario CrearUsuario(int idUsu,string tipoUsuario, string nombre, int movil, string correo, string contraseña, string direccion, string nombreTienda , 
                                            int telefonoTienda,int CVV , int numTarjeta ,string fechaCaducidad,string dirFact)
        {
            switch (tipoUsuario.ToLower())
            {
                case "vendedor":
                    return new Vendedor(idUsu,nombre, movil, correo, contraseña, direccion, nombreTienda, telefonoTienda,tipoUsuario);
                case "tecnico":
                    return new Tecnico(idUsu,nombre, movil, correo, contraseña, direccion,tipoUsuario);
                case "comprador":
                    return new Comprador(idUsu,nombre, movil, correo, contraseña, direccion,CVV,fechaCaducidad,numTarjeta,tipoUsuario,dirFact);
                default:
                    throw new ArgumentException("Tipo de usuario no válido");
            }
        }

    }
}
