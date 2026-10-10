/**
 * ALL SITE CONTENT LIVES HERE.
 * Everything marked SAMPLE is placeholder — replace with real work, real numbers, real quotes
 * before publishing. Do not ship invented metrics or testimonials.
 */

export const profile = {
  name: "Saif Ullah",
  firstName: "Saif",
  role: "Short-form video editor",
  tagline: "I cut scroll-stopping stories.",
  email: "saifullah55046@gmail.com",
  location: "Pakistan",
  availability: "Open for new projects",
  bio: [
    "I'm Saif — an editor who obsesses over the first three seconds and the last frame. Short-form is a game of attention, and I edit for it: tight hooks, deliberate pacing, captions that land, sound that pulls.",
    "I also come from long-form. I've produced documentary-style fact videos for my own YouTube channel, which is where I learned how to hold a story together — and why every Reel I cut still has a beginning, a middle and a reason to watch till the end.",
  ],
  milestones: [
    { year: "2020", text: "Started editing" },
    { year: "2021", text: "Launched documentary-style facts channel on YouTube" },
    { year: "2024", text: "Moved into short-form for creators & brands" },
    { year: "Now", text: "Cutting Reels, TikToks & Shorts" },
  ],
};

export type Category = "Explainers" | "Real Estate" | "Talking Head" | "Storytelling" | "Branding" | "Showcase";
export const categories: ("All" | Category)[] = ["All", "Explainers", "Real Estate", "Talking Head", "Storytelling", "Branding", "Showcase"];

export type Project = {
  slug: string;
  title: string;
  /** leave "" if unknown — it is simply not shown */
  client: string;
  category: Category;
  /** optional, e.g. "2026" — not shown when omitted */
  year?: string;
  role: string;
  tools: string[];
  /** two gradient stops, shown behind the poster while it loads */
  hue: [string, string];
  /** files live in /public/work, e.g. "/work/clip-1.mp4" */
  video?: string;
  poster?: string;
  /** YouTube video id for big files: the project page shows a click-to-load player */
  youtube?: string;
  summary: string;
  /** leave "" to hide a section on the project page */
  challenge: string;
  approach: string;
  result: string;
  metrics: { label: string; value: string }[];
};

