package libritech.model;

/** Herança: Funcionario herda de Usuario. Prazo padrão = 14 dias. */
public class Funcionario extends Usuario {

    private String cargo;

    public Funcionario() {}

    public Funcionario(int idUsuario, String nome, String cpf,
                       String email, String senha, String tipo) {
        super(idUsuario, nome, cpf, email, senha, tipo);
        this.cargo = tipo;
    }

    /** Polimorfismo: funcionário tem prazo de 14 dias. */
    @Override
    public int getDiasPrazoEmprestimo() {
        return 14;
    }

    public String getCargo() { return cargo; }
    public void setCargo(String cargo) { this.cargo = cargo; }
}