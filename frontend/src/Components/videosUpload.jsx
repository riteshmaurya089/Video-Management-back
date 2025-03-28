import React, { useState } from "react";
import axios from "axios";

const VideosUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("video", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://video-management-back.onrender.com/upload/video_upload",
        formData,
        {
          headers: {
            Authorization: ` ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Video uploaded successfully!");
      console.log("Upload Response:", res.data);
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400  flex items-center justify-center p-6">
  <div className=" rounded-lg p-6  w-full">
    {/* Header Section */}
    <div className="text-center mb-6 pb-4">
      <h2 className=" font-bold text-orange-400">Repurpose Video with AI</h2>
      <p className="text-white text-5xl mt-2">Now Repurpose long videos, 10x faster</p>
      <p className="text-white mt-1">
        Sierra allows you to create new video content in just a few clicks, <br /> 
        saving you time and effort.
      </p>
    </div>

    {/* Input Fields */}
    <div className="space-y-4 max-w-lg flex flex-col items-center justify-center m-auto">
      <input
        type="text"
        placeholder="Enter Video Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
      />
      <input
        type="text"
        placeholder="Enter Video Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
      />
      <input
        type="text"
        placeholder="Add Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
      />
      <input
        type="file"
        onChange={handleFileChange}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm cursor-pointer bg-gray-100"
      />
      
      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
      >
        Upload Video
      </button>
    </div>
  </div>
</div>

  );
};

export default VideosUpload;
