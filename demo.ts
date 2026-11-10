import {
  generar_formulario
} from "./src/tools/proveedor";

async function main() {

  const resultado =
    await generar_formulario.execute(
      {
        caso: "co-industrias-delta"
      },
      {
        directory: process.cwd(),
        sessionId: "demo"
      }
    );

  console.log(resultado);

}

main();