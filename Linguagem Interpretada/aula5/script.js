const form = document.querySelector('form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const jobSelect = document.querySelector('#job');
const messageTextarea = document.querySelector('#message');

// evita que a pagina de refresh no form
form .addEventListener("submit", (event) => {
    event.preventDefault(); 

    //valida nome
    if(nameInput.value === ""){
        alert("Por favor, preencha seu nome")
        return;
    }

    //valida email
    if(emailInput.value === "" ){
        alert("Por favor, preencha seu email")
        return;
    }

    // Verifica se a senha esta preenchida
    if(!validatePassword(passwordInput.value, minDigits = 8)){
        alert("A senha precisar ser no minimo 8 digitos")
        return ; 
    }
    
    form.submit();
})

// Funcao que valida a senha
function validatePassword(password, minDigits) {
    if(password.lenght <= minDigits){
        //Senha valida
        return true;
    }

    //Senha invalida
    return false;
}