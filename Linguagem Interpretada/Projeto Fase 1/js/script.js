const form = document.querySelector("#form");
const descricaoCompletaInput = document.querySelector("#descricaoCompleta");
const embalagemSelect = document.querySelector("#embalagem");
const mercadologicoSelect = document.querySelector("#mercadologico");
const compradorSelect = document.querySelector("#comprador");
const codigoDeBarraInput = document.querySelector("#codigoDeBarra");
const quantidadeInput = document.querySelector("#quantidade");
const validadeInput = document.querySelector("#validade");
const fornecedorInput = document.querySelector("#fornecedor");
const custoInput = document.querySelector("#custo");
const precoInput = document.querySelector("#preco");

form.addEventListener("submit", (event) => {    
    event.preventDefault();

    //  Validade a Descricao
    if(descricaoCompletaInput.value === ""){
        alert("Preencha a descrição completa!");
        return;
    }

    // Valida a embalagem
    if(embalagemSelect.value === ""){
        alert("Selecione a embalagem!");
        return;
    }

    // Valida o mercadológico
    if(mercadologicoSelect.value === ""){
        alert("Selecione o mercadológico!");
        return;
    }

    // Valida o comprador
    if(compradorSelect.value === ""){
        alert("Selecione o comprador!");
        return;
    }

    // Valida o código de barras
    const codigo = codigoDeBarraInput.value.trim();
    
    if(codigoDeBarraInput.value === ""){
        alert("Preencha o código de barras!");
        return;
    }

    if(codigoDeBarraInput.value.length <= 8){
        alert("Codigo de barra teve ter 8 digitos!");
        return
    }

    // Valida a quantidade
    if(quantidadeInput.value === ""){
        alert("Preencha a quantidade!");
        return;
    }

    // Valida a validade do produto
    if(validadeInput.value === ""){
        alert("Preencha a validade!");
        return;
    }

    const hoje = new Date();
    const validade = new Date(validadeInput.value);

        // Remove hora para comparar so data
    hoje.setHours(0, 0, 0, 0);

    if(validade < hoje) {
        alert("A validade deve ser maior que a data atual!");
        return;
    }

    // Valida o fornecedor
    if(fornecedorInput.value === ""){
        alert("Preencha o fornecedor!");
        return;
    }

    // Valida o custo
    if(custoInput.value === ""){
        alert("Preencha o custo!");
        return;
    }

    //  Valida o preço
    if(precoInput.value === ""){
        alert("Preencha o preço!");
        return;
    }

    // Se tudo estiver preenchido
    alert("Produto cadastrado com sucesso!");
    form.reset();

});

