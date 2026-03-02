// ── State ──────────────────────────────────────────────────────────────────
let currentType    = 'pembukaan';
let qaCount        = 0;
let perubahanCount = 0;
let penggunaCount  = 0;

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  addPengguna();
});

// ── Switch Document Type ───────────────────────────────────────────────────
function switchType(val) {
  currentType = val;
  document.querySelectorAll('.type-card').forEach(c => c.classList.remove('active'));
  document.getElementById('card-' + val).classList.add('active');

  const isAanwijzing = val === 'aanwijzing';
  document.getElementById('section-qa').classList.toggle('hidden', !isAanwijzing);
  document.getElementById('section-perubahan').classList.toggle('hidden', !isAanwijzing);

  if (isAanwijzing && qaCount === 0) addQA();
}

// ── Peserta ────────────────────────────────────────────────────────────────
function addPeserta() {
  const list = document.getElementById('peserta-list');
  const div  = document.createElement('div');
  div.className = 'list-item';
  div.innerHTML = `
    <span class="list-num"></span>
    <input type="text" placeholder="Nama peserta / perusahaan...">
    <button class="btn-icon" onclick="removePeserta(this)" title="Hapus">×</button>`;
  list.appendChild(div);
  renumberPeserta();
}

function removePeserta(btn) {
  btn.parentElement.remove();
  renumberPeserta();
}

function renumberPeserta() {
  document.querySelectorAll('#peserta-list .list-num').forEach((s, i) => {
    s.textContent = (i + 1) + '.';
  });
}

function getPeserta() {
  return [...document.querySelectorAll('#peserta-list .list-item input')]
    .map(i => i.value.trim())
    .filter(Boolean);
}

// ── Q&A ────────────────────────────────────────────────────────────────────
function addQA() {
  qaCount++;
  const id  = qaCount;
  const div = document.createElement('div');
  div.className = 'qa-item';
  div.id = 'qa-' + id;
  div.innerHTML = `
    <div class="qa-item-header">
      <span class="qa-badge">Pertanyaan & Jawaban #${id}</span>
      <button class="btn-icon" onclick="document.getElementById('qa-${id}').remove()">×</button>
    </div>
    <div class="qa-body">
      <div class="field">
        <label>Pertanyaan</label>
        <textarea placeholder="Tulis pertanyaan dari peserta..." rows="3"></textarea>
      </div>
      <div class="field">
        <label>Jawaban</label>
        <textarea placeholder="Tulis jawaban dari panitia..." rows="3"></textarea>
      </div>
    </div>`;
  document.getElementById('qa-list').appendChild(div);
}

function getQA() {
  return [...document.querySelectorAll('.qa-item')].map(item => ({
    pertanyaan: item.querySelectorAll('textarea')[0].value.trim(),
    jawaban:    item.querySelectorAll('textarea')[1].value.trim()
  })).filter(qa => qa.pertanyaan || qa.jawaban);
}

// ── Perubahan ──────────────────────────────────────────────────────────────
function addPerubahan() {
  perubahanCount++;
  const id  = perubahanCount;
  const div = document.createElement('div');
  div.className = 'perubahan-item';
  div.id = 'per-' + id;
  div.innerHTML = `
    <div class="perubahan-header">
      <span class="qa-badge">Perubahan #${id}</span>
      <button class="btn-icon" onclick="document.getElementById('per-${id}').remove()">×</button>
    </div>
    <div class="perubahan-body">
      <div class="field">
        <label>Sebelum</label>
        <textarea placeholder="Ketentuan sebelum perubahan..." rows="2"></textarea>
      </div>
      <div class="field">
        <label>Sesudah</label>
        <textarea placeholder="Ketentuan sesudah perubahan..." rows="2"></textarea>
      </div>
      <div class="form-row">
        <div class="field">
          <label>Diusulkan Oleh</label>
          <input type="text" placeholder="Nama / pihak yang mengusulkan">
        </div>
        <div class="field">
          <label>Pertimbangan</label>
          <input type="text" placeholder="Alasan / pertimbangan perubahan">
        </div>
      </div>
    </div>`;
  document.getElementById('perubahan-list').appendChild(div);
}

