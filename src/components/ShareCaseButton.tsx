import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { useToast } from '@/hooks/use-toast';

interface ShareCaseButtonProps {
  onExport?: () => Promise<string>;
  specImage?: string;
  phoneNumber?: string;
  className?: string;
}

export const ShareCaseButton = ({
  onExport,
  specImage,
  phoneNumber,
  className
}: ShareCaseButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const addImageWithAspect = async (
    pdf: jsPDF,
    imgUrl: string,
    x: number,
    y: number,
    maxWidth: number,
    maxHeight: number
  ) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        let drawWidth = maxWidth;
        let drawHeight = maxWidth / aspectRatio;
        if (drawHeight > maxHeight) {
          drawHeight = maxHeight;
          drawWidth = maxHeight * aspectRatio;
        }
        pdf.addImage(img, 'PNG', x, y, drawWidth, drawHeight);
        resolve();
      };
      img.onerror = reject;
      img.src = imgUrl;
    });
  };

  const generatePDF = async () => {
    if (!onExport) {
      toast({
        title: "Error",
        description: "No se puede exportar la imagen 3D",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const scene3DDataUrl = await onExport();

      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.setFontSize(16);
      pdf.setTextColor(38, 49, 132);
      pdf.text('LDS Facade Planner - Reporte de Caso', 20, 20);

      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 30);

      let yPosition = 45;

      // Títulos alineados
      pdf.setFontSize(12);
      pdf.setTextColor(38, 49, 132);
      pdf.text('Vista 3D del Proyecto:', 20, yPosition);
      pdf.text('Especificaciones Técnicas:', pageWidth / 2 + 10, yPosition);

      // Imágenes debajo de los títulos
      yPosition += 10;

      if (scene3DDataUrl) {
        await addImageWithAspect(pdf, scene3DDataUrl, 20, yPosition, (pageWidth - 40) / 2 - 10, 100);
      }

      if (specImage) {
        try {
          await addImageWithAspect(pdf, specImage, pageWidth / 2 + 10, yPosition, (pageWidth - 40) / 2 - 10, 100);
        } catch (error) {
          console.warn('No se pudo cargar la imagen de especificaciones:', error);
        }
      }

      const footerY = pageHeight - 45;

      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Nota legal: La imagen 3D del proyecto es referencial y no constituye documento contractual ni técnico vinculante.', 20, footerY + 5);
      pdf.text('Las especificaciones técnicas son proporcionadas por la empresa. La empresa no se responsabiliza por el uso indebido, interpretación o aplicación incorrecta de la información.', 20, footerY + 10, { maxWidth: pageWidth - 40 } );
      pdf.text('© 2024 LUZ DEL SUR S.A.A.', 20, footerY + 15);
      pdf.text('RUC: 20331898008', 20, footerY + 20);
      pdf.text('Todos los derechos reservados', 20, footerY + 25);
      pdf.text('LDS Facade Planner - Guía visual para instalaciones eléctricas de fachadas', 20, footerY + 30);

      const filename = `LDS-Facade-Case-${Date.now()}.pdf`;
      pdf.save(filename);

      toast({
        title: "PDF Generado",
        description: "El reporte del caso se ha descargado exitosamente"
      });

      if (phoneNumber && phoneNumber.trim()) {
        const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
          'Hola! Te comparto el reporte del caso de instalación eléctrica generado con LDS Facade Planner.'
        )}`;
        window.open(whatsappUrl, '_blank');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el PDF. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={generatePDF}
      disabled={isGenerating}
      className={`bg-[linear-gradient(135deg,#263184,#1a245d)] text-white hover:brightness-110 shadow-glow transition-all duration-300 ${className}`}
    >
      {isGenerating ? (
        <>
          <Download className="w-4 h-4 mr-2 animate-spin" />
          Generando...
        </>
      ) : (
        <>
          <FileText className="w-4 h-4 mr-2" />
          PDF
        </>
      )}
    </Button>
  );
};
