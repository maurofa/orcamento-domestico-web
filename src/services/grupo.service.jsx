import axios from 'axios';

const client = axios.create({ baseURL: "http://localhost:5000/grupos" });

export default function getGrupos() {
  return client.get('')
      .then(response => response.data.grupos);
}
