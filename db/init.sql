-- IMPORTANTE: Si quieres reiniciar todo desde cero, descomenta las siguientes líneas:
-- DROP TABLE IF EXISTS Pagos_Recurrentes;
-- DROP TABLE IF EXISTS Gastos;
-- DROP TABLE IF EXISTS Ingresos;
-- DROP TABLE IF EXISTS Presupuestos;
-- DROP TABLE IF EXISTS Categorias;
-- DROP TABLE IF EXISTS Cuentas;
-- DROP TABLE IF EXISTS Usuarios;

-- 1. Tabla de USUARIOS
CREATE TABLE IF NOT EXISTS Usuarios (
    id_usuario SERIAL PRIMARY KEY, -- 'SERIAL' reemplaza a AUTO_INCREMENT
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    limite_gastos_global DECIMAL(10, 2) DEFAULT 0.00,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de CUENTAS
CREATE TABLE IF NOT EXISTS Cuentas (
    id_cuenta SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    tipo VARCHAR(30),
    saldo_inicial DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);

-- 3. Tabla de CATEGORIAS
CREATE TABLE IF NOT EXISTS Categorias (
    id_categoria SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    -- En Postgres usamos CHECK para validar opciones fijas en lugar de ENUM para simplificar
    tipo VARCHAR(20) CHECK (tipo IN ('Ingreso', 'Gasto')) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);

-- 4. Tabla de PRESUPUESTOS
CREATE TABLE IF NOT EXISTS Presupuestos (
    id_presupuesto SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_categoria INT NOT NULL,
    monto_limite DECIMAL(10, 2) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria) ON DELETE CASCADE
);

-- 5. Tabla de INGRESOS
CREATE TABLE IF NOT EXISTS Ingresos (
    id_ingreso SERIAL PRIMARY KEY,
    id_cuenta INT NOT NULL,
    id_categoria INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    FOREIGN KEY (id_cuenta) REFERENCES Cuentas(id_cuenta) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria) ON DELETE RESTRICT
);

-- 6. Tabla de GASTOS
CREATE TABLE IF NOT EXISTS Gastos (
    id_gasto SERIAL PRIMARY KEY,
    id_cuenta INT NOT NULL,
    id_categoria INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    FOREIGN KEY (id_cuenta) REFERENCES Cuentas(id_cuenta) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria) ON DELETE RESTRICT
);

-- 7. Tabla de PAGOS RECURRENTES
CREATE TABLE IF NOT EXISTS Pagos_Recurrentes (
    id_pago_recurrente SERIAL PRIMARY KEY,
    id_cuenta INT NOT NULL,
    id_categoria INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    descripcion VARCHAR(255),
    frecuencia_pago VARCHAR(50),
    fecha_inicio DATE NOT NULL,
    proxima_fecha_pago DATE,
    FOREIGN KEY (id_cuenta) REFERENCES Cuentas(id_cuenta) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria) ON DELETE RESTRICT
);

-- Datos de ejemplo iniciales (Opcional)
INSERT INTO Usuarios (nombre, email, password, limite_gastos_global) VALUES
('Usuario Demo', 'demo@example.com', '123456', 5000)
ON CONFLICT DO NOTHING;
