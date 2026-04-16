// Var : declara uma variavel podendo atribuir um valor a ela posteriormente
var umNumero;
var umNumero = 10;

// Let : declara uma variavel com espoco de bloco
let outroNumero = 5;

// Const : declara uma variavel apenas de leitura
const ola = "Olá, mundo!"; 

// Operadores
let numero = 5;
let numero2 = 7;
let resultado = numero + numero2;

// Concatenacao
let ola1 = "ola";
let mundo = "mundo";
let olamundo = ola1 + mundo;

// Condicionais
let x = 1;
if (x == 1){
    //execute o codigo
}

if (nome == "Maria"){
    console.log("Acesso permitido");
} else {
    console.log("Acesso negado");
}

if (cidade == "Porto Alegre"){
    //codigo
} else if (cidade == "São Paulo"){
    //codigo
} else {
    //codigo    
}

// Exemplo simples de uso de if e else em JavaScript

//const numero = 10;

/*if (numero > 0) {
    console.log("O número é positivo.");
} else {
    console.log("O número não é positivo.");
}

// Outra forma com if/else if/else:
const nota = 75;
if (nota >= 90) {
    console.log("Conceito A");
} else if (nota >= 75) {
    console.log("Conceito B");
} else {
    console.log("Reprovado");
}*/

entrada = prompt("Digite um número:");
entrada = eval(entrada); 
console.log("O número digitado é: " + entrada);