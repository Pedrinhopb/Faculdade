// Tag

var titulo = document.getElementsByTagName("h1")[0];
console.log(titulo);

var lis = document.getElementsByTagName("li");
console.log(lis[3]);

// Id

var paragrafo = document.getElementById('paragrafo');
console.log(paragrafo);

// Class

var itensDaLista = document.getElementsByClassName('item');
console.log(itensDaLista);

// Selecionar elemento
var title = document.querySelector("#title");

// InnerHTML
title.innerHTML = "Testando o texto alterado!";

// textContent -> mais utilizado, recomendado e performatico
var subtitle = document.querySelector(".subtitle");

console.log(subtitle);

subtitle.textContent = "Testando o textContent";