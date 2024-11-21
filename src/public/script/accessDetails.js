// Function to toggle visibility of SSH key or IP address
function toggleVisibility(elementId, iconElement) {
  const element = document.getElementById(elementId);
  const originalValue = element.getAttribute("data-value"); // Retrieve original value from data attribute

  if (element.textContent === "••••••••••••••") {
    // Show actual content
    element.textContent = originalValue;
    iconElement.textContent = "visibility_off"; // Change icon
  } else {
    // Hide the content again
    element.textContent = "••••••••••••••";
    iconElement.textContent = "visibility"; // Change icon back
  }
}

// Function to copy text content to clipboard
function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  const textToCopy = element.getAttribute("data-value"); // Get the actual value from the data attribute
  navigator.clipboard.writeText(textToCopy).catch((err) => {
    console.error("Failed to copy: ", err); // You can also remove this line if you don't want any logging at all
  });
}
