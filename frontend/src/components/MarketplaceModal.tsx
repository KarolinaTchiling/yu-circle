import React, { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFree: boolean;
  setIsFree: (value: boolean) => void;
}

const MarketplaceModal: React.FC<ModalProps> = ({ isOpen, onClose, isFree, setIsFree }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState("");

  const contentProgram = [
    "Engineering",
    "Science",
    "Business",
    "Liberal Arts",
    "Education",
    "Economics",
    "Health"
  ];

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="bg-[#e9ece3] p-6 rounded-lg shadow-lg w-[600px] border space-y-4">
        <h2 className="text-2xl font-semibold text-center">Create your Marketplace Post</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              className="w-full p-2 border rounded-xl bg-white"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Cost</label>
              <div className="flex rounded-full overflow-hidden border w-fit">
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
            </div>

            <div className="mt-4 flex items-center gap-2">
              <label className="text-sm font-medium">Upload File</label>
              <button className="h-6 w-6 bg-white border border-black rounded-full flex items-center justify-center hover:bg-gray-100 text-black text-sm">
                +
              </button>
            </div>

            {!isFree && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Price</label>
                <input className="w-full p-2 border rounded-md" placeholder="$0.00" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full h-40 p-2 border rounded-xl bg-white resize-none"
              placeholder="Add a description..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Select Tags</label>
          <div className="flex flex-wrap gap-2">
            {["Tutoring", "Lecture Notes", "Mini-course", "Video"].map((tag) => (
              <button
                key={tag}
                className={`px-3 py-1 rounded-full border text-sm ${selectedTags.includes(tag)
                  ? "bg-gray-400 text-white"
                  : "bg-white text-black"}`}
                onClick={() =>
                  setSelectedTags((prev) =>
                    prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                  )
                }
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Custom Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              className="flex-1 p-2 border rounded-xl bg-white"
              placeholder="Add tag"
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
            />
            <button
              onClick={() => {
                if (customTagInput.trim()) {
                  setSelectedTags((prev) => [...prev, customTagInput.trim()]);
                  setCustomTagInput("");
                }
              }}
              className="h-8 w-8 bg-white border border-black rounded-full flex items-center justify-center hover:bg-gray-100"
            >
              +
            </button>
          </div>

          {contentProgram.filter((program) =>
            customTagInput ? program.toLowerCase().startsWith(customTagInput.toLowerCase()) : true
          ).length > 0 && (
            <div className="mt-1 border rounded-xl bg-white shadow-md max-h-40 overflow-y-auto scrollbar-none">
              {contentProgram
                .filter((program) =>
                  customTagInput ? program.toLowerCase().startsWith(customTagInput.toLowerCase()) : true
                )
                .map((program) => (
                  <div
                    key={program}
                    onClick={() => {
                      if (!selectedTags.includes(program)) {
                        setSelectedTags((prev) => [...prev, program]);
                      }
                      setCustomTagInput("");
                    }}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {program}
                  </div>
                ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {selectedTags
              .filter((tag) => !["Tutoring", "Lecture Notes", "Mini-course", "Video"].includes(tag))
              .map((tag) => (
                <div
                  key={tag}
                  className="px-3 py-1 rounded-full border text-sm bg-white"
                >
                  {tag}
                </div>
              ))}
          </div>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <button
            className="px-10 py-2 rounded-md bg-white border text-lg font-medium hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-10 py-2 rounded-md bg-white border text-lg font-medium hover:bg-gray-100"
            onClick={null}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceModal;
