function derivative(polynomial, slope, deg)
{
    for (let i = 0; i < deg; i++)
    {
        slope[i] = polynomial[i + 1] * (i + 1);
    }
}

function polyvalue(polynomial, deg, input)
{
    let value = math.complex(0, 0);
    for (let i = 0; i <= deg; i++)
    {
        value = math.add(math.multiply(math.pow(input, i), polynomial[i]), value);
    }
    return value;
}

function max_radius(polynomial, deg)
{
    radius = 0.0;
    for (let i = 0; i < deg; i++)
    {
        radius += math.abs(polynomial[i] / polynomial[deg]);
    }
    return radius;
}
let deg = 0;
let roots = [];
function getDegree()
{
    if (document.getElementById("degree").value < 0 || Number.isInteger(+document.getElementById("degree").value) == false)
    {
        return;
    }
    deg = document.getElementById("degree").value;
    if (!deg)
    {
        return;
    }
    document.getElementById("placeholder").innerHTML = '';
    var polynomial_coeff = document.createElement("div");
    polynomial_coeff.setAttribute("style", "float:left");
    for (let i = deg; i > 0; i--)
    {
        coeff = document.createElement("input")
        coeff.setAttribute("type", "number");
        coeff.setAttribute("id", '' + i);
        polynomial_coeff.appendChild(coeff);
        polynomial_coeff.appendChild(document.createTextNode("\\(x^{" + i + "}+\\)"))
    }

    coeff = document.createElement("input");
    coeff.setAttribute("type", "number");
    coeff.setAttribute("id", "0");
    polynomial_coeff.appendChild(coeff);
    polynomial_coeff.appendChild(document.createTextNode("\\( = 0\\)"))
    document.getElementById("placeholder").appendChild(polynomial_coeff)
    document.getElementById("placeholder").appendChild(document.createElement("br"))
    document.getElementById("placeholder").appendChild(document.createElement("br"))

    var finalSubmit = document.createElement("button");
    finalSubmit.setAttribute("onclick", "calcRoots()");
    finalSubmit.setAttribute("id", "final-runner");
    finalSubmit.appendChild(document.createTextNode("Find Roots"))
    document.getElementById("placeholder").appendChild(finalSubmit);
    MathJax.typeset();
}


function plotRoots() 
{
    x_points = [];
    y_points = [];
    for (let i = 0; i < roots.length; i++)
    {
        x_points.push(roots[i].re.toFixed(5));
        y_points.push(roots[i].im.toFixed(5));
    }
    console.log(x_points);
    console.log(y_points);
    var plotPoints = {
        x: x_points,
        y: y_points,
        mode: 'markers',
        type: 'scatter',
        marker: { size: 12 }
    };
    var data = [plotPoints];
    var layout = {
        xaxis: {
            autorange: true,
            title: "Real Part"
        },
        yaxis: {
            autorange: true,
            title: "Imaginary Part"
        },
        title: 'Roots Plot'
    };

    Plotly.newPlot('plot-placeholder', data, layout);
}

