import React, { useState } from "react";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebars/MarketplaceSidebar";


const MarketplacePage: React.FC = () => {
  const [selectedTypes, setSelectedTypes] = useState<{ [type: string]: boolean }>({});
  const [selectedPrograms, setSelectedPrograms] = useState<{ [type: string]: boolean }>({});

  const handleTypeChange = (updatedTypes: { [type: string]: boolean }) => {
    setSelectedTypes(updatedTypes);

    // Later: Use these selected types to filter fetched data
    console.log("Selected content types:", updatedTypes);
  };

  const handleProgramChange = (updatedPrograms: { [type: string]: boolean }) => {
    setSelectedPrograms(updatedPrograms);

    // Later: Use these selected types to filter fetched data
    console.log("Selected content Program:", updatedPrograms);
  };


  return (
    <>
    <Header />
    <main className="flex flex-row items-center min-h-[calc(100vh-150px)] mx-14 py-8 gap-10 ">

      <div className="h-full w-full flex-[20%]">
        <Sidebar 
            selectedTypes={selectedTypes}
            onTypeChange={handleTypeChange}
            selectedPrograms={selectedPrograms}
            onProgramChange={handleProgramChange}
         />
      </div>


      <div className="text-red text-3xl p-8 border b-red h-full w-full flex-[80%]">
        Hello, from marketplace page
      </div>


    </main>
    </>
  );
};

export default MarketplacePage;