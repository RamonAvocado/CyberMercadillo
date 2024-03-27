using Postgrest.Attributes;
using Postgrest.Models;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Postgrest.Models;
using Supabase;
using Supabase.Interfaces;
using CyberMercadillo.Models;
using Newtonsoft.Json;

//Crear objetos
/*

Terminar de mirar esto que es el método de creación de Fabrica

app.MapPost("/añadir",  async (Supabase.Client client) => 
{
    var producto = new Producto
    {
        nombreproducto = "Producto CCC"
    };



    return Results.Ok("Producto created successfully");
});*/