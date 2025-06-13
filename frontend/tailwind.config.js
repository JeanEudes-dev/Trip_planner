module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#7c3aed",
        surface: "#111827",
        accent: "#0ea5e9",
        warning: "#f59e42",
        eld: {
          driving: "#2563eb",
          onduty: "#f59e42",
          offduty: "#10b981",
          sleeper: "#a78bfa",
          rest: "#f472b6",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
