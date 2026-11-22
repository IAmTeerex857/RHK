import type { Absence, ChangeRequest, Course, Incident, Program, Route, Run, Shift, TimeOff } from "./types";

/* ------------------------------------------------------------------ routes */

export const routes: Route[] = [
  {
    id: "r-pm-2",
    name: "Route 2 · Afternoon",
    slot: "pm",
    vanId: "v2",
    driverId: "d-marcus",
    schoolIds: ["s-pine"],
    start: "2:30 PM",
    end: "4:20 PM",
    miles: 18.4,
    stops: [
      { id: "pm2-s0", kind: "school", label: "Pine Ridge Elementary", address: "2150 Pine Ridge Rd", time: "2:40 PM", childIds: ["c-maya", "c-eli", "c-leo", "c-kai", "c-nia"], x: 14, y: 22 },
      { id: "pm2-s1", kind: "home", label: "Nguyen", address: "1290 Kensington Way", time: "3:02 PM", childIds: ["c-kai"], x: 30, y: 36 },
      { id: "pm2-s2", kind: "home", label: "Martinez", address: "77 Willow Bend", time: "3:13 PM", childIds: ["c-leo"], x: 46, y: 30 },
      { id: "pm2-s3", kind: "home", label: "Johnson", address: "4182 Brookstone Dr", time: "3:28 PM", childIds: ["c-maya", "c-eli"], x: 62, y: 52 },
      { id: "pm2-s4", kind: "home", label: "Davis", address: "58 Hollow Oak Dr", time: "3:41 PM", childIds: ["c-nia"], x: 78, y: 66 },
      { id: "pm2-s5", kind: "satellite", label: "Hunter Park lot", address: "8830 Gurley Rd", time: "4:10 PM", childIds: [], x: 88, y: 84 },
    ],
  },
  {
    id: "r-am-2",
    name: "Route 2 · Morning",
    slot: "am",
    vanId: "v2",
    driverId: "d-marcus",
    schoolIds: ["s-pine"],
    start: "6:40 AM",
    end: "7:45 AM",
    miles: 16.9,
    stops: [
      { id: "am2-s1", kind: "home", label: "Davis", address: "58 Hollow Oak Dr", time: "6:52 AM", childIds: ["c-nia"], x: 78, y: 66 },
      { id: "am2-s2", kind: "home", label: "Johnson", address: "4182 Brookstone Dr", time: "7:04 AM", childIds: ["c-maya", "c-eli"], x: 62, y: 52 },
      { id: "am2-s3", kind: "home", label: "Nguyen", address: "1290 Kensington Way", time: "7:17 AM", childIds: ["c-kai"], x: 30, y: 36 },
      { id: "am2-s4", kind: "school", label: "Pine Ridge Elementary", address: "2150 Pine Ridge Rd", time: "7:38 AM", childIds: ["c-nia", "c-maya", "c-eli", "c-kai"], x: 14, y: 22 },
    ],
  },
  {
    id: "r-pm-1",
    name: "Route 1 · Afternoon",
    slot: "pm",
    vanId: "v1",
    driverId: "d-denise",
    schoolIds: ["s-maple"],
    start: "2:55 PM",
    end: "4:30 PM",
    miles: 21.2,
    stops: [
      { id: "pm1-s0", kind: "school", label: "Maple Creek Academy", address: "800 Maple Creek Pkwy", time: "3:05 PM", childIds: ["c-zara", "c-jaden", "c-arjun", "c-meera"], x: 20, y: 70 },
      { id: "pm1-s1", kind: "home", label: "Okafor", address: "905 Sweetwater Ct", time: "3:22 PM", childIds: ["c-zara"], x: 36, y: 58 },
      { id: "pm1-s2", kind: "satellite", label: "Lithia Springs library lot", address: "7100 Junction Ln", time: "3:55 PM", childIds: ["c-jaden"], x: 52, y: 44 },
      { id: "pm1-s3", kind: "home", label: "Patel", address: "2218 Lakeview Ter", time: "4:12 PM", childIds: ["c-arjun", "c-meera"], x: 70, y: 30 },
    ],
  },
  {
    id: "r-am-1",
    name: "Route 1 · Morning",
    slot: "am",
    vanId: "v1",
    driverId: "d-denise",
    schoolIds: ["s-maple"],
    start: "6:55 AM",
    end: "8:00 AM",
    miles: 19.8,
    stops: [
      { id: "am1-s1", kind: "home", label: "Patel", address: "2218 Lakeview Ter", time: "7:05 AM", childIds: ["c-arjun", "c-meera"], x: 70, y: 30 },
      { id: "am1-s2", kind: "satellite", label: "Lithia Springs library lot", address: "7100 Junction Ln", time: "7:15 AM", childIds: ["c-jaden"], x: 52, y: 44 },
      { id: "am1-s3", kind: "home", label: "Okafor", address: "905 Sweetwater Ct", time: "7:31 AM", childIds: ["c-zara"], x: 36, y: 58 },
      { id: "am1-s4", kind: "school", label: "Maple Creek Academy", address: "800 Maple Creek Pkwy", time: "7:52 AM", childIds: ["c-zara", "c-jaden", "c-arjun", "c-meera"], x: 20, y: 70 },
    ],
  },
  {
    id: "r-pm-3",
    name: "Route 3 · Afternoon",
    slot: "pm",
    vanId: "v3",
    driverId: "d-tony",
    schoolIds: ["s-river"],
    start: "3:25 PM",
    end: "4:40 PM",
    miles: 14.6,
    stops: [
      { id: "pm3-s0", kind: "school", label: "Riverside Middle School", address: "4410 River Bend Dr", time: "3:35 PM", childIds: ["c-ava", "c-amari", "c-owen"], x: 40, y: 80 },
      { id: "pm3-s1", kind: "home", label: "Brooks", address: "640 Riverside Pkwy", time: "3:52 PM", childIds: ["c-amari"], x: 56, y: 70 },
      { id: "pm3-s2", kind: "home", label: "Reed", address: "88 Austell Commons", time: "4:05 PM", childIds: ["c-owen"], x: 66, y: 56 },
      { id: "pm3-s3", kind: "home", label: "Martinez", address: "77 Willow Bend", time: "4:24 PM", childIds: ["c-ava"], x: 46, y: 30 },
    ],
  },
  {
    id: "r-am-3",
    name: "Route 3 · Morning",
    slot: "am",
    vanId: "v3",
    driverId: "d-tony",
    schoolIds: ["s-river"],
    start: "7:35 AM",
    end: "8:30 AM",
    miles: 12.1,
    stops: [
      { id: "am3-s1", kind: "home", label: "Reed", address: "88 Austell Commons", time: "7:52 AM", childIds: ["c-owen", "c-sam"], x: 66, y: 56 },
      { id: "am3-s2", kind: "school", label: "Riverside Middle School", address: "4410 River Bend Dr", time: "8:20 AM", childIds: ["c-owen", "c-sam"], x: 40, y: 80 },
    ],
  },
  {
    id: "r-pm-4",
    name: "Route 4 · Afternoon",
    slot: "pm",
    vanId: "v4",
    driverId: "d-keisha",
    schoolIds: ["s-cedar"],
    start: "2:40 PM",
    end: "3:50 PM",
    miles: 11.8,
    stops: [
      { id: "pm4-s0", kind: "school", label: "Cedar Hill Elementary", address: "1720 Cedar Hill Ln", time: "2:50 PM", childIds: ["c-isaiah", "c-mila"], x: 84, y: 18 },
      { id: "pm4-s1", kind: "home", label: "Carter", address: "1544 Rockbridge Rd", time: "3:12 PM", childIds: ["c-mila"], x: 72, y: 12 },
      { id: "pm4-s2", kind: "home", label: "Thompson", address: "319 Memorial Dr", time: "3:30 PM", childIds: ["c-isaiah"], x: 92, y: 40 },
    ],
  },
  {
    id: "r-am-4",
    name: "Route 4 · Morning",
    slot: "am",
    vanId: "v4",
    driverId: "d-keisha",
    schoolIds: ["s-cedar"],
    start: "7:05 AM",
    end: "7:50 AM",
    miles: 10.9,
    stops: [
      { id: "am4-s1", kind: "home", label: "Thompson", address: "319 Memorial Dr", time: "7:15 AM", childIds: ["c-isaiah"], x: 92, y: 40 },
      { id: "am4-s2", kind: "home", label: "Carter", address: "1544 Rockbridge Rd", time: "7:28 AM", childIds: ["c-mila"], x: 72, y: 12 },
      { id: "am4-s3", kind: "school", label: "Cedar Hill Elementary", address: "1720 Cedar Hill Ln", time: "7:44 AM", childIds: ["c-isaiah", "c-mila"], x: 84, y: 18 },
    ],
  },
];

