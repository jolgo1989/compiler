//? Array
// const amigos = ['Alfonso', 'Allan', 'Monche']

// for (let i = 0; i <= amigos.length; i++) {
//     console.log(amigos[i])
// }

//Recorres cada elemto del array
// amigos.forEach((persona, index, array) => console.log(index, persona, array))

//? Objeto
// Utilizar for...in para recorrer objetos
// let person = {
//     nombre: 'Juan',
//     edad: 30,
//     profesion: 'Ingeniero'
// };

// for (property in person) {
//     console.log(property, person[property])
// }

//Es una forma directa y concisa de acceder a los valores de los elementos sin necesidad de usar un índice.
const amigos = ['Alfonso', 'Allan', 'Monche']

for (let property of amigos) {
    console.log(property)
}
