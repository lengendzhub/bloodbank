import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Phone, Mail, MapPin, Calendar } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DonorCardProps {
  donor: any;
  onEdit: (donor: any) => void;
  onDelete: (id: string) => void;
}

const bloodGroupColors: Record<string, string> = {
  "A+": "bg-red-500",
  "A-": "bg-red-600",
  "B+": "bg-blue-500",
  "B-": "bg-blue-600",
  "AB+": "bg-purple-500",
  "AB-": "bg-purple-600",
  "O+": "bg-orange-500",
  "O-": "bg-orange-600",
};

const availabilityColors: Record<string, string> = {
  available: "bg-green-500",
  unavailable: "bg-gray-500",
  emergency_only: "bg-yellow-500",
};

export function DonorCard({ donor, onEdit, onDelete }: DonorCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">{donor.name}</CardTitle>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(donor)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    donor's information from the database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(donor.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={`${bloodGroupColors[donor.bloodGroup]} text-white font-bold`}>
            {donor.bloodGroup}
          </Badge>
          <Badge className={`${availabilityColors[donor.availability || 'unavailable']} text-white`} variant="outline">
            {donor.availability === 'available' ? 'Available' : 'Not Available'}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{donor.contactPhone}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{donor.locationCity || donor.locationAddress}</span>
          </div>
          {donor.lastDonation && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Last donation: {new Date(donor.lastDonation).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
