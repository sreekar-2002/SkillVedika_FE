/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AdminCard, AdminInput, AdminTextarea } from "./AdminUI";

export default function PortfolioSection({ initial = {}, onChange }) {
  const isFirstRender = useRef(true);
  const prevInitialRef = useRef(null);
  const defaultTitle = "";
  const defaultDesc = "";

  const buildInitialList = (initialData) => {
    let incoming = Array.isArray(initialData?.items) ? [...initialData.items] : [];
    // If items is an object (keyed by index), convert to array
    if (!Array.isArray(incoming) && incoming && typeof incoming === 'object') {
      incoming = Object.values(incoming);
    }
    // Return only the items provided by initial data, no defaults
    return incoming;
  };

  // Extract title as a string (handle both string and object formats)
  const extractTitle = (titleData) => {
    if (typeof titleData === 'string') return titleData;
    if (titleData && typeof titleData === 'object') return titleData.text || titleData.title || "";
    return "";
  };

  const [state, setState] = useState(() => ({
    title: extractTitle(initial?.title) || defaultTitle,
    desc: initial?.description ?? defaultDesc,
    list: buildInitialList(initial),
  }));

  const { title, desc, list } = state;

  useEffect(() => {
    // Only update if initial data actually changed (by reference)
    if (initial && initial !== prevInitialRef.current && Object.keys(initial).length > 0) {
      prevInitialRef.current = initial;
      const newList = buildInitialList(initial);
      const newState = {
        title: extractTitle(initial?.title) || defaultTitle,
        desc: initial.description ?? defaultDesc,
        list: newList,
      };
      // Only update local state when the derived newState actually differs
      setState((prev) => {
        try {
          if (JSON.stringify(prev) === JSON.stringify(newState)) return prev;
        } catch {
          // fallback: if stringify fails for some reason, fall through to update
        }
        return newState;
      });
    }
  }, [initial]);

  // Call onChange only on user edits, not on initial hydration
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (onChange) {
      onChange({ title, description: desc, items: list });
    }
  }, [title, desc, list]);

  const setTitle = useCallback((value) => setState((prev) => ({ ...prev, title: value })), []);
  const setDesc = useCallback((value) => setState((prev) => ({ ...prev, desc: value })), []);

  const updateItem = useCallback((idx, field, value) => {
    setState((prev) => {
      const newList = Array.isArray(prev.list) ? [...prev.list] : [];
      newList[idx] = { ...newList[idx], [field]: value };
      return { ...prev, list: newList };
    });
  }, []);

  return (
    <AdminCard title="Portfolio Section">
      <AdminInput
        label="Portfolio Title*"
        value={title}
        onChange={setTitle}
      />
      <AdminTextarea
        label="Portfolio Description*"
        value={desc}
        onChange={setDesc}
        rows={4}
      />

      {list.map((item, idx) => (
        <AdminCard key={idx} title={`Portfolio Training ${idx + 1}`}>
          <AdminInput
            label="Label*"
            value={item.label}
            onChange={(v) => updateItem(idx, "label", v)}
          />
          <AdminTextarea
            label="Description*"
            value={item.description}
            onChange={(v) => updateItem(idx, "description", v)}
            rows={4}
          />
        </AdminCard>
      ))}
    </AdminCard>
  );
}