export const projects: Project[] = [
  {
    slug: "behind-40k-deal",
    title: "Behind a $40,000 Deal",
    client: "", // add the brand / client name if you want it shown
    category: "Explainers",
    role: "Editing, motion graphics",
    tools: [], // add the tools you used for this one, e.g. ["CapCut"] (I can't tell from the video)
    hue: ["#3dd9f5", "#7c6cff"],
    video: "/work/behind-40k-deal.mp4",
    poster: "/work/behind-40k-deal.jpg",
    summary: "A talking-head explainer where animated UI graphics visualise each point as it is spoken.",
    challenge: "",
    approach: "",
    result: "",
    metrics: [
      { label: "Length", value: "0:51" },
      { label: "Format", value: "9:16 vertical" },
    ],
  },
  {
    slug: "branding-secret-90",
    title: "Branding Secret #90",
    client: "kayn.",
    category: "Branding",
    role: "Editing, typography, motion graphics",
    tools: [], // add the tools you used for this one, e.g. ["CapCut"] (I can't tell from the video)
    hue: ["#ffb340", "#ff5c8a"],
    video: "/work/branding-secret-90.mp4",
    poster: "/work/branding-secret-90.jpg",
    summary: "A high-contrast reel in black, white and red that turns a branding idea into bold, rhythmic typography and motion.",
    challenge: "",
    approach: "",
    result: "",
    metrics: [
      { label: "Length", value: "0:16" },
      { label: "Format", value: "9:16 vertical" },
    ],
  },
  {
    slug: "complex-ideas-explainer",
    title: "Complex Ideas, Made Simple",
    client: "", // add the brand / client name if you want it shown
    category: "Explainers",
    role: "Editing, collage animation, kinetic type",
    tools: [], // add the tools you used for this one, e.g. ["CapCut"] (I can't tell from the video)
    hue: ["#ff5c8a", "#ffb340"],
    video: "/work/complex-ideas-explainer.mp4",
    poster: "/work/complex-ideas-explainer.jpg",
    summary: "A collage-style explainer built from archival photos, cut-outs and kinetic type that makes a big idea easy to follow.",
    challenge: "",
    approach: "",
    result: "",
    metrics: [
      { label: "Length", value: "0:49" },
      { label: "Format", value: "9:16 vertical" },
    ],
  },
  {
    slug: "shahid-khan-story",
    title: "The Shahid Khan Story",
    client: "", // add the brand / client name if you want it shown
    category: "Storytelling",
    role: "Editing, kinetic type, storytelling",
    tools: [], // add the tools you used for this one, e.g. ["CapCut"] (I can't tell from the video)
    hue: ["#7c6cff", "#3dd9f5"],
    video: "/work/shahid-khan-story.mp4",
    poster: "/work/shahid-khan-story.jpg",
    summary: "A documentary-style short that tells a founder's story with kinetic type, B-roll and punchy red-and-white graphics.",
    challenge: "",
    approach: "",
    result: "",
    metrics: [
      { label: "Length", value: "1:00" },
      { label: "Format", value: "9:16 vertical" },
    ],
  },
  {
    slug: "clients-come-to-me",
    title: "Clients Come to Me",
    client: "", // add the brand / client name if you want it shown
    category: "Real Estate",
    role: "Editing, captions, callouts",
    tools: [], // add the tools you used for this one, e.g. ["CapCut"] (I can't tell from the video)
    hue: ["#3dd9f5", "#ff5c8a"],
    video: "/work/clients-come-to-me.mp4",
    poster: "/work/clients-come-to-me.jpg",
    summary: "A real-estate talking-head edit with screenshot callouts and glowing keywords that keep the hook moving.",
    challenge: "",
    approach: "",
    result: "",
    metrics: [
      { label: "Length", value: "0:37" },
      { label: "Format", value: "9:16 vertical" },
    ],
  },
  {
    slug: "how-you-talk",
    title: "How You Talk About Others",
    client: "", // add the brand / client name if you want it shown
    category: "Talking Head",
    role: "Editing, animated captions, graphics",
    tools: [], // add the tools you used for this one, e.g. ["CapCut"] (I can't tell from the video)
    hue: ["#7c6cff", "#ff5c8a"],
    video: "/work/how-you-talk.mp4",
    poster: "/work/how-you-talk.jpg",
    summary: "A podcast-style clip with animated captions and simple graphics that make a psychology point stick.",
    challenge: "",
    approach: "",
    result: "",
    metrics: [
      { label: "Length", value: "0:35" },
      { label: "Format", value: "9:16 vertical" },
    ],
  },
  {
    slug: "interest-media",
    title: "Interest Media",
    client: "", // add the brand / client name if you want it shown
    category: "Talking Head",
    role: "Editing, captions, callouts",
    tools: [], // add the tools you used for this one, e.g. ["CapCut"] (I can't tell from the video)
    hue: ["#3dd9f5", "#7c6cff"],
    video: "/work/interest-media.mp4",
    poster: "/work/interest-media.jpg",
    summary: "A commentary edit that cuts between a presenter and interview footage, with clean captions and animated callouts.",
    challenge: "",
    approach: "",
    result: "",
    metrics: [
      { label: "Length", value: "0:55" },
      { label: "Format", value: "9:16 vertical" },
    ],
  },
  {
    slug: "ready-to-buy-house",
    title: "Ready vs. Able to Buy a House",
    client: "", // add the brand / client name if you want it shown
    category: "Real Estate",
    role: "Editing, kinetic typography",
    tools: [], // add the tools you used for this one, e.g. ["CapCut"] (I can't tell from the video)
    hue: ["#ffb340", "#ff5c8a"],
    video: "/work/ready-to-buy-house.mp4",
    poster: "/work/ready-to-buy-house.jpg",
    summary: "A walk-and-talk real-estate reel with stylish kinetic typography and on-screen visuals.",
    challenge: "",
    approach: "",
    result: "",
    metrics: [
      { label: "Length", value: "0:48" },
      { label: "Format", value: "9:16 vertical" },
    ],
  },
  {
    slug: "my-version-of-creativity",
    title: "My Version of Creativity",
    client: "", // add the brand / client name if you want it shown
    category: "Talking Head",
    role: "Editing, captions, graphics",
    tools: [], // add the tools you used for this one, e.g. ["CapCut"] (I can't tell from the video)
    hue: ["#ff5c8a", "#ffb340"],
    video: "/work/my-version-of-creativity.mp4",
    poster: "/work/my-version-of-creativity.jpg",
    summary: "A calm talking-head edit with captions timed to the voice and bold graphic inserts for emphasis.",
    challenge: "",
    approach: "",
    result: "",
    metrics: [
      { label: "Length", value: "0:52" },
      { label: "Format", value: "9:16 vertical" },
    ],
  },
  {
    slug: "listing-strategy",
    title: "Listing Strategy",
    client: "", // add the brand / client name if you want it shown
    category: "Real Estate",
    role: "Editing, kinetic type, UI overlays",
    tools: [], // add the tools you used for this one, e.g. ["CapCut"] (I can't tell from the video)
    hue: ["#7c6cff", "#3dd9f5"],
    video: "/work/listing-strategy.mp4",
    poster: "/work/listing-strategy.jpg",
    summary: "A property-marketing reel with elegant kinetic text, photo and video overlays and a phone-call UI moment.",
    challenge: "",
    approach: "",
    result: "",
    metrics: [
      { label: "Length", value: "0:20" },
      { label: "Format", value: "9:16 vertical" },
    ],
  },
  {
    slug: "save-this-one",
    title: "Save This One",
    client: "", // add the brand / client name if you want it shown
    category: "Explainers",
    role: "Editing, on-screen guides, motion graphics",
    tools: [], // add the tools you used for this one, e.g. ["CapCut"] (I can't tell from the video)
    hue: ["#3dd9f5", "#ff5c8a"],
    video: "/work/save-this-one.mp4",
    poster: "/work/save-this-one.jpg",
    summary: "A creator tip with on-screen safe-zone boxes showing where the hook goes and what to keep clear.",
    challenge: "",
    approach: "",
    result: "",
    metrics: [
      { label: "Length", value: "0:15" },
      { label: "Format", value: "9:16 vertical" },
    ],
  },
  {
    slug: "how-ai-gets-its-answer",
    title: "How Does AI Get Its Answer?",
    client: "", // add the brand / client name if you want it shown
    category: "Explainers",
    role: "Editing, hand-drawn style animation",
    tools: [], // add the tools you used for this one, e.g. ["CapCut"] (I can't tell from the video)
    hue: ["#7c6cff", "#ff5c8a"],
    video: "/work/how-ai-gets-its-answer.mp4",
    poster: "/work/how-ai-gets-its-answer.jpg",
    summary: "A hand-drawn style explainer that turns an AI concept into animated doodles synced to the voice.",
    challenge: "",
    approach: "",
    result: "",
    metrics: [
      { label: "Length", value: "1:09" },
      { label: "Format", value: "9:16 vertical" },
    ],
  },
  {
    slug: "before-after-edit",
    title: "Before → After Edit",
    client: "", // add the brand / client name if you want it shown
    category: "Showcase",
    role: "Editing, motion graphics, transitions",
    tools: [], // add the tools you used for this one, e.g. ["CapCut"] (I can't tell from the video)
    hue: ["#7c6cff", "#ff5c8a"],
    video: "/work/before-after-edit.mp4",
    poster: "/work/before-after-edit.jpg",
    summary: "A raw-vs-edit breakdown: the same talking-head footage, then the finished cut with animated captions, emoji pops and designed transitions.",
    challenge: "",
    approach: "",
    result: "",
    metrics: [
      { label: "Length", value: "0:23" },
      { label: "Format", value: "9:16 vertical" },
    ],
  },
];

