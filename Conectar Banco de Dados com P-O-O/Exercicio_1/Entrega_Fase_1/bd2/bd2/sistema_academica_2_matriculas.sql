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
-- Table structure for table `matriculas`
--

DROP TABLE IF EXISTS `matriculas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `matriculas` (
  `ID_Matricula` int NOT NULL AUTO_INCREMENT,
  `ID_Aluno` int DEFAULT NULL,
  `ID_Turma` int DEFAULT NULL,
  `Status` varchar(10) DEFAULT 'Cursando',
  `NotaFinal` decimal(4,2) DEFAULT NULL,
  PRIMARY KEY (`ID_Matricula`),
  UNIQUE KEY `ID_Aluno` (`ID_Aluno`),
  UNIQUE KEY `ID_Turma` (`ID_Turma`),
  CONSTRAINT `matriculas_ibfk_1` FOREIGN KEY (`ID_Aluno`) REFERENCES `alunos` (`ID_Aluno`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `matriculas_ibfk_2` FOREIGN KEY (`ID_Turma`) REFERENCES `turmas` (`ID_Turma`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Checar_Nota_Status` CHECK (((`NotaFinal` is null) or (`Status` <> _utf8mb4'Cursando'))),
  CONSTRAINT `Checar_Status_Matricula` CHECK ((`Status` in (_utf8mb4'Cursando',_utf8mb4'Aprovado',_utf8mb4'Reprovado',_utf8mb4'Trancado')))
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matriculas`
--

LOCK TABLES `matriculas` WRITE;
/*!40000 ALTER TABLE `matriculas` DISABLE KEYS */;
INSERT INTO `matriculas` VALUES (1,1,1,'Aprovado',8.50),(6,2,3,'Trancado',NULL),(15,5,4,'Aprovado',8.50);
/*!40000 ALTER TABLE `matriculas` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_AtualizarStatusAutomaticamente` BEFORE INSERT ON `matriculas` FOR EACH ROW BEGIN
    DECLARE v_Conta INT;
    DECLARE v_Semestre INT;

    -- Busca o semestre da turma que o aluno quer entrar
    SELECT ID_Semestre INTO v_Semestre
    FROM Turmas
    WHERE ID_Turma = NEW.ID_Turma;

    -- Conta disciplinas 'Cursando' no mesmo semestre
    SELECT COUNT(*) INTO v_Conta
    FROM Matriculas m
    JOIN Turmas t ON t.ID_Turma = m.ID_Turma
    WHERE m.ID_Aluno = NEW.ID_Aluno
      AND m.Status = 'Cursando'
      AND t.ID_Semestre = v_Semestre;

    -- Se já tiver 6 → bloqueia e registra
    IF v_Conta >= 6 THEN

        INSERT INTO LogsSistema (Usuario, Acao, TabelaAfetada, Descricao)
        VALUES (
            CONCAT('Aluno#', NEW.ID_Aluno),
            'BLOQUEADO',
            'Matriculas',
            CONCAT('Tentativa bloqueada — Aluno: ', NEW.ID_Aluno,
                   ' já possui 6 disciplinas ativas no semestre ', v_Semestre)
        );

        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'ERRO: Limite de 6 disciplinas por semestre atingido.';

    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_AtualizarContagemVagas` AFTER INSERT ON `matriculas` FOR EACH ROW BEGIN
    UPDATE Turmas
    SET VagasOcupadas = VagasOcupadas + 1
    WHERE ID_Turma = NEW.ID_Turma;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_AtualizarHistoricoAutomaticamente` AFTER UPDATE ON `matriculas` FOR EACH ROW BEGIN
    DECLARE v_ID_Disciplina INT;

    -- Só age se o status mudou para 'Aprovado'
    IF OLD.Status <> 'Aprovado' AND NEW.Status = 'Aprovado' THEN

        -- Busca a disciplina da turma
        SELECT ID_Disciplina INTO v_ID_Disciplina
        FROM Turmas
        WHERE ID_Turma = NEW.ID_Turma;

        -- Insere no histórico
        INSERT INTO HistoricoAluno
            (ID_Aluno, ID_Disciplina, NotaFinal, Status, DataConclusao)
        VALUES
            (NEW.ID_Aluno, v_ID_Disciplina, NEW.NotaFinal, 'Aprovado', CURDATE());

    END IF;
END */;;
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

-- Dump completed on 2026-05-19 10:51:44
