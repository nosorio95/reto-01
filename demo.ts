import {
  simular_envio
} from "./src/tools/proveedor";

async function main() {

  const resultado =
    await simular_envio.execute(
      {
        caso: "co-industrias-delta",
        confirmado: true
      },
      {
        directory: process.cwd(),
        sessionId: "demo"
      }
    );

  console.log(
    JSON.stringify(
      JSON.parse(resultado),
      null,
      2
    )
  );

}

main();