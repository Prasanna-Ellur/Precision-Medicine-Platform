import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Activity, FileText, UserCircle, AlertCircle } from 'lucide-react';
import { PatientDataForm } from './components/PatientDataForm';
import { RiskAssessment } from './components/RiskAssessment';
import { TreatmentPlan } from './components/TreatmentPlan';
import { Dashboard } from './components/Dashboard';

export interface PatientData {
  demographics: {
    age: number;
    gender: string;
    ethnicity: string;
    weight: number;
    height: number;
  };
  medicalHistory: {
    conditions: string[];
    medications: string[];
    allergies: string[];
    familyHistory: string[];
  };
  lifestyle: {
    smoking: string;
    alcohol: string;
    exercise: string;
    diet: string;
  };
  biomarkers: {
    bloodPressure: string;
    cholesterol: string;
    bloodSugar: string;
    heartRate: number;
  };
  geneticMarkers?: string[];
}

export interface RiskAssessment {
  overallRisk: 'low' | 'moderate' | 'high';
  riskScore: number;
  specificRisks: {
    condition: string;
    risk: 'low' | 'moderate' | 'high';
    probability: number;
    factors: string[];
  }[];
  recommendations: string[];
}

export interface TreatmentPlanType {
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    reason: string;
  }[];
  lifestyle: {
    category: string;
    recommendations: string[];
  }[];
  monitoring: {
    test: string;
    frequency: string;
    reason: string;
  }[];
  followUp: {
    specialist: string;
    timeframe: string;
    reason: string;
  }[];
}

export default function App() {
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlanType | null>(null);
  const [activeTab, setActiveTab] = useState('patient-data');

  const handlePatientDataSubmit = (data: PatientData) => {
    setPatientData(data);
    setActiveTab('risk-assessment');
  };

  const handleRiskAssessmentComplete = (assessment: RiskAssessment) => {
    setRiskAssessment(assessment);
    setActiveTab('treatment-plan');
  };

  const handleTreatmentPlanGenerate = (plan: TreatmentPlanType) => {
    setTreatmentPlan(plan);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-6 max-w-7xl">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Activity className="w-10 h-10 text-blue-600" />
            <h1 className="text-blue-900">Precision Medicine Platform</h1>
          </div>
          <p className="text-gray-600">AI-Powered Personalized Healthcare Solutions</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="patient-data" className="flex items-center gap-2 py-3">
              <UserCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Patient Data</span>
            </TabsTrigger>
            <TabsTrigger 
              value="risk-assessment" 
              className="flex items-center gap-2 py-3"
              disabled={!patientData}
            >
              <AlertCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Risk Assessment</span>
            </TabsTrigger>
            <TabsTrigger 
              value="treatment-plan" 
              className="flex items-center gap-2 py-3"
              disabled={!riskAssessment}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Treatment Plan</span>
            </TabsTrigger>
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 py-3"
              disabled={!treatmentPlan}
            >
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patient-data" className="space-y-6">
            <PatientDataForm 
              onSubmit={handlePatientDataSubmit}
              initialData={patientData}
            />
          </TabsContent>

          <TabsContent value="risk-assessment" className="space-y-6">
            {patientData && (
              <RiskAssessment 
                patientData={patientData}
                onComplete={handleRiskAssessmentComplete}
              />
            )}
          </TabsContent>

          <TabsContent value="treatment-plan" className="space-y-6">
            {patientData && riskAssessment && (
              <TreatmentPlan
                patientData={patientData}
                riskAssessment={riskAssessment}
                onGenerate={handleTreatmentPlanGenerate}
              />
            )}
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            {patientData && riskAssessment && treatmentPlan && (
              <Dashboard
                patientData={patientData}
                riskAssessment={riskAssessment}
                treatmentPlan={treatmentPlan}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
