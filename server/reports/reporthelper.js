const formatDate = require("date-fns/format");

let helper = {};

/**
 *
 * Mostrar la fecha de hoy
 *
 * @param {Date/null} date Fecha que se va a mostrar, null es la de hoy
 */

helper.getDate = (date = null) => {
  if (date == null) date = new Date();
  return formatDate(date, "DD/MM/YYYY");
};

/**
 * Imprimira informacion de lado izquierdo con un nombre y un valorpor ejemplo
 * Nombre: John Doe
 *
 * @param {String} name Nombre del valor que se quiere mostrar esto se pondra en negrita
 * @param {String} val Valor que se va a mostrar
 * @param {String/null} rightColumn no es obligarorio, si se pasa imprimira ese texto del lado derecho
 */
helper.infoCreator = (name, val, rightColumn = null) => {
  return {
    columns: [
      {
        width: "15%",
        text: name,
        style: "header_bold"
      },
      {
        width: "auto",
        text: val,
        style: "header_normal"
      },
      {
        alignment: "right",
        text: rightColumn
      }
    ],
    columnGap: 10
  };
};

/**
 *
 * @param {Array} row Las columnas de la fila en un arreglo
 * @param {string} style El nombre del estilo que se le quiere aplicar
 */
helper.tableRowStyler = (row, style) => {
  var finalrow = row.map(el => {
    return {
      style: style,
      text: el
    };
  });

  return finalrow;
};

/**
 *
 * Deja un espacio de n lineas
 * @param {integer} lines Numero de lineas que va a dejar
 */

helper.spacing = lines => {
  return { text: " ", lineHeight: lines };
};

/**
 *Algunos estilos comunes para utilizar (y que las funciones de este script utilizan)
 */
helper.styles = () => {
  return {
    header_normal: { fontSize: 13 },
    header_bold: { fontSize: 13, bold: true },
    italics: { italics: true, alignment: "right" },
    tableHeader: {
      bold: true,
      fontSize: 14,
      color: "black",
      fillColor: "#cfd8dc"
    },
    tableBody: { fontSize: 11 }
  };
};

module.exports = helper;