export const process = [
  { n: "01", title: "Hook", text: "The first 1–3 seconds decide everything. I script and test openings before touching the rest." },
  { n: "02", title: "Pace", text: "Cuts on beat and on thought. Every shot earns its place or it goes." },
  { n: "03", title: "Captions", text: "Readable, on-brand, animated to the voice — most people watch on mute." },
  { n: "04", title: "Sound", text: "Music, SFX and voice mixed so it hits on a phone speaker and in headphones." },
  { n: "05", title: "Deliver", text: "Platform-correct exports, fast turnaround, and revisions without drama." },
];

export const tools = [
  { name: "CapCut", level: 90 },
  { name: "Filmora", level: 85 },
  { name: "Higgsfield", level: 75 },
  { name: "Veo", level: 75 },
  { name: "HeyGen", level: 70 },
  { name: "Runway", level: 70 },
]; // TODO adjust the levels to what you actually use

/** SAMPLE stats — replace with real, defensible numbers */
export const stats = [
  { value: 100, suffix: "+", label: "Videos delivered" },
  { value: 3, suffix: "", label: "Platforms mastered" },
  { value: 24, suffix: "h", label: "Typical first draft" },
  { value: new Date().getFullYear() - 2020, suffix: "+ yrs", label: "Editing experience" }, // since 2020
];

