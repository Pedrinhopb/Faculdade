package libritech.connection;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Gerencia a conexão com o MySQL.
 * As credenciais são passadas dinamicamente (sem hardcode),
 * garantindo que as permissões do banco sejam aplicadas por usuário.
 */
public class Conexao {

    private static final String URL = "jdbc:mysql://localhost:3306/db_libritech"
            + "?useSSL=false&serverTimezone=America/Fortaleza&allowPublicKeyRetrieval=true";

    private static Connection instancia = null;

    /** Abre (ou reaproveita) conexão com as credenciais fornecidas no login. */
    public static Connection getConnection(String usuario, String senha) throws SQLException {
        if (instancia == null || instancia.isClosed()) {
            instancia = DriverManager.getConnection(URL, usuario, senha);
        }
        return instancia;
    }

    /** Retorna a conexão já aberta (após login). */
    public static Connection getConnection() {
        return instancia;
    }

    public static void fechar() {
        try {
            if (instancia != null && !instancia.isClosed()) {
                instancia.close();
                instancia = null;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}