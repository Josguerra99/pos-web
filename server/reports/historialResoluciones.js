const report = require("./reportDisplayer");
const helper = require("./reporthelper");
const formatDate = require("date-fns/format");

var definition = { content: ["No se logro obtener las resoluciones "] };

/**
 * Crea la estructura de la tabla de resoluciones
 * @param {Array} resoluciones las resoluciones que queremos que esten en el reporte
 */
const tableStructure = resoluciones => {
  var rows = [];
  rows.push(
    helper.tableRowStyler(
      ["Número de resolución", "Serie", "Documento", "Rango", "Fecha"],
      "tableHeader"
    )
  );

  resoluciones.map((el, index) => {
    var rango = el.Inicio + " al " + el.Fin;
    var documento = "???";
    if (el.Documento === "FAC") documento = "Factura";
    if (el.Documento === "NC") documento = "Nota de Crédito";
    if (el.Documento === "ND") documento = "Nota de Débito";
    var fecha = formatDate(el.Fecha, "DD/MM/YYYY");
    rows.push(
      helper.tableRowStyler(
        [[el.Num], [el.Serie], documento, rango, fecha],
        "tableBody"
      )
    );
  });

  return rows;
};

/**
 *
 * @param {Array} session Arreglo que tiene informacion de sesion
 * @param {Array} resoluciones Arreglo que tiene todas las resoluciones que queremos generar en el reporte
 */
exports.createContent = function(session, resoluciones, negocio) {
  definition = {
    content: [
      helper.infoCreator("Nombre", negocio.Nombre, helper.getDate()),
      helper.infoCreator("NIT", session.nit_negocio),
      helper.infoCreator("Dirección", negocio.Direccion),
      helper.spacing(3),
      {
        table: {
          headerRows: 1,
          color: "#444",
          widths: ["30%", "10%", "*", "*", "15%"],
          body: tableStructure(resoluciones)
        }
      }
    ],

    footer: function(page, pages) {
      return { text: page + " de " + pages, alignment: "center" };
    },

    styles: helper.styles()
  };
};

exports.print = function(callback) {
  report.generatePdf(definition, callback);
};
