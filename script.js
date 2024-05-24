// Obtener el botón de análisis del DOM
const Button = document.getElementById("buttonAnalizar");

// Agregar un event listener para el click del botón
Button.addEventListener("click", () => {
    // Obtener el valor del código de entrada del usuario
    const inputCode = document.getElementById('inputCode').value;
    // Llamar a la función analizadorLexico para obtener los tokens del código de entrada
    const tokens = analizadorLexico(inputCode);

    // Obtener el elemento de salida del DOM
    const output = document.getElementById('outputLexico2');

    // Limpiar el contenido anterior del elemento de salida
    output.innerHTML = '';

    //? Mostrar el analisis lexico en el div
    // Iterar sobre cada token y agregarlo como un nuevo elemento div al elemento de salida
    tokens.forEach(token => {
        const tokenElement = document.createElement('div');
        tokenElement.textContent = `${token.tipo}: ${token.valor}`;
        output.appendChild(tokenElement);
    });

});



// Función que analiza léxicamente el código de entrada y devuelve una lista de tokens
const analizadorLexico = (input) => {
    const tokens = [];
    const palabrasReservadas = ['if', 'else', 'while', 'for', 'function', 'var', 'let', 'const'];

    // Separar la línea de código en tokens utilizando espacios como separadores
    const palabras = input.split(/\s+/);

    // Iterar sobre cada palabra en el código de entrada
    palabras.forEach(palabra => {
        // Comprobar si la palabra es una palabra reservada
        if (palabrasReservadas.includes(palabra)) {
            tokens.push({ tipo: 'Palabra reservada', valor: palabra }); //Array de objetos
        }
        // Comprobar si la palabra es un identificador válido
        else if (/^[a-zA-Z][a-zA-Z0-9_]*$/.test(palabra)) {//? expresión regular para validar un identificador
            tokens.push({ tipo: 'identificador', valor: palabra });
        }
        // Comprobar si la palabra es un número válido
        else if (/^\d+(\.\d+)?$/.test(palabra)) {//? expresión regular para validar un número es
            tokens.push({ tipo: 'numero', valor: palabra });
        }
        // Comprobar si la palabra es un operador válido
        else if (/^[\+\-\*\/=]$/.test(palabra)) {//? expresión regular para validar un operador
            tokens.push({ tipo: 'operador', valor: palabra });
        }
        // Comprobar si la palabra es un delimitador válido
        else if (/^[\(\)\{\}\[\]\;]$/.test(palabra)) {//? expresión regular para validar un delimitador
            tokens.push({ tipo: 'delimitador', valor: palabra });
        }
        // Si la palabra no coincide con ningún patrón conocido, se marca como desconocida
        else {
            tokens.push({ tipo: 'Desconocido', valor: palabra });
        }
    });

    return tokens;
}






