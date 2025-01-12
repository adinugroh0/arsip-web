import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost", // Host database (sesuaikan dengan XAMPP Anda)
  user: "root", // User MySQL
  password: "", // Password MySQL (kosong jika default)
  database: "arsip", // Nama database
});
