const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Land = require('../models/Land');

const generateWinnerPDF = async (user, auction) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });

      const pdfDir = path.join(__dirname, '../pdfs');
      if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir);

      const fileName = `winner_${auction._id}_${Date.now()}.pdf`;
      const filePath = path.join(pdfDir, fileName);
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Fetch land info
      let land = null;
      try {
        land = await Land.findById(auction.landId);
      } catch (err) {
        console.error("Error fetching land:", err);
      }

      const landLocation = land?.location || 'Unknown Location';
      const landId = land?._id?.toString() || 'N/A';

      // Resource paths
      const logoPath = path.join(__dirname, '../assets/logo.png');
      const signaturePath = path.join(__dirname, '../assets/signature.png');
      const fancyFontPath = path.join(__dirname, '../fonts/GreatVibes-Regular.ttf');

      if (fs.existsSync(fancyFontPath)) {
        doc.registerFont('Fancy', fancyFontPath);
      }

      // === Draw Background and Border ===
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fdfaf3');
      doc.lineWidth(3)
        .strokeColor('#d4af37')
        .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
        .stroke();

      // === Watermark ===
      doc.save()
        .font('Helvetica-Bold')
        .fontSize(60)
        .fillColor('#e6e6e6')
        .opacity(0.2)
        .rotate(45, { origin: [doc.page.width / 2, doc.page.height / 2] })
        .text('AgriBid Certified', doc.page.width / 4, doc.page.height / 2, {
          align: 'center',
          width: 400
        })
        .restore();

      // === Logo ===
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, doc.page.width / 2 - 40, 40, { width: 80 });
      }

      // === Main Content ===
      let contentY = 160;

      doc.fillColor('#b08d57')
        .font('Helvetica-Bold')
        .fontSize(24)
        .text('Certificate of Achievement', 50, contentY, { align: 'center' });

      contentY += 40;

      doc.fillColor('#000000')
        .font('Helvetica')
        .fontSize(14)
        .text('This certifies that', 50, contentY, { align: 'center' });

      contentY += 30;

      doc.font(fs.existsSync(fancyFontPath) ? 'Fancy' : 'Helvetica-Bold')
        .fontSize(34)
        .text(user.name, { align: 'center' });

      contentY += 50;

      doc.font('Helvetica')
        .fontSize(14)
        .text('has successfully won the bid', { align: 'center' });

      contentY += 25;

      doc.font('Helvetica-Bold')
        .fontSize(14)
        .text(`for "Land in ${landLocation}" (ID: ${landId})`, { align: 'center' });

      contentY += 25;

      doc.font('Helvetica')
        .fontSize(14)
        .text(`Winning Bid: ₹${auction.finalBidAmount}`, { align: 'center' });

      contentY += 20;

      doc.text(`Awarded on: ${new Date().toLocaleDateString()}`, { align: 'center' });

      // === Signature Area ===
      const rightX = doc.page.width - 170;
      const sigY = doc.page.height - 150;

      if (fs.existsSync(signaturePath)) {
        doc.image(signaturePath, rightX, sigY, { width: 90 });
      }

      doc.font('Helvetica')
        .fontSize(12)
        .fillColor('#000000')
        .text('Aman Kaushik', rightX, sigY + 60)
        .text('(Director)', rightX, sigY + 75);

      // End PDF
      doc.end();

      writeStream.on('finish', () => resolve(fileName));
      writeStream.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generateWinnerPDF;
