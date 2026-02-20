
export const dashboardTutorialSteps = [
  {
    id: 1,
    title: "Welcome to TrackVers",
    description: "Your central hub for tracking software lifecycles. Let's take a quick tour to get you started with managing your stack.",
    targetSelector: "#dashboard-title",
    position: "bottom"
  },
  {
    id: 2,
    title: "Add Software",
    description: "Click here to add new software to your tracking list. You can search our database for languages, frameworks, and tools.",
    targetSelector: "#tutorial-add-btn",
    position: "bottom"
  },
  {
    id: 3,
    title: "Check for Updates",
    description: "One-click intelligence. Use this button to instantly check if newer versions are available for all your tracked software.",
    targetSelector: "#tutorial-check-btn",
    position: "bottom"
  },
  {
    id: 4,
    title: "Your Software List",
    description: "This table displays your tracked software. You'll see current versions, latest available versions, and critical End-of-Life (EOL) dates here.",
    targetSelector: "#tutorial-software-table",
    position: "top"
  },
  {
    id: 5,
    title: "Status Indicators",
    description: "Keep an eye on the EOL Status column. We'll highlight dates in red when software is approaching end of support.",
    targetSelector: "#tutorial-software-table", 
    position: "top" // Pointing to the table generally if specific column headers aren't easily selectable
  },
  {
    id: 6,
    title: "Quick Favorites",
    description: "Frequently used technologies appear here for quick access. You can add more favorites from the documentation or search pages.",
    targetSelector: "#tutorial-favorites",
    position: "top"
  },
  {
    id: 7,
    title: "You're All Set!",
    description: "You're ready to start tracking. Add your first piece of software now to begin monitoring your stack's health.",
    targetSelector: "center", // Special keyword for centered modal
    position: "center"
  }
];
