import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Brain,
  CalendarClock,
  History,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Palette,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

export const heroStats = [
  { label: "24/7 lead capture", sub: "Never miss after-hours interest" },
  { label: "Faster follow-up", sub: "Alerts while intent is hot" },
  { label: "Less missed revenue", sub: "Convert chats, not just clicks" },
];

export const painPoints = [
  {
    title: "Slow replies lose hot prospects",
    body: "Visitors expect instant answers — especially on mobile. Every minute of silence increases bounce rate.",
  },
  {
    title: "Forms feel cold and reduce intent",
    body: "Long static forms kill momentum. Conversational capture keeps people engaged and sharing details.",
  },
  {
    title: "Generic bots damage trust",
    body: "Wrong pricing or invented promises hurt your brand. You need answers grounded in your real business data.",
  },
];

export const beforeItems = [
  "Missed chats after hours",
  "Cold contact forms",
  "Manual follow-up chaos",
  "Unqualified inquiries flooding inbox",
];

export const afterItems = [
  "Instant grounded answers",
  "Lead capture inside chat",
  "Qualified status & summaries",
  "Email alerts to your team",
  "Full conversation history",
];

export const howSteps = [
  {
    n: 1,
    title: "Add business context",
    body: "Services, pricing, FAQs, hours, and tone — everything the AI is allowed to say.",
    visual: "Business profile · Knowledge base",
  },
  {
    n: 2,
    title: "Customize your AI chatbot",
    body: "Brand color, greeting, lead fields, and handover rules tuned to your workflow.",
    visual: "Chatbot settings · Branding",
  },
  {
    n: 3,
    title: "Embed and start capturing leads",
    body: "One script on your site or a shareable chat link — leads flow to your dashboard.",
    visual: "Embed code · Live inbox",
  },
];

export type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  tag?: string;
};

export const features: FeatureItem[] = [
  {
    icon: Zap,
    title: "Grounded business answers",
    description:
      "Responses use your profile and uploaded docs — no invented prices or false promises.",
    tag: "RAG-ready",
  },
  {
    icon: CalendarClock,
    title: "Lead capture",
    description:
      "Collect name, phone, email, service interest, timing, and notes inside the conversation.",
  },
  {
    icon: Bot,
    title: "Qualification logic",
    description:
      "Statuses like Qualified and Needs human keep your team focused on ready buyers.",
  },
  {
    icon: History,
    title: "Conversation history",
    description:
      "Every turn saved with AI summaries so you review context in seconds, not minutes.",
  },
  {
    icon: Sparkles,
    title: "Embeddable widget",
    description:
      "Floating launcher + responsive chat for any website — install in about 60 seconds.",
  },
  {
    icon: Mail,
    title: "Email alerts",
    description:
      "Get notified on new leads, live-agent requests, and qualified opportunities.",
  },
  {
    icon: Palette,
    title: "Custom branding",
    description:
      "Chatbot name, colors, and greeting that match your brand on the page.",
  },
  {
    icon: LayoutDashboard,
    title: "Team-ready dashboard",
    description:
      "Leads, conversations, live chat inbox, and settings in one workspace.",
  },
];

export type IndustryItem = {
  label: string;
  emoji: string;
  useCase: string;
};

export const industries: IndustryItem[] = [
  {
    label: "Clinics",
    emoji: "🏥",
    useCase: "Book consultations, answer pricing questions, capture patient interest.",
  },
  {
    label: "Salons",
    emoji: "💇",
    useCase: "Capture service, preferred date, and contact details in one chat.",
  },
  {
    label: "Real Estate",
    emoji: "🏠",
    useCase: "Qualify buyers and renters, collect budget, area, and viewing interest.",
  },
  {
    label: "Gyms",
    emoji: "🏋️",
    useCase: "Answer membership questions and capture trial sign-up intent.",
  },
  {
    label: "Restaurants",
    emoji: "🍽️",
    useCase: "Handle catering inquiries, hours, menus, and reservation interest.",
  },
  {
    label: "Home Services",
    emoji: "🔧",
    useCase: "Capture job type, location, urgency, and callback details.",
  },
  {
    label: "Agencies",
    emoji: "📣",
    useCase: "Qualify project scope, timeline, and budget before discovery calls.",
  },
];

