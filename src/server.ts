    import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.get(
  "/api/health",
  (
    req,
    res
  ) => {

    res.json({
      ok: true,
      provider: "openai",
      model: "gpt-4o-mini"
    });

  }
);

app.post(
  "/api/chat",
  async (
    req,
    res
  ) => {

    res.json({
      reply:
        "Servidor funcionando",
      toolCalls: [],
      needsConfirmation:
        false
    });

  }
);

app.get(
  "/api/sessions/:id",
  (
    req,
    res
  ) => {

    res.json({
      sessionId:
        req.params.id,
      history: []
    });

  }
);

app.listen(
  3000,
  () => {

    console.log(
      "Servidor iniciado en puerto 3000"
    );

  }
);