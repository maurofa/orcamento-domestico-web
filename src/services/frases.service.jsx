import axios from "axios";

const client = axios.create({ baseURL: 'http://localhost:5010/frases' });

export default function getFrase() {
  return client.get('')
    .then(response => response.data.frase);
}