export const trustPoints = [
  {
    icon: Brain,
    title: "Your context, not the open web",
    body: "Uses your services, pricing, FAQs, and policies — not random internet guesses.",
  },
  {
    icon: ShieldCheck,
    title: "Guardrails against false promises",
    body: "Designed to avoid inventing prices, medical claims, or guarantees you can't keep.",
  },
  {
    icon: Users,
    title: "Human handover when needed",
    body: "Escalates uncertain conversations and supports live agent takeover.",
  },
  {
    icon: MessageSquare,
    title: "Reviewable history",
    body: "Every conversation stored with summaries for accountability and follow-up.",
  },
];

export const pricingPlans = [
  {
    name: "Starter",
    price: "$99",
    description: "One chatbot, full dashboard, email alerts.",
    features: [
      "Up to 500 conversations / mo",
      "Lead capture + qualification",
      "Email notifications",
      "Embed widget",
    ],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$199",
    description: "Higher limits, priority routing, team collaboration.",
    features: [
      "Up to 2,500 conversations / mo",
      "Custom branding & color",
      "Priority alerts + analytics",
      "Team seats (coming)",
    ],
    highlighted: true,
  },
  {
    name: "Pro",
    price: "$399",
    description: "Multi-location, advanced routing (roadmap).",
    features: [
      "Unlimited conversations",
      "Multiple businesses",
      "Custom integrations",
      "Dedicated support",
    ],
    highlighted: false,
  },
];

export const faqItems = [
  {
    q: "How fast can I install QualifyChat?",
    a: "Most businesses are live in under 60 seconds — add your business profile, copy the embed snippet, and paste it before the closing </body> tag on your site.",
  },
  {
    q: "Does it work on any website?",
    a: "Yes. QualifyChat works on WordPress, Shopify, Webflow, custom HTML, and most site builders via a single script tag or direct chat link.",
  },
  {
    q: "Can I customize the chatbot?",
    a: "Yes. Set your chatbot name, greeting, brand color, lead capture fields, and handover message from the dashboard.",
  },
  {
    q: "Can it capture phone numbers and emails?",
    a: "Yes. The assistant asks naturally during conversation and stores structured lead fields in your dashboard.",
  },
  {
    q: "Will it make up answers?",
    a: "It's designed to answer from your business profile and uploaded knowledge. When information is missing, it says your team can confirm — not invent details.",
  },
  {
    q: "Can I review conversations?",
    a: "Every chat is saved with conversation history and AI summaries so you can review before follow-up.",
  },
  {
    q: "Do I need a credit card for the demo?",
    a: "No. Start free, explore the demo business, and test the chatbot before choosing a plan.",
  },
  {
    q: "Can it work for clinics, salons, real estate, and services?",
    a: "Yes. QualifyChat is built for local and service businesses that need 24/7 response and structured lead capture.",
  },
];

export const liveDemoScript = [
  { role: "bot" as const, text: "Hi! How can I help you today?" },
  { role: "user" as const, text: "I'd like a Hydrafacial — do you have slots this week?" },
  {
    role: "bot" as const,
    text: "Hydrafacial starts from $80. I can help you book — what's your name and best email?",
  },
  { role: "user" as const, text: "Sarah Chen, sarah@example.com, 555-0142" },
  {
    role: "bot" as const,
    text: "Perfect, Sarah. I've noted Hydrafacial interest for this week. Our team will confirm your slot shortly.",
  },
];

export type LeadStage = "visitor" | "engaged" | "captured" | "qualified";

export const leadStages: { key: LeadStage; label: string }[] = [
  { key: "visitor", label: "New Visitor" },
  { key: "engaged", label: "Engaged" },
  { key: "captured", label: "Contact Captured" },
  { key: "qualified", label: "Qualified Lead" },
];
