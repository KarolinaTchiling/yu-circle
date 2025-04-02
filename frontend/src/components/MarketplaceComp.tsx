import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import ProfilePopup from './ProfilePopup'; 
import ContactButton from "./ContactButton"

const marketplaceURL = import.meta.env.VITE_MARKETPLACE_URL;
const notificationURL = import.meta.env.VITE_NOTIFICATIONS_URL;

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
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const { isAuthenticated, user } = useContext(AuthContext)!;


    const fetchRatings = async () => {
        try {
          if (isAuthenticated && user?.username) {
            const userRes = await fetch(`${marketplaceURL}/marketplace/rating/user/${user.username}`);
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
          const res = await fetch(`${marketplaceURL}/marketplace/rating/add`, {
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

    const handleDownload = async () => {
        if (!isAuthenticated || !user?.username) return;
    
        const payload = {
          username: username,
          message: `${user.username} downloaded your marketplace item; \"${productName}\"`
        };
    
        try {
          const res = await fetch(`${notificationURL}/notification/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
    
          if (!res.ok) throw new Error("Failed to send notification");
    
          console.log("Notification sent successfully");
          window.open(downloadUrl, "_blank")

        } catch (err) {
          console.error("Error sending Notification:", err);
        }
    };

    useEffect(() => {
        fetchRatings();
    }, [productId, isAuthenticated, user]);


    return (
        <>
    <div className="flex flex-col h-full w-full bg-light-green border b-black rounded-lg p-6">

        {/* Header */}
        <div className="flex flex-row items-start justify-between">
            <div className="text-3xl">
                {productName}
            </div>

            <button
                onClick={() => setIsPopupOpen(true)}
                className="text-dark-teal underline cursor-pointer hover:text-teal-700 transition-colors duration-200"
                >
                {username}
            </button>

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
                    className="font-fancy text-2xl cursor-pointer px-20 py-1 bg-white border border-black text-black rounded-lg hover:bg-bright-purple transition-colors duration-300"
                    onClick={handleDownload}
                >
                    Download
                </button>
                ) : (
   
                <ContactButton 
                    className="font-fancy text-2xl cursor-pointer px-20 py-1 bg-white border border-black text-black rounded-lg hover:bg-minter transition-colors duration-300"
                    receiver={username} />
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
        {isPopupOpen && (
            <ProfilePopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            username={username}
            />
        )}
    </>
  )
}

export default MarketplaceComp;

