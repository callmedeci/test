import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseProfileData } from '@/lib/schemas';
import { Activity, Calendar, Target, TrendingUp, Users } from 'lucide-react';

interface ProfileSummaryCardProps {
  profile: BaseProfileData;
}

export default function ProfileSummaryCard({ profile }: ProfileSummaryCardProps) {
  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 shadow-xl">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center gap-3 text-xl">
          <Target className="w-6 h-6" />
          Your Fitness Profile Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-white/70 rounded-lg backdrop-blur-sm shadow-md">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-sm font-medium text-green-700">Experience Level</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1 font-semibold">
              Beginner
            </Badge>
          </div>
          
          <div className="text-center p-4 bg-white/70 rounded-lg backdrop-blur-sm shadow-md">
            <div className="flex items-center justify-center mb-2">
              <Activity className="w-5 h-5 text-blue-600 mr-2" />
              <p className="text-sm font-medium text-blue-700">Activity Level</p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1 font-semibold">
              {profile.physical_activity_level || 'Moderate'}
            </Badge>
          </div>
          
          <div className="text-center p-4 bg-white/70 rounded-lg backdrop-blur-sm shadow-md">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-purple-600 mr-2" />
              <p className="text-sm font-medium text-purple-700">Primary Goal</p>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 px-3 py-1 font-semibold">
              {profile.primary_diet_goal || 'General Fitness'}
            </Badge>
          </div>
          
          <div className="text-center p-4 bg-white/70 rounded-lg backdrop-blur-sm shadow-md">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-orange-600 mr-2" />
              <p className="text-sm font-medium text-orange-700">Age</p>
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 px-3 py-1 font-semibold">
              {profile.age || 'N/A'} years
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}