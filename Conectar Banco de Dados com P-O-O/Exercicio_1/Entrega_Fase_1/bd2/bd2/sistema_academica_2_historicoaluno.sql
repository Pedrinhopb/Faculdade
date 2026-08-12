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
-- Table structure for table `historicoaluno`
--

DROP TABLE IF EXISTS `historicoaluno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historicoaluno` (
  `ID_Historico` int NOT NULL AUTO_INCREMENT,
  `ID_Aluno` int DEFAULT NULL,
  `ID_Disciplina` int DEFAULT NULL,
  `NotaFinal` decimal(4,2) DEFAULT NULL,
  `Status` varchar(10) DEFAULT NULL,
  `DataConclusao` date DEFAULT NULL,
  PRIMARY KEY (`ID_Historico`),
  KEY `ID_Aluno` (`ID_Aluno`),
  KEY `ID_Disciplina` (`ID_Disciplina`),
  CONSTRAINT `historicoaluno_ibfk_1` FOREIGN KEY (`ID_Aluno`) REFERENCES `alunos` (`ID_Aluno`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `historicoaluno_ibfk_2` FOREIGN KEY (`ID_Disciplina`) REFERENCES `disciplinas` (`ID_Disciplina`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Checar_Historico_Status` CHECK ((`Status` in (_utf8mb4'Aprovado',_utf8mb4'Reprovado')))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historicoaluno`
--

LOCK TABLES `historicoaluno` WRITE;
/*!40000 ALTER TABLE `historicoaluno` DISABLE KEYS */;
INSERT INTO `historicoaluno` VALUES (1,1,1,8.50,'Aprovado','2026-05-19'),(2,5,1,8.50,'Aprovado','2026-05-19');
/*!40000 ALTER TABLE `historicoaluno` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-19 10:51:45
