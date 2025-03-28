import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

interface MarketplaceProps {
    productId: number,
    productName: string | "";
    username: string;
    description: string;
    price: number;
    downloadUrl: string;
    program: string;
    contentType: string;
    averageRating: number;
    onRatingUpdate: () => void;
  }

const MarketplaceComp: React.FC<MarketplaceProps> = ({
    productId,
    productName,
    username,
    description,
    price,
    downloadUrl,
    program,
    contentType,
    averageRating,
    onRatingUpdate,
  }) => {

    const [userRating, setUserRating] = useState<number>(0); 
    const [hasRated, setHasRated] = useState(false);

    const { isAuthenticated, user } = useContext(AuthContext)!;


    const fetchRatings = async () => {
        try {
          if (isAuthenticated && user?.username) {
            const userRes = await fetch(`http://localhost:8083/marketplace/rating/user/${user.username}`);
            if (!userRes.ok) throw new Error("Failed to fetch user ratings");
      
            const userData = await userRes.json(); // array of ratings
            const existingRating = userData.find((r: any) => r.productId === productId);
      
            if (existingRating) {
              setUserRating(existingRating.rating);
              setHasRated(true);
            }
          }
        } catch (err) {
          console.error("Error fetching user rating:", err);
        }
      };

    const handleRate = async (newRating: number) => {
        if (!isAuthenticated || !user?.username) return;
    
        const payload = {
          productId,
          rating: newRating,
          username: user.username,
        };
    
        try {
          const res = await fetch("http://localhost:8083/marketplace/rating/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
    
          if (!res.ok) throw new Error("Failed to submit rating");
    
          console.log("Rating submitted successfully");
          setUserRating(newRating);
          setHasRated(true);
          onRatingUpdate();

        } catch (err) {
          console.error("Error posting rating:", err);
        }
    };

    useEffect(() => {
        fetchRatings();
    }, [productId, isAuthenticated, user]);

    // console.log(productName + ":" + userRating + ":" + hasRated);
    // console.count(`${productName} render count`);


    return (
    <div className="flex flex-col h-full w-full bg-light-green border b-black rounded-lg p-6">

        {/* Header */}
        <div className="flex flex-row items-start justify-between">
            <div className="text-3xl">
                {productName}
            </div>

            <div className="text-dark-teal">
                <p>{username}</p>
            </div>

        </div>

        {/* Description */}
        <div>
            {description}
        </div>

        {/* Tags*/}
        <div className="flex flex-row justify-between pt-2">
            <div>
                <div className="text-lg font-semibold py-1 px-10 bg-purple border border-black text-black rounded-2xl">
                    {price == 0 ? "Free" : `$${price}`}
                </div>
            </div>

            <div className="flex flex-row gap-3">
                <div className="text-lg py-1 px-5 bg-offwhite border border-black text-black rounded-lg">
                    {averageRating.toFixed(1)} ★
                </div>
                <div className="text-lg py-1 px-5 bg-offwhite border border-black text-black rounded-lg">
                    {contentType}
                </div>
                <div className="text-lg py-1 px-5 bg-offwhite border border-black text-black rounded-lg">
                    {program}
                </div>
            </div>
        </div>

        {/* Buttons*/}
        <div className="flex flex-row items-end justify-between pt-3">
            {!isAuthenticated ? (
                <button
                    className="font-fancy text-2xl cursor-not-allowed px-20 py-1 bg-white border border-black text-black rounded-lg hover:bg-red/50 transition-colors duration-300"
                >
                    Log in to Access
                </button>
                ) : downloadUrl && price <= 0 ? (
                <button
                    className="font-fancy text-2xl cursor-pointer px-20 py-1 bg-white border border-black text-black rounded-lg hover:bg-minter transition-colors duration-300"
                    onClick={() => window.open(downloadUrl, "_blank")}
                >
                    Download
                </button>
                ) : (
                <button
                    className="font-fancy text-2xl cursor-pointer px-20 py-1 bg-white border border-black text-black rounded-lg hover:bg-minter transition-colors duration-300"
                >
                    Contact
                </button>
                )}


            <div className="flex flex-row gap-3 items-center">

                <div>
                {isAuthenticated ? (
                    <><p className="text-lg">Rate It!</p><Box sx={{ '& > legend': { mt: 3 } }}>
                                <Rating
                                    name="user-rating"
                                    value={userRating}
                                    onChange={(_e, newValue) => {
                                        if (!hasRated && newValue !== null) {
                                            handleRate(newValue);
                                        }
                                    } }
                                    readOnly={hasRated} />
                            </Box></>
                ) : (
                    <p className="text-md italic text-gray-600">Log in to leave a rating</p>
                )}
                </div>
            </div>

        </div>

    </div>
  )
}

export default MarketplaceComp;

