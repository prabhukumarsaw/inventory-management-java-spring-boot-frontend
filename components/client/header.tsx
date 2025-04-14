'use client';

import { Search, Share2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ModeToggle } from '../mode-toggle';

export function Header() {
  return (
    <header className=" sticky top-0 w-full border-b bg-background px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Left: Brand + Dashboard */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">🛒 POS Shop</span>
          <span className="text-sm text-muted-foreground hidden sm:inline">
            Retail Billing
          </span>
        </div>
        <Link href="/dashboard">
          <Button size="sm" variant="outline">
            Go to Dashboard
          </Button>
        </Link>
      </div>

      {/* Middle: Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input type="text" placeholder="Search Product..." className="pl-10" />
      </div>

      {/* Right: Share */}
      <div className="flex justify-end sm:justify-center">
        <ModeToggle />
        <Button variant="ghost" size="icon">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
