import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Droplet, Heart, Users, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
// Frontend should call the API server for DB operations instead of importing Node MongoDB driver.
// The server will run at http://localhost:4000 by default (see /server).

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  // Example function to handle donor update
  const handleUpdateDonor = async (donorId, updatedData) => {
    try {
        const res = await fetch(`http://localhost:4000/api/donors/${donorId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });
        const result = await res.json();
        console.log('Donor updated (api):', result);
    } catch (error) {
        console.error('Error updating donor:', error);
    }
  };

  // Small helper to create a demo donor (used for quick testing from the UI)
  const handleCreateDemoDonor = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'UI Test Donor', bloodGroup: 'O+', createdAt: new Date() }),
      });
      const body = await res.json();
      console.log('Created donor id:', body.insertedId);
    } catch (err) {
      console.error('Create donor failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Droplet className="h-16 w-16 text-primary" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Blood Bank Management System
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect donors with those in need. Manage blood donations efficiently and save lives with our comprehensive management platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all"
              onClick={() => navigate("/auth")}
            >
              Get Started
              <Droplet className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
          <div className="bg-card p-6 rounded-2xl shadow-lg border border-primary/10 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Donor Management</h3>
            <p className="text-muted-foreground">
              Easily add, update, and manage blood donor information with complete CRUD operations.
            </p>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-lg border border-primary/10 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-accent/10 rounded-lg w-fit mb-4">
              <Activity className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Filtering</h3>
            <p className="text-muted-foreground">
              Filter by blood group and sort by location to find the perfect donor match quickly.
            </p>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-lg border border-primary/10 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Save Lives</h3>
            <p className="text-muted-foreground">
              Connect those in need with available donors and make a real difference in your community.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center max-w-3xl mx-auto bg-card p-8 rounded-2xl shadow-xl border border-primary/10">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-muted-foreground mb-6">
            Join our platform today and help connect blood donors with those who need them most.
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6"
            onClick={() => navigate("/auth")}
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
