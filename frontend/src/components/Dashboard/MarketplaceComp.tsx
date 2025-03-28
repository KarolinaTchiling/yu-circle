import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

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
  const { user } = useContext(AuthContext)!;

  useEffect(() => {
    const fetchUserProductsAndRatings = async () => {
      if (!user?.username) return;

      try {
        const [productRes, ratingsRes] = await Promise.all([
          fetch(`http://localhost:8083/marketplace/products/user/${user.username}`),
          fetch("http://localhost:8083/marketplace/rating/average/all"),
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

    fetchUserProductsAndRatings();
  }, [user?.username]);

  const handleDelete = async (productId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8083/marketplace/products/${productId}`, {
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

  return (
    <main className="flex flex-col items-center bg-light-green border b-black rounded-lg w-full">
      <div className="bg-mint rounded-t-lg border-b b-black text-center font-fancy py-1 text-xl w-full">
        Marketplace Activity
      </div>

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
                  <button 
                    onClick={() => handleDelete(product.productId)}
                    className="w-[15%] py-0.5 rounded-lg border b-black cursor-pointer text-sm bg-light-red hover:bg-red/40 transition-colors duration-300">
                    Delete
                  </button>
                </div>


              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default MarketplaceComp;
