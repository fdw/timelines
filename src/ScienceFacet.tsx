import { Lanes } from './Lanes'
import { parseDate } from './timeUtil'

export function ScienceFacet(): React.ReactElement {
  return (
    <Lanes
      events={events.map(it => ({
        title: it.name,
        date: parseDate(it.date),
        url: it.url
      }))}
      people={people.map(it => ({
        name: it.short_name ?? it.name,
        birth: parseDate(it.birth),
        death: parseDate(it.death),
        url: it.url
      }))}
    />
  )
}

const people = [
  {
    'name': 'Galileo Galilei',
    'birth': '1564-02-15',
    'death': '1642-08-01',
    'url': 'https://en.wikipedia.org/wiki/Galileo_Galilei',
  },
  {
    'name': 'Isaac Newton',
    'birth': '1643-01-04',
    'death': '1727-03-31',
    'url': 'https://de.wikipedia.org/wiki/Isaac_Newton',
    'events': [
      {
        'name': 'Philosophiæ Naturalis Principia Mathematica',
        'date': '1687-07-05',
        'url': 'https://en.wikipedia.org/wiki/Philosophi%C3%A6_Naturalis_Principia_Mathematica',
      },
    ],
  },
  {
    'name': 'Albert Einstein',
    'birth': '1879-03-14',
    'death': '1955-04-18',
    'url': 'https://en.wikipedia.org/wiki/Albert_Einstein',
  },
  {
    'name': 'Nicolaus Copernicus',
    'birth': '1473-02-19',
    'death': '1543-05-24',
    'url': 'https://en.wikipedia.org/wiki/Nicolaus_Copernicus',
  },
  {
    'name': 'Niels Henrik David Bohr',
    'birth': '1885-10-07',
    'death': '1962-11-18',
    'url': 'https://en.wikipedia.org/wiki/Niels_Bohr',
    'short_name': 'Niels Bohr',
  },
  {
    'name': 'Charles Robert Darwin',
    'birth': '1809-02-12',
    'death': '1882-04-19',
    'url': 'https://en.wikipedia.org/wiki/Charles_Darwin',
    'short_name': 'Charles Darwin',
  },
  {
    'name': 'Stephen Hawking',
    'birth': '1941-01-08',
    'death': '2018-03-14',
    'url': 'https://en.wikipedia.org/wiki/Stephen_Hawking',
  },
  {
    'name': 'Claude Elwood Shannon',
    'birth': '1916-04-30',
    'death': '2001-02-24',
    'url': 'https://en.wikipedia.org/wiki/Claude_Shannon',
    'short_name': 'Claude Shannon',
  },
  {
    'name': 'Johannes Kepler',
    'birth': '1571-12-27',
    'death': '1630-11-15',
    'url': 'https://en.wikipedia.org/wiki/Johannes_Kepler',
  },
  {
    'name': 'Gottfried Wilhelm Leibniz',
    'birth': '1646-07-01',
    'death': '1716-11-14',
    'url': 'https://en.wikipedia.org/wiki/Gottfried_Wilhelm_Leibniz',
  },
  {
    'name': 'Marie Skłodowska Curie',
    'birth': '1867-11-07',
    'death': '1934-07-04',
    'url': 'https://en.wikipedia.org/wiki/Marie_Curie',
    'short_name': 'Marie Curie',
  },
  {
    'name': 'Louis Pasteur',
    'birth': '1822-12-27',
    'death': '1895-09-28',
    'url': 'https://en.wikipedia.org/wiki/Louis_Pasteur',
  },
  {
    'name': 'Gregor Johann Mendel',
    'birth': '1822-07-20',
    'death': '1884-01-06',
    'url': 'https://en.wikipedia.org/wiki/Gregor_Mendel',
  },
  {
    'name': '華岡 青洲',
    'birth': '1760-10-23',
    'death': '1835-11-21',
    'url': 'https://en.wikipedia.org/wiki/Hanaoka_Seish%C5%AB',
    'short_name': 'Hanaoka Seishū',
  },
  {
    'name': 'Sigmund Freud',
    'birth': '1856-05-06',
    'death': '1939-09-23',
    'url': 'https://en.wikipedia.org/wiki/Sigmund_Freud',
  },
  {
    'name': 'Aristotélēs',
    'birth': '-0384',
    'death': '-0322',
    'url': 'https://en.wikipedia.org/wiki/Aristotle',
  },
  {
    'name': 'Johannes Gensfleisch zur Laden zum Gutenberg',
    'birth': '1400',
    'death': '1468-02-03',
    'url': 'https://en.wikipedia.org/wiki/Johannes_Gutenberg',
    'short_name': 'Johannes Gutenberg',
    'events': [
      {
        'name': 'First movable type printing in Europe',
        'date': '1450',
      },
    ],
  },
  {
    'name': 'Bì Shēng',
    'birth': '0990',
    'death': '1051',
    'url': 'https://en.wikipedia.org/wiki/Bi_Sheng',
    'events': [
      {
        'name': 'First movable type printing in China',
        'date': '1040',
      },
    ],
  },
  {
    'name': 'Alexander Fleming',
    'birth': '1881-08-06',
    'death': '1955-03-11',
    'url': 'https://en.wikipedia.org/wiki/Alexander_Fleming',
  },
  {
    'name': 'Thomas Alva Edison',
    'birth': '1847-02-11',
    'death': '1931-10-18',
    'url': 'https://en.wikipedia.org/wiki/Thomas_Edison',
    'events': [
      {
        'name': 'Phonograph',
        'date': '1877',
        'url': 'https://en.wikipedia.org/wiki/Phonograph',
      },
      {
        'name': 'Incandescent Light Bulb',
        'date': '1879-10-22',
        'url': 'https://en.wikipedia.org/wiki/Incandescent_light_bulb',
      },
    ],
  },
  {
    'name': 'Francis Bacon',
    'birth': '1561-01-22',
    'death': '1626-04-09',
    'url': 'https://en.wikipedia.org/wiki/Francis_Bacon',
  },
  {
    'name': 'René Descartes',
    'birth': '1596-03-31',
    'death': '1650-02-11',
    'url': 'https://en.wikipedia.org/wiki/Ren%C3%A9_Descartes',
  },
  {
    'name': 'Karl Popper',
    'birth': '1902-07-28',
    'death': '1994-09-17',
    'url': 'https://en.wikipedia.org/wiki/Karl_Popper',
  },
  {
    'name': 'Nikola Tesla',
    'birth': '1856-07-10',
    'death': '1943-01-07',
    'url': 'https://en.wikipedia.org/wiki/Nikola_Tesla',
  },
  {
    'name': 'Leonhard Euler',
    'birth': '1707-04-15',
    'death': '1783-09-18',
    'url': 'https://en.wikipedia.org/wiki/Leonhard_Euler',
  },
  {
    'name': 'James Watt',
    'birth': '1736-01-19',
    'death': '1819-08-25',
    'url': 'https://en.wikipedia.org/wiki/James_Watt',
  },
  {
    'name': 'John von Neumann',
    'birth': '1903-12-28',
    'death': '1957-02-08',
    'url': 'https://en.wikipedia.org/wiki/John_von_Neumann',
  },
  {
    'name': 'Alan Mathison Turing',
    'birth': '1912-06-23',
    'death': '1954-06-07',
    'url': 'https://en.wikipedia.org/wiki/Alan_Turing',
    'short_name': 'Alan Turing',
    'events': [
      {
        'name': 'First bombe installed',
        'date': '1940-03-18',
        'url': 'https://en.wikipedia.org/wiki/Bombe',
      },
    ],
  },
  {
    'name': 'Edward Jenner',
    'birth': '1749-05-17',
    'death': '1823-01-26',
    'url': 'https://en.wikipedia.org/wiki/Edward_Jenner',
  },
  {
    'name': 'Norman Borlaug',
    'birth': '1914-03-25',
    'death': '2009-09-12',
    'url': 'https://en.wikipedia.org/wiki/Norman_Borlaug',
  },
  {
    'name': 'ابن سینا',
    'birth': '0980',
    'death': '1037-06-22',
    'url': 'https://en.wikipedia.org/wiki/Avicenna',
    'short_name': 'Avicenna',
  },
  {
    'name': 'Heinrich Hermann Robert Koch',
    'birth': '1843-12-11',
    'death': '1910-05-27',
    'url': 'https://en.wikipedia.org/wiki/Robert_Koch',
    'short_name': 'Robert Koch',
  },
  {
    'name': 'Blaise Pascal',
    'birth': '1623-06-19',
    'death': '1662-08-19',
    'url': 'https://en.wikipedia.org/wiki/Blaise_Pascal',
  },
  {
    'name': 'أبو علي، الحسن بن الحسن بن الهيثم',
    'birth': '0965',
    'death': '1040',
    'url': 'https://en.wikipedia.org/wiki/Ibn_al-Haytham',
    'short_name': 'Ḥasan Ibn al-Haytham',
  },
]

