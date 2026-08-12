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
-- Table structure for table `turmas`
--

DROP TABLE IF EXISTS `turmas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turmas` (
  `ID_Turma` int NOT NULL AUTO_INCREMENT,
  `ID_Disciplina` int DEFAULT NULL,
  `ID_Professor` int DEFAULT NULL,
  `ID_Semestre` int DEFAULT NULL,
  `MaxVagas` int DEFAULT NULL,
  `VagasOcupadas` int DEFAULT '0',
  PRIMARY KEY (`ID_Turma`),
  KEY `ID_Disciplina` (`ID_Disciplina`),
  KEY `ID_Professor` (`ID_Professor`),
  KEY `ID_Semestre` (`ID_Semestre`),
  CONSTRAINT `turmas_ibfk_1` FOREIGN KEY (`ID_Disciplina`) REFERENCES `disciplinas` (`ID_Disciplina`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `turmas_ibfk_2` FOREIGN KEY (`ID_Professor`) REFERENCES `professores` (`ID_Professor`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `turmas_ibfk_3` FOREIGN KEY (`ID_Semestre`) REFERENCES `semestres` (`ID_Semestre`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Checar_Vagas_Validas` CHECK (((`VagasOcupadas` <= `MaxVagas`) and (`VagasOcupadas` >= 0))),
  CONSTRAINT `turmas_chk_1` CHECK ((`MaxVagas` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turmas`
--

LOCK TABLES `turmas` WRITE;
/*!40000 ALTER TABLE `turmas` DISABLE KEYS */;
INSERT INTO `turmas` VALUES (1,1,1,1,30,1),(2,2,1,1,30,0),(3,1,1,1,1,0),(4,1,1,1,5,1);
/*!40000 ALTER TABLE `turmas` ENABLE KEYS */;
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
