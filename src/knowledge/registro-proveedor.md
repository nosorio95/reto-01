# Registro como proveedor

Reglas tributarias:

- CO = NIT
- EC = RUC
- PA = RUC
- HN = RTN

Periferia solo dispone de NIT colombiano.

Reglas de negocio:

- Los soportes faltantes bloquean listo_para_firma.
- Los soportes vencidos bloquean listo_para_firma.
- Los campos faltantes no bloquean el proceso.
- Los datos bancarios solo se incluyen cuando son solicitados.
- Nunca se ejecutan acciones externas sin confirmacion humana.
- Toda llamada a herramienta debe quedar registrada.
