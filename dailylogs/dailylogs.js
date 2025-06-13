let logs = [];

function loadLogs() {
  fetch("dailylogs.json")
    .then((res) => res.json())
    .then((data) => {
      logs = data;
      renderTable();
    });
}

function renderTable() {
  const tbody = document.querySelector("#logsTable tbody");
  tbody.innerHTML = "";

  logs.forEach((log, index) => {
    const row = document.createElement("tr");

    Object.entries(log).forEach(([key, value]) => {
      const cell = document.createElement("td");
      cell.textContent = value;

      if (key !== "DATE" && key !== "SQUAD") {
        cell.contentEditable = true;

        cell.addEventListener("blur", () => {
          const newValue = parseInt(cell.textContent);

          // Show alert if new value breaks rule
          if (
            (key === "JOINED TODAY" && newValue < 15) ||
            (key === "# OF LIVES" && newValue < 15) ||
            (key === "# OF NEW SOLID" && newValue <= 5)
          ) {
            alert("ISSSSTUFFFIIEEEEDDD");
          }

          logs[index][key] = cell.textContent;
          saveLogs();
          renderTable();
        });
      }

      // Conditional coloring after saving or reloading
      if (key === "JOINED TODAY" && parseInt(value) < 15) {
        cell.style.backgroundColor = "#f8d7da";
        cell.style.color = "#721c24";
      }

      if (key === "# OF LIVES" && parseInt(value) < 15) {
        cell.style.backgroundColor = "#f8d7da";
        cell.style.color = "#721c24";
      }

      if (key === "# OF NEW SOLID" && parseInt(value) <= 5) {
        cell.style.backgroundColor = "#f8d7da";
        cell.style.color = "#721c24";
      }

      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });

  updateTotals();
}

function saveLogs() {
  fetch("dailylogs.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(logs),
  });
}

function addLog() {
  const newLog = {
    DATE: document.getElementById("logDate").value,
    SQUAD: document.getElementById("squad").value,
    "JOINED TODAY": document.getElementById("joined").value || "0",
    "LEFT TODAY": document.getElementById("left").value || "0",
    "# OF LIVES": document.getElementById("lives").value || "0",
    "# OF NEW SOLID": document.getElementById("solid").value || "0",
  };
  logs.push(newLog);
  saveLogs();
  renderTable();
  clearInputs();
}

function clearInputs() {
  document.getElementById("logDate").value = "";
  document.getElementById("squad").value = "";
  document.getElementById("joined").value = "";
  document.getElementById("left").value = "";
  document.getElementById("lives").value = "";
  document.getElementById("solid").value = "";
}

function filterTable() {
  const dateFilter = document.getElementById("filterDate").value;
  const squadFilter = document.getElementById("filterSquad").value.toLowerCase();
  const tbody = document.querySelector("#logsTable tbody");

  Array.from(tbody.rows).forEach((row) => {
    const [date, squad] = [
      row.cells[0].textContent,
      row.cells[1].textContent.toLowerCase(),
    ];
    const show =
      (!dateFilter || date === dateFilter) &&
      (!squadFilter || squad.includes(squadFilter));
    row.style.display = show ? "" : "none";
  });
}

function updateTotals() {
  let totalJoined = 0;
  let totalSolid = 0;

  logs.forEach((log) => {
    totalJoined += parseInt(log["JOINED TODAY"] || 0);
    totalSolid += parseInt(log["# OF NEW SOLID"] || 0);
  });

  document.getElementById("totalJoined").textContent = totalJoined;
  document.getElementById("totalSolid").textContent = totalSolid;
}

loadLogs();
