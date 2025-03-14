import { useState } from "react";
import Header from "../components/Header/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import CommunityComp from "../components/Dashboard/CommunityComp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../components/ui/select";
import { CheckCircle, UserCircle } from "lucide-react";

const users = [
  {
    name: "Samantha Doe",
    role: "Mentor",
    year: "4th Year",
    rating: 4.8,
    tags: ["CompSci", "Career Focus"],
  },
  {
    name: "James Smith",
    role: "Mentee",
    year: "2nd Year",
    rating: 4.5,
    tags: ["Engineering", "Skill Development"],
  },
  {
    name: "Alex Johnson",
    role: "Study Partners",
    year: "3rd Year",
    rating: 4.7,
    tags: ["Business", "Exam Prep"],
  },
];

export default function CommunityPage() {
  const [filter, setFilter] = useState("Mentor");

  return (
    <div>
      <Header />
      <div className="p-4">
        <Select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <SelectTrigger className="border rounded px-2 py-1">
            {filter || "Select a role"}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mentor">Mentor</SelectItem>
            <SelectItem value="Mentee">Mentee</SelectItem>
            <SelectItem value="Study Partners">Study Partners</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {users
          .filter((user) => user.role === filter)
          .map((user, index) => (
            <Card key={index} className="p-6 shadow-md rounded-lg">
              <CardContent className="text-center">
                <UserCircle size={64} className="text-gray-400 mx-auto mb-3" />
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <div className="flex justify-center gap-2 my-2">
                  <span className="bg-gray-200 px-2 py-1 rounded text-sm">
                    {user.role}
                  </span>
                  <span className="bg-gray-200 px-2 py-1 rounded text-sm">
                    {user.year}
                  </span>
                  <span className="bg-yellow-400 px-2 py-1 rounded text-sm flex items-center gap-1">
                    {user.rating}
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {user.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Button className="w-full flex items-center gap-2">
                  <CheckCircle size={16} /> Connect
                </Button>
              </CardContent>
            </Card>
          ))}
      </div>

      <CommunityComp filter={filter} />
    </div>
  );
}
