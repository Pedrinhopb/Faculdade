package libritech.dao;

import libritech.connection.Conexao;
import libritech.model.Livro;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class LivroDAO {

    public void inserir(Livro livro) throws SQLException {
        String sql = "INSERT INTO Livros (titulo, autor, isbn, preco_custo, quantidade_estoque, status) "
                   + "VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement ps = Conexao.getConnection().prepareStatement(sql)) {
            ps.setString(1, livro.getTitulo());
            ps.setString(2, livro.getAutor());
            ps.setString(3, livro.getIsbn());
            ps.setBigDecimal(4, livro.getPrecoCusto());
            ps.setInt(5, livro.getQuantidadeEstoque());
            ps.setString(6, livro.getStatus());
            ps.executeUpdate();
        }
        // Triggers trg_trava_horario_comercial e trg_preventiva_estoque
        // disparam automaticamente no banco.
    }

    /**
     * Tenta deletar livro — para usr_estagiario o banco lança SQLException
     * (REVOKE DELETE), que o Java captura e exibe mensagem amigável.
     */
    public void deletar(int idLivro) throws SQLException {
        String sql = "DELETE FROM Livros WHERE id_livro = ?";
        try (PreparedStatement ps = Conexao.getConnection().prepareStatement(sql)) {
            ps.setInt(1, idLivro);
            int linhas = ps.executeUpdate();
            if (linhas == 0)
                throw new SQLException("Nenhum livro encontrado com o ID informado.");
        }
        // trg_auditoria_delecao grava no Log automaticamente após o DELETE.
    }

    /** Consulta acervo via View pública (sem preco_custo). */
    public List<Livro> listarAcervoPublico() throws SQLException {
        List<Livro> lista = new ArrayList<>();
        String sql = "SELECT * FROM vw_acervo_publico";
        try (Statement st = Conexao.getConnection().createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                Livro l = new Livro();
                l.setIdLivro(rs.getInt("id_livro"));
                l.setTitulo(rs.getString("titulo"));
                l.setAutor(rs.getString("autor"));
                l.setIsbn(rs.getString("isbn"));
                l.setQuantidadeEstoque(rs.getInt("quantidade_estoque"));
                l.setStatus(rs.getString("status"));
                lista.add(l);
            }
        }
        return lista;
    }

    public List<Livro> listarTodos() throws SQLException {
        List<Livro> lista = new ArrayList<>();
        String sql = "SELECT * FROM Livros ORDER BY titulo";
        try (Statement st = Conexao.getConnection().createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                Livro l = new Livro();
                l.setIdLivro(rs.getInt("id_livro"));
                l.setTitulo(rs.getString("titulo"));
                l.setAutor(rs.getString("autor"));
                l.setIsbn(rs.getString("isbn"));
                l.setPrecoCusto(rs.getBigDecimal("preco_custo"));
                l.setQuantidadeEstoque(rs.getInt("quantidade_estoque"));
                l.setStatus(rs.getString("status"));
                lista.add(l);
            }
        }
        return lista;
    }
}