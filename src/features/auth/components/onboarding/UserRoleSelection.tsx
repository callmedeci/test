@@ .. @@
 import { userRoles } from '@/lib/constants';
 import { zodResolver } from '@hookform/resolvers/zod';
 import { Leaf, UserCheck } from 'lucide-react';
-import { useForm } from 'react-hook-form';
+import { useForm, SubmitHandler } from 'react-hook-form';
 import { z } from 'zod';
 
 const UserRoleSelectionSchema = z.object({
   user_role: z.enum(['client', 'coach'], {
     required_error: 'Please select your role to continue.',
   }),
 });
 
 type UserRoleSelectionValues = z.infer<typeof UserRoleSelectionSchema>;
 
 interface UserRoleSelectionProps {
   onRoleSelected: (role: 'client' | 'coach') => void;
 }
 
 export function UserRoleSelection({ onRoleSelected }: UserRoleSelectionProps) {
   const { toast } = useToast();
 
   const form = useForm<UserRoleSelectionValues>({
     resolver: zodResolver(UserRoleSelectionSchema),
     defaultValues: {
       user_role: undefined,
     },
   });
 
-  async function handleSubmit(data: UserRoleSelectionValues) {
+  const handleSubmit: SubmitHandler<UserRoleSelectionValues> = async (data) => {
     try {
       // TODO: Save user role to database
       console.log('Selected user role:', data.user_role);
 
       await editProfile({ user_role: data.user_role });
 
       toast({
         title: 'Role Selected',
         description: `Welcome ${
           data.user_role === 'coach' ? 'Coach' : 'to NutriPlan'
         }!`,
       });
 
       onRoleSelected(data.user_role);
     } catch (error: any) {
       toast({
         title: 'Error',
         description:
           error?.message || 'Something went wrong. Please try again.',
         variant: 'destructive',
       });
     }
-  }
+  };
 
   return (