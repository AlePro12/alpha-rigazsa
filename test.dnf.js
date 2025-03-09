const rigazsa = require("./src/index");
const NoFiscalDoc = require("./src/NoFiscalDoc");
const Factura = require("./src/Factura");
const os = require("os");
const serialport = require("serialport");
const readline = require("readline");
const { autoDetect } = require("@serialport/bindings-cpp");

// Interfaz de consola de comandos
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const askImpresora = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

(async () => {
  const Binding = autoDetect();

  //print ports
  const ports = await Binding.list();
  console.log("Puertos seriales disponibles");
  ports.forEach((port, index) => {
    console.log("#" + index, port.path);
  });

  let impresora = await askImpresora("Puerto de impresora (Numero o Puerto): ");

  if (isNaN(impresora)) {
    impresora = ports.find((port) => port.path === impresora);
  } else {
    impresora = ports[parseInt(impresora)];
  }
  await rigazsa.init(impresora); //'/dev/tty.usbserial-1420');

  rigazsa.getAllInfoPrinter().then((res) => {
    console.log("Informacion de la impresora:", res);
  });

  let continuar = await askImpresora(
    "Desea continuar con la impresion NO FISCAL? (s/n): "
  );
  if (continuar.toLowerCase() === "n") process.exit();
  if (continuar.toLowerCase() === "s") {
    await NoFiscalDoc.init(rigazsa);
    await NoFiscalDoc.Apertura();
    await NoFiscalDoc.Bold("PRUEBA DE IMPRESION DIRECTA");
    await NoFiscalDoc.Bold("IMPRESORA CONECTADA");
    await NoFiscalDoc.Bold("fin");
    console.log("cerrando documento no fiscal");
    await NoFiscalDoc.Close();
  }
})();
