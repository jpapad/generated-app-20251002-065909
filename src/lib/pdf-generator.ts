import jsPDF from 'jspdf';
import { Allergen, Recipe } from '@shared/types';
import { allergenIcons } from '@/assets/allergen-icons';
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const CARD_WIDTH_MM = 90;
const CARD_HEIGHT_MM = 55;
const MARGIN_MM = 10;
const GUTTER_MM = (A4_WIDTH_MM - 2 * MARGIN_MM - 2 * CARD_WIDTH_MM);
export function generateBuffetLabelsPDF(recipes: Recipe[]) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  doc.setFont('helvetica', 'normal');
  let x = MARGIN_MM;
  let y = MARGIN_MM;
  let page = 1;
  recipes.forEach((recipe, index) => {
    if (index > 0 && index % 8 === 0) {
      doc.addPage();
      page++;
      x = MARGIN_MM;
      y = MARGIN_MM;
    }
    // Draw card border
    doc.setDrawColor(200, 200, 200); // Light grey
    doc.rect(x, y, CARD_WIDTH_MM, CARD_HEIGHT_MM);
    // Recipe Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(recipe.title, CARD_WIDTH_MM - 10);
    doc.text(titleLines, x + 5, y + 10);
    // Recipe Description
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const descY = y + 10 + (titleLines.length * 5);
    const descriptionLines = doc.splitTextToSize(recipe.description, CARD_WIDTH_MM - 10);
    doc.text(descriptionLines, x + 5, descY);
    // Allergens
    const allergenY = y + CARD_HEIGHT_MM - 10;
    let allergenX = x + 5;
    recipe.allergens.forEach(allergen => {
      const icon = allergenIcons[allergen];
      if (icon) {
        doc.addImage(icon, 'SVG', allergenX, allergenY, 6, 6);
        allergenX += 8;
      }
    });
    // Move to next card position
    if ((index + 1) % 2 === 0) { // End of a row
      x = MARGIN_MM;
      y += CARD_HEIGHT_MM;
    } else { // Move to second column
      x += CARD_WIDTH_MM + GUTTER_MM;
    }
  });
  doc.save('CulinaFlow_Buffet_Labels.pdf');
}