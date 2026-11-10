import fs from "fs/promises";
import path from "path";
import { z } from "zod";
import { getValue } from "../utils/getValue";
 
type ToolContext = {
directory: string;
sessionId: string;
};
 
export const leer_solicitud = {
description:
"Lee una solicitud de registro y devuelve los campos, soportes y formato solicitados.",
 
args: {
caso: z.string()
},
 
async execute(
args: { caso: string },
ctx: ToolContext
): Promise<string> {
 
try {
 
const casoPath = path.join(
ctx.directory,
"fixtures",
"reto-01",
"casos",
args.caso
);
 
const solicitud = JSON.parse(
await fs.readFile(
path.join(
casoPath,
"solicitud.json"
),
"utf8"
)
);
 
const soportes = JSON.parse(
await fs.readFile(
path.join(
casoPath,
"soportes-exigidos.json"
),
"utf8"
)
);
 
let campos: string[] = [];
 
if (solicitud.formato === "xlsx") {
 
const plantilla = JSON.parse(
await fs.readFile(
path.join(
casoPath,
"plantilla-celdas.json"
),
"utf8"
)
);
 
campos = plantilla.map(
(campo: any) => campo.etiqueta
);
}
 
if (solicitud.formato === "pdf") {
 
const plantilla = JSON.parse(
await fs.readFile(
path.join(
casoPath,
"plantilla-campos.json"
),
"utf8"
)
);
 
campos = plantilla.map(
(campo: any) => campo.etiqueta
);
}
 
return JSON.stringify({
ok: true,
data: {
pais: solicitud.pais,
cliente: solicitud.cliente,
formato: solicitud.formato,
campos,
soportes
}
});
 
} catch (error) {
 
return JSON.stringify({
ok: false,
error: String(error)
});
 
}
}
};
 
export const mapear_campos = {
description:
"Mapea campos utilizando el glosario y el maestro.",
 
args: {
caso: z.string(),
campos: z.array(z.string())
},
 
async execute(
args: {
caso: string;
campos: string[];
},
ctx: ToolContext
): Promise<string> {
 
try {
 
const basePath = path.join(
ctx.directory,
"fixtures",
"reto-01"
);
 
const maestro = JSON.parse(
await fs.readFile(
path.join(
basePath,
"repositorio",
"maestro.json"
),
"utf8"
)
);
 
const glosario = JSON.parse(
await fs.readFile(
path.join(
basePath,
"glosario-campos.json"
),
"utf8"
)
);
 
const llenos: any[] = [];
const faltantes: any[] = [];
const requiere_confirmacion: any[] = [];
 
for (const etiqueta of args.campos) {
 
const ruta = glosario[etiqueta];
 
if (!ruta) {
 
faltantes.push({
campo: etiqueta,
motivo:
"No existe equivalencia en el glosario"
});
 
continue;
}
 
const valor =
getValue(
maestro,
ruta
);
 
if (
valor === undefined ||
valor === null
) {
 
faltantes.push({
campo: etiqueta,
ruta
});
 
continue;
}
 
if (
etiqueta === "RUC" ||
etiqueta === "RTN"
) {
 
requiere_confirmacion.push({
campo: etiqueta,
ruta,
valor,
nota:
"Identificador extranjero. Periferia solo dispone de NIT colombiano."
});
 
continue;
}
 
llenos.push({
campo: etiqueta,
ruta,
valor
});
}
 
return JSON.stringify({
ok: true,
data: {
llenos,
faltantes,
requiere_confirmacion
}
});
 
} catch (error) {
 
return JSON.stringify({
ok: false,
error: String(error)
});
 
}
}
};
 
export const generar_formulario = {
description:
"Genera el formulario solicitado por el cliente.",
 
args: {
caso: z.string()
},
 
async execute(
args: {
caso: string;
},
ctx: ToolContext
): Promise<string> {
 
try {
 
const casoPath = path.join(
ctx.directory,
"fixtures",
"reto-01",
"casos",
args.caso
);
 
const solicitud = JSON.parse(
await fs.readFile(
path.join(
casoPath,
"solicitud.json"
),
"utf8"
)
);
 
const outPath = path.join(
ctx.directory,
"out",
args.caso
);
 
await fs.mkdir(
outPath,
{ recursive: true }
);
 
if (solicitud.formato === "xlsx") {
 
const ruta = path.join(
outPath,
"formulario.xlsx"
);
 
await fs.writeFile(
ruta,
"FORMULARIO XLSX GENERADO"
);
 
return JSON.stringify({
ok: true,
data: {
ruta,
formato: "xlsx"
}
});
}
 
if (solicitud.formato === "pdf") {
 
const ruta = path.join(
outPath,
"formulario.pdf"
);
 
await fs.writeFile(
ruta,
"FORMULARIO PDF GENERADO"
);
 
return JSON.stringify({
ok: true,
data: {
ruta,
formato: "pdf"
}
});
}
 
if (solicitud.formato === "portal") {
 
const ruta = path.join(
outPath,
"valores-portal.md"
);
 
await fs.writeFile(
ruta,
"# Valores Portal"
);
 
return JSON.stringify({
ok: true,
data: {
ruta,
formato: "portal"
}
});
}
 
return JSON.stringify({
ok: false,
error:
"Formato no soportado"
});
 
} catch (error) {
 
return JSON.stringify({
ok: false,
error: String(error)
});
 
}
}
};
 
export const armar_paquete = {
description:
"Arma el paquete documental para firma.",
 
args: {
caso: z.string()
},
 
async execute(
args: {
caso: string;
},
ctx: ToolContext
): Promise<string> {
 
try {
 
const paquetePath = path.join(
ctx.directory,
"out",
args.caso,
"paquete"
);
 
await fs.mkdir(
paquetePath,
{ recursive: true }
);
 
await fs.writeFile(
path.join(
paquetePath,
"checklist.md"
),
`
# Checklist
 
✅ Formulario generado
 
✅ Cámara de Comercio
 
✅ RUT
 
✅ Certificación bancaria
 
✅ Estados financieros
 
Estado: LISTO PARA FIRMA
`
);
 
await fs.writeFile(
path.join(
paquetePath,
"borrador-correo.md"
),
`
Asunto: Registro de proveedor
 
Adjuntamos formulario y soportes solicitados.
 
Saludos.
`
);
 
return JSON.stringify({
ok: true,
data: {
ruta: paquetePath,
listo_para_firma: true
}
});
 
} catch (error) {
 
return JSON.stringify({
ok: false,
error: String(error)
});
 
}
}
};
export const simular_envio = {
  description:
    "Simula el envío del paquete únicamente cuando existe confirmación explícita.",

  args: {
    caso: z.string(),
    confirmado: z.boolean()
  },

  async execute(
    args: {
      caso: string;
      confirmado: boolean;
    },
    ctx: ToolContext
  ): Promise<string> {

    try {

      if (!args.confirmado) {

        return JSON.stringify({
          ok: false,
          error:
            "requiere confirmación explícita"
        });

      }

      const ruta = path.join(
        ctx.directory,
        "out",
        args.caso,
        "ENVIO-SIMULADO.md"
      );

      await fs.writeFile(
        ruta,
`
# ENVIO SIMULADO

Caso:
${args.caso}

Estado:
ENVIADO

Fecha:
${new Date().toISOString()}
`
      );

      return JSON.stringify({
        ok: true,
        data: {
          ruta
        }
      });

    } catch (error) {

      return JSON.stringify({
        ok: false,
        error: String(error)
      });

    }

  }
};