import type { Child, Driver, Family, SatelliteStop, School, Staff, Van } from "./types";

/** The mock clock: every screen shows this moment. */
export const NOW = {
  iso: "2026-11-20T15:24:00-05:00",
  date: "2026-11-20",
  dayLabel: "Friday, November 20",
  short: "Fri, Nov 20",
  time: "3:24 PM",
  week: "Nov 16 – 20",
};

export const OFFICE = {
  name: "Rush Hour Kids Transportation",
  address: "3379 GA-5 Ste H, Douglasville, GA 30135",
  email: "office@rushhourkidstransportation.com",
  phone: "(404) 427-6780",
  zelle: "(404) 427-6780",
  cashApp: "$RushHourKids",
};

export const staff: Staff[] = [
  { id: "st-clara", name: "Clara", email: "office@rushhourkidstransportation.com", phone: "(770) 555-0142", role: "owner", lastActive: "Now" },
  { id: "st-jordan", name: "Jordan Lee", email: "jordan@rushhourkidstransportation.com", phone: "(770) 555-0167", role: "staff", lastActive: "12 min ago" },
  { id: "st-tasha", name: "Tasha Greene", email: "tasha@rushhourkidstransportation.com", phone: "(770) 555-0188", role: "staff", lastActive: "Yesterday" },
];

export const vans: Van[] = [
  { id: "v1", name: "Van 1", plate: "RHK 1021", capacity: 14, mileage: 48210, status: "in_service", nextService: "Dec 14", fuelLevel: 0.62, lastInspection: "Nov 16" },
  { id: "v2", name: "Van 2", plate: "RHK 1034", capacity: 14, mileage: 39874, status: "in_service", nextService: "Jan 8", fuelLevel: 0.48, lastInspection: "Nov 20" },
  { id: "v3", name: "Van 3", plate: "RHK 1057", capacity: 12, mileage: 61502, status: "inspection_due", nextService: "Overdue 2 days", fuelLevel: 0.81, lastInspection: "Nov 9" },
  { id: "v4", name: "Van 4", plate: "RHK 1088", capacity: 14, mileage: 22340, status: "in_service", nextService: "Feb 2", fuelLevel: 0.35, lastInspection: "Nov 18" },
];

export const drivers: Driver[] = [
  { id: "d-marcus", name: "Marcus Bell", email: "marcus.bell@example.com", phone: "(770) 555-0119", vanId: "v2", status: "active", since: "Aug 2023", licenseExpires: "Mar 2028", hoursThisWeek: 17.1, onTimeRate: 0.98, trainingDone: 4, trainingTotal: 4 },
  { id: "d-denise", name: "Denise Howard", email: "denise.howard@example.com", phone: "(770) 555-0124", vanId: "v1", status: "active", since: "Jan 2022", licenseExpires: "Oct 2027", hoursThisWeek: 17.6, onTimeRate: 0.97, trainingDone: 4, trainingTotal: 4 },
  { id: "d-tony", name: "Tony Alvarez", email: "tony.alvarez@example.com", phone: "(770) 555-0131", vanId: "v3", status: "active", since: "May 2024", licenseExpires: "Jun 2029", hoursThisWeek: 15.9, onTimeRate: 0.94, trainingDone: 3, trainingTotal: 4 },
  { id: "d-keisha", name: "Keisha Grant", email: "keisha.grant@example.com", phone: "(770) 555-0136", vanId: "v4", status: "active", since: "Sep 2024", licenseExpires: "Dec 2026", hoursThisWeek: 16.4, onTimeRate: 0.91, trainingDone: 2, trainingTotal: 4 },
  { id: "d-ray", name: "Ray Foster", email: "ray.foster@example.com", phone: "(770) 555-0150", vanId: null, status: "substitute", since: "Feb 2025", licenseExpires: "Aug 2028", hoursThisWeek: 6.0, onTimeRate: 0.96, trainingDone: 3, trainingTotal: 4 },
];

export const schools: School[] = [
  { id: "s-pine", name: "Pine Ridge Elementary", short: "Pine Ridge", address: "2150 Pine Ridge Rd", city: "Douglasville", bellAm: "7:45 AM", bellPm: "2:40 PM", children: 5 },
  { id: "s-maple", name: "Maple Creek Academy", short: "Maple Creek", address: "800 Maple Creek Pkwy", city: "Lithia Springs", bellAm: "8:00 AM", bellPm: "3:05 PM", children: 4 },
  { id: "s-river", name: "Riverside Middle School", short: "Riverside", address: "4410 River Bend Dr", city: "Austell", bellAm: "8:30 AM", bellPm: "3:35 PM", children: 4 },
  { id: "s-cedar", name: "Cedar Hill Elementary", short: "Cedar Hill", address: "1720 Cedar Hill Ln", city: "Stone Mountain", bellAm: "7:50 AM", bellPm: "2:50 PM", children: 3 },
];

