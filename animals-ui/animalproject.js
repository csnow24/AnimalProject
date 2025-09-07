const dropdownBtn = document.getElementById("btn");
const dropdownMenu = document.getElementById("dropdown");
const toggleArrow = document.getElementById("arrow");
const messageBox = document.getElementById("messageBox");



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
    
    const id = this.getAttribute("data-id"); // grab the animal ID from HTML
    // Fetch from backend
    fetch(`http://localhost:3000/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(animal => {
        // Update the message box with data from backend
        messageBox.textContent = `${animal.name}: ${animal.description}`;
      })
      .catch(err => {
        console.error("Fetch error:", err);
        messageBox.textContent = "Error fetching data.";
      });

    toggleDropdown(); // close dropdown after click
  });
});
