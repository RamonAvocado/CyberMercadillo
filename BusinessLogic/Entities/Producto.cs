using System.IO;
using System.Text;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;

namespace CyberMercadillo.Entities
{       
    public partial class Producto{
        private FachadaDBB fachadaDBB;
        public Producto(){}
        public Producto(int idproductoProd,string nombreProd, string precioProd, string categoriaProd, string descripcionProd, string imgsProd, int cantProd, int idvendedorProd, bool validadoProd, int huellaEcologica) {
            idproducto = idproductoProd;
            nombreproducto = nombreProd;
            precio = precioProd;
            categoria = categoriaProd;
            descripcion = descripcionProd;
            imagenes = imgsProd;
            cantidad = cantProd;
            idvendedor = idvendedorProd;
            validado = validadoProd;
            huellaEco = huellaEcologica;   
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



