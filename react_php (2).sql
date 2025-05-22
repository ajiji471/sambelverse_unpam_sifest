-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 11 Mar 2025 pada 07.38
-- Versi server: 10.6.21-MariaDB-log
-- Versi PHP: 8.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `react_php`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `tbl_all_menu`
--

CREATE TABLE `tbl_all_menu` (
  `kode_menu` varchar(20) NOT NULL,
  `nama_menu` varchar(100) NOT NULL,
  `hrga_menu` decimal(10,2) NOT NULL,
  `rating` tinyint(1) DEFAULT NULL,
  `gambar` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `tbl_all_menu`
--

INSERT INTO `tbl_all_menu` (`kode_menu`, `nama_menu`, `hrga_menu`, `rating`, `gambar`) VALUES
('1', 'ayam geprek', 13000.00, 5, '/img/geprek_1.jpg'),
('2', 'ayam Cabe Ijo', 13000.00, 5, '/img/ayam_cabe_ijo.jpg'),
('3', 'Ayam Katsu', 13000.00, 5, '/img/ayam-katsu.jpg'),
('4', 'Nasi', 3000.00, 5, '/img/nasi.jpg');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tbl_deposit`
--

CREATE TABLE `tbl_deposit` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `deposit` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `tbl_deposit`
--

INSERT INTO `tbl_deposit` (`id`, `user_id`, `deposit`, `created_at`, `updated_at`) VALUES
(6, 4, 90000, '2025-03-11 06:27:52', '2025-03-11 06:59:59'),
(7, 6, 50000, '2025-03-11 06:38:55', '2025-03-11 06:38:55');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tbl_invoices`
--

CREATE TABLE `tbl_invoices` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `pesanan` text DEFAULT NULL,
  `kategori` enum('siang','sore','lainnya') NOT NULL,
  `total_tagihan` decimal(10,2) NOT NULL,
  `purchase_date` datetime DEFAULT current_timestamp(),
  `deposit_id` decimal(11,0) DEFAULT NULL,
  `keterangan` enum('lunas','belum lunas') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `tbl_invoices`
--

INSERT INTO `tbl_invoices` (`id`, `user_id`, `pesanan`, `kategori`, `total_tagihan`, `purchase_date`, `deposit_id`, `keterangan`) VALUES
(2, 4, 'Ayam Katsu x 1, Nasi x 1', 'sore', 16000.00, '2025-01-12 18:39:09', NULL, 'lunas'),
(4, 6, 'ayam geprek x 2, Nasi x 1', 'sore', 29000.00, '2025-01-12 19:26:29', NULL, 'lunas'),
(6, 6, 'Ayam Katsu x 1, Nasi x 1', 'sore', 16000.00, '2025-01-12 20:17:32', NULL, 'lunas'),
(9, 6, 'ayam Cabe Ijo x 1, Nasi x 1', 'siang', 18000.00, '2025-01-16 09:51:56', NULL, 'belum lunas'),
(10, 6, 'ayam geprek x 1, Nasi x 1', 'siang', 17000.00, '2025-01-16 10:28:22', NULL, 'belum lunas'),
(11, 6, 'ayam Cabe Ijo x 1, Nasi x 1', 'sore', 16000.00, '2025-01-16 16:46:36', NULL, 'belum lunas'),
(12, 4, 'ayam geprek x 1, Nasi x 1', 'sore', 16000.00, '2025-01-16 16:47:28', NULL, 'belum lunas'),
(13, 9, 'ayam geprek x 2, Nasi x 2', 'siang', 32000.00, '2025-01-19 18:02:32', NULL, 'belum lunas'),
(14, 6, 'Ayam Katsu x 2, Nasi x 1', 'siang', 29000.00, '2025-02-05 14:13:14', NULL, 'belum lunas'),
(15, 6, 'ayam geprek x 1, Nasi x 1', 'sore', 16000.00, '2025-03-06 08:49:29', NULL, 'belum lunas'),
(16, 6, 'ayam geprek x 1, ayam Cabe Ijo x 1, Nasi x 2', 'siang', 32000.00, '2025-03-10 07:56:31', NULL, 'belum lunas'),
(17, 4, 'Ayam Katsu x 1, Nasi x 1', 'siang', 16000.00, '2025-03-10 07:56:59', NULL, 'belum lunas'),
(18, 4, 'ayam Cabe Ijo x 1, Nasi x 1', 'sore', 16000.00, '2025-03-10 07:57:12', NULL, 'belum lunas'),
(19, 6, 'ayam geprek x 1, ayam Cabe Ijo x 1, Nasi x 2', 'sore', 32000.00, '2025-03-10 13:14:16', NULL, 'belum lunas'),
(20, 4, 'ayam Cabe Ijo x 1, Nasi x 1', 'siang', 16000.00, '2025-03-10 13:19:45', NULL, 'belum lunas'),
(21, 4, 'ayam geprek x 1, Nasi x 1', 'sore', 16000.00, '2025-03-10 16:00:25', NULL, 'belum lunas'),
(22, 4, 'Nasi Goreng x 2, Ayam Bakar x 1', 'siang', 0.00, '2025-03-11 11:04:51', 8000, 'lunas'),
(23, 4, 'Ayam Katsu x 1, Nasi x 1', 'siang', 16000.00, '2025-03-11 11:25:17', 90000, 'belum lunas'),
(24, 4, 'Ayam Katsu x 1, Nasi x 1', 'sore', 16000.00, '2025-03-11 12:07:23', 74000, 'belum lunas'),
(25, 4, 'Ayam Katsu x 1, Nasi x 1', 'siang', 16000.00, '2025-03-11 12:13:19', 74000, 'belum lunas'),
(26, 4, 'ayam Cabe Ijo x 1, Nasi x 1', 'sore', 16000.00, '2025-03-11 12:22:29', 74000, 'belum lunas'),
(27, 4, 'ayam geprek x 1, ayam Cabe Ijo x 1, Ayam Katsu x 1, Nasi x 1', 'sore', 0.00, '2025-03-11 12:25:48', 48000, 'belum lunas'),
(28, 4, 'ayam Cabe Ijo x 1, Ayam Katsu x 1, Nasi x 1', 'sore', 0.00, '2025-03-11 12:39:52', 61000, 'belum lunas'),
(29, 4, 'ayam geprek x 1, ayam Cabe Ijo x 1, Nasi x 1', 'siang', 0.00, '2025-03-11 12:41:09', 61000, 'belum lunas'),
(30, 4, 'ayam geprek x 1', 'siang', 0.00, '2025-03-11 12:54:18', 77000, 'belum lunas'),
(31, 4, 'ayam geprek x 1, ayam Cabe Ijo x 1, Ayam Katsu x 1, Nasi x 1', 'siang', 0.00, '2025-03-11 13:01:44', 48000, 'belum lunas'),
(32, 4, 'ayam geprek x 1, ayam Cabe Ijo x 1, Ayam Katsu x 1, Nasi x 1', 'siang', 0.00, '2025-03-11 13:02:20', 48000, 'belum lunas'),
(33, 4, 'ayam geprek x 1, ayam Cabe Ijo x 1, Ayam Katsu x 1, Nasi x 1', 'siang', 0.00, '2025-03-11 13:09:32', 4, 'belum lunas'),
(34, 4, 'ayam geprek x 1', 'siang', 0.00, '2025-03-11 13:09:59', 4, 'belum lunas'),
(35, 4, 'ayam geprek x 1', 'siang', 0.00, '2025-03-11 13:20:04', 77000, 'belum lunas'),
(36, 4, 'ayam geprek x 1', 'siang', 0.00, '2025-03-11 13:22:13', 77000, 'belum lunas'),
(37, 4, 'Nasi x 1', 'siang', 0.00, '2025-03-11 13:28:08', 87000, 'belum lunas'),
(38, 4, 'Nasi x 1', 'siang', 0.00, '2025-03-11 13:29:55', 87000, 'belum lunas'),
(39, 4, 'Nasi x 1', 'siang', 0.00, '2025-03-11 13:50:43', 6, 'belum lunas'),
(40, 4, 'Ayam Katsu x 1, Nasi x 1', 'siang', 0.00, '2025-03-11 13:56:46', 6, 'belum lunas'),
(41, 4, 'Ayam Katsu x 1, Nasi x 1', 'siang', 0.00, '2025-03-11 13:59:59', 74000, 'belum lunas'),
(42, 4, 'Ayam Katsu x 1, Nasi x 1', 'siang', 0.00, '2025-03-11 14:17:12', 74000, 'belum lunas'),
(43, 4, 'ayam Cabe Ijo x 1, Ayam Katsu x 1, Nasi x 1', 'siang', 0.00, '2025-03-11 14:23:31', 61000, 'belum lunas'),
(44, 4, 'Ayam Katsu x 1, Nasi x 1', 'siang', 0.00, '2025-03-11 14:32:19', 45000, 'belum lunas');

--
-- Trigger `tbl_invoices`
--
DELIMITER $$
CREATE TRIGGER `after_invoice_update` AFTER UPDATE ON `tbl_invoices` FOR EACH ROW BEGIN
    -- Hanya jalankan jika deposit_id mengalami perubahan
    IF OLD.deposit_id <> NEW.deposit_id THEN
        -- Periksa apakah user_id sudah ada di tbl_deposit
        IF EXISTS (SELECT 1 FROM tbl_deposit WHERE user_id = NEW.user_id) THEN
            -- Update deposit_id berdasarkan user_id
            UPDATE tbl_deposit 
            SET deposit = NEW.deposit_id, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = NEW.user_id;
        ELSE
            -- Insert jika belum ada data untuk user_id tersebut
            INSERT INTO tbl_deposit (user_id, deposit, created_at, updated_at) 
            VALUES (NEW.user_id, NEW.deposit_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        END IF;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_invoice_update2` AFTER UPDATE ON `tbl_invoices` FOR EACH ROW BEGIN
    -- Hanya jalankan jika deposit_id mengalami perubahan
    IF OLD.deposit_id <> NEW.deposit_id THEN
        -- Periksa apakah user_id sudah ada di tbl_deposit
        IF EXISTS (SELECT 1 FROM tbl_deposit WHERE user_id = NEW.user_id) THEN
            -- Update deposit_id berdasarkan user_id
            UPDATE tbl_deposit 
            SET deposit = NEW.deposit_id, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = NEW.user_id;
        ELSE
            -- Insert jika belum ada data untuk user_id tersebut
            INSERT INTO tbl_deposit (user_id, deposit, created_at, updated_at) 
            VALUES (NEW.user_id, NEW.deposit_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        END IF;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tbl_menu_today`
--

CREATE TABLE `tbl_menu_today` (
  `id` int(11) NOT NULL,
  `kode_menu` varchar(20) NOT NULL,
  `tanggal` date NOT NULL,
  `stok` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `tbl_menu_today`
--

INSERT INTO `tbl_menu_today` (`id`, `kode_menu`, `tanggal`, `stok`) VALUES
(82, '1', '2025-03-10', 18),
(83, '2', '2025-03-10', 10),
(84, '3', '2025-03-10', 12),
(85, '4', '2025-03-10', 13),
(86, '1', '2025-03-11', 5),
(87, '2', '2025-03-11', 7),
(88, '3', '2025-03-11', 6),
(89, '4', '2025-03-11', 5);

-- --------------------------------------------------------

--
-- Struktur dari tabel `tbl_ratings`
--

CREATE TABLE `tbl_ratings` (
  `id` int(11) NOT NULL,
  `kode_menu` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` decimal(3,2) DEFAULT NULL,
  `testimoni` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `tbl_ratings`
--

INSERT INTO `tbl_ratings` (`id`, `kode_menu`, `user_id`, `rating`, `testimoni`, `created_at`, `updated_at`) VALUES
(2, '1', 4, 3.00, 'terlalu pedas', '2025-02-09 14:15:57', '2025-02-09 14:15:57'),
(3, '1', 6, 5.00, 'enak poll', '2025-02-09 14:17:06', '2025-02-09 14:17:06'),
(4, '1', 4, 5.00, 'enak banget', '2025-03-10 02:25:29', '2025-03-10 02:25:29'),
(5, '1', 6, 5.00, 'oke', '2025-03-10 02:52:37', '2025-03-10 02:52:37'),
(6, '4', 6, 5.00, 'gurih', '2025-03-10 02:59:24', '2025-03-10 02:59:24');

--
-- Trigger `tbl_ratings`
--
DELIMITER $$
CREATE TRIGGER `update_avg_rating` AFTER INSERT ON `tbl_ratings` FOR EACH ROW BEGIN
    DECLARE avg_rating DECIMAL(10,2);

    -- Hitung rata-rata rating untuk menu tertentu
    SELECT AVG(rating) INTO avg_rating
    FROM tbl_ratings
    WHERE kode_menu = NEW.kode_menu;

    -- Update rata-rata rating di tbl_all_menu
    UPDATE tbl_all_menu
    SET rating = avg_rating
    WHERE kode_menu = NEW.kode_menu;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_avg_rating_on_delete` AFTER DELETE ON `tbl_ratings` FOR EACH ROW BEGIN
    DECLARE avg_rating DECIMAL(10,2);

    SELECT AVG(rating) INTO avg_rating
    FROM tbl_ratings
    WHERE kode_menu = OLD.kode_menu;

    UPDATE tbl_all_menu
    SET rating = COALESCE(avg_rating, 0)  -- Jika tidak ada rating, set jadi 0
    WHERE kode_menu = OLD.kode_menu;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_avg_rating_on_update` AFTER UPDATE ON `tbl_ratings` FOR EACH ROW BEGIN
    DECLARE avg_rating DECIMAL(10,2);

    SELECT AVG(rating) INTO avg_rating
    FROM tbl_ratings
    WHERE kode_menu = NEW.kode_menu;

    UPDATE tbl_all_menu
    SET rating = avg_rating
    WHERE kode_menu = NEW.kode_menu;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tbl_users`
--

CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `whatsapp` varchar(20) NOT NULL,
  `gender` enum('Laki-laki','Perempuan') NOT NULL,
  `workplace` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `tbl_users`
--

INSERT INTO `tbl_users` (`id`, `name`, `email`, `password`, `whatsapp`, `gender`, `workplace`) VALUES
(3, 'ajiji', 'ajiji@gmail.com', '$2y$10$98i1Yq8Roa6PIpevcQzfPuJCPbenKAKUdr7h9X48.O5QfY6vxmaKe', '', 'Laki-laki', ''),
(4, 'Aida', 'aida@gmail.com', '$2y$10$urdkVdD.xPeOarU0OmpYlOH.XVesJBMPBoIwTW3V5OsHlwksMdUUq', '08123', 'Perempuan', ''),
(5, 'aida', 'aida1@gmail.com', '$2y$10$6fMOf2c5./LrgHNQ12NnPOE.vR10Qv/6Sx9TT9ruv/KBgmiBmV5z2', '085695301781', 'Perempuan', 'Lainnya'),
(6, 'ajiji2', 'ajiji2@gmail.com', '$2y$10$Mr8DTvnmqy98Ct02/wug..u5G3CENlpefmZnKpKbpP6Gvjoh71Jxq', '085695301781', 'Laki-laki', 'PT.CBA Chemical Industry'),
(7, 'afifa', 'afifa@gmail.com', '$2y$10$cMrrbszVawJ8WvIxcutY/eaYUh4ftj6KnzeuzdhCanSJLfszI0W9a', '08123', 'Perempuan', 'Lainnya'),
(8, 'isma', 'isma@gmail.com', '$2y$10$ghBqqp3JBl.6CsEhku5yYOiSG2paWm0GPrHXfTZ4rrUMoCec6D/iq', '123', 'Perempuan', 'PT.CBA Chemical Industry'),
(9, 'Isma Hamizah', 'isma2@gmail.com', '$2y$10$Tg28yJv2fFEaRQZUAGg6eOQSPPaGFqzTrmgDHUutk.JPQOzKTByAO', '123', 'Perempuan', 'PT.CBA Chemical Industry');

-- --------------------------------------------------------

--
-- Struktur dari tabel `total_tagihan`
--

CREATE TABLE `total_tagihan` (
  `id_user` int(11) NOT NULL,
  `total` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `total_tagihan`
--

INSERT INTO `total_tagihan` (`id_user`, `total`) VALUES
(4, 144000.00),
(6, 160000.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `trigger_log`
--

CREATE TABLE `trigger_log` (
  `id` int(11) NOT NULL,
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `user_tokens`
--

CREATE TABLE `user_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `tbl_all_menu`
--
ALTER TABLE `tbl_all_menu`
  ADD PRIMARY KEY (`kode_menu`);

--
-- Indeks untuk tabel `tbl_deposit`
--
ALTER TABLE `tbl_deposit`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `deposit` (`deposit`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `tbl_invoices`
--
ALTER TABLE `tbl_invoices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `tbl_menu_today`
--
ALTER TABLE `tbl_menu_today`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_kode_menu` (`kode_menu`);

--
-- Indeks untuk tabel `tbl_ratings`
--
ALTER TABLE `tbl_ratings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ratings_user` (`user_id`),
  ADD KEY `fk_ratings_menu` (`kode_menu`);

--
-- Indeks untuk tabel `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeks untuk tabel `total_tagihan`
--
ALTER TABLE `total_tagihan`
  ADD PRIMARY KEY (`id_user`);

--
-- Indeks untuk tabel `trigger_log`
--
ALTER TABLE `trigger_log`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `user_tokens`
--
ALTER TABLE `user_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `tbl_deposit`
--
ALTER TABLE `tbl_deposit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `tbl_invoices`
--
ALTER TABLE `tbl_invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT untuk tabel `tbl_menu_today`
--
ALTER TABLE `tbl_menu_today`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT untuk tabel `tbl_ratings`
--
ALTER TABLE `tbl_ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `trigger_log`
--
ALTER TABLE `trigger_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `user_tokens`
--
ALTER TABLE `user_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `tbl_deposit`
--
ALTER TABLE `tbl_deposit`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `tbl_invoices`
--
ALTER TABLE `tbl_invoices`
  ADD CONSTRAINT `tbl_invoices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`);

--
-- Ketidakleluasaan untuk tabel `tbl_menu_today`
--
ALTER TABLE `tbl_menu_today`
  ADD CONSTRAINT `fk_kode_menu` FOREIGN KEY (`kode_menu`) REFERENCES `tbl_all_menu` (`kode_menu`);

--
-- Ketidakleluasaan untuk tabel `tbl_ratings`
--
ALTER TABLE `tbl_ratings`
  ADD CONSTRAINT `fk_ratings_menu` FOREIGN KEY (`kode_menu`) REFERENCES `tbl_all_menu` (`kode_menu`),
  ADD CONSTRAINT `fk_ratings_user` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `total_tagihan`
--
ALTER TABLE `total_tagihan`
  ADD CONSTRAINT `total_tagihan_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `user_tokens`
--
ALTER TABLE `user_tokens`
  ADD CONSTRAINT `user_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
