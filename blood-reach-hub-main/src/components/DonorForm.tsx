import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Donor } from "@/models/Donor";

interface DonorFormProps {
  donor?: Donor | null;
  onSuccess: () => void;
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const availabilityStatuses = [
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
  { value: "emergency_only", label: "Emergency Only" },
];

export const DonorForm = ({ donor, onSuccess }: DonorFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Donor>>({
    name: "",
    bloodGroup: "",
    contactPhone: "",
    contactEmail: "",
    locationCity: "",
    locationAddress: "",
    latitude: undefined,
    longitude: undefined,
    availability: "available",
    lastDonation: undefined,
    notes: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (donor) {
      setFormData({
        name: donor.name || "",
        bloodGroup: donor.bloodGroup || "",
        contactPhone: donor.contactPhone || "",
        contactEmail: donor.contactEmail || "",
        locationCity: donor.locationCity || "",
        locationAddress: donor.locationAddress || "",
        latitude: donor.latitude ?? undefined,
        longitude: donor.longitude ?? undefined,
        availability: donor.availability || "available",
        lastDonation: donor.lastDonation || undefined,
        notes: donor.notes || "",
      });
    }
  }, [donor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: any = {
        ...formData,
      };

      // ensure numeric fields are numbers or null
      if (payload.latitude === "" || payload.latitude === undefined) payload.latitude = null;
      if (payload.longitude === "" || payload.longitude === undefined) payload.longitude = null;

      if (donor && donor.id) {
        const res = await fetch(`/api/donors/${donor.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update donor");

        toast({ title: "Success", description: "Donor updated successfully" });
      } else {
        const res = await fetch(`/api/donors`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create donor");

        toast({ title: "Success", description: "Donor added successfully" });
      }

      onSuccess();
    } catch (error: any) {
      toast({ title: "Error", description: String(error.message || error), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bloodGroup">Blood Group *</Label>
          <Select
            value={formData.bloodGroup || ""}
            onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select blood group" />
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

        <div className="space-y-2">
          <Label htmlFor="contactPhone">Phone Number *</Label>
          <Input
            id="contactPhone"
            type="tel"
            value={formData.contactPhone || ""}
            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            required
            placeholder="+1234567890"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email</Label>
          <Input
            id="contactEmail"
            type="email"
            value={formData.contactEmail || ""}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            placeholder="john@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="locationCity">City</Label>
          <Input
            id="locationCity"
            value={formData.locationCity || ""}
            onChange={(e) => setFormData({ ...formData, locationCity: e.target.value })}
            placeholder="New York"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="availability">Availability</Label>
          <Select
            value={formData.availability || "available"}
            onValueChange={(value) => setFormData({ ...formData, availability: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availabilityStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="locationAddress">Address</Label>
          <Input
            id="locationAddress"
            value={formData.locationAddress || ""}
            onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
            placeholder="123 Main St"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude (optional)</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={formData.latitude ?? ""}
            onChange={(e) => setFormData({ ...formData, latitude: e.target.value ? parseFloat(e.target.value) : undefined })}
            placeholder="40.7128"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude (optional)</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={formData.longitude ?? ""}
            onChange={(e) => setFormData({ ...formData, longitude: e.target.value ? parseFloat(e.target.value) : undefined })}
            placeholder="-74.0060"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastDonation">Last Donation Date (optional)</Label>
          <Input
            id="lastDonation"
            type="date"
            value={formData.lastDonation ?? ""}
            onChange={(e) => setFormData({ ...formData, lastDonation: e.target.value || undefined })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            value={formData.notes || ""}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional information about the donor"
            rows={3}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : donor ? "Update Donor" : "Add Donor"}
      </Button>
    </form>
  );
};
