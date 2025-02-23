const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Configuración de búsqueda
const BUSQUEDA = encodeURIComponent('deslizamiento "el troje" quito 2017');
const GOOGLE_SEARCH_URL = `https://www.google.com/search?q=${BUSQUEDA}&num=100`;

// Configuración de Axios con rotación de User Agents
const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
];

function getRandomUserAgent() {
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

const axiosConfig = {
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
    },
    timeout: 30000
};

async function buscarNoticias() {
    try {
        console.log('Buscando noticias en Google...');
        
        axiosConfig.headers['User-Agent'] = getRandomUserAgent();
        
        const response = await axios.get(GOOGLE_SEARCH_URL, axiosConfig);
        const $ = cheerio.load(response.data);
        const resultados = [];

        // Procesar resultados de Google
        $('div.g').each((_, elemento) => {
            const $elemento = $(elemento);
            const titulo = $elemento.find('h3').text().trim();
            const url = $elemento.find('a').attr('href');
            const extracto = $elemento.find('.VwiC3b').text().trim();

            if (titulo && url && url.startsWith('http')) {
                resultados.push({
                    titulo,
                    url,
                    extracto,
                    fuente: new URL(url).hostname,
                    fechaExtraccion: new Date().toISOString()
                });
            }
        });

        console.log(`Se encontraron ${resultados.length} resultados iniciales`);
        return resultados;

    } catch (error) {
        console.error('Error en la búsqueda:', error.message);
        return [];
    }
}

// Nueva función para generar CSV
function generarCSV(articulos) {
    // Función auxiliar para escapar campos CSV
    const escaparCSV = (texto) => {
        if (!texto) return '';
        // Reemplazar comillas dobles por dos comillas dobles y envolver en comillas
        return `"${texto.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
    };

    // Definir encabezados
    const encabezados = [
        'Título',
        'Fuente',
        'URL',
        'Extracto',
        'Fecha de Extracción'
    ];

    // Crear contenido CSV
    const contenidoCSV = [
        // Encabezados
        encabezados.join(','),
        // Datos
        ...articulos.map(articulo => [
            escaparCSV(articulo.titulo),
            escaparCSV(articulo.fuente),
            escaparCSV(articulo.url),
            escaparCSV(articulo.extracto),
            escaparCSV(articulo.fechaExtraccion)
        ].join(','))
    ].join('\n');

    return contenidoCSV;
}

async function scrapeDeslizamientoElTroje() {
    try {
        console.log('Iniciando búsqueda de noticias...');
        
        const resultadosIniciales = await buscarNoticias();
        
        // Filtrar resultados relevantes
        const resultadosFiltrados = resultadosIniciales.filter(articulo => {
            const contenido = (articulo.titulo + ' ' + articulo.extracto).toLowerCase();
            return contenido.includes('el troje') && 
                   contenido.includes('deslizamiento') &&
                   (contenido.includes('2017') || contenido.includes('diciembre'));
        });

        console.log(`Se encontraron ${resultadosFiltrados.length} artículos relevantes`);

        // Preparar resultado final
        const resultado = {
            fecha_busqueda: new Date().toISOString(),
            total_articulos: resultadosFiltrados.length,
            articulos: resultadosFiltrados
        };

        // Guardar resultados en JSON
        const nombreArchivoJSON = 'noticias_el_troje_automatico.json';
        fs.writeFileSync(
            nombreArchivoJSON,
            JSON.stringify(resultado, null, 2),
            'utf-8'
        );

        // Guardar resultados en CSV
        const nombreArchivoCSV = 'noticias_el_troje_automatico.csv';
        const contenidoCSV = generarCSV(resultadosFiltrados);
        fs.writeFileSync(nombreArchivoCSV, '\ufeff' + contenidoCSV, 'utf-8'); // Añadir BOM para Excel

        // Generar reporte HTML mejorado
        const reporteHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Noticias El Troje</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    max-width: 1000px; 
                    margin: 0 auto; 
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .articulo { 
                    background-color: white;
                    border: 1px solid #ddd; 
                    margin: 20px 0; 
                    padding: 20px; 
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .titulo { 
                    color: #2c5282;
                    margin-top: 0;
                }
                .fuente { 
                    color: #2b6cb0;
                    font-weight: bold;
                }
                .extracto {
                    line-height: 1.6;
                }
                .enlace {
                    display: inline-block;
                    margin-top: 10px;
                    color: #4299e1;
                    text-decoration: none;
                }
                .enlace:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <h1>Noticias sobre El Troje</h1>
            <p>Fecha de búsqueda: ${new Date().toLocaleString()}</p>
            ${resultadosFiltrados.map(articulo => `
                <div class="articulo">
                    <h2 class="titulo">${articulo.titulo}</h2>
                    <p class="fuente">Fuente: ${articulo.fuente}</p>
                    <p class="extracto">${articulo.extracto}</p>
                    <a class="enlace" href="${articulo.url}" target="_blank">Ver noticia original →</a>
                </div>
            `).join('')}
        </body>
        </html>`;

        fs.writeFileSync('reporte_noticias.html', reporteHTML, 'utf-8');

        console.log('\n==== Resumen de la Búsqueda ====');
        console.log(`Total de artículos encontrados: ${resultado.total_articulos}`);
        console.log(`Resultados guardados en:`);
        console.log(`- JSON: ${nombreArchivoJSON}`);
        console.log(`- CSV: ${nombreArchivoCSV}`);
        console.log(`- HTML: reporte_noticias.html`);

    } catch (error) {
        console.error('Error general durante el scraping:', error);
    }
}

// Ejecutar el scraper
scrapeDeslizamientoElTroje();