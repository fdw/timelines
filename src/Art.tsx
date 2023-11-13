import {Lanes} from "./Lanes.tsx";
import {DateTime} from "luxon";

export function ArtFacet(): React.ReactElement {
    return <Lanes people={[{
        "name": "Leonardo da Vinci",
        "birth": "1452-04-15",
        "death": "1519-05-02",
        "url": "https://en.wikipedia.org/wiki/Leonardo_da_Vinci"
    },
        {
            "name": "Michelangelo di Lodovico Buonarroti Simoni",
            "birth": "1475-03-06",
            "death": "1564-02-18",
            "url": "https://en.wikipedia.org/wiki/Michelangelo",
            "short_name": "Michelangelo"
        },
        {
            "name": "Raffaello Sanzio da Urbino",
            "birth": "1483-04-01",
            "death": "1520-04-06",
            "url": "https://en.wikipedia.org/wiki/Raphael",
            "short_name": "Raphael"
        },
        {
            "name": "Tiziano Vecelli",
            "birth": "1488",
            "death": "1576-08-27",
            "url": "https://en.wikipedia.org/wiki/Titian",
            "short_name": "Titian"
        },
        {
            "name": "Vincent van Gogh",
            "birth": "1853-03-30",
            "death": "1890-07-29",
            "url": "https://en.wikipedia.org/wiki/Vincent_van_Gogh"
        },
        {
            "name": "Johannes Vermeer",
            "birth": "1632-10-01",
            "death": "1675-12-15",
            "url": "https://en.wikipedia.org/wiki/Johannes_Vermeer"
        },
        {
            "name": "Jan van Eyck",
            "birth": "1390",
            "death": "1441-07-09",
            "url": "https://en.wikipedia.org/wiki/Jan_van_Eyck"
        },
        {
            "name": "Rembrandt Harmenszoon van Rijn",
            "birth": "1606-07-15",
            "death": "1669-10-04",
            "url": "https://en.wikipedia.org/wiki/Rembrandt",
            "short_name": "Rembrandt"
        },
        {
            "name": "Francisco Goya",
            "birth": "1746-03-30",
            "death": "1828-04-16",
            "url": "https://en.wikipedia.org/wiki/Francisco_Goya"
        },
        {
            "name": "Alessandro di Mariano di Vanni Filipepi",
            "birth": "1445",
            "death": "1510-05-17",
            "url": "https://en.wikipedia.org/wiki/Sandro_Botticelli",
            "short_name": "Sandro Botticelli"
        },
        {
            "name": "Diego Rodríguez de Silva y Velázquez",
            "birth": "1599-06-06",
            "death": "1660-08-06",
            "url": "https://en.wikipedia.org/wiki/Diego_Vel%C3%A1zquez",
            "short_name": "Diego Velázquez"
        },
        {
            "name": "Joseph Mallord William Turner",
            "birth": "1775-04-23",
            "death": "1851-12-19",
            "url": "https://en.wikipedia.org/wiki/J._M._W._Turner",
            "short_name": "J.M.W. Turner"
        },
        {
            "name": "Paul Cézanne",
            "birth": "1839-01-19",
            "death": "1906-10-22",
            "url": "https://en.wikipedia.org/wiki/Paul_C%C3%A9zanne"
        },
        {
            "name": "Claude Monet",
            "birth": "1840-11-14",
            "death": "1926-12-05",
            "url": "https://en.wikipedia.org/wiki/Claude_Monet"
        },
        {
            "name": "Michelangelo Merisi da Caravaggio",
            "birth": "1571-09-28",
            "death": "1610-07-18",
            "url": "https://en.wikipedia.org/wiki/Caravaggio",
            "short_name": "Caravaggio"
        },
        {
            "name": "Rogier van der Weyden",
            "birth": "1399",
            "death": "1464-06-18",
            "url": "https://en.wikipedia.org/wiki/Rogier_van_der_Weyden"
        },
        {
            "name": "Piero della Francesca",
            "birth": "1415",
            "death": "1492-10-12",
            "url": "https://en.wikipedia.org/wiki/Piero_della_Francesca"
        },
        {
            "name": "Pieter Bruegel the Elder",
            "birth": "1525",
            "death": "1569-09-09",
            "url": "https://en.wikipedia.org/wiki/Pieter_Bruegel_the_Elder"
        },
        {
            "name": "Édouard Manet",
            "birth": "1832-01-23",
            "death": "1883-04-30",
            "url": "https://en.wikipedia.org/wiki/%C3%89douard_Manet"
        },
        {
            "name": "Georges-Pierre Seurat",
            "birth": "1859-12-02",
            "death": "1891-03-29",
            "url": "https://en.wikipedia.org/wiki/Georges_Seurat",
            "short_name": "Seurat"
        },
        {
            "name": "Henri Émile Benoît Matisse",
            "birth": "1869-12-31",
            "death": "1954-11-03",
            "url": "https://en.wikipedia.org/wiki/Henri_Matisse",
            "short_name": "Henri Matisse"
        },
        {
            "name": "Pieter Cornelis Mondriaan",
            "birth": "1872-03-07",
            "death": "1944-02-01",
            "url": "https://en.wikipedia.org/wiki/Piet_Mondrian",
            "short_name": "Piet Mondrian"
        },
        {
            "name": "Georgia Totto O'Keeffe",
            "birth": "1887-11-15",
            "death": "1986-03-06",
            "url": "https://en.wikipedia.org/wiki/Georgia_O'Keeffe",
            "short_name": "Georgia O'Keeffe"
        },
        {
            "name": "Paul Jackson Pollock",
            "birth": "1912-01-28",
            "death": "1956-08-11",
            "url": "https://en.wikipedia.org/wiki/Jackson_Pollock",
            "short_name": "Jackson Pollock"
        },
        {
            "name": "Andy Warhol",
            "birth": "1928-08-06",
            "death": "1987-02-22",
            "url": "https://en.wikipedia.org/wiki/Andy_Warhol"
        },
        {
            "name": "Artemisia Gentileschi",
            "birth": "1593-07-08",
            "death": "1656",
            "url": "https://en.wikipedia.org/wiki/Artemisia_Gentileschi"
        },
        {
            "name": "Peter Paul Rubens",
            "birth": "1577-06-28",
            "death": "1640-05-30",
            "url": "https://en.wikipedia.org/wiki/Peter_Paul_Rubens"
        },
        {
            "name": "Alfons Maria Mucha",
            "birth": "1860-07-24",
            "death": "1939-07-04",
            "short_name": "Alphonse Mucha",
            "url": "https://en.wikipedia.org/wiki/Alphonse_Mucha"
        },
        {
            "name": "Gustav Klimt",
            "birth": "1862-07-14",
            "death": "1918-02-06",
            "url": "https://en.wikipedia.org/wiki/Gustav_Klimt"
        },
        {
            "name": "Василий Васильевич Кандинский",
            "birth": "1866-12-16",
            "death": "1944-12-13",
            "url": "https://en.wikipedia.org/wiki/Wassily_Kandinsky",
            "short_name": "Vasiliy Kandinskiy"
        },
        {
            "name": "Jean-Antoine Watteau",
            "birth": "1684-10-10",
            "death": "1721-07-18",
            "url": "https://en.wikipedia.org/wiki/Antoine_Watteau"
        }].map(it => ({name: it.name, birth: DateTime.fromISO(it.birth), death: DateTime.fromISO(it.death)}))}/>
}
