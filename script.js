const jobForm = document.getElementById("jobForm");
const jobTable = document.getElementById("jobTable");

const search = document.getElementById("search");
const filterStatus = document.getElementById("filterStatus");
const sortSelect = document.getElementById("sort");

let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
let editId = null;

function saveJobs() {
  localStorage.setItem("jobs", JSON.stringify(jobs));
}

function updateDashboard() {
  appliedCount.textContent = jobs.filter(j => j.status === "Applied").length;
  interviewCount.textContent = jobs.filter(j => j.status === "Interview").length;
  offerCount.textContent = jobs.filter(j => j.status === "Offer").length;
  rejectedCount.textContent = jobs.filter(j => j.status === "Rejected").length;
}

function renderJobs() {
  jobTable.innerHTML = "";

  let filtered = jobs.filter(job => {
    const text = search.value.toLowerCase();
    const statusMatch = filterStatus.value === "All" || job.status === filterStatus.value;
    const textMatch =
      job.company.toLowerCase().includes(text) ||
      job.role.toLowerCase().includes(text);
    return statusMatch && textMatch;
  });

  filtered.sort((a, b) =>
    sortSelect.value === "latest"
      ? b.id - a.id
      : a.id - b.id
  );

  filtered.forEach(job => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${job.company}</td>
      <td>${job.role}</td>
      <td><span class="status ${job.status}">${job.status}</span></td>
      <td>${job.date}</td>
      <td>${job.notes || "-"}</td>
      <td>
        <button class="action-btn edit" onclick="editJob(${job.id})">Edit</button>
        <button class="action-btn delete" onclick="deleteJob(${job.id})">Delete</button>
      </td>
    `;

    jobTable.appendChild(row);
  });

  updateDashboard();
}

jobForm.addEventListener("submit", e => {
  e.preventDefault();

  const jobData = {
    id: editId || Date.now(),
    company: company.value,
    role: role.value,
    status: status.value,
    notes: notes.value,
    date: new Date().toLocaleDateString()
  };

  if (editId) {
    jobs = jobs.map(j => (j.id === editId ? jobData : j));
    editId = null;
  } else {
    jobs.push(jobData);
  }

  saveJobs();
  renderJobs();
  jobForm.reset();
});

function editJob(id) {
  const job = jobs.find(j => j.id === id);
  company.value = job.company;
  role.value = job.role;
  status.value = job.status;
  notes.value = job.notes;
  editId = id;
}

function deleteJob(id) {
  jobs = jobs.filter(j => j.id !== id);
  saveJobs();
  renderJobs();
}

search.addEventListener("input", renderJobs);
filterStatus.addEventListener("change", renderJobs);
sortSelect.addEventListener("change", renderJobs);

renderJobs();
