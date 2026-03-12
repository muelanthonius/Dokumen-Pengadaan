// ── State ──────────────────────────────────────────────────────────────────
let currentType    = 'pembukaan';
let qaCount        = 0;
let perubahanCount = 0;

// ── Helpers ────────────────────────────────────────────────────────────────

/** Simple Indonesian number-to-words for peserta count */
function terbilang(n) {
  const satuan = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan',
                  'sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas',
                  'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas'];
  if (n === 0)  return 'nol';
  if (n < 20)   return satuan[n];
  if (n < 100) {
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    const tensWord = tens === 2 ? 'dua puluh' : tens === 3 ? 'tiga puluh' : tens === 4 ? 'empat puluh' :
                     tens === 5 ? 'lima puluh' : tens === 6 ? 'enam puluh' : tens === 7 ? 'tujuh puluh' :
                     tens === 8 ? 'delapan puluh' : 'sembilan puluh';
    return tensWord + (ones ? ' ' + satuan[ones] : '');
  }
  if (n < 200)  return 'seratus' + (n % 100 ? ' ' + terbilang(n % 100) : '');
  return terbilang(Math.floor(n / 100)) + ' ratus' + (n % 100 ? ' ' + terbilang(n % 100) : '');
}

function formatJumlah(n) {
  return `${n} (${terbilang(n)})`;
}

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('modal').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });
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
    <button class="btn-icon" onclick="removePeserta(this)" title="Hapus">&#215;</button>`;
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
      <span class="qa-badge">Pertanyaan &amp; Jawaban #${id}</span>
      <button class="btn-icon" onclick="document.getElementById('qa-${id}').remove()">&#215;</button>
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
      <button class="btn-icon" onclick="document.getElementById('per-${id}').remove()">&#215;</button>
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

