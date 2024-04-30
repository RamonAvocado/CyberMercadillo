using System.IO;
using System.Text;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;

namespace CyberMercadillo.Entities
{       
    public partial class Producto{
        private FachadaDBB fachadaDBB;
        public Producto() {
            idproducto = 0;
            nombreproducto = "ProductoDefecto";
            precio = "0";
            categoria = "CategoriaPorDefecto";
            descripcion = "DescripcionPorDefecto";
            imagenes = "ImagenPorDefecto";
            cantidad = 0;
            idvendedor = 0;
            validado = false;
            guardado = false;
            huellaEco = 0;   
        }

        public Producto(int? idproductoProd,string? nombreProd, string? precioProd, string? categoriaProd, string? descripcionProd, string? imgsProd, int? cantProd, int? idvendedorProd, bool? validadoProd,bool? guardadoProd, int? huellaEcologica) {
            idproducto = idproductoProd ?? 0;
            nombreproducto = nombreProd ?? "ProductoDefecto";
            precio = precioProd ?? "0";
            categoria = categoriaProd ?? "CategoriaPorDefecto";
            descripcion = descripcionProd ?? "DescripcionPorDefecto";
            imagenes = imgsProd ?? "ImagenPorDefecto";
            cantidad = cantProd ?? 0;
            idvendedor = idvendedorProd ?? 0;
            validado = validadoProd ?? false;
            guardado = guardadoProd ?? false;
            MemoryStream memoryStream = new MemoryStream();
            using (PdfWriter escritor = new PdfWriter(memoryStream))
            using (PdfDocument pdf = new PdfDocument(escritor))
            huellaEco = huellaEcologica ?? 0;   
        }

        public MemoryStream CrearPDF()
        {
            MemoryStream memoryStream = new MemoryStream();
            try
            {
                using (PdfWriter escritor = new PdfWriter(memoryStream))
                {
                    using (PdfDocument pdf = new PdfDocument(escritor))
                    {
                        Document documento = new Document(pdf);
                        documento.Add(new Paragraph("¡Hola, mundo!"));
                        documento.Close();
                        Console.WriteLine("PDF creado exitosamente.");
                    }
                }

                // Es importante volver al principio del MemoryStream antes de devolverlo
                return memoryStream;
            }
            catch (Exception ex)
            {
                MemoryStream memVacio = new MemoryStream();
                Console.WriteLine("Error al crear el PDF: " + ex.Message);
                // Si ocurre un error, devuelve null o maneja el error de otra manera según sea necesario
                return memVacio;
            }
        }

        public async Task AgregarProductoEnSupabase()
        {
            try
            {
                // Llama a la operación de la fachada de base de datos para agregar el producto
                await fachadaDBB.AgregarProductoBDD(this);
            }
            catch (Exception ex)
            {
                // Manejar cualquier excepción que pueda ocurrir durante la inserción
                Console.WriteLine($"Error al agregar el producto en Supabase: {ex.Message}");
            }
        }


    }


}



