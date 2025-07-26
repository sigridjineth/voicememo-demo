import { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchBarProps, SearchFilters } from '@/types';
import { CATEGORIES } from '@/lib/constants';
import { useDebounce } from '@/hooks/useDebounce';

export function SearchBar({
  onSearch,
  placeholder = 'Search memos...',
  initialValue = '',
  showFilters = true,
  onFilterChange,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery !== initialValue) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch, initialValue]);

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange?.({});
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-10"
          />
        </div>
        
        {showFilters && (
          <Button
            variant={isFiltersOpen ? 'secondary' : 'outline'}
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="relative"
          >
            <Filter className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {showFilters && isFiltersOpen && (
        <div className="space-y-4 rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Filters</h3>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                <X className="mr-1 h-3 w-3" />
                Clear all
              </Button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Category filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={filters.category || ''}
                onValueChange={(value) =>
                  handleFilterChange({ category: value || undefined })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date range filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date range</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="date"
                    value={filters.dateFrom || ''}
                    onChange={(e) =>
                      handleFilterChange({ dateFrom: e.target.value || undefined })
                    }
                    className="pl-10"
                  />
                </div>
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="date"
                    value={filters.dateTo || ''}
                    onChange={(e) =>
                      handleFilterChange({ dateTo: e.target.value || undefined })
                    }
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tags filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <Input
              placeholder="Enter tags separated by commas"
              value={filters.tags?.join(', ') || ''}
              onChange={(e) => {
                const tags = e.target.value
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter(Boolean);
                handleFilterChange({ tags: tags.length > 0 ? tags : undefined });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}