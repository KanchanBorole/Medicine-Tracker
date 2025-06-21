import { useState } from "react";
import { useMedicines } from "@/hooks/useMedicines";
import { useToast } from "@/hooks/useToast";
import MedicineCard from "@/components/MedicineCard";
import AddMedicineModal from "@/components/AddMedicineModal";

export default function Inventory() {
  const [filter, setFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const { data: medicines = [], isLoading } = useMedicines();
  const { showToast } = useToast();

  const filteredMedicines = medicines.filter(medicine => {
    if (filter === "all") return true;
    return medicine.status === filter;
  });

  const handleEdit = (medicine) => {
    // TODO: Implement edit functionality
    showToast("Edit functionality coming soon", "info");
  };

  const handleDonate = (medicineId) => {
    // TODO: Implement donation functionality
    showToast("Donation functionality coming soon", "info");
  };

  const handleDelete = async (medicineId) => {
    if (confirm("Are you sure you want to delete this medicine?")) {
      try {
        const response = await fetch(`/api/medicines/${medicineId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (response.ok) {
          showToast("Medicine deleted successfully", "success");
          window.location.reload();
        } else {
          throw new Error("Failed to delete medicine");
        }
      } catch (error) {
        showToast("Failed to delete medicine", "error");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="medical-container">
        <div className="medical-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading inventory...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="medical-container">
      <div className="medical-section">
        <div className="medical-section-header">
          <h2 className="medical-section-title">
            <i className="fas fa-boxes"></i>
            Medicine Inventory
          </h2>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <select 
              className="medical-form-input" 
              style={{ width: "auto" }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Medicines</option>
              <option value="good">Good</option>
              <option value="warning">Expiring Soon</option>
              <option value="expired">Expired</option>
            </select>
            <button 
              className="medical-btn medical-btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <i className="fas fa-plus"></i>
              Add Medicine
            </button>
          </div>
        </div>

        {filteredMedicines.length === 0 ? (
          <div className="medical-empty-state">
            <i className="fas fa-pills" style={{ fontSize: "3rem", opacity: "0.3", marginBottom: "1rem" }}></i>
            <h3>No medicines found</h3>
            <p>
              {filter === "all" 
                ? "Start by adding your first medicine"
                : `No medicines with status: ${filter}`
              }
            </p>
            <button 
              className="medical-btn medical-btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <i className="fas fa-plus"></i>
              Add Medicine
            </button>
          </div>
        ) : (
          <div className="medical-medicine-grid">
            {filteredMedicines.map(medicine => (
              <MedicineCard
                key={medicine.id}
                medicine={medicine}
                onEdit={handleEdit}
                onDonate={handleDonate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Medicine Modal */}
      {showAddModal && (
        <AddMedicineModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