/* ------------------------------------------------------------------ today's runs */

export const runs: Run[] = [
  {
    id: "run-pm-2",
    routeId: "r-pm-2",
    date: "2026-11-20",
    status: "running",
    driverId: "d-marcus",
    progress: 0.55,
    lateMinutes: 2,
    onBoard: 3,
    startedAt: "2:31 PM",
    van: { x: 55, y: 42 },
    stops: [
      { stopId: "pm2-s0", state: "done", at: "2:44 PM" },
      { stopId: "pm2-s1", state: "done", at: "3:05 PM" },
      { stopId: "pm2-s2", state: "done", at: "3:16 PM" },
      { stopId: "pm2-s3", state: "next", eta: "3:30 PM" },
      { stopId: "pm2-s4", state: "todo", eta: "3:43 PM" },
      { stopId: "pm2-s5", state: "todo", eta: "4:12 PM" },
    ],
  },
  {
    id: "run-pm-1",
    routeId: "r-pm-1",
    date: "2026-11-20",
    status: "running",
    driverId: "d-denise",
    progress: 0.4,
    lateMinutes: 0,
    onBoard: 3,
    startedAt: "2:54 PM",
    van: { x: 40, y: 54 },
    stops: [
      { stopId: "pm1-s0", state: "done", at: "3:06 PM" },
      { stopId: "pm1-s1", state: "done", at: "3:21 PM" },
      { stopId: "pm1-s2", state: "next", eta: "3:54 PM" },
      { stopId: "pm1-s3", state: "todo", eta: "4:11 PM" },
    ],
  },
  {
    id: "run-pm-3",
    routeId: "r-pm-3",
    date: "2026-11-20",
    status: "not_started",
    driverId: "d-tony",
    progress: 0,
    lateMinutes: 0,
    onBoard: 0,
    van: { x: 34, y: 86 },
    stops: [
      { stopId: "pm3-s0", state: "next", eta: "3:35 PM" },
      { stopId: "pm3-s1", state: "todo", eta: "3:52 PM" },
      { stopId: "pm3-s2", state: "skipped" },
      { stopId: "pm3-s3", state: "todo", eta: "4:24 PM" },
    ],
  },
  {
    id: "run-pm-4",
    routeId: "r-pm-4",
    date: "2026-11-20",
    status: "late",
    driverId: "d-keisha",
    progress: 0.7,
    lateMinutes: 8,
    onBoard: 1,
    startedAt: "2:46 PM",
    van: { x: 88, y: 30 },
    stops: [
      { stopId: "pm4-s0", state: "done", at: "2:58 PM" },
      { stopId: "pm4-s1", state: "done", at: "3:21 PM" },
      { stopId: "pm4-s2", state: "next", eta: "3:38 PM" },
    ],
  },
];

