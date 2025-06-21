import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

export default function UserPanel() {
  const { user } = useAuth();

  const { data: statistics, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/statistics'],
  });

  const { data: medicines, isLoading: medicinesLoading } = useQuery({
    queryKey: ['/api/medicines'],
  });

  const { data: donations, isLoading: donationsLoading } = useQuery({
    queryKey: ['/api/donations'],
  });

  const recentMedicines = medicines?.slice(0, 5) || [];
  const recentDonations = donations?.slice(0, 3) || [];

  return (
    <div className="medical-container">
      <div className="medical-page-header">
        <h1>
          <i className="fas fa-user-circle"></i>
          Welcome, {user?.firstName || user?.username}
        </h1>
        <p>Your personal medicine tracking dashboard</p>
      </div>

      <div className="medical-stats-grid">
        <div className="medical-stat-card">
          <div className="stat-icon">
            <i className="fas fa-pills"></i>
          </div>
          <div className="stat-content">
            <h3>My Medicines</h3>
            <div className="stat-number">
              {statsLoading ? '...' : statistics?.totalMedicines || 0}
            </div>
            <p>Total medicines tracked</p>
          </div>
        </div>

        <div className="medical-stat-card warning">
          <div className="stat-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="stat-content">
            <h3>Expiring Soon</h3>
            <div className="stat-number">
              {statsLoading ? '...' : statistics?.expiringSoon || 0}
            </div>
            <p>Need attention within 7 days</p>
          </div>
        </div>

        <div className="medical-stat-card success">
          <div className="stat-icon">
            <i className="fas fa-heart"></i>
          </div>
          <div className="stat-content">
            <h3>Donations Made</h3>
            <div className="stat-number">
              {donationsLoading ? '...' : donations?.length || 0}
            </div>
            <p>Total donation requests</p>
          </div>
        </div>

        <div className="medical-stat-card danger">
          <div className="stat-icon">
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="stat-content">
            <h3>Expired</h3>
            <div className="stat-number">
              {statsLoading ? '...' : statistics?.expired || 0}
            </div>
            <p>Expired medicines</p>
          </div>
        </div>
      </div>

      <div className="medical-dashboard-grid">
        <div className="medical-dashboard-section">
          <div className="medical-section-header">
            <h2>
              <i className="fas fa-pills"></i>
              Recent Medicines
            </h2>
            <a href="/inventory" className="medical-view-all">
              View All <i className="fas fa-arrow-right"></i>
            </a>
          </div>

          {medicinesLoading ? (
            <div className="medical-loading">
              <i className="fas fa-spinner fa-spin"></i>
              Loading medicines...
            </div>
          ) : recentMedicines.length > 0 ? (
            <div className="medical-medicine-grid">
              {recentMedicines.map((medicine) => (
                <div key={medicine.id} className="medical-medicine-card">
                  <div className="medicine-header">
                    <h3>{medicine.name}</h3>
                    <span className={`medical-expiry-badge ${
                      new Date(medicine.expiryDate) < new Date() ? 'expired' :
                      new Date(medicine.expiryDate) - new Date() < 7 * 24 * 60 * 60 * 1000 ? 'warning' : 'good'
                    }`}>
                      {new Date(medicine.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="medicine-details">
                    <p><strong>Type:</strong> {medicine.type}</p>
                    <p><strong>Quantity:</strong> {medicine.quantity}</p>
                    {medicine.batchNumber && (
                      <p><strong>Batch:</strong> {medicine.batchNumber}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="medical-empty-state">
              <i className="fas fa-pills"></i>
              <h3>No medicines yet</h3>
              <p>Start by scanning or adding your first medicine</p>
              <a href="/scanner" className="medical-button">
                <i className="fas fa-qrcode"></i>
                Scan Medicine
              </a>
            </div>
          )}
        </div>

        <div className="medical-dashboard-section">
          <div className="medical-section-header">
            <h2>
              <i className="fas fa-heart"></i>
              Recent Donations
            </h2>
            <a href="/donations" className="medical-view-all">
              View All <i className="fas fa-arrow-right"></i>
            </a>
          </div>

          {donationsLoading ? (
            <div className="medical-loading">
              <i className="fas fa-spinner fa-spin"></i>
              Loading donations...
            </div>
          ) : recentDonations.length > 0 ? (
            <div className="medical-donations-list">
              {recentDonations.map((donation) => (
                <div key={donation.id} className="medical-donation-card">
                  <div className="donation-header">
                    <h4>{donation.ngoName}</h4>
                    <span className={`medical-status-badge ${donation.status}`}>
                      {donation.status}
                    </span>
                  </div>
                  <div className="donation-details">
                    <p><i className="fas fa-calendar"></i> {new Date(donation.pickupDate).toLocaleDateString()}</p>
                    <p><i className="fas fa-clock"></i> {donation.pickupTime}</p>
                    <p><i className="fas fa-map-marker-alt"></i> {donation.address}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="medical-empty-state">
              <i className="fas fa-heart"></i>
              <h3>No donations yet</h3>
              <p>Help others by donating unused medicines</p>
              <a href="/donations" className="medical-button">
                <i className="fas fa-plus"></i>
                Schedule Donation
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="medical-quick-actions">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <a href="/scanner" className="quick-action-card">
            <i className="fas fa-qrcode"></i>
            <h3>Scan Medicine</h3>
            <p>Add medicines by scanning barcodes</p>
          </a>
          <a href="/inventory" className="quick-action-card">
            <i className="fas fa-plus"></i>
            <h3>Add Medicine</h3>
            <p>Manually add medicine to inventory</p>
          </a>
          <a href="/donations" className="quick-action-card">
            <i className="fas fa-heart"></i>
            <h3>Donate</h3>
            <p>Schedule medicine pickup for donation</p>
          </a>
        </div>
      </div>
    </div>
  );
}