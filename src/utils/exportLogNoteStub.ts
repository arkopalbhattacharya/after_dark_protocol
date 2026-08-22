import type { ProtocolLogEntry } from '../types';
import { getCategoryMeta } from '../config/logCategories';

export function exportLogNoteStubToPng(
  log: ProtocolLogEntry,
  userEmail?: string | null
): void {
  try {
    const meta = getCategoryMeta(log.category);

    const formattedTime = (() => {
      try {
        const d = new Date(log.timestamp);
        const dStr = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
        const tStr = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
        return `${dStr}, ${tStr}`;
      } catch {
        return log.timestamp;
      }
    })();

    // 1. Set up Canvas dimensions
    const width = 840;
    const tractorWidth = 44; // width of tractor hole margins on left and right
    const contentPadding = 24;
    const printAreaWidth = width - (tractorWidth * 2) - (contentPadding * 2);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Helper for wrapping text
    const wrapText = (text: string, maxWidth: number, font: string): string[] => {
      ctx.font = font;
      const words = String(text).split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }
      return lines;
    };

    // Calculate payload items
    const payloadEntries: { key: string; lines: string[] }[] = [];
    const rawPayload = log.payload || {};

    Object.entries(rawPayload).forEach(([key, val]) => {
      const formattedVal = Array.isArray(val)
        ? val.map((v) => (typeof v === 'object' ? JSON.stringify(v) : String(v))).join(', ')
        : typeof val === 'object' && val !== null
        ? JSON.stringify(val, null, 2)
        : String(val);

      const valLines = wrapText(formattedVal, printAreaWidth - 20, '13px monospace');
      payloadEntries.push({
        key: key.toUpperCase().replace(/_/g, ' '),
        lines: valLines
      });
    });

    // Calculate total height
    const headerHeight = 110;
    const titleLines = wrapText(log.title, printAreaWidth, 'bold 18px monospace');
    const titleSectionHeight = titleLines.length * 24 + 40;
    
    let payloadHeight = 45; // title header for payload
    payloadEntries.forEach((item) => {
      payloadHeight += 22 + (item.lines.length * 19) + 12;
    });

    const footerHeight = 120;
    const totalHeight = headerHeight + titleSectionHeight + payloadHeight + footerHeight + 60;

    // Retina 2x scale
    const scale = 2;
    canvas.width = width * scale;
    canvas.height = totalHeight * scale;
    ctx.scale(scale, scale);

    // 2. Draw Continuous Form Computer Green-Bar Paper
    ctx.fillStyle = '#f7faf5'; // Pale vintage tractor paper background
    ctx.fillRect(0, 0, width, totalHeight);

    // Green-Bar alternating paper shading bands (classic mainframe dot-matrix paper)
    const bandHeight = 36;
    ctx.fillStyle = 'rgba(180, 220, 190, 0.28)'; // Soft green bar continuous band
    for (let y = 0; y < totalHeight; y += bandHeight * 2) {
      ctx.fillRect(0, y, width, bandHeight);
    }

    // 3. Draw Left & Right Tractor Feed Perforated Edges
    const drawTractorHoles = (xCenter: number) => {
      // Left/Right perforated margin separation line
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(xCenter > width / 2 ? width - tractorWidth : tractorWidth, 0);
      ctx.lineTo(xCenter > width / 2 ? width - tractorWidth : tractorWidth, totalHeight);
      ctx.stroke();
      ctx.setLineDash([]);

      // Sprocket Feed Holes
      const holeRadius = 6.5;
      const holeSpacing = 28;
      for (let y = 18; y < totalHeight; y += holeSpacing) {
        // Hole shadow/border
        ctx.fillStyle = '#e2e8df';
        ctx.beginPath();
        ctx.arc(xCenter, y, holeRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Inner hole core
        ctx.fillStyle = '#cbd5c7';
        ctx.beginPath();
        ctx.arc(xCenter, y, holeRadius - 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    drawTractorHoles(tractorWidth / 2);
    drawTractorHoles(width - tractorWidth / 2);

    // Top & Bottom Serrated Perforations
    const drawPerforationTear = (y: number) => {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      ctx.setLineDash([]);
    };
    drawPerforationTear(4);
    drawPerforationTear(totalHeight - 4);

    // 4. Dot-Matrix Typography & Header
    const printX = tractorWidth + contentPadding;
    let currentY = 32;

    // Header Box
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#163820'; // Classic dot matrix dark green ink
    ctx.fillText('╔════════════════════════════════════════════════════════════════════════╗', printX, currentY);
    currentY += 16;
    ctx.fillText('║  EPSON LX-800 // CONTINUOUS TRACTOR LOG DISPATCH STUB                  ║', printX, currentY);
    currentY += 16;
    ctx.fillText('║  AFTER DARK PROTOCOL // NEURAL CORE TELEMETRY CAPTURE                  ║', printX, currentY);
    currentY += 16;
    ctx.fillText('╚════════════════════════════════════════════════════════════════════════╝', printX, currentY);
    currentY += 24;

    // Metadata Grid
    ctx.font = '12px monospace';
    ctx.fillStyle = '#14331c';
    ctx.fillText(`LOG_ID      : ADP-${log.id.slice(0, 8).toUpperCase()}`, printX, currentY);
    ctx.fillText(`TIMESTAMP   : ${formattedTime}`, printX + 320, currentY);
    currentY += 18;

    ctx.fillText(`DOMAIN_GRP  : [${meta?.group || 'CYBER_OPS'}] // ${meta?.codename || 'DATA_NODE'}`, printX, currentY);
    ctx.fillText(`SCHEMA      : ${meta?.badge || log.category}`, printX + 320, currentY);
    currentY += 22;

    // Dashed Divider
    ctx.fillText('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -', printX, currentY);
    currentY += 22;

    // Log Title
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#0a2312';
    ctx.fillText('LOG TITLE:', printX, currentY);
    currentY += 18;

    ctx.font = 'bold 17px monospace';
    ctx.fillStyle = '#061a0d';
    titleLines.forEach((line) => {
      ctx.fillText(line, printX, currentY);
      currentY += 22;
    });
    currentY += 10;

    // Payload Telemetry Section
    ctx.font = '12px monospace';
    ctx.fillStyle = '#14331c';
    ctx.fillText('--------------------------- DATA ENTRIES --------------------------------', printX, currentY);
    currentY += 22;

    if (payloadEntries.length === 0) {
      ctx.font = 'italic 12px monospace';
      ctx.fillStyle = '#3a5840';
      ctx.fillText('(NO ADDITIONAL PAYLOAD DATA LOGGED)', printX + 12, currentY);
      currentY += 24;
    } else {
      payloadEntries.forEach((entry) => {
        // Field Key Name
        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#0a2312';
        ctx.fillText(`> ${entry.key}:`, printX + 8, currentY);
        currentY += 18;

        // Field Values
        ctx.font = '13px monospace';
        ctx.fillStyle = '#183c22';
        entry.lines.forEach((line) => {
          ctx.fillText(`  ${line}`, printX + 14, currentY);
          currentY += 19;
        });
        currentY += 8;
      });
    }

    currentY += 10;

    // Verification & Footer Sign-off
    ctx.font = '12px monospace';
    ctx.fillStyle = '#14331c';
    ctx.fillText('==========================================================================', printX, currentY);
    currentY += 20;

    ctx.font = '11.5px monospace';
    ctx.fillStyle = '#183c22';
    ctx.fillText(`OPERATOR    : ${userEmail || 'ENCLAVE_OFFLINE_USER'}`, printX, currentY);
    currentY += 18;

    const crcSignature = (log.id.slice(0, 6) + log.title.slice(0, 4)).toUpperCase();
    ctx.fillText(`CHECKSUM    : CRC32_0x${crcSignature} // TAPE_BUFFER_OK // 24-PIN STRIKE`, printX, currentY);
    currentY += 18;

    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = '#2f5b38';
    ctx.fillText('*** END OF DISPATCH // TEAR ALONG TRACTOR PERFORATION ***', printX, currentY);

    // 5. Trigger PNG Download
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const safeTitle = (log.title || 'RECORD').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 24);
    link.download = `ADP_STUB_${log.id.slice(0, 8)}_${safeTitle}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Failed to export log note stub PNG:', err);
  }
}
