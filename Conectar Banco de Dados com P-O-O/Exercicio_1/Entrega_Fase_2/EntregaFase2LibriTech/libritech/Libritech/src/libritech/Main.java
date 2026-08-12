package libritech;

import libritech.connection.Conexao;
import libritech.dao.UsuarioDAO;
import libritech.model.Usuario;
import libritech.view.MenuAluno;
import libritech.view.MenuFuncionario;

import javax.swing.*;
import java.sql.SQLException;

/**
 * Ponto de entrada do LibriTech.
 *
 * Fluxo obrigatório:
 *  1. Seleção de perfil (Aluno / Funcionário / Sair)
 *  2. Autenticação REAL no banco (usuário + senha digitados → sem hardcode)
 *  3. Menu dinâmico conforme perfil
 */
public class Main {

    public static void main(String[] args) {
        // ── Passo 2: Seleção de Perfil Inicial ───────────────
        String[] perfis = {"Funcionário", "Aluno", "Sair"};
        int perfilEscolhido = JOptionPane.showOptionDialog(
                null,
                "Bem-vindo ao LibriTech!\nQual é o seu perfil de acesso?",
                "LibriTech — Acesso",
                JOptionPane.DEFAULT_OPTION,
                JOptionPane.QUESTION_MESSAGE,
                null, perfis, perfis[0]);

        if (perfilEscolhido == 2 || perfilEscolhido == JOptionPane.CLOSED_OPTION) {
            System.exit(0);
        }

        boolean isAluno = (perfilEscolhido == 1);

        // ── Passo 3: Autenticação Real no Banco ──────────────
        // NÃO há usuário/senha fixos no código (sem hardcode de root/1234).
        // O usuário digita as credenciais MySQL (usr_aluno, usr_gerente, etc.)
        // e a conexão aberta herda exatamente as permissões do banco.

        String usuarioDB = JOptionPane.showInputDialog(
                null,
                "Usuário do banco de dados:\n(ex: usr_aluno, usr_estagiario, usr_gerente)",
                "Login — Usuário do Banco",
                JOptionPane.PLAIN_MESSAGE);

        if (usuarioDB == null || usuarioDB.isBlank()) System.exit(0);

        JPasswordField senhaField = new JPasswordField();
        int ok = JOptionPane.showConfirmDialog(
                null, senhaField, "Senha do banco:", JOptionPane.OK_CANCEL_OPTION);
        if (ok != JOptionPane.OK_OPTION) System.exit(0);
        String senhaBD = new String(senhaField.getPassword());

        // Tenta abrir conexão com as credenciais fornecidas
        try {
            Conexao.getConnection(usuarioDB, senhaBD);
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null,
                    "Falha na autenticação!\nVerifique usuário e senha.\n\n" + e.getMessage(),
                    "Erro de Login", JOptionPane.ERROR_MESSAGE);
            System.exit(1);
        }

        // Login complementar na aplicação (email do usuário para identificar o objeto Java)
        String emailApp = JOptionPane.showInputDialog("Seu e-mail de acesso:");
        if (emailApp == null || emailApp.isBlank()) {
            Conexao.fechar();
            System.exit(0);
        }

        Usuario usuarioLogado = null;
        try {
            UsuarioDAO dao = new UsuarioDAO();
            usuarioLogado = dao.buscarPorEmail(emailApp);
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null,
                    "Erro ao buscar usuário: " + e.getMessage(),
                    "Erro", JOptionPane.ERROR_MESSAGE);
            Conexao.fechar();
            System.exit(1);
        }

        if (usuarioLogado == null) {
            JOptionPane.showMessageDialog(null,
                    "Usuário não encontrado no sistema.",
                    "Acesso Negado", JOptionPane.WARNING_MESSAGE);
            Conexao.fechar();
            System.exit(0);
        }

        // ── Passo 4: Menu Dinâmico ────────────────────────────
        if (isAluno) {
            new MenuAluno(usuarioLogado).exibir();
        } else {
            new MenuFuncionario(usuarioLogado).exibir();
        }

        Conexao.fechar();
        System.exit(0);
    }
}