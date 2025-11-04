export interface Donor {
  id?: string;
  name: string;
  bloodGroup: string; // e.g. 'A+'
  contactPhone: string;
  contactEmail?: string;
  locationCity?: string;
  locationAddress?: string;
  latitude?: number | null;
  longitude?: number | null;
  availability?: 'available' | 'unavailable' | 'emergency_only';
  lastDonation?: string | null; // ISO date
  notes?: string;
  createdAt?: string;
}
