import { useState } from "react";
import Header from "../components/Header/Header";
import CommunityComp from "../components/Dashboard/CommunityComp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CommunityPage() {
  const [filter, setFilter] = useState("Mentor");

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex justify-between items-center mb-6 p-4">
        <h1 className="text-3xl font-bold">Community</h1>
        <Select onValueChange={(value) => setFilter(value)}>
          <SelectTrigger className="w-52 border rounded px-2 py-1">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mentor">Mentor</SelectItem>
            <SelectItem value="Mentee">Mentee</SelectItem>
            <SelectItem value="Study Partners">Study Partners</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pass the filter to CommunityComp */}
      <CommunityComp filter={filter} />
    </div>
  );
}
