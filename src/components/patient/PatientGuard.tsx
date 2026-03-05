// PatientGuard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface PatientGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PatientGuard: React.FC<PatientGuardProps> = ({ 
  children, 
  fallback = null 
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isPatient, setIsPatient] = useState(false);

  useEffect(() => {
    checkPatientAccess();
  }, []);

  const checkPatientAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/homelogin');
        return;
      }

      const { data, error } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      if (data) {
        setIsPatient(true);
      } else {
        alert('Access Denied: This area is for patients only. Please login with a patient account.');
        navigate('/homelogin');
      }
    } catch (error) {
      console.error('Error checking patient access:', error);
      alert('Error verifying access. Please try again.');
      navigate('/homelogin');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Verifying patient access...</p>
        </div>
      </div>
    );
  }

  return isPatient ? <>{children}</> : <>{fallback}</>;
};

export default PatientGuard;