let filterMngr = {};
const mysql = require("mysql");

function filterHelper(filter) {
  var query = "";
  query += mysql.escapeId(filter.id) + " ";

  if (filter.type === "numeric") {
    if (filter.state === "><") {
      query +=
        "BETWEEN " +
        mysql.escape(filter.v1) +
        " AND " +
        mysql.escape(filter.v2);
    }
    if (filter.state === "=") {
      query += "= " + mysql.escape(filter.v1);
    }
    if (filter.state === "!=") {
      query += "<> " + mysql.escape(filter.v1);
    }
    if (filter.state === ">") {
      query += "> " + mysql.escape(filter.v1);
    }
    if (filter.state === "<") {
      query += "< " + mysql.escape(filter.v1);
    }
  } else if (filter.type === "text") {
    if (filter.state === "=") {
      query += "= " + mysql.escape(filter.v1);
    }
    if (filter.state === "!=") {
      query += "<> " + mysql.escape(filter.v1);
    }
    if (filter.state === "%") {
      query += "LIKE " + mysql.escape("%" + filter.v1 + "%");
    }
    if (filter.state === "!%") {
      query += "NOT LIKE " + mysql.escape("%" + filter.v1 + "%");
    }
  } else if (filter.type === "select") {
    query = "(";
    filter.v1.forEach((el, id) => {
      query += mysql.escapeId(filter.id) + " = " + mysql.escape(el);
      if (id < filter.v1.length - 1) query += " OR ";
    });
    query += ")";
  }

  return query;
}

filterMngr.createFilter = filters => {
  let whereQuery = "";
  if (filters != null && filters.length > 0) {
    filters.forEach((filter, id) => {
      whereQuery += filterHelper(filter);
      if (id < filters.length - 1) whereQuery += " AND ";
    });
  } else {
    whereQuery = " 1=1";
  }
  return whereQuery;
};

module.exports = filterMngr;
