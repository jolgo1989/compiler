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

    // Mostrar el analisis lexico en el div
    tokens.forEach(token => {
        const tokenElement = document.createElement('div');
        tokenElement.textContent = `${token.tipo}: ${token.valor}`;
        output.appendChild(tokenElement);
    });

    // Mostrar análisis sintáctico
    let ast = analisisSintactico(tokens);
    const resultado = JSON.stringify(ast, null, 2);
    document.getElementById("outputSintactico2").textContent = resultado;

    // Mostrar análisis semántico
    let simbolos = analisisSemantico(ast);
    const resultado2 = document.getElementById("semantico");
    resultado2.textContent = simbolos;
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
            tokens.push({ tipo: 'Palabra reservada', valor: palabra });
        }
        // Comprobar si la palabra es un identificador válido
        else if (/^[a-zA-Z][a-zA-Z0-9_]*$/.test(palabra)) {
            tokens.push({ tipo: 'identificador', valor: palabra });
        }
        // Comprobar si la palabra es un número válido
        else if (/^\d+(\.\d+)?$/.test(palabra)) {
            tokens.push({ tipo: 'numero', valor: palabra });
        }
        // Comprobar si la palabra es un operador válido
        else if (/^[\+\-\*\/=]$/.test(palabra)) {
            tokens.push({ tipo: 'operador', valor: palabra });
        }
        // Comprobar si la palabra es un delimitador válido
        else if (/^[\(\)\{\}\[\]\;]$/.test(palabra)) {
            tokens.push({ tipo: 'delimitador', valor: palabra });
        }
        // Si la palabra no coincide con ningún patrón conocido, se marca como desconocida
        else {
            tokens.push({ tipo: 'Desconocido', valor: palabra });
        }
    });
    debugPrint(`Se ha completado la fase de análisis léxico`);
    return tokens;
}

const analisisSintactico = (tokens) => {
    let current = 0;

    const walk = () => {
        let token = tokens[current];

        if (token.tipo === 'Palabra reservada' && token.valor === 'let') {
            current++;
            let nameToken = tokens[current];
            current++;
            let equalsToken = tokens[current];
            if (equalsToken.tipo !== 'operador' || equalsToken.valor !== '=') {
                throw new TypeError('Se esperaba un operador "=" después del identificador');
            }
            current++;
            let valueToken = tokens[current];
            current++;
            let semicolonToken = tokens[current];
            if (semicolonToken.tipo !== 'delimitador' || semicolonToken.valor !== ';') {
                throw new TypeError('Se esperaba un delimitador ";" al final de la declaración');
            }
            current++;
            return {
                type: 'DeclaracionVariable',
                name: nameToken.valor,
                value: {
                    type: valueToken.tipo === 'numero' ? 'LiteralNumerico' : 'ExpresionIdentificador',
                    value: valueToken.valor
                }
            };
        }

        if (token.tipo === 'numero') {
            current++;
            return {
                type: 'LiteralNumerico',
                value: token.valor
            };
        }

        if (token.tipo === 'identificador') {
            current++;
            return {
                type: 'ExpresionIdentificador',
                name: token.valor
            };
        }

        if (token.tipo === 'operador') {
            current++;
            return {
                type: 'ExpresionOperacion',
                name: token.valor
            };
        }

        if (token.tipo === 'delimitador') {
            current++;
            return {
                type: 'Delimitador',
                name: token.valor
            };
        }

        throw new TypeError('Tipo de nodo inesperado: ' + token.tipo);
    }

    let ast = {
        type: 'Program',
        body: []
    };

    while (current < tokens.length) {
        ast.body.push(walk());
    }

    debugPrint(`Se ha completado la fase de análisis sintáctico`);
    return ast;
}

/**
 * Función que realiza el análisis semántico de un árbol de sintaxis abstracta (AST).
 * Verifica la declaración y uso de variables en el AST.
 *
 * @param {Object} ast - El árbol de sintaxis abstracta a analizar.
 * @returns {string} - Mensaje indicando que el análisis semántico se ha completado.
 * @throws {Error} - Si una variable es declarada más de una vez o si se usa una variable no declarada.
 */
const analisisSemantico = (ast) => {
    // Objeto para rastrear las variables declaradas
    const variablesDeclaradas = {};
    // Primero, pasamos por las declaraciones de variables en el AST
    ast.body.forEach((node) => {
        if (node.type === "DeclaracionVariable") {
            // Si la variable ya fue declarada, lanzamos un error
            if (variablesDeclaradas[node.name]) {
                throw new Error(`La variable ${node.name} ya ha sido declarada`);
            }
            // Marcamos la variable como declarada
            variablesDeclaradas[node.name] = true;
        }
    });

    // Función recursiva para recorrer y validar el AST
    const traverse = (node) => {
        if (node.type === "DeclaracionVariable") {
            // Recorremos el valor de la variable declarada
            traverse(node.value);
        } else if (node.type === "ExpresionIdentificador") {
            // Si se encuentra un identificador, verificamos que haya sido declarado
            if (!variablesDeclaradas[node.name]) {
                throw new Error(`La variable ${node.name} no ha sido declarada`);
            }
        } else if (node.type === "LiteralNumerico") {
            // Los literales numéricos son válidos, no se necesita acción
        } else {
            // Si se encuentra un tipo de nodo inesperado, lanzamos un error de tipo
            throw new TypeError(`Tipo de nodo inesperado: ${node.type}`);
        }
    }

    // Recorremos el AST nuevamente para validar el uso de las variables
    ast.body.forEach(traverse);

    // Imprimimos un mensaje de depuración indicando que el análisis se ha completado
    debugPrint(`Se ha completado la fase de análisis semántico`);

    return "Análisis semántico completado";
}

/**
 * Función auxiliar para imprimir mensajes de depuración en el DOM.
 *
 * @param {string} message - El mensaje a imprimir.
 */
const debugPrint = (message) => {
    const validacionesElement = document.getElementById("outputSemantico2");
    const newMessageElement = document.createElement('p');
    newMessageElement.innerText = message;
    validacionesElement.appendChild(newMessageElement);
}
