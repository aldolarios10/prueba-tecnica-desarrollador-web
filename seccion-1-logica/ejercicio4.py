# Ejercicio 4.

def combinacion_suma_objetivo(arreglo, objetivo):
    
    if objetivo == 0:
        return True
    if len(arreglo) == 0:
        return False

    primero = arreglo[0]
    resto = arreglo[1:]

    usando_primero = combinacion_suma_objetivo(resto, objetivo - primero)
    sin_primero = combinacion_suma_objetivo(resto, objetivo)

    return usando_primero or sin_primero

arreglo = input("Ingresa un arreglo de enteros separados por comas: ").split(",")
arreglo = [int(num) for num in arreglo] 
objetivo = int(input("Ingresa un numero objetivo: "))

print(combinacion_suma_objetivo(arreglo, objetivo))