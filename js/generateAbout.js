const fs = require("fs");
const path = require("path");
const marked = require("marked");

// Función para generar about.html desde README.md
function generateAboutPage() {
    const readmePath = path.join(__dirname, "../README.md");
    const outputPath = path.join(__dirname, "../public", "about.html");

    try {
        const markdown = fs.readFileSync(readmePath, "utf-8");
        const htmlContent = marked.parse(markdown);

        const htmlPage = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>About - SOS2425</title>
        </head>
        <body>
            <h1>About Our Project</h1>
            ${htmlContent}
        </body>
        </html>
        `;

        fs.writeFileSync(outputPath, htmlPage);
        console.log(" Página about.html generada correctamente.");
    } catch (error) {
        console.error(" Error generando about.html:", error);
    }
}

// Exportar la función para usarla en index.js
module.exports = generateAboutPage;
