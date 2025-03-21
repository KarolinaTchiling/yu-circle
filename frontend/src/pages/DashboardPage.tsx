import React from "react";
import Header from "../components/Header/Header";
import ProfileComp from "../components/Dashboard/ProfileComp";
import SettingComp from "../components/Dashboard/SettingComp";
import DiscourseComp from "../components/Dashboard/DiscourseComp";
import MarketplaceComp from "../components/Dashboard/MarketplaceComp";


const DashboardPage: React.FC = () => {
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
