import grupos from '../assets/grupos.json';

export default function Grupos() {
  return grupos;
}

export function subgrupos() {
  return Grupos().flatMap(grupo => grupo.subgrupos);
}

export function getSubgrupo(idSubgrupo) {
  return subgrupos().find(sub => sub.id === idSubgrupo);
}
