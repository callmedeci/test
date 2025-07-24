import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockCoachProfile } from '@/features/coach/lib/mockData';

export function CoachProfileForm() {
  return (
    <Card className='border border-border/50'>
      <CardHeader>
        <CardTitle className='text-lg font-semibold'>
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='first_name'>First Name</Label>
            <Input
              id='full_name'
              defaultValue={mockCoachProfile.first_name}
              placeholder='Enter your first name'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='age'>Age</Label>
            <Input
              id='age'
              type='number'
              defaultValue={mockCoachProfile.age}
              placeholder='Enter your age'
            />
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='description'>Professional Description</Label>
          <Textarea
            id='description'
            defaultValue={mockCoachProfile.description}
            placeholder='Describe your experience and approach to coaching...'
            rows={4}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='certification'>Certification</Label>
          <Input
            id='certification'
            defaultValue={mockCoachProfile.certification}
            placeholder='Enter your professional certification'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='years_experience'>Years of Experience</Label>
            <Input
              id='years_experience'
              type='number'
              defaultValue={mockCoachProfile.years_experience}
              placeholder='Years of experience'
            />
          </div>
        </div>

        <div className='flex justify-end gap-3 pt-4'>
          <Button variant='outline' className='bg-transparent'>
            Cancel
          </Button>
          <Button>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
