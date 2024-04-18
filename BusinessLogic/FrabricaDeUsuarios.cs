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
        public Usuario CrearUsuario(string tipoUsuario, string nombre, int movil, string correo, string contraseña, string direccion, string nombreTienda , 
                                            int telefonoTienda,int CVV , int numTarjeta ,string fechaCaducidad)
        {
            switch (tipoUsuario.ToLower())
            {
                case "vendedor":
                    return new Vendedor(nombre, movil, correo, contraseña, direccion, nombreTienda, telefonoTienda,tipoUsuario);
                case "tecnico":
                    return new Tecnico(nombre, movil, correo, contraseña, direccion,tipoUsuario);
                case "comprador":
                    return new Comprador(nombre, movil, correo, contraseña, direccion,CVV,fechaCaducidad,numTarjeta,tipoUsuario);
                default:
                    throw new ArgumentException("Tipo de usuario no válido");
            }
        }

    }
}
