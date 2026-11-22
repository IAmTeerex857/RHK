import type { Announcement, Application, AuditEntry, Conversation, Notification } from "./types";

export const applications: Application[] = [
  {
    id: "app-1042",
    ref: "RHK-1042",
    submitted: "Today, 10:18 AM",
    parent: { id: "ap-1", name: "Whitney Hall", email: "whitney.hall@example.com", phone: "(678) 555-0141" },
    address: "1407 Chapel Grove Dr",
    city: "Douglasville",
    children: [{ name: "Jayla Hall", age: 7, grade: "2nd", schoolId: "s-pine" }],
    service: "both",
    days: ["mon", "tue", "wed", "thu", "fri"],
    startDate: "Dec 1",
    status: "submitted",
    routeSuggestion: "r-pm-2",
    notes: "Mom works until 5. Grandmother can receive Jayla on Fridays.",
  },
  {
    id: "app-1041",
    ref: "RHK-1041",
    submitted: "Yesterday, 8:51 PM",
    parent: { id: "ap-2", name: "Marcus Ellison", email: "m.ellison@example.com", phone: "(404) 555-0142" },
    address: "33 Stonecrest Way",
    city: "Stone Mountain",
    children: [
      { name: "Bryce Ellison", age: 9, grade: "4th", schoolId: "s-cedar" },
      { name: "Chloe Ellison", age: 6, grade: "1st", schoolId: "s-cedar" },
    ],
    service: "pm",
    days: ["mon", "tue", "wed", "thu", "fri"],
    startDate: "Nov 30",
    status: "submitted",
    routeSuggestion: "r-pm-4",
  },
  {
    id: "app-1039",
    ref: "RHK-1039",
    submitted: "Nov 17",
    parent: { id: "ap-3", name: "Grace Owusu", email: "grace.owusu@example.com", phone: "(770) 555-0143" },
    address: "720 Maple Valley Rd",
    city: "Lithia Springs",
    children: [{ name: "Kofi Owusu", age: 10, grade: "5th", schoolId: "s-maple" }],
    service: "both",
    days: ["mon", "tue", "wed", "thu", "fri"],
    startDate: "Nov 30",
    status: "route_confirmed",
    routeSuggestion: "r-pm-1",
    feeRequestedOn: "Nov 18",
  },
  {
    id: "app-1037",
    ref: "RHK-1037",
    submitted: "Nov 14",
    parent: { id: "ap-4", name: "Hannah Kim", email: "hannah.kim@example.com", phone: "(678) 555-0144" },
    address: "15 Arbor Creek Ln",
    city: "Douglasville",
    children: [{ name: "Ethan Kim", age: 8, grade: "3rd", schoolId: "s-pine" }],
    service: "pm",
    days: ["mon", "wed", "fri"],
    startDate: "Nov 30",
    status: "fee_paid",
    routeSuggestion: "r-pm-2",
    feeRequestedOn: "Nov 16",
    feePaidOn: "Nov 18",
  },
  {
    id: "app-1033",
    ref: "RHK-1033",
    submitted: "Nov 9",
    parent: { id: "ap-5", name: "Derrick Shaw", email: "derrick.shaw@example.com", phone: "(770) 555-0145" },
    address: "9 Paces Ferry Ct",
    city: "Austell",
    children: [{ name: "Tyler Shaw", age: 12, grade: "7th", schoolId: "s-river" }],
    service: "both",
    days: ["mon", "tue", "wed", "thu", "fri"],
    startDate: "Nov 16",
    status: "approved",
    routeSuggestion: "r-pm-3",
    feeRequestedOn: "Nov 10",
    feePaidOn: "Nov 11",
  },
  {
    id: "app-1030",
    ref: "RHK-1030",
    submitted: "Nov 4",
    parent: { id: "ap-6", name: "Lauren Pierce", email: "lauren.pierce@example.com", phone: "(404) 555-0146" },
    address: "4100 Panola Rd",
    city: "Lithonia",
    children: [{ name: "Mason Pierce", age: 9, grade: "4th", schoolId: "s-cedar" }],
    service: "am",
    days: ["mon", "tue", "wed", "thu", "fri"],
    startDate: "Nov 16",
    status: "declined",
    declineReason: "Outside our current service area (Lithonia). Added to the waitlist for a future route.",
  },
];

