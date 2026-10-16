'use client';

import { useLayoutEffect } from 'react';

export function GoalPrefill() {
  useLayoutEffect(() => {
    const goal = new URLSearchParams(window.location.search).get('goal');
    if (!goal) return;
    const sel = document.getElementById('goal');
    if (!sel) return;
    if ([...sel.options].some((o) => o.value === goal)) sel.value = goal;
  }, []);
  return null;
}
