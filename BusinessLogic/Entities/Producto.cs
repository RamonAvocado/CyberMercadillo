using System.IO;
using System.Text;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;

namespace CyberMercadillo.Entities
{       
    public partial class Producto{
        private FachadaDBB fachadaDBB;
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
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
            idtecnico = -1;
            puntuacionEco = 0;  
            certificadoEco = "pdf"; 
            llegada = "18 de Junio";
        }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.

#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        public Producto(int? idproductoProd,string? nombreProd, string? precioProd, string? categoriaProd, string? descripcionProd, string? imgsProd, int? cantProd,
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
                        int? idvendedorProd, bool? validadoProd, bool? guardadoProd, int? puntuacionHuella, string? pdfCertificado, string? Llegada) {
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
            idtecnico = -1;
            MemoryStream memoryStream = new MemoryStream();
            using (PdfWriter escritor = new PdfWriter(memoryStream))
            using (PdfDocument pdf = new PdfDocument(escritor))
            //Si es -1 no tiene huella ecologica debe aparecer QUIERE SUBIR EL CERTIFICADO ECOLÓGICO
            //Si es 0-5 tiene huella ecologica debe aparecer ESTE PRODUCTO YA TIENE CERTIFICADO
            puntuacionEco = puntuacionHuella ?? -1;   
            certificadoEco = pdfCertificado ?? "pdf";
            llegada = Llegada ?? "18 de Junio";

        }

        

        public bool estaCertificado(){
            if (puntuacionEco > 0){
                return false;
            } else {
                return true;
            }
        }


    }


}



