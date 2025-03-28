import React, { useEffect, useState } from "react";
import axios from "axios";

const GetVideos = () => {
  const [videos, setVideos] = useState([]);
  const [searchType, setSearchType] = useState("title"); // Default search type
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 6;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://video-management-back.onrender.com/videos/get_videos", {
          headers: { Authorization: `${token}` },
        });
        setVideos(res.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  // **Filtering Logic**
  const filteredVideos = videos.filter((video) => {
    if (searchType === "title") {
      return video.title.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (searchType === "tag") {
      return video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    } else if (searchType === "date") {
      const formattedDate = new Date(video.uploadedAt).toLocaleDateString();
      return formattedDate.includes(searchQuery);
    }
    return true;
  });

  // **Pagination Logic**
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400">

      {/* Search Filters */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        {/* Select Search Type */}
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 w-full sm:w-1/4"
        >
          <option value="title">Search by Title</option>
          <option value="tag">Search by Tag</option>
          <option value="date">Search by Date (MM/DD/YYYY)</option>
        </select>

        {/* Input Field for Search */}
        <input
          type={searchType === "date" ? "date" : "text"}
          placeholder={`Enter ${searchType}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 w-full sm:w-1/3"
        />
      </div>

      {currentVideos.length === 0 ? (
        <p className="text-center text-gray-600">No videos found...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentVideos.map((video) => (
            <div key={video._id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              {/* Video Display */}
              {video.filePath.includes("drive.google.com") ? (
                <iframe
                  src={`https://drive.google.com/file/d/${video.filePath.split("id=")[1]}/preview`}
                  width="100%"
                  height="250px"
                  allow="autoplay"
                  className="mt-3 rounded-md border border-gray-300"
                />
              ) : (
                <video controls className="w-full mt-3 rounded-md border border-gray-300">
                  <source src={video.filePath} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}

              {/* Video Details */}
              <h2 className="text-lg font-semibold text-gray-800 mt-2">{video.title}</h2>
              <p className="text-gray-600 mt-1">{video.description}</p>
              <p className="text-sm text-gray-500"># <span className="text-gray-700">{video.tags.join(", #")}</span></p>
              <p className="text-sm text-gray-500 mt-2">Created on: {new Date(video.uploadedAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 mx-1 bg-black  text-white rounded-lg disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-200 rounded-lg mx-2">{currentPage}</span>
        <button
          onClick={() => setCurrentPage((prev) => (indexOfLastVideo < filteredVideos.length ? prev + 1 : prev))}
          className="px-4 py-2 mx-1 bg-black text-white rounded-lg disabled:opacity-50"
          disabled={indexOfLastVideo >= filteredVideos.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GetVideos;
