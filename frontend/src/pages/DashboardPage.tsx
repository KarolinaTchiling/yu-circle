// import React from "react";
// import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import ProfileComp from "../components/Dashboard/ProfileComp";
import SettingComp from "../components/Dashboard/SettingComp";
import DiscourseComp from "../components/Dashboard/DiscourseComp";
import MarketplaceComp from "../components/Dashboard/MarketplaceComp";

// const mockUser = {
//   username: "karo"
// };

const DashboardPage: React.FC = () => {
  // const [tags, setTags] = useState<string[]>([]);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchProfileTags = async () => {
  //     try {
  //       const response = await fetch("http://localhost:8082/community/get-profile-tags", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ username: mockUser.username }),
  //       });

  //       if (!response.ok) throw new Error("Failed to fetch profile tags.");
  //       const data = await response.json();
  //       console.log("Tags fetched:", data);
  //       setTags(data.tags || []);
  //     } catch (err) {
  //       setError("Failed to load profile tags");
  //       console.error("Error fetching profile tags:", err);
  //     }
  //   };

  //   fetchProfileTags();
  // }, []);



  return (
    <>
    <Header />
    <main className=" bg-offwhite grid grid-cols-2 py-8 px-12 gap-4">
      <ProfileComp />
      <SettingComp />
      <DiscourseComp />
      <MarketplaceComp />
    </main>
    </>
  );
};

export default DashboardPage;
