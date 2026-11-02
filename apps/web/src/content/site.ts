/*
 * All site copy lives here so it can be reviewed with the client in one place.
 * Facts come from the PRD and the current rushhourkidstransportation.com site.
 * Anything marked CONFIRM needs Clara's sign-off before launch.
 */

export const contact = {
  phone: "(404) 427-6780",
  phoneHref: "tel:+14044276780",
  smsHref: "sms:+14044276780",
  email: "rushhour3333@yahoo.com",
  emailHref: "mailto:rushhour3333@yahoo.com",
  region: "Metro Atlanta, Georgia",
};

export const nav = [
  { label: "Services", href: "/services" },
  { label: "Our App", href: "/our-app" },
  { label: "Service Areas", href: "/service-areas" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

export const applicationFee = 25;

export const stats = [
  { value: "20", suffix: "yrs", label: "Driving metro Atlanta kids" },
  { value: "4", suffix: "vans", label: "Each with its own route" },
  { value: "5", suffix: "areas", label: "Across metro Atlanta" },
  { value: "10–12", suffix: "kids", label: "Per van, so every child is known" },
];

export type ServiceColor = "bus" | "coral" | "sky" | "mint" | "lilac";

export const services: {
  slug: string;
  title: string;
  short: string;
  body: string;
  points: string[];
  color: ServiceColor;
  icon: "school" | "sun" | "pin" | "arrow" | "loop" | "calendar" | "flag" | "palm";
}[] = [
  {
    slug: "before-after-school",
    title: "Before & after school",
    short: "Pick-up in the morning, drop-off in the afternoon, on the days you choose.",
    body: "Our core service. Choose before school, after school or both for each weekday, and we build your child into a van route that gets them to class on time and home safely.",
    points: ["Pick the days that suit your week", "Home or satellite-stop pick-up", "Every child checked on and off"],
    color: "bus",
    icon: "school",
  },
  {
    slug: "daily-trips",
    title: "Daily trips",
    short: "Rides to school, after-school programs or playdates.",
    body: "Need a ride for one day? Daily trips cover school, after-school programs and playdates, with the same drivers and the same safety checks as our regular routes.",
    points: ["School, programs and playdates", "Book only the days you need"],
    color: "sky",
    icon: "sun",
  },
  {
    slug: "satellite-stops",
    title: "Satellite stops",
    short: "Meet the van at a set spot, so your child can attend a school outside your district.",
    body: "Satellite stops let you meet our drivers at a set location near you. It is the easiest way for your child to attend a school in your preferred district, even if it is outside your home area.",
    points: ["Set meeting points", "Great for out-of-district schools"],
    color: "mint",
    icon: "pin",
  },
  {
    slug: "one-way-trips",
    title: "One-way trips",
    short: "Just there, or just back, to school, a program or a special event.",
    body: "When you only need one leg covered, book a one-way trip to school, an after-school program or a special event.",
    points: ["Morning or afternoon only", "School, programs and events"],
    color: "coral",
    icon: "arrow",
  },
  {
    slug: "round-trips",
    title: "Round trips",
    short: "There and back again, with the same friendly driver.",
    body: "Round trips cover both legs of the journey, so your child gets to where they need to be and comes home again.",
    points: ["Both legs covered", "Weekly or monthly"],
    color: "lilac",
    icon: "loop",
  },
  {
    slug: "monthly-plans",
    title: "Monthly plans",
    short: "Monthly round trips or one-way trips for regular schedules.",
    body: "For families with a steady routine, monthly round-trip and one-way plans keep things simple.",
    points: ["Monthly round trips", "Monthly one-way trips"],
    color: "sky",
    icon: "calendar",
  },
  {
    slug: "field-trips",
    title: "Field trips",
    short: "Museums, parks, the zoo, the aquarium, historical sites and sports.",
    body: "Our field-day rides take children to museums, parks, the zoo, the aquarium, historical sites and sports activities, with experienced drivers and secure vehicles.",
    points: ["Museums, parks and more", "Sports activities"],
    color: "mint",
    icon: "flag",
  },
  {
    slug: "summer-programs",
    title: "Summer programs",
    short: "School's out, rides are not. Pick-up and drop-off for summer programs.",
    body: "During the summer our vans pick up and drop off children at their summer programs and other set locations.",
    points: ["Summer camp and program runs", "Set pick-up and drop-off spots"],
    color: "bus",
    icon: "palm",
  },
];

export const steps = [
  {
    title: "Apply online",
    body: `Fill in one application per child and pay the $${applicationFee} application fee to hold their spot.`,
  },
  {
    title: "We confirm your spot",
    body: "Our office checks your address is in a service area with room on a van, then sends your welcome and your app access code.",
  },
  {
    title: "Plan your week",
    body: "Choose before school, after school or both for each weekday. Last week's plan is filled in for you.",
  },
  {
    title: "Ride and relax",
    body: "Follow the van live and get a message when your child boards and arrives. Nobody has to text anyone.",
  },
] as const;

export const rideAlerts = [
  { time: "7:02", title: "Driver is on the way", detail: "About 10 minutes from your stop", tone: "sky" },
  { time: "7:09", title: "Driver is close", detail: "A few minutes away", tone: "bus" },
  { time: "7:13", title: "Ava boarded safely", detail: "Checked on by your driver", tone: "mint" },
  { time: "7:41", title: "Arrived at drop-off", detail: "Checked off at school", tone: "lilac" },
] as const;

export const safety = [
  { title: "Checked on and off", body: "The driver checks every child on when they board and off at drop-off, and you get a message each time." },
  { title: "No child left on board", body: "At the end of every route the driver walks the van and confirms it is empty before the route can close." },
  { title: "The office is watching", body: "Our office sees every van live, with who is on board and whether each route is on time." },
  { title: "Ready for the unexpected", body: "Drivers have a step-by-step emergency report, and the office can message every family on a route at once." },
];

export const areas = [
  { name: "Decatur", note: "DeKalb County", x: 63, y: 50 },
  { name: "Stone Mountain", note: "DeKalb County", x: 82, y: 40 },
  { name: "Douglas County", note: "West metro", x: 14, y: 58 },
  { name: "Fulton County", note: "Central metro", x: 40, y: 42 },
  { name: "Gwinnett County", note: "Northeast metro", x: 76, y: 16 },
];

export const appFeatures = [
  { title: "Live ride tracking", body: "See where the van is on a map and when it will arrive." },
  { title: "Ride alerts", body: "“Driver is 8 min away”, “Ava boarded safely”, “Arrived at drop-off”." },
  { title: "Ride planner", body: "Choose before school, after school or both for each weekday, and book one-off trips." },
  { title: "Report an absence", body: "Tap “Not riding today” and the driver skips your stop." },
  { title: "Pay in the app", body: "Pay by card or turn on auto-pay. Every invoice and receipt in one place." },
  { title: "Message the office", body: "A private chat with our office. Announcements arrive here too." },
];

// CONFIRM: answers below follow the PRD; pricing details and policies are still open questions for Clara.
export const faqs = [
  {
    q: "How do I sign my child up?",
    a: `Fill in the online application, one per child, and pay the $${applicationFee} application fee. Our office reviews it, checks your address is in a service area with space on a van, and sends you a welcome message with your app access code.`,
  },
  {
    q: "How much does a ride cost?",
    a: "Prices depend on the days and trips you need, so please call us for a quote. Families pay weekly, and there is a one-time $25 application fee per child.",
  },
  {
    q: "Which areas do you serve?",
    a: "Decatur, Stone Mountain, Douglas County, Fulton County and Gwinnett County. If you are close by but not sure, give us a call.",
  },
  {
    q: "Can my child attend a school outside our district?",
    a: "Yes. Many of our families use satellite stops, where you meet the van at a set location, so their child can attend a school in their preferred district.",
  },
  {
    q: "Does my child need a phone?",
    a: "No. The driver checks each child on and off the van, and you get the alerts on your phone.",
  },
  {
    q: "How will I know where the van is?",
    a: "The Rush Hour Kids app shows the van live on a map and sends you a message when the driver is close, when your child boards and when they arrive.",
  },
  {
    q: "What if my child isn't riding today?",
    a: "Tap “Not riding today” in the app, or pick a future day. The driver's list updates so the van skips your stop.",
  },
  {
    q: "What about my child's medical needs?",
    a: "The application asks about medical concerns. Your driver sees these notes for your child on their route.",
  },
  {
    q: "Do you do field trips and summer programs?",
    a: "Yes. We take children to museums, parks, the zoo, the aquarium, historical sites and sports activities, and we run pick-up and drop-off for summer programs.",
  },
];
