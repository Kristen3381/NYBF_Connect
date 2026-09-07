// Kenya 47 Counties, 290 Constituencies, and Sitting County Governors (2022-2027 term)

export interface CountyInfo {
  name: string;
  code: number;
  capital: string;
  governor: string;
  constituencies: string[];
}

export const KENYA_COUNTIES: Record<string, CountyInfo> = {
  Mombasa: {
    name: "Mombasa",
    code: 1,
    capital: "Mombasa City",
    governor: "H.E. Abdulswamad Shariff Nassir",
    constituencies: ["Changamwe", "Jomvu", "Kisauni", "Nyali", "Likoni", "Mvita"],
  },
  Kwale: {
    name: "Kwale",
    code: 2,
    capital: "Kwale",
    governor: "H.E. Fatuma Mohamed Achani",
    constituencies: ["Msambweni", "Lunga Lunga", "Matuga", "Kinango"],
  },
  Kilifi: {
    name: "Kilifi",
    code: 3,
    capital: "Kilifi",
    governor: "H.E. Gideon Mung'aro",
    constituencies: ["Kilifi North", "Kilifi South", "Kaloleni", "Rabai", "Ganze", "Malindi", "Magarini"],
  },
  "Tana River": {
    name: "Tana River",
    code: 4,
    capital: "Hola",
    governor: "H.E. Dhadho Godhana",
    constituencies: ["Garsen", "Galole", "Bura"],
  },
  Lamu: {
    name: "Lamu",
    code: 5,
    capital: "Lamu",
    governor: "H.E. Issa Timamy",
    constituencies: ["Lamu East", "Lamu West"],
  },
  "Taita/Taveta": {
    name: "Taita/Taveta",
    code: 6,
    capital: "Mwatate",
    governor: "H.E. Andrew Mwadime",
    constituencies: ["Taveta", "Wundanyi", "Mwatate", "Voi"],
  },
  Garissa: {
    name: "Garissa",
    code: 7,
    capital: "Garissa",
    governor: "H.E. Nathif Jama Adam",
    constituencies: ["Garissa Township", "Balambala", "Lagdera", "Dadaab", "Fafi", "Ijara"],
  },
  Wajir: {
    name: "Wajir",
    code: 8,
    capital: "Wajir",
    governor: "H.E. Ahmed Abdullahi",
    constituencies: ["Wajir North", "Wajir East", "Tarbaj", "Wajir West", "Eldas", "Wajir South"],
  },
  Mandera: {
    name: "Mandera",
    code: 9,
    capital: "Mandera",
    governor: "H.E. Mohamed Adan Khalif",
    constituencies: ["Mandera West", "Banissa", "Mandera North", "Mandera South", "Mandera East", "Lafey"],
  },
  Marsabit: {
    name: "Marsabit",
    code: 10,
    capital: "Marsabit",
    governor: "H.E. Mohamud Ali",
    constituencies: ["Moyale", "North Horr", "Saku", "Laisamis"],
  },
  Isiolo: {
    name: "Isiolo",
    code: 11,
    capital: "Isiolo",
    governor: "H.E. Abdi Guyo",
    constituencies: ["Isiolo North", "Isiolo South"],
  },
  Meru: {
    name: "Meru",
    code: 12,
    capital: "Meru",
    governor: "H.E. Kawira Mwangaza",
    constituencies: ["Igembe South", "Igembe Central", "Igembe North", "Tigania West", "Tigania East", "North Imenti", "Buuri", "Central Imenti", "South Imenti"],
  },
  "Tharaka-Nithi": {
    name: "Tharaka-Nithi",
    code: 13,
    capital: "Kathwana",
    governor: "H.E. Muthomi Njuki",
    constituencies: ["Maara", "Chuka/Igambang'ombe", "Tharaka"],
  },
  Embu: {
    name: "Embu",
    code: 14,
    capital: "Embu",
    governor: "H.E. Cecily Mbarire",
    constituencies: ["Manyatta", "Runyenjes", "Mbeere South", "Mbeere North"],
  },
  Kitui: {
    name: "Kitui",
    code: 15,
    capital: "Kitui",
    governor: "H.E. Julius Malombe",
    constituencies: ["Mwingi North", "Mwingi West", "Mwingi Central", "Kitui West", "Kitui Rural", "Kitui Central", "Kitui East", "Kitui South"],
  },
  Machakos: {
    name: "Machakos",
    code: 16,
    capital: "Machakos",
    governor: "H.E. Wavinya Ndeti",
    constituencies: ["Masinga", "Yatta", "Kangundo", "Matungulu", "Kathiani", "Mavoko", "Machakos Town", "Mwala"],
  },
  Makueni: {
    name: "Makueni",
    code: 17,
    capital: "Wote",
    governor: "H.E. Mutula Kilonzo Jr.",
    constituencies: ["Mbooni", "Kilome", "Kaiti", "Makueni", "Kibwezi West", "Kibwezi East"],
  },
  Nyandarua: {
    name: "Nyandarua",
    code: 18,
    capital: "Ol Kalou",
    governor: "H.E. Kiarie Badilisha",
    constituencies: ["Kinangop", "Kipipiri", "Ol Kalou", "Ol Jorok", "Ndaragwa"],
  },
  Nyeri: {
    name: "Nyeri",
    code: 19,
    capital: "Nyeri",
    governor: "H.E. Mutahi Kahiga",
    constituencies: ["Tetu", "Kieni", "Mathira", "Othaya", "Mukurweini", "Nyeri Town"],
  },
  Kirinyaga: {
    name: "Kirinyaga",
    code: 20,
    capital: "Kerugoya",
    governor: "H.E. Anne Waiguru",
    constituencies: ["Mwea", "Gichugu", "Ndia", "Kirinyaga Central"],
  },
  "Murang'a": {
    name: "Murang'a",
    code: 21,
    capital: "Murang'a",
    governor: "H.E. Irungu Kang'ata",
    constituencies: ["Kangema", "Mathioya", "Kiharu", "Kigumo", "Maragwa", "Kandara", "Gatanga"],
  },
  Kiambu: {
    name: "Kiambu",
    code: 22,
    capital: "Kiambu",
    governor: "H.E. Kimani Wamatangi",
    constituencies: ["Gatundu South", "Gatundu North", "Juja", "Thika Town", "Ruiru", "Githunguri", "Kiambu", "Kiambaa", "Kabete", "Kikuyu", "Limuru", "Lari"],
  },
  Turkana: {
    name: "Turkana",
    code: 23,
    capital: "Lodwar",
    governor: "H.E. Jeremiah Lomorukai",
    constituencies: ["Turkana North", "Turkana West", "Turkana Central", "Loima", "Turkana South", "Turkana East"],
  },
  "West Pokot": {
    name: "West Pokot",
    code: 24,
    capital: "Kapenguria",
    governor: "H.E. Simon Kachapin",
    constituencies: ["Kapenguria", "Sigor", "Kacheliba", "Pokot South"],
  },
  Samburu: {
    name: "Samburu",
    code: 25,
    capital: "Maralal",
    governor: "H.E. Lati Lelelit",
    constituencies: ["Samburu West", "Samburu North", "Samburu East"],
  },
  "Trans Nzoia": {
    name: "Trans Nzoia",
    code: 26,
    capital: "Kitale",
    governor: "H.E. George Natembeya",
    constituencies: ["Kwanza", "Endebess", "Saboti", "Kiminini", "Cherangany"],
  },
  "Uasin Gishu": {
    name: "Uasin Gishu",
    code: 27,
    capital: "Eldoret",
    governor: "H.E. Jonathan Bii",
    constituencies: ["Soy", "Turbo", "Moiben", "Ainabkoi", "Kapseret", "Kesses"],
  },
  "Elgeyo/Marakwet": {
    name: "Elgeyo/Marakwet",
    code: 28,
    capital: "Iten",
    governor: "H.E. Wisley Rotich",
    constituencies: ["Marakwet East", "Marakwet West", "Keiyo North", "Keiyo South"],
  },
  Nandi: {
    name: "Nandi",
    code: 29,
    capital: "Kapsabet",
    governor: "H.E. Stephen Sang",
    constituencies: ["Tinderet", "Aldai", "Nandi Hills", "Chesumei", "Emgwen", "Mosop"],
  },
  Baringo: {
    name: "Baringo",
    code: 30,
    capital: "Kabarnet",
    governor: "H.E. Benjamin Cheboi",
    constituencies: ["Tiaty", "Baringo North", "Baringo Central", "Baringo South", "Mogotio", "Eldama Ravine"],
  },
  Laikipia: {
    name: "Laikipia",
    code: 31,
    capital: "Rumuruti",
    governor: "H.E. Joshua Irungu",
    constituencies: ["Laikipia West", "Laikipia East", "Laikipia North"],
  },
  Nakuru: {
    name: "Nakuru",
    code: 32,
    capital: "Nakuru City",
    governor: "H.E. Susan Kihika",
    constituencies: ["Molo", "Njoro", "Naivasha", "Gilgil", "Kuresoi South", "Kuresoi North", "Subukia", "Rongai", "Bahati", "Nakuru Town West", "Nakuru Town East"],
  },
  Narok: {
    name: "Narok",
    code: 33,
    capital: "Narok",
    governor: "H.E. Patrick Ole Ntutu",
    constituencies: ["Kilgoris", "Emurua Dikirr", "Narok North", "Narok East", "Narok South", "Narok West"],
  },
  Kajiado: {
    name: "Kajiado",
    code: 34,
    capital: "Kajiado",
    governor: "H.E. Joseph Ole Lenku",
    constituencies: ["Kajiado North", "Kajiado Central", "Kajiado East", "Kajiado West", "Kajiado South"],
  },
  Kericho: {
    name: "Kericho",
    code: 35,
    capital: "Kericho",
    governor: "H.E. Eric Mutai",
    constituencies: ["Kipkelion East", "Kipkelion West", "Ainamoi", "Bureti", "Belgut", "Sigowet/Soin"],
  },
  Bomet: {
    name: "Bomet",
    code: 36,
    capital: "Bomet",
    governor: "H.E. Hillary Barchok",
    constituencies: ["Sotik", "Chepalungu", "Bomet East", "Bomet Central", "Konoin"],
  },
  Kakamega: {
    name: "Kakamega",
    code: 37,
    capital: "Kakamega",
    governor: "H.E. Fernandes Barasa",
    constituencies: ["Lugari", "Likuyani", "Malava", "Lurambi", "Navakholo", "Mumias West", "Mumias East", "Matungu", "Butere", "Khwisero", "Shinyalu", "Ikolomani"],
  },
  Vihiga: {
    name: "Vihiga",
    code: 38,
    capital: "Mbale",
    governor: "H.E. Wilber Ottichilo",
    constituencies: ["Vihiga", "Sabatia", "Hamisi", "Luanda", "Emuhaya"],
  },
  Bungoma: {
    name: "Bungoma",
    code: 39,
    capital: "Bungoma",
    governor: "H.E. Kenneth Lusaka",
    constituencies: ["Mount Elgon", "Sirisia", "Kabuchai", "Bumula", "Kanduyi", "Webuye East", "Webuye West", "Kimilili", "Tongaren"],
  },
  Busia: {
    name: "Busia",
    code: 40,
    capital: "Busia",
    governor: "H.E. Paul Otuoma",
    constituencies: ["Teso North", "Teso South", "Nambale", "Matayos", "Butula", "Funyula", "Budalangi"],
  },
  Siaya: {
    name: "Siaya",
    code: 41,
    capital: "Siaya",
    governor: "H.E. James Orengo",
    constituencies: ["Ugenya", "Ugunja", "Alego Usonga", "Gem", "Bondo", "Rarieda"],
  },
  Kisumu: {
    name: "Kisumu",
    code: 42,
    capital: "Kisumu City",
    governor: "H.E. Anyang' Nyong'o",
    constituencies: ["Kisumu East", "Kisumu West", "Kisumu Central", "Seme", "Nyando", "Muhoroni", "Nyakach"],
  },
  "Homa Bay": {
    name: "Homa Bay",
    code: 43,
    capital: "Homa Bay",
    governor: "H.E. Gladys Wanga",
    constituencies: ["Kasipul", "Kabondo Kasipul", "Karachuonyo", "Rangwe", "Homa Bay Town", "Ndhiwa", "Suba North", "Suba South"],
  },
  Migori: {
    name: "Migori",
    code: 44,
    capital: "Migori",
    governor: "H.E. Ochilo Ayacko",
    constituencies: ["Rongo", "Awendo", "Suna East", "Suna West", "Uriri", "Nyatike", "Kuria West", "Kuria East"],
  },
  Kisii: {
    name: "Kisii",
    code: 45,
    capital: "Kisii",
    governor: "H.E. Simba Arati",
    constituencies: ["Bonchari", "South Mugirango", "Bomachoge Borabu", "Bobasi", "Bomachoge Chache", "Nyaribari Masaba", "Nyaribari Chache", "Kitutu Chache North", "Kitutu Chache South"],
  },
  Nyamira: {
    name: "Nyamira",
    code: 46,
    capital: "Nyamira",
    governor: "H.E. Amos Nyaribo",
    constituencies: ["Kitutu Masaba", "West Mugirango", "North Mugirango", "Borabu"],
  },
  Nairobi: {
    name: "Nairobi",
    code: 47,
    capital: "Nairobi (Capital City)",
    governor: "H.E. Sakaja Arthur Johnson",
    constituencies: [
      "Westlands",
      "Dagoretti North",
      "Dagoretti South",
      "Lang'ata",
      "Kibra",
      "Roysambu",
      "Kasarani",
      "Ruaraka",
      "Embakasi South",
      "Embakasi North",
      "Embakasi Central",
      "Embakasi East",
      "Embakasi West",
      "Makadara",
      "Kamukunji",
      "Starehe",
      "Mathare",
    ],
  },
};

