# SOLUCION

## 1. Problema

Automatizar el registro de Periferia como proveedor utilizando informacion corporativa reutilizable.

## 2. Arquitectura

Frontend
Backend Express
Herramientas
Fixtures
Out

Prompt en agent/prompt.md
Conocimiento en src/knowledge/registro-proveedor.md
Ejecucion en src/tools/proveedor.ts

## 3. Ciclo del agente

leer_solicitud
mapear_campos
generar_formulario
armar_paquete
simular_envio

## 4. Modelo seleccionado

GPT-4o-mini.

## 5. Portal Web

Se generan valores para copiar y pegar.
El usuario ingresa credenciales y realiza el envio.

## 6. Trade-offs

Uso de glosario frente a matching semantico.

## 7. Supuestos

Maestro actualizado.
Soportes vigentes.

## 8. Cobertura

HU-1 Hecho
HU-2 Hecho
HU-3 Hecho
HU-4 Hecho
HU-5 Hecho

## 9. Uso de IA

Microsoft Copilot para apoyo de implementacion.

## 10. Riesgos

Datos desactualizados.
Soportes vencidos.
Portales con MFA o CAPTCHA.