export const conversations: Conversation[] = [
  {
    id: "cv-johnson",
    with: { kind: "family", id: "f-johnson", name: "Tanya Johnson", seed: "p-tanya" },
    subject: "Thanksgiving week",
    unread: 1,
    updated: "2:58 PM",
    messages: [
      { id: "m1", from: "parent", author: "Tanya Johnson", body: "Hi! Is there service on Wednesday the 25th? School lets out at noon.", at: "Today, 2:51 PM" },
      { id: "m2", from: "office", author: "Jordan Lee", body: "Hi Tanya, no service Nov 25–27 for Thanksgiving break. Rides start again Monday, Nov 30.", at: "Today, 2:55 PM" },
      { id: "m3", from: "parent", author: "Tanya Johnson", body: "Got it, thank you. Does my bill for that week change?", at: "Today, 2:58 PM" },
    ],
  },
  {
    id: "cv-marcus",
    with: { kind: "driver", id: "d-marcus", name: "Marcus Bell", seed: "d-marcus" },
    subject: "Route 2 · Afternoon",
    unread: 0,
    updated: "2:20 PM",
    messages: [
      { id: "m1", from: "office", author: "Clara", body: "Marcus, Kai's grandfather Bao will meet the van today.", at: "Today, 1:40 PM" },
      { id: "m2", from: "driver", author: "Marcus Bell", body: "Got it. He's on Kai's approved list.", at: "Today, 2:20 PM" },
    ],
  },
  {
    id: "cv-patel",
    with: { kind: "family", id: "f-patel", name: "Priya Patel", seed: "p-priya" },
    subject: "Wednesday piano lessons",
    unread: 2,
    updated: "Yesterday",
    messages: [
      { id: "m1", from: "parent", author: "Priya Patel", body: "Arjun starts piano on Wednesdays from Dec 2. I sent a change request.", at: "Yesterday, 6:12 PM" },
      { id: "m2", from: "parent", author: "Priya Patel", body: "Also, can the $35 for Monday be waived? It's a family emergency.", at: "Yesterday, 6:14 PM" },
    ],
  },
  {
    id: "cv-williams",
    with: { kind: "family", id: "f-williams", name: "Andre Williams", seed: "p-andre" },
    subject: "Bill for Nov 16 week",
    unread: 0,
    updated: "Nov 18",
    messages: [
      { id: "m1", from: "office", author: "Clara", body: "Hi Andre, a reminder that the bill for the week of Nov 16 ($95) is past due.", at: "Nov 18, 9:00 AM" },
      { id: "m2", from: "parent", author: "Andre Williams", body: "Sorry about that, I'll send it by Zelle Friday.", at: "Nov 18, 12:22 PM" },
    ],
  },
  {
    id: "cv-keisha",
    with: { kind: "driver", id: "d-keisha", name: "Keisha Grant", seed: "d-keisha" },
    subject: "Time off Dec 1–2",
    unread: 1,
    updated: "Nov 17",
    messages: [{ id: "m1", from: "driver", author: "Keisha Grant", body: "I put in for Dec 1–2, doctor's appointment. Can Ray cover?", at: "Nov 17, 4:05 PM" }],
  },
];

export const announcements: Announcement[] = [
  { id: "an-3", title: "No rides Nov 25–27 for Thanksgiving", body: "Schools are closed for Thanksgiving break. Rides resume Monday, Nov 30. Weekly bills for that week are unchanged; see the FAQ.", audience: "Everyone", sentAt: "Nov 16", sentBy: "Clara", reach: 12, opened: 11 },
  { id: "an-2", title: "Pine Ridge early release Dec 4", body: "Pine Ridge lets out at 12:40 PM on Friday, Dec 4. Route 2 will pick up at 12:45 PM.", audience: "Pine Ridge Elementary", sentAt: "Nov 13", sentBy: "Jordan Lee", reach: 4, opened: 4 },
  { id: "an-1", title: "Add the app to your home screen", body: "To get live ride alerts on iPhone, add the Rush Hour Kids app to your home screen. It takes 20 seconds.", audience: "Everyone", sentAt: "Nov 2", sentBy: "Clara", reach: 12, opened: 9 },
];

