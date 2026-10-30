// ===== DATOS DE EJEMPLO =====
// Más adelante estos datos vendrán de Firebase.

export const CATEGORIAS = [
  'Analgésicos',
  'Antibióticos',
  'Antigripales',
  'Vitaminas',
  'Cuidado personal',
];

export const PRODUCTOS = [
  {
    id: 1,
    nombre: 'Paracetamol 500 mg',
    categoria: 'Analgésicos',
    precio: 45,
    cantidad: 40,
    descripcion: 'Caja con 20 tabletas. Ayuda a bajar la fiebre y quitar el dolor leve o moderado.',
    imagen: '/img/productos/paracetamol.svg',
  },
  {
    id: 2,
    nombre: 'Ibuprofeno 400 mg',
    categoria: 'Analgésicos',
    precio: 62,
    cantidad: 8,
    descripcion: 'Caja con 10 tabletas. Desinflamatorio para dolores musculares y de cabeza.',
    imagen: '/img/productos/ibuprofeno.svg',
  },
  {
    id: 3,
    nombre: 'Amoxicilina 500 mg',
    categoria: 'Antibióticos',
    precio: 120,
    cantidad: 15,
    descripcion: 'Caja con 12 cápsulas. Antibiótico. Se vende solo con receta médica.',
    imagen: '/img/productos/amoxicilina.svg',
  },
  {
    id: 4,
    nombre: 'Loratadina 10 mg',
    categoria: 'Antigripales',
    precio: 58,
    cantidad: 25,
    descripcion: 'Caja con 10 tabletas. Ayuda contra la alergia, estornudos y comezón.',
    imagen: '/img/productos/loratadina.svg',
  },
];
