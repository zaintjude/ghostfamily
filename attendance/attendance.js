window.onload = function () {
    // Load existing attendance data
    fetch("attendance.json")
        .then(res => res.json())
        .then(data => {
            data.reverse().forEach(addToTable);
        })
        .catch(err => {
            console.error("Failed to load attendance data:", err);
        });

    // Attach form submit handler
    const form = document.getElementById("attendanceForm");
    form.addEventListener("submit", function (e) {
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
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(response => {
                if (response.success && response.saved) {
                    addToTable(response.saved);
                    alert("Attendance saved successfully! Redirecting to TikTok Live...");

                    setTimeout(() => {
                        // Redirect to TikTok live after 1 second
                        window.location.href = "https://vt.tiktok.com/ZSkVUjvE4/";
                    }, 1000);
                } else {
                    alert("Failed to save attendance: " + (response.message || "Invalid response."));
                }
            })
            .catch(err => {
                console.error("Submission error:", err);
                alert("An error occurred. Please try again.");
            });
    });
};

// Function to add one entry to the table
function addToTable(entry) {
    const table = document.getElementById("attendanceTable").getElementsByTagName("tbody")[0];
    const row = table.insertRow(0);
    row.innerHTML = `
        <td>${entry.date || "-"}</td>
        <td>${entry.time || "-"}</td>
        <td>${entry.firstName || "-"}</td>
        <td>${entry.lastName || "-"}</td>
    `;
}
