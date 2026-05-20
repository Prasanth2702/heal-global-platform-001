import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import DoctorHospitals from "./DoctorHospitals";
import DoctorHospitalsPages from "./DoctorHospitalsPages";

const DoctorRouteHandler = () => {
  const { views } = useParams();

  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setIsLoggedIn(!!user);
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // LOGIN CONDITION
  return isLoggedIn
    ? <DoctorHospitals />
    : <DoctorHospitalsPages />;
};

export default DoctorRouteHandler;