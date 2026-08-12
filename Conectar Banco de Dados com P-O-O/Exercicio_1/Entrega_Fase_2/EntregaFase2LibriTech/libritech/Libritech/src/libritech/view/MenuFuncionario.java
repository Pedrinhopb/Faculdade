package libritech.view;

import libritech.dao.EmprestimoDAO;
import libritech.dao.LivroDAO;
import libritech.dao.UsuarioDAO;
import libritech.model.Livro;
import libritech.model.Usuario;

import javax.swing.*;
import java.math.BigDecimal;
import java.sql.SQLException;

/**
 * Menu do Funcionário — Cenário B.
 *
 * IMPORTANTE (Armadilha do Estagiário):
 * O menu é IDÊNTICO para Gerente, Bibliotecário e Estagiário.
 * NÃO escondemos botões no Java. A segurança está no banco:
 * se usr_estagiario tentar excluir, o MySQL lança SQLException.
 */
public class MenuFuncionario {

    private final Usuario usuario;
    private final LivroDAO livroDAO           = new LivroDAO();
    private final EmprestimoDAO emprestimoDAO = new EmprestimoDAO();
    private final UsuarioDAO usuarioDAO       = new UsuarioDAO();

    public MenuFuncionario(Usuario usuario) {
        this.usuario = usuario;
    }

    public void exibir() {
        String[] opcoes = {
            "1. Cadastrar Livro",
            "2. Realizar Empréstimo",
            "3. Renovar Empréstimo",
            "4. Realizar Devolução",
            "5. Excluir Livro",
            "6. Relatórios / Backup",
            "7. Sair"
        };
        int escolha;

        do {
            escolha = JOptionPane.showOptionDialog(
                    null,
                    "Bem-vindo(a), " + usuario.getNome()
                            + " [" + usuario.getTipo() + "]\nEscolha uma opção:",
                    "LibriTech — Menu Funcionário",
                    JOptionPane.DEFAULT_OPTION,
                    JOptionPane.PLAIN_MESSAGE,
                    null, opcoes, opcoes[0]);

            switch (escolha) {
                case 0 -> cadastrarLivro();
                case 1 -> realizarEmprestimo();
                case 2 -> renovarEmprestimo();
                case 3 -> realizarDevolucao();
                case 4 -> excluirLivro();          // ← Teste de Fogo do Estagiário
                case 5 -> gerarRelatorios();
                case 6 -> JOptionPane.showMessageDialog(null, "Até logo, " + usuario.getNome() + "!");
                default -> escolha = 6;
            }
        } while (escolha != 6);
    }

    // ── 1. Cadastrar Livro ────────────────────────────────────
    private void cadastrarLivro() {
        try {
            String titulo = JOptionPane.showInputDialog("Título do livro:");
            if (titulo == null || titulo.isBlank()) return;
            String autor  = JOptionPane.showInputDialog("Autor:");
            String isbn   = JOptionPane.showInputDialog("ISBN:");
            String precoS = JOptionPane.showInputDialog("Preço de custo (ex: 89.90):");
            String estqS  = JOptionPane.showInputDialog("Quantidade em estoque:");

            Livro livro = new Livro(
                    titulo, autor, isbn,
                    new BigDecimal(precoS),
                    Integer.parseInt(estqS));

            livroDAO.inserir(livro);
            JOptionPane.showMessageDialog(null, "Livro cadastrado com sucesso!");
        } catch (IllegalArgumentException e) {
            JOptionPane.showMessageDialog(null,
                    "Dados inválidos: " + e.getMessage(), "Erro", JOptionPane.WARNING_MESSAGE);
        } catch (SQLException e) {
            // Trigger trg_trava_horario_comercial pode disparar aqui
            JOptionPane.showMessageDialog(null,
                    "Erro ao cadastrar livro:\n" + e.getMessage(), "Erro", JOptionPane.ERROR_MESSAGE);
        }
    }

