import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Switch } from "../ui/switch";
import MarketplaceModal from "../MarketplaceModal";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
    selectedTypes: { [type: string]: boolean };
    onTypeChange: (updatedTypes: { [type: string]: boolean }) => void;
    selectedPrograms: { [program: string]: boolean };
    onProgramChange: (updatedPrograms: { [type: string]: boolean }) => void;
    isFree: boolean;
    setIsFree: (value: boolean) => void;
    onClearFilters: () => void;
    onSearchChange: (term: string) => void;
}

const MarketplaceSidebar: React.FC<SidebarProps> = ({
    selectedTypes,
    onTypeChange,
    selectedPrograms,
    onProgramChange,
    isFree,
    setIsFree,
    onClearFilters,
    onSearchChange
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const contentType = ["Lecture Notes", "Tutoring", "Mini-course", "Videos"];
    const contentProgram = ["Engineering", "Science", "Business", "Liberal Arts", "Education", "Economics", "Health"];
    const navigate = useNavigate();

    const { isAuthenticated } = useContext(AuthContext)!;

    return (
        <div className="flex flex-col items-center h-full w-full bg-grey-50 border b-black rounded-lg">
            {/* Header + Add Button */}
                {isAuthenticated ? (
                    <div className="flex flex-row items-center gap-4 p-6 w-full">
                        <button
                        onClick={() => setIsModalOpen(true)}
                        className="font-bold text-3xl cursor-pointer h-12 w-12 bg-white border border-black text-black rounded-full hover:bg-mint transition-colors duration-300"
                        >
                        +
                        </button>
                        <h1 className="text-2xl">Add Content</h1>
                        
                    </div>
                ) : (
                    <div className="flex flex-col items-center p-6 gap-2 w-full">
                        <h1 className="text-xl text-center">Join the Marketplace!</h1>
                        <button
                            className="text-md cursor-pointer w-[95%] py-1 bg-white border border-black text-black rounded-md hover:bg-minter transition-colors duration-300"
                            onClick={() => navigate('/signup')}
                        >
                            Create an Account
                        </button>
                        <button
                            className="text-md cursor-pointer w-[95%] py-1 bg-white border border-black text-black rounded-md hover:bg-bright-purple transition-colors duration-300"
                            onClick={() => navigate('/login')}
                        >
                            Log In
                        </button>
                    </div>
                )}


            <hr className="w-[80%] border-t border-black" />

            {/* Search Input */}
            <div className="py-4 w-[80%]">
                <input
                    type="text"
                    placeholder="Search"
                    className="border border-black w-full bg-white rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-mint"
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <hr className="w-[80%] border-t border-black" />

            <div className="w-[80%]">
                <div className="flex flex-row items-center justify-between w-full">
                    <p className="text-xl font-semibold py-3">Filter Content</p>
                    <button
                        onClick={onClearFilters}
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
            <div className="w-[80%] py-5 flex flex-row gap-3 font-light items-center">
                <Switch
                    checked={isFree}
                    onCheckedChange={(checked) => setIsFree(checked)}
                />
                <p>Free Only</p>
            </div>

            <MarketplaceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default MarketplaceSidebar;