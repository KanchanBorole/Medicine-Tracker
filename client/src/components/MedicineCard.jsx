import { formatDate, getDaysUntilExpiry } from "@/utils/dateUtils";

export default function MedicineCard({ medicine, onEdit, onDonate, onDelete }) {
  const daysUntilExpiry = getDaysUntilExpiry(medicine.expiryDate);
  
  let statusText, statusClass;
  if (daysUntilExpiry < 0) {
    statusText = 'Expired';
    statusClass = 'expired';
  } else if (daysUntilExpiry <= 7) {
    statusText = `${daysUntilExpiry} days left`;
    statusClass = 'warning';
  } else {
    statusText = `${daysUntilExpiry} days left`;
    statusClass = 'good';
  }

  return (
    <div className={`medical-medicine-card status-${medicine.status}`}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "flex-start", 
        marginBottom: "1rem" 
      }}>
        <div>
          <div style={{ 
            fontSize: "1.125rem", 
            fontWeight: "600", 
            color: "var(--foreground)", 
            marginBottom: "0.25rem" 
          }}>
            {medicine.name}
          </div>
          <div style={{ 
            fontSize: "0.875rem", 
            color: "var(--muted-foreground)" 
          }}>
            {medicine.type}
          </div>
        </div>
        <div className={`medical-expiry-badge ${statusClass}`}>
          {statusText}
        </div>
      </div>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: "1rem", 
        marginBottom: "1rem" 
      }}>
        <div>
          <div style={{ 
            fontSize: "0.75rem", 
            color: "var(--muted-foreground)", 
            textTransform: "uppercase", 
            fontWeight: "500" 
          }}>
            Quantity
          </div>
          <div style={{ fontWeight: "500", color: "var(--foreground)" }}>
            {medicine.quantity}
          </div>
        </div>
        <div>
          <div style={{ 
            fontSize: "0.75rem", 
            color: "var(--muted-foreground)", 
            textTransform: "uppercase", 
            fontWeight: "500" 
          }}>
            Expiry Date
          </div>
          <div style={{ fontWeight: "500", color: "var(--foreground)" }}>
            {formatDate(medicine.expiryDate)}
          </div>
        </div>
        <div>
          <div style={{ 
            fontSize: "0.75rem", 
            color: "var(--muted-foreground)", 
            textTransform: "uppercase", 
            fontWeight: "500" 
          }}>
            Batch Number
          </div>
          <div style={{ fontWeight: "500", color: "var(--foreground)" }}>
            {medicine.batchNumber || "N/A"}
          </div>
        </div>
        <div>
          <div style={{ 
            fontSize: "0.75rem", 
            color: "var(--muted-foreground)", 
            textTransform: "uppercase", 
            fontWeight: "500" 
          }}>
            Barcode
          </div>
          <div style={{ fontWeight: "500", color: "var(--foreground)", fontFamily: "monospace" }}>
            {medicine.barcode || "N/A"}
          </div>
        </div>
      </div>

      {medicine.notes && (
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ 
            fontSize: "0.75rem", 
            color: "var(--muted-foreground)", 
            textTransform: "uppercase", 
            fontWeight: "500" 
          }}>
            Notes
          </div>
          <div style={{ fontWeight: "500", color: "var(--foreground)" }}>
            {medicine.notes}
          </div>
        </div>
      )}
      
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button 
          className="medical-btn medical-btn-primary medical-btn-sm"
          onClick={() => onEdit(medicine)}
        >
          <i className="fas fa-edit"></i> Edit
        </button>
        <button 
          className="medical-btn medical-btn-success medical-btn-sm"
          onClick={() => onDonate(medicine.id)}
        >
          <i className="fas fa-heart"></i> Donate
        </button>
        <button 
          className="medical-btn medical-btn-danger medical-btn-sm"
          onClick={() => onDelete(medicine.id)}
        >
          <i className="fas fa-trash"></i> Delete
        </button>
      </div>
    </div>
  );
}