/* ------------------------------------------------------------------ schedules */

export const changeRequests: ChangeRequest[] = [
  { id: "cr-1", childId: "c-arjun", kind: "drop_day", summary: "Stop Wednesday afternoon rides (piano lessons)", effective: "Dec 2", requested: "Nov 19", noticeDays: 13, feeApplies: false, status: "pending" },
  { id: "cr-2", childId: "c-amari", kind: "address", summary: "Tuesday drop-off at grandmother's, 1102 Oak St, Austell", effective: "Nov 24", requested: "Nov 20", noticeDays: 4, feeApplies: true, status: "pending" },
  { id: "cr-3", childId: "c-mila", kind: "add_day", summary: "Add Friday morning rides", effective: "Dec 7", requested: "Nov 18", noticeDays: 19, feeApplies: false, status: "pending" },
  { id: "cr-4", childId: "c-kayla", kind: "pause", summary: "Pause service until January (family travel)", effective: "Nov 9", requested: "Oct 28", noticeDays: 12, feeApplies: false, status: "approved" },
];

export const absences: Absence[] = [
  { id: "ab-1", childId: "c-owen", date: "Nov 20", slot: "pm", reportedBy: "parent", reportedAt: "Today 11:02 AM", reason: "Dentist, picked up early", late: false },
  { id: "ab-2", childId: "c-jaden", date: "Nov 20", slot: "am", reportedBy: "driver", reportedAt: "Today 7:20 AM", reason: "No one came out after 5 min", late: false },
  { id: "ab-3", childId: "c-arjun", date: "Nov 23", slot: "both", reportedBy: "parent", reportedAt: "Nov 19", reason: "Family trip", late: true },
  { id: "ab-4", childId: "c-isaiah", date: "Nov 18", slot: "both", reportedBy: "parent", reportedAt: "Nov 17, 8:40 PM", reason: "Sick", late: true, feeWaived: true },
];

