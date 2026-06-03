const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')

require('dotenv').config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

module.exports = prisma

const diseases = [
  {
    language: 'en',
    name: 'Bacterial Spot',
    slug: 'tomato-bacterial-spot',
    scientificName: 'Xanthomonas vesicatoria',
    cropType: 'tomato',
    severity: 'Medium',
    description: 'Bacterial spot is a highly destructive disease affecting tomato and pepper production worldwide. It causes dark brown to black lesions on all above-ground plant tissues, including leaves, stems, and fruits.',
    symptoms: [
      'Small, water-soaked or greasy-looking spots initially appearing on the underside of the leaves.',
      'Spots develop a light brown center with a dark margin, sometimes surrounded by a yellow halo.',
      "Enlarging spots become sunken on the upper leaf surface, darken, and the centers may crack or fall out.",
      "Coalescing leaf spots lead to general yellowing, necrosis, and eventual premature defoliation.",
      "On fruits, small brown to black spots appear, which later enlarge, become slightly raised, and develop a rough, scabby surface.",
      "Dark, elongated streaks or lesions can also form on stems and pedicels."
    ],
    rootCauses: "Infection by the bacterial spot species complex, which includes four distinct species: Xanthomonas euvesicatoria, Xanthomonas vesicatoria, Xanthomonas perforans, and Xanthomonas gardneri.",
    treatment: [
      "Application of copper-based agrochemicals (although commercial efficacy is currently limited due to widespread copper tolerance and resistance in pathogen populations)."
    ],
    preventiveMeasures: [
      "Implementing a combination of good cultural management tactics.",
      "Utilizing elite tomato cultivars bred with genetic resistance to the disease.",
      "Planting certified, pathogen-free seeds and transplants.",
      "Practicing crop rotation and maintaining field sanitation to minimize water-splashed bacterial spread."
    ],
    imageUrl: "https://d3qz1qhhp9wxfa.cloudfront.net/growingproduce/wp-content/uploads/2023/06/bacterial-spot_tomatoes_featured.jpg"
  },
  {
    language: 'en',
    name: "Early Blight",
    slug: "tomato-early-blight",
    scientificName: "Alternaria solani, Alternaria tomatophila",
    cropType: "tomato",
    severity: "Medium",
    description: "Early blight is a very common and destructive fungal disease that affects tomato plants. It attacks the foliage, stems, and fruits. Infections typically begin on the older, lower leaves closest to the ground and gradually progress up the plant.",
    symptoms: [
      "Small dark spots initially appear on older foliage near the ground.",
      "Spots enlarge into circular lesions (up to 0.5 inches in diameter), turning brown and developing characteristic concentric rings that resemble a target or bulls-eye.",
      "Leaf tissue surrounding the spots often turns yellow (forming a yellow halo).",
      "Severely infected leaves turn brown, dry up, die, and eventually fall off (premature defoliation).",
      "On seedling stems, infections near the soil line cause dark, sunken, and dry lesions (collar rot) that can cause the seedling to wilt and die.",
      "On fruits, dark, leathery, and slightly sunken spots with concentric rings develop. These typically occur near the stem end of the fruit and can cause premature dropping."
    ],
    rootCauses: "Infection by the fungal pathogens Alternaria solani and Alternaria tomatophila. The fungal spores overwinter in the soil on infected plant debris, on seeds, or on weed hosts. The disease is easily spread by splashing water (rain or overhead watering) and thrives in warm temperatures with high humidity or heavy dew.",
    treatment: [
      "Prune or remove the lower leaves that first show symptoms (do not remove more than one-third of the plant's total foliage) to slow the spread and improve air circulation.",
      "Apply fungicides labeled for vegetables, such as those containing copper or chlorothalonil. Fungicides are most effective when applied as early as possible after the first symptoms appear or as a regular preventative measure."
    ],
    preventiveMeasures: [
      "Plant tomato varieties that are resistant or tolerant to early blight.",
      "Practice crop rotation by avoiding planting members of the Solanaceae family (tomatoes, potatoes, eggplants, peppers) in the same location for at least 2 consecutive years.",
      "Apply mulch (plastic or organic materials) over the soil under the plants to create a barrier, preventing soil-borne spores from splashing onto the leaves during rain.",
      "Water plants directly at the base (preferably using drip irrigation or soaker hoses) to keep the foliage dry.",
      "Provide adequate spacing between plants and use supports (staking or trellising) to ensure good air circulation.",
      "Clean up, burn, or dispose of all infected plant debris far from the garden at the end of the harvest season to prevent the fungus from overwintering in the soil."
    ],
    imageUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS58CsxjIIk7g7viD_r2-znyA6XmLdBSutkqFm953ihDb_ypJvUq0T3yg8LX6An"
  },
  {
    language: 'en',
    name: "Late Blight",
    slug: "tomato-late-blight",
    scientificName: "Phytophthora infestans",
    cropType: "tomato",
    severity: "High",
    description: "Late blight is a devastating plant disease that affects tomatoes and potatoes. Caused by a water mold (oomycete), it is famous for causing the Irish Potato Famine in the 1840s. It spreads rapidly through the air and can wipe out healthy plants almost overnight when the weather is cool and wet.",
    symptoms: [
      "Large, irregular, water-soaked, pale green to dark brown lesions appear on leaves, often starting near the edges or tips.",
      "During high humidity or wet weather, a fuzzy, white fungal-like growth (spores) appears on the underside of the infected leaves.",
      "Dark brown to black irregular, spreading lesions develop on the stems and petioles, which can cause the plant to collapse.",
      "On tomato fruits, firm, large, irregular, greasy-looking, olive-brown to dark brown spots appear.",
      "Unlike some other fruit rots, the late blight lesions on fruit remain firm rather than becoming soft and mushy (unless secondary pathogens invade).",
      "Entire plants can turn completely brown, shrivel, and die within a few days of the first symptoms."
    ],
    rootCauses: "Infection by the oomycete (water mold) pathogen Phytophthora infestans. The pathogen produces sporangia (spores) that can travel miles on the wind, especially during cloudy, stormy weather. It thrives in cool (60-70°F / 15-21°C) and highly moist or wet conditions. It cannot survive in dead plant tissue; it requires living host tissue (like infected potato tubers left in the soil or volunteer plants) to overwinter.",
    treatment: [
      "Once a plant is severely infected, there is no cure; infected plants should be immediately pulled up, bagged, and disposed of in the trash (do not compost) to prevent the spread to nearby plants and farms.",
      "Fungicides (such as those containing chlorothalonil or copper) can be applied, but they act strictly as a protectant and must be applied before the disease takes hold or at the very first sign of infection."
    ],
    preventiveMeasures: [
      "Plant late blight-resistant tomato varieties if the disease is common in your area.",
      "Monitor weather reports and local agricultural extension alerts for late blight outbreaks in your region.",
      "Destroy any volunteer tomato or potato plants from the previous season, as these can harbor the overwintering pathogen.",
      "Ensure excellent air circulation by spacing plants appropriately, staking, and pruning to allow leaves to dry quickly.",
      "Water at the base of the plant using drip irrigation or soaker hoses to keep the foliage completely dry.",
      "Apply preventative fungicides during periods of cool, wet weather, especially if the disease has been reported nearby."
    ],
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK8fHCxum_s_UXidLY7D2AlyDTNbZiWn_3lKi3vkIsU31ud-clnGEDPzxhnerZ"
  },
  {
    language: 'en',
    name: 'Healthy',
    slug: 'tomato-healthy',
    scientificName: 'Solanum lycopersicum',
    cropType: 'tomato',
    severity: 'Low',
    description: 'The tomato plant is healthy. There are no visible signs of fungal, bacterial, or viral diseases on the leaves.',
    symptoms: [
      'Leaves are vibrant green and uniform in color.',
      'No spots, lesions, or unusual yellowing (chlorosis).',
      'Plant stems and foliage are structurally intact and growing vigorously.'
    ],
    rootCauses: 'Optimal growing conditions, good soil health, and absence of pathogens.',
    treatment: [
      'No treatment required. Maintain current care routine.'
    ],
    preventiveMeasures: [
      'Continue providing adequate water, sunlight, and nutrients.',
      'Maintain good air circulation around the plants.',
      'Routinely inspect for pests or early signs of disease.'
    ],
    imageUrl: 'https://thumbs.dreamstime.com/b/close-up-tomato-leaf-view-beautiful-young-green-tomatoes-plants-pots-concept-organic-food-farmer-s-vegetabes-health-245109677.jpg'
  },
  {
    language: 'id',
    name: 'Bacterial Spot (Bercak Bakteri)',
    slug: 'tomato-bacterial-spot',
    scientificName: 'Xanthomonas vesicatoria',
    cropType: 'tomat',
    severity: 'Medium',
    description: 'Bercak bakteri adalah penyakit yang sangat merusak yang memengaruhi produksi tomat dan paprika di seluruh dunia. Penyakit ini menyebabkan lesi berwarna coklat tua hingga hitam pada semua jaringan tanaman di atas tanah, termasuk daun, batang, dan buah.',
    symptoms: [
      'Bintik-bintik kecil, tampak basah atau berminyak awalnya muncul di bagian bawah daun.',
      'Bintik-bintik berkembang menjadi bagian tengah berwarna coklat muda dengan tepi gelap, terkadang dikelilingi oleh lingkaran cahaya kuning.',
      'Bintik-bintik yang membesar menjadi cekung di permukaan atas daun, menggelap, dan bagian tengahnya dapat retak atau rontok.',
      'Bintik-bintik daun yang menyatu menyebabkan menguning secara umum, nekrosis, dan akhirnya kerontokan daun prematur.',
      'Pada buah, muncul bintik-bintik kecil berwarna coklat hingga hitam, yang kemudian membesar, menjadi sedikit menonjol, dan mengembangkan permukaan yang kasar atau berkeropeng.',
      'Guratan atau lesi yang gelap dan memanjang juga dapat terbentuk pada batang dan tangkai bunga.'
    ],
    rootCauses: 'Infeksi oleh kompleks spesies bercak bakteri, yang mencakup empat spesies berbeda: Xanthomonas euvesicatoria, Xanthomonas vesicatoria, Xanthomonas perforans, dan Xanthomonas gardneri.',
    treatment: [
      'Aplikasi bahan kimia pertanian berbasis tembaga (meskipun kemanjuran komersial saat ini terbatas karena toleransi dan resistensi tembaga yang tersebar luas dalam populasi patogen).'
    ],
    preventiveMeasures: [
      'Menerapkan kombinasi taktik manajemen budidaya yang baik.',
      'Menggunakan kultivar tomat unggul yang dibiakkan dengan ketahanan genetik terhadap penyakit ini.',
      'Menanam benih dan bibit bersertifikat yang bebas patogen.',
      'Mempraktikkan rotasi tanaman dan menjaga sanitasi ladang untuk meminimalkan penyebaran bakteri akibat percikan air.'
    ],
    imageUrl: 'https://d3qz1qhhp9wxfa.cloudfront.net/growingproduce/wp-content/uploads/2023/06/bacterial-spot_tomatoes_featured.jpg'
  },
  {
    language: 'id',
    name: 'Early Blight (Hawar Awal)',
    slug: 'tomato-early-blight',
    scientificName: 'Alternaria solani, Alternaria tomatophila',
    cropType: 'tomat',
    severity: 'Medium',
    description: 'Hawar awal adalah penyakit jamur yang sangat umum dan merusak yang menyerang tanaman tomat. Penyakit ini menyerang dedaunan, batang, dan buah. Infeksi biasanya dimulai pada daun yang lebih tua dan lebih rendah di dekat tanah lalu secara bertahap menyebar ke atas tanaman.',
    symptoms: [
      'Bintik-bintik gelap kecil awalnya muncul pada daun tua di dekat tanah.',
      'Bintik-bintik membesar menjadi lesi melingkar (berdiameter hingga 1-1,5 cm), berubah warna menjadi coklat dan membentuk cincin konsentris khas yang menyerupai papan target atau mata sapi.',
      'Jaringan daun di sekitar bintik-bintik sering berubah menjadi kuning (membentuk lingkaran cahaya kuning).',
      'Daun yang terinfeksi parah berubah warna menjadi coklat, mengering, mati, dan akhirnya rontok (pengguguran daun prematur).',
      'Pada batang bibit, infeksi di dekat pangkal tanah menyebabkan lesi berwarna gelap, cekung, dan kering (busuk leher/collar rot) yang dapat menyebabkan bibit layu dan mati.',
      'Pada buah, muncul bintik-bintik gelap, kasar, dan sedikit cekung dengan pola cincin konsentris. Ini biasanya terjadi di dekat pangkal batang buah dan dapat menyebabkan kerontokan prematur.'
    ],
    rootCauses: 'Infeksi oleh patogen jamur Alternaria solani dan Alternaria tomatophila. Spora jamur bertahan melewati musim dingin di dalam tanah pada sisa-sisa tanaman yang terinfeksi, pada benih, atau pada gulma inang. Penyakit ini mudah menyebar melalui percikan air (hujan atau penyiraman dari atas) dan tumbuh subur pada suhu hangat dengan kelembapan tinggi atau embun yang lebat.',
    treatment: [
      'Pangkas atau buang daun bagian bawah yang pertama kali menunjukkan gejala (jangan membuang lebih dari sepertiga total dedaunan tanaman) untuk memperlambat penyebaran dan meningkatkan sirkulasi udara.',
      'Gunakan fungisida khusus sayuran, seperti yang mengandung tembaga atau klorotalonil. Fungisida paling efektif jika diterapkan sedini mungkin setelah gejala pertama muncul atau sebagai tindakan pencegahan rutin.'
    ],
    preventiveMeasures: [
      'Tanam varietas tomat yang resisten atau toleran terhadap hawar awal.',
      'Praktikkan rotasi tanaman dengan menghindari penanaman anggota keluarga Solanaceae (tomat, kentang, terong, paprika) di lokasi yang sama selama setidaknya 2 tahun berturut-turut.',
      'Pasang mulsa (plastik atau bahan organik) di atas permukaan tanah di bawah tanaman untuk menciptakan penghalang yang mencegah spora dari tanah memercik ke daun saat hujan.',
      'Siram tanaman langsung di pangkalnya (sebaiknya gunakan irigasi tetes atau selang rembes) agar dedaunan tetap kering.',
      'Berikan jarak yang cukup antar tanaman dan gunakan penyangga (ajir atau teralis) untuk memastikan sirkulasi udara yang baik.',
      'Bersihkan, bakar, atau buang semua sisa tanaman yang terinfeksi jauh dari kebun pada akhir musim panen untuk mencegah jamur bertahan di dalam tanah.'
    ],
    imageUrl: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS58CsxjIIk7g7viD_r2-znyA6XmLdBSutkqFm953ihDb_ypJvUq0T3yg8LX6An'
  },
  {
    language: 'id',
    name: 'Late Blight (Hawar Daun)',
    slug: 'tomato-late-blight',
    scientificName: 'Phytophthora infestans',
    cropType: 'tomat',
    severity: 'High',
    description: 'Hawar daun adalah penyakit tanaman yang sangat merusak dan memengaruhi tomat serta kentang. Disebabkan oleh jamur air (oomycete), penyakit ini terkenal karena menyebabkan Bencana Kelaparan Kentang Irlandia (Irish Potato Famine) pada tahun 1840-an. Penyakit ini menyebar dengan cepat melalui udara dan dapat memusnahkan tanaman sehat hampir dalam semalam saat cuaca dingin dan basah.',
    symptoms: [
      'Lesi besar, tidak teratur, tampak basah, berwarna hijau pucat hingga coklat tua muncul pada daun, sering dimulai di dekat tepi atau ujung daun.',
      'Selama kelembapan tinggi atau cuaca basah, pertumbuhan lapisan putih berbulu mirip jamur (spora) muncul di bagian bawah daun yang terinfeksi.',
      'Lesi yang tidak teratur, menyebar, dan berwarna coklat tua hingga hitam berkembang pada batang dan tangkai daun, yang dapat menyebabkan tanaman layu dan roboh.',
      'Pada buah tomat, muncul bintik-bintik padat, besar, tidak teratur, tampak berminyak, berwarna coklat zaitun hingga coklat tua.',
      'Tidak seperti beberapa penyakit busuk buah lainnya, lesi hawar daun pada buah tetap terasa keras dan tidak menjadi lunak atau lembek (kecuali jika diserang patogen sekunder).',
      'Seluruh tanaman dapat berubah warna menjadi coklat sepenuhnya, mengerut, dan mati dalam beberapa hari setelah gejala pertama muncul.'
    ],
    rootCauses: 'Infeksi oleh patogen oomycete (jamur air) Phytophthora infestans. Patogen menghasilkan sporangia (spora) yang dapat terbawa angin hingga bermil-mil jauhnya, terutama saat cuaca mendung dan berbadai. Patogen ini tumbuh subur dalam kondisi sejuk (15-21°C) dan kondisi yang sangat lembap atau basah. Jamur ini tidak dapat bertahan hidup pada jaringan tanaman yang mati; ia membutuhkan jaringan inang yang hidup (seperti sisa umbi kentang di tanah atau tanaman liar) untuk bertahan hidup.',
    treatment: [
      'Begitu tanaman terinfeksi parah, tidak ada obatnya; tanaman yang terinfeksi harus segera dicabut, dimasukkan ke dalam kantong, dan dibuang ke tempat sampah (jangan dikomposkan) untuk mencegah penyebaran ke tanaman dan lahan lain di sekitarnya.',
      'Fungisida (seperti yang mengandung klorotalonil atau tembaga) dapat diterapkan, tetapi fungsinya benar-benar sebagai pelindung dan harus diterapkan sebelum penyakit menyebar atau pada saat gejala pertama kali muncul.'
    ],
    preventiveMeasures: [
      'Tanam varietas tomat yang tahan terhadap hawar daun jika penyakit ini umum terjadi di daerah Anda.',
      'Pantau laporan cuaca dan peringatan dari dinas pertanian setempat terkait wabah hawar daun di wilayah Anda.',
      'Musnahkan sisa tanaman tomat atau kentang liar dari musim sebelumnya, karena mereka dapat menjadi sarang patogen yang bertahan hidup.',
      'Pastikan sirkulasi udara yang sangat baik dengan memberi jarak antar tanaman yang tepat, memasang ajir penyangga, dan memangkas tanaman agar daun cepat mengering.',
      'Siram pada pangkal tanaman menggunakan irigasi tetes atau selang rembes agar daun tetap benar-benar kering.',
      'Gunakan fungisida pencegah selama periode cuaca dingin dan basah, terutama jika penyakit tersebut telah dilaporkan terjadi di sekitar wilayah Anda.'
    ],
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK8fHCxum_s_UXidLY7D2AlyDTNbZiWn_3lKi3vkIsU31ud-clnGEDPzxhnerZ'
  },
  {
    language: 'id',
    name: 'Sehat',
    slug: 'tomato-healthy',
    scientificName: 'Solanum lycopersicum',
    cropType: 'tomat',
    severity: 'Low',
    description: 'Tanaman tomat dalam keadaan sehat. Tidak ada tanda-tanda penyakit jamur, bakteri, atau virus yang terlihat pada daun.',
    symptoms: [
      'Daun berwarna hijau cerah dan warnanya merata.',
      'Tidak ada bintik-bintik, lesi, atau menguning yang tidak wajar (klorosis).',
      'Batang dan dedaunan tanaman secara struktural utuh dan tumbuh dengan kuat.'
    ],
    rootCauses: 'Kondisi pertumbuhan yang optimal, kesehatan tanah yang baik, dan tidak adanya patogen penyakit.',
    treatment: [
      'Tidak diperlukan perawatan atau pengobatan khusus. Pertahankan rutinitas perawatan saat ini.'
    ],
    preventiveMeasures: [
      'Terus sediakan air, sinar matahari, dan nutrisi pupuk yang cukup.',
      'Jaga sirkulasi udara yang baik di sekitar tanaman.',
      'Lakukan inspeksi rutin terhadap kemungkinan adanya hama atau tanda-tanda awal penyakit.'
    ],
    imageUrl: 'https://thumbs.dreamstime.com/b/close-up-tomato-leaf-view-beautiful-young-green-tomatoes-plants-pots-concept-organic-food-farmer-s-vegetabes-health-245109677.jpg'
  }
]
async function main() {
  console.log('Memulai proses seeding\n')

  const deleted = await prisma.disease.deleteMany()
  console.log(`🗑️  ${deleted.count} data lama dihapus\n`)

  let created = 0

  for (const disease of diseases) {
    await prisma.disease.create({ data: disease })
    console.log(`✅ Berhasil: ${disease.name}`)
    created++
  }

  console.log(`✅ Selesai! ${created} data baru dibuat.`)
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })