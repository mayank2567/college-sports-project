-- phpMyAdmin SQL Dump
-- version 4.3.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Feb 06, 2018 at 09:08 AM
-- Server version: 5.6.24
-- PHP Version: 5.6.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `sports`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE IF NOT EXISTS `admin` (
  `id` int(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE IF NOT EXISTS `events` (
  `id` int(255) NOT NULL,
  `event_type` varchar(255) NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `event_cat` varchar(255) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `event_type`, `event_name`, `gender`, `event_cat`) VALUES
(1, 'Field', 'Tug of War', 'Male', 'Field'),
(2, 'raciong', 'Race', 'male', 'race'),
(3, 'water', 'Swimming', 'female', 'swim');

-- --------------------------------------------------------

--
-- Table structure for table `event_student`
--

CREATE TABLE IF NOT EXISTS `event_student` (
  `id` int(255) NOT NULL,
  `rollno` varchar(255) NOT NULL,
  `event_id` varchar(255) NOT NULL,
  `attendence` varchar(255) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `event_student`
--

INSERT INTO `event_student` (`id`, `rollno`, `event_id`, `attendence`) VALUES
(1, '1', '1', ''),
(2, '1', '2', 'yes'),
(3, '2', '2', 'yes'),
(4, '2', '3', 'yes'),
(5, '3', '2', 'no'),
(6, '3', '3', 'yes');

-- --------------------------------------------------------

--
-- Table structure for table `result`
--

CREATE TABLE IF NOT EXISTS `result` (
  `id` int(255) NOT NULL,
  `event_id` varchar(255) NOT NULL,
  `registration_id` varchar(255) DEFAULT NULL,
  `first` varchar(255) NOT NULL,
  `second` varchar(255) DEFAULT NULL,
  `third` varchar(255) DEFAULT NULL,
  `first_dep` varchar(256) DEFAULT NULL,
  `second_dep` varchar(256) DEFAULT NULL,
  `third_dep` varchar(256) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `result`
--

INSERT INTO `result` (`id`, `event_id`, `registration_id`, `first`, `second`, `third`, `first_dep`, `second_dep`, `third_dep`) VALUES
(1, '3', '', '2', '2', '1', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE IF NOT EXISTS `students` (
  `id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `course` varchar(30) NOT NULL,
  `rollno` varchar(50) NOT NULL,
  `branch` varchar(50) NOT NULL,
  `year` varchar(20) NOT NULL,
  `gender` varchar(20) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `name`, `course`, `rollno`, `branch`, `year`, `gender`) VALUES
(1, 'A', 'a', '1', 'a', 'a', 'male'),
(2, 'b', 'b', '2', 'b', 'b', 'b'),
(3, 'c', 'c', '3', 'c', 'c', 'male');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event_student`
--
ALTER TABLE `event_student`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `result`
--
ALTER TABLE `result`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `rollno` (`rollno`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `event_student`
--
ALTER TABLE `event_student`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `result`
--
ALTER TABLE `result`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
