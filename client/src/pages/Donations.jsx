import { useState } from "react";
import { useDonations } from "@/hooks/useDonations";
import { useToast } from "@/hooks/useToast";
import DonationModal from "@/components/DonationModal";
import { formatDate } from "@/utils/dateUtils";

export default function Donations() {
  const [showDonationModal, setShowDonationModal] = useState(false);
  const { data: donations = [], isLoading } = useDonations();
  const { showToast } = useToast();

  const handleStatusUpdate = async (donationId, newStatus) => {
    try {
      const response = await fetch(`/api/donations/${donationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        showToast(`Donation ${newStatus} successfully`, "success");
        window.location.reload();
      } else {
        throw new Error("Failed to update donation status");
      }
    } catch (error) {
      showToast("Failed to update donation status", "error");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "var(--medical-warning)";
      case "confirmed": return "var(--medical-primary)";
      case "completed": return "var(--medical-success)";
      case "cancelled": return "var(--medical-danger)";
      default: return "var(--muted-foreground)";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return "fas fa-clock";
      case "confirmed": return "fas fa-check";
      case "completed": return "fas fa-check-circle";
      case "cancelled": return "fas fa-times";
      default: return "fas fa-question";
    }
  };

  if (isLoading) {
    return (
      <div className="medical-container">
        <div className="medical-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading donations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="medical-container">
      <div className="medical-section">
        <div className="medical-section-header">
          <h2 className="medical-section-title">
            <i className="fas fa-heart"></i>
            Donation Management
          </h2>
          <button 
            className="medical-btn medical-btn-success"
            onClick={() => setShowDonationModal(true)}
          >
            <i className="fas fa-calendar-plus"></i>
            Schedule Pickup
          </button>
        </div>

        {donations.length === 0 ? (
          <div className="medical-empty-state">
            <i className="fas fa-heart" style={{ fontSize: "3rem", opacity: "0.3", marginBottom: "1rem" }}></i>
            <h3>No donation requests yet</h3>
            <p>Schedule your first donation pickup to help those in need</p>
            <button 
              className="medical-btn medical-btn-success"
              onClick={() => setShowDonationModal(true)}
            >
              <i className="fas fa-calendar-plus"></i>
              Schedule Pickup
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {donations.map(donation => (
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
                  <h4 style={{ fontWeight: "600", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <i className={getStatusIcon(donation.status)} style={{ color: getStatusColor(donation.status) }}></i>
                    {donation.ngoName}
                  </h4>
                  <div style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>
                    <div>
                      <i className="fas fa-calendar"></i> Pickup: {formatDate(donation.pickupDate)} at {donation.pickupTime}
                    </div>
                    <div>
                      <i className="fas fa-map-marker-alt"></i> {donation.address}
                    </div>
                    <div>
                      <i className="fas fa-phone"></i> {donation.contactNumber}
                    </div>
                    {donation.specialInstructions && (
                      <div>
                        <i className="fas fa-info-circle"></i> {donation.specialInstructions}
                      </div>
                    )}
                  </div>
                </div>
                
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {donation.status === "pending" && (
                    <>
                      <button 
                        className="medical-btn medical-btn-primary medical-btn-sm"
                        onClick={() => handleStatusUpdate(donation.id, "confirmed")}
                      >
                        <i className="fas fa-check"></i> Confirm
                      </button>
                      <button 
                        className="medical-btn medical-btn-danger medical-btn-sm"
                        onClick={() => handleStatusUpdate(donation.id, "cancelled")}
                      >
                        <i className="fas fa-times"></i> Cancel
                      </button>
                    </>
                  )}
                  {donation.status === "confirmed" && (
                    <button 
                      className="medical-btn medical-btn-success medical-btn-sm"
                      onClick={() => handleStatusUpdate(donation.id, "completed")}
                    >
                      <i className="fas fa-check-circle"></i> Mark Complete
                    </button>
                  )}
                  {donation.status === "completed" && (
                    <span style={{ 
                      color: "var(--medical-success)", 
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}>
                      <i className="fas fa-check-circle"></i> Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Donation Modal */}
      {showDonationModal && (
        <DonationModal onClose={() => setShowDonationModal(false)} />
      )}
    </div>
  );
}
