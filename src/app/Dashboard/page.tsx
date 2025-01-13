"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // Import Supabase client
import { useRouter } from "next/navigation";
import UploadForm from "../../../components/UploadForm";
import ListKalibrasi from "../../../components/ListKalibrasi";
import Beranda from "../../../components/Beranda";
import Download from "../../../components/Download";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [loading, setLoading] = useState(true); // Untuk loading saat cek sesi
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = async () => {
      // Periksa sesi pengguna
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Jika tidak ada sesi, redirect ke halaman login
        router.push("/Login");
      } else {
        // Jika ada sesi, hentikan loading
        setLoading(false);
      }
    };

    checkUserSession();
  }, [router]);

  // Fungsi untuk merender konten dinamis berdasarkan menu yang diklik
  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <Beranda />;
      case "Daftar Arsip":
        return <ListKalibrasi />;
      case "Upload Arsip":
        return <UploadForm />;
      case "Download Arsip":
        return <Download />;
      default:
        return <p className="text-gray-400">Halaman tidak ditemukan.</p>;
    }
  };

  // Fungsi untuk Sign Out
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
      alert("Gagal keluar. Silakan coba lagi.");
    } else {
      router.push("/Login");
    }
  };

  if (loading) {
    // Tampilkan loading screen saat memeriksa sesi
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-400">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-4">
        <h1 className="text-2xl font-bold mb-8">Management Arsip</h1>
        <nav className="space-y-4">
          <div>
            <button
              onClick={() => setActivePage("dashboard")}
              className={`flex items-center space-x-2 ${
                activePage === "dashboard" ? "text-blue-400" : ""
              }`}>
              <span>🏠</span>
              <span>Dashboard</span>
            </button>
          </div>
          <div>
            <button
              onClick={() => setActivePage("Daftar Arsip")}
              className={`flex items-center space-x-2 ${
                activePage === "Daftar Arsip" ? "text-blue-400" : ""
              }`}>
              <span>📦</span>
              <span>Daftar Arsip</span>
            </button>
          </div>
          <div>
            <button
              onClick={() => setActivePage("Upload Arsip")}
              className={`flex items-center space-x-2 ${
                activePage === "Upload Arsip" ? "text-blue-400" : ""
              }`}>
              <span>🛠</span>
              <span>Upload Arsip</span>
            </button>
          </div>
          <div>
            <button
              onClick={() => setActivePage("Download Arsip")}
              className={`flex items-center space-x-2 ${
                activePage === "Download Arsip" ? "text-blue-400" : ""
              }`}>
              <span>🛠</span>
              <span>Download Arsip</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold capitalize">{activePage}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm">Welcome</p>
              <p className="font-bold">Admin</p>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
              Sign out
            </button>
          </div>
        </header>

        <section className="bg-gray-800 p-4 rounded">{renderContent()}</section>
      </main>
    </div>
  );
};

export default Dashboard;
