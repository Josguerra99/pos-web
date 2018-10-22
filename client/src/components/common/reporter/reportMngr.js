import { saveAs } from "file-saver";

class ReportMngr {
  constructor() {
    this.file = null;
    this.gettingFile = false;
    this.callbacks = [];
  }

  /**
   * Va a poner el valor del archivo y va a llamar a todos los callbacks que esten en la pila
   * @param {blob} file Archivo que se trajo del api
   */
  setFile = file => {
    this.file = file;
    this.callbacks.forEach(el => {
      el(file);
    });
  };

  /**
   * Va a obtener el archivo
   * Hay 3 escenarios
   * --No lo a ido a traer entonces ira a traerlo y si hay un callback lo agrega a la pila de callbacks
   * --Ya lo trajo y tiene el archivo, solo hace el callback actual al archivo
   * --Lo esta trayendo, solo agregamos el callback a la pila de callbacks
   *
   * @param {String} reportName Servira saber que reporte va a descargar
   * @param {Function(String)} callback  Si tiene un callback servira para llamarlo cuando ya se tenga el arhivo
   */
  getFile = (reportName, callback = null) => {
    /*Ya tengo el archivo, entonces solo llamo al callback */
    if (this.file !== null) {
      if (callback !== null) {
        callback(this.file);
      }
    }

    /*Agregar callback a la pila */
    if (callback !== null) this.callbacks.push(callback);

    /*Si ya lo estoy trayendo no hago nada*/
    if (this.gettingFile === true) {
      return;
    }

    this.gettingFile = true;

    //Realizar peticion get
    fetch("/api/reports/" + reportName, {
      method: "GET",
      headers: {
        "Content-Type": "application/pdf"
      },
      responseType: "blob"
    })
      .then(response => response.blob())
      .then(blob => {
        this.setFile(blob);
      })
      .catch(error => {
        console.log(error);
      });
  };

  /**
   * Obtiene el archivo y luego de eso llama al callback que se le paso, a este callback se le pasara
   * un url que crea donde se podra ver el archivo
   * @param {String} reportName Nombre del archivo que se quiere
   * @param {Function(string)} callback Callback al que se le pasara una url que va a crear
   */
  openReport = (reportName, callback) => {
    this.getFile(reportName, file => {
      const fileURL = URL.createObjectURL(file);
      callback(fileURL);
    });
  };

  /**
   * Descarga el reporte que se le este pidiendo
   * @param {String} reportName Nombre del reporte que se va a descargar
   */
  downloadReport = reportName => {
    this.getFile(reportName, file => {
      saveAs(file, reportName + ".pdf");
    });
  };
}

export default ReportMngr;
