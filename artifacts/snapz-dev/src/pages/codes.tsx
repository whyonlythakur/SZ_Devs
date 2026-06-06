import { useEffect, useMemo, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { CodeCard } from '@/components/code-card';
import { categories, type Code } from '@/lib/data';
import { fetchVisibleBots } from '@/lib/bots';
import { Search, X, ChevronDown } from 'lucide-react';

export default function CodesPage() {
  const [codes, setCodes] = useState<Code[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchVisibleBots()
      .then(setCodes)
      .finally(() => setLoading(false));
  }, []);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) newExpanded.delete(categoryId);
    else newExpanded.add(categoryId);
    setExpandedCategories(newExpanded);
  };

  const filteredCodes = useMemo(() => {
    return codes.filter((code) => {
      const matchesSearch =
        code.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        code.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubcategory = !selectedSubcategory || code.subcategory === selectedSubcategory;
      const matchesDifficulty = !selectedDifficulty || code.difficulty === selectedDifficulty;
      return matchesSearch && matchesSubcategory && matchesDifficulty;
    });
  }, [codes, searchQuery, selectedSubcategory, selectedDifficulty]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-2 text-4xl font-bold text-foreground sm:text-5xl">Code Snippets</h1>
          <p className="text-lg text-muted-foreground">
            Browse our collection of {codes.length} carefully curated code tutorials and examples
          </p>
        </div>
      </section>

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-6 md:col-span-1">
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search snippets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 pl-9 text-sm text-foreground placeholder-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground" aria-label="Clear search">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-foreground">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => { setSelectedSubcategory(null); setExpandedCategories(new Set()); }}
                    className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${selectedSubcategory === null ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-card hover:text-foreground'}`}
                  >
                    All Categories
                  </button>

                  {categories.map((category) => (
                    <div key={category.id}>
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="w-full text-left rounded-lg px-3 py-2 text-sm transition-colors hover:bg-card flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          {category.label}
                        </span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${expandedCategories.has(category.id) ? 'rotate-180' : ''}`} />
                      </button>

                      {expandedCategories.has(category.id) && (
                        <div className="ml-2 mt-1 space-y-1 border-l border-border pl-2">
                          {category.subcategories.map((sub) => {
                            const count = codes.filter((c) => c.subcategory === sub.id).length;
                            return (
                              <button
                                key={sub.id}
                                onClick={() => setSelectedSubcategory(sub.id)}
                                className={`w-full text-left rounded px-3 py-1.5 text-xs transition-colors ${selectedSubcategory === sub.id ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-card/50'}`}
                              >
                                <span className="flex items-center justify-between">
                                  {sub.label}
                                  <span className="text-xs opacity-70">({count})</span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-foreground">Difficulty</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedDifficulty(null)}
                    className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${selectedDifficulty === null ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-card hover:text-foreground'}`}
                  >
                    All Levels
                  </button>
                  {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedDifficulty(level)}
                      className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${selectedDifficulty === level ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-card hover:text-foreground'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              {loading ? (
                <p className="text-muted-foreground">Loading…</p>
              ) : filteredCodes.length > 0 ? (
                <>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Showing {filteredCodes.length} of {codes.length} snippets
                  </p>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {filteredCodes.map((code) => (
                      <CodeCard key={code.id} {...code} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-lg border border-border bg-card p-12 text-center">
                  <p className="text-muted-foreground">No code snippets found matching your criteria.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedSubcategory(null); setSelectedDifficulty(null); setExpandedCategories(new Set()); }}
                    className="mt-4 text-primary transition-colors hover:text-accent"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
