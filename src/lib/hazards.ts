export type Category = "streetlight" | "pavement" | "walkway" | "flood";
export type Status = "Pending" | "Verified" | "Resolved";

export interface Report {
  id: string;
  title: string;
  category: Category;
  description: string;
  date: string;
  status: Status;
  lat: number;
  lng: number;
  locationText: string;
  demo: boolean;
  photo?: string;
}

export const CATEGORIES: Record<Category, { label: string; icon: string }> = {
  streetlight: { label: "Broken streetlight", icon: "💡" },
  pavement: { label: "Damaged pavement", icon: "🚧" },
  walkway: { label: "Blocked walkway", icon: "⛔" },
  flood: { label: "Flood-prone area", icon: "🌊" },
};

export const STATUSES: Status[] = ["Pending", "Verified", "Resolved"];

// Approximate campus area from OpenStreetMap (Nominatim bbox for USIM, Nilai).
export const CAMPUS_BOUNDS: [[number, number], [number, number]] = [
  [2.8395, 101.7645],
  [2.8545, 101.7865],
];
// Approximate prototype boundary polygon (NOT an official USIM boundary).
export const CAMPUS_POLYGON: [number, number][] = [
  [2.8545, 101.7655],
  [2.8545, 101.7745],
  [2.8510, 101.7860],
  [2.8400, 101.7860],
  [2.8380, 101.7790],
  [2.8420, 101.7700],
  [2.8480, 101.7650],
];

export function initialReports(): Report[] {
  const d = (n: number) => `2026-10-${String(n).padStart(2, "0")}`;
  return [
    { id: "d1", title: "Sample: Streetlight not working", category: "streetlight", description: "Fictional example: a lamp post along a campus road appears unlit at night.", date: d(12), status: "Pending", lat: 2.8492, lng: 101.7712, locationText: "Near campus road (sample location)", demo: true },
    { id: "d2", title: "Sample: Cracked pavement", category: "pavement", description: "Fictional example: uneven paving slabs could cause tripping.", date: d(9), status: "Verified", lat: 2.8462, lng: 101.7788, locationText: "Central campus walkway (sample)", demo: true },
    { id: "d3", title: "Sample: Walkway obstructed", category: "walkway", description: "Fictional example: construction materials blocking part of a pedestrian path.", date: d(15), status: "Pending", lat: 2.8510, lng: 101.7690, locationText: "Northwest campus path (sample)", demo: true },
    { id: "d4", title: "Sample: Water pooling after rain", category: "flood", description: "Fictional example: low-lying area where water may collect during heavy rain.", date: d(5), status: "Resolved", lat: 2.8432, lng: 101.7815, locationText: "Southeast campus area (sample)", demo: true },
    { id: "d5", title: "Sample: Dim lighting at junction", category: "streetlight", description: "Fictional example: junction lighting reported as too dim.", date: d(17), status: "Verified", lat: 2.8445, lng: 101.7745, locationText: "Campus junction (sample)", demo: true },
    { id: "d6", title: "Sample: Drain overflow risk", category: "flood", description: "Fictional example: drain near a road edge may overflow in storms.", date: d(18), status: "Pending", lat: 2.8478, lng: 101.7835, locationText: "East campus road (sample)", demo: true },
  ];
}

export function countByStatus(reports: Report[]) {
  return {
    total: reports.length,
    Pending: reports.filter((r) => r.status === "Pending").length,
    Verified: reports.filter((r) => r.status === "Verified").length,
    Resolved: reports.filter((r) => r.status === "Resolved").length,
  };
}

export function filterReports(reports: Report[], cat: Category | "all", status: Status | "all") {
  return reports.filter((r) => (cat === "all" || r.category === cat) && (status === "all" || r.status === status));
}