export const satelliteStops: SatelliteStop[] = [
  { id: "sat-hunter", name: "Hunter Park lot", address: "8830 Gurley Rd, Douglasville", windowAm: "6:50 – 7:05 AM", windowPm: "4:10 – 4:25 PM", active: true, children: 3 },
  { id: "sat-library", name: "Lithia Springs library lot", address: "7100 Junction Ln, Lithia Springs", windowAm: "7:10 – 7:20 AM", windowPm: "3:55 – 4:10 PM", active: true, children: 2 },
  { id: "sat-church", name: "Grace Fellowship lot", address: "512 Rock Mill Rd, Austell", windowAm: "7:30 – 7:40 AM", windowPm: "4:20 – 4:35 PM", active: false, children: 0 },
];

const g = (id: string, name: string, email: string, phone: string) => ({ id, name, email, phone });

export const families: Family[] = [
  { id: "f-johnson", name: "Johnson", guardians: [g("p-tanya", "Tanya Johnson", "tanya.johnson@example.com", "(678) 555-0101")], address: "4182 Brookstone Dr", city: "Douglasville", cadence: "weekly", balance: 142.5, status: "active", joined: "Aug 2024", area: "Douglas County", emergency: { name: "Gloria Johnson", relationship: "Grandmother", phone: "(678) 555-0177" }, preferredPayment: "zelle" },
  { id: "f-okafor", name: "Okafor", guardians: [g("p-ada", "Ada Okafor", "ada.okafor@example.com", "(678) 555-0102"), g("p-chidi", "Chidi Okafor", "chidi.okafor@example.com", "(678) 555-0103")], address: "905 Sweetwater Ct", city: "Lithia Springs", cadence: "monthly", balance: 0, status: "active", joined: "Jan 2025", area: "Douglas County", emergency: { name: "Ngozi Eze", relationship: "Aunt", phone: "(404) 555-0190" }, preferredPayment: "zelle" },
  { id: "f-martinez", name: "Martinez", guardians: [g("p-sofia", "Sofia Martinez", "sofia.martinez@example.com", "(678) 555-0104")], address: "77 Willow Bend", city: "Douglasville", cadence: "weekly", balance: 0, status: "active", joined: "Aug 2023", area: "Douglas County", emergency: { name: "Luis Martinez", relationship: "Uncle", phone: "(678) 555-0178" }, preferredPayment: "cash_app" },
  { id: "f-williams", name: "Williams", guardians: [g("p-andre", "Andre Williams", "andre.williams@example.com", "(770) 555-0105")], address: "3301 Fairburn Rd", city: "Lithia Springs", cadence: "weekly", balance: 190, status: "active", joined: "Mar 2025", area: "Douglas County", emergency: { name: "Carla Williams", relationship: "Mother", phone: "(770) 555-0179" }, preferredPayment: "zelle" },
  { id: "f-nguyen", name: "Nguyen", guardians: [g("p-linh", "Linh Nguyen", "linh.nguyen@example.com", "(678) 555-0106")], address: "1290 Kensington Way", city: "Douglasville", cadence: "monthly", balance: 0, status: "active", joined: "Aug 2026", area: "Douglas County", emergency: { name: "Bao Tran", relationship: "Grandfather", phone: "(678) 555-0180" }, preferredPayment: "cash_app" },
  { id: "f-brooks", name: "Brooks", guardians: [g("p-renee", "Renee Brooks", "renee.brooks@example.com", "(404) 555-0107")], address: "640 Riverside Pkwy", city: "Austell", cadence: "weekly", balance: 60, status: "active", joined: "Oct 2025", area: "Cobb County", emergency: { name: "Doris Brooks", relationship: "Grandmother", phone: "(404) 555-0181" }, preferredPayment: "cash_app" },
  { id: "f-patel", name: "Patel", guardians: [g("p-priya", "Priya Patel", "priya.patel@example.com", "(678) 555-0108"), g("p-raj", "Raj Patel", "raj.patel@example.com", "(678) 555-0109")], address: "2218 Lakeview Ter", city: "Lithia Springs", cadence: "monthly", balance: 0, status: "active", joined: "Aug 2025", area: "Douglas County", emergency: { name: "Anita Shah", relationship: "Aunt", phone: "(678) 555-0182" }, preferredPayment: "zelle" },
  { id: "f-davis", name: "Davis", guardians: [g("p-keith", "Keith Davis", "keith.davis@example.com", "(770) 555-0110")], address: "58 Hollow Oak Dr", city: "Douglasville", cadence: "weekly", balance: 0, status: "active", joined: "Jan 2026", area: "Douglas County", emergency: { name: "Tamara Davis", relationship: "Sister", phone: "(770) 555-0183" }, preferredPayment: "zelle" },
  { id: "f-thompson", name: "Thompson", guardians: [g("p-monique", "Monique Thompson", "monique.thompson@example.com", "(404) 555-0111")], address: "319 Memorial Dr", city: "Stone Mountain", cadence: "monthly", balance: 225, status: "active", joined: "Aug 2025", area: "DeKalb County", emergency: { name: "Earl Thompson", relationship: "Grandfather", phone: "(404) 555-0184" }, preferredPayment: "cash_app" },
  { id: "f-carter", name: "Carter", guardians: [g("p-dana", "Dana Carter", "dana.carter@example.com", "(404) 555-0112")], address: "1544 Rockbridge Rd", city: "Stone Mountain", cadence: "weekly", balance: 0, status: "active", joined: "Nov 2025", area: "DeKalb County", emergency: { name: "Paul Carter", relationship: "Father", phone: "(404) 555-0185" }, preferredPayment: "cash_app" },
  { id: "f-reed", name: "Reed", guardians: [g("p-brian", "Brian Reed", "brian.reed@example.com", "(770) 555-0113")], address: "88 Austell Commons", city: "Austell", cadence: "weekly", balance: 0, status: "active", joined: "Aug 2024", area: "Cobb County", emergency: { name: "Sharon Reed", relationship: "Mother", phone: "(770) 555-0186" }, preferredPayment: "zelle" },
  { id: "f-coleman", name: "Coleman", guardians: [g("p-jasmine", "Jasmine Coleman", "jasmine.coleman@example.com", "(404) 555-0114")], address: "2770 Hairston Rd", city: "Stone Mountain", cadence: "monthly", balance: 0, status: "paused", joined: "Sep 2024", area: "DeKalb County", emergency: { name: "Lena Coleman", relationship: "Aunt", phone: "(404) 555-0187" }, preferredPayment: "zelle" },
];

