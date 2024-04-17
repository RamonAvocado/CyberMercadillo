using CyberMercadillo.BusinessLogic;
using CyberMercadillo.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

    class FachadaBL
    {
        static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();

            DB dB= new DB();
            Console.WriteLine(dB.Inicializar());
            Console.WriteLine("HUAHSUABSIHABSIBA");
        }
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    //webBuilder.UseStartup<Startup>();
                });
    }
    
