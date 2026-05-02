# ADR 0004: Simplificación de la Comunicación y Estados del Servicio

* **Estado:** ✅ Aceptado

## Contexto
Se debe decidir el método de interacción entre usuarios.

## Decisión
Se **descarta** el chat interno en tiempo real. El contacto se realiza de forma externa (datos en la publicación) y el estado del servicio se maneja mediante el flujo de la interfaz.

## Justificación
* **Reducción de Complejidad:** Evita el desarrollo de WebSockets para el MVP.
* **Eficacia:** El uso de botones ("Lo tomé" -> "Finalizar") transforma la coordinación en simples actualizaciones de base de datos.
