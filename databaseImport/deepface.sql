-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Jan 10, 2024 at 11:07 AM
-- Server version: 8.2.0
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `deepface`
--

-- --------------------------------------------------------

--
-- Table structure for table `Data_info`
--

CREATE TABLE `Data_info` (
  `Data_id` int NOT NULL,
  `pid` int NOT NULL,
  `emotion_id` int NOT NULL,
  `DateTime` datetime NOT NULL,
  `Full_path` varchar(255) NOT NULL,
  `Cut_path` varchar(255) NOT NULL,
  `place` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `emotion_data`
--

CREATE TABLE `emotion_data` (
  `emotion_id` int NOT NULL,
  `emotion_data` varchar(255) NOT NULL,
  `response_text_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `person_info`
--

CREATE TABLE `person_info` (
  `pid` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `img_path` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `DateOfBirth` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `response_text`
--

CREATE TABLE `response_text` (
  `response_text_id` int NOT NULL,
  `response_text` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `Username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `uid` int NOT NULL,
  `Firstname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Lastname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`Username`, `Password`, `uid`, `Firstname`, `Lastname`) VALUES
('admin', 'admin', 1, 'Parunyu', 'Anakitbumrung');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Data_info`
--
ALTER TABLE `Data_info`
  ADD PRIMARY KEY (`Data_id`),
  ADD KEY `emotion` (`emotion_id`),
  ADD KEY `person` (`pid`);

--
-- Indexes for table `emotion_data`
--
ALTER TABLE `emotion_data`
  ADD PRIMARY KEY (`emotion_id`),
  ADD KEY `response_id` (`response_text_id`);

--
-- Indexes for table `person_info`
--
ALTER TABLE `person_info`
  ADD PRIMARY KEY (`pid`);

--
-- Indexes for table `response_text`
--
ALTER TABLE `response_text`
  ADD PRIMARY KEY (`response_text_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`uid`),
  ADD KEY `uid` (`uid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Data_info`
--
ALTER TABLE `Data_info`
  MODIFY `Data_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emotion_data`
--
ALTER TABLE `emotion_data`
  MODIFY `emotion_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `person_info`
--
ALTER TABLE `person_info`
  MODIFY `pid` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `response_text`
--
ALTER TABLE `response_text`
  MODIFY `response_text_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `uid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Data_info`
--
ALTER TABLE `Data_info`
  ADD CONSTRAINT `emotion` FOREIGN KEY (`emotion_id`) REFERENCES `emotion_data` (`emotion_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `person` FOREIGN KEY (`pid`) REFERENCES `person_info` (`pid`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `emotion_data`
--
ALTER TABLE `emotion_data`
  ADD CONSTRAINT `response_id` FOREIGN KEY (`response_text_id`) REFERENCES `response_text` (`response_text_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
