// Freelance only. Do not mention jobs or internships here.
export const contact = {
  heading: "Let's build something.",
  subline: "I'm available for freelance projects: websites, web apps and e-commerce stores.",

  form: {
    fields: {
      name: { label: "Name", required: "Please enter your name." },
      email: {
        label: "Email",
        required: "Please enter your email.",
        invalid: "Please enter a valid email address.",
      },
      projectType: {
        label: "Project type",
        options: ["Website", "Web App", "E-commerce", "Something else"],
        required: "Please choose a project type.",
      },
      message: { label: "Message", required: "Please add a short message." },
    },
    submit: "Send",
    sending: "Sending…",
    success: "Thanks, your message is on its way.",
    error: "Something went wrong sending that. Please email me instead.",
  },

  resume: {
    label: "Download résumé",
    href: "{PLACEHOLDER: résumé PDF path, e.g. /resume.pdf}",
  },
} as const;
