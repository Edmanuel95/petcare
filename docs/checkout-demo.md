# PetCare: recorrido de contratación de prueba

Desde un plan o el cotizador: datos ficticios del titular y del perro → checkout mensual/anual → formulario con tarjetas de prueba → aprobación o rechazo local → descarga de póliza → portal cliente con carnet QR. El ID de titular es distinto del folio; renovar genera otro folio. La vigencia termina en fecha exclusiva de Ciudad de México. Los precios son ejemplos y el anual equivale a doce mensualidades.

Esta landing no tiene una API desplegada. La vista previa guarda la última póliza en el almacenamiento de sesión; el QR contiene una referencia aleatoria, que solo se puede resolver donde exista esa misma sesión. El GPS y las fotos se mantienen en memoria. La vista veterinaria demuestra la decisión en/fuera de red con un convenio de prueba elegido para ese escenario. No hay verificación de identidad, vínculo real de clínica, pagos ni intercambio social.

## Siguiente integración con la API .NET y SQL Server

- Crear sesión de titular mediante correo verificado y emitir por SP en una transacción con idempotencia. Usar claves separadas para titular, perro, póliza y credencial. Validar precio, plan, vigencia, raza y color en servidor. Al aprobar, guardar el snapshot y generar póliza y carnet; entregar por rutas privadas.
- Hacer que un QR aleatorio apunte a una consulta veterinaria autenticada. Revelar identificación mínima y vigencia; determinar el convenio por clínica, servicio y fecha. Guardar aceptar/declinar con motivo y actor. La confirmación de una cita no implica autorización de cobertura.
- Usar otra autorización para compartir aventuras: enlace revocable y caducable, opt-in, sin ubicación de domicilio ni metadatos EXIF. La credencial veterinaria no autoriza ver rutas. Guardar fotos y tracks privados por titular y perro.
- Mantener un portal de empresa con dos secciones: Operaciones revisa casos y aplica reglas; Finanzas registra, concilia o revierte movimientos aprobados. Conservar permisos distintos y auditar cada paso.
- Web e iOS/Android consumen el mismo contrato de API. Primero ubicación en primer plano, con permiso explícito y cola local de sincronización; el seguimiento en segundo plano se diseña aparte para cada sistema operativo.
