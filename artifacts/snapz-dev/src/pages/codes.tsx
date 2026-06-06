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
    fetchVisibleBots().then(setCodes).finally(() => setLoading(false));
  }, []);

  const toggleCategory = (id: string) => {
    const n = new Set(expandedCategories);
    n.has(id) ? n.delete(id) : n.add(id);
    setExpandedCategories(n);
  };

  const filteredCodes = useMemo(() => codes.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      (c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) &&
      (!selectedSubcategory || c.subcategory === selectedSubcategory) &&
      (!selectedDifficulty || c.difficulty === selectedDifficulty)
    );
  }), [codes, searchQuery, selectedSubcategory, selectedDifficulty]);

  const activeBtn = 'bg-[#3A8FD4]/20 border border-[#3A8FD4]/60 text-[#5BB8F5] shadow-[0_0_10px_rgba(58,143,212,0.2)]';
  const inactiveBtn = 'text-gray-400 hover:bg-[#1E3A5F]/20 hover:text-[#5BB8F5]';

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />

      <section className="border-b border-[#1E3A5F]/40 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-2 text-4xl font-bold text-white sm:text-5xl">
            Code <span className="text-[#5BB8F5]">Snippets</span>
          </h1>
          <p className="text-gray-400">
            Browse our collection of {codes.length} carefully curated code tutorials and examples
          </p>
        </div>
      </section>

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Sidebar */}
            <div className="space-y-6 md:col-span-1">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search snippets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-[#1E3A5F] bg-[#111] px-3 py-2 pl-9 text-sm text-white placeholder-gray-600 focus:border-[#3A8FD4] focus:outline-none focus:ring-1 focus:ring-[#3A8FD4]/30 transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-gray-500 hover:text-white">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-gray-300">Categories</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => { setSelectedSubcategory(null); setExpandedCategories(new Set()); }}
                    className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-all ${selectedSubcategory === null ? activeBtn : inactiveBtn}`}
                  >
                    All Categories
                  </button>

                  {categories.map((cat) => (
                    <div key={cat.id}>
                      <button
                        onClick={() => toggleCategory(cat.id)}
                        className="w-full text-left rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-[#1E3A5F]/20 hover:text-[#5BB8F5] transition-all flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2"><span>{cat.icon}</span>{cat.label}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${expandedCategories.has(cat.id) ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedCategories.has(cat.id) && (
                        <div className="ml-2 mt-1 space-y-1 border-l border-[#1E3A5F]/50 pl-2">
                          {cat.subcategories.map((sub) => {
                            const count = codes.filter((c) => c.subcategory === sub.id).length;
                            return (
                              <button
                                key={sub.id}
                                onClick={() => setSelectedSubcategory(sub.id)}
                                className={`w-full text-left rounded px-3 py-1.5 text-xs transition-all flex items-center justify-between ${selectedSubcategory === sub.id ? 'text-[#5BB8F5] bg-[#1E3A5F]/30' : 'text-gray-500 hover:text-[#5BB8F5] hover:bg-[#1E3A5F]/20'}`}
                              >
                                <span>{sub.label}</span>
                                <span className="opacity-60">({count})</span>
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
                <h3 className="mb-3 font-semibold text-gray-300">Difficulty</h3>
                <div className="space-y-1">
                  <button onClick={() => setSelectedDifficulty(null)}
                    className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-all ${selectedDifficulty === null ? activeBtn : inactiveBtn}`}>
                    All Levels
                  </button>
                  {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                    <button key={lvl} onClick={() => setSelectedDifficulty(lvl)}
                      className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-all ${selectedDifficulty === lvl ? activeBtn : inactiveBtn}`}>
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="md:col-span-3">
              {loading ? (
                <p className="text-gray-500">Loading…</p>
              ) : filteredCodes.length > 0 ? (
                <>
                  <p className="mb-6 text-sm text-gray-500">Showing {filteredCodes.length} of {codes.length} snippets</p>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {filteredCodes.map((code) => <CodeCard key={code.id} {...code} />)}
                  </div>
                </>
              ) : (
                <div className="rounded-lg border border-[#1E3A5F]/40 bg-[#111] p-12 text-center">
                  <p className="text-gray-500">No snippets found matching your criteria.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedSubcategory(null); setSelectedDifficulty(null); setExpandedCategories(new Set()); }}
                    className="mt-4 text-[#5BB8F5] hover:underline">
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
