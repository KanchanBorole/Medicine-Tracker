import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import { apiRequest } from "@/lib/queryClient";

export default function DonationModal({ onClose }) {
  const [formData, setFormData] = useState({
    ngoName: "",
    pickupDate: "",
    pickupTime: "",
    address: "",
    contactNumber: "",
    specialInstructions: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const { data: ngos = [] } = useQuery({
    queryKey: ["/api/ngos"],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const donationData = {
        ...formData,
        pickupDate: new Date(formData.pickupDate).toISOString(),
        medicineIds: [], // TODO: Allow selection of specific medicines
      };

      await apiRequest("POST", "/api/donations", donationData);
      showToast("Donation pickup scheduled successfully!", "success");
      onClose();
      window.location.reload();
    } catch (error) {
      showToast("Failed to schedule donation pickup", "error");
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
          <h3 className="medical-modal-title">Schedule Donation Pickup</h3>
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
            <label className="medical-form-label">Select NGO *</label>
            <select 
              name="ngoName"
              className="medical-form-input" 
              value={formData.ngoName}
              onChange={handleChange}
              required
            >
              <option value="">Choose NGO</option>
              {ngos.map(ngo => (
                <option key={ngo.id} value={ngo.name}>
                  {ngo.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="medical-form-row">
            <div className="medical-form-group">
              <label className="medical-form-label">Pickup Date *</label>
              <input 
                type="date" 
                name="pickupDate"
                className="medical-form-input" 
                value={formData.pickupDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required 
              />
            </div>
            <div className="medical-form-group">
              <label className="medical-form-label">Preferred Time *</label>
              <select 
                name="pickupTime"
                className="medical-form-input" 
                value={formData.pickupTime}
                onChange={handleChange}
                required
              >
                <option value="">Select time</option>
                <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                <option value="Evening (4 PM - 7 PM)">Evening (4 PM - 7 PM)</option>
              </select>
            </div>
          </div>
          
          <div className="medical-form-group">
            <label className="medical-form-label">Address *</label>
            <textarea 
              name="address"
              className="medical-form-input" 
              rows="3" 
              placeholder="Enter your complete address" 
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="medical-form-group">
            <label className="medical-form-label">Contact Number *</label>
            <input 
              type="tel" 
              name="contactNumber"
              className="medical-form-input" 
              placeholder="Enter your phone number" 
              value={formData.contactNumber}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="medical-form-group">
            <label className="medical-form-label">Special Instructions</label>
            <textarea 
              name="specialInstructions"
              className="medical-form-input" 
              rows="2" 
              placeholder="Any special instructions for pickup"
              value={formData.specialInstructions}
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
              className="medical-btn medical-btn-success"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Scheduling...
                </>
              ) : (
                <>
                  <i className="fas fa-calendar-plus"></i> Schedule Pickup
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
