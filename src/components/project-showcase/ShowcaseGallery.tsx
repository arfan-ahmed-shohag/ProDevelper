"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useShowcaseData } from "@/lib/use-showcase-data";
import { requestShowcaseFilters } from "@/lib/showcase-client";
import { readCachedPages, writeCachedPage } from "@/lib/indexed-page-cache";
import { Collapse } from "@/components/Collapse";
import SelectedWorkCard from "@/components/home/SelectedWorkCard";
import { SelectedWorksGrid } from "@/components/home/SelectedWorksGrid";
import {
  parseShowcaseFilters,
  serializeShowcaseFilterIds,
  serializeShowcaseFilters,
  type ShowcaseSelection,
} from "@/lib/project-showcase";
import type {
  ProjectResponse,
  ShowcaseKind,
  ShowcaseFilterGroup,
  ShowcaseFilterData,
} from "@/services/projects";
import { ShowcaseCardSkeleton } from "./ShowcaseGallerySkeleton";

function isFilterData(data: unknown): data is ShowcaseFilterData {
  if (!data || typeof data !== "object") return false;
  const value = data as ShowcaseFilterData;
  return Boolean(value.demoTagNames) && typeof value.demoTagNames === "object" &&
    Object.values(value.demoTagNames).every(name => typeof name === "string") &&
    Array.isArray(value.groups) && value.groups.every(group =>
    ["industry-type", "functionality"].includes(group.taxonomy) && Array.isArray(group.options) &&
    group.options.every(option => Number.isInteger(option.id) && typeof option.slug === "string" && typeof option.label === "string" &&
      (option.count == null || (Number.isFinite(option.count) && option.count >= 0))));
}

type ShowcaseGalleryProps = {
  kind: ShowcaseKind;
  groups: ShowcaseFilterGroup[];
  demoTagNames?: Record<number, string>;
  initialFiltersComplete?: boolean;
  initialProjects: ProjectResponse[];
  initialTotal: number;
  initialTotalPages: number;
  initialRefreshedAt: number;
  initialError?: string;
  initialSearch?: string;
  initialSelected?: ShowcaseSelection[];
};

