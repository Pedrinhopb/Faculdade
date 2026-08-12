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
-- Table structure for table `logssistema`
--

DROP TABLE IF EXISTS `logssistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logssistema` (
  `ID_Log` int NOT NULL AUTO_INCREMENT,
  `Usuario` varchar(120) DEFAULT NULL,
  `Acao` varchar(60) DEFAULT NULL,
  `TabelaAfetada` varchar(60) DEFAULT NULL,
  `DataHora` datetime DEFAULT CURRENT_TIMESTAMP,
  `Descricao` text,
  PRIMARY KEY (`ID_Log`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logssistema`
--

LOCK TABLES `logssistema` WRITE;
/*!40000 ALTER TABLE `logssistema` DISABLE KEYS */;
INSERT INTO `logssistema` VALUES (1,'Aluno#1','INSERT','Matriculas','2026-05-19 09:51:43','Matrícula registrada — Aluno: 1 | Turma: 1'),(2,'Sistema','UPDATE','Matriculas','2026-05-19 09:52:11','Nota 8.50 lançada — Matrícula: 1 | Status: Aprovado'),(3,'Aluno#1','ERRO','Matriculas','2026-05-19 09:52:22','Erro inesperado ao registrar matrícula — transação revertida.'),(4,'Aluno#1','ERRO','Matriculas','2026-05-19 09:52:36','Erro inesperado ao registrar matrícula — transação revertida.'),(5,'Aluno#1','ERRO','Matriculas','2026-05-19 09:53:19','Erro inesperado ao registrar matrícula — transação revertida.'),(6,'Aluno#1','ERRO','Matriculas','2026-05-19 09:53:40','Erro inesperado ao registrar matrícula — transação revertida.'),(7,'Aluno#2','INSERT','Matriculas','2026-05-19 09:54:56','Matrícula registrada — Aluno: 2 | Turma: 3'),(8,'Aluno#1','ERRO','Matriculas','2026-05-19 10:00:42','Erro inesperado ao registrar matrícula — transação revertida.'),(9,'Aluno#1','UPDATE','Matriculas','2026-05-19 10:03:07','Matrícula 6 trancada por Aluno#1'),(10,'Aluno#2','ERRO','Matriculas','2026-05-19 10:08:06','Erro inesperado ao registrar matrícula — transação revertida.'),(11,'Aluno#4','ERRO','Matriculas','2026-05-19 10:10:58','Erro inesperado ao registrar matrícula — transação revertida.'),(12,'Aluno#4','ERRO','Matriculas','2026-05-19 10:11:28','Erro inesperado ao registrar matrícula — transação revertida.'),(13,'Aluno#5','ERRO','Matriculas','2026-05-19 10:13:22','Erro inesperado ao registrar matrícula — transação revertida.'),(14,'Aluno#5','ERRO','Matriculas','2026-05-19 10:15:56','Erro inesperado ao registrar matrícula — transação revertida.'),(15,'Aluno#6','ERRO','Matriculas','2026-05-19 10:16:17','Erro inesperado ao registrar matrícula — transação revertida.'),(16,'Aluno#7','ERRO','Matriculas','2026-05-19 10:16:23','Erro inesperado ao registrar matrícula — transação revertida.'),(17,'Aluno#1','INSERT','HistoricoAluno','2026-05-19 10:17:37','Histórico gerado para João Pedro — 0 disciplina(s) inserida(s).'),(18,'Aluno#2','INSERT','HistoricoAluno','2026-05-19 10:17:41','Histórico gerado para Aluno 1 — 0 disciplina(s) inserida(s).'),(19,'Aluno#3','INSERT','HistoricoAluno','2026-05-19 10:17:43','Histórico gerado para Aluno 2 — 0 disciplina(s) inserida(s).'),(20,'Aluno#4','INSERT','HistoricoAluno','2026-05-19 10:17:46','Histórico gerado para Teste Novo — 0 disciplina(s) inserida(s).'),(21,'Aluno#5','INSERT','HistoricoAluno','2026-05-19 10:17:48','Histórico gerado para Aluno Teste Notas — 0 disciplina(s) inserida(s).'),(22,'Aluno#1','INSERT','HistoricoAluno','2026-05-19 10:18:27','Histórico gerado para João Pedro — 0 disciplina(s) inserida(s).'),(23,'Aluno#2','INSERT','HistoricoAluno','2026-05-19 10:18:31','Histórico gerado para Aluno 1 — 0 disciplina(s) inserida(s).'),(24,'Aluno#3','INSERT','HistoricoAluno','2026-05-19 10:18:35','Histórico gerado para Aluno 2 — 0 disciplina(s) inserida(s).'),(25,'Aluno#5','INSERT','Matriculas','2026-05-19 10:20:02','Matrícula registrada — Aluno: 5 | Turma: 4'),(26,'Sistema','UPDATE','Matriculas','2026-05-19 10:20:38','Nota 8.50 lançada — Matrícula: 15 | Status: Aprovado'),(27,'Aluno#5','INSERT','HistoricoAluno','2026-05-19 10:20:54','Histórico gerado para Aluno Teste Notas — 0 disciplina(s) inserida(s).'),(28,'Aluno#1','INSERT','HistoricoAluno','2026-05-19 10:21:18','Histórico gerado para João Pedro — 0 disciplina(s) inserida(s).'),(29,'Aluno#2','INSERT','HistoricoAluno','2026-05-19 10:21:19','Histórico gerado para Aluno 1 — 0 disciplina(s) inserida(s).'),(30,'Aluno#3','INSERT','HistoricoAluno','2026-05-19 10:21:22','Histórico gerado para Aluno 2 — 0 disciplina(s) inserida(s).'),(31,'Aluno#4','INSERT','HistoricoAluno','2026-05-19 10:21:29','Histórico gerado para Teste Novo — 0 disciplina(s) inserida(s).'),(32,'Aluno#5','INSERT','HistoricoAluno','2026-05-19 10:21:31','Histórico gerado para Aluno Teste Notas — 0 disciplina(s) inserida(s).'),(33,'Aluno#5','INSERT','HistoricoAluno','2026-05-19 10:22:12','Histórico gerado para Aluno Teste Notas — 0 disciplina(s) inserida(s).'),(34,'Aluno#5','ERRO','Matriculas','2026-05-19 10:32:22','Erro inesperado ao registrar matrícula — transação revertida.'),(35,'Aluno#5','ERRO','Matriculas','2026-05-19 10:32:31','Erro inesperado ao registrar matrícula — transação revertida.');
/*!40000 ALTER TABLE `logssistema` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-19 10:51:44
