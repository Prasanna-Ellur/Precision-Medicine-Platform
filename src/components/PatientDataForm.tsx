import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';
import type { PatientData } from '../App';

interface PatientDataFormProps {
  onSubmit: (data: PatientData) => void;
  initialData?: PatientData | null;
}

export function PatientDataForm({ onSubmit, initialData }: PatientDataFormProps) {
  const [formData, setFormData] = useState<PatientData>(initialData || {
    demographics: {
      age: 0,
      gender: '',
      ethnicity: '',
      weight: 0,
      height: 0,
    },
    medicalHistory: {
      conditions: [],
      medications: [],
      allergies: [],
      familyHistory: [],
    },
    lifestyle: {
      smoking: '',
      alcohol: '',
      exercise: '',
      diet: '',
    },
    biomarkers: {
      bloodPressure: '',
      cholesterol: '',
      bloodSugar: '',
      heartRate: 0,
    },
    geneticMarkers: [],
  });

  const [tempInputs, setTempInputs] = useState({
    condition: '',
    medication: '',
    allergy: '',
    familyHistory: '',
    geneticMarker: '',
  });

  const handleAddItem = (field: keyof typeof tempInputs, category: 'medicalHistory' | 'geneticMarkers') => {
    const value = tempInputs[field].trim();
    if (!value) return;

    if (category === 'geneticMarkers') {
      setFormData(prev => ({
        ...prev,
        geneticMarkers: [...(prev.geneticMarkers || []), value],
      }));
    } else {
      const subField = field === 'condition' ? 'conditions' :
        field === 'medication' ? 'medications' :
          field === 'allergy' ? 'allergies' : 'familyHistory';
      setFormData(prev => ({
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          [subField]: [...prev.medicalHistory[subField], value],
        },
      }));
    }

    setTempInputs(prev => ({ ...prev, [field]: '' }));
  };

  const handleRemoveItem = (category: 'medicalHistory' | 'geneticMarkers', field: string, index: number) => {
    if (category === 'geneticMarkers') {
      setFormData(prev => ({
        ...prev,
        geneticMarkers: prev.geneticMarkers?.filter((_, i) => i !== index),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          [field]: prev.medicalHistory[field as keyof typeof prev.medicalHistory].filter((_, i) => i !== index),
        },
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Demographics</CardTitle>
          <CardDescription>Basic patient information</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={formData.demographics.age || ''}
              onChange={e => setFormData(prev => ({
                ...prev,
                demographics: { ...prev.demographics, age: parseInt(e.target.value) || 0 }
              }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.demographics.gender}
              onValueChange={(value: string) => setFormData(prev => ({
                ...prev,
                demographics: { ...prev.demographics, gender: value }
              }))}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ethnicity">Ethnicity</Label>
            <Input
              id="ethnicity"
              value={formData.demographics.ethnicity}
              onChange={e => setFormData(prev => ({
                ...prev,
                demographics: { ...prev.demographics, ethnicity: e.target.value }
              }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={formData.demographics.weight || ''}
              onChange={e => setFormData(prev => ({
                ...prev,
                demographics: { ...prev.demographics, weight: parseFloat(e.target.value) || 0 }
              }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              step="0.1"
              value={formData.demographics.height || ''}
              onChange={e => setFormData(prev => ({
                ...prev,
                demographics: { ...prev.demographics, height: parseFloat(e.target.value) || 0 }
              }))}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
          <CardDescription>Existing conditions, medications, and allergies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Medical Conditions</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add condition (e.g., Diabetes Type 2)"
                value={tempInputs.condition}
                onChange={e => setTempInputs(prev => ({ ...prev, condition: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddItem('condition', 'medicalHistory'))}
              />
              <Button type="button" onClick={() => handleAddItem('condition', 'medicalHistory')}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.medicalHistory.conditions.map((condition, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {condition}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleRemoveItem('medicalHistory', 'conditions', index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Current Medications</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add medication"
                value={tempInputs.medication}
                onChange={e => setTempInputs(prev => ({ ...prev, medication: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddItem('medication', 'medicalHistory'))}
              />
              <Button type="button" onClick={() => handleAddItem('medication', 'medicalHistory')}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.medicalHistory.medications.map((medication, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {medication}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleRemoveItem('medicalHistory', 'medications', index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Allergies</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add allergy"
                value={tempInputs.allergy}
                onChange={e => setTempInputs(prev => ({ ...prev, allergy: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddItem('allergy', 'medicalHistory'))}
              />
              <Button type="button" onClick={() => handleAddItem('allergy', 'medicalHistory')}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.medicalHistory.allergies.map((allergy, index) => (
                <Badge key={index} variant="destructive" className="gap-1">
                  {allergy}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleRemoveItem('medicalHistory', 'allergies', index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Family History</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add family history (e.g., Heart disease - Father)"
                value={tempInputs.familyHistory}
                onChange={e => setTempInputs(prev => ({ ...prev, familyHistory: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddItem('familyHistory', 'medicalHistory'))}
              />
              <Button type="button" onClick={() => handleAddItem('familyHistory', 'medicalHistory')}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.medicalHistory.familyHistory.map((history, index) => (
                <Badge key={index} variant="outline" className="gap-1">
                  {history}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleRemoveItem('medicalHistory', 'familyHistory', index)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lifestyle Factors</CardTitle>
          <CardDescription>Daily habits and lifestyle information</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smoking">Smoking Status</Label>
            <Select
              value={formData.lifestyle.smoking}
              onValueChange={(value: string) => setFormData(prev => ({
                ...prev,
                lifestyle: { ...prev.lifestyle, smoking: value }
              }))}
            >
              <SelectTrigger id="smoking">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="former">Former</SelectItem>
                <SelectItem value="current">Current</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="alcohol">Alcohol Consumption</Label>
            <Select
              value={formData.lifestyle.alcohol}
              onValueChange={(value: string) => setFormData(prev => ({
                ...prev,
                lifestyle: { ...prev.lifestyle, alcohol: value }
              }))}
            >
              <SelectTrigger id="alcohol">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="occasional">Occasional</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="heavy">Heavy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="exercise">Exercise Level</Label>
            <Select
              value={formData.lifestyle.exercise}
              onValueChange={(value: string) => setFormData(prev => ({
                ...prev,
                lifestyle: { ...prev.lifestyle, exercise: value }
              }))}
            >
              <SelectTrigger id="exercise">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="diet">Diet Type</Label>
            <Select
              value={formData.lifestyle.diet}
              onValueChange={(value: string) => setFormData(prev => ({
                ...prev,
                lifestyle: { ...prev.lifestyle, diet: value }
              }))}
            >
              <SelectTrigger id="diet">
                <SelectValue placeholder="Select diet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="mediterranean">Mediterranean</SelectItem>
                <SelectItem value="low-carb">Low Carb</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Biomarkers & Lab Results</CardTitle>
          <CardDescription>Recent test results and vital signs</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bloodPressure">Blood Pressure (mmHg)</Label>
            <Input
              id="bloodPressure"
              placeholder="e.g., 120/80"
              value={formData.biomarkers.bloodPressure}
              onChange={e => setFormData(prev => ({
                ...prev,
                biomarkers: { ...prev.biomarkers, bloodPressure: e.target.value }
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cholesterol">Cholesterol (mg/dL)</Label>
            <Input
              id="cholesterol"
              placeholder="e.g., 200"
              value={formData.biomarkers.cholesterol}
              onChange={e => setFormData(prev => ({
                ...prev,
                biomarkers: { ...prev.biomarkers, cholesterol: e.target.value }
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bloodSugar">Blood Sugar (mg/dL)</Label>
            <Input
              id="bloodSugar"
              placeholder="e.g., 95"
              value={formData.biomarkers.bloodSugar}
              onChange={e => setFormData(prev => ({
                ...prev,
                biomarkers: { ...prev.biomarkers, bloodSugar: e.target.value }
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
            <Input
              id="heartRate"
              type="number"
              placeholder="e.g., 72"
              value={formData.biomarkers.heartRate || ''}
              onChange={e => setFormData(prev => ({
                ...prev,
                biomarkers: { ...prev.biomarkers, heartRate: parseInt(e.target.value) || 0 }
              }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Genetic Markers (Optional)</CardTitle>
          <CardDescription>Known genetic variants or predispositions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Add genetic marker (e.g., BRCA1 mutation)"
                value={tempInputs.geneticMarker}
                onChange={e => setTempInputs(prev => ({ ...prev, geneticMarker: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddItem('geneticMarker', 'geneticMarkers'))}
              />
              <Button type="button" onClick={() => handleAddItem('geneticMarker', 'geneticMarkers')}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.geneticMarkers?.map((marker, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {marker}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleRemoveItem('geneticMarkers', '', index)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Continue to Risk Assessment
        </Button>
      </div>
    </form>
  );
}
