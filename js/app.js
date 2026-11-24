
function showToast(message) {
    const toast = document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
const bookingForm = document.getElementById("booking-form");

if (bookingForm && window.location.hash === "#booking-form") {
    bookingForm.scrollIntoView({
        behavior: "smooth"
    });

    showToast("Ready to book your IPL tickets!");
}