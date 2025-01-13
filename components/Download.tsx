"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface KalibrasiData {
  id: number;
  nama_barang: string;
  lokasi: string;
  dikalibrasi_pada: string;
  periode: number;
  file_path: string | null;
}

const ListKalibrasi = () => {
  const [data, setData] = useState<KalibrasiData[]>([]); // Gunakan tipe array objek
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKalibrasi = async () => {
      try {
        const { data: kalibrasiData, error: fetchError } = await supabase
          .from("kalibrasi")
          .select(
            "id, nama_barang, lokasi, dikalibrasi_pada, periode, file_path"
          );

        if (fetchError) throw new Error(fetchError.message);

        setData(kalibrasiData || []); // Sesuai dengan tipe KalibrasiData[]
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchKalibrasi();
  }, []);

  const handleDownload = async (filePath: string | null) => {
    if (!filePath) {
      alert("File path is not available.");
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from("kalibrasi")
        .download(filePath);

      if (error) throw new Error("Failed to download file: " + error.message);

      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filePath.split("/").pop() || "file.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error(error);
      alert("Failed to download file. Please try again.");
    }
  };

  if (loading) return <p className="text-center text-white">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="h-screen bg-transparent text-white flex flex-col items-center">
      <div className="max-w-5xl w-full">
        {data.length === 0 ? (
          <p className="text-center text-gray-400">
            Tidak ada data kalibrasi tersedia.
          </p>
        ) : (
          <table className="w-full bg-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-4 text-left text-sm text-gray-300">
                  Nama Barang
                </th>
                <th className="p-4 text-left text-sm text-gray-300">Lokasi</th>
                <th className="p-4 text-left text-sm text-gray-300">Tanggal</th>
                <th className="p-4 text-left text-sm text-gray-300">Periode</th>
                <th className="p-4 text-left text-sm text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-t border-gray-600">
                  <td className="p-4 text-sm text-gray-100">
                    {item.nama_barang}
                  </td>
                  <td className="p-4 text-sm text-gray-100">{item.lokasi}</td>
                  <td className="p-4 text-sm text-gray-100">
                    {item.dikalibrasi_pada}
                  </td>
                  <td className="p-4 text-sm text-gray-100">
                    {item.periode} bulan
                  </td>
                  <td className="p-4 text-sm text-gray-100">
                    {item.file_path ? (
                      <button
                        onClick={() => handleDownload(item.file_path)}
                        className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600">
                        Download PDF
                      </button>
                    ) : (
                      <span className="text-gray-400">No file</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ListKalibrasi;
