import { Search, Share2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '../ui/sidebar';

export function Header() {
  return (
    <div className="p-4 flex items-center gap-4 border-b">
      <SidebarTrigger className="-ml-1" />
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search Product here..."
          className="pl-10 w-full"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold">xxxxxx</span>
        <span className="text-gray-500 text-sm">xxxx</span>
      </div>
      <Button variant="ghost" size="icon">
        <Share2 className="h-5 w-5" />
      </Button>
    </div>
  );
}
