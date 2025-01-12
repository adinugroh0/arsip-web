"use client";

import { useState, useEffect } from "react";

interface Dokumen {
  id: number;
  jenis_dokumen: string;
  no_pelanggan: string;
  nama: string;
  alamat: string;
  no_hp: string;
  tanggal_dokumen: string;
  catatan: string;
  file_path: string;
}

const Barupdf = () => {
  const [dokumen, setDokumen] = useState<Dokumen[]>([]);
  const [formData, setFormData] = useState({
    jenis_dokumen: "",
    no_pelanggan: "",
    nama: "",
    alamat: "",
    no_hp: "",
    tanggal_dokumen: "",
    catatan: "",
    file: null as File | null,
  });

  useEffect(() => {
    fetch("/api/arsip")
      .then((res) => res.json())
      .then((data) => setDokumen(data))
      .catch((err) => console.error(err));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    form.append("jenis_dokumen", formData.jenis_dokumen);
    form.append("no_pelanggan", formData.no_pelanggan);
    form.append("nama", formData.nama);
    form.append("alamat", formData.alamat);
    form.append("no_hp", formData.no_hp);
    form.append("tanggal_dokumen", formData.tanggal_dokumen);
    form.append("catatan", formData.catatan);
    if (formData.file) form.append("file", formData.file);

    try {
      const res = await fetch("/api/arsip", {
        method: "POST",
        body: form,
      });

      if (res.ok) {
        const newDokumen = await res.json();
        setDokumen([...dokumen, newDokumen]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">
        Arsip Dokumen
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-200 max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Tambah Dokumen
        </h2>

        <input
          type="text"
          placeholder="Jenis Dokumen"
          value={formData.jenis_dokumen}
          onChange={(e) =>
            setFormData({ ...formData, jenis_dokumen: e.target.value })
          }
          className="border p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="No Pelanggan"
          value={formData.no_pelanggan}
          onChange={(e) =>
            setFormData({ ...formData, no_pelanggan: e.target.value })
          }
          className="border p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Nama"
          value={formData.nama}
          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          className="border p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Alamat"
          value={formData.alamat}
          onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
          className="border p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <input
          type="text"
          placeholder="No HP"
          value={formData.no_hp}
          onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
          className="border p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={formData.tanggal_dokumen}
          onChange={(e) =>
            setFormData({ ...formData, tanggal_dokumen: e.target.value })
          }
          className="border p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Catatan"
          value={formData.catatan}
          onChange={(e) =>
            setFormData({ ...formData, catatan: e.target.value })
          }
          className="border p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="border p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
          Tambah Dokumen
        </button>
      </form>
    </div>
  );
};

export default Barupdf;
