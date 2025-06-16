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
                        window.location.href = "https://www.tiktok.com/@jnnrcelestial/live?_r=1&_svg=1&checksum=f5c5c766d00b43625a980020a548bc74a9856fdc3494797b871fcb7bacf42f80&enter_from_merge=share&enter_method=share&sec_user_id=MS4wLjABAAAANbHrLygMLbQNEb2cy6WlzLnexICGfQ39IWSp0XyhtSp3fqhqL9L28N_SMUpPKof6&share_app_id=1180&share_from_user_id=6589393082944864258&share_link_id=a2fdc67b-e2e6-44c1-8278-7396579b9761&social_share_type=10&source=h5_t&timestamp=1750075428&ug_btm=b5836%2Cb4180&ugbiz_name=LIVE&user_id=6589393082944864258&utm_campaign=client_share&utm_medium=android&utm_source=copy";
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
