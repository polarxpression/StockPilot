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

  const handleExportImage = () => {
    if (!reportRef.current) return;
    html2canvas(reportRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "restock_report.png";
      link.click();
    });
  };

  const handleExportPdf = () => {
    if (!reportRef.current) return;
    const pdf = new jsPDF("p", "mm", "a4");
    html2canvas(reportRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("restock_report.pdf");
    });
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
