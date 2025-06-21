import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
import AddMedicineModal from "@/components/AddMedicineModal";
import DonationModal from "@/components/DonationModal";
import { useMedicines } from "@/hooks/useMedicines";
import { useDonations } from "@/hooks/useDonations";
import { useToast } from "@/hooks/useToast";
import { formatDate, getDaysUntilExpiry } from "@/utils/dateUtils";

export default function Dashboard() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const { showToast } = useToast();

  const { data: statistics, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/statistics"],
  });

  const { data: medicines = [], isLoading: medicinesLoading } = useMedicines();
  const { data: donations = [], isLoading: donationsLoading } = useDonations();

  const expiringMedicines = medicines.filter(m => m.status === "warning" || m.status === "expired");

  const handleDonate = (medicineId) => {
    setShowDonationModal(true);
  };

  const handleRemove = async (medicineId) => {
    if (confirm("Are you sure you want to remove this medicine?")) {
      try {
        await fetch(`/api/medicines/${medicineId}`, {
          method: "DELETE",
          credentials: "include",
        });
        showToast("Medicine removed successfully", "success");
        window.location.reload();
      } catch (error) {
        showToast("Failed to remove medicine", "error");
      }
    }
  };

  if (statsLoading) {
    return (
      <div className="medical-container">
        <div className="medical-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="medical-container">
      {/* Statistics Cards */}
      <div className="medical-stats-grid">
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

        <div className="medical-stat-card">
          <div className="medical-stat-icon expiring">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div>
            <h3 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
              {statistics?.expiringSoon || 0}
            </h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", margin: 0 }}>
              Expiring Soon
            </p>
          </div>
        </div>

        <div className="medical-stat-card">
          <div className="medical-stat-icon expired">
            <i className="fas fa-times-circle"></i>
          </div>
          <div>
            <h3 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
              {statistics?.expired || 0}
            </h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", margin: 0 }}>
              Expired
            </p>
          </div>
        </div>

        <div className="medical-stat-card">
          <div className="medical-stat-icon donated">
            <i className="fas fa-heart"></i>
          </div>
          <div>
            <h3 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
              {statistics?.donated || 0}
            </h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", margin: 0 }}>
              Donated
            </p>
          </div>
        </div>
      </div>

      {/* Expiry Alerts */}
      {expiringMedicines.length > 0 && (
        <div style={{
          background: "hsl(45, 93%, 85%)",
          border: "1px solid hsl(45, 93%, 70%)",
          borderRadius: "0.5rem",
          padding: "1rem",
          marginBottom: "1rem"
        }}>
          <div style={{ fontWeight: "600", color: "hsl(45, 93%, 25%)", marginBottom: "0.5rem" }}>
            <i className="fas fa-bell"></i> Expiry Alerts
          </div>
          <div>
            {expiringMedicines.slice(0, 3).map(medicine => (
              <div key={medicine.id} style={{
                padding: "0.5rem 0",
                borderBottom: expiringMedicines.indexOf(medicine) < 2 ? "1px solid hsl(45, 93%, 70%)" : "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span>
                  {medicine.name} {medicine.status === "expired" ? "has expired" : `expires in ${getDaysUntilExpiry(medicine.expiryDate)} days`}
                </span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {medicine.status !== "expired" && (
                    <button 
                      className="medical-btn medical-btn-warning medical-btn-sm"
                      onClick={() => handleDonate(medicine.id)}
                    >
                      Donate
                    </button>
                  )}
                  <button 
                    className="medical-btn medical-btn-danger medical-btn-sm"
                    onClick={() => handleRemove(medicine.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="medical-section">
        <div className="medical-section-header">
          <h2 className="medical-section-title">
            <i className="fas fa-bolt"></i>
            Quick Actions
          </h2>
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/scanner" className="medical-btn medical-btn-primary">
            <i className="fas fa-qrcode"></i>
            Scan New Medicine
          </Link>
          <button 
            className="medical-btn medical-btn-success"
            onClick={() => setShowAddModal(true)}
          >
            <i className="fas fa-plus"></i>
            Add Manually
          </button>
          <Link href="/donations" className="medical-btn medical-btn-warning">
            <i className="fas fa-heart"></i>
            Schedule Donation
          </Link>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddMedicineModal onClose={() => setShowAddModal(false)} />
      )}
      {showDonationModal && (
        <DonationModal onClose={() => setShowDonationModal(false)} />
      )}
    </div>
  );
}
