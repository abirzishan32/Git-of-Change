import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import { getErrorMessage } from '../lib/errors';

/**
 * Loads JSON from the API and re-fetches whenever the URL or params change.
 * Previous data is kept while a new request is in flight, so paginated
 * tables don't flash empty between pages.
 */
export function useApiQuery(url, { params } = {}) {
  const paramsKey = JSON.stringify(params ?? {});
  const [reloadCount, setReloadCount] = useState(0);
  const requestKey = `${url}|${paramsKey}|${reloadCount}`;

  const [result, setResult] = useState({ key: null, data: undefined, error: null });

  useEffect(() => {
    const controller = new AbortController();

    api
      .get(url, { params: JSON.parse(paramsKey), signal: controller.signal })
      .then((res) => setResult({ key: requestKey, data: res.data, error: null }))
      .catch((err) => {
        if (controller.signal.aborted) return;
        setResult((previous) => ({
          key: requestKey,
          data: previous.data,
          error: getErrorMessage(err),
        }));
      });

    return () => controller.abort();
  }, [url, paramsKey, requestKey]);

  const refetch = useCallback(() => setReloadCount((count) => count + 1), []);

  return {
    data: result.data,
    error: result.key === requestKey ? result.error : null,
    isLoading: result.key !== requestKey,
    refetch,
  };
}
