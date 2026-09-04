import type { NewsArticle } from '../types/news';

export function exportNewsArticleToPng(article: NewsArticle): void {
  try {
    // 1. Get computed colors from the active theme
    const rootStyle = getComputedStyle(document.documentElement);
    const primaryColor = rootStyle.getPropertyValue('--color-primary').trim() || '#1edce0';
    const secondaryColor = rootStyle.getPropertyValue('--color-secondary').trim() || '#ffb703';
    const bgColor = rootStyle.getPropertyValue('--bg-base').trim() || '#0c0501';
    const panelBg = rootStyle.getPropertyValue('--bg-panel').trim() || '#140801';
    const textColor = rootStyle.getPropertyValue('--text-on-surface').trim() || '#ffffff';
    const textVariantColor = rootStyle.getPropertyValue('--text-on-surface-variant').trim() || '#e0d0c0';

    const formattedTime = (() => {
      try {
        const d = new Date(article.timestamp);
        const dStr = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
        const tStr = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
        return `${dStr}, ${tStr}`;
      } catch {
        return article.timestamp;
      }
    })();

    // 2. Set up offscreen high-DPI canvas
    const width = 800;
    const padding = 36;
    const contentWidth = width - padding * 2;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Helper for wrapping text
    const wrapText = (text: string, maxWidth: number, font: string): string[] => {
      ctx.font = font;
      const words = text.split(' ');
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

    // Pre-calculate heights
    const headlineLines = wrapText(article.headline, contentWidth, 'bold 22px monospace');
    const bodyLines = wrapText(article.content, contentWidth, '15px monospace');

    const headerHeight = 50;
    const metaHeight = 35;
    const headlineHeight = headlineLines.length * 28 + 15;
    const bodyBoxPadding = 18;
    const bodyHeight = bodyLines.length * 24 + bodyBoxPadding * 2;
    const footerHeight = 45;
    const totalHeight = padding + headerHeight + metaHeight + headlineHeight + bodyHeight + footerHeight + padding;

    // Set canvas dimensions with 2x retina scale
    const scale = 2;
    canvas.width = width * scale;
    canvas.height = totalHeight * scale;
    ctx.scale(scale, scale);

    // 3. Draw Background & Outer Cyberpunk Chassis
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, totalHeight);

    // Subtle CRT scanlines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    for (let y = 0; y < totalHeight; y += 4) {
      ctx.fillRect(0, y, width, 2);
    }

    // Outer double border
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, width - 24, totalHeight - 24);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, width - 32, totalHeight - 32);

    // Corner decorative brackets
    const cornerSize = 14;
    ctx.fillStyle = secondaryColor;
    // Top-left
    ctx.fillRect(12, 12, cornerSize, 3);
    ctx.fillRect(12, 12, 3, cornerSize);
    // Top-right
    ctx.fillRect(width - 12 - cornerSize, 12, cornerSize, 3);
    ctx.fillRect(width - 15, 12, 3, cornerSize);
    // Bottom-left
    ctx.fillRect(12, totalHeight - 15, cornerSize, 3);
    ctx.fillRect(12, totalHeight - 12 - cornerSize, 3, cornerSize);
    // Bottom-right
    ctx.fillRect(width - 12 - cornerSize, totalHeight - 15, cornerSize, 3);
    ctx.fillRect(width - 15, totalHeight - 12 - cornerSize, 3, cornerSize);

    // 4. Header Bar
    let currentY = padding + 10;
    ctx.fillStyle = panelBg;
    ctx.fillRect(padding, currentY - 14, contentWidth, 34);
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(padding, currentY - 14, contentWidth, 34);

    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = secondaryColor;
    ctx.fillText('📡 [THE_SOCIAL_JETWORKS // ORBITAL_WIRE_DISPATCH]', padding + 12, currentY + 8);

    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = primaryColor;
    ctx.textAlign = 'right';
    ctx.fillText('AFTER_DARK_PROTOCOL_v1.0', width - padding - 12, currentY + 8);
    ctx.textAlign = 'left';

    currentY += 40;

    // 5. Metadata Row: Planet & Urgency
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = secondaryColor;
    ctx.fillText(`📍 ${article.planetOrSector}`, padding, currentY);

    // Urgency badge
    const tagText = `[ ${article.urgency || 'ROUTINE'} // ${article.tag} ]`;
    ctx.font = 'bold 11px monospace';
    const tagWidth = ctx.measureText(tagText).width;
    const tagX = width - padding - tagWidth - 10;
    
    ctx.fillStyle = article.urgency === 'FLASH' ? '#ff0033' : article.urgency === 'CRITICAL' ? '#ffb703' : secondaryColor;
    ctx.fillText(tagText, tagX, currentY);

    currentY += 22;

    // 6. Headline
    ctx.font = 'bold 20px monospace';
    ctx.fillStyle = textColor;
    headlineLines.forEach((line) => {
      ctx.fillText(line, padding, currentY);
      currentY += 26;
    });

    currentY += 10;

    // 7. Body Box
    const bodyBoxY = currentY;
    const bodyBoxH = bodyLines.length * 24 + bodyBoxPadding * 2;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(padding, bodyBoxY, contentWidth, bodyBoxH);
    ctx.strokeStyle = 'rgba(255, 183, 3, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(padding, bodyBoxY, contentWidth, bodyBoxH);

    ctx.font = '14px monospace';
    ctx.fillStyle = textVariantColor;
    let bodyTextY = bodyBoxY + bodyBoxPadding + 14;
    bodyLines.forEach((line) => {
      ctx.fillText(line, padding + bodyBoxPadding, bodyTextY);
      bodyTextY += 24;
    });

    currentY = bodyBoxY + bodyBoxH + 24;

    // 8. Footer Bar
    ctx.font = '11px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText(`WIRE_SRC: ${article.authorOrWire || 'SOLAR_DISPATCH'}  •  ${formattedTime}`, padding, currentY);

    ctx.fillStyle = secondaryColor;
    ctx.textAlign = 'right';
    ctx.fillText('AUTH: [CYBERCORE_VERIFIED_OK]', width - padding, currentY);

    // 9. Download as PNG
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const safeTitle = article.headline.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
    link.download = `ADP_NEWS_${article.id}_${safeTitle}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Failed to export news article PNG:', err);
  }
}
