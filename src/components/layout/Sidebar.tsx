import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Mic, 
  Search, 
  Settings, 
  X, 
  FolderOpen,
  Tag,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarProps } from '@/types';
import { CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Record', href: '/record', icon: Mic },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ 
  isOpen = false, 
  onClose, 
  categories = CATEGORIES, 
  selectedCategory,
  onCategorySelect 
}: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState(true);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 transform border-r bg-background transition-transform duration-200 ease-in-out md:relative md:top-0 md:h-full md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Mobile close button */}
          {onClose && (
            <div className="flex items-center justify-between p-4 md:hidden">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Navigation */}
          <nav className="space-y-1 px-3 py-4">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-secondary text-secondary-foreground'
                      : 'hover:bg-secondary/50'
                  )
                }
                onClick={onClose}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="border-t px-3 py-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="px-3 text-sm font-semibold">Categories</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedCategories(!expandedCategories)}
              >
                <FolderOpen className="h-4 w-4" />
              </Button>
            </div>

            {expandedCategories && (
              <div className="space-y-1">
                <button
                  onClick={() => {
                    onCategorySelect?.('');
                    onClose?.();
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                    !selectedCategory
                      ? 'bg-secondary text-secondary-foreground'
                      : 'hover:bg-secondary/50'
                  )}
                >
                  <Tag className="h-4 w-4" />
                  All Categories
                </button>

                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      onCategorySelect?.(category);
                      onClose?.();
                    }}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                      selectedCategory === category
                        ? 'bg-secondary text-secondary-foreground'
                        : 'hover:bg-secondary/50'
                    )}
                  >
                    <FolderOpen className="h-4 w-4" />
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="mt-auto border-t px-3 py-4">
            <h3 className="mb-2 px-3 text-sm font-semibold">Recent Activity</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 px-3 py-1">
                <Calendar className="h-4 w-4" />
                <span>5 memos today</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1">
                <Mic className="h-4 w-4" />
                <span>2h 15m recorded</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}