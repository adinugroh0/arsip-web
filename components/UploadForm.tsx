"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const CreateKalibrasi = () => {
  const [form, setForm] = useState({
    namaBarang: "",
    lokasi: "",
    tanggal: "",
    periode: 1,
    file: null as File | null,
  });

  const [message, setMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "periode" ? parseInt(value, 10) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    setForm((prev) => ({
      ...prev,
      file: uploadedFile || null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      let filePath = null;

      // Upload file jika ada
      if (form.file) {
        const fileName = `pdfs/${Date.now()}_${form.file.name}`;
        const { data: fileData, error: fileError } = await supabase.storage
          .from("kalibrasi") // Nama bucket Supabase
          .upload(fileName, form.file, {
            contentType: "application/pdf",
          });

        if (fileError)
          throw new Error(`File upload failed: ${fileError.message}`);
        filePath = fileData?.path || null;
      }

      // Simpan data ke tabel `kalibrasi`
      const { error: insertError } = await supabase.from("kalibrasi").insert({
        nama_barang: form.namaBarang,
        lokasi: form.lokasi,
        dikalibrasi_pada: form.tanggal,
        periode: form.periode,
        file_path: filePath,
      });

      if (insertError)
        throw new Error(`Data insertion failed: ${insertError.message}`);

      setMessage("Data successfully submitted!");
      setForm({
        namaBarang: "",
        lokasi: "",
        tanggal: "",
        periode: 1,
        file: null,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="h-screen bg-transparent text-white flex flex-col items-center">
      <div className="max-w-5xl w-full">
        <form onSubmit={handleSubmit} className="bg-tranparent p-8 space-y-6">
          {/* Nama Barang */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="namaBarang"
                className="block text-sm font-medium text-gray-400 mb-2">
                Nomor Pelanggan
              </label>
              <input
                type="text"
                id="namaBarang"
                name="namaBarang"
                value={form.namaBarang}
                onChange={handleInputChange}
                className="bg-gray-700 text-white p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Masukkan nama "
              />
            </div>

            {/* Lokasi */}
            <div>
              <label
                htmlFor="lokasi"
                className="block text-sm font-medium text-gray-400 mb-2">
                Alamat
              </label>
              <input
                type="text"
                id="lokasi"
                name="lokasi"
                value={form.lokasi}
                onChange={handleInputChange}
                className="bg-gray-700 text-white p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Masukkan Lokasi"
              />
            </div>
          </div>

          {/* Tanggal */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="tanggal"
                className="block text-sm font-medium text-gray-400 mb-2">
                Dikalibrasi pada
              </label>
              <input
                type="date"
                id="tanggal"
                name="tanggal"
                value={form.tanggal}
                onChange={handleInputChange}
                className="bg-gray-700 text-white p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Periode */}
            <div>
              <label
                htmlFor="periode"
                className="block text-sm font-medium text-gray-400 mb-2">
                Periode (Bulan)
              </label>
              <input
                type="number"
                id="periode"
                name="periode"
                value={form.periode}
                onChange={handleInputChange}
                className="bg-gray-700 text-white p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                min="1"
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-400 mb-2">
              Sertifikat kalibrasi
            </label>
            <div className="bg-gray-700 p-4 rounded-lg border-dashed border-2 border-gray-500 flex items-center justify-between">
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden"
              />
              <label
                htmlFor="file"
                className="text-blue-400 cursor-pointer hover:underline">
                Drag & Drop your files or{" "}
                <span className="font-bold">Browse</span>
              </label>
              {form.file && (
                <span className="text-gray-400 text-sm">{form.file.name}</span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 px-6 py-3 rounded-lg font-medium text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-lg">
              Create
            </button>
            <button
              type="button"
              className="bg-gray-600 px-6 py-3 rounded-lg font-medium text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md">
              Cancel
            </button>
          </div>
        </form>
        {message && (
          <p className="mt-4 text-sm font-medium text-center text-green-400 animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateKalibrasi;