/* ------------------------------------------------------------------ incidents */

export const incidents: Incident[] = [
  {
    id: "inc-104",
    title: "No approved adult at home",
    kind: "no_adult",
    severity: "medium",
    at: "Nov 19, 3:44 PM",
    routeId: "r-pm-2",
    driverId: "d-marcus",
    childIds: ["c-nia"],
    status: "following_up",
    summary: "No one answered at the Davis home. Driver waited with the van while the office reached Keith Davis, who arrived 11 minutes later.",
    location: "58 Hollow Oak Dr, Douglasville",
    timeline: [
      { at: "3:44 PM", who: "Marcus Bell", text: "Alerted office: no adult at the door." },
      { at: "3:46 PM", who: "Jordan Lee", text: "Called Keith Davis, no answer. Called Tamara Davis (approved)." },
      { at: "3:55 PM", who: "Jordan Lee", text: "Keith Davis on his way, 5 min out." },
      { at: "3:55 PM", who: "Marcus Bell", text: "Nia handed to Keith Davis. Route resumed." },
    ],
  },
  {
    id: "inc-103",
    title: "Child felt unwell on the van",
    kind: "medical",
    severity: "medium",
    at: "Nov 17, 3:48 PM",
    routeId: "r-pm-3",
    driverId: "d-tony",
    childIds: ["c-amari"],
    status: "open",
    summary: "Amari said she felt dizzy. Driver pulled over, gave water, office called Renee Brooks. Amari was dropped home as planned and was fine.",
    location: "Riverside Pkwy near Veterans Memorial Hwy",
    timeline: [
      { at: "3:48 PM", who: "Tony Alvarez", text: "Reported: Amari dizzy, pulled over safely." },
      { at: "3:50 PM", who: "Clara", text: "Called Renee Brooks; she asked to continue home." },
      { at: "4:01 PM", who: "Tony Alvarez", text: "Dropped home to Doris Brooks (approved)." },
    ],
  },
  {
    id: "inc-102",
    title: "Van scraped curb in pickup lane",
    kind: "vehicle",
    severity: "low",
    at: "Nov 12, 3:07 PM",
    routeId: "r-pm-1",
    driverId: "d-denise",
    childIds: [],
    status: "closed",
    summary: "Right rear hubcap scuffed on the Maple Creek curb. No children hurt, no other vehicles. Photos attached.",
    location: "Maple Creek Academy pickup lane",
    timeline: [
      { at: "3:07 PM", who: "Denise Howard", text: "Reported with 2 photos." },
      { at: "Nov 13", who: "Clara", text: "Checked at the shop, cosmetic only. Closed." },
    ],
  },
];

