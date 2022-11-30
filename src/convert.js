import { transform } from '@svgr/core';
import cliProgress from 'cli-progress';

import fs from 'fs';
import path from 'path';

//Path of input and output directories
const inputPath = './src/input';
const outputPath = './src/output';

//Creation of a progressbar
const progressBar = new cliProgress.SingleBar({
    format: 'File Conversion |' + '{bar}' + '| {percentage}% || {value}/{total} Files',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
});

//Get list of files from input path
fs.readdir(inputPath, (err, files) => {
    //Start the progress bar
    progressBar.start(files.length, 0);

    //Iterate each file
    files.forEach(file => {
        let fileDetails = fs.lstatSync(path.resolve(inputPath, file));

        //Progress bar increment;
        progressBar.increment();

        if (!fileDetails.isDirectory()) {
            fs.readFile(inputPath + '/' + file, 'utf8', async function (err, data) {
                if (err) {
                    return console.log(err);
                }

                const componentName = file.split('.')[0];

                //Convert the svg file in js 
                const fileJs = await transform(
                    data,
                    {
                        plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
                        icon: true,
                    },
                    { componentName: componentName },
                );

                //Save the converted file in output path
                const outputName = componentName + '.tsx';
                fs.writeFile(outputPath + '/' + outputName, fileJs, function (err) {
                    if (err) return console.log(err);
                });
            });
        }
    });
    progressBar.stop();
});