-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: sistema_academica_2
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary view structure for view `vw_turmasdisponiveis`
--

DROP TABLE IF EXISTS `vw_turmasdisponiveis`;
/*!50001 DROP VIEW IF EXISTS `vw_turmasdisponiveis`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_turmasdisponiveis` AS SELECT 
 1 AS `Semestre`,
 1 AS `Disciplina`,
 1 AS `Professor`,
 1 AS `VagasTotal`,
 1 AS `VagasOcupadas`,
 1 AS `VagasDisponiveis`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_boletimaluno`
--

DROP TABLE IF EXISTS `vw_boletimaluno`;
/*!50001 DROP VIEW IF EXISTS `vw_boletimaluno`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_boletimaluno` AS SELECT 
 1 AS `NomeAluno`,
 1 AS `Semestre`,
 1 AS `Disciplina`,
 1 AS `Professor`,
 1 AS `Nota`,
 1 AS `Status`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_logauditoria`
--

DROP TABLE IF EXISTS `vw_logauditoria`;
/*!50001 DROP VIEW IF EXISTS `vw_logauditoria`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_logauditoria` AS SELECT 
 1 AS `CodigoLog`,
 1 AS `Usuario`,
 1 AS `Acao`,
 1 AS `Tabela`,
 1 AS `DataHora`,
 1 AS `Descricao`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_desempenhoturma`
--

DROP TABLE IF EXISTS `vw_desempenhoturma`;
/*!50001 DROP VIEW IF EXISTS `vw_desempenhoturma`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_desempenhoturma` AS SELECT 
 1 AS `Disciplina`,
 1 AS `Professor`,
 1 AS `TotalAlunos`,
 1 AS `MediaNotas`,
 1 AS `TotalAprovados`,
 1 AS `TotalReprovados`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `vw_turmasdisponiveis`
--

/*!50001 DROP VIEW IF EXISTS `vw_turmasdisponiveis`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_turmasdisponiveis` AS select `s`.`CodigoSemestre` AS `Semestre`,`d`.`NomeDisciplina` AS `Disciplina`,`p`.`Nome` AS `Professor`,`t`.`MaxVagas` AS `VagasTotal`,`t`.`VagasOcupadas` AS `VagasOcupadas`,(`t`.`MaxVagas` - `t`.`VagasOcupadas`) AS `VagasDisponiveis` from (((`turmas` `t` join `semestres` `s` on((`s`.`ID_Semestre` = `t`.`ID_Semestre`))) join `disciplinas` `d` on((`d`.`ID_Disciplina` = `t`.`ID_Disciplina`))) join `professores` `p` on((`p`.`ID_Professor` = `t`.`ID_Professor`))) where ((`s`.`AbertoParaMatricula` = true) and (`t`.`VagasOcupadas` < `t`.`MaxVagas`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_boletimaluno`
--

/*!50001 DROP VIEW IF EXISTS `vw_boletimaluno`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_boletimaluno` AS select `a`.`Nome` AS `NomeAluno`,`s`.`CodigoSemestre` AS `Semestre`,`d`.`NomeDisciplina` AS `Disciplina`,`p`.`Nome` AS `Professor`,`m`.`NotaFinal` AS `Nota`,`m`.`Status` AS `Status` from (((((`matriculas` `m` join `alunos` `a` on((`a`.`ID_Aluno` = `m`.`ID_Aluno`))) join `turmas` `t` on((`t`.`ID_Turma` = `m`.`ID_Turma`))) join `disciplinas` `d` on((`d`.`ID_Disciplina` = `t`.`ID_Disciplina`))) join `professores` `p` on((`p`.`ID_Professor` = `t`.`ID_Professor`))) join `semestres` `s` on((`s`.`ID_Semestre` = `t`.`ID_Semestre`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_logauditoria`
--

/*!50001 DROP VIEW IF EXISTS `vw_logauditoria`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_logauditoria` AS select `logssistema`.`ID_Log` AS `CodigoLog`,`logssistema`.`Usuario` AS `Usuario`,`logssistema`.`Acao` AS `Acao`,`logssistema`.`TabelaAfetada` AS `Tabela`,`logssistema`.`DataHora` AS `DataHora`,`logssistema`.`Descricao` AS `Descricao` from `logssistema` order by `logssistema`.`DataHora` desc limit 20 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_desempenhoturma`
--

/*!50001 DROP VIEW IF EXISTS `vw_desempenhoturma`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_desempenhoturma` AS select `d`.`NomeDisciplina` AS `Disciplina`,`p`.`Nome` AS `Professor`,count(`m`.`ID_Matricula`) AS `TotalAlunos`,round(avg(`m`.`NotaFinal`),2) AS `MediaNotas`,sum((`m`.`Status` = 'Aprovado')) AS `TotalAprovados`,sum((`m`.`Status` = 'Reprovado')) AS `TotalReprovados` from (((`turmas` `t` join `disciplinas` `d` on((`d`.`ID_Disciplina` = `t`.`ID_Disciplina`))) join `professores` `p` on((`p`.`ID_Professor` = `t`.`ID_Professor`))) join `matriculas` `m` on((`m`.`ID_Turma` = `t`.`ID_Turma`))) where (`m`.`Status` in ('Aprovado','Reprovado')) group by `t`.`ID_Turma`,`d`.`NomeDisciplina`,`p`.`Nome` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Dumping events for database 'sistema_academica_2'
--

--
-- Dumping routines for database 'sistema_academica_2'
--
/*!50003 DROP FUNCTION IF EXISTS `fn_CalcularCoeficienteRendimento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_CalcularCoeficienteRendimento`(
    p_ID_Aluno INT
) RETURNS decimal(4,2)
    READS SQL DATA
    DETERMINISTIC
BEGIN
    DECLARE v_CR DECIMAL(4,2);

    SELECT ROUND(
        SUM(h.NotaFinal * d.CargaHoraria) / SUM(d.CargaHoraria)
    , 2)
    INTO v_CR
    FROM HistoricoAluno h
    JOIN Disciplinas d ON d.ID_Disciplina = h.ID_Disciplina
    WHERE h.ID_Aluno = p_ID_Aluno
      AND h.Status   = 'Aprovado';

    RETURN IFNULL(v_CR, 0.00);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_ContarDisciplinasPendentes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ContarDisciplinasPendentes`(
    p_ID_Aluno  INT,
    p_ID_Curso  INT
) RETURNS int
    READS SQL DATA
    DETERMINISTIC
BEGIN
    DECLARE v_Pendentes INT;

    SELECT COUNT(*) INTO v_Pendentes
    FROM Disciplinas_Curriculo dc
    JOIN Curriculos c ON c.ID_Curriculo = dc.ID_Curriculo
    WHERE c.ID_Curso = p_ID_Curso
      AND NOT EXISTS (
            SELECT 1
            FROM HistoricoAluno h
            WHERE h.ID_Aluno = p_ID_Aluno
              AND h.ID_Disciplina = dc.ID_Disciplina
              AND h.Status = 'Aprovado'
      );

    RETURN IFNULL(v_Pendentes, 0);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_ListarDisciplinasAprovadas` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ListarDisciplinasAprovadas`(
    p_ID_Aluno INT
) RETURNS text CHARSET utf8mb4
    READS SQL DATA
    DETERMINISTIC
BEGIN
    DECLARE v_Lista TEXT DEFAULT '';
    DECLARE v_Nome VARCHAR(120);
    DECLARE v_Nota DECIMAL(4,2);
    DECLARE v_Data DATE;
    DECLARE v_Fim BOOLEAN DEFAULT FALSE;

    DECLARE cur CURSOR FOR
        SELECT
            d.NomeDisciplina,
            h.NotaFinal,
            h.DataConclusao
        FROM HistoricoAluno h
        JOIN Disciplinas d ON d.ID_Disciplina = h.ID_Disciplina
        WHERE h.ID_Aluno = p_ID_Aluno
          AND h.Status = 'Aprovado'
        ORDER BY h.DataConclusao;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_Fim = TRUE;

    -- Aluno existe?
    IF NOT EXISTS (SELECT 1 FROM Alunos WHERE ID_Aluno = p_ID_Aluno) THEN
        RETURN 'ERRO: Aluno não encontrado.';
    END IF;

    OPEN cur;

    leitura: LOOP
        FETCH cur INTO v_Nome, v_Nota, v_Data;

        IF v_Fim THEN
            LEAVE leitura;
        END IF;

        -- Monta linha por linha
        SET v_Lista = CONCAT(v_Lista,
            '| ', v_Nome,
            ' | Nota: ', v_Nota,
            ' | Concluída: ', v_Data,
            ' |', '\n'
        );
    END LOOP;

    CLOSE cur;

    -- Nenhuma disciplina aprovada
    IF v_Lista = '' THEN
        RETURN 'Aluno não possui disciplinas aprovadas.';
    END IF;

    RETURN v_Lista;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_TotalHorasConcluidas` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_TotalHorasConcluidas`(
    p_ID_Aluno INT
) RETURNS int
    READS SQL DATA
    DETERMINISTIC
BEGIN
    DECLARE v_TotalHoras INT;

    -- Aluno existe?
    IF NOT EXISTS (SELECT 1 FROM Alunos WHERE ID_Aluno = p_ID_Aluno) THEN
        RETURN -1;  -- Sinaliza erro
    END IF;

    -- Soma carga horária das disciplinas aprovadas
    SELECT IFNULL(SUM(d.CargaHoraria), 0)
    INTO v_TotalHoras
    FROM HistoricoAluno h
    JOIN Disciplinas d ON d.ID_Disciplina = h.ID_Disciplina
    WHERE h.ID_Aluno = p_ID_Aluno
      AND h.Status   = 'Aprovado';

    RETURN v_TotalHoras;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_GerarHistoricoAluno` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GerarHistoricoAluno`(
    IN p_ID_Aluno INT
)
sp_GerarHistoricoAluno: BEGIN
    DECLARE v_NomeAluno VARCHAR(120);
    DECLARE v_TotalInserido INT DEFAULT 0;

    -- 1) Aluno existe?
    SELECT Nome INTO v_NomeAluno
    FROM Alunos
    WHERE ID_Aluno = p_ID_Aluno;

    IF v_NomeAluno IS NULL THEN
        SELECT 'ERRO: Aluno não encontrado.' AS Mensagem;
        LEAVE sp_GerarHistoricoAluno;
    END IF;

    -- Inicia transação
    START TRANSACTION;

        -- 2) Insere no histórico as disciplinas aprovadas
        --    que ainda não foram registradas
        INSERT INTO HistoricoAluno
            (ID_Aluno, ID_Disciplina, NotaFinal, Status, DataConclusao)
        SELECT
            m.ID_Aluno,
            t.ID_Disciplina,
            m.NotaFinal,
            m.Status,
            CURDATE()
        FROM Matriculas m
        JOIN Turmas t ON t.ID_Turma = m.ID_Turma
        WHERE m.ID_Aluno  = p_ID_Aluno
          AND m.Status    = 'Aprovado'
          AND NOT EXISTS (
                SELECT 1
                FROM HistoricoAluno h
                WHERE h.ID_Aluno      = m.ID_Aluno
                  AND h.ID_Disciplina = t.ID_Disciplina
          );

        -- 3) Quantidade de registros inseridos
        SET v_TotalInserido = ROW_COUNT();

        -- 4) Registra no log
        INSERT INTO LogsSistema (Usuario, Acao, TabelaAfetada, Descricao)
        VALUES (
            CONCAT('Aluno#', p_ID_Aluno),
            'INSERT',
            'HistoricoAluno',
            CONCAT('Histórico gerado para ', v_NomeAluno,
                   ' — ', v_TotalInserido, ' disciplina(s) inserida(s).')
        );

    COMMIT;

    SELECT CONCAT('OK: Histórico gerado. ',
                  v_TotalInserido, ' disciplina(s) inserida(s) para ',
                  v_NomeAluno, '.') AS Mensagem;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_LancarNotas` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_LancarNotas`(
    IN p_ID_Matricula INT,
    IN p_NotaFinal DECIMAL(4,2)
)
sp_LancarNotas: BEGIN
    DECLARE v_ID_Aluno INT;
    DECLARE v_ID_Disciplina INT;
    DECLARE v_Status VARCHAR(10);
    DECLARE v_NovoStatus VARCHAR(10);

    -- Handler de erro → ROLLBACK automático
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        INSERT INTO LogsSistema (Usuario, Acao, TabelaAfetada, Descricao)
        VALUES (
            'Sistema',
            'ERRO',
            'Matriculas',
            CONCAT('Erro ao lançar nota na matrícula ', p_ID_Matricula,
                   ' — transação revertida.')
        );
        SELECT 'ERRO: Falha inesperada. Transação revertida.' AS Mensagem;
    END;

    -- Busca informações da matrícula
    SELECT  m.ID_Aluno,
            t.ID_Disciplina,
            m.Status
    INTO    v_ID_Aluno,
            v_ID_Disciplina,
            v_Status
    FROM Matriculas m
    JOIN Turmas t ON t.ID_Turma = m.ID_Turma
    WHERE m.ID_Matricula = p_ID_Matricula;

    -- 1) Matrícula existe?
    IF v_ID_Aluno IS NULL THEN
        SELECT 'ERRO: Matrícula não encontrada.' AS Mensagem;
        LEAVE sp_LancarNotas;
    END IF;

    -- 2) Status é Cursando?
    IF v_Status <> 'Cursando' THEN
        SELECT 'ERRO: Só é possível lançar nota em matrículas com status Cursando.' AS Mensagem;
        LEAVE sp_LancarNotas;
    END IF;

    -- 3) Nota válida?
    IF p_NotaFinal < 0 OR p_NotaFinal > 10 THEN
        SELECT 'ERRO: Nota deve estar entre 0 e 10.' AS Mensagem;
        LEAVE sp_LancarNotas;
    END IF;

    -- 4) Define novo status
    IF p_NotaFinal >= 7 THEN
        SET v_NovoStatus = 'Aprovado';
    ELSE
        SET v_NovoStatus = 'Reprovado';
    END IF;

    -- Validações passaram → inicia transação
    START TRANSACTION;

        UPDATE Matriculas
        SET NotaFinal = p_NotaFinal,
            Status = v_NovoStatus
        WHERE ID_Matricula = p_ID_Matricula;

        INSERT INTO LogsSistema (Usuario, Acao, TabelaAfetada, Descricao)
        VALUES (
            'Sistema',
            'UPDATE',
            'Matriculas',
            CONCAT('Nota ', p_NotaFinal, ' lançada — Matrícula: ', p_ID_Matricula,
                   ' | Status: ', v_NovoStatus)
        );

    COMMIT;

    SELECT CONCAT('OK: Nota lançada. Aluno ', v_NovoStatus, '.') AS Mensagem;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_ReabrirPeriodoMatricula` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ReabrirPeriodoMatricula`(
    IN p_ID_Semestre INT
)
sp_ReabrirPeriodoMatricula: BEGIN
    DECLARE v_CodigoSemestre VARCHAR(10);
    DECLARE v_StatusAtual BOOLEAN;

    -- Busca informações do semestre
    SELECT CodigoSemestre,
           AbertoParaMatricula
    INTO   v_CodigoSemestre,
           v_StatusAtual
    FROM Semestres
    WHERE ID_Semestre = p_ID_Semestre;

    -- 1) Semestre existe?
    IF v_CodigoSemestre IS NULL THEN
        SELECT 'ERRO: Semestre não encontrado.' AS Mensagem;
        LEAVE sp_ReabrirPeriodoMatricula;
    END IF;

    -- 2) Já está aberto?
    IF v_StatusAtual = TRUE THEN
        SELECT CONCAT('ERRO: Semestre "', v_CodigoSemestre,
                      '" já está aberto para matrículas.') AS Mensagem;
        LEAVE sp_ReabrirPeriodoMatricula;
    END IF;

    -- Validações passaram → inicia transação
    START TRANSACTION;

        -- Reabre o semestre
        UPDATE Semestres
        SET AbertoParaMatricula = TRUE
        WHERE ID_Semestre = p_ID_Semestre;

        -- Registra no log
        INSERT INTO LogsSistema (Usuario, Acao, TabelaAfetada, Descricao)
        VALUES (
            'Admin',
            'UPDATE',
            'Semestres',
            CONCAT('Semestre "', v_CodigoSemestre, '" reaberto para matrículas.')
        );

    COMMIT;

    SELECT CONCAT('OK: Semestre "', v_CodigoSemestre,
                  '" reaberto para matrículas com sucesso.') AS Mensagem;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_RegistrarMatricula` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_RegistrarMatricula`(
    IN p_ID_Aluno INT,
    IN p_ID_Turma INT
)
sp_RegistrarMatricula: BEGIN
    DECLARE v_SemestreAberto INT;
    DECLARE v_VagasDisponiveis INT;
    DECLARE v_ID_Semestre INT;
    DECLARE v_ID_Disciplina INT;
    DECLARE v_PreRequisitoPendente INT;
    DECLARE v_JaMatriculado INT;

    -- Handler de erro → ROLLBACK automático
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        INSERT INTO LogsSistema (Usuario, Acao, TabelaAfetada, Descricao)
        VALUES (
            CONCAT('Aluno#', p_ID_Aluno),
            'ERRO',
            'Matriculas',
            'Erro inesperado ao registrar matrícula — transação revertida.'
        );
        SELECT 'ERRO: Falha inesperada. Transação revertida.' AS Mensagem;
    END;

    -- Busca informações da turma e semestre
    SELECT  t.ID_Disciplina,
            t.MaxVagas - t.VagasOcupadas,
            s.ID_Semestre,
            s.AbertoParaMatricula
    INTO    v_ID_Disciplina,
            v_VagasDisponiveis,
            v_ID_Semestre,
            v_SemestreAberto
    FROM Turmas t
    JOIN Semestres s ON s.ID_Semestre = t.ID_Semestre
    WHERE t.ID_Turma = p_ID_Turma;

    -- 1) Semestre está aberto?
    IF v_SemestreAberto = FALSE THEN
        SELECT 'ERRO: Semestre não está aberto para matrículas.' AS Mensagem;
        LEAVE sp_RegistrarMatricula;
    END IF;

    -- 2) Turma tem vagas?
    IF v_VagasDisponiveis <= 0 THEN
        SELECT 'ERRO: Turma sem vagas disponíveis.' AS Mensagem;
        LEAVE sp_RegistrarMatricula;
    END IF;

    -- 3) Pré-requisitos cumpridos?
    SELECT COUNT(*) INTO v_PreRequisitoPendente
    FROM PreRequisitos pr
    WHERE pr.ID_Disciplina_Principal = v_ID_Disciplina
      AND NOT EXISTS (
            SELECT 1 FROM HistoricoAluno h
            WHERE h.ID_Aluno      = p_ID_Aluno
              AND h.ID_Disciplina = pr.ID_Disciplina_PreRequisito
              AND h.Status        = 'Aprovado'
      );

    IF v_PreRequisitoPendente > 0 THEN
        SELECT 'ERRO: Pré-requisito(s) não cumprido(s).' AS Mensagem;
        LEAVE sp_RegistrarMatricula;
    END IF;

    -- 4) Já matriculado na mesma disciplina?
    SELECT COUNT(*) INTO v_JaMatriculado
    FROM Matriculas m
    JOIN Turmas t ON t.ID_Turma = m.ID_Turma
    WHERE m.ID_Aluno = p_ID_Aluno
      AND t.ID_Disciplina = v_ID_Disciplina
      AND m.Status = 'Cursando';

    IF v_JaMatriculado > 0 THEN
        SELECT 'ERRO: Aluno já está matriculado nesta disciplina.' AS Mensagem;
        LEAVE sp_RegistrarMatricula;
    END IF;

    -- Todas as validações passaram → inicia transação
    START TRANSACTION;

        INSERT INTO Matriculas (ID_Aluno, ID_Turma, Status)
        VALUES (p_ID_Aluno, p_ID_Turma, 'Cursando');

        INSERT INTO LogsSistema (Usuario, Acao, TabelaAfetada, Descricao)
        VALUES (
            CONCAT('Aluno#', p_ID_Aluno),
            'INSERT',
            'Matriculas',
            CONCAT('Matrícula registrada — Aluno: ', p_ID_Aluno,
                   ' | Turma: ', p_ID_Turma)
        );

    COMMIT;

    SELECT 'OK: Matrícula realizada com sucesso.' AS Mensagem;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_TrancarMatricula` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_TrancarMatricula`(
    IN p_ID_Matricula INT,
    IN p_Usuario VARCHAR(120)
)
sp_TrancarMatricula: BEGIN
    DECLARE v_ID_Turma INT;
    DECLARE v_Status VARCHAR(10);

    -- Handler de erro → ROLLBACK automático
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        INSERT INTO LogsSistema (Usuario, Acao, TabelaAfetada, Descricao)
        VALUES (
            p_Usuario,
            'ERRO',
            'Matriculas',
            CONCAT('Erro ao trancar matrícula ', p_ID_Matricula,
                   ' — transação revertida.')
        );
        SELECT 'ERRO: Falha inesperada. Transação revertida.' AS Mensagem;
    END;

    -- Busca informações da matrícula
    SELECT ID_Turma, Status
    INTO   v_ID_Turma, v_Status
    FROM Matriculas
    WHERE ID_Matricula = p_ID_Matricula;

    -- 1) Matrícula existe?
    IF v_ID_Turma IS NULL THEN
        SELECT 'ERRO: Matrícula não encontrada.' AS Mensagem;
        LEAVE sp_TrancarMatricula;
    END IF;

    -- 2) Status é Cursando?
    IF v_Status <> 'Cursando' THEN
        SELECT CONCAT('ERRO: Matrícula com status "', v_Status,
                      '" não pode ser trancada.') AS Mensagem;
        LEAVE sp_TrancarMatricula;
    END IF;

    -- Validações passaram → inicia transação
    START TRANSACTION;

        UPDATE Matriculas
        SET Status = 'Trancado'
        WHERE ID_Matricula = p_ID_Matricula;

        UPDATE Turmas
        SET VagasOcupadas = VagasOcupadas - 1
        WHERE ID_Turma = v_ID_Turma;

        INSERT INTO LogsSistema (Usuario, Acao, TabelaAfetada, Descricao)
        VALUES (
            p_Usuario,
            'UPDATE',
            'Matriculas',
            CONCAT('Matrícula ', p_ID_Matricula, ' trancada por ', p_Usuario)
        );

    COMMIT;

    SELECT 'OK: Matrícula trancada com sucesso.' AS Mensagem;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-19 10:51:45
