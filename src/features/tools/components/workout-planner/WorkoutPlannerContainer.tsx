'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BaseProfileData, ExercisePlannerFormData } from '@/lib/schemas';
import { Dumbbell, Settings, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { loadSavedPreferences } from '../../actions/apiExercise';
import ExercisePlanGenerator from './ExercisePlanGenerator';
import ExercisePlannerForm from './ExercisePlannerForm';
import ProfileSummaryCard from './ProfileSummaryCard';
import WorkoutPlanDisplay from './WorkoutPlanDisplay';
import WorkoutTipsSection from './WorkoutTipsSection';

interface WorkoutPlannerContainerProps {
  profile: BaseProfileData;
}

export default function WorkoutPlannerContainer({ profile }: WorkoutPlannerContainerProps) {
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [preferences, setPreferences] = useState<Partial<ExercisePlannerFormData>>({});
  const [activeTab, setActiveTab] = useState('preferences');

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const result = await loadSavedPreferences();
        if (result.isSuccess && result.data) {
          setPreferences(result.data);
        }
      } catch (error) {
        console.error('Failed to load saved preferences:', error);
      }
    };

    loadPreferences();
  }, []);

  const handlePreferencesSaved = (data: ExercisePlannerFormData) => {
    setPreferences(data);
    setActiveTab('generate');
  };

  const handlePlanGenerated = (plan: any) => {
    setGeneratedPlan(plan);
    setActiveTab('plan');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full shadow-lg">
              <Dumbbell className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              AI Workout Plan Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create personalized weekly workout plans powered by artificial intelligence,
            tailored to your fitness level and goals
          </p>
        </div>

        {/* Profile Summary */}
        {profile && <ProfileSummaryCard profile={profile} />}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl p-2">
            <TabsTrigger
              value="preferences"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg font-medium transition-all duration-200"
            >
              <Settings className="w-4 h-4 mr-2" />
              Set Preferences
            </TabsTrigger>
            <TabsTrigger
              value="generate"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg font-medium transition-all duration-200"
            >
              <Zap className="w-4 h-4 mr-2" />
              Generate Plan
            </TabsTrigger>
            <TabsTrigger
              value="plan"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg font-medium transition-all duration-200"
            >
              <Dumbbell className="w-4 h-4 mr-2" />
              Your Plan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preferences" className="mt-6">
            <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Exercise Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExercisePlannerForm
                  initialData={preferences}
                  onSave={handlePreferencesSaved}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generate" className="mt-6">
            <ExercisePlanGenerator
              profile={profile}
              preferences={preferences as ExercisePlannerFormData}
              onPlanGenerated={handlePlanGenerated}
            />
          </TabsContent>

          <TabsContent value="plan" className="mt-6">
            {generatedPlan ? (
              <div className="space-y-8">
                <WorkoutPlanDisplay generatedPlan={generatedPlan} />
                <WorkoutTipsSection generatedPlan={generatedPlan} />
              </div>
            ) : (
              <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
                <CardContent className="p-12 text-center">
                  <Dumbbell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Workout Plan Generated Yet
                  </h3>
                  <p className="text-gray-500">
                    Complete your preferences and generate a plan to see it here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}