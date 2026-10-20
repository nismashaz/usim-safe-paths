import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useMemo, useState } from "react";
import { CATEGORIES, STATUSES, countByStatus, filterReports, initialReports, type Category, type Report, type Status } from "@/lib/hazards";

const HazardMap = lazy(() => import("@/components/HazardMap"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SafeTown — USIM Campus Safety Map" },
      { name: "description", content: "Prototype campus hazard reporting map for USIM Nilai." },
      { property: "og:title", content: "SafeTown — USIM Campus Safety Map" },
      { property: "og:description", content: "Prototype campus hazard reporting map for USIM Nilai." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [reports, setReports] = useState<Report[]>(() => initialReports());
  const [cat, setCat] = useState<Category | "all">("all");
  const [status, setStatus] = useState<Status | "all">("all");
  const [focus, setFocus] = useState<{ id: string; n: number } | null>(null);
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<[number, number] | null>(null);
  const [toast, setToast] = useState("");

  const visible = useMemo(() => filterReports(reports, cat, status), [reports, cat, status]);
  const counts = countByStatus(reports);
  const sorted = [...visible].sort((a, b) => b.date.localeCompare(a.date));

  const updateStatus = (id: string, s: Status) => setReports((rs) => rs.map((r) => (r.id === id ? { ...r, status: s } : r)));
  const focusOn = (id: string) => setFocus((f) => ({ id, n: (f?.n ?? 0) + 1 }));

  const submit = (r: Report) => {
    setReports((rs) => [r, ...rs]);
    setOpen(false);
    setPicked(null);
    setCat("all");
    setStatus("all");
    setToast("Report submitted with Pending status. Click its marker or card to view it.");
    setTimeout(() => setToast(""), 4000);
    setTimeout(() => focusOn(r.id), 100);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest opacity-80">SafeTown · Township of Tomorrow</div>
            <h1 className="text-2xl font-bold">USIM Campus Safety Map</h1>
            <p className="text-sm opacity-80">Campus hazard reporting prototype</p>
          </div>
          <button onClick={() => { setOpen(true); setPicked(null); }} className="btn-action">+ Report a Hazard</button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-4 px-4 py-5">
        <div className="rounded-xl border border-border bg-muted px-4 py-2 text-xs text-muted-foreground">
          All sample reports are <b>fictional demonstration data</b>, not real incidents. Reports and status changes are kept only in this browser tab and reset when you refresh the page.
        </div>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Total demo reports" value={counts.total} tone="total" />
          <Stat label="Pending" value={counts.Pending} tone="pending" />
          <Stat label="Verified" value={counts.Verified} tone="verified" />
          <Stat label="Resolved" value={counts.Resolved} tone="resolved" />
        </section>

        <section className="flex flex-wrap items-end gap-3 rounded-xl bg-card p-3 shadow-sm">
          <label className="text-sm">
            <span className="mb-1 block font-medium">Category</span>
            <select className="field" value={cat} onChange={(e) => setCat(e.target.value as Category | "all")}>
              <option value="all">All categories</option>
              {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Status</span>
            <select className="field" value={status} onChange={(e) => setStatus(e.target.value as Status | "all")}>
              <option value="all">All statuses</option>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <button className="btn-ghost" onClick={() => { setCat("all"); setStatus("all"); }}>Show all reports</button>
          <span className="ml-auto text-sm text-muted-foreground">Showing {visible.length} of {reports.length}</span>
        </section>

        <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
          <div className="relative h-[55vh] min-h-[360px] overflow-hidden rounded-xl shadow-md lg:h-[640px]">
            {open && <div className="absolute left-1/2 top-3 z-[500] -translate-x-1/2 rounded-full bg-primary px-4 py-1.5 text-xs text-primary-foreground shadow">Click the map to set the hazard location</div>}
            <ClientOnly fallback={<div className="h-full w-full animate-pulse bg-muted" />}>
              <Suspense fallback={<div className="h-full w-full animate-pulse bg-muted" />}>
                <HazardMap reports={visible} focus={focus} picking={open} picked={picked} onPick={(a, b) => setPicked([a, b])} />
              </Suspense>
            </ClientOnly>
            <Legend />
          </div>

          <aside className="flex flex-col rounded-xl bg-card shadow-sm lg:h-[640px]">
            <h2 className="border-b border-border px-4 py-3 font-semibold">Recent reports</h2>
            <div className="flex-1 space-y-3 overflow-y-auto p-3">
              {sorted.length === 0 && <p className="p-4 text-center text-sm text-muted-foreground">No reports match these filters.</p>}
              {sorted.map((r) => (
                <article key={r.id} onClick={() => focusOn(r.id)} className="cursor-pointer rounded-lg border border-border p-3 transition hover:border-secondary hover:shadow-md">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs font-medium text-muted-foreground">{CATEGORIES[r.category].icon} {CATEGORIES[r.category].label}</div>
                    <span className={`status-badge status-${r.status.toLowerCase()}`}>{r.status}</span>
                  </div>
                  <h3 className="mt-1 font-semibold">{r.title}</h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{r.description}</p>
                  <div className="mt-2 text-xs text-muted-foreground">📅 {r.date} · 📍 {r.locationText}</div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    {r.demo ? <span className="demo-tag">Demonstration Data</span> : <span className="demo-tag">New (this session)</span>}
                    <select className="field py-1 text-xs" value={r.status} onClick={(e) => e.stopPropagation()} onChange={(e) => updateStatus(r.id, e.target.value as Status)} aria-label="Update status">
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </main>

      {open && <ReportForm picked={picked} onCancel={() => { setOpen(false); setPicked(null); }} onSubmit={submit} />}
      {toast && <div className="fixed bottom-4 left-1/2 z-[1000] -translate-x-1/2 rounded-lg bg-secondary px-4 py-3 text-sm text-secondary-foreground shadow-lg">✓ {toast}</div>}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={`stat-card stat-${tone}`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
    </div>
  );
}

function Legend() {
  return (
    <div className="absolute bottom-6 left-2 z-[500] rounded-lg bg-card/95 p-2 text-xs shadow">
      {Object.entries(CATEGORIES).map(([k, v]) => (
        <div key={k} className="flex items-center gap-2 py-0.5"><span className={`hz-dot hz-${k}`} />{v.label}</div>
      ))}
      <div className="mt-1 border-t border-border pt-1 text-muted-foreground">- - Approx. prototype boundary</div>
    </div>
  );
}

function ReportForm({ picked, onCancel, onSubmit }: { picked: [number, number] | null; onCancel: () => void; onSubmit: (r: Report) => void }) {
  const [category, setCategory] = useState<Category | "">("");
  const [desc, setDesc] = useState("");
  const [loc, setLoc] = useState("");
  const [photo, setPhoto] = useState<string>();
  const [err, setErr] = useState<string[]>([]);

  const go = () => {
    const e: string[] = [];
    if (!category) e.push("Choose a hazard category.");
    if (desc.trim().length < 5) e.push("Add a description (at least 5 characters).");
    if (!picked) e.push("Click the map to set the location.");
    setErr(e);
    if (e.length || !category || !picked) return;
    onSubmit({
      id: `u${Date.now()}`, title: CATEGORIES[category].label, category, description: desc.trim(),
      date: new Date().toISOString().slice(0, 10), status: "Pending", lat: picked[0], lng: picked[1],
      locationText: loc.trim() || `${picked[0].toFixed(5)}, ${picked[1].toFixed(5)}`, demo: false, ...(photo ? { photo } : {}),
    });
  };

  return (
    <div className="fixed bottom-0 right-0 z-[900] max-h-[70vh] w-full overflow-y-auto rounded-t-2xl bg-card p-5 shadow-2xl sm:bottom-4 sm:right-4 sm:w-96 sm:rounded-2xl">
      <h2 className="text-lg font-bold">Report a Hazard</h2>
      <p className="mb-3 text-xs text-muted-foreground">Prototype only — saved in this browser tab, not sent anywhere.</p>
      <div className="space-y-3 text-sm">
        <label className="block"><span className="font-medium">Hazard category *</span>
          <select className="field mt-1 w-full" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            <option value="">Select…</option>
            {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
          </select>
        </label>
        <label className="block"><span className="font-medium">Description *</span>
          <textarea className="field mt-1 w-full" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
        </label>
        <div><span className="font-medium">Location *</span>
          <p className={`mt-1 rounded-md px-2 py-1.5 text-xs ${picked ? "bg-muted" : "bg-pending/15"}`}>{picked ? `📍 ${picked[0].toFixed(5)}, ${picked[1].toFixed(5)} (click map to change)` : "Click on the map to place the hazard."}</p>
          <input className="field mt-2 w-full" placeholder="Location description (optional)" value={loc} onChange={(e) => setLoc(e.target.value)} />
        </div>
        <label className="block"><span className="font-medium">Photo (optional)</span>
          <input type="file" accept="image/*" className="mt-1 block w-full text-xs" onChange={(e) => { const f = e.target.files?.[0]; setPhoto(f ? URL.createObjectURL(f) : undefined); }} />
        </label>
        {photo && <img src={photo} alt="Preview" className="max-h-32 rounded-md" />}
        {err.length > 0 && <ul className="rounded-md bg-destructive/10 p-2 text-xs text-destructive">{err.map((x) => <li key={x}>• {x}</li>)}</ul>}
        <div className="flex gap-2 pt-1">
          <button className="btn-action flex-1" onClick={go}>Submit</button>
          <button className="btn-ghost flex-1" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