    // ── 2. Realizar Empréstimo ────────────────────────────────
    private void realizarEmprestimo() {
        try {
            String idUsuS = JOptionPane.showInputDialog("ID do Usuário:");
            String idLivS = JOptionPane.showInputDialog("ID do Livro:");
            if (idUsuS == null || idLivS == null) return;
            int idUsuario = Integer.parseInt(idUsuS);
            int idLivro   = Integer.parseInt(idLivS);

            // ── POLIMORFISMO ──────────────────────────────────────
            // Busca o usuário que está pegando o livro (Aluno ou Funcionario)
            // e usa o método polimórfico para calcular o prazo ANTES de
            // enviar ao banco: Aluno = 7 dias, Funcionario = 14 dias.
            Usuario quemPegou = usuarioDAO.buscarPorId(idUsuario);
            if (quemPegou == null) {
                JOptionPane.showMessageDialog(null,
                        "Usuário não encontrado com o ID informado.",
                        "Erro", JOptionPane.WARNING_MESSAGE);
                return;
            }
            int prazoDias = quemPegou.getDiasPrazoEmprestimo();

            emprestimoDAO.realizarEmprestimo(idUsuario, idLivro, prazoDias);

            JOptionPane.showMessageDialog(null,
                    String.format("Empréstimo registrado com sucesso!%n"
                            + "Usuário: %s [%s]%nPrazo de devolução: %d dias",
                            quemPegou.getNome(), quemPegou.getTipo(), prazoDias));
        } catch (NumberFormatException e) {
            JOptionPane.showMessageDialog(null,
                    "ID inválido. Digite apenas números.", "Erro", JOptionPane.WARNING_MESSAGE);
        } catch (SQLException e) {
            // sp_transacao_emprestimo pode lançar: estoque zero, pendências, limite 3 livros
            JOptionPane.showMessageDialog(null,
                    "Erro ao realizar empréstimo:\n" + e.getMessage(),
                    "Erro", JOptionPane.ERROR_MESSAGE);
        }
    }

    // ── 3. Renovar Empréstimo ─────────────────────────────────
    private void renovarEmprestimo() {
        try {
            String idEmpS = JOptionPane.showInputDialog("ID do Empréstimo:");
            if (idEmpS == null) return;

            emprestimoDAO.renovarEmprestimo(Integer.parseInt(idEmpS));
            JOptionPane.showMessageDialog(null, "Empréstimo renovado por mais 7 dias!");
        } catch (SQLException e) {
            // sp_renovar_emprestimo nega se livro estiver reservado
            JOptionPane.showMessageDialog(null,
                    "Renovação negada:\n" + e.getMessage(),
                    "Atenção", JOptionPane.WARNING_MESSAGE);
        }
    }

