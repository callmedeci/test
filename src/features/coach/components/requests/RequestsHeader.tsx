'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { SendRequestModal } from './SendRequestModal';

export function RequestsHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>
            Find New Clients
          </h1>
          <p className='text-muted-foreground'>
            Browse potential clients and send coaching requests
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4' />
            <Input placeholder='Search clients...' className='pl-10 w-64' />
          </div>
          <Button onClick={() => setIsModalOpen(true)} className='gap-2'>
            <UserPlus className='size-4' />
            Send Request
          </Button>
        </div>
      </div>

      <SendRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
