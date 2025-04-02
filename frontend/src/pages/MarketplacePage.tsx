import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebars/MarketplaceSidebar";
import MarketplaceComp from "../components/MarketplaceComp";

const marketplaceURL = import.meta.env.VITE_MARKETPLACE_URL;

type Product = {
  productId: number;
  productName: string;
  username: string;
  description: string;
  price: number;
  downloadUrl: string | "";
  program: string | "";
  contentType: string | "";
  averageRating?: number;
};


const MarketplacePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<{ [type: string]: boolean }>({});
  const [selectedPrograms, setSelectedPrograms] = useState<{ [type: string]: boolean }>({});
  const [isFree, setIsFree] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("highestRated");

  const mergeProductsWithRatings = (
    productsData: Product[],
    ratingsData: Record<number, number>
  ): Product[] => {
    return productsData.map((product) => ({
      ...product,
      averageRating: ratingsData[product.productId] || 0,
    }));
  };

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "highestRated") {
      return (b.averageRating || 0) - (a.averageRating || 0);
    } else if (sortOption === "recent") {
      return b.productId - a.productId; // Newest first
    }
    return 0;
  });

  const buildQuery = (
    programs: { [type: string]: boolean },
    types: { [type: string]: boolean },
    isFree: boolean
  ) => {
    const selectedPrograms = Object.keys(programs).filter((key) => programs[key]);
    const selectedTypes = Object.keys(types).filter((key) => types[key]);
  
    const params = new URLSearchParams();
  
    if (selectedPrograms.length > 0) {
      params.append("program", selectedPrograms.join(","));
    }
  
    if (selectedTypes.length > 0) {
      params.append("contentType", selectedTypes.join(","));
    }

    if (isFree) {
      params.append("priceType", "free");
    }
  
    return params.toString();
  };


  const handleTypeChange = async (updatedTypes: { [type: string]: boolean }) => {
    setSelectedTypes(updatedTypes);
    const query = buildQuery(selectedPrograms, updatedTypes, isFree);
    const merged = await fetchProductsWithRatings(`${marketplaceURL}/marketplace/search?${query}`);
    setProducts(merged);
  };

  const handleProgramChange = async (updatedPrograms: { [type: string]: boolean }) => {
    setSelectedPrograms(updatedPrograms);
    const query = buildQuery(updatedPrograms, selectedTypes, isFree);
    const merged = await fetchProductsWithRatings(`${marketplaceURL}/marketplace/search?${query}`);
    setProducts(merged);
  };

  const handleIsFreeChange = async (free: boolean) => {
    setIsFree(free);
    const query = buildQuery(selectedPrograms, selectedTypes, free);
    const merged = await fetchProductsWithRatings(`${marketplaceURL}/marketplace/search?${query}`);
    setProducts(merged);
  };

  const handleClearFilters = async () => {
    const clearedTypes = Object.fromEntries(
      Object.keys(selectedTypes).map((key) => [key, false])
    );
    const clearedPrograms = Object.fromEntries(
      Object.keys(selectedPrograms).map((key) => [key, false])
    );
  
    setSelectedTypes(clearedTypes);
    setSelectedPrograms(clearedPrograms);
    setIsFree(false);
  
    const merged = await fetchProductsWithRatings(`${marketplaceURL}/marketplace/products`);
    setProducts(merged);
  };

  const fetchProductsWithRatings = async (endpoint: string) => {
    try {
      const [productRes, ratingsRes] = await Promise.all([
        fetch(endpoint),
        fetch(`${marketplaceURL}/marketplace/rating/average/all`),
      ]);
  
      const productsData: Product[] = await productRes.json();
      const ratingsData: Record<number, number> = await ratingsRes.json();
  
      return mergeProductsWithRatings(productsData, ratingsData);
    } catch (err) {
      console.error("Error fetching products with ratings:", err);
      return [];
    }
  };

  const fetchInitialProducts = async () => {
    const merged = await fetchProductsWithRatings(`${marketplaceURL}/marketplace/products`);
    setProducts(merged);
  };

  useEffect(() => {
    fetchInitialProducts();
  }, []);

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
            isFree={isFree}                     
            setIsFree={handleIsFreeChange}  
            onClearFilters={handleClearFilters}
            onSearchChange={setSearchTerm}
         />
      </div>


      <div className="h-full w-full flex-[80%] flex flex-col gap-4">

        <div className="flex justify-start items-center gap-3 mb-0">
          <label htmlFor="sort" className="text-sm font-medium">Sort by:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-3 py-1 border border-black rounded-md bg-white"
          >
            <option value="recent">Most Recent</option>
            <option value="highestRated">Highest Rated</option>
          </select>
        </div>

        {sortedProducts.map((product) => (
          <MarketplaceComp
            key={product.productId}
            productId={product.productId}
            productName={product.productName}
            username={product.username}
            description={product.description}
            price={product.price}
            downloadUrl={product.downloadUrl}
            program={product.program}
            contentType={product.contentType}
            averageRating={product.averageRating || 0}
            onRatingUpdate={fetchInitialProducts} 
          />
        ))}

      </div>


    </main>
    </>
  );
};

export default MarketplacePage;