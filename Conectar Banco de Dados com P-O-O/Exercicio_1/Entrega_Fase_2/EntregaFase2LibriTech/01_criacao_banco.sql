-- =============================================================
--  LibriTech - Sistema de Gestão Bibliotecária
--  SCRIPT DE CRIAÇÃO (versão final, com todos os ajustes)
--  Conteúdo: CREATE TABLE, CREATE USER, GRANT, CREATE PROCEDURE,
--            CREATE TRIGGER, CREATE VIEW, CREATE INDEX
--
--  COMO EXECUTAR no MySQL Workbench:
--    File > Open SQL Script... > selecione este arquivo
--    Depois clique no ícone de RAIO (Execute SQL Script) — NÃO
--    copie/cole em uma aba normal, pois os blocos DELIMITER
--    das procedures/triggers só funcionam executando como script.
-- =============================================================

DROP DATABASE IF EXISTS db_libritech;
CREATE DATABASE db_libritech
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE db_libritech;


-- =============================================================
-- SEÇÃO 1 — DDL: CRIAÇÃO DAS TABELAS
-- =============================================================

-- 1.1 Usuarios (Entidade Pai — coluna discriminadora 'tipo')
CREATE TABLE Usuarios (
    id_usuario   INT          NOT NULL AUTO_INCREMENT,
    nome         VARCHAR(120) NOT NULL,
    cpf          CHAR(11)     NOT NULL,
    email        VARCHAR(120) NOT NULL,
    senha        VARCHAR(255) NOT NULL,
    tipo         ENUM('ALUNO','GERENTE','BIBLIOTECARIO','ESTAGIARIO') NOT NULL,
    CONSTRAINT pk_usuarios   PRIMARY KEY (id_usuario),
    CONSTRAINT uq_usuarios_cpf   UNIQUE (cpf),
    CONSTRAINT uq_usuarios_email UNIQUE (email)
);

