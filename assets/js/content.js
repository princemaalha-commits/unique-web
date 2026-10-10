/* =====================================================================
   YOUR CONTENT — the only file you need to edit day to day.

   - Text inside [square brackets] is a placeholder that still needs
     your confirmation. Replace it when you have the real information.
   - Links that are not ready (for example "[ADD GITHUB PROFILE URL]")
     are shown as "link to be added" and are not clickable.
   - Wallpapers: assets/wallpapers/phase-1.jpg … phase-8.jpg
   - Photo: put your photo at assets/profile/photo.jpg. Until then a
     "photo to be added" box is shown.
   - CV: leave cvUrl empty to hide the CV button. Add a path such as
     "assets/cv.pdf" once you have a PDF.
   - Keep the text inside the quotation marks. Do not delete commas.
   ===================================================================== */
window.SITE_CONTENT = {

  /* ---------- Your details ---------- */
  owner: {
    name: "Prince Mallah",
    initials: "PM",
    role: "FYBCA Student | Aspiring Developer",
    tagline: "Exploring programming, building practical projects, and turning curiosity into working solutions.",
    location: "Surat, Gujarat, India",
    email: "princemaalha@gmail.com",
    phone: "[CONFIRM PHONE BEFORE PUBLISHING]",
    photo: "assets/profile/photo.jpg",
    cvUrl: "",
    social: [
      { label: "GitHub", url: "[ADD GITHUB PROFILE URL]" },
      { label: "LinkedIn", url: "[ADD LINKEDIN PROFILE URL]" }
    ]
  },

  /* ---------- The eight phases (top to bottom) ----------
     type:      hero | about | timeline | principles | skills | work | approach | focus
     tone:      "dark" (light text) or "light" (dark text on a bright wallpaper)
     accent:    neon colour used for highlights in this phase
     focus:     which part of the wallpaper stays visible on small screens
     fallback:  two colours shown before the wallpaper loads
  --------------------------------------------------------- */
  phases: [
    {
      id: 1, type: "hero", name: "Opening",
      wallpaper: "assets/wallpapers/phase-1.jpg",
      focus: "72% 50%", tone: "dark", accent: "#37e6ff",
      fallback: ["#070706", "#3a2d1b"],
      ctaPrimary: { label: "Explore Projects", target: "phase-6" },
      ctaSecondary: { label: "Get in Touch", target: "contact" }
    },
    {
      id: 2, type: "about", name: "About Me",
      heading: "About Me",
      intro: "Curious about computers, programming, and practical technology.",
      paragraphs: [
        "I am a first-year BCA student interested in computers, programming, and practical technology. I enjoy understanding how things work and improving my skills by building projects.",
        "My goal is to become a skilled developer and build useful software projects."
      ],
      facts: [
        { label: "Education", value: "First-year BCA student" },
        { label: "Languages", value: "Hindi, English, Gujarati" },
        { label: "Based in", value: "Surat, Gujarat, India" },
        { label: "Career goal", value: "Skilled developer building useful software" }
      ],
      wallpaper: "assets/wallpapers/phase-2.jpg",
      focus: "70% 50%", tone: "dark", accent: "#5ef2ff",
      fallback: ["#080b1c", "#2a1f5e"]
    },
    {
      id: 3, type: "timeline", name: "Journey",
      heading: "My Journey",
      intro: "My learning path and work experience so far.",
      items: [
        {
          period: "Approx. 8–9 months",
          title: "Promoter",
          org: "D-Mart",
          text: "Customer interaction and clear communication with shoppers."
        },
        {
          period: "Current",
          title: "First-year BCA learning journey",
          org: "[Add college name]",
          text: "Learning C programming, SQL, HTML, CSS, and JavaScript through hands-on practice."
        }
      ],
      wallpaper: "assets/wallpapers/phase-3.jpg",
      focus: "50% 40%", tone: "light", accent: "#5b3fd6",
      fallback: ["#a7b6c2", "#e6d3c0"]
    },
    {
      id: 4, type: "principles", name: "Mindset",
      heading: "What guides my learning",
      intro: "The principles I try to follow as I learn and build.",
      items: [
        { title: "Problem-solving", text: "Break a problem into manageable steps." },
        { title: "Continuous learning", text: "Keep developing knowledge and skills." },
        { title: "Practical experimentation", text: "Learn by building, testing, and improving." }
      ],
      wallpaper: "assets/wallpapers/phase-4.jpg",
      focus: "70% 50%", tone: "dark", accent: "#a58bff",
      fallback: ["#05070f", "#2c3446"]
    },
    {
      id: 5, type: "skills", name: "Skills",
      heading: "Skills & Tools",
      intro: "Areas I am learning and practising.",
      groups: [
        { title: "Programming", items: ["C Programming"] },
        { title: "Web Development", items: ["HTML", "CSS", "JavaScript"] },
        { title: "Databases", items: ["SQL"] },
        { title: "Technical Knowledge", items: ["Computer Hardware"] },
        { title: "Professional Skills", items: ["Communication", "Customer Handling"] }
      ],
      wallpaper: "assets/wallpapers/phase-5.jpg",
      focus: "70% 50%", tone: "dark", accent: "#37e6ff",
      fallback: ["#05101a", "#1b4455"]
    },
    {
      id: 6, type: "work", name: "Selected Projects",
      heading: "Selected Projects",
      intro: "Projects and practice work. Live links will be added when they are ready.",
      projects: [
        {
          title: "8-Phase Portfolio",
          category: "Web Development",
          status: "In Progress",
          summary: "An interactive portfolio combining custom wallpapers, cinematic visual storytelling, animations, and responsive design.",
          link: ""
        },
        {
          title: "SQL Student Database Practice",
          category: "Database",
          status: "Learning project",
          summary: "Practice with student records, SQL table creation, inserting data, and queries.",
          link: ""
        },
        {
          title: "C Programming Practice Programs",
          category: "Programming",
          status: "Learning project",
          summary: "Practice programs created while learning C programming.",
          link: ""
        }
      ],
      wallpaper: "assets/wallpapers/phase-6.jpg",
      focus: "65% 50%", tone: "dark", accent: "#b07bff",
      fallback: ["#150506", "#5c2427"]
    },
    {
      id: 7, type: "approach", name: "My Approach",
      heading: "My Approach",
      intro: "",
      steps: [
        { title: "Understand the problem", text: "Clarify what needs solving before writing any code." },
        { title: "Plan the solution", text: "Break the problem into smaller, manageable steps." },
        { title: "Build and test", text: "Write code in small pieces and check each one." },
        { title: "Improve through feedback", text: "Use results and feedback to make the next version better." }
      ],
      wallpaper: "assets/wallpapers/phase-7.jpg",
      focus: "70% 50%", tone: "light", accent: "#5b3fd6",
      fallback: ["#e8dccb", "#c7b195"]
    },
    {
      id: 8, type: "focus", name: "Current Focus",
      heading: "Current Focus",
      paragraphs: [
        "Current learning focus: C programming, SQL, and web development."
      ],
      items: ["C programming", "SQL", "Web development"],
      openTo: "Open to: Learning opportunities, beginner-friendly collaborations, and internships.",
      wallpaper: "assets/wallpapers/phase-8.jpg",
      focus: "70% 50%", tone: "dark", accent: "#37e6ff",
      fallback: ["#0b0c0f", "#4a5058"]
    }
  ],

  /* ---------- Finale (contact). Reuses the Phase 1 wallpaper to bookend the site.
     To use a different image, change "wallpaper" below. ---------- */
  finale: {
    name: "Contact",
    ghost: "END",
    anchor: "contact",
    heading: "Let's Build Something Meaningful.",
    intro: "I'm learning, experimenting, and working toward becoming a better developer.",
    wallpaper: "assets/wallpapers/phase-1.jpg",
    focus: "50% 50%", tone: "dark", accent: "#37e6ff",
    fallback: ["#070706", "#2a2116"]
  }
};