export type Testimonial = {
  /** the full quote, exactly as the client wrote it (kept for screen readers) */
  quote: string;
  /** one verbatim sentence from the quote — this is what the card shows, in large type */
  highlight?: string;
  name: string;
  /** e.g. "Real-estate agent" or "Founder, Brand" */
  role?: string;
  /** short proof badge, e.g. "2.1M views on the first reel" — the strongest trust signal */
  result?: string;
  /** where it came from, e.g. "Instagram DM", "Fiverr review" */
  source?: string;
  /** a real photo of the client, e.g. "/clients/sophia.jpg" */
  avatar?: string;
  /** link to their profile / channel so visitors can verify them */
  href?: string;
};

/**
 * IMPORTANT — testimonials must be REAL quotes from real clients who agreed to be quoted.
 * Invented or generated reviews presented as genuine are deceptive (and illegal in many places),
 * and prospects check. The section stays hidden until you switch this on.
 * Set to true ONLY when every quote below is genuine.
 */
export const SHOW_TESTIMONIALS = true;

export const testimonials: Testimonial[] = [
  { quote: "Working with Saif has honestly been one of the best decisions I've made for my content. He doesn't just edit videos; he genuinely cares about every little detail. It's rare to find someone who understands your vision and puts so much heart into bringing it to life. Really grateful to have him on my team.", highlight: "He doesn't just edit videos; he genuinely cares about every little detail.", name: "Roman" },
  { quote: "I used to struggle with making my videos feel engaging, but Saif completely changed that. He has this amazing ability to take simple footage and turn it into something people actually want to watch. I love how my content feels now!", highlight: "He has this amazing ability to take simple footage and turn it into something people actually want to watch.", name: "Sophia Martinez" },
  { quote: "What impressed me most about Saif wasn't just his editing skills, but how easy he made the entire process. He listens, communicates clearly, and consistently delivers quality work. Having someone you can genuinely depend on makes all the difference.", highlight: "He listens, communicates clearly, and consistently delivers quality work.", name: "James Anderson" },
  { quote: "I had so many ideas in my head but never knew how to bring them together. Saif somehow understood exactly what I was imagining. Seeing my first finished reel genuinely made me smile. He puts so much care into his work, and it really shows.", highlight: "Saif somehow understood exactly what I was imagining.", name: "Emily Carter" },
  { quote: "I've worked with different editors before, but Saif just gets it. Great storytelling, clean edits, and always the right energy. I can send him raw footage and feel confident he'll turn it into something worth posting.", highlight: "I can send him raw footage and feel confident he'll turn it into something worth posting.", name: "Daniel Brooks" },
  { quote: "The best part about working with Saif is the peace of mind. I don't have to explain every tiny detail or constantly ask for changes. He understands my style, respects my ideas, and makes every video feel like me. That means a lot.", highlight: "The best part about working with Saif is the peace of mind.", name: "Olivia Bennett" },
  { quote: "Saif understands that a good reel isn't just about fancy transitions. It's about catching attention and telling a story that keeps people watching. He brought a level of creativity and thoughtfulness to our content that we were missing before.", highlight: "It's about catching attention and telling a story that keeps people watching.", name: "Michael Thompson" },
  { quote: "You can really tell when someone loves what they do. Saif puts genuine effort into every project, no matter how small. He's patient with feedback, always open to ideas, and somehow makes the final result better than I expected. Such a pleasure to work with!", highlight: "He's patient with feedback, always open to ideas, and somehow makes the final result better than I expected.", name: "Isabella Rose" },
  { quote: "Honestly, Saif makes my life so much easier. I send him my footage, share a few ideas, and he handles the rest. The edits are always clean, the pacing feels right, and I never have to stress about the final result. Couldn't recommend him enough.", highlight: "The edits are always clean, the pacing feels right, and I never have to stress about the final result.", name: "Alex Morgan" },
  { quote: "What I appreciate most about Saif is that he treats my content like it matters. Not just another video to finish, but something that represents me and my work. That kind of dedication is hard to find, and it's exactly why I enjoy working with him.", highlight: "Not just another video to finish, but something that represents me and my work.", name: "Charlotte Wilson" },
];

export const budgets = ["Under $200", "$200 – $500", "$500 – $1,500", "$1,500+", "Not sure yet"];
export const projectTypes = ["Reels", "TikTok", "YouTube Shorts", "Ads / UGC", "Podcast clips", "Other"];
