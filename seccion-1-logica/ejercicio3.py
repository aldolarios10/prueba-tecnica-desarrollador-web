# Ejercicio 3.

def pares_numeros_primos_gemelos():
    rango = input("Ingresa un rango: ").split(",")
    primos = []
    resultado = []

    for numero in range(int(rango[0]), int(rango[1]) + 1):
        if numero > 1:
            es_primo = True
            for i in range(2, int(numero ** 0.5) + 1):
                if numero % i == 0:
                    es_primo = False
                    break
            if es_primo:
                primos.append(numero)

    for primo in primos:
        if primo + 2 in primos:
            resultado.append((primo, primo + 2))

    return resultado

resultado = pares_numeros_primos_gemelos()
print(resultado if resultado else 0)
