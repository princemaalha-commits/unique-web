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

   NEW OPTIONAL FEATURES (you can leave any of them as they are):
   - terminal (Skills phase): the interactive command line. Its answers
     are built from the text in this file.
   - sqlDemo (Selected Projects phase): the SQL practice box. Its sample
     rows are made-up practice data, not real people.
   - Each project can have: repo (GitHub address), details (a list of
     facts), demo (the id of a section on the page), demoLabel (button text).
     Leave any of them as "" or [] until the real information is ready.
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
          text: "Customer interaction and communication."
        },
        {
          period: "Current learning journey",
          title: "First-year BCA student",
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
      terminal: {
        title: "Interactive terminal",
        examples: ["help", "about", "projects", "focus"],
        intro: "A small command line about me. Click the box below and type help.",
        prompt: "guest@portfolio:~$",
        sampleC: [
          "#include <stdio.h>",
          "",
          "int main(void) {",
          "    printf(\"Hello, World!\\n\");",
          "    return 0;",
          "}"
        ]
      },
      groups: [
        { title: "Programming", items: ["C Programming"], relates: "Programming" },
        { title: "Web Development", items: ["HTML", "CSS", "JavaScript"], relates: "Web Development" },
        { title: "Databases", items: ["SQL"], relates: "Databases" },
        { title: "Technical Knowledge", items: ["Computer Hardware"], relates: "" },
        { title: "Professional Skills", items: ["Communication", "Customer Handling"], relates: "" }
      ],
      wallpaper: "assets/wallpapers/phase-5.jpg",
      focus: "70% 50%", tone: "dark", accent: "#37e6ff",
      fallback: ["#05101a", "#1b4455"]
    },
    {
      id: 6, type: "work", name: "Selected Projects",
      heading: "Selected Projects",
      intro: "Projects and practice work. Live links will be added when they are ready.",
      filters: [
        { label: "All", match: "" },
        { label: "Web Development", match: "Web Development" },
        { label: "Programming", match: "Programming" },
        { label: "Databases", match: "Databases" }
      ],
      projects: [
        {
          title: "8-Phase Cinematic Portfolio Website",
          category: "Web Development",
          status: "In Progress",
          summary: "An interactive portfolio combining custom wallpapers, cinematic visual storytelling, animations, and responsive design.",
          link: "",
          repo: "",
          details: [
            "Built with plain HTML, CSS, and JavaScript, with no build tools.",
            "Eight wallpapers, scroll-linked phase transitions, and a responsive layout."
          ]
        },
        {
          title: "SQL Student Database Practice",
          category: "Databases",
          status: "Learning Project",
          summary: "Practice with student records, SQL table creation, inserting data, and queries.",
          link: "",
          repo: "",
          demo: "sql-demo",
          demoLabel: "Open the SQL demo",
          details: [
            "Practice SQL: create a table, insert rows, filter, sort, and group.",
            "The demo runs in your browser on made-up sample data."
          ]
        },
        {
          title: "C Programming Practice Programs",
          category: "Programming",
          status: "Learning Project",
          summary: "Practice programs created while learning C programming.",
          link: "",
          repo: "",
          details: [
            "Simple sample programs written while learning C.",
            "These are teaching examples, not completed professional software."
          ],
          examples: [
            {
              title: "Hello, World!",
              note: "Prints one line of text.",
              code: [
                "#include <stdio.h>",
                "",
                "int main(void) {",
                "    printf(\"Hello, World!\\n\");",
                "    return 0;",
                "}"
              ],
              output: ["Hello, World!"]
            },
            {
              title: "Add two numbers",
              note: "Stores two numbers in variables and prints their sum.",
              code: [
                "#include <stdio.h>",
                "",
                "int main(void) {",
                "    int a = 5;",
                "    int b = 7;",
                "    int sum = a + b;",
                "    printf(\"Sum = %d\\n\", sum);",
                "    return 0;",
                "}"
              ],
              output: ["Sum = 12"]
            },
            {
              title: "Count from 1 to 5",
              note: "A for loop repeats a block of code.",
              code: [
                "#include <stdio.h>",
                "",
                "int main(void) {",
                "    for (int i = 1; i <= 5; i++) {",
                "        printf(\"%d\\n\", i);",
                "    }",
                "    return 0;",
                "}"
              ],
              output: ["1", "2", "3", "4", "5"]
            },
            {
              title: "Even or odd",
              note: "An if/else decides which message to print.",
              code: [
                "#include <stdio.h>",
                "",
                "int main(void) {",
                "    int number = 8;",
                "    if (number % 2 == 0) {",
                "        printf(\"%d is even\\n\", number);",
                "    } else {",
                "        printf(\"%d is odd\\n\", number);",
                "    }",
                "    return 0;",
                "}"
              ],
              output: ["8 is even"]
            }
          ]
        }
      ],
      sqlDemo: {
        id: "sql-demo",
        title: "Try SQL in your browser",
        intro: "A real SQLite database runs inside this page. The student rows are made-up practice data, not real people. Pick a step to load its SQL, or write your own query.",
        resetLabel: "Reset database",
        resetSql: "DROP TABLE IF EXISTS students;",
        start: "-- Pick a step above, or write your own SQL here.\nSELECT 1 + 1 AS two;",
        steps: [
          {
            label: "1 · Create table",
            note: "CREATE TABLE defines the columns and their data types.",
            sql: "CREATE TABLE IF NOT EXISTS students (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  course TEXT,\n  city TEXT,\n  marks INTEGER\n);"
          },
          {
            label: "2 · Insert rows",
            note: "INSERT adds rows. Each row gets one value per column.",
            sql: "INSERT OR REPLACE INTO students (id, name, course, city, marks) VALUES\n  (1, 'Student A', 'BCA', 'Surat', 78),\n  (2, 'Student B', 'BCA', 'Vadodara', 64),\n  (3, 'Student C', 'BCom', 'Surat', 71),\n  (4, 'Student D', 'BSc', 'Ahmedabad', 88),\n  (5, 'Student E', 'BCA', 'Surat', 52),\n  (6, 'Student F', 'BCom', 'Rajkot', 69);"
          },
          {
            label: "3 · Select all",
            note: "SELECT reads columns from the table. The * means every column.",
            sql: "SELECT * FROM students;"
          },
          {
            label: "4 · Filter",
            note: "WHERE keeps only the rows that match a condition.",
            sql: "SELECT name, marks FROM students WHERE marks >= 70;"
          },
          {
            label: "5 · Sort",
            note: "ORDER BY sorts the result. DESC means highest first.",
            sql: "SELECT name, marks FROM students ORDER BY marks DESC;"
          },
          {
            label: "6 · Group",
            note: "GROUP BY combines rows, and COUNT and AVG summarise each group.",
            sql: "SELECT course, COUNT(*) AS students, ROUND(AVG(marks), 1) AS avg_marks\nFROM students\nGROUP BY course;"
          }
        ]
      },
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

  /* ---------- Résumé (opens as a printable panel from the header and contact section) ---------- */
  resume: {
    title: "Résumé",
    intro: "A summary built from the information above. Use the Print button and choose \"Save as PDF\" if you want a PDF copy."
  },

  /* ---------- Finale (contact). Reuses the Phase 1 wallpaper to bookend the site.
     To use a different image, change "wallpaper" below. ---------- */
  finale: {
    name: "Contact",
    ghost: "END",
    anchor: "contact",
    heading: "Let’s Build Something Meaningful.",
    intro: "I’m learning, experimenting, and working toward becoming a better developer.",
    wallpaper: "assets/wallpapers/phase-1.jpg",
    focus: "50% 50%", tone: "dark", accent: "#37e6ff",
    fallback: ["#070706", "#2a2116"]
  }
};
