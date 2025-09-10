
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
import { type Cartridge } from "@/lib/data";
import { useI18n } from "@/contexts/i18n-provider";

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
        img.onerror = () => {
          // Resolve even on error to not break the entire export
          console.warn(`Could not load image ${index}: ${img.src}`);
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
    const headers = ["ID", "Name", "Model", "Stock", "Reorder Threshold"];
    const rows = data.map((item) =>
      [
        item.id,
        item.name,
        item.model,
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
    
    html2canvas(reportRef.current, {
      scale: 2,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "restock_report.png";
      link.click();
    });
  };

  const handleExportPdf = async () => {
    if (!reportRef.current) return;

    await waitForImages(reportRef.current);

    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
    });
    
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