export const audit: AuditEntry[] = [
  { id: "au-1", at: "3:21 PM", who: "Keisha Grant", action: "Dropped off", target: "Mila Carter", detail: "Received by Dana Carter (guardian)" },
  { id: "au-2", at: "3:16 PM", who: "Marcus Bell", action: "Dropped off", target: "Leo Martinez", detail: "Received by Sofia Martinez (guardian)" },
  { id: "au-3", at: "3:05 PM", who: "Marcus Bell", action: "Dropped off", target: "Kai Nguyen", detail: "Received by Bao Tran (approved adult)" },
  { id: "au-4", at: "2:58 PM", who: "Jordan Lee", action: "Replied", target: "Tanya Johnson", detail: "Thanksgiving week" },
  { id: "au-5", at: "11:02 AM", who: "Brian Reed", action: "Reported absence", target: "Owen Reed", detail: "Fri, Nov 20 · afternoon" },
  { id: "au-6", at: "10:18 AM", who: "Website", action: "New application", target: "RHK-1042", detail: "Whitney Hall · 1 child" },
  { id: "au-7", at: "9:12 AM", who: "Jordan Lee", action: "Recorded payment", target: "RHK-2289", detail: "$90.00 · Cash App" },
  { id: "au-8", at: "8:40 AM", who: "Clara", action: "Recorded payment", target: "RHK-2287", detail: "$95.00 · Zelle" },
  { id: "au-9", at: "7:20 AM", who: "Denise Howard", action: "Marked absent", target: "Jaden Williams", detail: "Waited 5 min at library lot" },
  { id: "au-10", at: "Yesterday", who: "Clara", action: "Changed price", target: "Eli Johnson", detail: "$95.00 → $47.50 (sibling, half off)" },
  { id: "au-11", at: "Yesterday", who: "Tanya Johnson", action: "Added approved adult", target: "Maya Johnson", detail: "Derek Johnson (uncle)" },
  { id: "au-12", at: "Nov 18", who: "Clara", action: "Waived fee", target: "Isaiah Thompson", detail: "$35 late cancellation (sick)" },
];

export const adminNotices: Notification[] = [
  { id: "n1", title: "Route 4 is running 8 min late", body: "Keisha Grant · next stop Thompson", time: "3:22 PM", tone: "alert", unread: true, href: "/live" },
  { id: "n2", title: "New application RHK-1042", body: "Whitney Hall · Pine Ridge", time: "10:18 AM", tone: "info", unread: true, href: "/applications/app-1042" },
  { id: "n3", title: "Van 3 inspection is overdue", body: "Last inspected Nov 9", time: "7:00 AM", tone: "alert", unread: true, href: "/fleet" },
  { id: "n4", title: "Payment received", body: "Martinez · $90.00 Cash App", time: "9:12 AM", tone: "good", href: "/billing" },
];

export const parentNotices: Notification[] = [
  { id: "pn1", title: "Van 2 is about 5 minutes away", body: "Maya and Eli are on board", time: "3:25 PM", tone: "info", unread: true, href: "/live" },
  { id: "pn2", title: "Maya and Eli were picked up", body: "Pine Ridge Elementary · 2:44 PM", time: "2:44 PM", tone: "good", unread: true, href: "/history" },
  { id: "pn3", title: "Your bill for the week of Nov 23 is due today", body: "$142.50 · Zelle or Cash App", time: "8:00 AM", tone: "alert", href: "/bills" },
  { id: "pn4", title: "No rides Nov 25–27", body: "Thanksgiving break", time: "Nov 16", tone: "info", href: "/messages" },
];

export const driverNotices: Notification[] = [
  { id: "dn1", title: "Bao Tran meets Kai today", body: "Approved adult · grandfather", time: "1:40 PM", tone: "info", unread: false, href: "/messages" },
  { id: "dn2", title: "Pine Ridge early release Dec 4", body: "Route 2 picks up at 12:45 PM that day", time: "Nov 13", tone: "info", href: "/schedule" },
  { id: "dn3", title: "Time off approved: Dec 23–24", body: "Ray Foster covers Route 2", time: "Nov 18", tone: "good", href: "/schedule" },
];
