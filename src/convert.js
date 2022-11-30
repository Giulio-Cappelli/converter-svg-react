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
    progressBar.start(files.length - 1, 0);

    //Iterate each file
    files.forEach(file => {
        if (file === '.gitkeep') { return; }

        let fileDetails = fs.lstatSync(path.resolve(inputPath, file));

        if (!fileDetails.isDirectory()) {
            const fileContent = fs.readFileSync(inputPath + '/' + file, 'utf8');
            const componentName = file.split('.')[0];

            //Convert the svg file in js 
            const fileJs = transform.sync(
                fileContent,
                {
                    plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
                    icon: true,
                },
                { componentName: componentName }
            )


            //Progress bar increment;
            progressBar.increment();

            //Save the converted file in output path
            const outputName = componentName + '.tsx';
            fs.writeFile(outputPath + '/' + outputName, fileJs, function (err) {
                if (err) return console.log(err);
            })
        }
    });
    progressBar.stop();
});