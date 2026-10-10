/* =====================================================================
   YOUR CONTENT — the only file you need to edit day to day.

   - Replace every text in [square brackets] with your own details.
     Placeholders are intentionally generic. Nothing here is a real claim.
   - Wallpapers: put each image in assets/wallpapers/ using the exact
     file name shown (phase-1.jpg … phase-8.jpg). Until a file exists,
     that phase shows its colour gradient instead.
   - Keep the text inside the quotation marks. Do not delete commas.
   - Colours use HEX codes, e.g. "#d9b77a".
   ===================================================================== */
window.SITE_CONTENT = {

  /* ---------- Your details ---------- */
  owner: {
    name: "[Your Full Name]",
    initials: "[YF]",                      // short logo text, e.g. "AB"
    role: "[Your title, e.g. Designer & Developer]",
    tagline: "[One sentence about what you do and who you help.]",
    location: "[City, Country]",
    email: "you@example.com",
    phone: "[+00 00000 00000]",
    cvUrl: "",                             // e.g. "assets/cv.pdf" — leave "" to hide the button
    social: [
      { label: "LinkedIn", url: "https://www.linkedin.com/" },
      { label: "GitHub", url: "https://github.com/" },
      { label: "Instagram", url: "https://www.instagram.com/" }
    ]
  },

  /* ---------- The eight phases (top to bottom) ----------
     type:      hero | about | timeline | principles | skills | work | approach | focus
     tone:      "dark" (light text) or "light" (dark text on a bright wallpaper)
     accent:    colour used for highlights in this phase
     focus:     which part of the wallpaper stays visible on small screens,
                e.g. "70% 50%" (left/right, top/bottom)
     fallback:  two colours shown before the wallpaper loads or if it is missing
  --------------------------------------------------------- */
  phases: [
    {
      id: 1, type: "hero", name: "Opening",
      wallpaper: "assets/wallpapers/phase-1.jpg",
      focus: "72% 50%", tone: "dark", accent: "#d9b77a",
      fallback: ["#070706", "#3a2d1b"],
      ctaPrimary: { label: "View selected work", target: "phase-6" },
      ctaSecondary: { label: "Get in touch", target: "contact" }
    },
    {
      id: 2, type: "about", name: "Origin",
      heading: "Who I am",
      intro: "[A two-sentence summary of your background, in your own voice.]",
      paragraphs: [
        "[First paragraph: where you started and what first drew you to your work.]",
        "[Second paragraph: what you care about now and the kind of work you want to do next.]"
      ],
      facts: [
        { label: "Based in", value: "[City, Country]" },
        { label: "Working as", value: "[Your role]" },
        { label: "Languages", value: "[English, …]" }
      ],
      wallpaper: "assets/wallpapers/phase-2.jpg",
      focus: "70% 50%", tone: "dark", accent: "#6fdcff",
      fallback: ["#080b1c", "#2a1f5e"]
    },
    {
      id: 3, type: "timeline", name: "Journey",
      heading: "The journey so far",
      intro: "[A short line about how your path has developed.]",
      items: [
        { period: "[Year – Year]", title: "[Role or milestone]", org: "[Organisation]", text: "[What you did and what you learned.]" },
        { period: "[Year – Year]", title: "[Role or milestone]", org: "[Organisation]", text: "[What you did and what you learned.]" },
        { period: "[Year – Present]", title: "[Current role]", org: "[Organisation]", text: "[What you do today.]" }
      ],
      wallpaper: "assets/wallpapers/phase-3.jpg",
      focus: "50% 40%", tone: "light", accent: "#9c6b4f",
      fallback: ["#a7b6c2", "#e6d3c0"]
    },
    {
      id: 4, type: "principles", name: "Mindset",
      heading: "What guides my work",
      intro: "[A line about the values behind your work.]",
      items: [
        { title: "[Principle one]", text: "[How this shows up in your work.]" },
        { title: "[Principle two]", text: "[How this shows up in your work.]" },
        { title: "[Principle three]", text: "[How this shows up in your work.]" }
      ],
      wallpaper: "assets/wallpapers/phase-4.jpg",
      focus: "70% 50%", tone: "dark", accent: "#bcd6ff",
      fallback: ["#05070f", "#2c3446"]
    },
    {
      id: 5, type: "skills", name: "Capabilities",
      heading: "Skills & tools",
      intro: "[A short summary of what you are good at.]",
      groups: [
        { title: "[Category one]", items: ["[Skill]", "[Skill]", "[Skill]", "[Skill]"] },
        { title: "[Category two]", items: ["[Skill]", "[Skill]", "[Skill]", "[Skill]"] },
        { title: "[Category three]", items: ["[Skill]", "[Skill]", "[Skill]", "[Skill]"] }
      ],
      wallpaper: "assets/wallpapers/phase-5.jpg",
      focus: "70% 50%", tone: "dark", accent: "#5fe0e6",
      fallback: ["#05101a", "#1b4455"]
    },
    {
      id: 6, type: "work", name: "Work",
      heading: "Selected work",
      intro: "[One line describing the kind of projects shown here.]",
      projects: [
        { title: "[Project title]", category: "[Category]", year: "[Year]", summary: "[What it was, your role, and the outcome.]", link: "#" },
        { title: "[Project title]", category: "[Category]", year: "[Year]", summary: "[What it was, your role, and the outcome.]", link: "#" },
        { title: "[Project title]", category: "[Category]", year: "[Year]", summary: "[What it was, your role, and the outcome.]", link: "#" }
      ],
      wallpaper: "assets/wallpapers/phase-6.jpg",
      focus: "65% 50%", tone: "dark", accent: "#e08a7a",
      fallback: ["#150506", "#5c2427"]
    },
    {
      id: 7, type: "approach", name: "Approach",
      heading: "How I work",
      intro: "[A short description of your process.]",
      steps: [
        { title: "[Step one]", text: "[What happens in this step.]" },
        { title: "[Step two]", text: "[What happens in this step.]" },
        { title: "[Step three]", text: "[What happens in this step.]" },
        { title: "[Step four]", text: "[What happens in this step.]" }
      ],
      wallpaper: "assets/wallpapers/phase-7.jpg",
      focus: "70% 50%", tone: "light", accent: "#9c7a52",
      fallback: ["#e8dccb", "#c7b195"]
    },
    {
      id: 8, type: "focus", name: "Now",
      heading: "What I'm focusing on now",
      paragraphs: [
        "[What you are working on or learning at the moment.]"
      ],
      items: ["[Current topic one]", "[Current topic two]", "[Current topic three]"],
      openTo: "Open to: [collaborations, roles, commissions — edit this line]",
      wallpaper: "assets/wallpapers/phase-8.jpg",
      focus: "70% 50%", tone: "dark", accent: "#d5dde6",
      fallback: ["#0b0c0f", "#4a5058"]
    }
  ],

  /* ---------- Finale (contact). Reuses the Phase 1 wallpaper to bookend the site.
     To use a different image, change "wallpaper" below. ---------- */
  finale: {
    name: "Contact",
    ghost: "END",
    anchor: "contact",
    heading: "Let's create something memorable.",
    intro: "[Invite visitors to get in touch and say what you would like to talk about.]",
    wallpaper: "assets/wallpapers/phase-1.jpg",
    focus: "50% 50%", tone: "dark", accent: "#d9b77a",
    fallback: ["#070706", "#2a2116"]
  }
};
