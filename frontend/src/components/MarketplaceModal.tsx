import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MarketplaceModal: React.FC<ModalProps> = ({ isOpen, onClose}) => {
  const authContext = useContext(AuthContext);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string[]>([]);
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [uploadSuccessUrl, setUploadSuccessUrl] = useState("");

  const handleCancel = () => {
    setNewTitle("");
    setNewContent("");
    setSelectedContent([]);
    setSelectedProgram([]);
    setIsFree(true);
    setPrice("");
    setDownloadUrl("");
    setUploadSuccessUrl("");
    onClose();
  };


  if (!isOpen) return null;

  const { user } = authContext!;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8083/marketplace/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const url = await res.text(); 
      setDownloadUrl(url);
      setUploadSuccessUrl(url);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadSuccessUrl("Error uploading file.");
    }
  };



  const handlePost = async () => {
    
    const payload = {
      productName: newTitle,
      username: user!.username, 
      description: newContent,
      price: isFree ? 0 : parseFloat(price),
      downloadUrl,
      program: selectedProgram[0] || "",
      contentType: selectedContent[0] || "",
    };
  
    try {
      const res = await fetch("http://localhost:8083/marketplace/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) throw new Error("Failed to post content");
  
      console.log("Posted successfully");
      onClose(); // Close the modal on success
      window.location.reload(); 
    } catch (err) {
      console.error("Error posting content:", err);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="bg-[#e9ece3] p-6 rounded-lg shadow-lg w-[600px] border space-y-4">
        <h2 className="text-2xl font-semibold text-center">Create your Marketplace Post</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              className="w-full p-2 border rounded-xl bg-white"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full h-40 p-2 border rounded-xl bg-white resize-none"
              placeholder="Add a description..."
              value={newContent}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 250) {
                  setNewContent(value);
                }
              }}
            />
            <p className="text-sm text-gray-500 text-right pr-1">{newContent.length}/250</p>
          </div>

        </div>


        <div>
        <div className="-mt-3 flex flex-col gap-5">

          <div className="flex flex-row items-center gap-3">

                <label className="text-sm font-medium">Upload File</label>

                <label className="h-6 w-6 bg-white border border-black rounded-full flex items-center justify-center hover:bg-gray-100 text-black text-sm cursor-pointer">
                  +
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

              {uploadSuccessUrl && (
                  <div className="mt-2 text-sm">
                    {uploadSuccessUrl.startsWith("http") ? (
                      <a
                        href={uploadSuccessUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Uploaded File
                      </a>
                    ) : (
                      <p className="text-red-600">{uploadSuccessUrl}</p>
                    )}
                  </div>
                )}

            </div>

              <div className="flex flex-row gap-5">
                <label className="flex flex-row items-center text-sm font-medium">Cost</label>
                    <div className="flex items-center gap-4">
                        {/* Free/Paid Buttons */}
                        <div className="flex rounded-full overflow-hidden border w-fit my-2">
                        <button
                            onClick={() => setIsFree(true)}
                            className={`px-4 py-1 text-sm ${isFree ? "bg-indigo-200 font-semibold" : "bg-white"}`}
                        >
                            Free
                        </button>
                        <button
                            onClick={() => setIsFree(false)}
                            className={`px-4 py-1 text-sm ${!isFree ? "bg-indigo-200 font-semibold" : "bg-white"}`}
                        >
                            Paid
                        </button>
                        </div>
                        {!isFree && (
                        <input
                            className="w-48 ml-5 p-2 border rounded-md"
                            placeholder="$0.00"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        )}
                    </div>
              </div>
            </div>



          <label className="block text-sm font-medium mt-5 mb-2">Select Content Type Tag</label>
          <div className="flex flex-wrap gap-2">
            {["Tutoring", "Lecture Notes", "Mini-course", "Video"].map((tag) => (
              <button
                key={tag}
                className={`px-3 py-1 rounded-full border text-sm ${selectedContent.includes(tag)
                  ? "bg-gray-400 text-white"
                  : "bg-white text-black"}`}
                onClick={() =>
                  setSelectedContent((prev) =>
                    prev.includes(tag) ? [] : [tag] 
                  )
                }
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Select Program Tag</label>
          <div className="flex flex-wrap gap-2">
            {["Engineering","Science", "Business", "Liberal Arts", "Education", "Economics", "Health"].map((tag) => (
              <button
                key={tag}
                className={`px-3 py-1 rounded-full border text-sm ${selectedProgram.includes(tag)
                  ? "bg-gray-400 text-white"
                  : "bg-white text-black"}`}
                onClick={() =>
                  setSelectedProgram((prev) =>
                    prev.includes(tag) ? [] : [tag] 
                  )
                }
              >
                {tag}
              </button>
            ))}
          </div>
        </div>


        <div className="flex gap-3 justify-center pt-2">
          <button
            className="px-10 py-2 rounded-md bg-white border text-lg font-medium hover:bg-gray-100"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="px-10 py-2 rounded-md bg-white border text-lg font-medium hover:bg-gray-100"
            onClick={handlePost}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceModal;
