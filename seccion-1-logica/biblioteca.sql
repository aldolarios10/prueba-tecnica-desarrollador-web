-- Ejercicio 5: base de datos de prueba

DROP TABLE IF EXISTS prestamo;
DROP TABLE IF EXISTS libro;
DROP TABLE IF EXISTS alumno;

CREATE TABLE alumno (
    id        INTEGER PRIMARY KEY,
    nombres   TEXT,
    apellidos TEXT,
    carrera   TEXT
);

CREATE TABLE libro (
    id                   INTEGER PRIMARY KEY,
    nombre               TEXT,
    editorial            TEXT,
    dias_limite_prestamo INTEGER
);

CREATE TABLE prestamo (
    id             INTEGER PRIMARY KEY,
    id_alumno      INTEGER REFERENCES alumno(id),
    id_libro       INTEGER REFERENCES libro(id),
    fecha_prestamo TEXT,     -- formato AAAA-MM-DD
    entregado      INTEGER   -- 0 = false, 1 = true
);

INSERT INTO alumno VALUES
    (1, 'Rosa',  'Torres', 'Sistemas'),
    (2, 'Angel', 'Perez',  'Electronica'),
    (3, 'Sonia', 'Ríos',   'Industrial');

INSERT INTO libro VALUES
    (1, 'Administración',   'Norma',      30),
    (2, 'Redes neuronales', 'Santillana', 30),
    (3, 'Estadistica',      'Regio',      10),
    (4, 'Desarrollo web',   'Limusa',     10);

INSERT INTO prestamo VALUES
    (1,  1, 1, '2021-07-23', 0),
    (2,  1, 2, '2021-07-22', 0),
    (3,  1, 3, '2021-06-15', 0),
    (4,  2, 1, '2021-07-12', 0),
    (5,  3, 1, '2021-07-28', 1),
    (6,  3, 2, '2021-07-16', 1),
    (7,  3, 3, '2021-07-28', 1),
    (8,  3, 4, '2021-05-10', 0),
    (9,  2, 2, '2021-07-28', 0),
    (10, 3, 2, '2021-04-05', 0);