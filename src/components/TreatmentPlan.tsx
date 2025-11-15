import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Pill, Heart, Calendar, UserCheck, FileText, Sparkles } from 'lucide-react';
import type { PatientData, RiskAssessment, TreatmentPlanType } from '../App';

interface TreatmentPlanProps {
  patientData: PatientData;
  riskAssessment: RiskAssessment;
  onGenerate: (plan: TreatmentPlanType) => void;
}

export function TreatmentPlan({ patientData, riskAssessment, onGenerate }: TreatmentPlanProps) {
  const [plan, setPlan] = useState<TreatmentPlanType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTreatmentPlan = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const generatedPlan = createPersonalizedPlan(patientData, riskAssessment);
      setPlan(generatedPlan);
      setIsGenerating(false);
    }, 1500);
  };

  const createPersonalizedPlan = (
    data: PatientData,
    assessment: RiskAssessment
  ): TreatmentPlanType => {
    const medications: TreatmentPlanType['medications'] = [];
    const lifestyle: TreatmentPlanType['lifestyle'] = [];
    const monitoring: TreatmentPlanType['monitoring'] = [];
    const followUp: TreatmentPlanType['followUp'] = [];

    // Medication recommendations based on conditions and risks
    const bpValue = parseInt(data.biomarkers.bloodPressure.split('/')[0] || '0');
    const cholesterol = parseInt(data.biomarkers.cholesterol || '0');
    const bloodSugar = parseInt(data.biomarkers.bloodSugar || '0');

    // Blood pressure medication
    if (bpValue > 140 || assessment.specificRisks.some(r => r.condition === 'Cardiovascular Disease' && r.risk === 'high')) {
      medications.push({
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: 'Ongoing',
        reason: 'Blood pressure management and cardiovascular protection',
      });
    }

    // Cholesterol medication
    if (cholesterol > 200 || assessment.specificRisks.some(r => r.condition === 'Cardiovascular Disease' && r.risk !== 'low')) {
      medications.push({
        name: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'Once daily at bedtime',
        duration: 'Ongoing',
        reason: 'Lower LDL cholesterol and reduce cardiovascular risk',
      });
    }

    // Diabetes medication
    if (data.medicalHistory.conditions.some(c => c.toLowerCase().includes('diabetes')) || 
        assessment.specificRisks.some(r => r.condition === 'Type 2 Diabetes' && r.risk === 'high')) {
      medications.push({
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily with meals',
        duration: 'Ongoing',
        reason: 'Blood sugar control and insulin sensitivity',
      });
    }

    // Aspirin for cardiovascular protection
    if (data.demographics.age > 50 && assessment.specificRisks.some(r => r.condition === 'Cardiovascular Disease')) {
      medications.push({
        name: 'Aspirin',
        dosage: '81mg',
        frequency: 'Once daily',
        duration: 'Ongoing',
        reason: 'Cardiovascular disease prevention',
      });
    }

    // Check for medication conflicts with allergies
    const safetyNote = data.medicalHistory.allergies.length > 0 
      ? `Note: Patient has allergies to ${data.medicalHistory.allergies.join(', ')}. All medications should be reviewed for potential allergic reactions.`
      : null;

    // Lifestyle modifications
    const bmi = data.demographics.weight / Math.pow(data.demographics.height / 100, 2);

    if (bmi > 25) {
      lifestyle.push({
        category: 'Weight Management',
        recommendations: [
          'Target 5-10% weight loss through caloric reduction',
          'Portion control using smaller plates and mindful eating',
          'Keep a food diary to track intake',
          'Consult with registered dietitian for personalized meal plan',
        ],
      });
    }

    if (data.lifestyle.exercise === 'sedentary' || data.lifestyle.exercise === 'light') {
      lifestyle.push({
        category: 'Physical Activity',
        recommendations: [
          '150 minutes of moderate-intensity aerobic activity per week',
          'Start with 10-minute walks and gradually increase duration',
          'Incorporate strength training 2 days per week',
          'Consider joining group fitness classes for motivation',
        ],
      });
    }

    lifestyle.push({
      category: 'Nutrition',
      recommendations: [
        'Follow Mediterranean or DASH diet principles',
        'Increase intake of fruits, vegetables, and whole grains',
        'Limit sodium to less than 2,300mg per day',
        'Reduce saturated fats and eliminate trans fats',
        'Limit added sugars and processed foods',
      ],
    });

    if (data.lifestyle.smoking === 'current') {
      lifestyle.push({
        category: 'Smoking Cessation',
        recommendations: [
          'Enroll in smoking cessation program',
          'Consider nicotine replacement therapy (patches, gum)',
          'Prescription medications like varenicline or bupropion',
          'Join support groups or counseling sessions',
          'Remove smoking triggers from environment',
        ],
      });
    }

    if (data.lifestyle.alcohol === 'moderate' || data.lifestyle.alcohol === 'heavy') {
      lifestyle.push({
        category: 'Alcohol Reduction',
        recommendations: [
          'Limit alcohol to no more than 1 drink per day for women, 2 for men',
          'Schedule alcohol-free days each week',
          'Find alternative stress-relief activities',
        ],
      });
    }

    lifestyle.push({
      category: 'Stress Management',
      recommendations: [
        'Practice mindfulness meditation 10-15 minutes daily',
        'Ensure 7-8 hours of quality sleep per night',
        'Consider yoga or tai chi classes',
        'Maintain social connections and support network',
      ],
    });

    // Monitoring schedule
    monitoring.push({
      test: 'Blood Pressure',
      frequency: bpValue > 130 ? 'Weekly at home, monthly in clinic' : 'Monthly at home',
      reason: 'Track cardiovascular health and medication effectiveness',
    });

    monitoring.push({
      test: 'Lipid Panel',
      frequency: 'Every 3 months initially, then every 6 months',
      reason: 'Monitor cholesterol levels and statin therapy response',
    });

    if (assessment.specificRisks.some(r => r.condition === 'Type 2 Diabetes')) {
      monitoring.push({
        test: 'Fasting Blood Glucose & HbA1c',
        frequency: 'Fasting glucose weekly, HbA1c every 3 months',
        reason: 'Track diabetes control and treatment effectiveness',
      });
    }

    monitoring.push({
      test: 'Comprehensive Metabolic Panel',
      frequency: 'Every 6 months',
      reason: 'Monitor kidney function and electrolytes',
    });

    monitoring.push({
      test: 'Weight and BMI',
      frequency: 'Weekly',
      reason: 'Track weight management progress',
    });

    // Follow-up appointments
    followUp.push({
      specialist: 'Primary Care Physician',
      timeframe: '2 weeks',
      reason: 'Review treatment plan and initial progress',
    });

    if (assessment.specificRisks.some(r => r.condition === 'Cardiovascular Disease' && r.risk !== 'low')) {
      followUp.push({
        specialist: 'Cardiologist',
        timeframe: '1 month',
        reason: 'Comprehensive cardiovascular evaluation and stress test',
      });
    }

    if (assessment.specificRisks.some(r => r.condition === 'Type 2 Diabetes')) {
      followUp.push({
        specialist: 'Endocrinologist',
        timeframe: '6 weeks',
        reason: 'Specialized diabetes management and treatment optimization',
      });
    }

    followUp.push({
      specialist: 'Registered Dietitian',
      timeframe: '2 weeks',
      reason: 'Personalized nutrition counseling and meal planning',
    });

    if (data.lifestyle.smoking === 'current') {
      followUp.push({
        specialist: 'Tobacco Cessation Counselor',
        timeframe: '1 week',
        reason: 'Begin smoking cessation program',
      });
    }

    return { medications, lifestyle, monitoring, followUp };
  };

  const handleGeneratePlan = () => {
    if (plan) {
      onGenerate(plan);
    }
  };

  return (
    <div className="space-y-6">
      {!plan && !isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Generate Personalized Treatment Plan
            </CardTitle>
            <CardDescription>
              Create a comprehensive, evidence-based treatment plan tailored to the patient's unique profile and risk factors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                The treatment plan will include precision medicine recommendations for medications, lifestyle modifications, monitoring schedule, and specialist referrals based on the AI risk assessment.
              </AlertDescription>
            </Alert>
            <Button onClick={generateTreatmentPlan} size="lg" className="w-full">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Treatment Plan
            </Button>
          </CardContent>
        </Card>
      )}

      {isGenerating && (
        <Card>
          <CardContent className="py-12 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-pulse" />
            <p>Generating personalized treatment plan...</p>
          </CardContent>
        </Card>
      )}

      {plan && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-6 h-6 text-blue-600" />
                Medication Recommendations
              </CardTitle>
              <CardDescription>Precision medicine approach based on patient profile</CardDescription>
            </CardHeader>
            <CardContent>
              {plan.medications.length > 0 ? (
                <div className="space-y-4">
                  {plan.medications.map((med, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-blue-600">{med.name}</h4>
                          <p className="text-gray-600">{med.reason}</p>
                        </div>
                        <Badge>{med.dosage}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                        <div>
                          <p className="text-gray-500">Frequency</p>
                          <p>{med.frequency}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Duration</p>
                          <p>{med.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {patientData.medicalHistory.allergies.length > 0 && (
                    <Alert>
                      <AlertDescription>
                        <strong>Allergy Alert:</strong> Patient has documented allergies to {patientData.medicalHistory.allergies.join(', ')}. 
                        All medications should be reviewed for potential cross-reactions.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">No specific medications recommended at this time. Continue with current regimen and focus on lifestyle modifications.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-600" />
                Lifestyle Modifications
              </CardTitle>
              <CardDescription>Evidence-based recommendations for optimal health</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {plan.lifestyle.map((category, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="mb-3 text-red-600">{category.category}</h4>
                  <ul className="space-y-2">
                    {category.recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-red-600">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-green-600" />
                Monitoring Schedule
              </CardTitle>
              <CardDescription>Regular testing to track progress and outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {plan.monitoring.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-green-600">{item.test}</h4>
                      <Badge variant="outline">{item.frequency}</Badge>
                    </div>
                    <p className="text-gray-600">{item.reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-purple-600" />
                Follow-Up Appointments
              </CardTitle>
              <CardDescription>Specialist consultations and care coordination</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {plan.followUp.map((appointment, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-purple-600">{appointment.specialist}</h4>
                      <Badge variant="secondary">{appointment.timeframe}</Badge>
                    </div>
                    <p className="text-gray-600">{appointment.reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleGeneratePlan} size="lg">
              View Complete Dashboard
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