const events = [
  {
    'name': 'First peer-reviewed journal',
    'date': '1665-03-11',
    'url': 'https://en.wikipedia.org/wiki/Philosophical_Transactions_of_the_Royal_Society',
  },
  {
    'name': 'Z2',
    'date': '1940',
    'url': 'https://en.wikipedia.org/wiki/Z2_(computer)',
  },
  {
    'name': 'First message over ARPANET',
    'date': '1969-10-29',
    'url': 'https://en.wikipedia.org/wiki/History_of_the_Internet',
  },
  {
    'name': 'First heavier-than-air, powered, manned flight',
    'date': '1903-12-17',
    'url': 'https://en.wikipedia.org/wiki/History_of_aviation',
  },
  {
    'name': 'First production car',
    'date': '1886-07-03',
    'url': 'https://en.wikipedia.org/wiki/Benz_Patent-Motorwagen',
  },
  {
    'name': 'First commercial, public film screening',
    'date': '1895-12-28',
    'url': 'https://en.wikipedia.org/wiki/Cinematograph',
  },
  {
    'name': 'Estimated completion of Stonehenge',
    'date': '-2000',
    'url': 'https://en.wikipedia.org/wiki/Stonehenge',
  },
  {
    'name': 'Establishment of the first University',
    'date': '0859',
    'url': 'https://en.wikipedia.org/wiki/University_of_Al_Quaraouiyine',
  },
  {
    'name': 'Birth of the first in vitro fertilized baby',
    'date': '1978-07-25',
    'url': 'https://en.wikipedia.org/wiki/Louise_Brown',
  },
  {
    'name': 'First commerical audio CD',
    'date': '1982-08-17',
    'url': 'https://en.wikipedia.org/wiki/Compact_disc',
  },
  {
    'name': 'Opening of the Suez Canal',
    'date': '1869-11-17',
    'url': 'https://en.wikipedia.org/wiki/Suez_Canal',
  },
  {
    'name': 'First steam-powered railway journey',
    'date': '1804-02-21',
    'url': 'https://en.wikipedia.org/wiki/Rail_transport',
  },
  {
    'name': 'Invention of the Point-Contact Transistor',
    'date': '1947-12-23',
    'url': 'https://en.wikipedia.org/wiki/Transistor',
  },
  {
    'name': 'Opening of the Panama Canal',
    'date': '1914-08-15',
    'url': 'https://en.wikipedia.org/wiki/Panama_Canal',
  },
  {
    'name': 'First Telephone Transmission',
    'date': '1876-03-10',
    'url': 'https://en.wikipedia.org/wiki/Telephone',
  },
  {
    'name': 'Adoption of the Euclidean Alphabet',
    'date': '-0402',
    'url': 'https://en.wikipedia.org/wiki/History_of_the_Greek_alphabet',
  },
  {
    'name': 'The musket appears in Europe',
    'date': '1521',
    'url': 'https://en.wikipedia.org/wiki/Musket',
  },
  {
    'name': 'Announcement of Daguerreotype',
    'date': '1839-01-07',
    'url': 'https://en.wikipedia.org/wiki/History_of_photography',
  },
  {
    'name': 'Issue of the Autochrome Lumière Patent',
    'date': '1903-12-07',
    'url': 'https://en.wikipedia.org/wiki/Autochrome_Lumi%C3%A8re',
  },
  {
    'name': 'Announcement of Kodachrome',
    'date': '1935-04-15',
    'url': 'https://en.wikipedia.org/wiki/Kodachrome',
  },
]