    // ── 4. Realizar Devolução ─────────────────────────────────
    private void realizarDevolucao() {
        try {
            String idEmpS = JOptionPane.showInputDialog("ID do Empréstimo:");
            if (idEmpS == null) return;
            int idEmp = Integer.parseInt(idEmpS);

            // Exibe multa antes de confirmar
            BigDecimal multa = emprestimoDAO.calcularMulta(idEmp);
            String msg = multa.compareTo(BigDecimal.ZERO) > 0
                    ? String.format("Devolução com ATRASO!\nMulta calculada: R$ %.2f\n\nConfirmar devolução?", multa)
                    : "Devolução dentro do prazo. Confirmar?";

            int conf = JOptionPane.showConfirmDialog(null, msg, "Confirmar Devolução",
                    JOptionPane.YES_NO_OPTION);
            if (conf != JOptionPane.YES_OPTION) return;

            emprestimoDAO.realizarDevolucao(idEmp);
            JOptionPane.showMessageDialog(null, "Devolução registrada com sucesso!");
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null,
                    "Erro ao realizar devolução:\n" + e.getMessage(),
                    "Erro", JOptionPane.ERROR_MESSAGE);
        }
    }

    // ── 5. Excluir Livro — ARMADILHA DO ESTAGIÁRIO ───────────
    private void excluirLivro() {
        String idS = JOptionPane.showInputDialog("ID do livro a excluir:");
        if (idS == null || idS.isBlank()) return;

        try {
            livroDAO.deletar(Integer.parseInt(idS));
            JOptionPane.showMessageDialog(null,
                    "Livro excluído. Auditoria registrada automaticamente.",
                    "Sucesso", JOptionPane.INFORMATION_MESSAGE);
        } catch (SQLException e) {
            /*
             * ARMADILHA DO ESTAGIÁRIO:
             * usr_estagiario tem REVOKE DELETE em Livros.
             * O MySQL bloqueia e lança SQLException aqui.
             * A segurança está no banco — não em botões escondidos.
             */
            JOptionPane.showMessageDialog(null,
                    "ERRO: Acesso Negado!\nSeu perfil de usuário não tem permissão "
                    + "para excluir registros do sistema.\n\nCódigo: " + e.getErrorCode(),
                    "Permissão Negada", JOptionPane.ERROR_MESSAGE);
        }
    }

    // ── 6. Relatórios / Backup ────────────────────────────────
    private void gerarRelatorios() {
        String[] ops = {"Ver Livros Atrasados", "Dashboard Financeiro", "Ranking de Leitura", "Sair"};
        int escolha = JOptionPane.showOptionDialog(null,
                "Escolha o relatório:", "Relatórios",
                JOptionPane.DEFAULT_OPTION, JOptionPane.PLAIN_MESSAGE,
                null, ops, ops[0]);

        switch (escolha) {
            case 0 -> relatoriAtrasados();
            case 1 -> dashboardFinanceiro();
            case 2 -> rankingLeitura();
        }
    }

    private void relatoriAtrasados() {
        try {
            var lista = emprestimoDAO.listarAtrasados();
            if (lista.isEmpty()) {
                JOptionPane.showMessageDialog(null, "Nenhum empréstimo atrasado.");
                return;
            }
            StringBuilder sb = new StringBuilder("═══ EMPRÉSTIMOS ATRASADOS ═══\n\n");
            for (var e : lista) sb.append(e).append("\n");
            JOptionPane.showMessageDialog(null, sb.toString());
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null, "Erro: " + e.getMessage());
        }
    }

    private void dashboardFinanceiro() {
        try {
            var rs = Conexao.executarQuery("SELECT * FROM vw_dashboard_financeiro");
            if (rs != null && rs.next()) {
                JOptionPane.showMessageDialog(null,
                        String.format("═══ DASHBOARD FINANCEIRO ═══\n\n"
                                + "Total Arrecadado : R$ %.2f\n"
                                + "Total Recebido   : R$ %.2f\n"
                                + "Total Pendente   : R$ %.2f\n"
                                + "Qtd. Multas      : %d",
                                rs.getBigDecimal("total_arrecadado"),
                                rs.getBigDecimal("total_recebido"),
                                rs.getBigDecimal("total_pendente"),
                                rs.getInt("qtd_multas")));
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Erro: " + e.getMessage());
        }
    }

    private void rankingLeitura() {
        try {
            var rs = Conexao.executarQuery("SELECT * FROM vw_ranking_leitura");
            StringBuilder sb = new StringBuilder("═══ TOP 10 LIVROS MAIS LIDOS ═══\n\n");
            int pos = 1;
            while (rs != null && rs.next()) {
                sb.append(String.format("%dº %s — %d empréstimos\n",
                        pos++, rs.getString("titulo"), rs.getInt("total_emprestimos")));
            }
            JOptionPane.showMessageDialog(null, sb.toString());
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Erro: " + e.getMessage());
        }
    }
}

// Importação auxiliar para não duplicar código
class Conexao {
    static java.sql.ResultSet executarQuery(String sql) throws Exception {
        return libritech.connection.Conexao.getConnection()
                .createStatement().executeQuery(sql);
    }
}