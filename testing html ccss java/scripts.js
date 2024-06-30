// Wait for the DOM content to be loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const links = document.querySelectorAll('nav ul li a');
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default link behavior
            const sectionId = event.target.getAttribute('href').substring(1); // Get the target section ID
            const section = document.getElementById(sectionId); // Find the target section element
            window.scrollTo({
                top: section.offsetTop - 20,
                behavior: 'smooth' // Scroll smoothly to the target section
            });
        });
    });

    // Toggle visibility of a section when the button is clicked
    const toggleButton = document.getElementById('toggleButton');
    const toggleSection = document.getElementById('toggleSection');
    toggleButton.addEventListener('click', function() {
        // Check the current display state of the toggleSection
        if (toggleSection.style.display === 'none') {
            toggleSection.style.display = 'block'; // Show the section
            toggleButton.textContent = 'Hide Section'; // Update the button text
        } else {
            toggleSection.style.display = 'none'; // Hide the section
            toggleButton.textContent = 'Show Section'; // Update the button text
        }
    });
});
