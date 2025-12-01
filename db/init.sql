-- init.sql: se ejecuta la primera vez que se crea el contenedor postgres

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE,
  limite_gastos DECIMAL(12,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS gastos (
  id SERIAL PRIMARY KEY,
  descripcion VARCHAR(200),
  monto DECIMAL(12,2) NOT NULL,
  fecha DATE NOT NULL,
  categoria VARCHAR(50),
  id_usuario INTEGER REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ingresos (
  id SERIAL PRIMARY KEY,
  descripcion VARCHAR(200),
  fecha DATE NOT NULL,
  monto DECIMAL(12,2) NOT NULL,
  id_usuario INTEGER REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS pagos_recurrentes (
  id SERIAL PRIMARY KEY,
  descripcion VARCHAR(200),
  frecuencia_pago VARCHAR(20), -- 'mensual','semanal','anual'
  monto DECIMAL(12,2),
  proximo_pago DATE,
  id_usuario INTEGER REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Datos de ejemplo
INSERT INTO usuarios (nombre, email, limite_gastos) VALUES
('Hector', 'hector@example.com', 5000),
('Juan', 'juan@example.com', 2000)
ON CONFLICT DO NOTHING;

INSERT INTO ingresos (descripcion, fecha, monto, id_usuario) VALUES
('Pago nómina', '2025-11-01', 12000, 1),
('Venta', '2025-11-05', 1500, 2)
ON CONFLICT DO NOTHING;

INSERT INTO gastos (descripcion, fecha, monto, categoria, id_usuario) VALUES
('Supermercado', '2025-11-02', 800, 'Alimentos', 1),
('Internet', '2025-11-03', 400, 'Servicios', 1)
ON CONFLICT DO NOTHING;

INSERT INTO pagos_recurrentes (descripcion, frecuencia_pago, monto, proximo_pago, id_usuario) VALUES
('Gym', 'mensual', 300, '2025-12-01', 1)
ON CONFLICT DO NOTHING;
