let isShowError = false;

const getDerivative = (input) => {
    try {
        return math.derivative(input, 'x').toString()
    } catch (error) {
        console.log(error)
        return false;
    }
}

const getResult = (input, myX) => {
    try {
        return math.evaluate(input.replace(/x/g, myX))
    } catch (error) {
        console.log(error)
        return false;
    }
}

const showLine = () => {
    const dataNormal = []
    const dataDerivative = []
    const table = document.getElementById('table:result').getElementsByTagName('tr')

    for (let index = 0; index < table.length; index++) {
        const element = table[index].getElementsByTagName('td')
        const point = {
            x: element[0].getElementsByTagName('input')[0].value,
            y: element[2].innerText
        }

        dataDerivative.push(point)
    }

    const input = document.getElementById('txt:input').value;
    for (let index = 0; index < table.length; index++) {
        const element = table[index].getElementsByTagName('td')
        const x = element[0].getElementsByTagName('input')[0].value
        const point = {
            x,
            y: getResult(input, x)
        }

        dataNormal.push(point)
    }


    const config = {
        type: 'line',
        data: {
            labels: dataDerivative.map(point => point.x),
            datasets: [{
                    label: 'Linha da derivada',
                    backgroundColor: "#059e65",
                    borderColor: "#32d296",
                    fill: false,
                    data: dataDerivative,
                },
                {
                    label: 'Linha da original',
                    backgroundColor: "#0e6dcd",
                    borderColor: "#3c99f5",
                    fill: false,
                    data: dataNormal,
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                xAxes: [{
                    display: true,
                }],
                yAxes: [{
                    display: true,
                    stacked: true
                }]
            }
        }
    };

    const view = document.getElementById('div:line')
    const canvas = document.createElement('canvas')

    view.innerHTML = ''
    view.appendChild(canvas)
    new Chart(canvas, config)
}

const liveUpdate = (event) => {
    const {
        value
    } = event.srcElement
    const textInput = event.path[2].getElementsByTagName('td')[1].innerText
    event.path[2].getElementsByTagName('td')[2].innerText = getResult(textInput, value)

    showLine()
}

const main = () => {
    const input = document.getElementById('txt:input').value
    if (input.length <= 0) {
        return alert('Campo vazio!')
    }

    document.getElementById('hidden').className = ''
    const derivative = getDerivative(input)
    const table = document.getElementById('table:result')
    table.innerHTML = ''

    for (let index = -3; index <= 3; index++) {
        const lineDocument = document.createElement('tr')
        const xTD = document.createElement('td')
        const textX = document.createElement('input')
        const textInput = document.createElement('td')
        const textY = document.createElement('td')

        textX.value = index
        textInput.innerText = derivative
        textY.innerText = getResult(derivative, index)

        textX.addEventListener('input', liveUpdate)
        textX.min = -99999
        textX.max = 99999
        textX.type = 'number'

        xTD.appendChild(textX)
        lineDocument.appendChild(xTD)
        lineDocument.appendChild(textInput)
        lineDocument.appendChild(textY)

        table.appendChild(lineDocument)
    }

    if (derivative === false) {
        document.getElementById('hidden').className = 'uk-hidden'
    } else {
        showLine()
    }

    document.getElementById('p:result').innerText = `Derivada de "${input}" é "${derivative}".`
}

document.getElementById('bt:load').addEventListener('click', main, false)