/* ------------------------------------------------------------------ programs */

export const programs: Program[] = [
  { id: "pg-1", name: "Science museum field trip", kind: "field_trip", dates: "Thu, Dec 10 · 9:00 AM – 2:00 PM", place: "Fernbank Science Center, Atlanta", childIds: ["c-maya", "c-arjun", "c-zara", "c-nia"], vanIds: ["v1", "v2"], status: "confirmed", notes: "Pack lunch. Permission slips due Dec 3." },
  { id: "pg-2", name: "Winter break camp shuttle", kind: "camp", dates: "Dec 21 – Jan 2 · weekdays", place: "Douglasville YMCA", childIds: ["c-eli", "c-kai", "c-leo", "c-mila", "c-isaiah"], vanIds: ["v2", "v4"], status: "planned", notes: "Morning drop 8:30 AM, pickup 4:00 PM." },
  { id: "pg-3", name: "Summer program 2027", kind: "summer", dates: "Jun 1 – Jul 30, 2027", place: "Sweetwater Creek day camp", childIds: [], vanIds: [], status: "planned", notes: "Interest list opens in March." },
];

/* ------------------------------------------------------------------ drivers */

export const shifts: Shift[] = [
  { id: "sh-1", driverId: "d-marcus", date: "Mon, Nov 16", slot: "am", in: "6:31 AM", out: "8:02 AM", hours: 1.5, miles: 17.1 },
  { id: "sh-2", driverId: "d-marcus", date: "Mon, Nov 16", slot: "pm", in: "2:21 PM", out: "4:31 PM", hours: 2.17, miles: 18.9 },
  { id: "sh-3", driverId: "d-marcus", date: "Tue, Nov 17", slot: "am", in: "6:29 AM", out: "7:58 AM", hours: 1.48, miles: 16.8 },
  { id: "sh-4", driverId: "d-marcus", date: "Tue, Nov 17", slot: "pm", in: "2:24 PM", out: "4:27 PM", hours: 2.05, miles: 18.2 },
  { id: "sh-5", driverId: "d-marcus", date: "Wed, Nov 18", slot: "am", in: "6:33 AM", out: "8:00 AM", hours: 1.45, miles: 16.9 },
  { id: "sh-6", driverId: "d-marcus", date: "Wed, Nov 18", slot: "pm", in: "2:20 PM", out: "4:25 PM", hours: 2.08, miles: 18.4 },
  { id: "sh-7", driverId: "d-marcus", date: "Thu, Nov 19", slot: "am", in: "6:30 AM", out: "7:59 AM", hours: 1.48, miles: 17.0 },
  { id: "sh-8", driverId: "d-marcus", date: "Thu, Nov 19", slot: "pm", in: "2:22 PM", out: "4:44 PM", hours: 2.37, miles: 18.6 },
  { id: "sh-9", driverId: "d-marcus", date: "Fri, Nov 20", slot: "am", in: "6:28 AM", out: "7:57 AM", hours: 1.48, miles: 16.7 },
  { id: "sh-10", driverId: "d-marcus", date: "Fri, Nov 20", slot: "pm", in: "2:19 PM", hours: 1.08, miles: 9.2 },
];

export const timeOff: TimeOff[] = [
  { id: "to-1", driverId: "d-keisha", from: "Dec 1", to: "Dec 2", reason: "Medical appointment", status: "pending" },
  { id: "to-2", driverId: "d-tony", from: "Nov 30", to: "Nov 30", reason: "Family event", status: "approved", coverId: "d-ray" },
  { id: "to-3", driverId: "d-marcus", from: "Dec 23", to: "Dec 24", reason: "Holiday travel", status: "approved", coverId: "d-ray" },
];

