const dropdownBtn = document.getElementById("btn");
const dropdownMenu = document.getElementById("dropdown");
const toggleArrow = document.getElementById("arrow");
const messageBox = document.getElementById("messageBox");

// Toggle dropdown
function toggleDropdown() {
  dropdownMenu.classList.toggle("show");
  toggleArrow.classList.toggle("arrow");
}

dropdownBtn.addEventListener("click", function(e) {
  e.stopPropagation();
  toggleDropdown();
});

// Close if clicking outside
document.documentElement.addEventListener("click", function() {
  if (dropdownMenu.classList.contains("show")) {
    toggleDropdown();
  }
});

// Click on animal link to update message
const links = dropdownMenu.querySelectorAll("a");
links.forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    messageBox.textContent = this.textContent + " selected!";
  });
});
