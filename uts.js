// ========== NAVIGASI ANTAR HALAMAN ==========
const cover    = document.getElementById('halaman-cover');
const undangan = document.getElementById('halaman-undangan');
const musik    = document.getElementById('musik');
const btnMusik = document.getElementById('btnMusik');

function bukaCover() {
    undangan.classList.remove('tampil');
    undangan.style.display = 'none';
    cover.classList.remove('hilang');
    cover.style.removeProperty('display');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function bukaUndangan() {
    cover.classList.add('hilang');
    putarMusik();
    setTimeout(() => {
        cover.style.display = 'none';
        undangan.style.display = 'block';
        undangan.getBoundingClientRect();
        undangan.classList.add('tampil');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
}

document.getElementById('btnBuka').addEventListener('click', bukaUndangan);
document.getElementById('btnKembali').addEventListener('click', bukaCover);
document.getElementById('btnFooterKembali').addEventListener('click', bukaCover);

// ========== MUSIK LATAR ==========
function setTampilanMusik(sedangPutar) {
    btnMusik.classList.toggle('putar', sedangPutar);
    btnMusik.classList.toggle('mati', !sedangPutar);
    btnMusik.setAttribute('aria-label', sedangPutar ? 'Matikan musik' : 'Putar musik');
    btnMusik.title = sedangPutar ? 'Matikan musik' : 'Putar musik';
}

async function putarMusik() {
    try {
        if (musik.readyState === 0) musik.load();
        await musik.play();
        setTampilanMusik(true);
    } catch (error) {
        setTampilanMusik(false);
        console.error('Musik gagal diputar. Pastikan l1.mp3 berada satu folder dengan uts.html:', error);
    }
}

musik.addEventListener('play', () => setTampilanMusik(true));
musik.addEventListener('pause', () => setTampilanMusik(false));
musik.addEventListener('ended', () => setTampilanMusik(false));
musik.addEventListener('error', () => {
    setTampilanMusik(false);
    console.error('File l1.mp3 tidak ditemukan atau tidak dapat dibaca browser.');
});

btnMusik.addEventListener('click', async () => {
    if (musik.paused) await putarMusik();
    else musik.pause();
});
setTampilanMusik(false);
// ========== AUTOPLAY SAAT MASUK WEB ==========
let musikSudahMulai = false;

function pemicuInteraksi() {/*blokir*/
    if (musikSudahMulai) return;
    musik.play().then(() => {
        musikSudahMulai = true;
        hapusPemicu();
    }).catch(() => {});
}

const daftarEvent = ['click', 'touchstart', 'keydown', 'scroll', 'wheel', 'mousemove'];

function hapusPemicu() {
    daftarEvent.forEach(e => document.removeEventListener(e, pemicuInteraksi));
}

// 1) Coba langsung saat halaman dimuat
window.addEventListener('load', () => {
    musik.play().then(() => {
        musikSudahMulai = true;
    }).catch(() => {
        daftarEvent.forEach(e =>
            document.addEventListener(e, pemicuInteraksi, { passive: true })
        );
    });
});
// ========== COUNTDOWN ==========
var targetTanggal = new Date(2026, 9, 23, 10, 0, 0);

function hitungMundur() {
    const sekarang = new Date();
    const selisih = targetTanggal.getTime() - sekarang.getTime();
    const row = document.getElementById('countdown-row');

    let pesan = document.getElementById('countdown-message');
    if (!pesan) {
        pesan = document.createElement('div');
        pesan.id = 'countdown-message';
        pesan.className = 'text-center';
        pesan.style.cssText = `
            color: #d4a843;
            font-family: 'Cinzel', serif;
            font-size: 1.1rem;
            letter-spacing: 2px;
            margin-top: 25px;
            display: none;
        `;
        row.insertAdjacentElement('afterend', pesan);
    }

    if (selisih <= 0) {
        row.style.display = 'none';
        pesan.style.display = 'block';
        pesan.textContent = '✨ KAMI TELAH MENIKAH ✨';
        return;
    }

    row.style.display = '';
    pesan.style.display = 'none';

    document.getElementById('cd-hari').textContent  = Math.floor(selisih / 86400000);
    document.getElementById('cd-jam').textContent   = Math.floor((selisih % 86400000) / 3600000);
    document.getElementById('cd-menit').textContent = Math.floor((selisih % 3600000) / 60000);
    document.getElementById('cd-detik').textContent = Math.floor((selisih % 60000) / 1000);
}

hitungMundur();
setInterval(hitungMundur, 1000);