export default function ShowcaseGallery({
  kind,
  groups,
  demoTagNames: initialDemoTagNames = {},
  initialFiltersComplete = false,
  initialProjects,
  initialTotal,
  initialTotalPages,
  initialRefreshedAt,
  initialError = "",
  initialSearch = "",
  initialSelected = [],
}: ShowcaseGalleryProps) {
  const [filterGroups, setFilterGroups] = useState(groups);
  const filterGroupsRef = useRef(groups);
  const [demoTagNames, setDemoTagNames] = useState(initialDemoTagNames);
  const [search, setSearch] = useState(initialSearch);
  const [appliedSearch, setAppliedSearch] = useState(initialSearch);
  const [filtersReady, setFiltersReady] = useState(initialFiltersComplete);
  const [filterError, setFilterError] = useState("");
  const [selected, setSelected] = useState(initialSelected);
  const selectedRef = useRef(initialSelected);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastUrlQuery = useRef("");
  const { projects, total, totalPages, currentPage, loading, loadingMore, error, offline, loadResults: loadData } = useShowcaseData(kind, {
    projects: initialProjects, total: initialTotal, totalPages: initialTotalPages, refreshedAt: initialRefreshedAt,
  }, initialError, { search: initialSearch, filters: serializeShowcaseFilterIds(initialSelected) });
  const loadResults = useCallback((query: string, selection: ShowcaseSelection[], page: number, append: boolean) =>
    loadData(query, serializeShowcaseFilterIds(selection), page, append), [loadData]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterButtonShown, setFilterButtonShown] = useState(true);
  const [openGroups, setOpenGroups] = useState(() =>
    groups.map((group) => group.taxonomy),
  );

  const updateUrl = (query: string, selection: ShowcaseSelection[]) => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    const filters = serializeShowcaseFilters(selection);
    if (filters) params.set("filters", filters);
    const nextUrl =
      window.location.pathname +
      (params.size ? `?${params.toString()}` : "") +
      window.location.hash;
    if (nextUrl !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.pushState(null, "", nextUrl);
    }
  };

  const commit = (query: string, selection: ShowcaseSelection[]) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    setSearch(query);
    setAppliedSearch(query);
    setSelected(selection);
    selectedRef.current = selection;
    lastUrlQuery.current = JSON.stringify([query, serializeShowcaseFilterIds(selection)]);
    updateUrl(query, selection);
    void loadResults(query, selection, 1, false);
  };

  const toggleFilter = (option: ShowcaseSelection) => {
    const next = selectedRef.current.some(
      (item) => item.taxonomy === option.taxonomy && item.id === option.id,
    )
      ? selectedRef.current.filter(
          (item) => !(item.taxonomy === option.taxonomy && item.id === option.id),
        )
      : [...selectedRef.current, option];
    commit(search, next);
  };

  useEffect(() => {
    let previousScroll = window.scrollY;
    const scroll = () => {
      const currentScroll = window.scrollY;
      setFilterButtonShown(!(currentScroll > previousScroll && currentScroll > 100));
      previousScroll = currentScroll;
    };
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);

  useEffect(() => {
    if (!filtersOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.dispatchEvent(new CustomEvent("site-menu", { detail: true }));
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.dispatchEvent(new CustomEvent("site-menu", { detail: false }));
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [filtersOpen]);

  useEffect(() => {
    const syncFromUrl = () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
      const params = new URLSearchParams(window.location.search);
      const query = params.get("search") || "";
      const filters = params.get("filters") || "";
      // Slug-based URLs must wait for the dictionary; never send an unfiltered
      // request first and accidentally replace the selected combination.
      if (filters && !filtersReady) return;
      const nextSelection = parseShowcaseFilters(filters, filterGroupsRef.current);
      setSearch(query);
      setAppliedSearch(query);
      setSelected(nextSelection);
      selectedRef.current = nextSelection;
      const signature = JSON.stringify([query, serializeShowcaseFilterIds(nextSelection)]);
      if (lastUrlQuery.current === signature) return;
      lastUrlQuery.current = signature;
      void loadResults(query, nextSelection, 1, false);
    };
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [filtersReady, filterGroups, loadResults]);

  useEffect(() => {
    const controller = new AbortController();
    const scope = `filters:${kind}`;
    const apply = (data: ShowcaseFilterData) => {
      if (controller.signal.aborted) return;
      filterGroupsRef.current = data.groups;
      setFilterGroups(current => JSON.stringify(current) === JSON.stringify(data.groups) ? current : data.groups);
      setDemoTagNames(current => JSON.stringify(current) === JSON.stringify(data.demoTagNames) ? current : data.demoTagNames);
      setOpenGroups(current => current.length ? current : data.groups.map(group => group.taxonomy));
      setFiltersReady(true);
      setFilterError("");
    };
    const refresh = async () => {
      const cached = await readCachedPages(scope, isFilterData);
      if (controller.signal.aborted) return;
      if (cached[0]) {
        apply(cached[0].data);
        return;
      }
      try {
        const data = await requestShowcaseFilters(kind, controller.signal);
        if (!isFilterData(data)) throw new Error("Invalid filters");
        apply(data);
        void writeCachedPage(scope, 1, data, Date.now());
      } catch {
        if (!controller.signal.aborted && !cached.length && !initialFiltersComplete) setFilterError("Filters are temporarily unavailable. Reconnect or reload to try again.");
      }
    };
    void refresh();
    return () => controller.abort();
  }, [kind, initialFiltersComplete]);

  useEffect(() => () => {
    lastUrlQuery.current = "";
    if (searchTimer.current) clearTimeout(searchTimer.current);
  }, []);

  const tags = selected.map((item) => (
    <button
      type="button"
      key={`${item.taxonomy}:${item.id}`}
      onClick={() => toggleFilter(item)}
      aria-label={`Remove ${item.label} filter`}
      className="remove-tag flex items-center gap-2 rounded-full bg-brand-light px-4 py-2 text-[10px] font-bold uppercase text-white transition-transform hover:scale-105"
    >
      {item.label}
      <span className="text-xs" aria-hidden="true">×</span>
    </button>
  ));

  const reset = () => commit("", []);

  return (
    <section
      id="portfolio"
      className="relative w-full bg-white px-4 py-16 md:py-24 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(var(--rgb-brand-dark)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--rgb-brand-dark)) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div className="absolute right-0 top-0 h-150 w-150 rounded-full bg-brand-green/5 blur-[120px]" />
        <div className="absolute inset-0">
          <div className="absolute left-[-5%] top-[-10%] h-[40%] w-[30%] rounded-full bg-brand-dark/5 blur-[120px]" />
          <div className="absolute right-[-5%] top-[20%] h-[35%] w-[25%] rounded-full bg-brand-dark/5 blur-[100px]" />
        </div>
      </div>

      <div className="fixed left-0 top-1/2 z-99999 -translate-y-1/2 lg:hidden">
        <button
          id="openFilterMobile"
          type="button"
          aria-label="Open filters"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen(true)}
          className={`relative flex items-center justify-center rounded-r-2xl border-y border-r border-white/20 bg-slate-900 p-4 text-white shadow-2xl ${filterButtonShown ? "active-show" : ""}`}
        >
          <svg className="h-6 w-6 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          {selected.length > 0 && (
            <span id="mobileCountBadge" className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-900 bg-brand-light text-[10px] font-bold text-slate-900">
              {selected.length}
            </span>
          )}
        </button>
      </div>

      <div className="relative mx-auto max-w-[1600px]">
        <div className="mb-32 flex flex-col items-center text-center">
          <span className="mb-8 block text-[10px] font-bold uppercase tracking-[0.6em] text-brand-dark opacity-80">
            Showcase
          </span>
          <h2 className="mb-4 text-7xl font-black leading-[0.85] tracking-tighter text-slate-900 md:text-9xl">
            Selected
            <br />
            <span className="outline-heading">Works.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-lg font-medium leading-relaxed text-slate-500 md:text-xl">
            Explore our finest digital experiences crafted with precision,
            innovation, and strategic execution.
          </p>
        </div>

        <div className="flex flex-col gap-12 lg:flex-row">
          <aside
            id="filterSidebar"
            aria-label={`${kind === "demos" ? "Demo" : "Project"} filters`}
            className={`w-full lg:w-1/4 ${filtersOpen ? "visible active" : ""}`}
          >
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              tabIndex={-1}
              aria-label="Close filter backdrop"
              className="close-drawer absolute inset-0 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <div id="sidebarInner" className="lg:rounded-[2.5rem] lg:border lg:border-slate-100 lg:bg-white lg:p-6 lg:shadow-2xl lg:shadow-slate-200/50">
              <div className="flex items-center justify-between border-b border-slate-50 p-6 lg:mb-6 lg:border-0 lg:p-0 lg:pb-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Filters</h3>
                {(search || selected.length > 0) && (
                  <button
                    id="projectReset"
                    type="button"
                    onClick={reset}
                    className="rounded-lg bg-red-50 px-3 py-1.5 text-[10px] font-bold uppercase text-red-500 transition-all hover:bg-red-500 hover:text-white"
                  >
                    <span aria-hidden="true">× </span>Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Close filters"
                  className="close-drawer rounded-full bg-slate-100 p-2 lg:hidden"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" />
                  </svg>
                </button>
              </div>

              <div id="sidebar-scroll-area" className="custom-scrollbar" data-lenis-prevent>
                <div className="relative mb-8 px-1">
                  <input
                    id="searchInput"
                    maxLength={200}
                    type="text"
                    aria-label={`Search ${kind === "demos" ? "demos" : "projects"}`}
                    value={search}
                    onChange={(event) => {
                      const value = event.currentTarget.value;
                      setSearch(value);
                      if (searchTimer.current) clearTimeout(searchTimer.current);
                      searchTimer.current = setTimeout(() => {
                        searchTimer.current = null;
                        commit(value, selectedRef.current);
                      }, 500);
                    }}
                    placeholder={`Search ${kind === "demos" ? "demos" : "projects"}...`}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 pl-12 text-sm font-bold text-black transition-all placeholder:text-slate-400 focus:border-brand-light focus:outline-none focus:ring-2 focus:ring-brand-light/20"
                  />
                  <svg className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" />
                  </svg>
                </div>

                <div id="mobile-sidebar-tags" className="mb-4 flex flex-wrap gap-2 lg:hidden">
                  {tags}
                </div>

                {filterError && <p role="status" className="mb-4 text-xs text-slate-500">{filterError}</p>}
                <div id="filter-container" className="space-y-4 px-1">
            {filterGroups.map((group) => {
                    const expanded = openGroups.includes(group.taxonomy);
                    const menuId = `filter-${group.taxonomy}`;
                    return (
                      <div key={group.taxonomy} className="category-dropdown-group">
                        <button
                          type="button"
                          aria-expanded={expanded}
                          aria-controls={menuId}
                          onClick={() =>
                            setOpenGroups((current) =>
                              expanded
                                ? current.filter((item) => item !== group.taxonomy)
                                : [...current, group.taxonomy],
                            )
                          }
                          className="dropdown-trigger flex w-full items-center justify-between rounded-2xl border border-transparent bg-slate-50 p-4 text-xs font-bold text-slate-700 transition-all hover:border-slate-200 hover:bg-slate-100"
                        >
                          <span>{group.name}</span>
                          <svg className={`arrow-icon h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="m6 9 6 6 6-6" strokeWidth="3" />
                          </svg>
                        </button>
                        <Collapse open={expanded} id={menuId}>
                          <div className="sub-menu custom-scrollbar mt-2 ml-2 max-h-80 space-y-1 overflow-y-auto pr-2" data-lenis-prevent>
                            {group.options.map((option) => {
                              const checked = selected.some(
                                (item) => item.taxonomy === group.taxonomy && item.id === option.id,
                              );
                              return (
                                <button
                                  type="button"
                                  key={option.id}
                                  data-cat={option.id}
                                  data-taxonomy={group.taxonomy}
                                  aria-pressed={checked}
                                  onClick={() => toggleFilter({ ...option, taxonomy: group.taxonomy })}
                                  className={`filter-item group flex w-full items-center justify-between rounded-xl p-3 text-left text-[11px] font-bold transition-all hover:bg-brand-light hover:text-white ${checked ? "active bg-brand-light text-white shadow-lg" : "text-slate-500"}`}
                                >
                                  <span className="flex items-center gap-3">
                                    <span className="flex h-4 w-4 items-center justify-center rounded-md border border-slate-200 bg-white group-[.active]:border-white">
                                      {checked && (
                                        <svg className="h-2.5 w-2.5 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path d="m5 13 4 4L19 7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                      )}
                                    </span>
                                    {option.label}
                                  </span>
                                  <span className="font-normal opacity-40">{option.count}</span>
                                </button>
                              );
                            })}
                          </div>
                        </Collapse>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-auto border-t border-slate-50 p-6 lg:hidden">
                <button
                  id="applyFilters"
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="w-full rounded-xl bg-slate-900 py-4 text-[10px] font-bold uppercase tracking-widest text-white shadow-xl"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>

          <div className="min-w-0 w-full lg:w-3/4">
            <div className={`mb-12 flex flex-col gap-6 border-b border-slate-100 pb-6 md:flex-row md:items-center ${selected.length ? "justify-between" : "justify-end"}`}>
              <div id="active-filter-tags" className={`${selected.length ? "hidden lg:flex" : "hidden"} flex-wrap gap-2`}>
                {tags}
              </div>
              <div className="shrink-0">
                <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-3 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-light opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-light" />
                  </span>
                  <span role="status" className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Result: <span id="total-count-display" className="ml-1 text-slate-900">{total}</span> {kind === "demos" ? "Demos" : "Projects"}
                  </span>
                </div>
              </div>
            </div>

            <SelectedWorksGrid
              id="project-grid-container"
              refreshKey={projects.map((project) => project.id).join(",")}
              className="grid min-h-125 grid-cols-1 gap-8 md:grid-cols-2"
            >
              {loading && !loadingMore
                ? Array.from({ length: 10 }, (_, index) => <ShowcaseCardSkeleton key={`loading-${index}`} />)
                : projects.map((project, index) => (
                    <article
                      key={project.id}
                      className="content-enter"
                      style={{ animationDelay: `${(index % 10) * 0.1}s` }}
                    >
                      <SelectedWorkCard
                        project={project}
                        variant="showcase"
                        demoTagNames={demoTagNames}
                      />
                    </article>
                  ))}
              {loadingMore && Array.from({ length: 10 }, (_, index) => <ShowcaseCardSkeleton key={`more-${index}`} />)}
            </SelectedWorksGrid>

            {offline && <p role="status" className="mt-6 text-sm text-slate-500">You are offline. Showing saved work.</p>}
            {error ? (
              <div role="alert" className="rounded-3xl bg-slate-50 p-12 text-center text-slate-500">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => void loadResults(appliedSearch, selected, 1, false)}
                  className="mt-4 font-bold text-brand-light underline"
                >
                  Try again
                </button>
              </div>
            ) : !loading && projects.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-12 text-center text-slate-500">
                <p>No matching work found.</p>
                <button type="button" onClick={reset} className="mt-4 font-bold text-brand-light underline">
                  Clear filters
                </button>
              </div>
            ) : null}

            {!loading && currentPage < totalPages && (
              <div id="loadMoreContainer" className="mt-20 text-center">
                <button
                  id="load-more-btn"
                  type="button"
                  disabled={loadingMore}
                  onClick={() => void loadResults(appliedSearch, selected, currentPage + 1, true)}
                  className="group inline-flex items-center gap-4 rounded-2xl bg-slate-900 px-12 py-5 text-xs font-black uppercase tracking-widest text-white shadow-2xl transition-all hover:bg-brand-light hover:text-slate-900 disabled:opacity-60"
                >
                  <span className="btn-text">Load More Work</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
