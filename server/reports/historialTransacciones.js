const report = require("./reportDisplayer");
const helper = require("./reporthelper");
const formatDate = require("date-fns/format");

var definition = { content: ["No se logro obtener las resoluciones "] };

/**
 * Crea la estructura de la tabla de transacciones
 * @param {Array} transacciones las transacciones que queremos que esten en el reporte
 */
const tableStructure = transacciones => {
  var rows = [];
  rows.push(
    helper.tableRowStyler(
      [
        "Número de transacción",
        "Documento",
        "Correlativo",
        "Serie",
        "Monto",
        "Fecha",
        "Estado"
      ],
      "tableHeader"
    )
  );

  transacciones.map((el, index) => {
    var documento = "???";
    if (el.documento === "FAC") documento = "Factura";
    if (el.documento === "NC") documento = "Nota de Crédito";
    if (el.documento === "ND") documento = "Nota de Débito";
    var fecha = formatDate(el.fecha, "DD/MM/YYYY");
    var monto = "Q." + el.monto.toFixed(2);

    var estado = "???";
    if (el.tipo === "E") estado = "Emitido";
    if (el.tipo === "A") estado = "Anulado";
    if (el.tipo === "D") estado = "Devolición";

    rows.push(
      helper.tableRowStyler(
        [
          el.ntransaccion,
          documento,
          el.correlativo,
          el.serie,
          monto,
          fecha,
          estado
        ],
        "tableBody"
      )
    );
  });

  return rows;
};

/**
 *
 * @param {Array} session Arreglo que tiene informacion de sesion
 * @param {Array} transacciones Arreglo que tiene todas las transacciones que queremos generar en el reporte
 */
exports.createContent = function(session, transacciones, negocio) {
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
          widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto"],
          body: tableStructure(transacciones)
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
