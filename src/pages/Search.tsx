import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { SearchBar, SearchResults, RAGChat } from '@/components/search';
import { useSearchStore } from '@/stores';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Sparkles } from 'lucide-react';

export function Search() {
  const navigate = useNavigate();
  const {
    searchQuery,
    searchResults,
    isSearching,
    search,
    setSearchQuery,
  } = useSearchStore();
  
  const [activeTab, setActiveTab] = useState('search');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      search({ query: query.trim() });
    }
  };

  const handleFilterChange = (filters: any) => {
    if (searchQuery) {
      search({
        query: searchQuery,
        filters,
      });
    }
  };

  const handleResultClick = (memo: any) => {
    navigate(`/memo/${memo.id}`);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Search & AI Assistant</h1>
        <p className="text-muted-foreground">
          Search your memos or ask questions about your content
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="search" className="gap-2">
            <SearchIcon className="h-4 w-4" />
            Search
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2">
            <Sparkles className="h-4 w-4" />
            AI Assistant
          </TabsTrigger>
        </TabsList>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-6">
          <Card className="p-6">
            <SearchBar
              onSearch={handleSearch}
              initialValue={searchQuery}
              onFilterChange={handleFilterChange}
            />
          </Card>

          {(searchResults.length > 0 || isSearching || searchQuery) && (
            <div>
              <h2 className="mb-4 text-xl font-semibold">
                {isSearching
                  ? 'Searching...'
                  : searchResults.length > 0
                  ? `Found ${searchResults.length} results`
                  : 'No results found'}
              </h2>
              <SearchResults
                results={searchResults}
                isLoading={isSearching}
                onResultClick={handleResultClick}
              />
            </div>
          )}
        </TabsContent>

        {/* AI Assistant Tab */}
        <TabsContent value="ai" className="space-y-6">
          <Card className="h-[600px] overflow-hidden">
            <RAGChat />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}