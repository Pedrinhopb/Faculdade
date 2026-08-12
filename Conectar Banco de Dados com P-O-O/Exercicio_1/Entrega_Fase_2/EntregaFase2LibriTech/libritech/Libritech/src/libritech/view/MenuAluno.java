package libritech.view;

import libritech.dao.EmprestimoDAO;
import libritech.dao.LivroDAO;
import libritech.model.Emprestimo;
import libritech.model.Livro;
import libritech.model.Usuario;

import javax.swing.*;
import java.sql.SQLException;
import java.util.List;

/**
 * Menu do Aluno — Cenário A.
 * Acesso limitado: consultar acervo (via View pública) e ver seus empréstimos.
 */
public class MenuAluno {

    private final Usuario usuario;
    private final LivroDAO livroDAO         = new LivroDAO();
    private final EmprestimoDAO emprestimoDAO = new EmprestimoDAO();

    public MenuAluno(Usuario usuario) {
        this.usuario = usuario;
    }

    public void exibir() {
        String[] opcoes = {"1. Consultar Acervo Disponível", "2. Meus Empréstimos", "3. Sair"};
        int escolha;

        do {
            escolha = JOptionPane.showOptionDialog(
                    null,
                    "Bem-vindo(a), " + usuario.getNome() + "!\nO que deseja fazer?",
                    "LibriTech — Menu Aluno",
                    JOptionPane.DEFAULT_OPTION,
                    JOptionPane.PLAIN_MESSAGE,
                    null, opcoes, opcoes[0]);

            switch (escolha) {
                case 0 -> consultarAcervo();
                case 1 -> meusEmprestimos();
                case 2 -> {
                    JOptionPane.showMessageDialog(null, "Até logo, " + usuario.getNome() + "!");
                }
                default -> {
                    // Janela fechada — trata como Sair
                    escolha = 2;
                }
            }
        } while (escolha != 2);
    }

    private void consultarAcervo() {
        try {
            List<Livro> livros = livroDAO.listarAcervoPublico();
            if (livros.isEmpty()) {
                JOptionPane.showMessageDialog(null, "Nenhum livro disponível no momento.");
                return;
            }
            StringBuilder sb = new StringBuilder("═══ ACERVO DISPONÍVEL ═══\n\n");
            for (Livro l : livros) {
                // preço_custo NÃO é exibido — segurança via View
                sb.append(String.format("• [%d] %s — %s\n  ISBN: %s | Estoque: %d\n\n",
                        l.getIdLivro(), l.getTitulo(), l.getAutor(),
                        l.getIsbn(), l.getQuantidadeEstoque()));
            }
            JOptionPane.showMessageDialog(null, sb.toString(),
                    "Acervo Disponível", JOptionPane.INFORMATION_MESSAGE);
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null,
                    "Erro ao consultar acervo:\n" + e.getMessage(),
                    "Erro", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void meusEmprestimos() {
        try {
            List<Emprestimo> lista = emprestimoDAO.listarPorUsuario(usuario.getIdUsuario());
            if (lista.isEmpty()) {
                JOptionPane.showMessageDialog(null, "Você não possui empréstimos registrados.");
                return;
            }
            StringBuilder sb = new StringBuilder("═══ MEUS EMPRÉSTIMOS ═══\n\n");
            for (Emprestimo e : lista) sb.append(e).append("\n\n");
            JOptionPane.showMessageDialog(null, sb.toString(),
                    "Meus Empréstimos", JOptionPane.INFORMATION_MESSAGE);
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null,
                    "Erro ao buscar empréstimos:\n" + e.getMessage(),
                    "Erro", JOptionPane.ERROR_MESSAGE);
        }
    }
}