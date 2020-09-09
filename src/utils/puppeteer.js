const puppeteer = require('puppeteer');
const download = require('image-downloader')
const path = require('path')
const fs = require('fs')
const JSZip = require('jszip');

getImageSource = async (uri) => {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(uri, {timeout: 180000})
    const thumbnailsSource = await page.evaluate(() => {
      let $img_container = document.querySelectorAll('div.xem_anhtruyen-0 img')
      $img_container = [...$img_container]
      let imgSource = $img_container.map(item => item.getAttribute('src'))
      return imgSource
    })
    await browser.close()
    return thumbnailsSource
  } catch (e) {
    throw new Error
  }
}

downloadImageSource = async (uri) => {
  try {
    const urls = await getImageSource(uri)
    const folderPath = path.join(__dirname, '../../img-container')
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath)
    await Promise.all(urls.map(imgUrl => download.image({
      url: imgUrl,
      dest: folderPath
    })));
  } catch (e) {
    throw new Error('Cannot generate your link...<li>Invalid URL</li><li>Timeout: check your connection</li>')
  }
}

zipFiles = async () => {
  var zip = new JSZip();
  const folderPath = path.join(__dirname, '../../img-container')
  const fileNames = fs.readdirSync(folderPath)
  fileNames.forEach(file => {
    let buffer = fs.readFileSync(path.join(folderPath, `${file}`))
    zip.file(`${file}`,buffer);
  })
  zip
    .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    .pipe(fs.createWriteStream('out.zip'))
}

module.exports = {
  downloadImageSource,
  zipFiles
}