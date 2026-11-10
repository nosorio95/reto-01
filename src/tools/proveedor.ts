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

      if (solicitud.formato === "portal") {

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