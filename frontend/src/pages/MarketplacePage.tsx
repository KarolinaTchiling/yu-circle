import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebars/MarketplaceSidebar";
import MarketplaceComp from "../components/MarketplaceComp";

type Product = {
  productName: string;
  username: string;
  description: string;
  price: number;
  downloadUrl: string | "";
  program: string | "";
  contentType: string | "";
};


const MarketplacePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
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

  useEffect(() => {
    fetch("http://localhost:8083/marketplace/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  console.log(products);



  return (
    <>
    <Header />
    <main className="flex flex-row min-h-[calc(100vh-150px)] mx-14 py-8 gap-10 ">

      <div className="h-full w-full flex-[20%]">
        <Sidebar 
            selectedTypes={selectedTypes}
            onTypeChange={handleTypeChange}
            selectedPrograms={selectedPrograms}
            onProgramChange={handleProgramChange}
         />
      </div>


      <div className="h-full w-full flex-[80%] flex flex-col gap-4">
        {products.map((product, index) => (
          <MarketplaceComp
            key={index}
            productName={product.productName}
            username={product.username}
            description={product.description}
            price={product.price}
            downloadUrl={product.downloadUrl}
            program={product.program}
            contentType={product.contentType}
          />
        ))}

      </div>


    </main>
    </>
  );
};

export default MarketplacePage;