document.getElementById("attendanceForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();

    if (!firstName || !lastName) {
        alert("Please enter both First Name and Last Name.");
        return;
    }

    const data = { firstName, lastName };

    fetch("attendance.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
        if (response.success) {
            addToTable(response.saved); // Add to table
            alert("Attendance saved successfully! Redirecting...");

            // Delay before redirect to allow alert and table update
            setTimeout(() => {
                window.location.href = "https://vt.tiktok.com/ZSkVUjvE4/"; // Your shortened TikTok live link
            }, 1000);
        } else {
            alert("Failed to save attendance: " + (response.message || "Unknown error."));
        }
    })
    .catch(err => {
        console.error("Error:", err);
        alert("An error occurred while saving attendance.");
    });
});

function addToTable(entry) {
    const table = document.getElementById("attendanceTable").getElementsByTagName("tbody")[0];
    const row = table.insertRow(0);
    row.innerHTML = `
        <td>${entry.date}</td>
        <td>${entry.time}</td>
        <td>${entry.firstName}</td>
        <td>${entry.lastName}</td>
    `;
}

window.onload = function () {
    fetch("attendance.json")
        .then(res => res.json())
        .then(data => {
            data.reverse().forEach(addToTable);
        })
        .catch(err => {
            console.error("Failed to load attendance data:", err);
        });
};
