import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  CornerDownLeft,
  ArrowRight,
  Sun,
  Zap,
  Building2,
  Home,
  HelpCircle,
  FileText,
  Calculator,
  ShieldCheck,
  Tag,
  Loader2,
  Sparkles,
  ArrowUpDown,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import {
  fetchFullSearchIndex,
  searchItems,
  SearchCategory,
  SearchResultItem,
} from "@/lib/searchData";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDark?: boolean;
}

const CATEGORIES: SearchCategory[] = [
  "All",
  "Solutions",
  "Services",
  "Products",
  "Subsidy",
  "Projects",
  "Blog",
  "FAQ",
  "Pages",
];

const POPULAR_QUERIES = [
  { label: "PM Surya Ghar Subsidy", query: "subsidy" },
  { label: "Solar Panels 545W", query: "solar panel" },
  { label: "Hybrid Inverter", query: "hybrid inverter" },
  { label: "Residential Rooftop", query: "residential" },
  { label: "Commercial Solar", query: "commercial" },
  { label: "Savings Calculator", query: "calculator" },
  { label: "Net Metering", query: "net metering" },
];

const getCategoryBadgeClass = (category: string) => {
  switch (category) {
    case "Solutions":
      return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
    case "Services":
      return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
    case "Products":
      return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30";
    case "Subsidy":
      return "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30";
    case "Projects":
      return "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30";
    case "Blog":
      return "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30";
    case "FAQ":
      return "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Solutions":
      return <Zap className="h-3.5 w-3.5" />;
    case "Services":
      return <Sun className="h-3.5 w-3.5" />;
    case "Products":
      return <Tag className="h-3.5 w-3.5" />;
    case "Subsidy":
      return <ShieldCheck className="h-3.5 w-3.5" />;
    case "Projects":
      return <Building2 className="h-3.5 w-3.5" />;
    case "Blog":
      return <BookOpen className="h-3.5 w-3.5" />;
    case "FAQ":
      return <HelpCircle className="h-3.5 w-3.5" />;
    default:
      return <FileText className="h-3.5 w-3.5" />;
  }
};

