document.addEventListener("DOMContentLoaded", function () {
    loadTableData();
});

// Fungsi untuk memuat data dari Google Spreadsheet ke tabel
function loadTableData() {
    fetch("https://script.google.com/macros/s/AKfycbxhUBs6_Bqglflm7TfVVgO87OSNwG8_cZFqsb2TGwCmXebvfuSqSfyYt8NYjLNt7YR0/exec") // Ganti dengan URL Apps Script
        .then(response => response.json())
        .then(data => {
            let tbody = document.getElementById("dataTabelBody");
            tbody.innerHTML = ""; // Bersihkan tabel sebelum mengisi ulang

            data.forEach((data, index) => {
                let row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${data.labId}</td>
                        <td>${data.blok}</td>
                        <td>${data.nomorPlot}</td>
                        <td>${data.latitude}</td>
                        <td>${data.longitude}</td>
                        <td>
                            <button onclick="lihatPeta(${data.latitude}, ${data.longitude})">Lihat Peta</button>
                            <button onclick="hapusData(${data.id})">Hapus</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        })
        .catch(error => console.error("Error:", error));
}

// Fungsi untuk melihat lokasi di peta
function lihatPeta(lat, lng) {
    localStorage.setItem("selectedLocation", JSON.stringify({ lat, lng }));
    window.location.href = "peta.html";
}

// Fungsi untuk menghapus data dari Google Spreadsheet
function hapusData(id) {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
        fetch("https://script.google.com/macros/s/AKfycbxhUBs6_Bqglflm7TfVVgO87OSNwG8_cZFqsb2TGwCmXebvfuSqSfyYt8NYjLNt7YR0/exec?id=" + id, { 
            method: "POST"
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Data berhasil dihapus!");
                loadTableData(); // Refresh tabel setelah menghapus
            } else {
                alert("Gagal menghapus data: " + data.message);
            }
        })
        .catch(error => console.error("Error:", error));
    }
}
document.addEventListener("DOMContentLoaded", function () {
    loadTableData();
});

// **🔄 Ambil Data dari Google Spreadsheet ke Tabel**
function loadTableData() {
    fetch("https://script.google.com/macros/s/AKfycbxhUBs6_Bqglflm7TfVVgO87OSNwG8_cZFqsb2TGwCmXebvfuSqSfyYt8NYjLNt7YR0/exec") // Ganti dengan URL Apps Script
        .then(response => response.json())
        .then(data => {
            let tbody = document.getElementById("dataTabelBody");
            tbody.innerHTML = ""; // Bersihkan tabel sebelum mengisi ulang

            data.forEach((data, index) => {
                let row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${data.labId}</td>
                        <td>${data.blok}</td>
                        <td>${data.nomorPlot}</td>
                        <td>${data.latitude}</td>
                        <td>${data.longitude}</td>
                        <td>
                            <button onclick="lihatPeta(${data.latitude}, ${data.longitude})">Lihat Peta</button>
                            <button onclick="hapusData(${data.id})">Hapus</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        })
        .catch(error => console.error("Error:", error));
}

// **🗺️ Fungsi untuk melihat lokasi di peta**
function lihatPeta(lat, lng) {
    localStorage.setItem("selectedLocation", JSON.stringify({ lat, lng }));
    window.location.href = "peta.html";
}

// **🗑️ Hapus Data dari Google Spreadsheet**
function hapusData(id) {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
        fetch("https://script.google.com/macros/s/AKfycbxhUBs6_Bqglflm7TfVVgO87OSNwG8_cZFqsb2TGwCmXebvfuSqSfyYt8NYjLNt7YR0/exec?id=" + id, { 
            method: "POST"
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Data berhasil dihapus!");
                loadTableData(); // Refresh tabel setelah menghapus
            } else {
                alert("Gagal menghapus data: " + data.message);
            }
        })
        .catch(error => console.error("Error:", error));
    }
}
