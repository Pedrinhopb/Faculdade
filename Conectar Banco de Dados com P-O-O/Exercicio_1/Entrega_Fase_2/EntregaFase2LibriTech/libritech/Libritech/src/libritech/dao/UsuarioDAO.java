package libritech.dao;

import libritech.connection.Conexao;
import libritech.model.*;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UsuarioDAO {

    /**
     * Cadastra usuário + endereço usando a Stored Procedure transacional.
     * Se o endereço falhar, o banco faz ROLLBACK automaticamente.
     */
    public void cadastrarCompleto(String nome, String cpf, String email,
                                  String senha, String tipo,
                                  String logradouro, String bairro,
                                  String cidade, String uf) throws SQLException {
        String sql = "{CALL sp_transacao_cadastro_completo(?,?,?,?,?,?,?,?,?)}";
        try (CallableStatement cs = Conexao.getConnection().prepareCall(sql)) {
            cs.setString(1, nome);
            cs.setString(2, cpf);
            cs.setString(3, email);
            cs.setString(4, senha);
            cs.setString(5, tipo);
            cs.setString(6, logradouro);
            cs.setString(7, bairro);
            cs.setString(8, cidade);
            cs.setString(9, uf);
            cs.execute();
        }
    }

    /**
     * Busca usuário pelo e-mail para validar login na aplicação.
     * A autenticação real é feita pela conexão MySQL (usr_xxx / senha).
     */
    public Usuario buscarPorEmail(String email) throws SQLException {
        String sql = "SELECT * FROM Usuarios WHERE email = ?";
        try (PreparedStatement ps = Conexao.getConnection().prepareStatement(sql)) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return fabricar(rs);
                }
            }
        }
        return null;
    }

    /**
     * Busca usuário pelo ID — usado para obter o objeto (Aluno/Funcionario)
     * de quem está pegando o livro, permitindo o cálculo polimórfico do
     * prazo de empréstimo via getDiasPrazoEmprestimo().
     */
    public Usuario buscarPorId(int idUsuario) throws SQLException {
        String sql = "SELECT * FROM Usuarios WHERE id_usuario = ?";
        try (PreparedStatement ps = Conexao.getConnection().prepareStatement(sql)) {
            ps.setInt(1, idUsuario);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return fabricar(rs);
                }
            }
        }
        return null;
    }

    public List<Usuario> listarTodos() throws SQLException {
        List<Usuario> lista = new ArrayList<>();
        String sql = "SELECT * FROM Usuarios ORDER BY nome";
        try (Statement st = Conexao.getConnection().createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) lista.add(fabricar(rs));
        }
        return lista;
    }

    /** Fábrica: constrói a subclasse correta conforme coluna 'tipo' (herança). */
    private Usuario fabricar(ResultSet rs) throws SQLException {
        String tipo = rs.getString("tipo");
        Usuario u;
        if ("ALUNO".equals(tipo)) {
            u = new Aluno(rs.getInt("id_usuario"), rs.getString("nome"),
                          rs.getString("cpf"),     rs.getString("email"),
                          rs.getString("senha"));
        } else {
            u = new Funcionario(rs.getInt("id_usuario"), rs.getString("nome"),
                                rs.getString("cpf"),     rs.getString("email"),
                                rs.getString("senha"),   tipo);
        }
        return u;
    }
}