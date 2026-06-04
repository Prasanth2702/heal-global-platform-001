// components/FacilityLimitChecker.tsx
import React, { useState, useEffect } from 'react';
import './FacilityLimitChecker.css'; // Import CSS for styling
import { supabase } from "@/integrations/supabase/client";
import { PhoneIcon } from 'lucide-react';

const FacilityLimitChecker = () => {
  const [loading, setLoading] = useState(false);
  const [limits, setLimits] = useState(null);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState('admin'); // 'admin', 'staff', or 'guest'
  const [userId, setUserId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const [checkType, setCheckType] = useState('all');

  // Fetch facility limits based on user type
  const fetchFacilityLimits = async () => {
    setLoading(true);
    setError(null);

    try {
      let requestBody = {};
      
      // Build request based on user type
      if (userType === 'admin') {
        if (!userId) {
          setError('Please enter User ID for admin');
          setLoading(false);
          return;
        }
        requestBody = { facility_admin_id: userId, check_type: checkType };
      } else if (userType === 'staff') {
        if (!userId) {
          setError('Please enter Staff User ID');
          setLoading(false);
          return;
        }
        requestBody = { staff_user_id: userId, check_type: checkType };
      } else if (userType === 'guest') {
        if (!facilityId) {
          setError('Please enter Facility ID');
          setLoading(false);
          return;
        }
        requestBody = { facility_id: facilityId, check_type: checkType };
      }

const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      
      const response = await fetch(
        `https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/check-facility-limit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch limits');
      }
      
      setLimits(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching facility limits:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setLimits(null);
    setError(null);
    setUserId('');
    setStaffId('');
    setFacilityId('');
  };

  return (
    <div className="facility-limit-checker">
      <header className="header">
        <h1>?? Facility Subscription Manager</h1>
        <p>Check your facility's subscription limits and usage</p>
      </header>

      <div className="input-section">
        <div className="user-type-selector">
          <label>Login as:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="admin"
                checked={userType === 'admin'}
                onChange={(e) => {
                  setUserType(e.target.value);
                  resetForm();
                }}
              />
              Facility Admin
            </label>
            <label>
              <input
                type="radio"
                value="staff"
                checked={userType === 'staff'}
                onChange={(e) => {
                  setUserType(e.target.value);
                  resetForm();
                }}
              />
              Staff Member
            </label>
            <label>
              <input
                type="radio"
                value="guest"
                checked={userType === 'guest'}
                onChange={(e) => {
                  setUserType(e.target.value);
                  resetForm();
                }}
              />
              Guest (Direct Facility ID)
            </label>
          </div>
        </div>

        {userType === 'admin' && (
          <div className="input-group">
            <label>Admin User ID (from auth):</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter admin user ID"
              className="input-field"
            />
          </div>
        )}

        {userType === 'staff' && (
          <div className="input-group">
            <label>Staff User ID (from auth):</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter staff user ID"
              className="input-field"
            />
          </div>
        )}

        {userType === 'guest' && (
          <div className="input-group">
            <label>Facility ID:</label>
            <input
              type="text"
              value={facilityId}
              onChange={(e) => setFacilityId(e.target.value)}
              placeholder="Enter facility ID"
              className="input-field"
            />
          </div>
        )}

        <div className="input-group">
          <label>Check Type:</label>
          <select value={checkType} onChange={(e) => setCheckType(e.target.value)} className="select-field">
            <option value="all">All Limits</option>
            <option value="staff">Staff Only</option>
            <option value="departments">Departments Only</option>
            <option value="beds">Beds Only</option>
            <option value="clinical">Clinical Consultations Only</option>
            <option value="tele">Tele-Consultations Only</option>
          </select>
        </div>

        <button 
          onClick={fetchFacilityLimits} 
          disabled={loading}
          className="check-button"
        >
          {loading ? 'Checking...' : 'Check Limits'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {limits && (
        <div className="results-section">
          {/* Status Banner */}
          <div className={`status-banner ${limits.allowed ? 'allowed' : 'denied'}`}>
            <h2>
              {limits.allowed ? '? Within Limits' : '?? Limits Exceeded'}
            </h2>
            <p>{limits.message}</p>
            {limits.warnings && limits.warnings.length > 0 && (
              <div className="warnings">
                {limits.warnings.map((warning, idx) => (
                  <div key={idx} className="warning-item">?? {warning}</div>
                ))}
              </div>
            )}
          </div>

          {/* Facility Info */}
          <div className="facility-info">
            <h3>?? Facility Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Name:</span>
                <span className="value">{limits.facility?.name}</span>
              </div>
              <div className="info-item">
                <span className="label">Status:</span>
                <span className="value">
                  {limits.isExpired ? 'Expired' : limits.hasActiveSubscription ? 'Active' : 'No Subscription'}
                </span>
              </div>
              {limits.requesterType && (
                <div className="info-item">
                  <span className="label">Accessing as:</span>
                  <span className="value">{limits.requesterType}</span>
                </div>
              )}
            </div>
          </div>

          {/* Limits Dashboard */}
          <div className="limits-dashboard">
            <h3>?? Usage Dashboard</h3>
            
            <div className="limits-grid">
              {/* Staff Limit */}
              <div className="limit-card">
                <div className="limit-header">
                  <span className="icon">??</span>
                  <h4>Staff Members</h4>
                </div>
                <div className="limit-stats">
                  <div className="current">{limits.limits?.staff?.current}</div>
                  <div className="separator">/</div>
                  <div className="max">{limits.limits?.staff?.max}</div>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress ${limits.limits?.staff?.exceeded ? 'exceeded' : ''}`}
                    style={{ width: `${Math.min(limits.limits?.staff?.percentageUsed || 0, 100)}%` }}
                  />
                </div>
                <div className="limit-footer">
                  <span>{limits.limits?.staff?.remaining} remaining</span>
                  {limits.limits?.staff?.exceeded && <span className="badge exceeded">Exceeded</span>}
                </div>
              </div>

              {/* Departments Limit */}
              <div className="limit-card">
                <div className="limit-header">
                  <span className="icon">???</span>
                  <h4>Departments</h4>
                </div>
                <div className="limit-stats">
                  <div className="current">{limits.limits?.departments?.current}</div>
                  <div className="separator">/</div>
                  <div className="max">{limits.limits?.departments?.max}</div>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress ${limits.limits?.departments?.exceeded ? 'exceeded' : ''}`}
                    style={{ width: `${Math.min(limits.limits?.departments?.percentageUsed || 0, 100)}%` }}
                  />
                </div>
                <div className="limit-footer">
                  <span>{limits.limits?.departments?.remaining} remaining</span>
                </div>
              </div>

              {/* Beds Limit */}
              <div className="limit-card">
                <div className="limit-header">
                  <span className="icon">???</span>
                  <h4>Beds</h4>
                </div>
                <div className="limit-stats">
                  <div className="current">{limits.limits?.beds?.current}</div>
                  <div className="separator">/</div>
                  <div className="max">{limits.limits?.beds?.max}</div>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress ${limits.limits?.beds?.exceeded ? 'exceeded' : ''}`}
                    style={{ width: `${Math.min(limits.limits?.beds?.percentageUsed || 0, 100)}%` }}
                  />
                </div>
                <div className="limit-footer">
                  <span>{limits.limits?.beds?.remaining} remaining</span>
                </div>
              </div>

              {/* Clinical Consultations */}
              <div className="limit-card">
                <div className="limit-header">
                  <span className="icon">??</span>
                  <h4>Clinical Consultations</h4>
                </div>
                <div className="limit-stats">
                  <div className="current">{limits.limits?.clinical?.used}</div>
                  <div className="separator">/</div>
                  <div className="max">{limits.limits?.clinical?.max}</div>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress ${limits.limits?.clinical?.exceeded ? 'exceeded' : ''}`}
                    style={{ width: `${Math.min(limits.limits?.clinical?.percentageUsed || 0, 100)}%` }}
                  />
                </div>
                <div className="limit-footer">
                  <span>{limits.limits?.clinical?.remaining} remaining this month</span>
                </div>
              </div>

              {/* Tele Consultations */}
              <div className="limit-card">
                <div className="limit-header">
                  <span className="icon">??</span>
                  <h4>Tele-Consultations</h4>
                </div>
                <div className="limit-stats">
                  <div className="current">{limits.limits?.tele?.used}</div>
                  <div className="separator">/</div>
                  <div className="max">{limits.limits?.tele?.max}</div>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress ${limits.limits?.tele?.exceeded ? 'exceeded' : ''}`}
                    style={{ width: `${Math.min(limits.limits?.tele?.percentageUsed || 0, 100)}%` }}
                  />
                </div>
                <div className="limit-footer">
                  <span>{limits.limits?.tele?.remaining} remaining this month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="subscription-details">
            <h3> Subscription Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="label">Plan:</span>
                <span className="value">{limits.subscriptionDetails?.tierName}</span>
              </div>
              <div className="detail-item">
                <span className="label">Valid From:</span>
                <span className="value">{limits.subscriptionDetails?.startDate}</span>
              </div>
              <div className="detail-item">
                <span className="label">Valid Until:</span>
                <span className="value">{limits.subscriptionDetails?.endDate}</span>
              </div>
              <div className="detail-item">
                <span className="label">Days Remaining:</span>
                <span className="value highlight">{limits.subscriptionDetails?.daysRemaining} days</span>
              </div>
              <div className="detail-item">
                <span className="label">Billing Feature:</span>
                <span className="value">{limits.subscriptionDetails?.includesBilling ? '? Enabled' : '? Disabled'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Analytics:</span>
                <span className="value">{limits.subscriptionDetails?.includesAnalytics ? '? Enabled' : '? Disabled'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Appointments (This Month):</span>
                <span className="value">{limits.subscriptionDetails?.totalAppointmentsThisMonth || 0}</span>
              </div>
            </div>
          </div>

          {/* Upgrade Recommendations */}
          {!limits.allowed && limits.recommendations && (
            <div className="recommendations">
              <h3> Recommendations</h3>
              <ul>
                {limits.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
              <button className="upgrade-button">Upgrade Subscription</button>
            </div>
          )}

          <p className="text-sm text-muted-foreground">Contact us to update your number</p>

<p className="flex items-center justify-center">
  <PhoneIcon size={18} className="text-primary mr-2 flex-shrink-0" />
  <span className="text-primary">{import.meta.env.VITE_SUPPORT_PHONE_NUMBER}</span>
</p>
        </div>
      )}
    </div>
  );
};

export default FacilityLimitChecker;