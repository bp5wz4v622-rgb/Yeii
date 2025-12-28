-- Este archivo define las tablas de la base de datos
-- Tabla para las noticias del periódico
CREATE TABLE IF NOT EXISTS noticias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  contenido TEXT NOT NULL,
  autor TEXT NOT NULL,
  fecha TEXT NOT NULL
);

-- Tabla para los reportes de la comunidad
CREATE TABLE IF NOT EXISTS reportes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mensaje TEXT NOT NULL,
  imagen_url TEXT,
  fecha TEXT NOT NULL
);