function getPerubahan() {
  return [...document.querySelectorAll('.perubahan-item')].map(item => ({
    sebelum:      item.querySelectorAll('textarea')[0].value.trim(),
    sesudah:      item.querySelectorAll('textarea')[1].value.trim(),
    diusulkan:    item.querySelectorAll('input')[0].value.trim(),
    pertimbangan: item.querySelectorAll('input')[1].value.trim()
  })).filter(p => p.sebelum || p.sesudah);
}

// ── Unit Kerja Pengguna ────────────────────────────────────────────────────
function addPengguna() {
  penggunaCount++;
  const id  = penggunaCount;
  const div = document.createElement('div');
  div.className = 'pengguna-item';
  div.id = 'pg-' + id;
  div.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
      <span style="font-size:11px;font-family:var(--mono);color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;">Pengguna #${id}</span>
      <button class="btn-icon" onclick="document.getElementById('pg-${id}').remove()" title="Hapus">×</button>
    </div>
    <div class="field" style="margin-bottom:8px;">
      <label>Nama</label>
      <input type="text" placeholder="Nama lengkap">
    </div>
    <div class="field">
      <label>Jabatan</label>
      <input type="text" placeholder="Jabatan / posisi">
    </div>`;
  document.getElementById('pengguna-list').appendChild(div);
}

function getPengguna() {
  return [...document.querySelectorAll('.pengguna-item')].map(item => ({
    nama:    item.querySelectorAll('input')[0].value.trim(),
    jabatan: item.querySelectorAll('input')[1].value.trim()
  })).filter(p => p.nama);
}

// ── Collect All Form Data ──────────────────────────────────────────────────
function getFormData() {
  const tanggalVal = document.getElementById('tanggal').value;
  let tanggalFmt   = '';
  if (tanggalVal) {
    const d = new Date(tanggalVal + 'T00:00:00');
    tanggalFmt = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  return {
    jenis:           currentType,
    nama_pekerjaan:  document.getElementById('nama_pekerjaan').value.trim(),
    nomor_pengadaan: document.getElementById('nomor_pengadaan').value.trim(),
    hari:            document.getElementById('hari').value.trim(),
    tanggal:         tanggalFmt,
    lokasi:          document.getElementById('lokasi').value.trim(),
    metode:          document.getElementById('metode_pengadaan').value,
    peserta:         getPeserta(),
    qa:              getQA(),
    perubahan:       getPerubahan(),
    pelaksana_nama:  document.getElementById('pelaksana_nama').value.trim(),
    pelaksana_jabatan: document.getElementById('pelaksana_jabatan').value.trim(),
    pengguna:        getPengguna()
  };
}

// ── Preview Modal ──────────────────────────────────────────────────────────
function showPreview() {
  const data = getFormData();
  document.getElementById('modal-body').innerHTML = buildPreviewHTML(data);
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('modal').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });
});

function buildPreviewHTML(data) {
  const isAan   = data.jenis === 'aanwijzing';
  const judulBA = isAan ? 'BERITA ACARA AANWIJZING' : 'BERITA ACARA PEMBUKAAN DOKUMEN';

  const pesertaRows = data.peserta.map(p => `<li>${p}</li>`).join('');

  let qaHTML = '';
  if (isAan && data.qa.length > 0) {
    qaHTML = `<p class="section-title">PERTANYAAN DAN JAWABAN</p>`;
    data.qa.forEach((qa, i) => {
      qaHTML += `<div class="qa-block">
        <p><b>${i + 1}. Pertanyaan:</b> ${qa.pertanyaan}</p>
        <p><b>&nbsp;&nbsp;&nbsp;Jawaban:</b> ${qa.jawaban}</p>
      </div>`;
    });
  }

  let perubahanHTML = '';
  if (isAan && data.perubahan.length > 0) {
    perubahanHTML = `<p class="section-title">PERUBAHAN DOKUMEN</p>
    <table border="1" style="border-collapse:collapse;font-size:11pt;width:100%">
      <tr style="background:#eee">
        <th style="padding:6px">No</th>
        <th style="padding:6px">Sebelum</th>
        <th style="padding:6px">Sesudah</th>
        <th style="padding:6px">Diusulkan Oleh</th>
        <th style="padding:6px">Pertimbangan</th>
      </tr>
      ${data.perubahan.map((p, i) => `<tr>
        <td style="padding:6px;text-align:center">${i + 1}</td>
        <td style="padding:6px">${p.sebelum}</td>
        <td style="padding:6px">${p.sesudah}</td>
        <td style="padding:6px">${p.diusulkan}</td>
        <td style="padding:6px">${p.pertimbangan}</td>
      </tr>`).join('')}
    </table>`;
  }

  const ttdPenggunaHTML = data.pengguna.map(p => `
    <div class="ttd-col">
      <div class="ttd-space"></div>
      <div class="ttd-name">${p.nama}</div>
      <div>${p.jabatan}</div>
    </div>`).join('');

  return `<div class="preview-doc">
    <h2>${judulBA}</h2>
    <p class="nomor">Nomor: ${data.nomor_pengadaan || '...'}</p>

    <p>Pada hari ini, <b>${data.hari || '...'}</b>, tanggal <b>${data.tanggal || '...'}</b>,
    bertempat di <b>${data.lokasi || '...'}</b>, telah dilaksanakan
    ${isAan ? 'rapat aanwijzing' : 'pembukaan dokumen'} untuk:</p>

    <table>
      <tr><td>Nama Pekerjaan</td><td>:</td><td>${data.nama_pekerjaan || '-'}</td></tr>
      <tr><td>Nomor Pengadaan</td><td>:</td><td>${data.nomor_pengadaan || '-'}</td></tr>
      <tr><td>Metode Pengadaan</td><td>:</td><td>${data.metode || '-'}</td></tr>
    </table>

    <p class="section-title">PESERTA</p>
    <ol class="peserta-list">${pesertaRows || '<li>-</li>'}</ol>

    ${qaHTML}
    ${perubahanHTML}

    <div class="ttd-section">
      <div>
        <p style="text-align:center;font-weight:bold;margin-bottom:4px">Unit Kerja Pengadaan</p>
        <div class="ttd-col">
          <div class="ttd-space"></div>
          <div class="ttd-name">Jessica Puspadayasari</div>
          <div>Asdep Pelaksanaan Pengadaan</div>
        </div>
        ${data.pelaksana_nama ? `<div class="ttd-col" style="margin-top:20px">
          <div class="ttd-space"></div>
          <div class="ttd-name">${data.pelaksana_nama}</div>
          <div>${data.pelaksana_jabatan}</div>
        </div>` : ''}
      </div>
      <div>
        <p style="text-align:center;font-weight:bold;margin-bottom:4px">Unit Kerja Pengguna</p>
        ${ttdPenggunaHTML || '<p style="color:gray">-</p>'}
      </div>
    </div>
  </div>`;
}

// ── Generate PDF ───────────────────────────────────────────────────────────
async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const data      = getFormData();
  const isAan     = data.jenis === 'aanwijzing';

  const doc      = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW    = 210;
  const pageH    = 297;
  const marginL  = 25;
  const marginR  = 20;
  const marginT  = 25;
  const marginB  = 25;
  const contentW = pageW - marginL - marginR;
  let y          = marginT;
  const lineH    = 6;

  // Helper: add new page if content overflows
  const checkPage = (needed = 10) => {
    if (y + needed > pageH - marginB) { doc.addPage(); y = marginT; }
  };

  // ── Document Header ──
  doc.setFontSize(14);
  doc.setFont('times', 'bold');
  const judul = isAan ? 'BERITA ACARA AANWIJZING' : 'BERITA ACARA PEMBUKAAN DOKUMEN';
  doc.text(judul, pageW / 2, y, { align: 'center' });
  y += 7;

  doc.setFontSize(11);
  doc.setFont('times', 'normal');
  doc.text(`Nomor: ${data.nomor_pengadaan || ''}`, pageW / 2, y, { align: 'center' });
  y += 10;

  doc.setLineWidth(0.5);
  doc.line(marginL, y, pageW - marginR, y);
  y += 8;

  // ── Opening Paragraph ──
  const pembukaan = `Pada hari ini, ${data.hari || '...'}, tanggal ${data.tanggal || '...'}, bertempat di ${data.lokasi || '...'}, telah dilaksanakan ${isAan ? 'Rapat Aanwijzing (Pemberian Penjelasan)' : 'Pembukaan Dokumen Penawaran'} untuk pekerjaan:`;
  doc.setFontSize(11);
  doc.setFont('times', 'normal');
  doc.splitTextToSize(pembukaan, contentW).forEach(line => {
    checkPage(7);
    doc.text(line, marginL, y);
    y += lineH;
  });
  y += 2;

  // ── Pekerjaan Table ──
  const col1 = 60, col2 = 5;
  [
    ['Nama Pekerjaan',  data.nama_pekerjaan  || '-'],
    ['Nomor Pengadaan', data.nomor_pengadaan || '-'],
    ['Metode Pengadaan', data.metode         || '-'],
  ].forEach(([label, val]) => {
    checkPage(7);
    doc.setFont('times', 'normal');
    doc.text(label, marginL + 4, y);
    doc.text(':', marginL + col1, y);
    doc.splitTextToSize(val, contentW - col1 - col2 - 4).forEach((vl, vi) => {
      if (vi === 0) doc.text(vl, marginL + col1 + col2, y);
      else { y += lineH; doc.text(vl, marginL + col1 + col2, y); }
    });
    y += lineH;
  });
  y += 4;

  // ── Peserta ──
  doc.setFont('times', 'bold');
  doc.text('Peserta yang hadir:', marginL, y);
  y += 7;
  doc.setFont('times', 'normal');
  if (data.peserta.length === 0) {
    doc.text('-', marginL + 4, y); y += lineH;
  } else {
    data.peserta.forEach((p, i) => {
      checkPage(7);
      doc.splitTextToSize(`${i + 1}. ${p}`, contentW - 8).forEach((pl, pi) => {
        doc.text(pi === 0 ? pl : `   ${pl}`, marginL + 4, y);
        y += lineH;
      });
    });
  }
  y += 4;

  // ── Q&A (Aanwijzing only) ──
  if (isAan && data.qa.length > 0) {
    checkPage(15);
    doc.setFont('times', 'bold');
    doc.text('PERTANYAAN DAN JAWABAN:', marginL, y);
    y += 8;

    data.qa.forEach((qa, i) => {
      checkPage(20);
      doc.setFont('times', 'bold');
      doc.text(`${i + 1}. Pertanyaan:`, marginL + 4, y);
      y += lineH;
      doc.setFont('times', 'normal');
      doc.splitTextToSize(qa.pertanyaan || '-', contentW - 12).forEach(l => {
        checkPage(7); doc.text(l, marginL + 12, y); y += lineH;
      });
      y += 2;
      doc.setFont('times', 'bold');
      doc.text('   Jawaban:', marginL + 4, y);
      y += lineH;
      doc.setFont('times', 'normal');
      doc.splitTextToSize(qa.jawaban || '-', contentW - 12).forEach(l => {
        checkPage(7); doc.text(l, marginL + 12, y); y += lineH;
      });
      y += 4;
    });
  }

  // ── Perubahan (Aanwijzing only) ──
  if (isAan && data.perubahan.length > 0) {
    checkPage(20);
    doc.setFont('times', 'bold');
    doc.text('PERUBAHAN DOKUMEN:', marginL, y);
    y += 8;

    const tCols   = [8, 45, 45, 38, 38];
    const tHeaders = ['No', 'Sebelum', 'Sesudah', 'Diusulkan Oleh', 'Pertimbangan'];
    const tX      = [marginL];
    tCols.forEach((w, i) => { if (i > 0) tX.push(tX[i - 1] + tCols[i - 1]); });

    const drawTableRow = (cells, isBold = false) => {
      const cellLines = cells.map((c, ci) => doc.splitTextToSize(c, tCols[ci] - 3));
      const maxLines  = Math.max(...cellLines.map(l => l.length));
      const rh        = maxLines * lineH + 4;
      checkPage(rh + 2);

      doc.setFillColor(isBold ? 230 : 255, isBold ? 230 : 255, isBold ? 230 : 255);
      doc.rect(tX[0], y - 4, tCols.reduce((a, b) => a + b, 0), rh, isBold ? 'F' : 'S');
      tX.forEach((x, i) => doc.rect(x, y - 4, tCols[i], rh, 'S'));

      cells.forEach((c, ci) => {
        doc.setFont('times', isBold ? 'bold' : 'normal');
        doc.splitTextToSize(c, tCols[ci] - 3).forEach((cl, li) => {
          doc.text(cl, tX[ci] + 2, y + li * lineH);
        });
      });
      y += rh;
    };

    drawTableRow(tHeaders, true);
    data.perubahan.forEach((p, i) => {
      drawTableRow([String(i + 1), p.sebelum || '-', p.sesudah || '-', p.diusulkan || '-', p.pertimbangan || '-']);
    });
    y += 4;
  }

  // ── Closing Paragraph ──
  checkPage(20);
  doc.setFont('times', 'normal');
  const penutup = 'Demikian Berita Acara ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.';
  doc.splitTextToSize(penutup, contentW).forEach(l => {
    checkPage(7); doc.text(l, marginL, y); y += lineH;
  });
  y += 10;

  // ── Signatures ──
  checkPage(60);
  const halfW = contentW / 2;
  const ttdY  = y;
  const spaceH = 22;

  // Left column: Unit Kerja Pengadaan
  doc.setFont('times', 'bold');
  doc.text('Unit Kerja Pengadaan', marginL + halfW / 2, y, { align: 'center' });
  y += 8;

  y += spaceH;
  doc.line(marginL + 2, y, marginL + halfW - 2, y);
  doc.setFont('times', 'bold');
  doc.text('Jessica Puspadayasari', marginL + halfW / 2, y + 5, { align: 'center' });
  doc.setFont('times', 'normal');
  doc.text('Asdep Pelaksanaan Pengadaan', marginL + halfW / 2, y + 11, { align: 'center' });
  y += 18;

  if (data.pelaksana_nama) {
    y += spaceH;
    doc.line(marginL + 2, y, marginL + halfW - 2, y);
    doc.setFont('times', 'bold');
    doc.text(data.pelaksana_nama, marginL + halfW / 2, y + 5, { align: 'center' });
    doc.setFont('times', 'normal');
    doc.text(data.pelaksana_jabatan || 'Pelaksana Pengadaan', marginL + halfW / 2, y + 11, { align: 'center' });
    y += 18;
  }

  // Right column: Unit Kerja Pengguna
  let ry = ttdY;
  const rx = marginL + halfW;

  doc.setFont('times', 'bold');
  doc.text('Unit Kerja Pengguna', rx + halfW / 2, ry, { align: 'center' });
  ry += 8;

  data.pengguna.forEach(p => {
    ry += spaceH;
    doc.line(rx + 2, ry, rx + halfW - 2, ry);
    doc.setFont('times', 'bold');
    doc.text(p.nama, rx + halfW / 2, ry + 5, { align: 'center' });
    doc.setFont('times', 'normal');
    doc.text(p.jabatan || '', rx + halfW / 2, ry + 11, { align: 'center' });
    ry += 18;
  });

  // ── Page Numbers ──
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setFont('times', 'normal');
    doc.text(`Halaman ${i} dari ${totalPages}`, pageW / 2, pageH - 12, { align: 'center' });
  }

  // ── Save ──
  const filename = isAan ? 'BA_Aanwijzing' : 'BA_Pembukaan_Dokumen';
  const nomor    = data.nomor_pengadaan.replace(/\//g, '-') || 'dokumen';
  doc.save(`${filename}_${nomor}.pdf`);
}
