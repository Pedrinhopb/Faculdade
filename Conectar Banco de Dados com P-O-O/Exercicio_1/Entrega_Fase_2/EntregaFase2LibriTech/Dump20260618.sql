CREATE DATABASE  IF NOT EXISTS `db_libritech` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `db_libritech`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: db_libritech
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
-- Table structure for table `emprestimos`
--

DROP TABLE IF EXISTS `emprestimos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emprestimos` (
  `id_emprestimo` int NOT NULL AUTO_INCREMENT,
  `id_usuario_fk` int NOT NULL,
  `id_livro_fk` int NOT NULL,
  `data_saida` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_prevista` date NOT NULL,
  `data_devolucao` datetime DEFAULT NULL,
  PRIMARY KEY (`id_emprestimo`),
  KEY `fk_emp_usuario` (`id_usuario_fk`),
  KEY `fk_emp_livro` (`id_livro_fk`),
  CONSTRAINT `fk_emp_livro` FOREIGN KEY (`id_livro_fk`) REFERENCES `livros` (`id_livro`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_emp_usuario` FOREIGN KEY (`id_usuario_fk`) REFERENCES `usuarios` (`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emprestimos`
--

LOCK TABLES `emprestimos` WRITE;
/*!40000 ALTER TABLE `emprestimos` DISABLE KEYS */;
INSERT INTO `emprestimos` VALUES (1,5,2,'2026-06-14 10:51:53','2026-06-28',NULL),(2,5,3,'2026-06-14 10:52:06','2026-06-09','2026-06-14 11:07:12'),(3,5,4,'2026-06-14 10:52:15','2026-06-21',NULL);
/*!40000 ALTER TABLE `emprestimos` ENABLE KEYS */;
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
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_limite_emprestimos` BEFORE INSERT ON `emprestimos` FOR EACH ROW BEGIN
    DECLARE v_ativos INT;
 
    SELECT COUNT(*) INTO v_ativos
    FROM Emprestimos
    WHERE id_usuario_fk = NEW.id_usuario_fk
      AND data_devolucao IS NULL;
 
    IF v_ativos >= 3 THEN
        SIGNAL SQLSTATE '45002'
            SET MESSAGE_TEXT = 'Limite de 3 empréstimos simultâneos atingido.';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `enderecos`
--

DROP TABLE IF EXISTS `enderecos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enderecos` (
  `id_endereco` int NOT NULL AUTO_INCREMENT,
  `logradouro` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bairro` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cidade` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uf` char(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_usuario_fk` int NOT NULL,
  PRIMARY KEY (`id_endereco`),
  KEY `fk_end_usuario` (`id_usuario_fk`),
  CONSTRAINT `fk_end_usuario` FOREIGN KEY (`id_usuario_fk`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enderecos`
--

LOCK TABLES `enderecos` WRITE;
/*!40000 ALTER TABLE `enderecos` DISABLE KEYS */;
INSERT INTO `enderecos` VALUES (1,'Rua das Flores, 10','Centro','Campina Grande','PB',1),(2,'Av. Brasil, 200','Bodocongó','Campina Grande','PB',2),(3,'Rua XV, 55','Pedregal','Campina Grande','PB',3),(4,'Tv. da Paz, 33','Liberdade','Campina Grande','PB',4),(5,'Rua Nova, 77','Dinamérica','Campina Grande','PB',5);
/*!40000 ALTER TABLE `enderecos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `livros`
--

DROP TABLE IF EXISTS `livros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `livros` (
  `id_livro` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `autor` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isbn` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `preco_custo` decimal(10,2) NOT NULL,
  `quantidade_estoque` int NOT NULL DEFAULT '0',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DISPONIVEL',
  PRIMARY KEY (`id_livro`),
  UNIQUE KEY `uq_livros_isbn` (`isbn`),
  CONSTRAINT `ck_livros_estoque` CHECK ((`quantidade_estoque` >= 0)),
  CONSTRAINT `ck_livros_preco` CHECK ((`preco_custo` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `livros`
--

LOCK TABLES `livros` WRITE;
/*!40000 ALTER TABLE `livros` DISABLE KEYS */;
INSERT INTO `livros` VALUES (2,'Clean Code','Robert C. Martin','9780132350884',89.90,4,'DISPONIVEL'),(3,'Java: Como Programar','Deitel & Deitel','9788576050193',120.00,3,'DISPONIVEL'),(4,'MySQL Cookbook','Paul DuBois','9780596527082',75.50,1,'INDISPONIVEL'),(6,'O Senhor dos Anéis','J.R.R. Tolkien','9788533613379',95.00,4,'DISPONIVEL'),(7,'Livro Teste 10','Autor Teste','0000000000010',19.90,10,'DISPONIVEL'),(8,'Livro Teste 9','Autor Teste','0000000000009',19.90,10,'DISPONIVEL'),(9,'Livro Teste 8','Autor Teste','0000000000008',19.90,10,'DISPONIVEL'),(10,'Livro Teste 7','Autor Teste','0000000000007',19.90,10,'DISPONIVEL'),(11,'Livro Teste 6','Autor Teste','0000000000006',19.90,10,'DISPONIVEL'),(12,'Livro Teste 5','Autor Teste','0000000000005',19.90,10,'DISPONIVEL'),(13,'Livro Teste 4','Autor Teste','0000000000004',19.90,10,'DISPONIVEL'),(14,'Livro Teste 3','Autor Teste','0000000000003',19.90,10,'DISPONIVEL'),(15,'Livro Teste 2','Autor Teste','0000000000002',19.90,10,'DISPONIVEL'),(16,'Livro Teste 1','Autor Teste','0000000000001',19.90,10,'DISPONIVEL'),(17,'Livro Teste 20','Autor Teste','0000000000020',19.90,10,'DISPONIVEL'),(18,'Livro Teste 19','Autor Teste','0000000000019',19.90,10,'DISPONIVEL'),(19,'Livro Teste 18','Autor Teste','0000000000018',19.90,10,'DISPONIVEL'),(20,'Livro Teste 17','Autor Teste','0000000000017',19.90,10,'DISPONIVEL'),(21,'Livro Teste 16','Autor Teste','0000000000016',19.90,10,'DISPONIVEL'),(22,'Livro Teste 15','Autor Teste','0000000000015',19.90,10,'DISPONIVEL'),(23,'Livro Teste 14','Autor Teste','0000000000014',19.90,10,'DISPONIVEL'),(24,'Livro Teste 13','Autor Teste','0000000000013',19.90,10,'DISPONIVEL'),(25,'Livro Teste 12','Autor Teste','0000000000012',19.90,10,'DISPONIVEL'),(26,'Livro Teste 11','Autor Teste','0000000000011',19.90,10,'DISPONIVEL'),(27,'Livro Teste 30','Autor Teste','0000000000030',19.90,10,'DISPONIVEL'),(28,'Livro Teste 29','Autor Teste','0000000000029',19.90,10,'DISPONIVEL'),(29,'Livro Teste 28','Autor Teste','0000000000028',19.90,10,'DISPONIVEL'),(30,'Livro Teste 27','Autor Teste','0000000000027',19.90,10,'DISPONIVEL'),(31,'Livro Teste 26','Autor Teste','0000000000026',19.90,10,'DISPONIVEL'),(32,'Livro Teste 25','Autor Teste','0000000000025',19.90,10,'DISPONIVEL'),(33,'Livro Teste 24','Autor Teste','0000000000024',19.90,10,'DISPONIVEL'),(34,'Livro Teste 23','Autor Teste','0000000000023',19.90,10,'DISPONIVEL'),(35,'Livro Teste 22','Autor Teste','0000000000022',19.90,10,'DISPONIVEL'),(36,'Livro Teste 21','Autor Teste','0000000000021',19.90,10,'DISPONIVEL'),(37,'Livro Teste 40','Autor Teste','0000000000040',19.90,10,'DISPONIVEL'),(38,'Livro Teste 39','Autor Teste','0000000000039',19.90,10,'DISPONIVEL'),(39,'Livro Teste 38','Autor Teste','0000000000038',19.90,10,'DISPONIVEL'),(40,'Livro Teste 37','Autor Teste','0000000000037',19.90,10,'DISPONIVEL'),(41,'Livro Teste 36','Autor Teste','0000000000036',19.90,10,'DISPONIVEL'),(42,'Livro Teste 35','Autor Teste','0000000000035',19.90,10,'DISPONIVEL'),(43,'Livro Teste 34','Autor Teste','0000000000034',19.90,10,'DISPONIVEL'),(44,'Livro Teste 33','Autor Teste','0000000000033',19.90,10,'DISPONIVEL'),(45,'Livro Teste 32','Autor Teste','0000000000032',19.90,10,'DISPONIVEL'),(46,'Livro Teste 31','Autor Teste','0000000000031',19.90,10,'DISPONIVEL'),(47,'Livro Teste 50','Autor Teste','0000000000050',19.90,10,'DISPONIVEL'),(48,'Livro Teste 49','Autor Teste','0000000000049',19.90,10,'DISPONIVEL'),(49,'Livro Teste 48','Autor Teste','0000000000048',19.90,10,'DISPONIVEL'),(50,'Livro Teste 47','Autor Teste','0000000000047',19.90,10,'DISPONIVEL'),(51,'Livro Teste 46','Autor Teste','0000000000046',19.90,10,'DISPONIVEL'),(52,'Livro Teste 45','Autor Teste','0000000000045',19.90,10,'DISPONIVEL'),(53,'Livro Teste 44','Autor Teste','0000000000044',19.90,10,'DISPONIVEL'),(54,'Livro Teste 43','Autor Teste','0000000000043',19.90,10,'DISPONIVEL'),(55,'Livro Teste 42','Autor Teste','0000000000042',19.90,10,'DISPONIVEL'),(56,'Livro Teste 41','Autor Teste','0000000000041',19.90,10,'DISPONIVEL'),(57,'Livro Teste 60','Autor Teste','0000000000060',19.90,10,'DISPONIVEL'),(58,'Livro Teste 59','Autor Teste','0000000000059',19.90,10,'DISPONIVEL'),(59,'Livro Teste 58','Autor Teste','0000000000058',19.90,10,'DISPONIVEL'),(60,'Livro Teste 57','Autor Teste','0000000000057',19.90,10,'DISPONIVEL'),(61,'Livro Teste 56','Autor Teste','0000000000056',19.90,10,'DISPONIVEL'),(62,'Livro Teste 55','Autor Teste','0000000000055',19.90,10,'DISPONIVEL'),(63,'Livro Teste 54','Autor Teste','0000000000054',19.90,10,'DISPONIVEL'),(64,'Livro Teste 53','Autor Teste','0000000000053',19.90,10,'DISPONIVEL'),(65,'Livro Teste 52','Autor Teste','0000000000052',19.90,10,'DISPONIVEL'),(66,'Livro Teste 51','Autor Teste','0000000000051',19.90,10,'DISPONIVEL'),(67,'Livro Teste 70','Autor Teste','0000000000070',19.90,10,'DISPONIVEL'),(68,'Livro Teste 69','Autor Teste','0000000000069',19.90,10,'DISPONIVEL'),(69,'Livro Teste 68','Autor Teste','0000000000068',19.90,10,'DISPONIVEL'),(70,'Livro Teste 67','Autor Teste','0000000000067',19.90,10,'DISPONIVEL'),(71,'Livro Teste 66','Autor Teste','0000000000066',19.90,10,'DISPONIVEL'),(72,'Livro Teste 65','Autor Teste','0000000000065',19.90,10,'DISPONIVEL'),(73,'Livro Teste 64','Autor Teste','0000000000064',19.90,10,'DISPONIVEL'),(74,'Livro Teste 63','Autor Teste','0000000000063',19.90,10,'DISPONIVEL'),(75,'Livro Teste 62','Autor Teste','0000000000062',19.90,10,'DISPONIVEL'),(76,'Livro Teste 61','Autor Teste','0000000000061',19.90,10,'DISPONIVEL'),(77,'Livro Teste 80','Autor Teste','0000000000080',19.90,10,'DISPONIVEL'),(78,'Livro Teste 79','Autor Teste','0000000000079',19.90,10,'DISPONIVEL'),(79,'Livro Teste 78','Autor Teste','0000000000078',19.90,10,'DISPONIVEL'),(80,'Livro Teste 77','Autor Teste','0000000000077',19.90,10,'DISPONIVEL'),(81,'Livro Teste 76','Autor Teste','0000000000076',19.90,10,'DISPONIVEL'),(82,'Livro Teste 75','Autor Teste','0000000000075',19.90,10,'DISPONIVEL'),(83,'Livro Teste 74','Autor Teste','0000000000074',19.90,10,'DISPONIVEL'),(84,'Livro Teste 73','Autor Teste','0000000000073',19.90,10,'DISPONIVEL'),(85,'Livro Teste 72','Autor Teste','0000000000072',19.90,10,'DISPONIVEL'),(86,'Livro Teste 71','Autor Teste','0000000000071',19.90,10,'DISPONIVEL'),(87,'Livro Teste 90','Autor Teste','0000000000090',19.90,10,'DISPONIVEL'),(88,'Livro Teste 89','Autor Teste','0000000000089',19.90,10,'DISPONIVEL'),(89,'Livro Teste 88','Autor Teste','0000000000088',19.90,10,'DISPONIVEL'),(90,'Livro Teste 87','Autor Teste','0000000000087',19.90,10,'DISPONIVEL'),(91,'Livro Teste 86','Autor Teste','0000000000086',19.90,10,'DISPONIVEL'),(92,'Livro Teste 85','Autor Teste','0000000000085',19.90,10,'DISPONIVEL'),(93,'Livro Teste 84','Autor Teste','0000000000084',19.90,10,'DISPONIVEL'),(94,'Livro Teste 83','Autor Teste','0000000000083',19.90,10,'DISPONIVEL'),(95,'Livro Teste 82','Autor Teste','0000000000082',19.90,10,'DISPONIVEL'),(96,'Livro Teste 81','Autor Teste','0000000000081',19.90,10,'DISPONIVEL'),(97,'Livro Teste 100','Autor Teste','0000000000100',19.90,10,'DISPONIVEL'),(98,'Livro Teste 99','Autor Teste','0000000000099',19.90,10,'DISPONIVEL'),(99,'Livro Teste 98','Autor Teste','0000000000098',19.90,10,'DISPONIVEL'),(100,'Livro Teste 97','Autor Teste','0000000000097',19.90,10,'DISPONIVEL'),(101,'Livro Teste 96','Autor Teste','0000000000096',19.90,10,'DISPONIVEL'),(102,'Livro Teste 95','Autor Teste','0000000000095',19.90,10,'DISPONIVEL'),(103,'Livro Teste 94','Autor Teste','0000000000094',19.90,10,'DISPONIVEL'),(104,'Livro Teste 93','Autor Teste','0000000000093',19.90,10,'DISPONIVEL'),(105,'Livro Teste 92','Autor Teste','0000000000092',19.90,10,'DISPONIVEL'),(106,'Livro Teste 91','Autor Teste','0000000000091',19.90,10,'DISPONIVEL');
/*!40000 ALTER TABLE `livros` ENABLE KEYS */;
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
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_trava_horario_comercial_insert` BEFORE INSERT ON `livros` FOR EACH ROW BEGIN
    IF HOUR(NOW()) < 8 OR HOUR(NOW()) >= 18 THEN
        SIGNAL SQLSTATE '45001'
            SET MESSAGE_TEXT = 'Operação negada: fora do horário comercial (08h–18h).';
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
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_trava_horario_comercial_update` BEFORE UPDATE ON `livros` FOR EACH ROW BEGIN
    IF HOUR(NOW()) < 8 OR HOUR(NOW()) >= 18 THEN
        SIGNAL SQLSTATE '45001'
            SET MESSAGE_TEXT = 'Operação negada: fora do horário comercial (08h–18h).';
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
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_preventiva_estoque` BEFORE UPDATE ON `livros` FOR EACH ROW BEGIN
    IF NEW.quantidade_estoque < 0 THEN
        SIGNAL SQLSTATE '45003'
            SET MESSAGE_TEXT = 'Operação negada: estoque não pode ser negativo.';
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
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_auditoria_delecao` AFTER DELETE ON `livros` FOR EACH ROW BEGIN
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
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `log_auditoria`
--

DROP TABLE IF EXISTS `log_auditoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_auditoria` (
  `id_log` int NOT NULL AUTO_INCREMENT,
  `tabela_afetada` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `acao` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuario_responsavel` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dados_antigos` text COLLATE utf8mb4_unicode_ci,
  `data_hora` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_log`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_auditoria`
--

LOCK TABLES `log_auditoria` WRITE;
/*!40000 ALTER TABLE `log_auditoria` DISABLE KEYS */;
INSERT INTO `log_auditoria` VALUES (1,'Livros','DELETE','usr_gerente@localhost','{\"id_livro\":1,\"titulo\":\"Livro Teste Auditoria\",\"autor\":\"Teste\",\"isbn\":\"0000000000099\",\"preco_custo\":1.00,\"estoque\":1}','2026-06-14 13:41:12'),(2,'Livros','DELETE','usr_gerente@localhost','{\"id_livro\":5,\"titulo\":\"Dom Casmurro\",\"autor\":\"Machado de Assis\",\"isbn\":\"9788572328197\",\"preco_custo\":29.90,\"estoque\":8}','2026-06-18 11:20:05');
/*!40000 ALTER TABLE `log_auditoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `multas`
--

DROP TABLE IF EXISTS `multas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `multas` (
  `id_multa` int NOT NULL AUTO_INCREMENT,
  `id_emprestimo_fk` int NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `pago` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_multa`),
  KEY `fk_multa_emp` (`id_emprestimo_fk`),
  CONSTRAINT `fk_multa_emp` FOREIGN KEY (`id_emprestimo_fk`) REFERENCES `emprestimos` (`id_emprestimo`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `multas`
--

LOCK TABLES `multas` WRITE;
/*!40000 ALTER TABLE `multas` DISABLE KEYS */;
INSERT INTO `multas` VALUES (1,2,10.00,0);
/*!40000 ALTER TABLE `multas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cpf` char(11) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `senha` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` enum('ALUNO','GERENTE','BIBLIOTECARIO','ESTAGIARIO') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `uq_usuarios_cpf` (`cpf`),
  UNIQUE KEY `uq_usuarios_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Ana Gerente','00000000001','gerente@lib.com','20d5fe9d391b5aaf57fe042802d108df69e430005cf2d01b26ffd134358644b7','GERENTE'),(2,'Bruno Biblio','00000000002','biblio@lib.com','0734dac7c5d6e19f04dbe1d9d1655eaa30ad74d7c074dee1f40417f133dc1519','BIBLIOTECARIO'),(3,'Carlos Estagio','00000000003','estagio@lib.com','39573f75e0c9460bf9bfd5e9fdc09416cfa30b12ea4e8be5d1db8140aac1e36f','ESTAGIARIO'),(4,'Diana Aluna','00000000004','aluno@lib.com','49a502e431d43ba04d0d4ec00e1623d0b5e88e891ec9f1c3cab2995d11cdf950','ALUNO'),(5,'Eduardo Aluno','00000000005','eduardo@lib.com','733e42b73b4d3faf0c015ddbd0ad141c797bf54b1fc6e59150d8c05cd9dda80c','ALUNO');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vw_acervo_publico`
--

DROP TABLE IF EXISTS `vw_acervo_publico`;
/*!50001 DROP VIEW IF EXISTS `vw_acervo_publico`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_acervo_publico` AS SELECT 
 1 AS `id_livro`,
 1 AS `titulo`,
 1 AS `autor`,
 1 AS `isbn`,
 1 AS `quantidade_estoque`,
 1 AS `status`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_dashboard_financeiro`
--

DROP TABLE IF EXISTS `vw_dashboard_financeiro`;
/*!50001 DROP VIEW IF EXISTS `vw_dashboard_financeiro`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_dashboard_financeiro` AS SELECT 
 1 AS `total_arrecadado`,
 1 AS `total_pendente`,
 1 AS `total_recebido`,
 1 AS `qtd_multas`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_livros_atrasados`
--

DROP TABLE IF EXISTS `vw_livros_atrasados`;
/*!50001 DROP VIEW IF EXISTS `vw_livros_atrasados`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_livros_atrasados` AS SELECT 
 1 AS `id_emprestimo`,
 1 AS `nome_usuario`,
 1 AS `contato`,
 1 AS `livro`,
 1 AS `data_prevista`,
 1 AS `dias_atraso`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_meus_emprestimos`
--

DROP TABLE IF EXISTS `vw_meus_emprestimos`;
/*!50001 DROP VIEW IF EXISTS `vw_meus_emprestimos`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_meus_emprestimos` AS SELECT 
 1 AS `id_emprestimo`,
 1 AS `id_usuario_fk`,
 1 AS `nome_usuario`,
 1 AS `titulo_livro`,
 1 AS `data_saida`,
 1 AS `data_prevista`,
 1 AS `data_devolucao`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_ranking_leitura`
--

DROP TABLE IF EXISTS `vw_ranking_leitura`;
/*!50001 DROP VIEW IF EXISTS `vw_ranking_leitura`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_ranking_leitura` AS SELECT 
 1 AS `id_livro`,
 1 AS `titulo`,
 1 AS `autor`,
 1 AS `total_emprestimos`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'db_libritech'
--

--
-- Dumping routines for database 'db_libritech'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_calcular_multa` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_calcular_multa`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_renovar_emprestimo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_renovar_emprestimo`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_transacao_cadastro_completo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_transacao_cadastro_completo`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_transacao_devolucao` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_transacao_devolucao`(
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
 
    -- Registra data de devolução
    UPDATE Emprestimos
    SET data_devolucao = NOW()
    WHERE id_emprestimo = p_id_emprestimo;
 
    -- Calcula multa
    CALL sp_calcular_multa(p_id_emprestimo, v_multa);
 
    IF v_multa > 0 THEN
        INSERT INTO Multas (id_emprestimo_fk, valor, pago)
        VALUES (p_id_emprestimo, v_multa, 0);
    END IF;
 
    -- Devolve ao estoque
    UPDATE Livros
    SET quantidade_estoque = quantidade_estoque + 1,
        status = 'DISPONIVEL'
    WHERE id_livro = v_id_livro;
 
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_transacao_emprestimo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_transacao_emprestimo`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `vw_acervo_publico`
--

/*!50001 DROP VIEW IF EXISTS `vw_acervo_publico`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_acervo_publico` AS select `livros`.`id_livro` AS `id_livro`,`livros`.`titulo` AS `titulo`,`livros`.`autor` AS `autor`,`livros`.`isbn` AS `isbn`,`livros`.`quantidade_estoque` AS `quantidade_estoque`,`livros`.`status` AS `status` from `livros` where (`livros`.`status` = 'DISPONIVEL') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_dashboard_financeiro`
--

/*!50001 DROP VIEW IF EXISTS `vw_dashboard_financeiro`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_dashboard_financeiro` AS select sum(`multas`.`valor`) AS `total_arrecadado`,sum(if((`multas`.`pago` = 0),`multas`.`valor`,0)) AS `total_pendente`,sum(if((`multas`.`pago` = 1),`multas`.`valor`,0)) AS `total_recebido`,count(0) AS `qtd_multas` from `multas` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_livros_atrasados`
--

/*!50001 DROP VIEW IF EXISTS `vw_livros_atrasados`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_livros_atrasados` AS select `e`.`id_emprestimo` AS `id_emprestimo`,`u`.`nome` AS `nome_usuario`,`u`.`email` AS `contato`,`l`.`titulo` AS `livro`,`e`.`data_prevista` AS `data_prevista`,(to_days(curdate()) - to_days(`e`.`data_prevista`)) AS `dias_atraso` from ((`emprestimos` `e` join `usuarios` `u` on((`u`.`id_usuario` = `e`.`id_usuario_fk`))) join `livros` `l` on((`l`.`id_livro` = `e`.`id_livro_fk`))) where ((`e`.`data_devolucao` is null) and (`e`.`data_prevista` < curdate())) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_meus_emprestimos`
--

/*!50001 DROP VIEW IF EXISTS `vw_meus_emprestimos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_meus_emprestimos` AS select `e`.`id_emprestimo` AS `id_emprestimo`,`e`.`id_usuario_fk` AS `id_usuario_fk`,`u`.`nome` AS `nome_usuario`,`l`.`titulo` AS `titulo_livro`,`e`.`data_saida` AS `data_saida`,`e`.`data_prevista` AS `data_prevista`,`e`.`data_devolucao` AS `data_devolucao` from ((`emprestimos` `e` join `usuarios` `u` on((`u`.`id_usuario` = `e`.`id_usuario_fk`))) join `livros` `l` on((`l`.`id_livro` = `e`.`id_livro_fk`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_ranking_leitura`
--

/*!50001 DROP VIEW IF EXISTS `vw_ranking_leitura`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_ranking_leitura` AS select `l`.`id_livro` AS `id_livro`,`l`.`titulo` AS `titulo`,`l`.`autor` AS `autor`,count(`e`.`id_emprestimo`) AS `total_emprestimos` from (`livros` `l` left join `emprestimos` `e` on((`e`.`id_livro_fk` = `l`.`id_livro`))) group by `l`.`id_livro`,`l`.`titulo`,`l`.`autor` order by `total_emprestimos` desc limit 10 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-18 20:05:13
