-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 07, 2024 at 04:51 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

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
-- Table structure for table `data_info`
--

CREATE TABLE `data_info` (
  `Data_id` int(11) NOT NULL,
  `pid` int(11) DEFAULT NULL,
  `emotion_id` int(11) NOT NULL,
  `DateTime` datetime NOT NULL,
  `Full_path` varchar(255) NOT NULL,
  `Cut_path` varchar(255) NOT NULL,
  `place` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `emotion_data`
--

CREATE TABLE `emotion_data` (
  `emotion_id` int(255) NOT NULL,
  `emotion_data` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `emotion_data`
--

INSERT INTO `emotion_data` (`emotion_id`, `emotion_data`) VALUES
(1, 'angry'),
(2, 'disgust'),
(3, 'fear'),
(4, 'happy'),
(5, 'sad'),
(6, 'surprise'),
(7, 'neutral');

-- --------------------------------------------------------

--
-- Table structure for table `person_info`
--

CREATE TABLE `person_info` (
  `pid` int(11) NOT NULL,
  `FirstName` varchar(255) NOT NULL,
  `LastName` varchar(255) NOT NULL,
  `img_path` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `DateOfBirth` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `response_text`
--

CREATE TABLE `response_text` (
  `response_text_id` int(11) NOT NULL,
  `response_text` varchar(255) NOT NULL,
  `emotion_id` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `response_text`
--

INSERT INTO `response_text` (`response_text_id`, `response_text`, `emotion_id`) VALUES
(1, 'ทำไมโกรธจัง', 1),
(2, 'รังเกียจกันทำไม', 2),
(3, 'กลัวอะไรอะ', 3),
(4, 'ดีใจเรื่องอะไร', 4),
(5, 'เสียใจทำไมอะ', 5),
(6, 'ตกใจไรเนี่ย', 6),
(7, 'ปกติดีหนิ', 7);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `Username` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `uid` int(11) NOT NULL,
  `Firstname` varchar(255) NOT NULL,
  `Lastname` varchar(255) NOT NULL
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
-- Indexes for table `data_info`
--
ALTER TABLE `data_info`
  ADD PRIMARY KEY (`Data_id`),
  ADD KEY `emotion` (`emotion_id`),
  ADD KEY `person` (`pid`);

--
-- Indexes for table `emotion_data`
--
ALTER TABLE `emotion_data`
  ADD PRIMARY KEY (`emotion_id`);

--
-- Indexes for table `person_info`
--
ALTER TABLE `person_info`
  ADD PRIMARY KEY (`pid`);

--
-- Indexes for table `response_text`
--
ALTER TABLE `response_text`
  ADD PRIMARY KEY (`response_text_id`),
  ADD KEY `emotion_id` (`emotion_id`);

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
-- AUTO_INCREMENT for table `data_info`
--
ALTER TABLE `data_info`
  MODIFY `Data_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `emotion_data`
--
ALTER TABLE `emotion_data`
  MODIFY `emotion_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `person_info`
--
ALTER TABLE `person_info`
  MODIFY `pid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `response_text`
--
ALTER TABLE `response_text`
  MODIFY `response_text_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `data_info`
--
ALTER TABLE `data_info`
  ADD CONSTRAINT `emotion` FOREIGN KEY (`emotion_id`) REFERENCES `emotion_data` (`emotion_id`),
  ADD CONSTRAINT `pid` FOREIGN KEY (`pid`) REFERENCES `person_info` (`pid`);

--
-- Constraints for table `response_text`
--
ALTER TABLE `response_text`
  ADD CONSTRAINT `emotion_id` FOREIGN KEY (`emotion_id`) REFERENCES `emotion_data` (`emotion_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
