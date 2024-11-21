const valuesSsd = [0,500, 1000, 2000, 3000, 4000];
const valuesRam = [0,8, 16, 32, 64];

const inputSsd = document.getElementById('ssdQuantity'),
    outputSsd = document.getElementById('ssdQuantityOutput'),
    inputRam = document.getElementById('ramQuantity'),
    outputRam = document.getElementById('ramQuantityOutput');


inputSsd.oninput = function() {
    outputSsd.innerHTML = valuesSsd[this.value];
};

inputRam.oninput = function() {
    outputRam.innerHTML = valuesRam[this.value];
};

// set the default value
inputSsd.oninput();
inputRam.oninput();