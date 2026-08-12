package libritech.model;

/**
 * Superclasse abstrata — representa qualquer ator do sistema.
 * Encapsulamento: todos os atributos são private, acesso via getters/setters.
 * Polimorfismo: getDiasPrazoEmprestimo() é abstrato e implementado diferente em cada subclasse.
 */
public abstract class Usuario {

    private int    idUsuario;
    private String nome;
    private String cpf;
    private String email;
    private String senha;
    private String tipo;

    // ── Construtores ───────────────────────────────────────────
    public Usuario() {}

    public Usuario(int idUsuario, String nome, String cpf,
                   String email, String senha, String tipo) {
        this.idUsuario = idUsuario;
        setNome(nome);
        setCpf(cpf);
        setEmail(email);
        this.senha = senha;
        this.tipo  = tipo;
    }

    // ── Método polimórfico (abstrato) ──────────────────────────
    /** Cada subclasse define seu prazo padrão de empréstimo em dias. */
    public abstract int getDiasPrazoEmprestimo();

    // ── Getters e Setters com validação ───────────────────────
    public int getIdUsuario() { return idUsuario; }
    public void setIdUsuario(int idUsuario) { this.idUsuario = idUsuario; }

    public String getNome() { return nome; }
    public void setNome(String nome) {
        if (nome == null || nome.isBlank())
            throw new IllegalArgumentException("Nome não pode ser vazio.");
        this.nome = nome.trim();
    }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) {
        if (cpf == null || cpf.length() != 11)
            throw new IllegalArgumentException("CPF deve ter 11 dígitos.");
        this.cpf = cpf;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) {
        if (email == null || !email.contains("@"))
            throw new IllegalArgumentException("E-mail inválido.");
        this.email = email.trim();
    }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    @Override
    public String toString() {
        return "[" + tipo + "] " + nome + " (CPF: " + cpf + ")";
    }
}