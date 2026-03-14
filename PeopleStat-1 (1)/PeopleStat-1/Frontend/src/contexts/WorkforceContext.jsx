import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/services/api";
import { useAuth } from "@/lib/auth";

const WorkforceContext = createContext(null);

export function WorkforceProvider({ children }) {
  const { user } = useAuth();
  const [employees, setEmployees] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.get('/employees')
        .then(response => {
          const data = response.data.data || [];
          // Format strict backend models to adapt to frontend UI specs
          const formatted = data.map(emp => ({
            id: emp._id,
            employeeId: emp.employeeId || (emp._id ? `EMP-${String(emp._id).substring(String(emp._id).length - 4)}` : 'EMP-0000'),
            name: emp.name || 'Unknown',
            email: emp.email || '',
            department: emp.department || 'Unassigned',
            position: emp.recommendedRole || emp.position || 'Pending',
            skills: emp.skills || { hard: [], soft: [] },
            scores: {
              fitment: emp.fitmentScore || 0,
              performance: emp.performance || 'Average',
              productivity: emp.productivity || 0,
              fatigue: emp.fatigueScore || 0,
              utilization: emp.utilization || 0,
              automationPotential: emp.automationPotential || 0
            }
          }));
          setEmployees(formatted);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Failed to load workforce", err);
          setEmployees([]);
          setIsLoading(false);
        });
    } else {
      setEmployees([]);
      setIsLoading(false);
    }
  }, [user]);

  // Expose the helper functions globally
  const getOverallRisk = (emp) => {
    if (!emp) return "Low";
    if (emp.scores.fatigue > 75) return "High";
    if (emp.scores.fitment < 50) return "High";
    return "Low";
  };

  const getFitmentBand = (score) => {
    if (score >= 80) return "Optimal";
    if (score >= 60) return "Stable";
    return "At-Risk";
  };

  const getFatigueRisk = (score) => {
    if (score > 75) return "Critical";
    if (score > 50) return "Elevated";
    return "Normal";
  };

  return (
    <WorkforceContext.Provider value={{ employees, isLoading, getOverallRisk, getFitmentBand, getFatigueRisk }}>
      {children}
    </WorkforceContext.Provider>
  );
}

export function useWorkforceData() {
  return useContext(WorkforceContext);
}
