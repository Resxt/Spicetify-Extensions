async function main() {

  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // If it's the first time the user runs the extension, default to home page.
  if (localStorage.getItem("startup-page-uri") === null) {
    localStorage.setItem("startup-page-uri", "/")
  }

  initMenu();
  
  // Go to the user's selected startup page on app startup
  Spicetify.Platform.History.push(localStorage.getItem("startup-page-uri"));
}

function initMenu() {
  new Spicetify.Menu.Item("Set startup page", false, () => {
    setStartupPage();
  }).register();
}

function setStartupPage() {
  localStorage.setItem("startup-page-uri", Spicetify.Platform.History.location.pathname);
}

export default main;