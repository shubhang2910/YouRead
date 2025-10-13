// Download and export functions

/**
 * Downloads an article in the specified format
 * @param {Object} articleData - The article data to download
 * @param {string} format - The format ('pdf' or 'docx')
 */
async function downloadArticle(articleData, format) {
    try {
        const content = formatArticleContent(articleData.article);
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${articleData.title}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        .article-header {
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .article-title {
            font-size: 28px;
            font-weight: 700;
            margin: 0 0 15px 0;
            color: #2c3e50;
        }
        .article-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            font-size: 14px;
            color: #666;
        }
        .meta-item {
            background: #f8f9fa;
            padding: 8px 12px;
            border-radius: 6px;
            border-left: 4px solid #667eea;
        }
        .article-content {
            font-size: 16px;
            line-height: 1.7;
        }
        .article-h2 {
            font-size: 22px;
            font-weight: 700;
            margin: 30px 0 15px 0;
            color: #2c3e50;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 8px;
        }
        .article-h3 {
            font-size: 20px;
            font-weight: 600;
            margin: 25px 0 12px 0;
            color: #34495e;
        }
        .article-h4 {
            font-size: 18px;
            font-weight: 600;
            margin: 20px 0 10px 0;
            color: #34495e;
        }
        .article-p {
            margin: 0 0 15px 0;
        }
        .article-hr {
            border: none;
            height: 2px;
            background: linear-gradient(90deg, transparent, #667eea, transparent);
            margin: 25px 0;
        }
        .article-li {
            margin: 8px 0;
            padding-left: 20px;
            position: relative;
        }
        .article-li::before {
            content: "•";
            color: #667eea;
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        .article-code {
            background: #f8f9fa;
            color: #e74c3c;
            padding: 3px 8px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            border: 1px solid #e9ecef;
        }
        .article-link {
            color: #3498db;
            text-decoration: underline;
        }
        .article-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: #fff;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            overflow: hidden;
        }
        .article-th {
            background: #f8f9fa;
            padding: 15px 12px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
            border-bottom: 2px solid #e9ecef;
            color: #2c3e50;
        }
        .article-td {
            padding: 12px;
            border-bottom: 1px solid #e9ecef;
            font-size: 14px;
        }
        .article-table tr:last-child .article-td {
            border-bottom: none;
        }
        .article-table tr:nth-child(even) {
            background: #f8f9fa;
        }
        @media print {
            body { padding: 20px; }
            .article-meta { flex-direction: column; gap: 10px; }
        }
    </style>
</head>
<body>
    <div class="article-header">
        <h1 class="article-title">${articleData.title}</h1>
        <div class="article-meta">
            <div class="meta-item"><strong>Channel:</strong> ${articleData.channelName}</div>
            <div class="meta-item"><strong>Published:</strong> ${articleData.publishDate}</div>
            <div class="meta-item"><strong>Generated:</strong> ${new Date().toLocaleString()}</div>
        </div>
    </div>
    <div class="article-content">
        ${content}
    </div>
</body>
</html>`;

        if (format === "pdf") {
            // For PDF, we'll create a blob and download it
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${articleData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Note: For true PDF generation, you'd need a library like jsPDF or html2pdf
            alert("HTML file downloaded. For PDF conversion, use your browser's 'Print to PDF' feature or convert online.");
        } else {
            // For DOCX, create a simple text version
            const textContent = `
${articleData.title}

Channel: ${articleData.channelName}
Published: ${articleData.publishDate}
Generated: ${new Date().toLocaleString()}

${articleData.article.replace(/<[^>]*>/g, '').replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1')}
`;
            
            const blob = new Blob([textContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${articleData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    } catch (error) {
        console.error("Error downloading article:", error);
        alert("Error downloading article: " + error.message);
    }
}

/**
 * Opens an article in a new browser window
 * @param {Object} articleData - The article data to display
 */
function openArticleInNewWindow(articleData) {
    const content = formatArticleContent(articleData.article);
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${articleData.title} - YouRead</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1000px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
        }
        .article-container {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .article-header {
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .article-title {
            font-size: 32px;
            font-weight: 700;
            margin: 0 0 15px 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .article-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            font-size: 14px;
            color: #666;
        }
        .meta-item {
            background: rgba(102, 126, 234, 0.1);
            padding: 8px 12px;
            border-radius: 6px;
            border-left: 4px solid #667eea;
        }
        .article-content {
            font-size: 16px;
            line-height: 1.7;
        }
        .article-h2 {
            font-size: 24px;
            font-weight: 700;
            margin: 30px 0 15px 0;
            color: #2c3e50;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 8px;
        }
        .article-h3 {
            font-size: 20px;
            font-weight: 600;
            margin: 25px 0 12px 0;
            color: #34495e;
        }
        .article-h4 {
            font-size: 18px;
            font-weight: 600;
            margin: 20px 0 10px 0;
            color: #34495e;
        }
        .article-p {
            margin: 0 0 15px 0;
        }
        .article-hr {
            border: none;
            height: 2px;
            background: linear-gradient(90deg, transparent, #667eea, transparent);
            margin: 25px 0;
        }
        .article-li {
            margin: 8px 0;
            padding-left: 20px;
            position: relative;
        }
        .article-li::before {
            content: "•";
            color: #667eea;
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        .article-code {
            background: #f8f9fa;
            color: #e74c3c;
            padding: 3px 8px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            border: 1px solid #e9ecef;
        }
        .article-link {
            color: #3498db;
            text-decoration: underline;
        }
        .article-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: #fff;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            overflow: hidden;
        }
        .article-th {
            background: #f8f9fa;
            padding: 15px 12px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
            border-bottom: 2px solid #e9ecef;
            color: #2c3e50;
        }
        .article-td {
            padding: 12px;
            border-bottom: 1px solid #e9ecef;
            font-size: 14px;
        }
        .article-table tr:last-child .article-td {
            border-bottom: none;
        }
        .article-table tr:nth-child(even) {
            background: #f8f9fa;
        }
        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        .print-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
    </style>
</head>
<body>
    <button class="print-button" onclick="window.print()">Print / Save as PDF</button>
    <div class="article-container">
        <div class="article-header">
            <h1 class="article-title">${articleData.title}</h1>
            <div class="article-meta">
                <div class="meta-item"><strong>Channel:</strong> ${articleData.channelName}</div>
                <div class="meta-item"><strong>Published:</strong> ${articleData.publishDate}</div>
                <div class="meta-item"><strong>Generated:</strong> ${new Date().toLocaleString()}</div>
            </div>
        </div>
        <div class="article-content">
            ${content}
        </div>
    </div>
</body>
</html>`;

    const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    newWindow.document.write(htmlContent);
    newWindow.document.close();
}
