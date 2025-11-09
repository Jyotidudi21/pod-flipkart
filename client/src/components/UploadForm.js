import React, { useState, useRef } from "react";
import axios from "axios";

const UploadForm = () => {
  const [awb, setAwb] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const videoRef = useRef();

  const openCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!awb || !file) return alert("Enter AWB and choose file!");

    const formData = new FormData();
    formData.append("awbNumber", awb);
    formData.append("file", file);

    await axios.post("http://localhost:5000/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Uploaded successfully!");
    setAwb("");
    setFile(null);
    setPreview("");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2> Flipkart Proof of Delivery</h2>
      <input
        type="text"
        placeholder="Enter AWB Number"
        value={awb}
        onChange={(e) => setAwb(e.target.value)}
        style={{ padding: "8px", width: "240px" }}
      />
      <div style={{ marginTop: "20px" }}>
        <button onClick={openCamera}> Open Camera</button>
      </div>
      <video ref={videoRef} autoPlay style={{ width: "300px", marginTop: "10px" }}></video>

      <div style={{ marginTop: "20px" }}>
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
      </div>

      {preview && (
        <div style={{ marginTop: "20px" }}>
          {file.type.startsWith("video/") ? (
            <video src={preview} width="250" controls />
          ) : (
            <img src={preview} alt="preview" width="250" />
          )}
        </div>
      )}

      <div>
        <button onClick={handleUpload} style={{ marginTop: "20px", padding: "10px 20px" }}>
           Upload
        </button>
      </div>
    </div>
  );
};

export default UploadForm;