// ── Collect All Form Data ──────────────────────────────────────────────────
function getFormData() {
  const tanggalVal = document.getElementById('tanggal').value;
  let tanggalFmt   = '';
  if (tanggalVal) {
    const d = new Date(tanggalVal + 'T00:00:00');
    tanggalFmt = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  const jamEl  = document.getElementById('jam');
  const jamVal = jamEl ? jamEl.value : '';
  const jamFmt = jamVal ? jamVal + ' WIB' : '...';

  return {
    jenis:             currentType,
    nama_pekerjaan:    document.getElementById('nama_pekerjaan').value.trim(),
    nomor_pengadaan:   document.getElementById('nomor_pengadaan').value.trim(),
    hari:              document.getElementById('hari').value.trim(),
    tanggal:           tanggalFmt,
    jam:               jamFmt,
    lokasi:            document.getElementById('lokasi').value.trim(),
    metode:            document.getElementById('metode_pengadaan').value,
    peserta:           getPeserta(),
    qa:                getQA(),
    perubahan:         getPerubahan(),
    pelaksana_nama:    document.getElementById('pelaksana_nama').value.trim(),
    pelaksana_jabatan: document.getElementById('pelaksana_jabatan').value.trim(),
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

// ── Build Preview HTML ─────────────────────────────────────────────────────
function buildPreviewHTML(data) {
  const isAan = data.jenis === 'aanwijzing';

  // Shared TTD block
  const ttdHTML = `
    <div class="ttd-section">
      <div>
        <p style="text-align:center;font-weight:bold;margin-bottom:4px">Mengetahui,</p>
        <div class="ttd-col">
          <div class="ttd-space"></div>
          <div class="ttd-name">Jessica Puspadayasari</div>
          <div>Asdep Pelaksanaan Pengadaan</div>
        </div>
      </div>
      <div>
        <p style="text-align:center;font-weight:bold;margin-bottom:4px">Yang Membuat,</p>
        <div class="ttd-col">
          <div class="ttd-space"></div>
          <div class="ttd-name">${data.pelaksana_nama || '...'}</div>
          <div>${data.pelaksana_jabatan || ''}</div>
        </div>
      </div>
    </div>`;

  if (!isAan) {
    // ── BA Pembukaan Dokumen ──
    const jml        = data.peserta.length;
    const jmlStr     = formatJumlah(jml);
    const pesertaLi  = data.peserta.map((p, i) =>
      `<li style="margin-left:30px;list-style:none;">1.2.${i + 1}. ${p}</li>`).join('');

    return `<div class="preview-doc">
      <h2>BERITA ACARA PEMBUKAAN DOKUMEN PENAWARAN</h2>
      <h2>${data.nama_pekerjaan || '...'}</h2>
      <p class="nomor">Nomor: ${data.nomor_pengadaan || '...'}</p>

      <p>Pada hari ini, <b>${data.hari || '...'}</b>, tanggal <b>${data.tanggal || '...'}</b>,
      pukul <b>${data.jam || '...'}</b>, bertempat di <b>${data.lokasi || '...'}</b>,
      telah dilaksanakan Pembukaan Dokumen Penawaran.</p>

      <p style="margin-top:10px;text-align:justify">Bidang Pelaksanaan Pengadaan BPJS Ketenagakerjaan telah mengadakan kegiatan pemasukan
      dan pembukaan dokumen penawaran pekerjaan <b>${data.nama_pekerjaan || '...'}</b>
      yang diproses dengan metode <b>${data.metode || '...'}</b>.</p>

      <ol style="margin-top:12px;padding-left:0;list-style:none;line-height:2">
        <li><b>1. Pelaksanaan pemasukan dan pembukaan dokumen penawaran dihadiri oleh:</b>
          <ul style="list-style:none;padding-left:0;">
            <li style="margin-left:20px">1.1.&nbsp; Bidang Pelaksanaan Pengadaan</li>
            <li style="margin-left:20px">1.2.&nbsp; Calon penyedia yang menyampaikan dokumen penawaran pada aplikasi
            Pengadaan Barang/Jasa sebanyak <b>${jmlStr}</b> perusahaan, yaitu:
              <ul style="list-style:none;padding-left:0;">${pesertaLi || '<li style="margin-left:30px">1.2.1. -</li>'}</ul>
            </li>
            <li style="margin-left:20px">1.3.&nbsp; Calon penyedia yang menghadiri kegiatan pemasukan dan pembukaan
            dokumen penawaran sebanyak <span style="border-bottom:1px solid #000;display:inline-block;min-width:60px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> perusahaan.</li>
            <li style="margin-left:20px">1.4.&nbsp; Daftar hadir sebagaimana terlampir.</li>
          </ul>
        </li>
        <li><b>2. Pembukaan dokumen penawaran dilakukan oleh personil Bidang Pelaksanaan Pengadaan dan wakil dari
        Calon Penyedia yang hadir sebagaimana dimaksud pada angka 1.3.</b></li>
        <li><b>3. Hasil pembukaan dokumen penawaran sebagaimana tertuang dalam lampiran Berita Acara ini.</b></li>
      </ol>

      <p style="margin-top:14px">Demikian Berita Acara ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.</p>
      ${ttdHTML}
    </div>`;

  } else {
    // ── BA Aanwijzing ──
    const pesertaRows = data.peserta.map(p => `<li>${p}</li>`).join('');

    let qaHTML = '';
    if (data.qa.length > 0) {
      qaHTML = `<p class="section-title">PERTANYAAN DAN JAWABAN</p>`;
      data.qa.forEach((qa, i) => {
        qaHTML += `<div class="qa-block">
          <p><b>${i + 1}. Pertanyaan:</b> ${qa.pertanyaan}</p>
          <p><b>&nbsp;&nbsp;&nbsp;Jawaban:</b> ${qa.jawaban}</p>
        </div>`;
      });
    }

    let perubahanHTML = '';
    if (data.perubahan.length > 0) {
      perubahanHTML = `<p class="section-title">PERUBAHAN DOKUMEN</p>
      <table border="1" style="border-collapse:collapse;font-size:11pt;width:100%">
        <tr style="background:#eee">
          <th style="padding:6px">No</th><th style="padding:6px">Sebelum</th>
          <th style="padding:6px">Sesudah</th><th style="padding:6px">Diusulkan Oleh</th>
          <th style="padding:6px">Pertimbangan</th>
        </tr>
        ${data.perubahan.map((p, i) => `<tr>
          <td style="padding:6px;text-align:center">${i + 1}</td>
          <td style="padding:6px">${p.sebelum}</td><td style="padding:6px">${p.sesudah}</td>
          <td style="padding:6px">${p.diusulkan}</td><td style="padding:6px">${p.pertimbangan}</td>
        </tr>`).join('')}
      </table>`;
    }

    return `<div class="preview-doc">
      <h2>BERITA ACARA AANWIJZING</h2>
      <p class="nomor">Nomor: ${data.nomor_pengadaan || '...'}</p>

      <p>Pada hari ini, <b>${data.hari || '...'}</b>, tanggal <b>${data.tanggal || '...'}</b>,
      pukul <b>${data.jam || '...'}</b>, bertempat di <b>${data.lokasi || '...'}</b>,
      telah dilaksanakan Rapat Aanwijzing (Pemberian Penjelasan) untuk:</p>

      <table>
        <tr><td>Nama Pekerjaan</td><td>:</td><td>${data.nama_pekerjaan || '-'}</td></tr>
        <tr><td>Nomor Pengadaan</td><td>:</td><td>${data.nomor_pengadaan || '-'}</td></tr>
        <tr><td>Metode Pengadaan</td><td>:</td><td>${data.metode || '-'}</td></tr>
      </table>

      <p class="section-title">PESERTA</p>
      <ol class="peserta-list">${pesertaRows || '<li>-</li>'}</ol>

      ${qaHTML}
      ${perubahanHTML}

      <p style="margin-top:14px">Demikian Berita Acara ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.</p>
      ${ttdHTML}
    </div>`;
  }
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

  const checkPage = (needed = 10) => {
    if (y + needed > pageH - marginB) { doc.addPage(); y = marginT; }
  };

  const printWrapped = (text, x, maxW) => {
    doc.splitTextToSize(text, maxW).forEach(line => {
      checkPage(7); doc.text(line, x, y); y += lineH;
    });
  };

  // ── Document Header ──
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  const judul = isAan ? 'BERITA ACARA AANWIJZING' : 'BERITA ACARA PEMBUKAAN DOKUMEN PENAWARAN';
  doc.text(judul, pageW / 2, y, { align: 'center' });
  y += 7;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nomor: ${data.nomor_pengadaan || ''}`, pageW / 2, y, { align: 'center' });
  y += 10;

  doc.setLineWidth(0.5);
  doc.line(marginL, y, pageW - marginR, y);
  y += 8;

  doc.setFontSize(11);

  if (!isAan) {
    // ════════════════════════════════════════
    // BA PEMBUKAAN DOKUMEN
    // ════════════════════════════════════════

    doc.setFont('helvetica', 'normal');

    // Paragraf 1
    printWrapped(
      `Pada hari ini, ${data.hari || '...'}, tanggal ${data.tanggal || '...'}, pukul ${data.jam || '...'}, bertempat di ${data.lokasi || '...'}, telah dilaksanakan Pembukaan Dokumen Penawaran.`,
      marginL, contentW
    );
    y += 3;

    // Paragraf 2
    printWrapped(
      `Bidang Pelaksanaan Pengadaan BPJS Ketenagakerjaan telah mengadakan kegiatan pemasukan dan pembukaan dokumen penawaran pekerjaan ${data.nama_pekerjaan || '...'} yang diproses dengan metode ${data.metode || '...'}.`,
      marginL, contentW
    );
    y += 3;

    // Indentation levels
    const ind0 = marginL;       // "1."
    const ind1 = marginL + 8;   // "1.1."
    const ind2 = marginL + 16;  // "1.2.1."
    const txt0 = ind0 + 6;
    const txt1 = ind1 + 10;
    const txt2 = ind2 + 12;

    // 1.
    checkPage(10);
    doc.text('1.', ind0, y);
    const lines1 = doc.splitTextToSize('Pelaksanaan pemasukan dan pembukaan dokumen penawaran dihadiri oleh:', contentW - 6);
    lines1.forEach((l, li) => { doc.text(l, li === 0 ? txt0 : txt0, y); y += lineH; });
    y += 1;

    // 1.1.
    checkPage(7);
    doc.text('1.1.', ind1, y);
    doc.text('Bidang Pelaksanaan Pengadaan', txt1, y);
    y += lineH + 1;

    // 1.2.
    checkPage(10);
    doc.text('1.2.', ind1, y);
    const jmlStr  = formatJumlah(data.peserta.length);
    const lines12 = doc.splitTextToSize(
      `Calon penyedia yang menyampaikan dokumen penawaran pada aplikasi Pengadaan Barang/Jasa sebanyak ${jmlStr} perusahaan, yaitu:`,
      contentW - (txt1 - marginL)
    );
    lines12.forEach((l, li) => { doc.text(l, txt1, y); y += lineH; });
    y += 1;

    // 1.2.x
    if (data.peserta.length === 0) {
      checkPage(7);
      doc.text('1.2.1.', ind2, y);
      doc.text('-', txt2, y);
      y += lineH;
    } else {
      data.peserta.forEach((p, i) => {
        checkPage(7);
        doc.text(`1.2.${i + 1}.`, ind2, y);
        const pLines = doc.splitTextToSize(p, contentW - (txt2 - marginL));
        pLines.forEach((pl, pi) => { doc.text(pl, txt2, y); y += lineH; });
      });
    }
    y += 1;

    // 1.3.
    checkPage(7);
    doc.text('1.3.', ind1, y);
    const lines13 = doc.splitTextToSize(
      'Calon penyedia yang menghadiri kegiatan pemasukan dan pembukaan dokumen penawaran sebanyak ______________ perusahaan.',
      contentW - (txt1 - marginL)
    );
    lines13.forEach((l) => { doc.text(l, txt1, y); y += lineH; });
    y += 1;

    // 1.4.
    checkPage(7);
    doc.text('1.4.', ind1, y);
    doc.text('Daftar hadir sebagaimana terlampir.', txt1, y);
    y += lineH + 4;

    // 2.
    checkPage(12);
    doc.text('2.', ind0, y);
    const lines2 = doc.splitTextToSize(
      'Pembukaan dokumen penawaran dilakukan oleh personil Bidang Pelaksanaan Pengadaan dan wakil dari Calon Penyedia yang hadir sebagaimana dimaksud pada angka 1.3.',
      contentW - 6
    );
    lines2.forEach((l) => { doc.text(l, txt0, y); y += lineH; });
    y += 4;

    // 3.
    checkPage(7);
    doc.text('3.', ind0, y);
    const lines3 = doc.splitTextToSize(
      'Hasil pembukaan dokumen penawaran sebagaimana tertuang dalam lampiran Berita Acara ini.',
      contentW - 6
    );
    lines3.forEach((l) => { doc.text(l, txt0, y); y += lineH; });
    y += 6;

  } else {
    // ════════════════════════════════════════
    // BA AANWIJZING
    // ════════════════════════════════════════

    doc.setFont('helvetica', 'normal');
    printWrapped(
      `Pada hari ini, ${data.hari || '...'}, tanggal ${data.tanggal || '...'}, pukul ${data.jam || '...'}, bertempat di ${data.lokasi || '...'}, telah dilaksanakan Rapat Aanwijzing (Pemberian Penjelasan) untuk pekerjaan:`,
      marginL, contentW
    );
    y += 2;

    const col1 = 60, col2 = 5;
    [
      ['Nama Pekerjaan',   data.nama_pekerjaan  || '-'],
      ['Nomor Pengadaan',  data.nomor_pengadaan || '-'],
      ['Metode Pengadaan', data.metode          || '-'],
    ].forEach(([label, val]) => {
      checkPage(7);
      doc.setFont('helvetica', 'normal');
      doc.text(label, marginL + 4, y);
      doc.text(':', marginL + col1, y);
      doc.splitTextToSize(val, contentW - col1 - col2 - 4).forEach((vl, vi) => {
        if (vi === 0) doc.text(vl, marginL + col1 + col2, y);
        else { y += lineH; doc.text(vl, marginL + col1 + col2, y); }
      });
      y += lineH;
    });
    y += 4;

    // Peserta
    doc.setFont('helvetica', 'bold');
    doc.text('Peserta yang hadir:', marginL, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    if (data.peserta.length === 0) {
      doc.text('-', marginL + 4, y); y += lineH;
    } else {
      data.peserta.forEach((p, i) => {
        checkPage(7);
        doc.splitTextToSize(`${i + 1}. ${p}`, contentW - 8).forEach((pl, pi) => {
          doc.text(pi === 0 ? pl : `   ${pl}`, marginL + 4, y); y += lineH;
        });
      });
    }
    y += 4;

    // Q&A
    if (data.qa.length > 0) {
      checkPage(15);
      doc.setFont('helvetica', 'bold');
      doc.text('PERTANYAAN DAN JAWABAN:', marginL, y);
      y += 8;
      data.qa.forEach((qa, i) => {
        checkPage(20);
        doc.setFont('helvetica', 'bold');
        doc.text(`${i + 1}. Pertanyaan:`, marginL + 4, y); y += lineH;
        doc.setFont('helvetica', 'normal');
        doc.splitTextToSize(qa.pertanyaan || '-', contentW - 12).forEach(l => {
          checkPage(7); doc.text(l, marginL + 12, y); y += lineH;
        });
        y += 2;
        doc.setFont('helvetica', 'bold');
        doc.text('   Jawaban:', marginL + 4, y); y += lineH;
        doc.setFont('helvetica', 'normal');
        doc.splitTextToSize(qa.jawaban || '-', contentW - 12).forEach(l => {
          checkPage(7); doc.text(l, marginL + 12, y); y += lineH;
        });
        y += 4;
      });
    }

    // Perubahan
    if (data.perubahan.length > 0) {
      checkPage(20);
      doc.setFont('helvetica', 'bold');
      doc.text('PERUBAHAN DOKUMEN:', marginL, y);
      y += 8;

      const tCols    = [8, 45, 45, 38, 38];
      const tHeaders = ['No', 'Sebelum', 'Sesudah', 'Diusulkan Oleh', 'Pertimbangan'];
      const tX       = [marginL];
      tCols.forEach((w, i) => { if (i > 0) tX.push(tX[i - 1] + tCols[i - 1]); });

      const drawRow = (cells, bold = false) => {
        const cLines = cells.map((c, ci) => doc.splitTextToSize(c, tCols[ci] - 3));
        const rh     = Math.max(...cLines.map(l => l.length)) * lineH + 4;
        checkPage(rh + 2);
        doc.setFillColor(bold ? 230 : 255, bold ? 230 : 255, bold ? 230 : 255);
        doc.rect(tX[0], y - 4, tCols.reduce((a, b) => a + b, 0), rh, bold ? 'F' : 'S');
        tX.forEach((x, i) => doc.rect(x, y - 4, tCols[i], rh, 'S'));
        cells.forEach((c, ci) => {
          doc.setFont('helvetica', bold ? 'bold' : 'normal');
          doc.splitTextToSize(c, tCols[ci] - 3).forEach((cl, li) => {
            doc.text(cl, tX[ci] + 2, y + li * lineH);
          });
        });
        y += rh;
      };
      drawRow(tHeaders, true);
      data.perubahan.forEach((p, i) => drawRow([String(i + 1), p.sebelum || '-', p.sesudah || '-', p.diusulkan || '-', p.pertimbangan || '-']));
      y += 4;
    }
  }

  // ── Penutup ──
  checkPage(15);
  doc.setFont('helvetica', 'normal');
  printWrapped('Demikian Berita Acara ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.', marginL, contentW);
  y += 10;

  // ── Tanda Tangan ──
  checkPage(55);
  const halfW  = contentW / 2;
  const ttdY   = y;
  const spaceH = 22;
  const lCx    = marginL + halfW / 2;
  const rCx    = marginL + halfW + halfW / 2;

  doc.setFont('helvetica', 'bold');
  doc.text('Mengetahui,', lCx, y, { align: 'center' });
  doc.text('Yang Membuat,', rCx, y, { align: 'center' });
  y += 8;

  // Left: Jessica
  y += spaceH;
  doc.line(marginL + 2, y, marginL + halfW - 2, y);
  doc.setFont('helvetica', 'bold');
  doc.text('Jessica Puspadayasari', lCx, y + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text('Asdep Pelaksanaan Pengadaan', lCx, y + 11, { align: 'center' });

  // Right: Pelaksana
  const ry = ttdY + 8 + spaceH;
  const rx  = marginL + halfW;
  doc.line(rx + 2, ry, rx + halfW - 2, ry);
  doc.setFont('helvetica', 'bold');
  doc.text(data.pelaksana_nama || '...', rCx, ry + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(data.pelaksana_jabatan || '', rCx, ry + 11, { align: 'center' });

  // ── Page Numbers ──
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Halaman ${i} dari ${totalPages}`, pageW / 2, pageH - 12, { align: 'center' });
  }

  // ── Savee ──
  const filename = isAan ? 'BA_Aanwijzing' : 'BA_Pembukaan_Dokumen';
  const nomor    = (data.nomor_pengadaan || 'dokumen').replace(/\//g, '-');
  doc.save(`${filename}_${nomor}.pdf`);
}
