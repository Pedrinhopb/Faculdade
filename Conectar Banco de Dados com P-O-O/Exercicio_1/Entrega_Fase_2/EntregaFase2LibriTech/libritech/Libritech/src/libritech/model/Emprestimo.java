package libritech.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

/** Encapsulamento: atributos private, acesso via getters/setters. */
public class Emprestimo {

    private int           idEmprestimo;
    private int           idUsuarioFk;
    private int           idLivroFk;
    private LocalDateTime dataSaida;
    private LocalDate     dataPrevista;
    private LocalDateTime dataDevolucao;  // null até devolução

    // nomes extras para exibição
    private String nomeUsuario;
    private String tituloLivro;

    public Emprestimo() {}

    // ── Getters / Setters ─────────────────────────────────────
    public int getIdEmprestimo() { return idEmprestimo; }
    public void setIdEmprestimo(int idEmprestimo) { this.idEmprestimo = idEmprestimo; }

    public int getIdUsuarioFk() { return idUsuarioFk; }
    public void setIdUsuarioFk(int idUsuarioFk) { this.idUsuarioFk = idUsuarioFk; }

    public int getIdLivroFk() { return idLivroFk; }
    public void setIdLivroFk(int idLivroFk) { this.idLivroFk = idLivroFk; }

    public LocalDateTime getDataSaida() { return dataSaida; }
    public void setDataSaida(LocalDateTime dataSaida) { this.dataSaida = dataSaida; }

    public LocalDate getDataPrevista() { return dataPrevista; }
    public void setDataPrevista(LocalDate dataPrevista) { this.dataPrevista = dataPrevista; }

    public LocalDateTime getDataDevolucao() { return dataDevolucao; }
    public void setDataDevolucao(LocalDateTime dataDevolucao) { this.dataDevolucao = dataDevolucao; }

    public String getNomeUsuario() { return nomeUsuario; }
    public void setNomeUsuario(String nomeUsuario) { this.nomeUsuario = nomeUsuario; }

    public String getTituloLivro() { return tituloLivro; }
    public void setTituloLivro(String tituloLivro) { this.tituloLivro = tituloLivro; }

    @Override
    public String toString() {
        return String.format(
            "Empréstimo #%d | Usuário: %s | Livro: %s | Saída: %s | Previsto: %s | Devolução: %s",
            idEmprestimo,
            nomeUsuario  != null ? nomeUsuario  : String.valueOf(idUsuarioFk),
            tituloLivro  != null ? tituloLivro  : String.valueOf(idLivroFk),
            dataSaida    != null ? dataSaida.toLocalDate() : "—",
            dataPrevista != null ? dataPrevista : "—",
            dataDevolucao != null ? dataDevolucao.toLocalDate() : "Pendente"
        );
    }
}