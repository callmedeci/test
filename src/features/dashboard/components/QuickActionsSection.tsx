import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  Target, 
  Calendar, 
  FileText, 
  ChefHat, 
  SplitSquareHorizontal,
  BrainCircuit,
  Dumbbell,
  MessageSquareQuote
} from 'lucide-react';
import Link from 'next/link';

export function QuickActionsSection() {
  const quickActions = [
    {
      href: '/profile',
      icon: User,
      label: 'Update Profile',
      description: 'Manage your personal information',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
    },
    {
      href: '/tools/smart-calorie-planner',
      icon: BrainCircuit,
      label: 'Smart Calorie Planner',
      description: 'Calculate your daily targets',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
    },
    {
      href: '/tools/macro-splitter',
      icon: SplitSquareHorizontal,
      label: 'Macro Splitter',
      description: 'Distribute macros across meals',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
    },
    {
      href: '/tools/meal-suggestions',
      icon: ChefHat,
      label: 'Meal Suggestions',
      description: 'Get AI-powered meal ideas',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100',
    },
    {
      href: '/meal-plan/current',
      icon: Calendar,
      label: 'Current Meal Plan',
      description: 'View your weekly meals',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      hoverColor: 'hover:bg-indigo-100',
    },
    {
      href: '/meal-plan/optimized',
      icon: Target,
      label: 'AI Meal Plan',
      description: 'Generate optimized meal plans',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      hoverColor: 'hover:bg-pink-100',
    },
    {
      href: '/tools/workout-planner',
      icon: Dumbbell,
      label: 'Workout Planner',
      description: 'Create exercise routines',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      hoverColor: 'hover:bg-emerald-100',
    },
    {
      href: '/support/chatbot',
      icon: MessageSquareQuote,
      label: 'Support Chat',
      description: 'Get help and guidance',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      hoverColor: 'hover:bg-cyan-100',
    },
    {
      href: '/pdf',
      icon: FileText,
      label: 'Full Report',
      description: 'Download comprehensive PDF',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:bg-red-100',
    },
  ];

  return (
    <Card className='border-border/50 hover:shadow-md transition-shadow duration-200'>
      <CardHeader>
        <CardTitle className='text-primary flex items-center gap-2'>
          Quick Actions
        </CardTitle>
        <CardDescription>
          Jump to your most used tools and features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button 
                variant='outline' 
                className={`w-full justify-start h-auto p-4 ${action.hoverColor} border-border/50 hover:border-border transition-all duration-200 hover:shadow-sm`}
              >
                <div className={`p-2 rounded-lg ${action.bgColor} mr-3`}>
                  <action.icon className={`h-4 w-4 ${action.color}`} />
                </div>
                <div className='text-left'>
                  <div className='font-medium text-foreground'>{action.label}</div>
                  <div className='text-xs text-muted-foreground'>{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}