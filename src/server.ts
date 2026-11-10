import express from "express";
import cors from "cors";

import {
  leer_solicitud,
  mapear_campos,
  generar_formulario,
  armar_paquete
} from "./tools/proveedor";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "Backend Registro Proveedor funcionando"
  );
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    provider: "local",
    model: "workflow"
  });
});

app.post(
  "/api/chat",
  async (req, res) => {

    try {

      const {
        sessionId,
        message
      } = req.body;

      const caso =
        message.trim();

      const solicitud =
        JSON.parse(
          await leer_solicitud.execute(
            {
              caso
            },
            {
              directory:
                process.cwd(),
              sessionId
            }
          )
        );

      if (!solicitud.ok) {

        return res.json({
          reply:
            "❌ No fue posible leer la solicitud.",
          toolCalls: [],
          needsConfirmation:
            false
        });

      }

      const mapeo =
        JSON.parse(
          await mapear_campos.execute(
            {
              caso,
              campos:
                solicitud.data.campos
            },
            {
              directory:
                process.cwd(),
              sessionId
            }
          )
        );

      const formulario =
        JSON.parse(
          await generar_formulario.execute(
            {
              caso
            },
            {
              directory:
                process.cwd(),
              sessionId
            }
          )
        );

      const paquete =
        JSON.parse(
          await armar_paquete.execute(
            {
              caso
            },
            {
              directory:
                process.cwd(),
              sessionId
            }
          )
        );

      res.json({

        reply:
`📋 Cliente: ${solicitud.data.cliente}

🌎 País: ${solicitud.data.pais}

📄 Formato: ${solicitud.data.formato}

✅ Campos llenos: ${mapeo.data.llenos.length}

⚠️ Campos faltantes: ${mapeo.data.faltantes.length}

📁 Formulario generado correctamente

📦 Paquete documental generado

✅ Listo para firma: ${paquete.data.listo_para_firma}
`,

        toolCalls: [
          "leer_solicitud",
          "mapear_campos",
          "generar_formulario",
          "armar_paquete"
        ],

        needsConfirmation:
          false

      });

    } catch (error) {

      res.json({
        reply:
          `❌ Error: ${String(error)}`,
        toolCalls: [],
        needsConfirmation:
          false
      });

    }

  }
);

app.get(
  "/api/sessions/:id",
  (req, res) => {

    res.json({
      sessionId:
        req.params.id,
      history: []
    });

  }
);

const PORT =
  Number(
    process.env.PORT
  ) || 3000;

app.listen(
  PORT,
  () => {

    console.log(
      `Servidor iniciado en puerto ${PORT}`
    );

  }
);