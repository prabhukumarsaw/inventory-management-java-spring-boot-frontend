'use client';

import type React from 'react';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils'; // optional utility to combine classNames

interface DashboardHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode; // right-side actions
  className?: string;
}

export function DashboardHeader({
  title,
  description,
  children,
  className,
}: DashboardHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 backdrop-blur-md bg-background/80 shadow-sm transition-shadow border-b',
        'group-has-data-[collapsible=icon]/sidebar-wrapper:h-14',
        'flex h-14 items-center justify-between px-4 lg:px-6',
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-6" />
        <div className="overflow-hidden">
          <h1 className="text-base font-semibold truncate">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground truncate">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {children}
        <ModeToggle />
      </div>
    </header>
  );
}
