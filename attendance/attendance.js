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
                addToTable(response.saved); // show saved data with date/time
                window.location.href = "https://www.tiktok.com/@jnnrcelestial/live";
            } else {
                alert("Failed to save attendance: " + response.message);
            }
        })
        .catch(err => console.error("Error:", err));
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
        });
};
