import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";

interface FilterBarProps {
  donors: any[];
  onFilter: (filtered: any[]) => void;
}

const bloodGroups = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const FilterBar = ({ donors, onFilter }: FilterBarProps) => {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("All");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    let filtered = [...donors];

    // Filter by blood group
    if (selectedBloodGroup !== "All") {
      filtered = filtered.filter((donor) => donor.blood_group === selectedBloodGroup);
    }

    // Sort
    switch (sortBy) {
      case "recent":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "city":
        filtered.sort((a, b) => a.location_city.localeCompare(b.location_city));
        break;
    }

    onFilter(filtered);
  }, [selectedBloodGroup, sortBy, donors, onFilter]);

  return (
    <div className="flex flex-wrap gap-4 items-end flex-1">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filter & Sort</span>
      </div>

      <div className="space-y-2 flex-1 min-w-[200px]">
        <Label htmlFor="blood-group">Blood Group</Label>
        <Select value={selectedBloodGroup} onValueChange={setSelectedBloodGroup}>
          <SelectTrigger id="blood-group">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {bloodGroups.map((group) => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 flex-1 min-w-[200px]">
        <Label htmlFor="sort-by">Sort By</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger id="sort-by">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="city">City (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
