CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
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

-- índice para consultas por usuario
CREATE INDEX idx_gastos_usuario ON gastos(id_usuario);

CREATE TABLE IF NOT EXISTS ingresos (
  id SERIAL PRIMARY KEY,
  descripcion VARCHAR(200),
  fecha DATE NOT NULL,
  monto DECIMAL(12,2) NOT NULL,
  id_usuario INTEGER REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE INDEX idx_ingresos_usuario ON ingresos(id_usuario);

CREATE TABLE IF NOT EXISTS pagos_recurrentes (
  id SERIAL PRIMARY KEY,
  descripcion VARCHAR(200),
  frecuencia_pago VARCHAR(20)
      CHECK (frecuencia_pago IN ('mensual','semanal','anual')),
  monto DECIMAL(12,2),
  proximo_pago DATE,
  id_usuario INTEGER REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contraseñas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
