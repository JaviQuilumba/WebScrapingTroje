```markdown
# Scraper de Noticias sobre el Deslizamiento de El Troje en Quito (2017)

Este proyecto es un scraper que busca noticias relacionadas con el deslizamiento de tierra en "El Troje" en Quito durante el año 2017. El scraper realiza una búsqueda en Google, filtra los resultados relevantes y genera archivos en formato JSON, CSV y un reporte HTML con los resultados.

## Requisitos

- Node.js instalado en tu sistema.
- Dependencias de Node.js: `axios`, `cheerio`.

## Instalación

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git
   ```
   
```

2. Navega al directorio del proyecto:

   ```bash
   cd tu-repositorio
   ```

3. Instala las dependencias necesarias:

   ```bash
   npm install axios cheerio
   ```

## Uso

1. Una vez que hayas instalado las dependencias, puedes ejecutar el scraper con el siguiente comando:

   ```bash
   node scraper.js
   ```

2. El scraper realizará una búsqueda en Google utilizando la consulta `deslizamiento "el troje" quito 2017`, filtrará los resultados relevantes y generará tres archivos:

   - **`noticias_el_troje_automatico.json`**: Contiene los resultados en formato JSON.
   - **`noticias_el_troje_automatico.csv`**: Contiene los resultados en formato CSV.
   - **`reporte_noticias.html`**: Un reporte HTML con los resultados, diseñado para una fácil visualización.

3. Los archivos generados se guardarán en el mismo directorio donde se ejecutó el script.

## Estructura del Código

- **`axios`**: Se utiliza para realizar solicitudes HTTP a Google.
- **`cheerio`**: Se utiliza para analizar y extraer datos del HTML de la página de resultados de Google.
- **`fs`**: Se utiliza para guardar los resultados en archivos JSON, CSV y HTML.

### Configuración

- **`BUSQUEDA`**: Define la consulta de búsqueda en Google. Puedes modificarla para buscar otros términos.
- **`userAgents`**: Una lista de User Agents que se rotan para evitar bloqueos por parte de Google.
- **`axiosConfig`**: Configuración de Axios, incluyendo headers y timeout.

### Funciones Principales

- **`buscarNoticias()`**: Realiza la búsqueda en Google y extrae los resultados.
- **`generarCSV()`**: Convierte los resultados en formato CSV.
- **`scrapeDeslizamientoElTroje()`**: Orquesta todo el proceso de búsqueda, filtrado y generación de archivos.

## Ejemplo de Resultados

### JSON

```json
{
  "fecha_busqueda": "2023-10-05T12:00:00.000Z",
  "total_articulos": 10,
  "articulos": [
    {
      "titulo": "Deslizamiento en El Troje deja varios afectados",
      "url": "https://ejemplo.com/noticia",
      "extracto": "El deslizamiento ocurrió en diciembre de 2017...",
      "fuente": "ejemplo.com",
      "fechaExtraccion": "2023-10-05T12:00:00.000Z"
    }
  ]
}
```

### CSV

```csv
Título,Fuente,URL,Extracto,Fecha de Extracción
"Deslizamiento en El Troje deja varios afectados","ejemplo.com","https://ejemplo.com/noticia","El deslizamiento ocurrió en diciembre de 2017...","2023-10-05T12:00:00.000Z"
```

### HTML

El archivo `reporte_noticias.html` generará una página web con un diseño limpio y responsive, mostrando los títulos, fuentes, extractos y enlaces a las noticias.

## Consideraciones

- **Rotación de User Agents**: Para evitar bloqueos, el scraper utiliza diferentes User Agents en cada solicitud.
- **Filtrado de Resultados**: Los resultados se filtran para incluir solo aquellos que contengan las palabras clave "El Troje", "deslizamiento" y "2017" o "diciembre".
- **Formato de Archivos**: Los resultados se guardan en JSON, CSV y HTML para facilitar su uso en diferentes contextos.

## Contribuciones

Si deseas contribuir a este proyecto, siéntete libre de hacer un fork y enviar un pull request con tus mejoras.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
``` 

Este texto está listo para copiar y pegar directamente en tu archivo `README.md`. ¡Espero que sea útil!