// Helper for highlighting matching terms
const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) return <span>{text}</span>;

  const words = highlight
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (words.length === 0) return <span>{text}</span>;

  const regex = new RegExp(`(${words.join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-primary/25 text-primary font-semibold rounded-sm px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>("All");
  const [allData, setAllData] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Load search index on mount or when search opens
  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      setLoading(true);
      fetchFullSearchIndex()
        .then((items) => {
          if (isMounted) {
            setAllData(items);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Debounce query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 120);
    return () => clearTimeout(handler);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setQuery("");
      setDebouncedQuery("");
      setSelectedCategory("All");
      setActiveIndex(0);
    }
  }, [isOpen]);

  // Close on Escape or Outside Click
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Compute filtered search results
  const results = useMemo(() => {
    return searchItems(allData, debouncedQuery, selectedCategory);
  }, [allData, debouncedQuery, selectedCategory]);

  // Reset activeIndex when query or category changes
  useEffect(() => {
    setActiveIndex(0);
  }, [debouncedQuery, selectedCategory]);

  // Ensure active result is scrolled into view
  useEffect(() => {
    if (resultsContainerRef.current && results.length > 0) {
      const activeEl = resultsContainerRef.current.querySelector(
        `[data-search-index="${activeIndex}"]`
      ) as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [activeIndex, results.length]);

  const handleSelect = useCallback(
    (item: SearchResultItem) => {
      onClose();
      navigate(item.href);
    },
    [navigate, onClose]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (results.length > 0) {
        setActiveIndex((prev) => (prev + 1) % results.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length > 0) {
        setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results.length > 0 && results[activeIndex]) {
        handleSelect(results[activeIndex]);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="bg-background/95 backdrop-blur-2xl border-t border-b border-border/70 shadow-2xl overflow-hidden"
        >
          <div
            ref={containerRef}
            className="mx-auto w-full max-w-[1440px] px-3 sm:px-6 lg:px-8 py-3.5 sm:py-5 flex flex-col gap-3.5"
          >
            {/* Main Input Row */}
            <div className="relative flex items-center w-full">
              <div className="absolute left-3.5 sm:left-4.5 flex items-center pointer-events-none text-primary">
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                ) : (
                  <Search className="h-5 w-5 text-primary" />
                )}
              </div>

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search solar panels, subsidy, inverters, savings, projects, blogs..."
                aria-label="Search website content"
                className="w-full h-12 sm:h-14 rounded-2xl border border-border/80 bg-card/90 pl-11 sm:pl-13 pr-24 sm:pr-28 text-sm sm:text-base font-medium placeholder:text-muted-foreground/60 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner"
              />

              <div className="absolute right-3 sm:right-4 flex items-center gap-1.5 sm:gap-2">
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search"
                  className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground/80 bg-muted/60 border border-border px-2 py-1 rounded-lg hover:text-foreground transition-colors"
                >
                  <span>ESC</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search overlay"
                  className="sm:hidden p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Category Filter Pills (Horizontal scrollable with no horizontal page overflow) */}
            <div
              data-lenis-prevent
              className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-full"
            >
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 border ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105"
                        : "bg-card/70 border-border/70 text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                  >
                    {cat !== "All" && getCategoryIcon(cat)}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Results & Suggestions Area */}
            <div
              ref={resultsContainerRef}
              data-lenis-prevent
              className="max-h-[60vh] sm:max-h-[65vh] overflow-y-auto pr-1 space-y-2 focus:outline-none"
              tabIndex={-1}
            >
              {/* If no query, show popular quick search suggestions */}
              {!query.trim() && (
                <div className="py-2 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span>Popular Searches</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {POPULAR_QUERIES.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          setQuery(item.query);
                          inputRef.current?.focus();
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card/70 px-3 py-1.5 text-xs font-medium text-foreground/90 transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:-translate-y-0.5"
                      >
                        <Search className="h-3 w-3 text-muted-foreground" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">
                      <span>Quick Website Directory</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {results.slice(0, 6).map((item, idx) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          className="group flex flex-col p-2.5 sm:p-3 rounded-xl border border-border/70 bg-card/60 hover:bg-card hover:border-primary/40 hover:shadow-md transition-all cursor-pointer"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span
                              className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold border ${getCategoryBadgeClass(
                                item.category
                              )}`}
                            >
                              {getCategoryIcon(item.category)}
                              <span>{item.category}</span>
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                          </div>
                          <h4 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* If query entered but no matches found */}
              {query.trim() && results.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <div className="h-12 w-12 rounded-full bg-muted/80 flex items-center justify-center text-muted-foreground mb-3">
                    <HelpCircle className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    No results found for &ldquo;{query}&rdquo;
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-md mt-1 mb-4">
                    We couldn&apos;t find any pages, products, or guides matching your query.
                    Try using broader keywords or explore common topics below:
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg">
                    {POPULAR_QUERIES.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          setQuery(p.query);
                          inputRef.current?.focus();
                        }}
                        className="rounded-full border border-border/80 bg-card px-3 py-1 text-xs text-foreground/85 hover:border-primary hover:text-primary transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Search Results List */}
              {query.trim() && results.length > 0 && (
                <div className="space-y-1.5 py-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground px-1 pb-1">
                    <span>
                      Found <strong className="text-foreground">{results.length}</strong> matching{" "}
                      {results.length === 1 ? "result" : "results"}
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px]">
                      <ArrowUpDown className="h-3 w-3" /> Use <kbd className="font-mono bg-muted px-1 rounded">↑</kbd> <kbd className="font-mono bg-muted px-1 rounded">↓</kbd> to navigate, <kbd className="font-mono bg-muted px-1 rounded">↵</kbd> to select
                    </span>
                  </div>

                  {results.map((item, index) => {
                    const isActive = index === activeIndex;
                    return (
                      <div
                        key={item.id}
                        data-search-index={index}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`group relative flex items-start justify-between gap-3 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all duration-150 cursor-pointer ${
                          isActive
                            ? "bg-primary/10 border-primary/50 shadow-md translate-x-0.5"
                            : "bg-card/70 border-border/70 hover:bg-card hover:border-border"
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${getCategoryBadgeClass(
                              item.category
                            )}`}
                          >
                            {getCategoryIcon(item.category)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-0.5">
                              <span
                                className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.2 text-[10px] font-semibold border ${getCategoryBadgeClass(
                                  item.category
                                )}`}
                              >
                                {item.category}
                              </span>
                              {item.badge && item.badge !== item.category && (
                                <span className="inline-flex text-[10px] font-medium text-muted-foreground bg-muted/60 px-1.5 py-0.2 rounded">
                                  {item.badge}
                                </span>
                              )}
                              <span className="text-[11px] text-muted-foreground/70 font-mono hidden sm:inline-block truncate">
                                {item.href}
                              </span>
                            </div>

                            <h4 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                              <HighlightText text={item.title} highlight={debouncedQuery} />
                            </h4>

                            <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-0.5">
                              <HighlightText text={item.description} highlight={debouncedQuery} />
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center shrink-0 self-center pl-2">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all ${
                              isActive
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "border-border/60 text-muted-foreground group-hover:border-primary/50 group-hover:text-primary"
                            }`}
                          >
                            <CornerDownLeft className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer helper bar */}
            <div className="flex items-center justify-between border-t border-border/50 pt-2 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  <span>Public Verified Content</span>
                </span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">SSR Solar Power Mau, UP</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Press</span>
                <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground border border-border">
                  ESC
                </kbd>
                <span>to close</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
