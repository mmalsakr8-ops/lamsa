const COOKIE = "lamsa_session";
const SESSION_DAYS = 30;

const THEMES = {
  luxury: {
    name: "فاخر أسود وذهبي",
    background: "linear-gradient(135deg,#17120d,#302217 45%,#111)",
    accent: "#d7ad63",
    card: "#211b15",
    text: "#fffaf0"
  },

  cafe: {
    name: "كافيه مودرن",
    background: "linear-gradient(135deg,#f6efe5,#fffaf4)",
    accent: "#9b6b43",
    card: "#ffffff",
    text: "#2d241e"
  },

  fresh: {
    name: "أخضر طبيعي",
    background: "linear-gradient(135deg,#edf5ed,#f8fbf6)",
    accent: "#4f7b59",
    card: "#ffffff",
    text: "#203226"
  },

  modern: {
    name: "مودرن",
    background: "linear-gradient(135deg,#f2f2f2,#ffffff)",
    accent: "#222222",
    card: "#ffffff",
    text: "#171717"
  },

  dark: {
    name: "دارك",
    background: "linear-gradient(135deg,#080808,#1c1c1c)",
    accent: "#ffffff",
    card: "#151515",
    text: "#ffffff"
  }
};


// =========================

export { COOKIE, SESSION_DAYS, THEMES };
