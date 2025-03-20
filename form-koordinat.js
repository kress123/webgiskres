document.addEventListener("DOMContentLoaded", function () {
    // === 1️⃣ Cek Peran User ===
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
        alert("Akses ditolak! Hanya admin yang dapat mengakses halaman ini.");
        window.location.href = "login.html";
        return;
    }

    // === 2️⃣ Inisialisasi Peta ===
    var map = L.map("map").setView([-2.5489, 118.0149], 5);

    var baseMaps = {
        "Google Satelit": L.tileLayer("https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
            subdomains: ["mt0", "mt1", "mt2", "mt3"]
        }).addTo(map),
        "OpenStreetMap": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
        "Google Street": L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
            subdomains: ["mt0", "mt1", "mt2", "mt3"]
        })
    };

    L.control.layers(baseMaps).addTo(map);
    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    var drawControl = new L.Control.Draw({
        edit: { featureGroup: drawnItems },
        draw: { polygon: true, polyline: true, rectangle: true, circle: false, marker: true }
    });
    map.addControl(drawControl);

    // === 3️⃣ Event Ketika Menggambar Objek ===
    map.on("draw:created", function (e) {
        var layer = e.layer;
        drawnItems.addLayer(layer);
        var latlng = e.layerType === "marker" ? layer.getLatLng() : layer.getLatLngs()[0][0];

        var formHtml = `
            <div>
                <label>Lab ID:</label><input type="text" id="labIdInput" required><br>
                <label>Blok:</label><input type="text" id="blokInput" required><br>
                <label>Nomor Plot:</label><input type="text" id="nomorPlotInput" required><br>
                <button onclick="saveDrawingData(${latlng.lat}, ${latlng.lng})">Simpan</button>
            </div>
        `;

        layer.bindPopup(formHtml).openPopup();
    });

    // === 4️⃣ Fungsi Menyimpan Data ke Google Apps Script ===
    window.saveDrawingData = function (lat, lng) {
        let labId = document.getElementById("labIdInput").value.trim();
        let blok = document.getElementById("blokInput").value.trim();
        let nomorPlot = document.getElementById("nomorPlotInput").value.trim();

        if (!labId || !blok || !nomorPlot) {
            alert("Semua kolom harus diisi!");
            return;
        }

        let formData = { labId, blok, nomorPlot, latitude: lat, longitude: lng };

        fetch("https://script.google.com/macros/s/AKfycbxhUBs6_Bqglflm7TfVVgO87OSNwG8_cZFqsb2TGwCmXebvfuSqSfyYt8NYjLNt7YR0/exec", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Data berhasil disimpan ke Google Drive!");
                loadTableData(); // 🔄 Perbarui tabel setelah menyimpan
            } else {
                alert("Terjadi kesalahan: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Gagal menyimpan data. Silakan coba lagi.");
        });
    };

    // === 5️⃣ Event Listener untuk Form Input Data ===
    let koordinatForm = document.getElementById("koordinatForm");
    if (koordinatForm) {
        koordinatForm.addEventListener("submit", function(event) {
            event.preventDefault();

            let formData = {
                labId: document.getElementById("labId").value,
                blok: document.getElementById("blok").value,
                nomorPlot: document.getElementById("nomorPlot").value,
                latitude: document.getElementById("latitude").value,
                longitude: document.getElementById("longitude").value
            };

            fetch("https://script.google.com/macros/s/AKfycbxhUBs6_Bqglflm7TfVVgO87OSNwG8_cZFqsb2TGwCmXebvfuSqSfyYt8NYjLNt7YR0/exec", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: { "Content-Type": "application/json" }
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    alert("Data berhasil disimpan ke Google Spreadsheet!");
                    loadTableData(); // 🔄 Perbarui tabel setelah menyimpan
                } else {
                    alert("Gagal menyimpan data: " + data.message);
                }
            })
            .catch(error => console.error("Error:", error));
        });
    }

    // === 6️⃣ Fungsi untuk Mengambil & Memuat Data ke Tabel ===
    function loadTableData() {
        fetch("https://script.google.com/macros/s/AKfycbxhUBs6_Bqglflm7TfVVgO87OSNwG8_cZFqsb2TGwCmXebvfuSqSfyYt8NYjLNt7YR0/exec")
            .then(response => response.json())
            .then(data => {
                let tbody = document.getElementById("dataTabelBody");
                if (!tbody) return;

                tbody.innerHTML = ""; // Kosongkan tabel sebelum mengisi ulang

                data.forEach((item, index) => {
                    let row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.labId}</td>
                            <td>${item.blok}</td>
                            <td>${item.nomorPlot}</td>
                            <td>${item.latitude}</td>
                            <td>${item.longitude}</td>
                            <td>
                                <button onclick="lihatPeta(${item.latitude}, ${item.longitude})">Lihat Peta</button>
                                <button onclick="hapusData(${item.id})">Hapus</button>
                            </td>
                        </tr>
                    `;
                    tbody.innerHTML += row;
                });
            })
            .catch(error => console.error("Error:", error));
    }

    // === 7️⃣ Hapus Data dari Google Spreadsheet ===
    window.hapusData = function(id) {
        if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            fetch("https://script.google.com/macros/s/AKfycbxhUBs6_Bqglflm7TfVVgO87OSNwG8_cZFqsb2TGwCmXebvfuSqSfyYt8NYjLNt7YR0/exec?id=" + id, { 
                method: "POST"
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    alert("Data berhasil dihapus!");
                    loadTableData(); // 🔄 Perbarui tabel setelah menghapus
                } else {
                    alert("Gagal menghapus data: " + data.message);
                }
            })
            .catch(error => console.error("Error:", error));
        }
    };

    // 🔄 Muat ulang data tabel saat halaman dimuat
    loadTableData();
});
