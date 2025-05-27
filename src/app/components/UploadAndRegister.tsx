// app/components/UploadAndRegister.tsx
"use client";

import { useState } from "react";
import { registerIpAsset } from "../lib/registerIpAsset";

export default function UploadAndRegister() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!file) return alert("Please select an image");
    setLoading(true);
    try {
      await registerIpAsset(file);
    } catch (err) {
      console.error(err);
      alert("Registration failed.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button
        className="bg-blue-500 text-white px-4 py-2 mt-4"
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? "Registering..." : "Register IP Asset"}
      </button>
    </div>
  );
}
