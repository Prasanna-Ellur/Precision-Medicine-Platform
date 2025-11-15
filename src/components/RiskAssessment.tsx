import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, Brain, CheckCircle2, TrendingUp } from 'lucide-react';
import type { PatientData, RiskAssessment as RiskAssessmentType } from '../App';

interface RiskAssessmentProps {
  patientData: PatientData;
  onComplete: (assessment: RiskAssessmentType) => void;
}

export function RiskAssessment({ patientData, onComplete }: RiskAssessmentProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [assessment, setAssessment] = useState<RiskAssessmentType | null>(null);

  const analyzeRisks = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate AI analysis with progress
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate AI processing
    setTimeout(() => {
      const generatedAssessment = generateRiskAssessment(patientData);
      setAssessment(generatedAssessment);
      setIsAnalyzing(false);
    }, 2500);
  };

  const generateRiskAssessment = (data: PatientData): RiskAssessmentType => {
    const risks: RiskAssessmentType['specificRisks'] = [];
    const recommendations: string[] = [];
    let totalRiskScore = 0;

    // Calculate BMI
    const bmi = data.demographics.weight / Math.pow(data.demographics.height / 100, 2);
    
    // Cardiovascular Risk
    const cvdFactors: string[] = [];
    let cvdRisk = 0;
    
    if (data.demographics.age > 45) {
      cvdFactors.push('Age over 45');
      cvdRisk += 20;
    }
    if (data.lifestyle.smoking === 'current') {
      cvdFactors.push('Current smoker');
      cvdRisk += 30;
    }
    if (bmi > 30) {
      cvdFactors.push('Obesity (BMI > 30)');
      cvdRisk += 25;
    }
    if (data.medicalHistory.familyHistory.some(h => h.toLowerCase().includes('heart'))) {
      cvdFactors.push('Family history of heart disease');
      cvdRisk += 20;
    }
    if (data.lifestyle.exercise === 'sedentary') {
      cvdFactors.push('Sedentary lifestyle');
      cvdRisk += 15;
    }
    const bpValue = parseInt(data.biomarkers.bloodPressure.split('/')[0] || '0');
    if (bpValue > 140) {
      cvdFactors.push('Elevated blood pressure');
      cvdRisk += 25;
    }

    if (cvdFactors.length > 0) {
      risks.push({
        condition: 'Cardiovascular Disease',
        risk: cvdRisk > 60 ? 'high' : cvdRisk > 30 ? 'moderate' : 'low',
        probability: Math.min(cvdRisk, 85),
        factors: cvdFactors,
      });
      totalRiskScore += cvdRisk;
    }

    // Diabetes Risk
    const diabetesFactors: string[] = [];
    let diabetesRisk = 0;

    if (data.medicalHistory.conditions.some(c => c.toLowerCase().includes('prediabetes'))) {
      diabetesFactors.push('Prediabetes diagnosis');
      diabetesRisk += 40;
    }
    if (bmi > 25) {
      diabetesFactors.push('Overweight or obese');
      diabetesRisk += 20;
    }
    if (data.demographics.age > 45) {
      diabetesFactors.push('Age over 45');
      diabetesRisk += 15;
    }
    if (data.lifestyle.exercise === 'sedentary') {
      diabetesFactors.push('Physical inactivity');
      diabetesRisk += 15;
    }
    if (data.medicalHistory.familyHistory.some(h => h.toLowerCase().includes('diabetes'))) {
      diabetesFactors.push('Family history of diabetes');
      diabetesRisk += 25;
    }
    const bloodSugar = parseInt(data.biomarkers.bloodSugar || '0');
    if (bloodSugar > 100) {
      diabetesFactors.push('Elevated fasting blood sugar');
      diabetesRisk += 30;
    }

    if (diabetesFactors.length > 0) {
      risks.push({
        condition: 'Type 2 Diabetes',
        risk: diabetesRisk > 60 ? 'high' : diabetesRisk > 30 ? 'moderate' : 'low',
        probability: Math.min(diabetesRisk, 80),
        factors: diabetesFactors,
      });
      totalRiskScore += diabetesRisk;
    }

    // Cancer Risk
    const cancerFactors: string[] = [];
    let cancerRisk = 0;

    if (data.lifestyle.smoking !== 'never') {
      cancerFactors.push('Smoking history');
      cancerRisk += 35;
    }
    if (data.demographics.age > 50) {
      cancerFactors.push('Age over 50');
      cancerRisk += 15;
    }
    if (data.medicalHistory.familyHistory.some(h => h.toLowerCase().includes('cancer'))) {
      cancerFactors.push('Family history of cancer');
      cancerRisk += 25;
    }
    if (data.lifestyle.alcohol === 'heavy') {
      cancerFactors.push('Heavy alcohol consumption');
      cancerRisk += 20;
    }
    if (data.geneticMarkers?.some(m => m.toLowerCase().includes('brca'))) {
      cancerFactors.push('BRCA genetic mutation');
      cancerRisk += 40;
    }

    if (cancerFactors.length > 0) {
      risks.push({
        condition: 'Cancer',
        risk: cancerRisk > 60 ? 'high' : cancerRisk > 30 ? 'moderate' : 'low',
        probability: Math.min(cancerRisk, 75),
        factors: cancerFactors,
      });
      totalRiskScore += cancerRisk;
    }

    // Metabolic Syndrome
    const metabolicFactors: string[] = [];
    let metabolicRisk = 0;

    if (bmi > 30) {
      metabolicFactors.push('Obesity');
      metabolicRisk += 30;
    }
    if (bpValue > 130) {
      metabolicFactors.push('High blood pressure');
      metabolicRisk += 25;
    }
    const cholesterol = parseInt(data.biomarkers.cholesterol || '0');
    if (cholesterol > 200) {
      metabolicFactors.push('High cholesterol');
      metabolicRisk += 25;
    }
    if (bloodSugar > 100) {
      metabolicFactors.push('Elevated blood sugar');
      metabolicRisk += 25;
    }

    if (metabolicFactors.length >= 2) {
      risks.push({
        condition: 'Metabolic Syndrome',
        risk: metabolicRisk > 60 ? 'high' : metabolicRisk > 30 ? 'moderate' : 'low',
        probability: Math.min(metabolicRisk, 70),
        factors: metabolicFactors,
      });
      totalRiskScore += metabolicRisk;
    }

    // Generate recommendations
    if (data.lifestyle.smoking === 'current') {
      recommendations.push('Smoking cessation is critical - consider nicotine replacement therapy or counseling');
    }
    if (data.lifestyle.exercise === 'sedentary' || data.lifestyle.exercise === 'light') {
      recommendations.push('Increase physical activity to at least 150 minutes of moderate exercise per week');
    }
    if (bmi > 25) {
      recommendations.push('Weight management through diet and exercise - aim for 5-10% weight loss');
    }
    if (bpValue > 130) {
      recommendations.push('Monitor blood pressure regularly and consider lifestyle modifications or medication');
    }
    if (cholesterol > 200) {
      recommendations.push('Improve cholesterol levels through diet modification and potentially statin therapy');
    }
    if (bloodSugar > 100) {
      recommendations.push('Monitor blood glucose levels and consider dietary changes to reduce sugar intake');
    }
    if (data.lifestyle.diet === 'standard') {
      recommendations.push('Consider adopting a Mediterranean or DASH diet for cardiovascular health');
    }
    recommendations.push('Regular health screenings based on age and risk factors');
    recommendations.push('Stress management techniques such as meditation or yoga');

    const avgRiskScore = risks.length > 0 ? totalRiskScore / risks.length : 0;
    const overallRisk: 'low' | 'moderate' | 'high' = 
      avgRiskScore > 50 ? 'high' : avgRiskScore > 25 ? 'moderate' : 'low';

    return {
      overallRisk,
      riskScore: Math.round(avgRiskScore),
      specificRisks: risks,
      recommendations,
    };
  };

  const getRiskColor = (risk: 'low' | 'moderate' | 'high') => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getRiskBadgeVariant = (risk: 'low' | 'moderate' | 'high') => {
    switch (risk) {
      case 'low': return 'default';
      case 'moderate': return 'secondary';
      case 'high': return 'destructive';
    }
  };

  return (
    <div className="space-y-6">
      {!assessment && !isAnalyzing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-600" />
              AI-Powered Risk Assessment
            </CardTitle>
            <CardDescription>
              Our advanced AI algorithms will analyze your patient data to assess health risks and provide personalized recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This assessment uses machine learning models trained on clinical data to identify potential health risks based on demographics, lifestyle, medical history, and biomarkers.
              </AlertDescription>
            </Alert>
            <Button onClick={analyzeRisks} size="lg" className="w-full">
              <Brain className="w-4 h-4 mr-2" />
              Start AI Analysis
            </Button>
          </CardContent>
        </Card>
      )}

      {isAnalyzing && (
        <Card>
          <CardHeader>
            <CardTitle>Analyzing Patient Data...</CardTitle>
            <CardDescription>AI is processing your data to generate risk assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={analysisProgress} className="w-full" />
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                {analysisProgress >= 20 && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                Processing demographics and biomarkers
              </p>
              <p className="flex items-center gap-2">
                {analysisProgress >= 40 && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                Analyzing medical history and genetic markers
              </p>
              <p className="flex items-center gap-2">
                {analysisProgress >= 60 && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                Evaluating lifestyle factors
              </p>
              <p className="flex items-center gap-2">
                {analysisProgress >= 80 && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                Calculating risk probabilities
              </p>
              <p className="flex items-center gap-2">
                {analysisProgress >= 100 && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                Generating recommendations
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {assessment && (
        <>
          <Card className={`border-2 ${getRiskColor(assessment.overallRisk)}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Overall Health Risk Assessment</span>
                <Badge variant={getRiskBadgeVariant(assessment.overallRisk)} className="text-lg px-4 py-1">
                  {assessment.overallRisk.toUpperCase()}
                </Badge>
              </CardTitle>
              <CardDescription>Risk Score: {assessment.riskScore}/100</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={assessment.riskScore} className="h-3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Specific Risk Factors
              </CardTitle>
              <CardDescription>Detailed analysis of individual health risks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {assessment.specificRisks.map((risk, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4>{risk.condition}</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600">{risk.probability}% probability</span>
                      <Badge variant={getRiskBadgeVariant(risk.risk)}>
                        {risk.risk}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={risk.probability} className="h-2" />
                  <div>
                    <p className="text-gray-600 mb-2">Contributing factors:</p>
                    <div className="flex flex-wrap gap-2">
                      {risk.factors.map((factor, i) => (
                        <Badge key={i} variant="outline">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Recommendations</CardTitle>
              <CardDescription>Personalized recommendations to reduce your health risks</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {assessment.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      {index + 1}
                    </div>
                    <p className="flex-1">{recommendation}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => onComplete(assessment)} size="lg">
              Continue to Treatment Plan
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
