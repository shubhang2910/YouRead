// Article content formatting functions

/**
 * Formats markdown content into HTML
 * @param {string} content - The markdown content to format
 * @returns {string} - Formatted HTML content
 */
function formatArticleContent(content) {
    if (!content) return '<p>No content available.</p>';
    
    // Split content into lines for processing
    const lines = content.split('\n');
    let formattedContent = '';
    let inTable = false;
    let tableRows = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip empty lines
        if (!line) {
            if (inTable && tableRows.length > 0) {
                formattedContent += formatTable(tableRows);
                tableRows = [];
                inTable = false;
            }
            formattedContent += '<br>';
            continue;
        }
        
        // Headers
        if (line.startsWith('## ')) {
            formattedContent += `<h2 class="article-h2">${line.substring(3)}</h2>`;
        } else if (line.startsWith('### ')) {
            formattedContent += `<h3 class="article-h3">${line.substring(4)}</h3>`;
        } else if (line.startsWith('#### ')) {
            formattedContent += `<h4 class="article-h4">${line.substring(5)}</h4>`;
        }
        // Horizontal rules
        else if (line.startsWith('---')) {
            formattedContent += '<hr class="article-hr">';
        }
        // Tables
        else if (line.includes('|')) {
            inTable = true;
            tableRows.push(line);
        }
        // Lists
        else if (line.startsWith('- ') || line.startsWith('* ')) {
            formattedContent += `<li class="article-li">${formatInlineMarkdown(line.substring(2))}</li>`;
        }
        // Numbered lists
        else if (/^\d+\.\s/.test(line)) {
            formattedContent += `<li class="article-li numbered">${formatInlineMarkdown(line.replace(/^\d+\.\s/, ''))}</li>`;
        }
        // Regular paragraphs
        else {
            if (inTable && tableRows.length > 0) {
                formattedContent += formatTable(tableRows);
                tableRows = [];
                inTable = false;
            }
            formattedContent += `<p class="article-p">${formatInlineMarkdown(line)}</p>`;
        }
    }
    
    // Handle any remaining table
    if (inTable && tableRows.length > 0) {
        formattedContent += formatTable(tableRows);
    }
    
    return formattedContent;
}

/**
 * Formats inline markdown elements (bold, italic, code, links)
 * @param {string} text - The text to format
 * @returns {string} - Formatted HTML text
 */
function formatInlineMarkdown(text) {
    return text
        // Bold text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic text
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Inline code
        .replace(/`(.*?)`/g, '<code class="article-code">$1</code>')
        // Links (basic support)
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="article-link" target="_blank">$1</a>');
}

/**
 * Formats a markdown table into HTML
 * @param {Array} rows - Array of table row strings
 * @returns {string} - Formatted HTML table
 */
function formatTable(rows) {
    if (rows.length === 0) return '';
    
    let tableHTML = '<table class="article-table">';
    
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].split('|').map(cell => cell.trim()).filter(cell => cell);
        
        if (i === 0) {
            // Header row
            tableHTML += '<thead><tr>';
            cells.forEach(cell => {
                tableHTML += `<th class="article-th">${formatInlineMarkdown(cell)}</th>`;
            });
            tableHTML += '</tr></thead><tbody>';
        } else if (i === 1 && cells.every(cell => /^-+$/.test(cell))) {
            // Skip separator row
            continue;
        } else {
            // Data row
            tableHTML += '<tr>';
            cells.forEach(cell => {
                tableHTML += `<td class="article-td">${formatInlineMarkdown(cell)}</td>`;
            });
            tableHTML += '</tr>';
        }
    }
    
    tableHTML += '</tbody></table>';
    return tableHTML;
}
