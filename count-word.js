function hitungJumlahKata(kalimat) {
    // Menghapus spasi di awal dan akhir kalimat
    kalimat = kalimat.trim();
    
    
    // Jika kalimat kosong, jumlah kata adalah 0
    if (kalimat === '') {
      return 0;
    }
    
    // Menghitung jumlah kata dengan menghitung jumlah spasi dan menambahkannya dengan 1
    const jumlahKata = kalimat.split(' ').length;
    
    return jumlahKata;
  }
  
  // Mendapatkan input dari pengguna
  const kalimat = prompt("Masukkan kalimat:");
  const jumlahKata = hitungJumlahKata(kalimat);
  console.log("Jumlah kata dalam kalimat: " + jumlahKata);