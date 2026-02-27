// ─────────────────────────────────────────────────────────────
//  ASSESSMENT REPORT EXPORTER MODULE
// ─────────────────────────────────────────────────────────────

/**
 * Normalizes topic stats for export
 */
function getTableData(stats) {
    const list = [];
    Object.entries(stats.topicStats).forEach(([topic, s]) => {
        if (s.total === 0) return;
        const accuracy = Math.round((s.correct / s.total) * 100);
        const status = accuracy >= 75 ? 'Strong' : accuracy < 50 ? 'Weak' : 'Moderate';
        list.push({ topic, accuracy, correct: s.correct, total: s.total, status });
    });
    return list;
}

/**
 * 📄 EXPORT TO PDF (Using jsPDF)
 */
export function downloadPDF(stats, profile) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert("PDF generator not loaded yet. Please wait a second and try again.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(0, 212, 255); // Nexus Accent Blue
    doc.text("Lvl->Up Assessment Summary", 20, 20);

    // Student Info
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text(`Candidate: ${profile?.name || 'NEXUS Candidate'}`, 20, 35);
    doc.text(`Subject: ${(stats.lang || 'N/A').toUpperCase()}`, 20, 42);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 49);

    // Core Metrics
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Performance Metrics", 20, 65);

    doc.setFontSize(11);
    doc.text(`Final Score: ${stats.score100} / 100`, 20, 75);
    doc.text(`Overall Accuracy: ${stats.acc}%`, 20, 82);
    doc.text(`XP Earned: +${stats.xp}`, 20, 89);
    doc.text(`Max Streak: ${stats.hiStreak}`, 20, 96);

    // Topic Stats
    doc.setFontSize(16);
    doc.text("Topic Accuracy", 20, 115);

    let y = 125;
    doc.setFontSize(10);
    const tblData = getTableData(stats);

    if (tblData.length === 0) {
        doc.text("No topics attempted.", 20, y);
    } else {
        // Table header
        doc.setFont("helvetica", "bold");
        doc.text("Topic", 20, y);
        doc.text("Accuracy", 80, y);
        doc.text("Status", 120, y);
        doc.text("Correct/Total", 160, y);
        doc.setFont("helvetica", "normal");
        y += 8;

        tblData.forEach(row => {
            doc.text(row.topic, 20, y);
            doc.text(`${row.accuracy}%`, 80, y);
            doc.text(row.status, 120, y);
            doc.text(`${row.correct}/${row.total}`, 160, y);
            y += 8;
        });
    }

    doc.save(`Nexus_Report_${profile?.name || 'Candidate'}.pdf`);
}

/**
 * 📊 EXPORT TO CSV
 */
export function downloadCSV(stats, profile) {
    const tblData = getTableData(stats);
    let csv = "Topic,Accuracy,Status,Correct,Attempted\n";

    if (tblData.length === 0) {
        csv += "No topics attempted,0,N/A,0,0\n";
    } else {
        tblData.forEach(row => {
            // Escape commas in topic names just in case
            const safeTopic = `"${row.topic}"`;
            csv += `${safeTopic},${row.accuracy}%,${row.status},${row.correct},${row.total}\n`;
        });
    }

    // Attach high level summary header string
    const meta = `"CANDIDATE: ${profile?.name || 'NEXUS Candidate'}"
"SUBJECT: ${(stats.lang || 'N/A').toUpperCase()}"
"SCORE: ${stats.score100}/100"
"ACCURACY: ${stats.acc}%"
"XP: ${stats.xp}"

`;

    const finalCsv = meta + csv;
    triggerDownload("report.csv", "text/csv", finalCsv);
}

/**
 * 📁 EXPORT TO XML
 */
export function downloadXML(stats, profile) {
    const tblData = getTableData(stats);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<AssessmentReport>\n`;
    xml += `  <Student>\n`;
    xml += `    <Name>${escapeXml(profile?.name || 'NEXUS Candidate')}</Name>\n`;
    xml += `    <Title>${escapeXml(profile?.title || 'Initiate')}</Title>\n`;
    xml += `  </Student>\n`;
    xml += `  <Metrics>\n`;
    xml += `    <Subject>${escapeXml((stats.lang || 'N/A').toUpperCase())}</Subject>\n`;
    xml += `    <Score>${stats.score100}</Score>\n`;
    xml += `    <Accuracy>${stats.acc}</Accuracy>\n`;
    xml += `    <XP>${stats.xp}</XP>\n`;
    xml += `    <MaxStreak>${stats.hiStreak}</MaxStreak>\n`;
    xml += `  </Metrics>\n`;
    xml += `  <Topics>\n`;

    tblData.forEach(row => {
        xml += `    <Topic>\n`;
        xml += `      <Name>${escapeXml(row.topic)}</Name>\n`;
        xml += `      <Accuracy>${row.accuracy}</Accuracy>\n`;
        xml += `      <Status>${row.status}</Status>\n`;
        xml += `      <Correct>${row.correct}</Correct>\n`;
        xml += `      <Total>${row.total}</Total>\n`;
        xml += `    </Topic>\n`;
    });

    xml += `  </Topics>\n`;
    xml += `</AssessmentReport>`;

    triggerDownload("report.xml", "application/xml", xml);
}

/**
 * 📤 SHARE REPORT
 */
export function doShareReport(stats, profile) {
    if (navigator.share) {
        const text = `I just scored ${stats.score100}/100 in my NEXUS ${(stats.lang || '').toUpperCase()} Assessment! Total XP: ${stats.xp} 🔥`;
        navigator.share({
            title: 'Lvl->Up Assessment Result',
            text: text,
            url: window.location.href, // Can't easily attach local files via Web Share level 1, so we share text
        }).catch(err => {
            console.error("Error sharing", err);
        });
    } else {
        alert("Sharing is not supported on this browser. Please use the download buttons instead.");
    }
}

// Helpers
function triggerDownload(filename, mimeType, content) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function escapeXml(unsafe) {
    if (!unsafe) return '';
    return unsafe.toString().replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}
