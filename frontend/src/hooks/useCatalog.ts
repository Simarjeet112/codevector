import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { fetchCategories, fetchProducts } from '@/lib/api';
import type { CatalogCategory, CatalogViewMode, Product } from '@/lib/types';

const PAGE_SIZE = 50;
const INITIAL_PAGES = 2;
const ALL_CATEGORY = 'All';

function parsePrice(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function useCatalog() {
  const [category, setCategory] = useState<CatalogCategory>('All');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<CatalogViewMode>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const [sentinelNode, setSentinelNode] = useState<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());

  const hydrate = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    console.log('[catalog] hydrate start', { category });
    setLoadingInitial(true);
    setLoadingMore(false);
    setError(null);
    setProducts([]);
    setNextCursor(null);

    try {
      const backendCategory = category === ALL_CATEGORY ? undefined : category;
      let cursor: string | null = null;
      const loaded: Product[] = [];

      for (let page = 0; page < INITIAL_PAGES; page += 1) {
        const response = await fetchProducts({
          category: backendCategory,
          cursor,
          limit: PAGE_SIZE,
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        loaded.push(...response.data);
        cursor = response.next_cursor;
        setProducts([...loaded]);
        setNextCursor(cursor);

        console.log('[catalog] hydrate page', {
          page,
          loaded: loaded.length,
          nextCursor: cursor,
        });

        if (!cursor) {
          break;
        }
      }

      setLastSyncedAt(new Date().toISOString());
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoadingInitial(false);
      }
    }
  }, [category]);

  const loadMore = useCallback(async () => {
    if (loadingInitial || loadingMore || !nextCursor) {
      console.log('[catalog] loadMore skipped', {
        loadingInitial,
        loadingMore,
        hasNextCursor: Boolean(nextCursor),
      });
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    console.log('[catalog] loadMore start', { nextCursor, category });
    setLoadingMore(true);
    setError(null);

    try {
      const response = await fetchProducts({
        category: category === ALL_CATEGORY ? undefined : category,
        cursor: nextCursor,
        limit: PAGE_SIZE,
        signal: controller.signal,
      });

      if (controller.signal.aborted) {
        return;
      }

      setProducts((current) => [...current, ...response.data]);
      setNextCursor(response.next_cursor);
      setLastSyncedAt(new Date().toISOString());

      console.log('[catalog] loadMore success', {
        appended: response.data.length,
        nextCursor: response.next_cursor,
      });
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err instanceof Error ? err.message : 'Failed to fetch more products');
        console.error('[catalog] loadMore failed', err);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoadingMore(false);
      }
    }
  }, [category, loadingInitial, loadingMore, nextCursor]);

  useEffect(() => {
    const controller = new AbortController();

    void fetchCategories(controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) {
          setCategories(items);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to load categories');
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    void hydrate();

    return () => {
      abortRef.current?.abort();
    };
  }, [hydrate]);

  useEffect(() => {
    if (!sentinelNode) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        console.log('[catalog] observer', {
          isIntersecting: Boolean(entry?.isIntersecting),
          ratio: entry?.intersectionRatio,
          loadingInitial,
          loadingMore,
          hasNextCursor: Boolean(nextCursor),
        });

        if (entry?.isIntersecting) {
          void loadMore();
        }
      },
      {
        rootMargin: '600px 0px',
        threshold: 0,
      }
    );

    observer.observe(sentinelNode);

    return () => observer.disconnect();
  }, [loadMore, loadingInitial, loadingMore, nextCursor, sentinelNode]);

  const filteredProducts = useMemo(() => {
    if (!deferredSearch) {
      return products;
    }

    return products.filter((product) => {
      const haystack = `${product.name} ${product.category} ${product.id}`.toLowerCase();
      return haystack.includes(deferredSearch);
    });
  }, [deferredSearch, products]);

  const averagePrice = useMemo(() => {
    if (products.length === 0) {
      return 0;
    }

    return products.reduce((sum, product) => sum + parsePrice(product.price), 0) / products.length;
  }, [products]);

  const maxPrice = useMemo(() => {
    if (products.length === 0) {
      return 0;
    }

    return Math.max(...products.map((product) => parsePrice(product.price)));
  }, [products]);

  const categoryBreakdown = useMemo(() => {
    const counts = products.reduce<Record<string, number>>((accumulator, product) => {
      accumulator[product.category] = (accumulator[product.category] ?? 0) + 1;
      return accumulator;
    }, {});

    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((left, right) => right.value - left.value);
  }, [products]);

  const priceTrail = useMemo(() => products.slice(0, 14).map((product) => parsePrice(product.price)), [products]);

  return {
    categories: [ALL_CATEGORY, ...categories],
    category,
    setCategory,
    search,
    setSearch,
    viewMode,
    setViewMode,
    products,
    filteredProducts,
    loadingInitial,
    loadingMore,
    isLoading: loadingInitial,
    error,
    retry: () => void hydrate(),
    loadMore,
    nextCursor,
    sentinelRef: setSentinelNode,
    lastSyncedAt,
    averagePrice,
    maxPrice,
    categoryBreakdown,
    priceTrail,
  };
}
