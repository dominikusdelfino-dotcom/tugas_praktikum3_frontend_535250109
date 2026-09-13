const tabel = document.getElementById('tabel');
const totalEl = document.getElementById('total');
const tambahPengeluaran = document.getElementById('tmbhPengeluaran');
const nama = document.getElementById('nama');
const nominal = document.getElementById('nominal');
const keterangan = document.getElementById('keterangan');
const waktu = document.getElementById('waktu');
const confirmHapus = document.getElementById('confirmHapus');

let pengeluaran = JSON.parse(localStorage.getItem('pengeluaran')) || [];
let hapusPengeluaranId = null;

function formatRupiah(angka) {
    return angka.toLocaleString('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function updateUI() {
    tabel.innerHTML = '';
    let totalNominal = 0;

    if (pengeluaran.length === 0) {
        const emptyMessageRow = document.createElement('tr');
        emptyMessageRow.innerHTML = `<td colspan="5" class="empty-table-message">Belum ada pengeluaran</td>`;
        tabel.appendChild(emptyMessageRow);
    } else {
        pengeluaran.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.nama}</td>
                <td>${formatRupiah(item.nominal)}</td>
                <td>${item.keterangan}</td>
                <td>${item.waktu}</td>
                <td>
                    <button class="buttonHapus" onclick="openHapusPengeluaran(${item.id})">Hapus</button>
                </td>`;
            tabel.appendChild(row);
            totalNominal += item.nominal;
        });
    }

    totalEl.textContent = formatRupiah(totalNominal);
}

function checkInputs() {
    if (nama.value.trim() && nominal.value && waktu.value) {
        tambahPengeluaran.disabled = false;
    } else {
        tambahPengeluaran.disabled = true;
    }
}

[nama, nominal, waktu].forEach(input => {
    input.addEventListener('input', checkInputs);
});

tambahPengeluaran.addEventListener('click', () => {
    const namaValue = nama.value.trim();
    const nominalValue = parseFloat(nominal.value);
    const keteranganValue = keterangan.value.trim();
    const waktuValue = waktu.value;

    if (!namaValue || isNaN(nominalValue) || !waktuValue) {
        alert('Semua input harus diisi');
        return;
    }

    const pengeluaranBaru = {
        id: Date.now(),
        nama: namaValue,
        nominal: nominalValue,
        keterangan: keteranganValue,
        waktu: waktuValue
    };

    pengeluaran.push(pengeluaranBaru);
    localStorage.setItem('pengeluaran', JSON.stringify(pengeluaran));

    nama.value = '';
    nominal.value = '';
    keterangan.value = '';
    waktu.value = '';
    tambahPengeluaran.disabled = true;

    updateUI();
});

function openHapusPengeluaran(id) {
    hapusPengeluaranId = id;
    openFiturHapus('hapusPengeluaran');
}

confirmHapus.addEventListener('click', () => {
    pengeluaran = pengeluaran.filter(item => item.id !== hapusPengeluaranId);
    localStorage.setItem('pengeluaran', JSON.stringify(pengeluaran));
    updateUI();
    closeFiturHapus('hapusPengeluaran');
});

function openFiturHapus(fiturHapusId) {
    document.getElementById(fiturHapusId).style.display = 'flex';
}

function closeFiturHapus(fiturHapusId) {
    document.getElementById(fiturHapusId).style.display = 'none';
}

updateUI();