
//Crear utilidad de comprension de archivos para enviar al cliente

const brotli = require('brotli');
const fs = require('fs');
const zlib = require('zlib');

const brotliSettings = {
    extension: 'br',
    skipLarger: true,
    mode: 1, // 0 = generic, 1 = text, 2 = font (WOFF2)
    quality: 10, // 0 - 11,
    lgwin: 12 // default
};


module.exports = {

    CompressFolderFiles(sourceFolder, targetFolder) {
        console.info("");
        console.info("compress source : " + sourceFolder);
        console.info("compress target : " + targetFolder);
        console.info("");

        var dirs = [ sourceFolder ];

        dirs.forEach(dir => {
            console.info("Folder :");
            console.info(dir);

            fs.readdirSync(dir).forEach(file => {
                // console.info("Eval file :");
                // console.info(" -> :" + file);

                if (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.html')) {
                    // console.info("  file :");
                    console.info("  " + file);

                    // brotli
                    // const result = brotli.compress(fs.readFileSync(dir + '/' + file), brotliSettings);
                    // fs.writeFileSync(dir + '/' + file + '.br', result);
                    const result = brotli.compress(fs.readFileSync(dir + '/' + file), brotliSettings);
                    fs.writeFileSync(targetFolder + '/' + file + '.br', result);

                    // gzip
                    // const fileContents = fs.createReadStream(dir + '/' + file);
                    // const writeStream = fs.createWriteStream(dir + '/' + file + '.gz');
                    // const zip = zlib.createGzip();

                    const fileContents = fs.createReadStream(dir + '/' + file);
                    const writeStream = fs.createWriteStream(targetFolder + '/' + file + '.gz');
                    const zip = zlib.createGzip();

                    fileContents
                        .pipe(zip)
                        .on('error', err => console.error(err))
                        .pipe(writeStream)
                        .on('error', err => console.error(err));
                }
            })
        });

        console.info("");
        console.info("");
    }
}