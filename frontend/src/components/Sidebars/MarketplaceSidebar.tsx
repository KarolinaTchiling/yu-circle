import React from "react";
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

    const contentType = ["Lecture Notes", "Tutoring", "Mini-courses", "Videos"];
    const contentProgram = ["Engineering", "Science", "Business", "Liberal Arts", "Education", "Economics", "Health"];

    return (
        <div className="flex flex-col items-center h-full w-full  bg-grey-50 border b-black rounded-lg">

            {/* Add content */}
            <div className="flex flex-row items-center gap-4 p-6 w-full">
                <button
                    className="font-bold text-3xl cursor-pointer h-12 w-12 bg-white border border-black text-black rounded-full hover:bg-minter transition-colors duration-300"
                >
                    +
                </button>
                <h1 className="text-2xl">Add Content </h1>
            </div>

            <hr className="w-[80%]  border-t border-black" />

            <div className="py-4 w-[80%]">
                <input
                    type="text"
                    // value={new}
                    // onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Search"
                    className="border border-black w-full bg-white rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-mint"
                />
            </div>

            <hr className="w-[80%]  border-t border-black" />

            <div className="w-[80%]">
                <div className="flex flex-row items-center justify-between w-full">
                    <p className="text-xl font-semibold py-3">
                        Filter Content
                    </p>
                    <button
                            // onClick={() => handleDeleteTag(tag)}
                            className="font-bold text-xs cursor-pointer h-6 w-6 bg-offwhite border border-black text-black rounded-full hover:bg-red/50 transition-colors duration-300"
                        >
                            ✖
                    </button>
                </div>


                {/* Type Section */}
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
                        className={`w-5 h-5 flex items-center justify-center border-1 ${
                            selectedTypes[type] ? "bg-mint border-black rounded-full" : "bg-offwhite border-black rounded-full"
                        }`}
                        ></span>
                        <span className="text-black text-md font-light">{type}</span>
                    </label>
                    ))}
                </div>

                {/* Program Section */}
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
                        className={`w-5 h-5 flex items-center justify-center border-1 ${
                            selectedPrograms[program] ? "bg-mint border-black rounded-full" : "bg-offwhite border-black rounded-full"
                        }`}
                        ></span>
                        <span className="text-black text-md font-light">{program}</span>
                    </label>
                    ))}
                </div>
            </div>

            <div className="w-[80%] py-5 flex flex-row gap-3 font-light">
                <Switch />
                <p>Free Only</p>
            </div>

            
        </div>
    );
};

export default MarketplaceSidebar;