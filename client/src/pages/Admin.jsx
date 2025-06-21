import { useQuery } from "@tanstack/react-query";
import { useDonations } from "@/hooks/useDonations";
import { useToast } from "@/hooks/useToast";
import { formatDate } from "@/utils/dateUtils";

export default function Admin() {
  const { data: donations = [], isLoading: donationsLoading } = useDonations();
  const { showToast } = useToast();

  const { data: statistics, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/statistics"],
  });

  const { data: ngos = [], isLoading: ngosLoading } = useQuery({
    queryKey: ["/api/ngos"],
  });

  const pendingDonations = donations.filter(d => d.status === "pending");
  const recentDonations = donations.slice(0, 5);

  const handleAcceptDonation = async (donationId) => {
    try {
      const response = await fetch(`/api/donations/${donationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: "confirmed" }),
      });

      if (response.ok) {
        showToast("Donation request accepted", "success");
        window.location.reload();
      } else {
        throw new Error("Failed to accept donation");
      }
    } catch (error) {
      showToast("Failed to accept donation", "error");
    }
  };

  const handleDeclineDonation = async (donationId) => {
    try {
      const response = await fetch(`/api/donations/${donationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (response.ok) {
        showToast("Donation request declined", "success");
        window.location.reload();
      } else {
        throw new Error("Failed to decline donation");
      }
    } catch (error) {
      showToast("Failed to decline donation", "error");
    }
  };

  if (statsLoading || donationsLoading || ngosLoading) {
    return (
      <div className="medical-container">
        <div className="medical-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="medical-container">
      <div className="medical-section">
        <div className="medical-section-header">
          <h2 className="medical-section-title">
            <i className="fas fa-cog"></i>
            Admin Dashboard
          </h2>
        </div>

        {/* Admin Statistics */}
        <div className="medical-stats-grid">
          <div className="medical-stat-card">
            <div className="medical-stat-icon total">
              <i className="fas fa-truck"></i>
            </div>
            <div>
              <h3 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
                {statistics?.pendingPickups || 0}
              </h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", margin: 0 }}>
                Pickup Requests
              </p>
            </div>
          </div>

          <div className="medical-stat-card">
            <div className="medical-stat-icon donated">
              <i className="fas fa-building"></i>
            </div>
            <div>
              <h3 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
                {ngos.length}
              </h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", margin: 0 }}>
                Partner NGOs
              </p>
            </div>
          </div>

          <div className="medical-stat-card">
            <div className="medical-stat-icon expiring">
              <i className="fas fa-chart-line"></i>
            </div>
            <div>
              <h3 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
                {donations.length}
              </h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", margin: 0 }}>
                Total Donations
              </p>
            </div>
          </div>

          <div className="medical-stat-card">
            <div className="medical-stat-icon total">
              <i className="fas fa-pills"></i>
            </div>
            <div>
              <h3 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
                {statistics?.totalMedicines || 0}
              </h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", margin: 0 }}>
                Total Medicines
              </p>
            </div>
          </div>
        </div>

        {/* Pending Pickup Requests */}
        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <i className="fas fa-clock"></i>
            Pending Pickup Requests ({pendingDonations.length})
          </h3>
          
          {pendingDonations.length === 0 ? (
            <div className="medical-empty-state">
              <i className="fas fa-truck" style={{ fontSize: "2rem", opacity: "0.3", marginBottom: "1rem" }}></i>
              <h4>No pending pickup requests</h4>
              <p>All donation requests have been processed</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {pendingDonations.map(donation => (
                <div key={donation.id} style={{
                  background: "hsl(210, 20%, 98%)",
                  border: "1px solid hsl(220, 13%, 91%)",
                  borderRadius: "0.5rem",
                  padding: "1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem"
                }}>
                  <div style={{ flex: 1, minWidth: "250px" }}>
                    <h4 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                      {donation.ngoName} Pickup Request
                    </h4>
                    <div style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>
                      <div>
                        <i className="fas fa-calendar"></i> Requested: {formatDate(donation.createdAt)}
                      </div>
                      <div>
                        <i className="fas fa-clock"></i> Pickup: {formatDate(donation.pickupDate)} at {donation.pickupTime}
                      </div>
                      <div>
                        <i className="fas fa-map-marker-alt"></i> {donation.address}
                      </div>
                      <div>
                        <i className="fas fa-phone"></i> {donation.contactNumber}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button 
                      className="medical-btn medical-btn-success medical-btn-sm"
                      onClick={() => handleAcceptDonation(donation.id)}
                    >
                      <i className="fas fa-check"></i> Accept
                    </button>
                    <button 
                      className="medical-btn medical-btn-danger medical-btn-sm"
                      onClick={() => handleDeclineDonation(donation.id)}
                    >
                      <i className="fas fa-times"></i> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Partner NGOs */}
        <div>
          <h3 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <i className="fas fa-building"></i>
            Partner NGOs ({ngos.length})
          </h3>
          
          <div style={{ display: "grid", gap: "1rem" }}>
            {ngos.map(ngo => (
              <div key={ngo.id} style={{
                background: "hsl(210, 20%, 98%)",
                border: "1px solid hsl(220, 13%, 91%)",
                borderRadius: "0.5rem",
                padding: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem"
              }}>
                <div style={{ flex: 1, minWidth: "250px" }}>
                  <h4 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                    {ngo.name}
                  </h4>
                  <div style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>
                    <div>
                      <i className="fas fa-envelope"></i> {ngo.contactEmail}
                    </div>
                    <div>
                      <i className="fas fa-phone"></i> {ngo.contactPhone}
                    </div>
                    <div>
                      <i className="fas fa-map-marker-alt"></i> {ngo.address}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {ngo.active ? (
                    <span style={{ 
                      color: "var(--medical-success)", 
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}>
                      <i className="fas fa-check-circle"></i> Active
                    </span>
                  ) : (
                    <span style={{ 
                      color: "var(--medical-danger)", 
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}>
                      <i className="fas fa-times-circle"></i> Inactive
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
