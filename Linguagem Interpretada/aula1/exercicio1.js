const n1 = 5;
const n2 = 8;
const n3 = 10;

const media = (n1 + n2 + n3) / 3;

if (media >= 7) {
    console.log("Aluno aprovado com média " + media);
} else if (media < 7 && media >= 5) {
    console.log("Aluno em recuperação com média " + media);
} else {
    console.log("Aluno reprovado com média " + media);
}