import fs from "fs/promises";
import path from "path";
import { z } from "zod";

type ToolContext = {
  directory: string;
  sessionId: string;
};

export const leer_solicitud = {
  description:
    "Lee una solicitud de registro y devuelve los campos, soportes y formato solicitados.",

  args: {
    caso: z
      .string()
      .describe(
        "Nombre de la carpeta del caso dentro de fixtures/reto-01/casos"
      ),
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
          path.join(casoPath, "solicitud.json"),
          "utf-8"
        )
      );

      const soportes = JSON.parse(
        await fs.readFile(
          path.join(
            casoPath,
            "soportes-exigidos.json"
          ),
          "utf-8"
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
            "utf-8"
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
            "utf-8"
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
          soportes,
        },
      });
    } catch (error) {
      return JSON.stringify({
        ok: false,
        error:
          "No fue posible leer la solicitud",
      });
    }
  },
};