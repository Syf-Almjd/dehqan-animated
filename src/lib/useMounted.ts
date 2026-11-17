import { useSyncExternalStore } from "react";
const noop = () => () => {};
/** false during SSR/hydration, true afterwards – avoids hydration mismatches for persisted client state. */
export const useMounted = () => useSyncExternalStore(noop, () => true, () => false);