const all: ("mon" | "tue" | "wed" | "thu" | "fri")[] = ["mon", "tue", "wed", "thu", "fri"];

export const children: Child[] = [
  { id: "c-maya", familyId: "f-johnson", first: "Maya", last: "Johnson", age: 8, grade: "3rd", schoolId: "s-pine", teacher: "Ms. Harper", status: "active", medical: "Peanut allergy (EpiPen in backpack)", notes: "Shy with new drivers; likes the front seat.", amRouteId: "r-am-2", pmRouteId: "r-pm-2", service: "both", days: all, price: 95, approvedAdults: [{ id: "aa-1", name: "Gloria Johnson", relationship: "Grandmother", phone: "(678) 555-0177", addedOn: "Aug 12" }, { id: "aa-2", name: "Derek Johnson", relationship: "Uncle", phone: "(678) 555-0172", addedOn: "Oct 3" }], startDate: "Aug 5, 2024" },
  { id: "c-eli", familyId: "f-johnson", first: "Eli", last: "Johnson", age: 6, grade: "1st", schoolId: "s-pine", teacher: "Mr. Okoye", status: "active", amRouteId: "r-am-2", pmRouteId: "r-pm-2", service: "both", days: all, price: 47.5, priceNote: "Sibling, half off", approvedAdults: [{ id: "aa-3", name: "Gloria Johnson", relationship: "Grandmother", phone: "(678) 555-0177", addedOn: "Aug 12" }], startDate: "Aug 5, 2024" },
  { id: "c-zara", familyId: "f-okafor", first: "Zara", last: "Okafor", age: 10, grade: "5th", schoolId: "s-maple", teacher: "Mrs. Bell", status: "active", amRouteId: "r-am-1", pmRouteId: "r-pm-1", service: "both", days: all, price: 360, approvedAdults: [], startDate: "Jan 6, 2025" },
  { id: "c-leo", familyId: "f-martinez", first: "Leo", last: "Martinez", age: 7, grade: "2nd", schoolId: "s-pine", teacher: "Ms. Grant", status: "active", pmRouteId: "r-pm-2", service: "pm", days: all, price: 60, approvedAdults: [{ id: "aa-4", name: "Luis Martinez", relationship: "Uncle", phone: "(678) 555-0178", addedOn: "Sep 1" }], startDate: "Aug 7, 2023" },
  { id: "c-ava", familyId: "f-martinez", first: "Ava", last: "Martinez", age: 11, grade: "6th", schoolId: "s-river", teacher: "Mr. Diaz", status: "active", pmRouteId: "r-pm-3", service: "pm", days: all, price: 30, priceNote: "Sibling, half off", approvedAdults: [], startDate: "Aug 4, 2025" },
  { id: "c-jaden", familyId: "f-williams", first: "Jaden", last: "Williams", age: 9, grade: "4th", schoolId: "s-maple", teacher: "Ms. Chen", status: "active", amRouteId: "r-am-1", pmRouteId: "r-pm-1", service: "both", days: all, price: 95, approvedAdults: [], startDate: "Mar 3, 2025" },
  { id: "c-kai", familyId: "f-nguyen", first: "Kai", last: "Nguyen", age: 5, grade: "K", schoolId: "s-pine", teacher: "Mrs. Lopez", status: "active", amRouteId: "r-am-2", pmRouteId: "r-pm-2", service: "both", days: all, price: 360, medical: "Asthma (inhaler in front pocket)", approvedAdults: [{ id: "aa-5", name: "Bao Tran", relationship: "Grandfather", phone: "(678) 555-0180", addedOn: "Aug 20" }], startDate: "Aug 3, 2026" },
  { id: "c-amari", familyId: "f-brooks", first: "Amari", last: "Brooks", age: 12, grade: "7th", schoolId: "s-river", teacher: "Ms. Ford", status: "active", pmRouteId: "r-pm-3", service: "pm", days: ["mon", "tue", "wed", "thu"], price: 60, approvedAdults: [{ id: "aa-6", name: "Doris Brooks", relationship: "Grandmother", phone: "(404) 555-0181", addedOn: "Oct 14" }], startDate: "Oct 20, 2025" },
  { id: "c-arjun", familyId: "f-patel", first: "Arjun", last: "Patel", age: 8, grade: "3rd", schoolId: "s-maple", teacher: "Mrs. Bell", status: "active", amRouteId: "r-am-1", pmRouteId: "r-pm-1", service: "both", days: all, price: 360, approvedAdults: [], startDate: "Aug 4, 2025" },
  { id: "c-meera", familyId: "f-patel", first: "Meera", last: "Patel", age: 6, grade: "1st", schoolId: "s-maple", teacher: "Ms. Ruiz", status: "active", amRouteId: "r-am-1", pmRouteId: "r-pm-1", service: "both", days: all, price: 180, priceNote: "Sibling, half off", approvedAdults: [], startDate: "Aug 4, 2025" },
  { id: "c-nia", familyId: "f-davis", first: "Nia", last: "Davis", age: 10, grade: "5th", schoolId: "s-pine", teacher: "Mr. Webb", status: "active", amRouteId: "r-am-2", pmRouteId: "r-pm-2", service: "both", days: all, price: 95, approvedAdults: [{ id: "aa-7", name: "Tamara Davis", relationship: "Sister (19)", phone: "(770) 555-0183", addedOn: "Jan 9" }], startDate: "Jan 12, 2026" },
  { id: "c-isaiah", familyId: "f-thompson", first: "Isaiah", last: "Thompson", age: 7, grade: "2nd", schoolId: "s-cedar", teacher: "Ms. Avery", status: "active", amRouteId: "r-am-4", pmRouteId: "r-pm-4", service: "both", days: all, price: 360, approvedAdults: [], startDate: "Aug 4, 2025" },
  { id: "c-mila", familyId: "f-carter", first: "Mila", last: "Carter", age: 9, grade: "4th", schoolId: "s-cedar", teacher: "Mr. Hale", status: "active", amRouteId: "r-am-4", pmRouteId: "r-pm-4", service: "both", days: all, price: 95, approvedAdults: [], startDate: "Nov 3, 2025" },
  { id: "c-owen", familyId: "f-reed", first: "Owen", last: "Reed", age: 11, grade: "6th", schoolId: "s-river", teacher: "Mr. Diaz", status: "active", amRouteId: "r-am-3", pmRouteId: "r-pm-3", service: "both", days: all, price: 95, approvedAdults: [], startDate: "Aug 5, 2024" },
  { id: "c-kayla", familyId: "f-coleman", first: "Kayla", last: "Coleman", age: 8, grade: "3rd", schoolId: "s-cedar", teacher: "Ms. Avery", status: "paused", service: "both", days: all, price: 360, approvedAdults: [], startDate: "Sep 2, 2024" },
  { id: "c-sam", familyId: "f-reed", first: "Sam", last: "Reed", age: 13, grade: "8th", schoolId: "s-river", teacher: "Ms. Ford", status: "active", amRouteId: "r-am-3", service: "am", days: all, price: 50, approvedAdults: [], startDate: "Aug 4, 2025" },
];

export const childName = (c: Child) => `${c.first} ${c.last}`;
