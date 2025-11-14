// Menunggu sampai seluruh halaman HTML dimuat
document.addEventListener("DOMContentLoaded", () => {

    // --- Seleksi Elemen DOM ---
    const todoForm = document.getElementById("todo-form");
    const todoInput = document.getElementById("todo-input");
    const todoDate = document.getElementById("todo-date");
    const todoList = document.getElementById("todo-list");
    const clearAllBtn = document.getElementById("clear-all-btn"); 
    const filterSelect = document.getElementById("filter-select");

    // --- State Aplikasi ---
    // Coba ambil data dari localStorage, jika tidak ada, gunakan array kosong
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    let currentFilter = "all"; // State untuk filter

    // --- Event Listeners ---

    // 1. Event untuk form (menambah todo)
    todoForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Mencegah form refresh halaman
        addTodo();
    });

    // 2. Event untuk tombol "Clear All"
    // Pastikan baris ini ada dan tidak ada error sebelumnya
    clearAllBtn.addEventListener("click", clearTodos); // <--- PENTING

    // 3. Event untuk dropdown "Filter"
    filterSelect.addEventListener("change", (e) => {
        currentFilter = e.target.value;
        renderTodos(); // Render ulang daftar saat filter berubah
    });

    // 4. Event untuk Aksi di dalam List (Delete & Checkbox)
    todoList.addEventListener("click", (e) => {
        const target = e.target;

        // Cek apakah yang diklik adalah checkbox
        if (target.type === "checkbox") {
            const id = Number(target.dataset.id);
            toggleComplete(id);
        }

        // Cek apakah yang diklik adalah tombol "Delete"
        if (target.classList.contains("delete-btn")) {
            const id = Number(target.dataset.id);
            deleteTodo(id);
        }
    });

    // --- Functions ---

    // Fungsi untuk menambah todo baru
    function addTodo() {
        const todoText = todoInput.value.trim();
        const todoDateValue = todoDate.value;

        if (todoText === "" || todoDateValue === "") {
            alert("Please enter both todo item and date.");
            return; 
        }

        const newTodo = {
            id: Date.now(),
            text: todoText,
            date: todoDateValue,
            completed: false
        };

        todos.push(newTodo);
        todoInput.value = "";
        todoDate.value = "";

        saveTodos();
        renderTodos();
    }

    // Fungsi untuk me-render (menampilkan) daftar todo
    function renderTodos() {
        todoList.innerHTML = "";

        let filteredTodos = todos;
        if (currentFilter === "completed") {
            filteredTodos = todos.filter(todo => todo.completed);
        } else if (currentFilter === "pending") {
            filteredTodos = todos.filter(todo => !todo.completed);
        }

        if (filteredTodos.length === 0) {
            let message = "No Tasks Available";
            if (currentFilter === "completed") {
                message = "No completed tasks yet.";
            } else if (currentFilter === "pending") {
                message = "No pending tasks.";
            }
            todoList.innerHTML = `<li class="text-gray-500 text-center p-4">${message}</li>`;
            return;
        }

        filteredTodos.forEach((todo) => {
            const todoItem = document.createElement("li");
            todoItem.className = `flex justify-between items-center p-4 bg-white rounded-lg shadow-sm mb-2 transition-all ${todo.completed ? 'opacity-60' : ''}`;
            
            todoItem.innerHTML = `
                <div class="flex items-center gap-3">
                    <input type="checkbox" data-id="${todo.id}" 
                           class="h-5 w-5 rounded text-blue-500 focus:ring-blue-500" 
                           ${todo.completed ? 'checked' : ''}>
                    
                    <div>
                        <p class="font-medium text-gray-800 ${todo.completed ? 'line-through' : ''}">${todo.text}</p>
                        <span class="text-sm text-gray-500">${todo.date}</span>
                    </div>
                </div>
                
                <button data-id="${todo.id}" class="delete-btn text-red-500 hover:text-red-700 font-medium px-2">
                    Delete
                </button>
            `;
            todoList.appendChild(todoItem);
        });
    }

    // ==============================================
    // INI ADALAH FUNGSI YANG ANDA CARI
    // ==============================================
    // Fungsi untuk membersihkan semua todo
    function clearTodos() {
        // Tampilkan konfirmasi
        if (confirm("Are you sure you want to delete ALL tasks?")) {
            todos = []; // Kosongkan array
            saveTodos();   // Simpan array yang sudah kosong ke localStorage
            renderTodos(); // Render ulang tampilan agar terlihat kosong
        }
        // Jika pengguna klik "Cancel", tidak terjadi apa-apa
    }
    // ==============================================

    // Fungsi untuk mengubah status complete
    function toggleComplete(id) {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            saveTodos();
            renderTodos();
        }
    }

    // Fungsi untuk menghapus satu todo
    function deleteTodo(id) {
        todos = todos.filter(t => t.id !== id);
        saveTodos();
        renderTodos();
    }

    // Fungsi untuk menyimpan ke localStorage
    function saveTodos() {
        localStorage.setItem("todos", JSON.stringify(todos));
    }

    // --- Render Awal ---
    renderTodos();
});