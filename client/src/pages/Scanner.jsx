import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/useToast";
import { initializeScanner, stopScanner } from "@/utils/barcodeScanner";
import AddMedicineModal from "@/components/AddMedicineModal";

export default function Scanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const videoRef = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    return () => {
      if (isScanning) {
        stopScanner();
      }
    };
  }, [isScanning]);

  const handleStartScanner = async () => {
    try {
      setIsScanning(true);
      const result = await initializeScanner(videoRef.current, (data) => {
        setScannedData(data);
        setIsScanning(false);
        showToast(`Barcode scanned: ${data}`, "success");
        // Auto-open add medicine modal with scanned data
        setShowAddModal(true);
      });
      
      if (!result) {
        setIsScanning(false);
        showToast("Failed to initialize camera", "error");
      }
    } catch (error) {
      setIsScanning(false);
      showToast("Camera access denied or not available", "error");
    }
  };

  const handleStopScanner = () => {
    stopScanner();
    setIsScanning(false);
  };

  return (
    <div className="medical-container">
      <div className="medical-section">
        <div className="medical-section-header">
          <h2 className="medical-section-title">
            <i className="fas fa-qrcode"></i>
            Barcode Scanner
          </h2>
        </div>
        
        <div className="medical-scanner-interface">
          <div className="medical-scanner-preview">
            {isScanning ? (
              <video 
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "0.5rem"
                }}
              />
            ) : (
              <div className="medical-scanner-overlay">
                <i className="fas fa-qrcode" style={{ fontSize: "3rem", opacity: "0.7" }}></i>
                <p>Position barcode within the frame</p>
                <small>Camera will automatically detect and scan</small>
              </div>
            )}
          </div>
          
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {!isScanning ? (
              <button 
                className="medical-btn medical-btn-primary"
                onClick={handleStartScanner}
              >
                <i className="fas fa-camera"></i>
                Start Scanner
              </button>
            ) : (
              <button 
                className="medical-btn medical-btn-danger"
                onClick={handleStopScanner}
              >
                <i className="fas fa-stop"></i>
                Stop Scanner
              </button>
            )}
            
            <button 
              className="medical-btn medical-btn-success"
              onClick={() => setShowAddModal(true)}
            >
              <i className="fas fa-keyboard"></i>
              Manual Entry
            </button>
          </div>

          {scannedData && (
            <div style={{
              background: "hsl(142, 76%, 85%)",
              border: "1px solid hsl(142, 76%, 70%)",
              borderRadius: "0.5rem",
              padding: "1rem",
              marginTop: "1rem"
            }}>
              <h4 style={{ margin: "0 0 0.5rem 0", color: "hsl(142, 76%, 20%)" }}>
                Scanned Barcode:
              </h4>
              <p style={{ margin: 0, fontFamily: "monospace", fontSize: "1.1rem" }}>
                {scannedData}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Medicine Modal */}
      {showAddModal && (
        <AddMedicineModal 
          onClose={() => setShowAddModal(false)}
          initialBarcode={scannedData}
        />
      )}
    </div>
  );
}
