
"use client";

import { RefObject } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Download, FileImage, FileText, Sheet } from "lucide-react";
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

interface ReportActionsProps {
  data: Cartridge[];
  reportRef: RefObject<HTMLDivElement>;
  disabled?: boolean;
}

const waitForImages = (element: HTMLElement): Promise<void[]> => {
  const images = Array.from(element.querySelectorAll("img"));
  console.log(`Found ${images.length} images to wait for.`);
  const promises = images.map((img, index) => {
    return new Promise<void>((resolve) => {
      console.log(`Image ${index} src: ${img.src}`);
      if (img.complete) {
        console.log(`Image ${index} (${img.src}) is already complete.`);
        resolve();
      } else {
        img.onload = () => {
          console.log(`Image ${index} (${img.src}) loaded successfully.`);
          resolve();
        };
        img.onerror = (e) => {
          // Resolve even on error to not break the entire export
          console.warn(`Could not load image ${index}: ${img.src}`, e);
          resolve();
        };
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

  const handleExportCsv = () => {
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
  };

  const handleExportImage = async () => {
    if (!reportRef.current) return;
    
    // Wait for images to load
    await waitForImages(reportRef.current);
    
    console.log("Starting html2canvas for image export");
    html2canvas(reportRef.current, {
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
    }).then((canvas) => {
      console.log("html2canvas for image export finished");
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "restock_report.png";
      link.click();
    });
  };



  const handleExportZip = async () => {
    if (!reportRef.current) return;
    const zip = new JSZip();
    const itemsWithImages = data.filter((item) => item.imageUrl);

    for (const item of itemsWithImages) {
      const cardElement = reportRef.current.querySelector(
        `[data-item-id='${item.id}']`
      ) as HTMLElement;
      if (cardElement) {
        await waitForImages(cardElement);
        const canvas = await html2canvas(cardElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
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
    }

    zip.generateAsync({ type: "blob" }).then((content: Blob) => {
      saveAs(content, "restock_report_images.zip");
    });
  };

  const handleExportPdf = async () => {
    if (!reportRef.current) return;

    await waitForImages(reportRef.current);

    console.log("Starting html2canvas for PDF export");
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
    console.log("html2canvas for PDF export finished");
    
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("restock_report.pdf");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={disabled}>
          <Download className="mr-2 h-4 w-4" />
          {t("Export Report")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={handleExportCsv}>
          <Sheet className="mr-2 h-4 w-4" />
          <span>{t("Export as CSV")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleExportImage}>
          <FileImage className="mr-2 h-4 w-4" />
          <span>{t("Export as Image")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleExportPdf}>
          <FileText className="mr-2 h-4 w-4" />
          <span>{t("Export as PDF")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleExportZip}>
          <FileImage className="mr-2 h-4 w-4" />
          <span>{t("Export as ZIP")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
