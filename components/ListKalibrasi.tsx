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

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus data ini?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase.from("kalibrasi").delete().eq("id", id);

    if (error) {
      console.error("Error deleting data:", error.message);
      alert("Gagal menghapus data.");
    } else {
      alert("Data berhasil dihapus.");
      setData((prevData) => prevData.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <p className="text-gray-400 text-center">Loading data...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-700 text-left text-gray-300">
                  <th className="p-3">Nama Barang</th>
                  <th className="p-3">Lokasi</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Periode (Bulan)</th>
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
                      <button
                        onClick={() => handleDelete(item.id)}
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
