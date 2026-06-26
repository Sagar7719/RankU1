import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function downloadResultAsPDF({ rootEl, fileName }) {
  if (!rootEl) throw new Error("Missing root element for PDF generation");

  // Ensure higher quality
  const canvas = await html2canvas(rootEl, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    // Prefer full rendering; screenshot-based PDFs will ignore some dynamic CSS features
    windowWidth: rootEl.scrollWidth,
    windowHeight: rootEl.scrollHeight,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Add extra pages if the image exceeds one page
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(fileName);
}

