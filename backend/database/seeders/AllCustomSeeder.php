<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AllCustomSeeder extends Seeder
{
    public function run()
    {
        // berita_m
        DB::table('berita_m')->insert([
            [
                'title' => 'Peresmian Gedung Baru',
                'content' => 'Gedung baru RSUD telah diresmikan oleh Walikota.',
                'img' => 'gedung.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Pelatihan Dokter',
                'content' => 'RSUD mengadakan pelatihan dokter spesialis.',
                'img' => 'pelatihan.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // daftardokter_m
        DB::table('daftardokter_m')->insert([
            [
                'title' => 'Dr. Budi Santoso, Sp.A',
                'content' => 'Spesialis anak dengan pengalaman 15 tahun.',
                'img' => 'dr_budi.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Dr. Siti Aminah, Sp.OG',
                'content' => 'Dokter kandungan senior.',
                'img' => 'dr_siti.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // jadwaldokter_m
        DB::table('jadwaldokter_m')->insert([
            [
                'nama_dokter' => 'Dr. Budi Santoso',
                'spesialisasi' => 'Anak',
                'hari' => 'Senin',
                'jam_mulai' => '08:00',
                'jam_selesai' => '12:00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_dokter' => 'Dr. Siti Aminah',
                'spesialisasi' => 'Obgyn',
                'hari' => 'Selasa',
                'jam_mulai' => '09:00',
                'jam_selesai' => '13:00',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // penghargaan_m
        DB::table('penghargaan_m')->insert([
            'title' => 'Rumah Sakit Terbaik 2024',
            'content' => 'Penghargaan diberikan oleh Kementerian Kesehatan.',
            'img' => 'award.jpg',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // pengumuman_m
        DB::table('pengumuman_m')->insert([
            'title' => 'Libur Nasional',
            'content' => 'RSUD libur pada 17 Agustus.',
            'tanggal' => '2025-08-17',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // sejarah_m
        DB::table('sejarah_m')->insert([
            'title' => 'Sejarah RSUD',
            'content' => 'RSUD berdiri sejak tahun 1980 dan terus berkembang.',
            'img' => 'sejarah.jpg',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // struktur_m
        DB::table('struktur_m')->insert([
            'title' => 'Struktur Organisasi',
            'content' => 'Bagan organisasi RSUD tahun 2025.',
            'img' => 'struktur.png',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // visimisi_m
        DB::table('visimisi_m')->insert([
            'title' => 'Visi dan Misi',
            'content' => 'Visi: Menjadi RS terbaik di wilayah. Misi: Memberikan pelayanan prima.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
