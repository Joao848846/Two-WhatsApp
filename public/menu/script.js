function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("active");
}
function toggleSubmenu(event) {
  event.preventDefault();
  const submenu = document.getElementById("submenu");
  submenu.style.display = submenu.style.display === "block" ? "none" : "block";
}
