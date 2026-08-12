package libritech.dao;

import libritech.connection.Conexao;
import libritech.model.Emprestimo;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class EmprestimoDAO {

    /**
     * Chama sp_transacao_emprestimo — lida com estoque, pendências e empréstimo.
     *
     * @param prazoDias prazo de devolução em dias, calculado no Java via
     *                   polimorfismo (Usuario.getDiasPrazoEmprestimo()):
     *                   Aluno = 7 dias, Funcionario = 14 dias.
     */
    public void realizarEmprestimo(int idUsuario, int idLivro, int prazoDias) throws SQLException {
        String sql = "{CALL sp_transacao_emprestimo(?, ?, ?)}";
        try (CallableStatement cs = Conexao.getConnection().prepareCall(sql)) {
            cs.setInt(1, idUsuario);
            cs.setInt(2, idLivro);
            cs.setInt(3, prazoDias);
            cs.execute();
        }
    }

    /** Chama sp_renovar_emprestimo — nega se houver reserva. */
    public void renovarEmprestimo(int idEmprestimo) throws SQLException {
        String sql = "{CALL sp_renovar_emprestimo(?)}";
        try (CallableStatement cs = Conexao.getConnection().prepareCall(sql)) {
            cs.setInt(1, idEmprestimo);
            cs.execute();
        }
    }

    /** Chama sp_transacao_devolucao — registra devolução, multa e atualiza estoque. */
    public void realizarDevolucao(int idEmprestimo) throws SQLException {
        String sql = "{CALL sp_transacao_devolucao(?)}";
        try (CallableStatement cs = Conexao.getConnection().prepareCall(sql)) {
            cs.setInt(1, idEmprestimo);
            cs.execute();
        }
    }

    /**
     * Calcula multa via parâmetro OUT da procedure.
     * O Java exibe o valor antes de confirmar o pagamento.
     */
    public BigDecimal calcularMulta(int idEmprestimo) throws SQLException {
        String sql = "{CALL sp_calcular_multa(?, ?)}";
        try (CallableStatement cs = Conexao.getConnection().prepareCall(sql)) {
            cs.setInt(1, idEmprestimo);
            cs.registerOutParameter(2, Types.DECIMAL);
            cs.execute();
            return cs.getBigDecimal(2);
        }
    }

    /**
     * Histórico de empréstimos de um usuário específico.
     * Consulta a view vw_meus_emprestimos (não as tabelas físicas), pois
     * usr_aluno só tem permissão de SELECT em views — não nas tabelas
     * Emprestimos/Livros/Usuarios diretamente.
     */
    public List<Emprestimo> listarPorUsuario(int idUsuario) throws SQLException {
        List<Emprestimo> lista = new ArrayList<>();
        String sql = "SELECT * FROM vw_meus_emprestimos "
                   + "WHERE id_usuario_fk = ? ORDER BY data_saida DESC";
        try (PreparedStatement ps = Conexao.getConnection().prepareStatement(sql)) {
            ps.setInt(1, idUsuario);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) lista.add(mapear(rs));
            }
        }
        return lista;
    }

    public List<Emprestimo> listarAtrasados() throws SQLException {
        List<Emprestimo> lista = new ArrayList<>();
        String sql = "SELECT * FROM vw_livros_atrasados";
        try (Statement st = Conexao.getConnection().createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                Emprestimo e = new Emprestimo();
                e.setIdEmprestimo(rs.getInt("id_emprestimo"));
                e.setNomeUsuario(rs.getString("nome_usuario"));
                e.setTituloLivro(rs.getString("livro"));
                lista.add(e);
            }
        }
        return lista;
    }

    private Emprestimo mapear(ResultSet rs) throws SQLException {
        Emprestimo e = new Emprestimo();
        e.setIdEmprestimo(rs.getInt("id_emprestimo"));
        e.setIdUsuarioFk(rs.getInt("id_usuario_fk"));
        e.setIdLivroFk(rs.getInt("id_livro_fk"));
        Timestamp saida = rs.getTimestamp("data_saida");
        if (saida != null) e.setDataSaida(saida.toLocalDateTime());
        Date prev = rs.getDate("data_prevista");
        if (prev != null) e.setDataPrevista(prev.toLocalDate());
        Timestamp dev = rs.getTimestamp("data_devolucao");
        if (dev != null) e.setDataDevolucao(dev.toLocalDateTime());
        e.setNomeUsuario(rs.getString("nome_usuario"));
        e.setTituloLivro(rs.getString("titulo_livro"));
        return e;
    }
}