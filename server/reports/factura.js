const report = require("./reportDisplayer");
const helper = require("./reporthelper");
const formatDate = require("date-fns/format");
var definition = { content: ["No se logro generar la factura "] };

/**
 * Crea la estructura de la tabla de resoluciones
 * @param {Array} resoluciones las resoluciones que queremos que esten en el reporte
 */
const getDetalle = detalle => {
  var rows = [];
  detalle.map((el, index) => {
    rows.push({
      columns: [
        { width: "15%", text: el.cantidad, style: "detalle_cantidad" },
        { width: "40%", text: el.producto, style: "detalle_text" },
        {
          width: "25%",
          text: "Q." + el.precioUnitario.toFixed(2),
          style: "detalle_number"
        },
        {
          width: "20%",
          text: "Q." + el.precioVenta.toFixed(2),
          style: "detalle_number"
        }
      ]
    });
  });

  return rows;
};

const footerText = factura => {
  return factura.pequeno
    ? "No genera derecho a crédito fiscal"
    : "Sujeto a pagos trimestrales";
};

/**
 *
 * @param {Array} session Arreglo que tiene informacion de sesion
 * @param {Array} resoluciones Arreglo que tiene todas las resoluciones que queremos generar en el reporte
 */
exports.createContent = function(factura, detalle, resSistema) {
  definition = {
    pageMargins: [2, 2, 2, 2],
    pageSize: { width: 226.776653344, height: "auto" },
    content: [
      { text: factura.nombre_negocio, style: "header_emisor" },
      { text: factura.denominacion_negocio, style: "header_emisor" },
      { text: factura.direccion_negocio, style: "header_direccion" },
      helper.spacing(1),
      { text: "NIT:    " + factura.nit_negocio, style: "nit_emisor" },
      {
        text:
          "Resolución " +
          factura.nResolucion +
          " del " +
          formatDate(factura.fechaResolucion, "DD/MM/YYYY"),
        style: "resolucion"
      },
      {
        text: "serie " + factura.serie + " de " + factura.rango,
        style: "header_emisor"
      },
      { text: "Resolución Sistema", style: "header_emisor" },
      {
        text:
          "Res. " +
          resSistema[0].num +
          " del " +
          formatDate(resSistema[0].fecha, "DD/MM/YYYY"),
        style: "resolucion"
      },
      helper.spacing(1),
      {
        columns: [
          {
            width: "50%",
            text: "FACTURA SERIE " + factura.serie,
            style: "serie_numero"
          },
          {
            width: "50%",
            text: "No.    " + factura.nFactura,
            style: "serie_numero"
          }
        ]
      },
      {
        text: "FECHA DE EMISION:    " + formatDate(factura.fecha, "DD/MM/YYYY"),
        style: "fecha_emision"
      },
      helper.spacing(1),
      {
        text: "COMPUTADORA No. " + factura.computadora,
        style: "fecha_emision"
      },
      {
        text: "TRANSACCION:    " + factura.ntransaccion,
        style: "fecha_emision"
      },
      helper.spacing(1),
      {
        text: "Nombre:    " + factura.nombre_cliente.toUpperCase(),
        style: "fecha_emision"
      },
      {
        text: "Nit:              " + factura.nit_cliente,
        style: "fecha_emision"
      },
      {
        text: "Dirección:   " + factura.direccion_cliente,
        style: "fecha_emision"
      },
      helper.spacing(1),
      {
        columns: [
          { width: "15%", text: "Cantidad", style: "header_detalle" },
          { width: "40%", text: "Producto", style: "header_detalle" },
          { width: "20%", text: "Precio", style: "header_detalle" },
          { width: "25%", text: "Sub total", style: "header_detalle" }
        ]
      },
      getDetalle(detalle),
      helper.spacing(1),
      {
        columns: [
          { width: "*", text: "", style: "detalle_text" },
          { width: "*", text: "TOTAL", style: "detalle_text" },
          { width: "*", text: "", style: "detalle_text" },
          {
            width: "*",
            text: "Q." + factura.total.toFixed(2),
            style: "detalle_number_bold"
          }
        ]
      },
      helper.spacing(2),
      { text: footerText(factura), style: "resolucion" },
      { text: "GRACIAS POR PREFERIRNOS", style: "resolucion" }
    ],
    footer: function(page, pages) {
      return { text: page + " de " + pages, alignment: "center" };
    },
    styles: {
      header_direccion: { fontSize: 6.5, alignment: "center" },
      header_emisor: { fontSize: 8, bold: true, alignment: "center" },
      nit_emisor: { fontSize: 9.5, bold: true, alignment: "center" },
      resolucion: { fontSize: 8, alignment: "center" },
      serie_numero: { fontSize: 9, bold: true, alignment: "left" },
      fecha_emision: { fontSize: 9, alignment: "left" },
      header_detalle: { fontSize: 8, bold: true, alignment: "center" },
      detalle_cantidad: { fontSize: 7, alignment: "center" },
      detalle_text: { fontSize: 7, alignment: "left" },
      detalle_number: { fontSize: 7, alignment: "right" },
      detalle_number_bold: { fontSize: 7, bold: true, alignment: "right" },
      italics: { italics: true, alignment: "right" },
      tableHeader: {
        bold: true,
        fontSize: 14,
        color: "black",
        fillColor: "#cfd8dc"
      },
      tableBody: { fontSize: 11 }
    }
  };
};

exports.print = function(callback) {
  report.generatePdf(definition, callback);
};
