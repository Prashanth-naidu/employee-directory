// script.js

let employeeData = [{
        id: 1,
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        department: 'HR',
        role: 'Manager'
    },
    {
        id: 2,
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        department: 'IT',
        role: 'Developer'
    },
    {
        id: 3,
        firstName: 'Charlie',
        lastName: 'Lee',
        email: 'charlie@example.com',
        department: 'Finance',
        role: 'Analyst'
    },
];

let currentPage = 1;
let pageSize = 10;
const container = document.getElementById('employeeContainer');

function paginate(data) {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
}

function renderEmployees(data) {
    const paginatedData = paginate(data);
    container.innerHTML = '';
    paginatedData.forEach(emp => {
        const card = document.createElement('div');
        card.className = 'employee-card';
        card.innerHTML = `
      <p><strong>${emp.firstName} ${emp.lastName}</strong></p>
      <p><strong>Email:</strong> ${emp.email}</p>
      <p><strong>Department:</strong> ${emp.department}</p>
      <p><strong>Role:</strong> ${emp.role}</p>
      <div class="card-actions">
        <button onclick="editEmployee(${emp.id})">Edit</button>
        <button onclick="deleteEmployee(${emp.id})">Delete</button>
      </div>
    `;
        container.appendChild(card);
    });
    renderPagination(data.length);
}

function renderPagination(totalItems) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalItems / pageSize);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = i === currentPage ? 'active' : '';
        btn.onclick = () => {
            currentPage = i;
            renderEmployees(employeeData);
        };
        paginationContainer.appendChild(btn);
    }
}

function openForm() {
    document.getElementById('employeeForm').classList.remove('hidden');
    document.getElementById('empForm').reset();
    document.getElementById('formTitle').textContent = 'Add Employee';
    document.getElementById('empId').value = '';
}

function closeForm() {
    document.getElementById('employeeForm').classList.add('hidden');
}

function submitForm(event) {
    event.preventDefault();
    const id = document.getElementById('empId').value;
    const newEmp = {
        id: id ? Number(id) : Date.now(),
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        department: document.getElementById('department').value,
        role: document.getElementById('role').value,
    };

    if (id) {
        employeeData = employeeData.map(emp => emp.id === Number(id) ? newEmp : emp);
    } else {
        employeeData.push(newEmp);
    }

    currentPage = 1;
    renderEmployees(employeeData);
    closeForm();
}

function editEmployee(id) {
    const emp = employeeData.find(emp => emp.id === id);
    if (!emp) return;

    document.getElementById('empId').value = emp.id;
    document.getElementById('firstName').value = emp.firstName;
    document.getElementById('lastName').value = emp.lastName;
    document.getElementById('email').value = emp.email;
    document.getElementById('department').value = emp.department;
    document.getElementById('role').value = emp.role;
    document.getElementById('formTitle').textContent = 'Edit Employee';
    document.getElementById('employeeForm').classList.remove('hidden');
}

function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        employeeData = employeeData.filter(emp => emp.id !== id);
        currentPage = 1;
        renderEmployees(employeeData);
    }
}

function toggleFilterSidebar() {
    document.getElementById('filterSidebar').classList.toggle('hidden');
}

function applyFilters() {
    const name = document.getElementById('filterFirstName').value.toLowerCase();
    const department = document.getElementById('filterDepartment').value.toLowerCase();
    const role = document.getElementById('filterRole').value.toLowerCase();

    const filtered = employeeData.filter(emp =>
        emp.firstName.toLowerCase().includes(name) &&
        emp.department.toLowerCase().includes(department) &&
        emp.role.toLowerCase().includes(role)
    );
    currentPage = 1;
    renderEmployees(filtered);
    document.getElementById('filterSidebar').classList.toggle('hidden');
}

function resetFilters() {
    document.getElementById('filterFirstName').value = '';
    document.getElementById('filterDepartment').value = '';
    document.getElementById('filterRole').value = '';
    currentPage = 1;
    renderEmployees(employeeData);
}

function sortEmployees() {
    const sortBy = document.getElementById('sort').value;
    if (!sortBy) return;

    const sorted = [...employeeData].sort((a, b) =>
        a[sortBy].localeCompare(b[sortBy])
    );
    currentPage = 1;
    renderEmployees(sorted);
}

function changePageSize() {
    pageSize = Number(document.getElementById('pageSize').value);
    currentPage = 1;
    renderEmployees(employeeData);
}

function handleSearch() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const result = employeeData.filter(emp =>
        emp.firstName.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term)
    );
    currentPage = 1;
    renderEmployees(result);
}

document.getElementById('searchInput').addEventListener('input', handleSearch);
document.getElementById('pageSize').addEventListener('change', changePageSize);

// Initial render
renderEmployees(employeeData);