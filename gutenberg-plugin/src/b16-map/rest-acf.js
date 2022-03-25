const ENDPOINT = "/wp-json/wp/v2/pages/?per_page=100";
const MULTILANG = true;

class CustomFields {
  constructor() {
    this.fields = [];
    this.ready = new Promise((resolve) => {
      this.isReady = resolve;
    });
    this.fetchFields();
  }
  async fetchFields(page) {
    try {
      let url = ENDPOINT+(page ? "&page="+page : "");
      if (MULTILANG) {
        const pageId = window.location.search.split("post=")[1].split("&")[0];
        let currentPage = await fetch("/wp-json/wp/v2/pages/"+pageId);
        currentPage = await currentPage.json();
        const languageId = currentPage.language[0];
        url += "&language="+languageId;
      }
      let customFields = await fetch(url);
      const totalPages = customFields.headers.get("X-WP-TotalPages");
      customFields = await customFields.json();
      customFields = customFields
        .filter(result => {
          return result.acf.on_map === true;
        }).filter(result => {
          return Object.values(result.acf)
            .some(field => ((field !== "") && (field !== null)));
        }).map(e => {
          return {
            id: e.id,
            link: e.link,
            acf: e.acf
          };
        });
      this.fields = [...this.fields,...customFields].sort((a,b) => {
        const aOrder = (parseInt(a.acf.order));
        const bOrder = (parseInt(b.acf.order));
        if (aOrder === 0) {
          return 1;
        }          
        if (bOrder === 0) {
          return -1;
        }
        if (isNaN(aOrder) || isNaN(bOrder)) {
          return 0;
        }
        return aOrder - bOrder;
      });
      page = page || 1;
      if ((totalPages) > 1 && (totalPages > page)) {
        this.fetchFields(page+1);
      } else {
        this.isReady(true);
      }
    } catch(e) {
      /* eslint-disable no-console */
      console.error(e);
      /* eslint-enable no-console */
      throw new Error("Couln't build map...");
    }
  }
  filter(options) {
    let fields = this.filterBranches(this.fields, options.branchesShown);
    fields = this.filterInfo(fields, options.infoShown);
    return fields;
  }

  filterBranches(results, branch) {
    if (branch === "*") {
      return results;
    }
    return results.filter(result => result.id === branch);
  }

  filterInfo(results, infos) {
    if (infos === "*") {
      return results;
    }
    return results.map(result => {
      acf = {};
      infos.forEach(e => {
        acf[e] = result.acf[e];
      });
      return { id: result.id, acf };
    });
  }
}
const ACF = new CustomFields();
export default ACF;
