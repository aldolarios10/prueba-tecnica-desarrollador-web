# Ejercicio 1.

def invertir_cadena_texto():
    cadena = input("Ingresa un texto: ")
    resultado = ""
    palabra = ""

    for letra in cadena:
        if letra != " ":
            palabra =  letra + palabra
        else:
            resultado += palabra + " "
            palabra = ""

    resultado += palabra 

    return resultado 

print(invertir_cadena_texto())