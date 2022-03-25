const ENDPOINT = "https://api-adresse.data.gouv.fr/search/csv/";

const buildCSV = (addresses) => {
  const CSV = ["\"adresse\",\"code_postal\""];
  addresses.map(e => {
    e = e.acf;
    let line = "\""+e.adresse1+"\"";
    if (e.code_postal && e.code_postal !== "") {
      line += ",\""+e.code_postal+"\"";
    }
    CSV.push(line);
  });
  return new File([CSV.join("\n")], "adresses.csv", {
    type: "text/csv"
  });
};

export default async function geoCode(addresses) {
  const CSV = buildCSV(addresses);
  const data = new FormData();
  data.append("data", CSV);
  data.append("postcode","code_postal");
  try {
    let results = await fetch(ENDPOINT, {
      method: "POST",
      body: data
    });
    results = await results.text();
    results = results.split("\n");
    const indexLat = results[0].split(",").indexOf("latitude");
    const indexLong = results[0].split(",").indexOf("longitude");
    return addresses.map((e,i) => {
      e.lat = results[i+1].split(",")[indexLat];
      e.long = results[i+1].split(",")[indexLong];
      return e;
    });
  } catch {
    throw new Error("L'adresse demandée n'a pas été trouvée");
  }
}