function newtonRaphson(idx, inputs, deg, polynomial, slope, rootsList, startCurr, start_radius) 
{
    if (idx >= inputs.length || roots.length == deg)
    {
        startCurr.remove();
        var plotRunner = document.createElement("button");
        plotRunner.innerHTML = "Plot Roots";
        plotRunner.setAttribute("onclick", "plotRoots()");
        document.getElementById("placeholder").appendChild(plotRunner);
        plotPlaceholder = document.createElement("div");
        plotPlaceholder.setAttribute("id", "plot-placeholder");
        document.getElementById("placeholder").appendChild(plotPlaceholder);
        return;
    }
    let input = inputs[idx];
    const tolerance = 0.00001;
    const cycle_lim = math.ceil(deg * math.log2((1 + math.sqrt(2)) / tolerance));
    let cycle_curr = 0;
    let output = polyvalue(polynomial, deg, input);
    while (cycle_curr < cycle_lim && math.abs(output) > tolerance)
    {
        input = math.subtract(input, math.divide(output, polyvalue(slope, deg - 1, input)));
        output = polyvalue(polynomial, deg, input);
        cycle_curr++;
    }
    let flag = true;
    if (math.abs(polyvalue(polynomial, deg, input)) > tolerance || math.abs(input) > start_radius + 1)
    {
        flag = false;
    }
    else
    {
        for (let index = 0; index < roots.length; index++)
        {
            if (math.abs(math.subtract(roots[index], input)) <= 0.001)
            {
                if (math.abs(polyvalue(polynomial, deg, input)) < math.abs(polyvalue(polynomial, deg, roots[index])))
                {
                    roots[index] = input;
                }
                flag = false;
                break;
            }
        }
    }
    if (flag)
    {
        roots.push(input);
        window.requestAnimationFrame(() =>
        {
            var root = document.createElement("li");
            root.innerHTML = "\\(" + input.format({ precision: 5 }) + "\\)";
            rootsList.appendChild(root);
            MathJax.typeset();
            startCurr.innerHTML = "Starting points remaining: " + (inputs.length - idx - 1);
            newtonRaphson(idx + 1, inputs, deg, polynomial, slope, rootsList, startCurr, start_radius);
        });
    }
    else
    {
        window.requestAnimationFrame(() =>
        {
            startCurr.innerHTML = "Starting points remaining: " + (inputs.length - idx - 1);
            newtonRaphson(idx + 1, inputs, deg, polynomial, slope, rootsList, startCurr, start_radius);
        });
    }
}
function calcRoots()
{

    let polynomial = Array(deg + 1);
    let slope = Array(deg);
    zeros = false;
    for (let i = deg; i >= 0; i--)
    {
        if (document.getElementById('' + i).value == "")
        {
            polynomial[i] = 0;
        }
        else
        {
            polynomial[i] = document.getElementById('' + i).value;
        }
        if (!zeros)
        {
            if (polynomial[i] == 0 && i != 0)
            {
                polynomial.splice(i, 1);
                deg--;
                slope.splice(i - 1, 1);
            }
            else
            {
                zeros = true;
            }
        }

    }
    document.getElementById("placeholder").appendChild(document.createElement("br"));
    document.getElementById("placeholder").appendChild(document.createElement("br"));
    document.getElementById("placeholder").appendChild(document.createElement("br"));
    document.getElementById("placeholder").appendChild(document.createElement("h3").appendChild(document.createTextNode("Calculated Roots:")));
    var rootsList = document.createElement("ol");
    document.getElementById("placeholder").append(rootsList);
    document.getElementById("final-runner").remove();
    var startCurr = document.createElement("h4");
    document.getElementById("placeholder").append(startCurr);
    if (polynomial.length == 1 && polynomial[0] == 0)
    {
        startCurr.innerHTML = "It's an identity function!";
        return;
    }
    if (polynomial.length == 1 && polynomial[0] != 0)
    {
        startCurr.innerHTML = "No roots!";
        return;
    }
    derivative(polynomial, slope, deg);
    const circles = math.max(2, math.ceil(0.26632 * math.log2(deg)));
    const points = math.max(2, math.ceil(8.32547 * deg * math.log2(deg)));
    const start_radius = max_radius(polynomial, deg);

    let inputs = Array(circles * points);

    for (let v = 1; v <= circles; v++)
    {
        for (let j = 0; j < points; j++)
        {
            inputs[(v - 1) * points + j] = math.Complex.fromPolar({ r: start_radius * (1 + math.sqrt(2)) * math.pow((deg - 1) / deg, (2 * v - 1) / (4 * circles)), phi: 2 * math.PI * j / points });
        }
    }
    newtonRaphson(0, inputs, deg, polynomial, slope, rootsList, startCurr, start_radius);
}
$("#explanation").hide();

function showExplanation()
{

    if ($("#explanation").is(":visible"))
    {
        $("#explanation-shower").prop("value", "Show Explanation")
    }
    else
    {
        $("#explanation-shower").prop("value", "Hide Explanation")
    }
    $("#explanation").toggle(1000);
}

