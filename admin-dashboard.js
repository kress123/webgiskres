document.addEventListener("DOMContentLoaded", function () {
    // Cek apakah user sudah login sebagai admin
    const isLoggedIn = localStorage.getItem("loggedIn");
    const userRole = localStorage.getItem("userRole"); // Pastikan ada key userRole di login.js

    if (!isLoggedIn || userRole !== "admin") {
        alert("Akses ditolak! Hanya admin yang dapat mengakses halaman ini.");
        window.location.href = "login.html"; // Redirect ke halaman login
    }

    // Fungsi Logout (Pastikan tombol ada sebelum menambahkan event)
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("loggedIn");
            localStorage.removeItem("userRole"); // Hapus role juga agar lebih aman
            localStorage.removeItem("username");
            window.location.href = "login.html"; // Redirect ke halaman login
        });
    }

    // Tambahkan fitur lain khusus admin di sini
    console.log("Admin Dashboard Loaded");
});
