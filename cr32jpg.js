// npm i extractd
// npm i utimes

const extractd = require('extractd');
const fs = require('fs');
const utimes = require('utimes');

async function cr3ToJpg(imgPath) {
    fs.readdir(imgPath, function(err, files) {
        if (err) {
          console.log('Error', err);
        } else {
            files = files.filter(elem => !elem.includes("xmp"));
            
        }
    });
    const files = fs.readdirSync(imgPath);

    await extractd.generate(files.map(elem => imgPath + elem), { destination: './output/' });
}

async function modifyFileTime(imgPath) {
    fs.readdir(imgPath, function(err, files) {
        if (err) {
          console.log('Error', err);
        } else {
            files = files.filter(elem => !elem.includes("xmp"));
            let srcFiles = files.map(elem => imgPath + elem);
            srcFiles.forEach(file => {
                const stat = fs.statSync(file);
                let dstFile = file.replace("input", "output").replace("CR3", "jpg");
                utimes.utimesSync(dstFile,  { 
                    btime: stat.mtime.getTime(),
                    mtime: stat.mtime.getTime(),
                    atime: stat.mtime.getTime() 
                });
            });
        }
    });
}

(async () => {
   await cr3ToJpg(process.argv[2]);
   await modifyFileTime(process.argv[2]);
})();
