"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Definisikan tipe untuk data kalibrasi
interface KalibrasiData {
  id: number;
  nama_barang: string;
  lokasi: string;
  dikalibrasi_pada: string;
  periode: number;
  file_path: string | null;
}

const ListKalibrasi = () => {
  const [data, setData] = useState<KalibrasiData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: kalibrasiData, error } = await supabase
        .from("kalibrasi")
        .select("*");

      if (error) {
        console.error("Error fetching data:", error.message);
      } else {
        setData(kalibrasiData || []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number, filePath: string | null) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus data ini?"
    );
    if (!confirmDelete) return;

    try {
      // Hapus file di Supabase Storage jika ada
      if (filePath) {
        const bucketName = "kalibrasi"; // Nama bucket
        console.log("Menghapus file di storage:", filePath);

        const { error: deleteFileError } = await supabase.storage
          .from(bucketName)
          .remove([filePath]);

        if (deleteFileError) {
          console.error("Error deleting file:", deleteFileError.message);
          alert("Gagal menghapus file di storage.");
          return;
        }

        console.log("File berhasil dihapus:", filePath);
      }

      // Hapus data dari tabel
      console.log("Menghapus data dari tabel...");
      const { error: deleteDataError } = await supabase
        .from("kalibrasi")
        .delete()
        .eq("id", id);

      if (deleteDataError) {
        console.error("Error deleting data:", deleteDataError.message);
        alert("Gagal menghapus data.");
        return;
      }

      alert("Data berhasil dihapus.");
      setData((prevData) => prevData.filter((item) => item.id !== id)); // Hapus item dari state
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <p className="text-gray-400">Loading data...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-700 text-left text-gray-300">
                  <th className="p-3">Nama Barang</th>
                  <th className="p-3">Lokasi</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Periode (Bulan)</th>
                  <th className="p-3">Sertifikat</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"
                    }`}>
                    <td className="p-3">{item.nama_barang}</td>
                    <td className="p-3">{item.lokasi}</td>
                    <td className="p-3">{item.dikalibrasi_pada}</td>
                    <td className="p-3">{item.periode}</td>
                    <td className="p-3">
                      {item.file_path ? (
                        <button
                          onClick={() => {
                            const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${item.file_path}`;
                            window.open(fileUrl, "_blank");
                          }}
                          className="text-blue-400 hover:underline">
                          Lihat Sertifikat
                        </button>
                      ) : (
                        <span className="text-gray-400">Tidak ada file</span>
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(item.id, item.file_path)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListKalibrasi;
