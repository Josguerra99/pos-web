const pdfMakePrinter = require("pdfmake/src/printer");
const path = require("path");

let report = {};

/**
 * Retorna la ubicacion de una fuente
 * @param {String} file Nombre de la fuente
 */
function fontPath(file) {
  return path.resolve(
    "node_modules",
    "roboto-fontface",
    "fonts",
    "roboto",
    file
  );
}

/**
 * Crea las definiciones de las fuentes
 */
var fontDescriptors = {
  Roboto: {
    normal: fontPath("Roboto-Regular.woff"),
    bold: fontPath("Roboto-Medium.woff"),
    italics: fontPath("Roboto-LightItalic.woff"),
    bolditalics: fontPath("Roboto-BlackItalic.woff")
  }
};

/**
 *
 * @param {Array, pdf content} docDefinition
 * @param {funcion de llamada} callback
 */
report.generatePdf = (docDefinition, callback) => {
  try {
    //const fontDescriptors = { ... };

    const printer = new pdfMakePrinter(fontDescriptors);
    const doc = printer.createPdfKitDocument(docDefinition);

    let chunks = [];

    doc.on("data", chunk => {
      chunks.push(chunk);
    });

    doc.on("end", () => {
      callback(Buffer.concat(chunks));
    });

    doc.end();
  } catch (err) {
    throw err;
  }
};

module.exports = report;
