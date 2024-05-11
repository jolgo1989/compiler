// Obtener el botón de análisis del DOM
const Button = document.getElementById("buttonAnalizar");

// Agregar un event listener para el click del botón
Button.addEventListener("click", () => {
    // Obtener el valor del código de entrada del usuario
    const inputCode = document.getElementById('inputCode').value;

    // Llamar a la función analizadorLexico para obtener los tokens del código de entrada
    const tokens = analizadorLexico(inputCode);


    // Obtener el elemento de salida del DOM
    const output = document.getElementById('outputLexico');

    // Limpiar el contenido anterior del elemento de salida
    output.innerHTML = '';

    //? Mostrar el analisis lexico en el div
    // Iterar sobre cada token y agregarlo como un nuevo elemento div al elemento de salida
    tokens.forEach(token => {
        const tokenElement = document.createElement('div');
        tokenElement.textContent = `${token.tipo}: ${token.valor}`;
        output.appendChild(tokenElement);
    });


    //? Mostrar el analisis Sintactico en el div
    // Llamar al analizador sintáctico con los tokens obtenidos del análisis léxico
    const sintacticoResultado = document.getElementById('outputSintactico');
    sintacticoResultado.innerHTML = ''; // Limpiar el contenido anterior

    try {
        // Llamar al analizador sintáctico y mostrar el resultado
        analizadorSintactico(tokens);
        sintacticoResultado.textContent = 'Análisis sintáctico completado sin errores';
    } catch (error) {
        sintacticoResultado.textContent = `Error en el análisis sintáctico: ${error.message}`;
    }




    // Llamar al analizador sintáctico con los tokens obtenidos del análisis léxico
    analizadorSintactico(tokens);
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
            tokens.push({ tipo: 'Palabra Reservada', valor: palabra }); //Array de objetos
        }
        // Comprobar si la palabra es un identificador válido
        else if (/^[a-zA-Z][a-zA-Z0-9_]*$/.test(palabra)) {//? expresión regular para validar un identificador
            tokens.push({ tipo: 'Identificador', valor: palabra });
        }
        // Comprobar si la palabra es un número válido
        else if (/^\d+(\.\d+)?$/.test(palabra)) {//? expresión regular para validar un número es
            tokens.push({ tipo: 'Número', valor: palabra });
        }
        // Comprobar si la palabra es un operador válido
        else if (/^[\+\-\*\/=]$/.test(palabra)) {//? expresión regular para validar un operador
            tokens.push({ tipo: 'Operador', valor: palabra });
        }
        // Comprobar si la palabra es un delimitador válido
        else if (/^[\(\)\{\}\[\]\;]$/.test(palabra)) {//? expresión regular para validar un delimitador
            tokens.push({ tipo: 'Delimitador', valor: palabra });
        }
        // Si la palabra no coincide con ningún patrón conocido, se marca como desconocida
        else {
            tokens.push({ tipo: 'Desconocido', valor: palabra });
        }
    });

    return tokens;
}


const analizadorSintactico = (tokens) => {
    let index = 0;

    // Función para obtener el siguiente token
    const obtenerSiguienteToken = () => {
        index++;
        return tokens[index];
    };

    // Función para verificar si hay un token específico
    const verificarToken = (tipo) => {
        return tokens[index].tipo === tipo;
    };

    // Función para el análisis sintáctico de la expresión if
    const analizarIf = () => {
        // Verificar que el token actual sea la palabra reservada 'if'
        if (!verificarToken('Palabra Reservada') || tokens[index].valor !== 'if') {
            throw new Error('Se esperaba la palabra reservada "if"');
        }
        obtenerSiguienteToken(); // Avanzar al siguiente token
        // Verificar que el siguiente token sea un delimitador '('
        if (!verificarToken('Delimitador') || tokens[index].valor !== '(') {
            throw new Error('Se esperaba un delimitador "("');
        }
        obtenerSiguienteToken(); // Avanzar al siguiente token
        // Lógica para analizar la condición dentro del if...
        // Aquí puedes agregar tu lógica para analizar la condición dentro del if
        // Podrías usar una función recursiva para analizar expresiones más complejas
        // Verificar que el siguiente token sea un delimitador ')'
        if (!verificarToken('Delimitador') || tokens[index].valor !== ')') {
            throw new Error('Se esperaba un delimitador ")"');
        }
        obtenerSiguienteToken(); // Avanzar al siguiente token
        // Lógica para analizar el bloque de código dentro del if...
        // Aquí puedes agregar tu lógica para analizar el bloque de código dentro del if
    };

    // Función principal para iniciar el análisis sintáctico
    const iniciarAnalisisSintactico = () => {
        try {
            while (index < tokens.length) {
                if (verificarToken('Palabra Reservada') && tokens[index].valor === 'if') {
                    analizarIf(); // Analizar la expresión if
                }
                // Aquí podrías agregar más lógica para analizar otras estructuras de código
                else {
                    throw new Error('Token inesperado');
                }
            }
            console.log('Análisis sintáctico completado sin errores');
        } catch (error) {
            console.error('Error en el análisis sintáctico:', error.message);
        }
    };

    // Iniciar el análisis sintáctico
    iniciarAnalisisSintactico();
};





