/*
 * Shapes the screens are built against. They mirror the data model in docs/PLAN.md §3
 * and move to packages/db (generated from the Supabase schema) when the backend lands.
 */

export type ID = string;
export type Slot = "am" | "pm";
export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri";
export type Cadence = "weekly" | "monthly";

export type Person = { id: ID; name: string; email: string; phone: string; photo?: string };

export type Staff = Person & { role: "owner" | "staff"; lastActive: string };

export type Driver = Person & {
  vanId: ID | null;
  status: "active" | "substitute" | "off";
  since: string;
  licenseExpires: string;
  hoursThisWeek: number;
  onTimeRate: number;
  trainingDone: number;
  trainingTotal: number;
};

export type Van = {
  id: ID;
  name: string;
  plate: string;
  capacity: number;
  mileage: number;
  status: "in_service" | "inspection_due" | "maintenance";
  nextService: string;
  fuelLevel: number;
  lastInspection: string;
  cameraId?: string;
};

export type School = { id: ID; name: string; short: string; address: string; city: string; bellAm: string; bellPm: string; children: number };

export type SatelliteStop = { id: ID; name: string; address: string; windowAm: string; windowPm: string; active: boolean; children: number };

export type ChildStatus = "applied" | "pending_fee" | "active" | "paused" | "ended";

export type ApprovedAdult = { id: ID; name: string; relationship: string; phone: string; addedOn: string };

export type Child = {
  id: ID;
  familyId: ID;
  first: string;
  last: string;
  age: number;
  grade: string;
  schoolId: ID;
  teacher: string;
  status: ChildStatus;
  medical?: string;
  notes?: string;
  photo?: string;
  amRouteId?: ID;
  pmRouteId?: ID;
  /** before + after / after only / before only */
  service: "both" | "pm" | "am";
  days: Weekday[];
  price: number;
  priceOverride?: { amount: number; reason: string };
  approvedAdults: ApprovedAdult[];
  startDate: string;
};

export type Family = {
  id: ID;
  name: string;
  guardians: Person[];
  address: string;
  city: string;
  cadence: Cadence;
  balance: number;
  status: "active" | "paused" | "pending";
  joined: string;
  area: string;
  emergency: { name: string; relationship: string; phone: string };
  preferredPayment: "zelle" | "cash_app" | "card" | "cash";
};

export type StopKind = "school" | "home" | "satellite";

export type RouteStop = {
  id: ID;
  kind: StopKind;
  label: string;
  address: string;
  time: string;
  childIds: ID[];
  x: number;
  y: number;
};

export type Route = {
  id: ID;
  name: string;
  slot: Slot;
  vanId: ID;
  driverId: ID;
  schoolIds: ID[];
  stops: RouteStop[];
  start: string;
  end: string;
  miles: number;
};

export type RunStatus = "not_started" | "running" | "done" | "late";

export type RunStopState = { stopId: ID; state: "done" | "next" | "todo" | "skipped"; at?: string; eta?: string };

export type Run = {
  id: ID;
  routeId: ID;
  date: string;
  status: RunStatus;
  driverId: ID;
  progress: number;
  lateMinutes: number;
  onBoard: number;
  startedAt?: string;
  endedAt?: string;
  van: { x: number; y: number };
  stops: RunStopState[];
};

export type ApplicationStatus = "submitted" | "route_confirmed" | "fee_paid" | "approved" | "declined";

export type Application = {
  id: ID;
  ref: string;
  submitted: string;
  parent: Person;
  address: string;
  city: string;
  children: { name: string; age: number; grade: string; schoolId: ID }[];
  service: "both" | "pm" | "am";
  days: Weekday[];
  startDate: string;
  status: ApplicationStatus;
  routeSuggestion?: ID;
  notes?: string;
  declineReason?: string;
  feeRequestedOn?: string;
  feePaidOn?: string;
};

export type InvoiceStatus = "open" | "paid" | "overdue" | "void" | "partial";

export type InvoiceLine = { label: string; childId?: ID; amount: number; kind: "service" | "fee" | "credit" };

export type Invoice = {
  id: ID;
  number: string;
  familyId: ID;
  period: string;
  periodLabel: string;
  cadence: Cadence;
  issued: string;
  due: string;
  status: InvoiceStatus;
  lines: InvoiceLine[];
  paid: number;
};

export type PaymentMethod = "card" | "zelle" | "cash_app" | "cash";

export type Payment = { id: ID; invoiceId: ID; familyId: ID; method: PaymentMethod; amount: number; at: string; reference?: string; recordedBy: string };

export type PriceItem = { id: ID; service: "both" | "pm" | "am"; label: string; weekly: number; monthly: number; active: boolean; children: number };

export type ChangeRequest = {
  id: ID;
  childId: ID;
  kind: "drop_day" | "add_day" | "address" | "pause" | "end";
  summary: string;
  effective: string;
  requested: string;
  noticeDays: number;
  feeApplies: boolean;
  status: "pending" | "approved" | "declined";
};

export type Absence = {
  id: ID;
  childId: ID;
  date: string;
  slot: Slot | "both";
  reportedBy: "parent" | "driver" | "office";
  reportedAt: string;
  reason?: string;
  late: boolean;
  feeWaived?: boolean;
};

export type Incident = {
  id: ID;
  title: string;
  kind: "safety" | "vehicle" | "behavior" | "medical" | "no_adult" | "other";
  severity: "low" | "medium" | "high";
  at: string;
  routeId?: ID;
  driverId?: ID;
  childIds: ID[];
  status: "open" | "following_up" | "closed";
  summary: string;
  location: string;
  timeline: { at: string; who: string; text: string }[];
};

export type Message = { id: ID; from: "office" | "parent" | "driver"; author: string; body: string; at: string };

export type Conversation = {
  id: ID;
  with: { kind: "family" | "driver"; id: ID; name: string; seed: string };
  subject: string;
  unread: number;
  updated: string;
  messages: Message[];
};

export type Announcement = {
  id: ID;
  title: string;
  body: string;
  audience: string;
  sentAt: string;
  sentBy: string;
  reach: number;
  opened: number;
};

export type Program = {
  id: ID;
  name: string;
  kind: "field_trip" | "summer" | "camp";
  dates: string;
  place: string;
  childIds: ID[];
  vanIds: ID[];
  status: "planned" | "confirmed" | "done";
  notes: string;
};

export type Course = { id: ID; title: string; minutes: number; lessons: number; required: boolean; status: "draft" | "approved"; assigned: number; completed: number; summary: string };

export type Shift = { id: ID; driverId: ID; date: string; slot: Slot; in: string; out?: string; hours: number; miles: number };

export type TimeOff = { id: ID; driverId: ID; from: string; to: string; reason: string; status: "pending" | "approved" | "declined"; coverId?: ID };

export type AuditEntry = { id: ID; at: string; who: string; action: string; target: string; detail: string };

export type Notification = { id: ID; title: string; body?: string; time: string; tone?: "alert" | "info" | "good"; unread?: boolean; href?: string };
