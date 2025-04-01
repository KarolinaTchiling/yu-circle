import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import EditMarketplaceModal from "./EditMarketplaceModal";

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

const MarketplaceComp: React.FC = () => {
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [copiedMap, setCopiedMap] = useState<Record<number, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { user } = useContext(AuthContext)!;

  const fetchUserProductsAndRatings = async () => {
    if (!user?.username) return;

    try {
      const [productRes, ratingsRes] = await Promise.all([
        fetch(`${marketplaceURL}/products/user/${user.username}`),
        fetch(`${marketplaceURL}/marketplace/rating/average/all`),
      ]);

      if (!productRes.ok || !ratingsRes.ok) {
        throw new Error("One or more requests failed");
      }

      const productsData: Product[] = await productRes.json();
      const ratingsData: Record<number, number> = await ratingsRes.json(); // productId => rating

      const merged = productsData.map((product) => ({
        ...product,
        averageRating: ratingsData[product.productId] || 0,
      }));

      setUserProducts(merged);
    } catch (err) {
      console.error("Error fetching user products or ratings:", err);
    }
  };


  useEffect(() => {
    fetchUserProductsAndRatings();
  }, [user?.username]);

  const handleDelete = async (productId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${marketplaceURL}/marketplace/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      // Remove product from UI
      setUserProducts((prev) => prev.filter((p) => p.productId !== productId));
      console.log(`Product ${productId} deleted successfully`);
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleCopy = (product: Product) => {
    navigator.clipboard.writeText(product.downloadUrl);
  
    setCopiedMap((prev) => ({ ...prev, [product.productId]: true }));
  
    setTimeout(() => {
      setCopiedMap((prev) => ({ ...prev, [product.productId]: false }));
    }, 2000);
  };

  

  return (
    <main className="flex flex-col items-center bg-light-green border b-black rounded-lg w-full">
      <div className="bg-mint rounded-t-lg border-b b-black text-center font-fancy py-1 text-xl w-full">
        Marketplace Activity
      </div>

      <div className="flex flex-col gap-2 text-center max-h-141 mx-2 mt-2 overflow-y-auto">

      {/* Main Section */}
      <div className="flex flex-row w-full">
        <div className="w-full flex flex-col gap-2 m-2 text-center">
          {userProducts.length === 0 ? (
            <p className="text-sm italic mt-4">You haven’t posted anything yet.</p>
          ) : (
            userProducts.map((product) => (
              <div
                key={product.productId}
                className="bg-white border b-black rounded-lg p-2 px-3 text-left"
              >
                <h1 className="text-3xl">{product.productName}</h1>
                <p className="text-sm">{product.description}</p>

                <div className="flex flex-row gap-2 justify-between mt-3 mx-1">
                  <div className="border b-black px-6 rounded-lg">
                    {product.price === 0 ? "Free" : `$${product.price}`}
                  </div>

                  <div className="flex flex-row gap-2">
                    <div className="border b-black px-6 rounded-lg">
                      {(product.averageRating ?? 0).toFixed(1)} ★
                    </div>
                    <div className="border b-black px-6 rounded-lg">
                      {product.contentType}
                    </div>
                    <div className="border b-black px-6 rounded-lg">
                      {product.program}
                    </div>
                    

                  </div>

                </div>

                <div className="flex flex-row justify-between items-center pt-2 pb-1 px-1">
                  <div className="flex-1">
                      <div className="flex flex-row gap-2">
                          {product.downloadUrl && product.downloadUrl.trim() !== "" && (
                            <button 
                              onClick={() => window.open(product.downloadUrl, "_blank")}
                              className="py-0.5 px-10 rounded-lg border b-black cursor-pointer text-sm bg-purple hover:bg-bright-purple transition-colors duration-300"
                            >
                              View File
                            </button>
                          )}

                          {product.downloadUrl && product.downloadUrl.trim() !== "" && (
                            <button
                              onClick={() => handleCopy(product)}
                              className={`py-0.5 px-4 rounded-lg border b-black cursor-pointer text-sm transition-colors duration-300 ${
                                copiedMap[product.productId] ? "bg-grey" : "bg-grey-50"
                              }`}
                            >
                              {copiedMap[product.productId] ? "Copied!" : "Copy Link"}
                            </button>
                          )}
                      </div>
                  </div>

                  <div className="flex-1 flex gap-2 justify-end">
                    <button 
                      onClick={() => {
                        setEditingProduct(product); // save product data
                        setIsModalOpen(true);       // open modal
                      }}
                      className="py-0.5 px-10 rounded-lg border b-black cursor-pointer text-sm bg-mint hover:bg-minter transition-colors duration-300"
                    >
                      Edit
                    </button>

                    <button 
                      onClick={() => handleDelete(product.productId)}
                      className="py-0.5 px-10 rounded-lg border b-black cursor-pointer text-sm bg-light-red hover:bg-red/40 transition-colors duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
      </div>

      {editingProduct && (
          <EditMarketplaceModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingProduct(null);
              fetchUserProductsAndRatings();
            }}
            product={editingProduct}
          />
        )}
    </main>
  );
};

export default MarketplaceComp;
