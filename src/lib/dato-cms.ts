const API_URL = 'https://graphql.datocms.com/';
const API_TOKEN = process.env.DATOCMS_READ_ONLY_API_TOKEN;

async function fetchCmsApi(query: any, {variables}:any = {}) {
    const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    throw new Error('Failed to fetch API');
  }

  return json.data;
}

export async function getAllData(first:number, skip:number) {
  const data = await fetchCmsApi(`{
    allLaboratories(first: "${first}", skip: "${skip}", orderBy: _createdAt_DESC) {
      urlRepository
      projectName
      projectCover {
        url
        alt
      }
    }
    _allLaboratoriesMeta {
      count
    }
  }`);

  return { data: data.allLaboratories, meta: data._allLaboratoriesMeta };
}

