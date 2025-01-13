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

const Dashboard = () => {
  const [data, setData] = useState<KalibrasiData[]>([]);
  const [totalInput, setTotalInput] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Mengambil semua data kalibrasi
      const { data: kalibrasiData, error } = await supabase
        .from("kalibrasi")
        .select("*");

      if (error) {
        console.error("Error fetching data:", error.message);
      } else {
        setData(kalibrasiData || []);
        setTotalInput(kalibrasiData?.length || 0); // Set total input dari panjang data
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-300">Total Input</h2>
              <p className="text-3xl font-bold text-blue-400">{totalInput}</p>
            </div>
            <div className="text-gray-400">
              <i className="fas fa-database text-5xl"></i>
            </div>
          </div>
        </div>

        {/* Daftar Inputan */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Daftar Inputan</h2>
          {loading ? (
            <p className="text-gray-400">Loading data...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-700 text-left text-gray-300">
                    <th className="p-3">Nomor Pelanggan</th>
                    <th className="p-3">Alamat</th>
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">Periode (Bulan)</th>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