export const ALL_COUNTY_NAMES = Object.keys(KENYA_COUNTIES);

export function getConstituenciesForCounty(countyName: string): string[] {
  const normalized = countyName.trim();
  const match = KENYA_COUNTIES[normalized];
  if (match) return match.constituencies;
  // Case-insensitive lookup
  const found = Object.values(KENYA_COUNTIES).find(
    (c) => c.name.toLowerCase() === normalized.toLowerCase()
  );
  return found ? found.constituencies : [];
}

export function getGovernorForCounty(countyName: string): string {
  const normalized = countyName.trim();
  const match = KENYA_COUNTIES[normalized];
  if (match) return match.governor;
  const found = Object.values(KENYA_COUNTIES).find(
    (c) => c.name.toLowerCase() === normalized.toLowerCase()
  );
  return found ? found.governor : "Governor Information Available at County Secretariat";
}

export function getCountyInfo(countyName: string): CountyInfo | null {
  const normalized = countyName.trim();
  const match = KENYA_COUNTIES[normalized];
  if (match) return match;
  const found = Object.values(KENYA_COUNTIES).find(
    (c) => c.name.toLowerCase() === normalized.toLowerCase()
  );
  return found || null;
}

export interface CountyCidpInfo {
  county: string;
  title: string;
  cycle: string;
  summary: string;
  documentUrl: string;
  source: string;
  statutoryBasis: string;
}

export function getCidpForCounty(countyName: string): CountyCidpInfo {
  const info = getCountyInfo(countyName);
  const name = info ? info.name : countyName;
  const encodedName = encodeURIComponent(name);
  return {
    county: name,
    title: `${name} County Integrated Development Plan (CIDP III)`,
    cycle: "2023 – 2027",
    summary: `The statutory 5-year development framework for ${name} County, setting strategic multi-year public spending priorities, capital projects, and devolved youth interventions.`,
    documentUrl: `https://www.cog.go.ke/downloads/category/county-integrated-development-plans-cidp?search=${encodedName}`,
    source: "Council of Governors (COG) Statutory Repository",
    statutoryBasis: "Section 108, County Governments Act (2012)",
  };
}

