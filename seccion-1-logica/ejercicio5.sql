-- Ejercicio 5: libros que Sonia tiene prestados, no ha devuelto
-- y cuyo préstamo está vencido al 30/07/2021.
SELECT libro.nombre,
       prestamo.fecha_prestamo,
       libro.dias_limite_prestamo
FROM prestamo
JOIN alumno ON alumno.id = prestamo.id_alumno
JOIN libro  ON libro.id  = prestamo.id_libro
WHERE alumno.nombres = 'Sonia'
  AND prestamo.entregado = 0
  AND date(prestamo.fecha_prestamo, '+' || libro.dias_limite_prestamo || ' days') < '2021-07-30';
