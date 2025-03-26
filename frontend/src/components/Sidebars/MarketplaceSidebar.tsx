import React, { useState } from "react";
import { Switch } from "../ui/switch";

interface SidebarProps {
    selectedTypes: { [type: string]: boolean };
    onTypeChange: (updatedTypes: { [type: string]: boolean }) => void;
    selectedPrograms: { [program: string]: boolean };
    onProgramChange: (updatedPrograms: { [type: string]: boolean }) => void;
}

const MarketplaceSidebar: React.FC<SidebarProps> = ({
    selectedTypes,
    onTypeChange,
    selectedPrograms,
    onProgramChange,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [isFree, setIsFree] = useState(true);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [customTagInput, setCustomTagInput] = useState("");

    const contentType = ["Lecture Notes", "Tutoring", "Mini-courses", "Videos"];
    const contentProgram = ["Engineering", "Science", "Business", "Liberal Arts", "Education", "Economics", "Health"];

    return (
        <div className="flex flex-col items-center h-full w-full bg-grey-50 border b-black rounded-lg">
            {/* Header + Add Button */}
            <div className="flex flex-row items-center gap-4 p-6 w-full">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="font-bold text-3xl cursor-pointer h-12 w-12 bg-white border border-black text-black rounded-full hover:bg-mint transition-colors duration-300"
                >
                    +
                </button>
                <h1 className="text-2xl">Add Content</h1>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center  bg-black/50"
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
                                            className={`px-4 py-1 text-sm ${isFree ? "bg-indigo-200 font-semibold" : "bg-white"
                                                }`}
                                        >
                                            Free
                                        </button>
                                        <button
                                            onClick={() => setIsFree(false)}
                                            className={`px-4 py-1 text-sm ${!isFree ? "bg-indigo-200 font-semibold" : "bg-white"
                                                }`}
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

                        {/* Tag Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Select Tags</label>
                            <div className="flex flex-wrap gap-2">
                                {["Tutoring", "Lecture Notes", "Mini-course", "Video"].map((tag) => (
                                    <button
                                        key={tag}
                                        className={`px-3 py-1 rounded-full border text-sm ${selectedTags.includes(tag)
                                            ? "bg-gray-400 text-white"
                                            : "bg-white text-black"
                                            }`}
                                        onClick={() =>
                                            setSelectedTags((prev) =>
                                                prev.includes(tag)
                                                    ? prev.filter((t) => t !== tag)
                                                    : [...prev, tag]
                                            )
                                        }
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Tags */}
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

                            {/* Suggested Tags*/}
                            {contentProgram
                                .filter((program) =>
                                    customTagInput
                                        ? program.toLowerCase().startsWith(customTagInput.toLowerCase())
                                        : true
                                ).length > 0 && (
                                    <div className="mt-1 border rounded-xl bg-white shadow-md max-h-40 overflow-y-auto scrollbar-none">
                                        {contentProgram
                                            .filter((program) =>
                                                customTagInput
                                                    ? program.toLowerCase().startsWith(customTagInput.toLowerCase())
                                                    : true
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

                        {/* Submit Button (does nothing) */}
                        <div className="flex gap-3 justify-center pt-2">
                            <button
                                className="px-10 py-2 rounded-md bg-white border text-lg font-medium hover:bg-gray-100"
                                onClick={() => setIsModalOpen(false)}
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
            )}

            <hr className="w-[80%] border-t border-black" />

            {/* Search Input */}
            <div className="py-4 w-[80%]">
                <input
                    type="text"
                    placeholder="Search"
                    className="border border-black w-full bg-white rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-mint"
                />
            </div>

            <hr className="w-[80%] border-t border-black" />

            <div className="w-[80%]">
                <div className="flex flex-row items-center justify-between w-full">
                    <p className="text-xl font-semibold py-3">Filter Content</p>
                    <button
                        className="font-bold text-xs cursor-pointer h-6 w-6 bg-offwhite border border-black text-black rounded-full hover:bg-red/50 transition-colors duration-300"
                    >
                        ✖
                    </button>
                </div>

                {/* Filter by Type */}
                <div>
                    <h3 className="text-xl font-extralight pb-2">Filter by Type</h3>
                    {contentType.map((type) => (
                        <label key={type} className="flex items-center pb-1 space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={selectedTypes[type] || false}
                                onChange={() => {
                                    const updatedTypes = { ...selectedTypes, [type]: !selectedTypes[type] };
                                    onTypeChange(updatedTypes);
                                }}
                            />
                            <span
                                className={`w-5 h-5 flex items-center justify-center border ${selectedTypes[type] ? "bg-mint border-black rounded-full" : "bg-offwhite border-black rounded-full"
                                    }`}
                            ></span>
                            <span className="text-black text-md font-light">{type}</span>
                        </label>
                    ))}
                </div>

                {/* Filter by Program */}
                <div>
                    <h3 className="text-xl font-extralight pb-2">Filter by Program</h3>
                    {contentProgram.map((program) => (
                        <label key={program} className="flex items-center pb-1 space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={selectedPrograms[program] || false}
                                onChange={() => {
                                    const updatedPrograms = { ...selectedPrograms, [program]: !selectedPrograms[program] };
                                    onProgramChange(updatedPrograms);
                                }}
                            />
                            <span
                                className={`w-5 h-5 flex items-center justify-center border ${selectedPrograms[program] ? "bg-mint border-black rounded-full" : "bg-offwhite border-black rounded-full"
                                    }`}
                            ></span>
                            <span className="text-black text-md font-light">{program}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Free Only Toggle */}
            <div className="w-[80%] py-5 flex flex-row gap-3 font-light">
                <Switch />
                <p>Free Only</p>
            </div>
        </div>
    );
};

export default MarketplaceSidebar;