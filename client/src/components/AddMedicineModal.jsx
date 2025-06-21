import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import { apiRequest } from "@/lib/queryClient";

export default function AddMedicineModal({ onClose, initialBarcode = "" }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    quantity: "",
    expiryDate: "",
    batchNumber: "",
    barcode: initialBarcode,
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const medicineData = {
        ...formData,
        quantity: parseInt(formData.quantity),
        expiryDate: new Date(formData.expiryDate).toISOString(),
      };

      await apiRequest("POST", "/api/medicines", medicineData);
      showToast("Medicine added successfully!", "success");
      onClose();
      window.location.reload();
    } catch (error) {
      showToast("Failed to add medicine", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="medical-modal" onClick={handleOverlayClick}>
      <div className="medical-modal-content">
        <div className="medical-modal-header">
          <h3 className="medical-modal-title">Add New Medicine</h3>
          <button 
            className="close-btn"
            onClick={onClose}
            style={{ 
              background: "none", 
              border: "none", 
              fontSize: "1.5rem", 
              cursor: "pointer", 
              color: "var(--muted-foreground)" 
            }}
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="medical-form-group">
            <label className="medical-form-label">Medicine Name *</label>
            <input 
              type="text" 
              name="name"
              className="medical-form-input" 
              placeholder="Enter medicine name" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="medical-form-row">
            <div className="medical-form-group">
              <label className="medical-form-label">Category *</label>
              <select 
                name="type"
                className="medical-form-input" 
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option value="tablet">Tablet</option>
                <option value="capsule">Capsule</option>
                <option value="syrup">Syrup</option>
                <option value="injection">Injection</option>
                <option value="cream">Cream/Ointment</option>
                <option value="drops">Drops</option>
                <option value="inhaler">Inhaler</option>
              </select>
            </div>
            <div className="medical-form-group">
              <label className="medical-form-label">Quantity *</label>
              <input 
                type="number" 
                name="quantity"
                className="medical-form-input" 
                placeholder="Enter quantity" 
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                required 
              />
            </div>
          </div>
          
          <div className="medical-form-row">
            <div className="medical-form-group">
              <label className="medical-form-label">Expiry Date *</label>
              <input 
                type="date" 
                name="expiryDate"
                className="medical-form-input" 
                value={formData.expiryDate}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="medical-form-group">
              <label className="medical-form-label">Batch Number</label>
              <input 
                type="text" 
                name="batchNumber"
                className="medical-form-input" 
                placeholder="Enter batch number"
                value={formData.batchNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="medical-form-group">
            <label className="medical-form-label">Barcode</label>
            <input 
              type="text" 
              name="barcode"
              className="medical-form-input" 
              placeholder="Enter or scan barcode"
              value={formData.barcode}
              onChange={handleChange}
            />
          </div>
          
          <div className="medical-form-group">
            <label className="medical-form-label">Notes (Optional)</label>
            <textarea 
              name="notes"
              className="medical-form-input" 
              rows="3" 
              placeholder="Additional notes about the medicine"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
          
          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
            <button 
              type="button" 
              className="medical-btn" 
              onClick={onClose}
              style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="medical-btn medical-btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Adding...
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i> Add Medicine
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
