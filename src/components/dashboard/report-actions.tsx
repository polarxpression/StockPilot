
"use client";

import { RefObject, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Download, FileImage, FileText, Sheet, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { type Cartridge } from "@/lib/types";
import { useI18n } from "@/contexts/i18n-provider";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useToast } from "@/hooks/use-toast";

interface ReportActionsProps {
  data: Cartridge[];
  reportRef: RefObject<HTMLDivElement>;
  disabled?: boolean;
}

const waitForImages = (element: HTMLElement): Promise<void[]> => {
  const images = Array.from(element.querySelectorAll("img"));
  const promises = images.map((img) => {
    return new Promise<void>((resolve) => {
      if (img.complete) {
        resolve();
      } else {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      }
    });
  });
  return Promise.all(promises);
};

export default function ReportActions({
  data,
  reportRef,
  disabled,
}: ReportActionsProps) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCsv = () => {
    try {
      const headers = ["ID", "Brand", "Model", "Barcode", "Stock", "Reorder Threshold"];
      const rows = data.map((item) =>
        [
          item.id,
          item.brand,
          item.model,
          item.barcode,
          item.stock,
          item.reorderThreshold,
        ].join(",")
      );

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "restock_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ description: t("CSV exported successfully.") });
    } catch (error) {
      console.error("CSV Export Error:", error);
      toast({ variant: "destructive", description: t("Failed to export CSV.") });
    }
  };

  const handleExportImage = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    toast({ description: t("Generating image...") });

    try {
      await waitForImages(reportRef.current);
      
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        onclone: (document) => { 
          document.querySelectorAll('img[data-ai-hint~="cartridge"]').forEach((img) => {
            const image = img as HTMLImageElement
            image.style.height = 'auto';
            image.style.width = 'auto';
            image.style.objectFit = 'contain';
          });
        }
      });
      
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "restock_report.png";
      link.click();
      toast({ description: t("Image exported successfully.") });
    } catch (error) {
      console.error("Image Export Error:", error);
      toast({ variant: "destructive", description: t("Failed to export image.") });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportZip = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    toast({ description: t("Generating ZIP file... This may take a moment.") });

    try {
      const zip = new JSZip();
      const itemsWithImages = data.filter((item) => item.imageUrl);
      
      const BATCH_SIZE = 5;
      for (let i = 0; i < itemsWithImages.length; i += BATCH_SIZE) {
        const batch = itemsWithImages.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(async (item) => {
          const cardElement = reportRef.current?.querySelector(
            `[data-item-id='${item.id}']`
          ) as HTMLElement;
          
          if (cardElement) {
            await waitForImages(cardElement);
            const canvas = await html2canvas(cardElement, {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              logging: false, // Disable logging for performance
              onclone: (document) => {
                document
                  .querySelectorAll('img[data-ai-hint~="cartridge"]')
                  .forEach((img) => {
                    const image = img as HTMLImageElement;
                    image.style.height = "auto";
                    image.style.width = "auto";
                    image.style.objectFit = "contain";
                  });
              },
            });
            const blob = await new Promise<Blob | null>((resolve) =>
              canvas.toBlob(resolve, "image/png")
            );
            if (blob) {
              zip.file(`${item.brand}-${item.model}-${item.color}.png`, blob);
            }
          }
        }));
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "restock_report_images.zip");
      toast({ description: t("ZIP exported successfully.") });
    } catch (error) {
       console.error("ZIP Export Error:", error);
       toast({ variant: "destructive", description: t("Failed to export ZIP.") });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    toast({ description: t("Generating PDF...") });

    try {
      await waitForImages(reportRef.current);

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        onclone: (document) => {
          document.querySelectorAll('img[data-ai-hint~="cartridge"]').forEach((img) => {
            const image = img as HTMLImageElement
            image.style.height = '100%';
            image.style.width = 'auto';
            image.style.objectFit = 'contain';
          });
        }
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("restock_report.pdf");
      toast({ description: t("PDF exported successfully.") });
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast({ variant: "destructive", description: t("Failed to export PDF.") });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={disabled || isExporting}>
          {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          {t("Export Report")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={handleExportCsv} disabled={isExporting}>
          <Sheet className="mr-2 h-4 w-4" />
          <span>{t("Export as CSV")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleExportImage} disabled={isExporting}>
          <FileImage className="mr-2 h-4 w-4" />
          <span>{t("Export as Image")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleExportPdf} disabled={isExporting}>
          <FileText className="mr-2 h-4 w-4" />
          <span>{t("Export as PDF")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleExportZip} disabled={isExporting}>
          <FileImage className="mr-2 h-4 w-4" />
          <span>{t("Export as ZIP")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

