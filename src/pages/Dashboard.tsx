import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DonorCard } from "@/components/DonorCard";
import { DonorForm } from "@/components/DonorForm";
import { FilterBar } from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, LogOut, Droplet } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Dashboard() {
  const [donors, setDonors] = useState<any[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const res = await fetch('/api/donors');
      if (!res.ok) throw new Error('Failed to fetch donors');
      const data = await res.json();
      // `data` is expected to be an array of donors with `id` property
      setDonors(data || []);
      setFilteredDonors(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    // If you use Supabase for auth, sign out here. Otherwise simply navigate.
    try {
      // try to sign out if supabase is available
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { supabase } = require('@/integrations/supabase/client');
      if (supabase && supabase.auth) await supabase.auth.signOut();
    } catch (e) {
      // ignore if not available in this runtime
    }
    navigate("/auth");
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/donors/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete donor');
      const body = await res.json();
      if (body.deletedCount === 0) throw new Error('No donor deleted');

      toast({ title: 'Success', description: 'Donor deleted successfully' });
      fetchDonors();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (donor: any) => {
    setEditingDonor(donor);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingDonor(null);
    fetchDonors();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Droplet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Blood Bank Manager</h1>
              <p className="text-sm text-muted-foreground">Manage donors and save lives</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Dialog open={isFormOpen} onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) setEditingDonor(null);
          }}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-lg">
                <Plus className="h-5 w-5 mr-2" />
                Add New Donor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingDonor ? "Edit Donor" : "Add New Donor"}
                </DialogTitle>
              </DialogHeader>
              <DonorForm
                donor={editingDonor}
                onSuccess={handleFormSuccess}
              />
            </DialogContent>
          </Dialog>

          <FilterBar
            donors={donors}
            onFilter={setFilteredDonors}
          />
        </div>

        {/* Donors Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-muted-foreground">Loading donors...</div>
          </div>
        ) : filteredDonors.length === 0 ? (
          <div className="text-center py-12">
            <Droplet className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No donors found</h3>
            <p className="text-muted-foreground mb-4">
              {donors.length === 0
                ? "Start by adding your first donor"
                : "Try adjusting your filters"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonors.map((donor) => (
              <DonorCard
                key={donor.id}
                donor={donor}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
