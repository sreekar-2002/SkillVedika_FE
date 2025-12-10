// /* eslint-disable react-hooks/exhaustive-deps */
// "use client";

// import { useState, useEffect, useCallback, useRef } from "react";
// import { AdminCard, AdminInput, AdminTextarea } from "./AdminUI";

// const defaultTitle = "";
// const defaultDesc = "";

// export default function TalentSection({ initial = {}, onChange }) {
//   const isFirstRender = useRef(true);
//   const prevInitialRef = useRef(null);
//   const stateRef = useRef(null);
//   const buildInitialPoints = (initialData) => {
//     // Accept either an array or an object (e.g. keyed by index) and coerce to an array
//     let incoming = Array.isArray(initialData?.points)
//       ? [...initialData.points]
//       : initialData?.points
//       ? Object.values(initialData.points)
//       : [];
//     // Ensure it's always an array
//     if (!Array.isArray(incoming)) {
//       incoming = [];
//     }
//     // Return only the points provided by initial data, no defaults
//     return incoming;
//   };

//   const [state, setState] = useState(() => ({
//     title: initial?.title ?? defaultTitle,
//     desc: initial?.description ?? defaultDesc,
//     points: buildInitialPoints(initial),
//   }));

//   // keep a ref of the current state for synchronous comparisons in effects
//   useEffect(() => {
//     stateRef.current = state;
//   }, [state]);

//   const { title, desc, points } = state;

//   // Sync from initial prop - only when initial data changes from API
//   useEffect(() => {
//     // Only update if initial data actually changed (by reference)
//     if (!(initial && Object.keys(initial).length > 0)) return;
//     if (initial === prevInitialRef.current) return;
//     prevInitialRef.current = initial;

//     const newPoints = buildInitialPoints(initial);
//     const newState = {
//       title: initial.title ?? defaultTitle,
//       desc: initial.description ?? defaultDesc,
//       points: Array.isArray(newPoints) ? newPoints : [],
//     };

//     // If the derived state equals the current local state, skip any setState calls entirely
//     try {
//       if (JSON.stringify(stateRef.current) === JSON.stringify(newState)) {
//         return;
//       }
//     } catch {
//       // fall through to setState if compare fails
//     }

//     setState(newState);
//   }, [initial]);

//   // Call onChange only if user edited (not during initial hydration)
//   useEffect(() => {
//     if (isFirstRender.current) {
//       isFirstRender.current = false;
//       return;
//     }
//     if (onChange) {
//       onChange({ title, desc, points });
//     }
//   }, [title, desc, points]);

//   const setTitle = useCallback((value) => setState((prev) => ({ ...prev, title: value })), []);
//   const setDesc = useCallback((value) => setState((prev) => ({ ...prev, desc: value })), []);

//   // Note: points editing UI was removed in a recent change. Keep `points` in state
//   // for payload compatibility, but there is no local updatePoint handler required
//   // while the simple demo editor only supports editing title/desc.

//   return (
//     <AdminCard title="Talent Development Section">
//       <AdminInput
//         label="Title*"
//         value={title}
//         onChange={setTitle}
//       />

//       <AdminTextarea
//         label="Description*"
//         value={desc}
//         onChange={setDesc}
//         rows={4}
//       />

      
//     </AdminCard>
//   );
// }

/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { AdminCard, AdminInput, AdminTextarea } from "./AdminUI";

export default function TalentSection({ initial = {}, onChange }) {

  // Local editable state — DOES NOT get reset on parent re-render
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [points, setPoints] = useState([]);

  // Hydrate ONLY when backend data first loads
  useEffect(() => {
    if (!initial || Object.keys(initial).length === 0) return;

    setTitle(initial.title ?? "");
    setDesc(initial.description ?? "");
    setPoints(Array.isArray(initial.points) ? initial.points : []);

  }, [initial]);

  // Notify parent when local state changes
  useEffect(() => {
    if (onChange) {
      onChange({ title, desc, points });
    }
  }, [title, desc, points]);

  return (
    <AdminCard title="Talent Development Section">

      <AdminInput
        label="Title*"
        value={title}
        onChange={setTitle}
      />

      <AdminTextarea
        label="Description*"
        value={desc}
        onChange={setDesc}
        rows={4}
      />

    </AdminCard>
  );
}
