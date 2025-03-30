import React, { useContext, useEffect } from "react";
import Header from "../components/Header/Header";
import ProfileComp from "../components/Dashboard/ProfileComp";
import SettingComp from "../components/Dashboard/SettingComp";
import DiscourseComp from "../components/Dashboard/DiscourseComp";
import MarketplaceComp from "../components/Dashboard/MarketplaceComp";
import { AuthContext } from "../context/AuthContext";

const DashboardPage: React.FC = () => {
  const { isLoading, isAuthenticated } = useContext(AuthContext)!; 
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/signup";
    }
  }, [isAuthenticated, isLoading]);

  return (
    <div className="min-w-[1145px]">
      <Header />
      <main className=" bg-offwhite grid grid-cols-2 py-8 px-12 gap-4">
        <ProfileComp />
        <SettingComp />
        <DiscourseComp />
        <MarketplaceComp />
      </main>

    </div>
  );
};

export default DashboardPage;
