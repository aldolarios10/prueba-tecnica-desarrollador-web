# Ejercicio 5.

import sqlite3

conexion = sqlite3.connect("biblioteca.db")

consulta = """
    SELECT libro.nombre, prestamo.fecha_prestamo, libro.dias_limite_prestamo
    FROM prestamo
    JOIN alumno ON alumno.id = prestamo.id_alumno
    JOIN libro ON libro.id = prestamo.id_libro
    WHERE alumno.nombres = 'Sonia'
        AND prestamo.entregado = 0
        AND date(prestamo.fecha_prestamo, '+' || libro.dias_limite_prestamo || ' days') < '2021-07-30'
"""

for fila in conexion.execute(consulta):
    print(fila)

conexion.close()