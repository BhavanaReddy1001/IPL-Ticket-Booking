
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

const matchSelect = document.getElementById("match");
const standSelect = document.getElementById("stand");
const ticketInput = document.getElementById("tickets");

const summaryMatch = document.getElementById("summary-match");
const summaryStand = document.getElementById("summary-stand");
const summaryPrice = document.getElementById("summary-price");
const summaryQuantity = document.getElementById("summary-quantity");
const summaryTotal = document.getElementById("summary-total");

function updateBookingSummary() {

    if (!matchSelect || !standSelect || !ticketInput) {
        return;
    }

    const match = matchSelect.value;
    const stand = standSelect.value;
    const quantity = Number(ticketInput.value);

    const prices = {
        General: 800,
        Premium: 1500,
        VIP: 3000
    };

    const price = prices[stand] || 0;
    const total = price * quantity;

    summaryMatch.textContent = match || "Not selected";
    summaryStand.textContent = stand || "Not selected";
    summaryPrice.textContent = "₹" + price;
    summaryQuantity.textContent = quantity || 0;
    summaryTotal.textContent = "₹" + total;

    showToast("Booking summary updated!");
}

if (matchSelect && standSelect && ticketInput) {

    matchSelect.addEventListener("change", updateBookingSummary);

    standSelect.addEventListener("change", updateBookingSummary);

    ticketInput.addEventListener("input", updateBookingSummary);
}