-- 1.2 Enderecos (Normalização 1FN)
CREATE TABLE Enderecos (
    id_endereco    INT          NOT NULL AUTO_INCREMENT,
    logradouro     VARCHAR(150) NOT NULL,
    bairro         VARCHAR(80)  NOT NULL,
    cidade         VARCHAR(80)  NOT NULL,
    uf             CHAR(2)      NOT NULL,
    id_usuario_fk  INT          NOT NULL,
    CONSTRAINT pk_enderecos PRIMARY KEY (id_endereco),
    CONSTRAINT fk_end_usuario
        FOREIGN KEY (id_usuario_fk) REFERENCES Usuarios(id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 1.3 Livros (Acervo)
CREATE TABLE Livros (
    id_livro            INT            NOT NULL AUTO_INCREMENT,
    titulo              VARCHAR(200)   NOT NULL,
    autor               VARCHAR(120)   NOT NULL,
    isbn                VARCHAR(20)    NOT NULL,
    preco_custo         DECIMAL(10,2)  NOT NULL,
    quantidade_estoque  INT            NOT NULL DEFAULT 0,
    status              VARCHAR(20)    NOT NULL DEFAULT 'DISPONIVEL',
    CONSTRAINT pk_livros  PRIMARY KEY (id_livro),
    CONSTRAINT uq_livros_isbn UNIQUE (isbn),
    CONSTRAINT ck_livros_preco  CHECK (preco_custo >= 0),
    CONSTRAINT ck_livros_estoque CHECK (quantidade_estoque >= 0)
);

-- 1.4 Emprestimos (Tabela Associativa N:M)
CREATE TABLE Emprestimos (
    id_emprestimo   INT      NOT NULL AUTO_INCREMENT,
    id_usuario_fk   INT      NOT NULL,
    id_livro_fk     INT      NOT NULL,
    data_saida      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_prevista   DATE     NOT NULL,
    data_devolucao  DATETIME NULL DEFAULT NULL,
    CONSTRAINT pk_emprestimos PRIMARY KEY (id_emprestimo),
    CONSTRAINT fk_emp_usuario
        FOREIGN KEY (id_usuario_fk) REFERENCES Usuarios(id_usuario)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_emp_livro
        FOREIGN KEY (id_livro_fk) REFERENCES Livros(id_livro)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 1.5 Multas (Financeiro)
CREATE TABLE Multas (
    id_multa          INT           NOT NULL AUTO_INCREMENT,
    id_emprestimo_fk  INT           NOT NULL,
    valor             DECIMAL(10,2) NOT NULL,
    pago              TINYINT       NOT NULL DEFAULT 0,
    CONSTRAINT pk_multas PRIMARY KEY (id_multa),
    CONSTRAINT fk_multa_emp
        FOREIGN KEY (id_emprestimo_fk) REFERENCES Emprestimos(id_emprestimo)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 1.6 Log_Auditoria (alimentada exclusivamente por trigger)
CREATE TABLE Log_Auditoria (
    id_log              INT          NOT NULL AUTO_INCREMENT,
    tabela_afetada      VARCHAR(50)  NOT NULL,
    acao                VARCHAR(50)  NOT NULL,
    usuario_responsavel VARCHAR(120) NOT NULL,
    dados_antigos       TEXT         NULL,
    data_hora           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_log PRIMARY KEY (id_log)
);


-- =============================================================
-- SEÇÃO 2 — USUÁRIOS E PERMISSÕES (Princípio do Privilégio Mínimo)
-- =============================================================

DROP USER IF EXISTS 'usr_gerente'@'localhost';
DROP USER IF EXISTS 'usr_bibliotecario'@'localhost';
DROP USER IF EXISTS 'usr_estagiario'@'localhost';
DROP USER IF EXISTS 'usr_aluno'@'localhost';

-- 2.1 Gerente — acesso total
CREATE USER 'usr_gerente'@'localhost' IDENTIFIED BY 'Gerente@2025!';
GRANT ALL PRIVILEGES ON db_libritech.* TO 'usr_gerente'@'localhost';

-- 2.2 Bibliotecario — operador diário; sem DELETE em auditoria
CREATE USER 'usr_bibliotecario'@'localhost' IDENTIFIED BY 'Biblio@2025!';
GRANT SELECT, INSERT, UPDATE ON db_libritech.Usuarios     TO 'usr_bibliotecario'@'localhost';
GRANT SELECT, INSERT, UPDATE ON db_libritech.Enderecos    TO 'usr_bibliotecario'@'localhost';
GRANT SELECT, INSERT, UPDATE ON db_libritech.Livros       TO 'usr_bibliotecario'@'localhost';
GRANT SELECT, INSERT, UPDATE ON db_libritech.Emprestimos  TO 'usr_bibliotecario'@'localhost';
GRANT SELECT, INSERT, UPDATE ON db_libritech.Multas       TO 'usr_bibliotecario'@'localhost';
GRANT SELECT                 ON db_libritech.Log_Auditoria TO 'usr_bibliotecario'@'localhost';
-- Sem DELETE em Log_Auditoria — rastreabilidade garantida
GRANT EXECUTE ON db_libritech.* TO 'usr_bibliotecario'@'localhost';

-- 2.3 Estagiario — permissões mínimas; DELETE revogado explicitamente
CREATE USER 'usr_estagiario'@'localhost' IDENTIFIED BY 'Estagio@2025!';
GRANT SELECT          ON db_libritech.Livros      TO 'usr_estagiario'@'localhost';
GRANT SELECT          ON db_libritech.Usuarios    TO 'usr_estagiario'@'localhost';
GRANT SELECT, INSERT  ON db_libritech.Emprestimos TO 'usr_estagiario'@'localhost';
REVOKE DELETE ON db_libritech.Livros FROM 'usr_estagiario'@'localhost';
GRANT EXECUTE ON db_libritech.* TO 'usr_estagiario'@'localhost';

-- 2.4 Aluno — somente leitura via Views (sem acesso direto às tabelas físicas)
CREATE USER 'usr_aluno'@'localhost' IDENTIFIED BY 'Aluno@2025!';
-- AJUSTE: necessário para o Java identificar o usuário logado pelo e-mail
-- (login da aplicação). Mantém acesso de leitura simples, sem dados financeiros.
GRANT SELECT ON db_libritech.Usuarios TO 'usr_aluno'@'localhost';

FLUSH PRIVILEGES;


-- =============================================================
-- SEÇÃO 3 — STORED PROCEDURES
-- =============================================================

DELIMITER $$

-- ------------------------------------------------------------------
-- 3.1 sp_transacao_emprestimo
--     AJUSTE: recebe p_prazo_dias calculado pelo Java via POLIMORFISMO
--     (Usuario.getDiasPrazoEmprestimo(): Aluno=7 / Funcionario=14)
-- ------------------------------------------------------------------
CREATE PROCEDURE sp_transacao_emprestimo(
    IN p_id_usuario INT,
    IN p_id_livro   INT,
    IN p_prazo_dias INT
)
BEGIN
    DECLARE v_estoque    INT DEFAULT 0;
    DECLARE v_pendencias INT DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT COUNT(*) INTO v_pendencias
    FROM Emprestimos e
    JOIN Multas m ON m.id_emprestimo_fk = e.id_emprestimo
    WHERE e.id_usuario_fk = p_id_usuario AND m.pago = 0;

    IF v_pendencias > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Usuário possui multas pendentes. Quite antes de emprestar.';
    END IF;

    SELECT quantidade_estoque INTO v_estoque
    FROM Livros WHERE id_livro = p_id_livro FOR UPDATE;

    IF v_estoque <= 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Livro sem estoque disponível.';
    END IF;

    INSERT INTO Emprestimos (id_usuario_fk, id_livro_fk, data_prevista)
    VALUES (p_id_usuario, p_id_livro, DATE_ADD(CURDATE(), INTERVAL p_prazo_dias DAY));

    UPDATE Livros
    SET quantidade_estoque = quantidade_estoque - 1,
        status = IF(quantidade_estoque - 1 = 0, 'INDISPONIVEL', 'DISPONIVEL')
    WHERE id_livro = p_id_livro;

    COMMIT;
END$$


-- ------------------------------------------------------------------
-- 3.2 sp_renovar_emprestimo
-- ------------------------------------------------------------------
CREATE PROCEDURE sp_renovar_emprestimo(
    IN p_id_emprestimo INT
)
BEGIN
    DECLARE v_id_livro     INT;
    DECLARE v_status_livro VARCHAR(20);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT id_livro_fk INTO v_id_livro
    FROM Emprestimos WHERE id_emprestimo = p_id_emprestimo FOR UPDATE;

    SELECT status INTO v_status_livro
    FROM Livros WHERE id_livro = v_id_livro;

    IF v_status_livro = 'RESERVADO' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Renovação negada: livro reservado por outro usuário.';
    END IF;

    UPDATE Emprestimos
    SET data_prevista = DATE_ADD(data_prevista, INTERVAL 7 DAY)
    WHERE id_emprestimo = p_id_emprestimo;

    COMMIT;
END$$


-- ------------------------------------------------------------------
-- 3.3 sp_calcular_multa
-- ------------------------------------------------------------------
CREATE PROCEDURE sp_calcular_multa(
    IN  p_id_emprestimo INT,
    OUT p_valor_multa   DECIMAL(10,2)
)
BEGIN
    DECLARE v_data_prevista   DATE;
    DECLARE v_data_devolucao  DATE;
    DECLARE v_dias_atraso     INT DEFAULT 0;

    SELECT data_prevista,
           COALESCE(DATE(data_devolucao), CURDATE())
    INTO v_data_prevista, v_data_devolucao
    FROM Emprestimos
    WHERE id_emprestimo = p_id_emprestimo;

    SET v_dias_atraso = DATEDIFF(v_data_devolucao, v_data_prevista);

    IF v_dias_atraso > 0 THEN
        SET p_valor_multa = v_dias_atraso * 2.00;
    ELSE
        SET p_valor_multa = 0.00;
    END IF;
END$$


-- ------------------------------------------------------------------
-- 3.4 sp_transacao_cadastro_completo
-- ------------------------------------------------------------------
CREATE PROCEDURE sp_transacao_cadastro_completo(
    IN p_nome       VARCHAR(120),
    IN p_cpf        CHAR(11),
    IN p_email      VARCHAR(120),
    IN p_senha      VARCHAR(255),
    IN p_tipo       ENUM('ALUNO','GERENTE','BIBLIOTECARIO','ESTAGIARIO'),
    IN p_logradouro VARCHAR(150),
    IN p_bairro     VARCHAR(80),
    IN p_cidade     VARCHAR(80),
    IN p_uf         CHAR(2)
)
BEGIN
    DECLARE v_id_novo INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    INSERT INTO Usuarios (nome, cpf, email, senha, tipo)
    VALUES (p_nome, p_cpf, p_email, p_senha, p_tipo);

    SET v_id_novo = LAST_INSERT_ID();

    INSERT INTO Enderecos (logradouro, bairro, cidade, uf, id_usuario_fk)
    VALUES (p_logradouro, p_bairro, p_cidade, p_uf, v_id_novo);

    COMMIT;
END$$


-- ------------------------------------------------------------------
-- 3.5 sp_transacao_devolucao
-- ------------------------------------------------------------------
CREATE PROCEDURE sp_transacao_devolucao(
    IN p_id_emprestimo INT
)
BEGIN
    DECLARE v_id_livro    INT;
    DECLARE v_multa       DECIMAL(10,2);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT id_livro_fk INTO v_id_livro
    FROM Emprestimos WHERE id_emprestimo = p_id_emprestimo FOR UPDATE;

    UPDATE Emprestimos
    SET data_devolucao = NOW()
    WHERE id_emprestimo = p_id_emprestimo;

    CALL sp_calcular_multa(p_id_emprestimo, v_multa);

    IF v_multa > 0 THEN
        INSERT INTO Multas (id_emprestimo_fk, valor, pago)
        VALUES (p_id_emprestimo, v_multa, 0);
    END IF;

    UPDATE Livros
    SET quantidade_estoque = quantidade_estoque + 1,
        status = 'DISPONIVEL'
    WHERE id_livro = v_id_livro;

    COMMIT;
END$$

DELIMITER ;


-- =============================================================
-- SEÇÃO 4 — TRIGGERS
-- =============================================================

DELIMITER $$

-- 4.1 trg_trava_horario_comercial (INSERT e UPDATE em Livros)
CREATE TRIGGER trg_trava_horario_comercial_insert
BEFORE INSERT ON Livros
FOR EACH ROW
BEGIN
    IF HOUR(NOW()) < 8 OR HOUR(NOW()) >= 18 THEN
        SIGNAL SQLSTATE '45001'
            SET MESSAGE_TEXT = 'Operação negada: fora do horário comercial (08h–18h).';
    END IF;
END$$

CREATE TRIGGER trg_trava_horario_comercial_update
BEFORE UPDATE ON Livros
FOR EACH ROW
BEGIN
    IF HOUR(NOW()) < 8 OR HOUR(NOW()) >= 18 THEN
        SIGNAL SQLSTATE '45001'
            SET MESSAGE_TEXT = 'Operação negada: fora do horário comercial (08h–18h).';
    END IF;
END$$


-- 4.2 trg_auditoria_delecao (AFTER DELETE em Livros)
CREATE TRIGGER trg_auditoria_delecao
AFTER DELETE ON Livros
FOR EACH ROW
BEGIN
    INSERT INTO Log_Auditoria (tabela_afetada, acao, usuario_responsavel, dados_antigos)
    VALUES (
        'Livros',
        'DELETE',
        USER(),
        CONCAT('{"id_livro":', OLD.id_livro,
               ',"titulo":"',  OLD.titulo,
               '","autor":"',  OLD.autor,
               '","isbn":"',   OLD.isbn,
               '","preco_custo":', OLD.preco_custo,
               ',"estoque":', OLD.quantidade_estoque, '}')
    );
END$$


-- 4.3 trg_limite_emprestimos (BEFORE INSERT em Emprestimos)
CREATE TRIGGER trg_limite_emprestimos
BEFORE INSERT ON Emprestimos
FOR EACH ROW
BEGIN
    DECLARE v_ativos INT;

    SELECT COUNT(*) INTO v_ativos
    FROM Emprestimos
    WHERE id_usuario_fk = NEW.id_usuario_fk
      AND data_devolucao IS NULL;

    IF v_ativos >= 3 THEN
        SIGNAL SQLSTATE '45002'
            SET MESSAGE_TEXT = 'Limite de 3 empréstimos simultâneos atingido.';
    END IF;
END$$


-- 4.4 trg_preventiva_estoque (BEFORE UPDATE em Livros)
CREATE TRIGGER trg_preventiva_estoque
BEFORE UPDATE ON Livros
FOR EACH ROW
BEGIN
    IF NEW.quantidade_estoque < 0 THEN
        SIGNAL SQLSTATE '45003'
            SET MESSAGE_TEXT = 'Operação negada: estoque não pode ser negativo.';
    END IF;
END$$

DELIMITER ;


-- =============================================================
-- SEÇÃO 5 — VIEWS
-- =============================================================

-- 5.1 vw_acervo_publico — uso do Aluno; oculta preco_custo
CREATE OR REPLACE VIEW vw_acervo_publico AS
SELECT
    id_livro, titulo, autor, isbn, quantidade_estoque, status
FROM Livros
WHERE status = 'DISPONIVEL';

-- 5.2 vw_livros_atrasados — empréstimos vencidos + contato
CREATE OR REPLACE VIEW vw_livros_atrasados AS
SELECT
    e.id_emprestimo,
    u.nome  AS nome_usuario,
    u.email AS contato,
    l.titulo AS livro,
    e.data_prevista,
    DATEDIFF(CURDATE(), e.data_prevista) AS dias_atraso
FROM Emprestimos e
JOIN Usuarios u ON u.id_usuario = e.id_usuario_fk
JOIN Livros   l ON l.id_livro   = e.id_livro_fk
WHERE e.data_devolucao IS NULL
  AND e.data_prevista < CURDATE();

-- 5.3 vw_ranking_leitura — Top 10 livros mais emprestados
CREATE OR REPLACE VIEW vw_ranking_leitura AS
SELECT
    l.id_livro, l.titulo, l.autor,
    COUNT(e.id_emprestimo) AS total_emprestimos
FROM Livros l
LEFT JOIN Emprestimos e ON e.id_livro_fk = l.id_livro
GROUP BY l.id_livro, l.titulo, l.autor
ORDER BY total_emprestimos DESC
LIMIT 10;

-- 5.4 vw_dashboard_financeiro — totais de multas (SUM)
CREATE OR REPLACE VIEW vw_dashboard_financeiro AS
SELECT
    SUM(valor)                   AS total_arrecadado,
    SUM(IF(pago = 0, valor, 0))  AS total_pendente,
    SUM(IF(pago = 1, valor, 0))  AS total_recebido,
    COUNT(*)                     AS qtd_multas
FROM Multas;

-- 5.5 vw_meus_emprestimos (AJUSTE) — histórico de empréstimos
--     usado pelo menu "Meus Empréstimos" do Aluno (sem acesso a tabelas físicas)
CREATE OR REPLACE VIEW vw_meus_emprestimos AS
SELECT
    e.id_emprestimo,
    e.id_usuario_fk,
    u.nome   AS nome_usuario,
    l.titulo AS titulo_livro,
    e.data_saida,
    e.data_prevista,
    e.data_devolucao
FROM Emprestimos e
JOIN Usuarios u ON u.id_usuario = e.id_usuario_fk
JOIN Livros   l ON l.id_livro   = e.id_livro_fk;


-- -------------------------------------------------------------
-- 5.6 GRANTs nas Views
-- -------------------------------------------------------------

-- Aluno: acervo público + ranking + seu próprio histórico
GRANT SELECT ON db_libritech.vw_acervo_publico   TO 'usr_aluno'@'localhost';
GRANT SELECT ON db_libritech.vw_ranking_leitura  TO 'usr_aluno'@'localhost';
GRANT SELECT ON db_libritech.vw_meus_emprestimos TO 'usr_aluno'@'localhost';

-- Bibliotecário e Estagiário: relatórios operacionais (atrasados/ranking)
GRANT SELECT ON db_libritech.vw_livros_atrasados TO 'usr_bibliotecario'@'localhost', 'usr_estagiario'@'localhost';
GRANT SELECT ON db_libritech.vw_ranking_leitura  TO 'usr_bibliotecario'@'localhost', 'usr_estagiario'@'localhost';

-- vw_dashboard_financeiro: SEM grant extra — fica restrita ao usr_gerente
-- (ALL PRIVILEGES já cobre). Dados financeiros sensíveis = privilégio mínimo.

FLUSH PRIVILEGES;


-- =============================================================
-- SEÇÃO 6 — ÍNDICES
-- =============================================================

-- Índice 1: titulo — buscas de livros por nome (Consultar Acervo / Cadastrar)
CREATE INDEX idx_livros_titulo ON Livros(titulo);

-- Índice 2: cpf — autenticação/login e busca de usuário
CREATE INDEX idx_usuarios_cpf ON Usuarios(cpf);

-- Índice 3: data_prevista — usado por vw_livros_atrasados (executada com frequência)
CREATE INDEX idx_emp_data_prevista ON Emprestimos(data_prevista);


-- =============================================================
-- FIM DO SCRIPT DE CRIAÇÃO
-- =============================================================