export const courses: Course[] = [
  { id: "co-1", title: "Check-on, check-off and the empty-van check", minutes: 18, lessons: 5, required: true, status: "approved", assigned: 5, completed: 5, summary: "Every child is tapped on and off. The route can't close until the van is walked end to end." },
  { id: "co-2", title: "Home drop-off and approved adults", minutes: 12, lessons: 4, required: true, status: "approved", assigned: 5, completed: 4, summary: "Who may receive a child, how to confirm them, and what to do when nobody is there." },
  { id: "co-3", title: "Medical alerts: allergies, asthma and EpiPens", minutes: 22, lessons: 6, required: true, status: "approved", assigned: 5, completed: 4, summary: "Reading a child's medical note, using an EpiPen, and when to call 911 first." },
  { id: "co-4", title: "Emergencies and incident reports", minutes: 15, lessons: 5, required: true, status: "approved", assigned: 5, completed: 3, summary: "Breakdowns, crashes and behaviour incidents: what to do, in order, and how to report." },
  { id: "co-5", title: "Defensive driving refresher", minutes: 30, lessons: 7, required: true, status: "draft", assigned: 0, completed: 0, summary: "School zones, bus stops, weather and following distance with children on board." },
];

/* ------------------------------------------------------------------ history for charts */

/** On-time rate by week (last 12), most recent last. */
export const onTimeByWeek = [
  { label: "Aug 31", value: 92.1 },
  { label: "Sep 7", value: 93.4 },
  { label: "Sep 14", value: 92.8 },
  { label: "Sep 21", value: 94.2 },
  { label: "Sep 28", value: 93.9 },
  { label: "Oct 5", value: 95.1 },
  { label: "Oct 12", value: 94.6 },
  { label: "Oct 19", value: 95.8 },
  { label: "Oct 26", value: 95.3 },
  { label: "Nov 2", value: 96.2 },
  { label: "Nov 9", value: 95.7 },
  { label: "Nov 16", value: 96.8 },
];

/** Rides given per day this week vs. scheduled. */
export const ridesThisWeek = { scheduled: 142, given: 131, absent: 9, late: 3 };

/** Revenue collected by week (last 12), USD. */
export const revenueByWeek = [
  { label: "Aug 31", value: 3420 },
  { label: "Sep 7", value: 3610 },
  { label: "Sep 14", value: 3555 },
  { label: "Sep 21", value: 3720 },
  { label: "Sep 28", value: 4980 },
  { label: "Oct 5", value: 3690 },
  { label: "Oct 12", value: 3745 },
  { label: "Oct 19", value: 3810 },
  { label: "Oct 26", value: 5120 },
  { label: "Nov 2", value: 3880 },
  { label: "Nov 9", value: 3902 },
  { label: "Nov 16", value: 3415 },
];

/**
 * Late drop-offs by weekday and 15-minute slot of the afternoon (share of the worst cell),
 * for the "when we run late" heatmap. Rows Mon–Fri, cols 2:30 PM … 4:30 PM.
 */
export const lateHeat = {
  rows: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  cols: ["2:30", "2:45", "3:00", "3:15", "3:30", "3:45", "4:00", "4:15", "4:30"],
  values: [
    [0.05, 0.1, 0.2, 0.42, 0.55, 0.38, 0.2, 0.1, 0.05],
    [0.05, 0.08, 0.18, 0.3, 0.44, 0.3, 0.16, 0.08, 0.04],
    [0.08, 0.12, 0.35, 0.62, 0.9, 0.66, 0.3, 0.12, 0.06],
    [0.04, 0.1, 0.2, 0.36, 0.48, 0.34, 0.18, 0.1, 0.05],
    [0.1, 0.16, 0.4, 0.7, 1, 0.74, 0.42, 0.2, 0.08],
  ],
};
