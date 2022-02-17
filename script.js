const brain = require('brainjs');
const readline = require('readline');
const fs = require('fs');

/**
 * Récupère les données CSV à partir d'un fichier local ou d'une URL (à choisir pour le TP)
 * @param urlOrFilename
 * @returns csvData
 */
function getCsvData(filename) {
    var data = fs.readFileSync(filename)
        .toString() // convert Buffer to string
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => e.trim())); // split each line to array
    return data;
}

/**
 * Prépare le jeu de données d'entraînement au format Brain.js
 * @param rawData
 * @returns trainingData
 */
function prepareTrainingData(rawData) {

    let trainingData = [];

    rawData.shift();

    rawData.forEach(row => {
        trainingData.push({
            input: [parseFloat(row[0]), parseFloat(row[1]), parseFloat(row[2]), parseFloat(row[3])],
            output: transformFlowerTypeToArray(row[4])
        })
    });

    return trainingData;
}

/**
 * Transforme les noms des types de fleurs en tableau d'output
 * @param type
 * @returns array
 */
function transformFlowerTypeToArray($type) {

    switch ($type) {
        case "Setosa":
            return [1, 0, 0];
        case "Versicolor":
            return [0, 1, 0];
        case "Virginica":
            return [0, 0, 1];
    }

}

/**
 * Fonction principale du script
 */
function main() {

    let csvData = getCsvData("iris.csv");

    const trainingData = prepareTrainingData(csvData);

    let net = new brain.NeuralNetwork({
        binaryThresh: 0.5,
        hiddenLayers: [3, 3, 2],
        activation: "sigmoid",
    });

    net.train(trainingData, {
        iterations: 1000,
        learningRate: 0.3,
    });

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let sepalLength;
    let sepalWidth;
    let petalLength;
    let petalWidth;

    readline.question('Veuillez saisir une longeur de sepal ', input => {
        sepalLength = parseFloat(input);
        readline.question('Veuillez saisir une largeur de sepal ', input => {
            sepalWidth = parseFloat(input);
            readline.question('Veuillez saisir une longeur de pétale ', input => {
                petalLength = parseFloat(input);
                readline.question('Veuillez saisir une largeur de pétale ', input => {
                    petalWidth = parseFloat(input);

                    let array = [sepalLength, sepalWidth, petalLength, petalWidth];

                    var output = net.run(array);
                    console.log('Probabilité Setosa : ' + output[0])
                    console.log('Probabilité Versicolor: ' + output[1])
                    console.log('Probabilité Virginica : ' + output[2])
                    readline.close();
                });
            });
        });
    });
}

main();