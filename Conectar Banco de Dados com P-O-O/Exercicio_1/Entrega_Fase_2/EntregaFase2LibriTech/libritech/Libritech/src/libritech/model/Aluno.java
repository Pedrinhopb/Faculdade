package libritech.model;

/** Herança: Aluno herda de Usuario. Prazo padrão = 7 dias. */
public class Aluno extends Usuario {

    private String matricula;

    public Aluno() {}

    public Aluno(int idUsuario, String nome, String cpf,
                 String email, String senha) {
        super(idUsuario, nome, cpf, email, senha, "ALUNO");
    }

    /** Polimorfismo: aluno tem prazo de 7 dias. */
    @Override
    public int getDiasPrazoEmprestimo() {
        return 7;
    }

    public String getMatricula() { return matricula; }
    public void setMatricula(String matricula) { this.matricula = matricula; }
}