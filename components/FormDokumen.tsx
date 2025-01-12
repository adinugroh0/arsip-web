"use client";

import { useState } from "react";

const UploadDokumen = () => {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jenis_dokumen", "Dokumen Pengajuan"); // Example
    formData.append("no_pelanggan", "12345");
    formData.append("nama", "Adi Nugroho");
    formData.append("alamat", "Jl. Raya No. 12");
    formData.append("no_hp", "08123456789");
    formData.append("tanggal_dokumen", "2025-01-08");
    formData.append("catatan", "Dokumen ini untuk pengajuan.");

    try {
      const res = await fetch("/api/arsip", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      setResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(error);
      setResponse("Failed to upload file");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Dokumen PDF</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} className="mb-4" />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white">
          Upload
        </button>
      </form>
      {response && <pre className="mt-4">{response}</pre>}
    </div>
  );
};

export default UploadDokumen;
