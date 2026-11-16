# Ejercicio 2

def pares_unicos():
    lista = input("Ingresa una lista: ").split(",")
    pares = []

    for numero in lista:
        if int(numero) % 2 == 0 and int(numero) not in pares:
            pares.append(int(numero))
    return pares

print(pares_unicos())