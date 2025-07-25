import { Button } from "@/components/ui/button"
import { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Search, Filter, UserPlus } from "lucide-react"
import { SendRequestModal } from './SendRequestModal';

export function RequestsHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Find New Clients</h1>
          <p className="text-muted-foreground">Browse potential clients and send coaching requests</p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Send Request
          </Button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search clients..." className="pl-10 w-64" />
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>
      
      <SendRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}
'use client';
