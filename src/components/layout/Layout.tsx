import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useMemoStore } from '@/stores';
import { cn } from '@/lib/utils';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { filters, setFilters } = useMemoStore();

  const handleCategorySelect = (category: string) => {
    setFilters({ category: category || undefined });
  };

  return (
    <div className="flex h-screen flex-col">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          selectedCategory={filters.category}
          onCategorySelect={handleCategorySelect}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container py-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}

export function SimpleLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}