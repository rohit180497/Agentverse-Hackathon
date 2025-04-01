// src/components/dashboard/SummaryCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import html2pdf from "html2pdf.js"; // ✅ Import here

interface SummaryCardProps {
  data?: string;
  isLoading: boolean;
}

const handleDownload = () => {
  const element = document.getElementById("summary-section");
  if (!element) return;

  const opt = {
    margin: 0.5,
    filename: "travel-itinerary-summary.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  html2pdf().set(opt).from(element).save(); // ✅ Direct call now works
};

const SummaryCard = ({ data, isLoading }: SummaryCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Trip Itinerary
          <div className="ml-auto">
            <button
              onClick={handleDownload}
              className="w-5 h-5"
            >
              ⬇️
            </button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="overflow-y-auto max-h-[400px] whitespace-pre-wrap text-sm text-muted-foreground">
        {isLoading ? (
          <p className="animate-pulse">Generating summary...</p>
        ) : data ? (
          <div
            id="summary-section"
            dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(data) }}
          />
        ) : (
          <p>No summary available yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

function convertMarkdownToHTML(markdown: string): string {
  return markdown
    .replace(/^### (.*$)/gim, '<h3 class="font-semibold text-base mb-1">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="font-bold text-lg mt-4 mb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold mt-4 mb-2">$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\n/g, "<br>");
}

export default SummaryCard;
