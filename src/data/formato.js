// ===== FUNCIONES DE FORMATO - Juan =====

// 45 -> "$45.00"
export function precio(numero) {
  return '$' + Number(numero).toFixed(2);
}

// Días que faltan para una fecha AAAA-MM-DD (negativo si ya pasó)
export function diasPara(fecha) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const limite = new Date(fecha + 'T00:00:00');
  return Math.round((limite - hoy) / 86400000);
}

// "2027-08-15" -> "15 ago 2027"
export function fechaCorta(fecha) {
  if (!fecha) return '—';
  return new Date(fecha + 'T00:00:00').toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Texto de existencia según las piezas
export function estadoExistencia(cantidad) {
  if (cantidad === 0) return { texto: 'Agotado', alerta: true };
  if (cantidad < 10) return { texto: `Quedan ${cantidad} piezas`, alerta: true };
  return { texto: `${cantidad} piezas en tienda`, alerta: false };
}
