import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { User, Activity, AlertTriangle, FileText, Download, Printer } from 'lucide-react';
import type { PatientData, RiskAssessment, TreatmentPlanType } from '../App';

interface DashboardProps {
  patientData: PatientData;
  riskAssessment: RiskAssessment;
  treatmentPlan: TreatmentPlanType;
}

export function Dashboard({ patientData, riskAssessment, treatmentPlan }: DashboardProps) {
  const bmi = (patientData.demographics.weight / Math.pow(patientData.demographics.height / 100, 2)).toFixed(1);

  const getRiskColor = (risk: 'low' | 'moderate' | 'high') => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'high': return 'text-red-600';
    }
  };

  const handleExport = () => {
    alert('Exporting treatment plan as PDF...');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Patient Health Dashboard
              </CardTitle>
              <CardDescription>Comprehensive overview and treatment summary</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Patient Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Age</span>
              <span>{patientData.demographics.age} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gender</span>
              <span className="capitalize">{patientData.demographics.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">BMI</span>
              <span>{bmi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Blood Pressure</span>
              <span>{patientData.biomarkers.bloodPressure}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Heart Rate</span>
              <span>{patientData.biomarkers.heartRate} bpm</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Risk Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className={`text-4xl ${getRiskColor(riskAssessment.overallRisk)}`}>
                {riskAssessment.riskScore}
              </div>
              <p className="text-gray-600">Overall Risk Score</p>
              <Badge 
                variant={riskAssessment.overallRisk === 'high' ? 'destructive' : 'secondary'}
                className="mt-2"
              >
                {riskAssessment.overallRisk.toUpperCase()} RISK
              </Badge>
            </div>
            <Progress value={riskAssessment.riskScore} className="mb-2" />
            <p className="text-center">{riskAssessment.specificRisks.length} risk factors identified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Treatment Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Medications</span>
              <Badge variant="outline">{treatmentPlan.medications.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Lifestyle Changes</span>
              <Badge variant="outline">{treatmentPlan.lifestyle.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monitoring Tests</span>
              <Badge variant="outline">{treatmentPlan.monitoring.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Follow-ups</span>
              <Badge variant="outline">{treatmentPlan.followUp.length}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risk Factors Breakdown</CardTitle>
          <CardDescription>Detailed analysis of identified health risks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskAssessment.specificRisks.map((risk, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span>{risk.condition}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">{risk.probability}%</span>
                    <Badge variant={risk.risk === 'high' ? 'destructive' : risk.risk === 'moderate' ? 'secondary' : 'default'}>
                      {risk.risk}
                    </Badge>
                  </div>
                </div>
                <Progress value={risk.probability} className="h-2" />
                {index < riskAssessment.specificRisks.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Medications</CardTitle>
            <CardDescription>Active medication regimen</CardDescription>
          </CardHeader>
          <CardContent>
            {treatmentPlan.medications.length > 0 ? (
              <div className="space-y-3">
                {treatmentPlan.medications.map((med, index) => (
                  <div key={index} className="border-l-4 border-blue-600 pl-3 py-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p>{med.name}</p>
                        <p className="text-gray-600">{med.dosage} - {med.frequency}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No medications prescribed</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Scheduled follow-up visits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {treatmentPlan.followUp.map((appointment, index) => (
                <div key={index} className="border-l-4 border-purple-600 pl-3 py-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p>{appointment.specialist}</p>
                      <p className="text-gray-600">Within {appointment.timeframe}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Recommendations</CardTitle>
          <CardDescription>Priority actions for optimal health outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskAssessment.recommendations.slice(0, 6).map((rec, index) => (
              <div key={index} className="flex gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  {index + 1}
                </div>
                <p className="flex-1">{rec}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lifestyle Modifications</CardTitle>
          <CardDescription>Essential changes for disease prevention and management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {treatmentPlan.lifestyle.map((category, index) => (
              <div key={index}>
                <h4 className="mb-2 text-blue-600">{category.category}</h4>
                <ul className="space-y-1 ml-4">
                  {category.recommendations.map((rec, i) => (
                    <li key={i} className="flex gap-2 text-gray-700">
                      <span>•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
                {index < treatmentPlan.lifestyle.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monitoring & Lab Tests</CardTitle>
          <CardDescription>Regular testing schedule to track treatment progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {treatmentPlan.monitoring.map((test, index) => (
              <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p>{test.test}</p>
                  <p className="text-gray-600">{test.reason}</p>
                </div>
                <Badge variant="outline" className="ml-4">
                  {test.frequency}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {patientData.medicalHistory.conditions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Medical History</CardTitle>
            <CardDescription>Existing conditions and family history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 mb-2">Active Conditions</p>
                <div className="flex flex-wrap gap-2">
                  {patientData.medicalHistory.conditions.map((condition, index) => (
                    <Badge key={index} variant="secondary">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
              {patientData.medicalHistory.allergies.length > 0 && (
                <div>
                  <p className="text-gray-600 mb-2">Allergies</p>
                  <div className="flex flex-wrap gap-2">
                    {patientData.medicalHistory.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {patientData.medicalHistory.familyHistory.length > 0 && (
                <div>
                  <p className="text-gray-600 mb-2">Family History</p>
                  <div className="flex flex-wrap gap-2">
                    {patientData.medicalHistory.familyHistory.map((history, index) => (
                      <Badge key={index} variant="outline">
                        {history}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
