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
    lagrange = 0.0;
    cauchy = 0.0;
    knuth = 0.0;
    for (let i = 0; i < deg; i++)
    {
        lagrange += math.abs(polynomial[i] / polynomial[deg]);
        cauchy = math.max(cauchy, math.abs(polynomial[i] / polynomial[deg]));
        knuth = math.max(knuth, math.pow(math.abs(polynomial[i] / polynomial[deg]), 1 / (deg - i)));
    }
    lagrange = math.max(1.0, lagrange);
    cauchy += 1;
    knuth *= 2;
    return math.max(lagrange, cauchy, knuth);
}
let d = 0;
let roots = [];
function getDegree()
{
    if (document.getElementById("degree").value < 0 || Number.isInteger(+document.getElementById("degree").value) == false)
    {
        return;
    }
    d = document.getElementById("degree").value;
    if (!d)
    {
        return;
    }
    document.getElementById("placeholder").innerHTML = '';
    var polynomial_coeff = document.createElement("div");
    polynomial_coeff.setAttribute("style", "float:left");
    for (let i = d; i > 0; i--)
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
        title: 'Roots Plot',
        width: 800,
        height: 800,
    };

    Plotly.newPlot('plot-placeholder', data, layout);
}

function newtonRaphson(idx, inputs, deg, polynomial, slope, rootsList, startCurr) 
{
    if (idx >= inputs.length || roots.length == deg)
    {
        startCurr.remove();
        button_flag = true;
        if (!document.getElementById("plotter"))
        {
            var plotRunner = document.createElement("button");
            plotRunner.innerHTML = "Plot Roots";
            plotRunner.setAttribute("onclick", "plotRoots()");
            plotRunner.setAttribute("id", "plotter");
            document.getElementById("placeholder").appendChild(plotRunner);
            plotPlaceholder = document.createElement("div");
            plotPlaceholder.setAttribute("id", "plot-placeholder");
            document.getElementById("placeholder").appendChild(plotPlaceholder);
        }
        return;
    }
    let input = inputs[idx];
    const tolerance = 0.00000000001 * math.abs(input);
    const cycle_lim = 1000;
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
            if (math.abs(math.subtract(roots[index], input)) <= 0.00001)
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
            root.innerHTML = "\\(" + input.format({ notation: 'fixed', precision: 5 }) + "\\)";
            rootsList.appendChild(root);
            MathJax.typeset();
            if (input.im.toFixed(8) != 0)
            {
                var input2 = math.conj(input);
                var flag2 = true;
                if (math.abs(polyvalue(polynomial, deg, input2)) > tolerance || math.abs(input2) > start_radius + 1)
                {
                    flag2 = false;
                }
                else
                {
                    for (let index = 0; index < roots.length; index++)
                    {
                        if (math.abs(math.subtract(roots[index], input2)) <= 0.00001)
                        {
                            if (math.abs(polyvalue(polynomial, deg, input2)) < math.abs(polyvalue(polynomial, deg, roots[index])))
                            {
                                roots[index] = input2;
                            }
                            flag2 = false;
                            break;
                        }
                    }
                }
                if (flag2)
                {
                    roots.push(math.conj(input));
                    var root_conj = document.createElement("li");
                    root_conj.innerHTML = "\\(" + math.conj(input).format({ notation: 'fixed', precision: 5 }) + "\\)";
                    rootsList.appendChild(root_conj);
                    MathJax.typeset();
                }
            }
            startCurr.innerHTML = "Starting points remaining: " + (inputs.length - idx - 1);
            newtonRaphson(idx + 1, inputs, deg, polynomial, slope, rootsList, startCurr);
        });
    }
    else
    {
        window.requestAnimationFrame(() =>
        {
            startCurr.innerHTML = "Starting points remaining: " + (inputs.length - idx - 1);
            newtonRaphson(idx + 1, inputs, deg, polynomial, slope, rootsList, startCurr);
        });
    }
}

var start_radius = 0;
button_flag = true;
function calcRoots()
{
    if (!button_flag)
    {
        return;
    }
    button_flag = false;
    var deg = d;
    roots.length = 0;
    start_radius = 0;
    if (document.getElementsByTagName("h3")[0])
    {
        document.getElementsByTagName("h3")[0].remove();
    }
    if (document.getElementsByTagName("ol")[0])
    {
        document.getElementsByTagName("ol")[0].remove();
    }
    if (document.getElementById("loader"))
    {
        document.getElementById("loader").remove();
    }
    if (document.getElementById("radius-display"))
    {
        document.getElementById("radius-display").remove();
    }
    if (document.getElementById("plotter"))
    {
        document.getElementById("plotter").remove();
    }
    if (document.getElementById("plot-placeholder"))
    {
        document.getElementById("plot-placeholder").remove();
    }
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
    var startCurr = document.createElement("h4");
    startCurr.setAttribute("id", "loader");
    if (polynomial.length == 1 && polynomial[0] == 0)
    {
        startCurr.innerHTML = "It's an identity function!";

        document.getElementById("placeholder").append(startCurr);
        button_flag = true;
        return;
    }
    if (polynomial.length == 1 && polynomial[0] != 0)
    {
        startCurr.innerHTML = "No roots!";

        document.getElementById("placeholder").append(startCurr);
        button_flag = true;
        return;
    }
    derivative(polynomial, slope, deg);
    const circles = math.max(2, math.ceil(0.26632 * math.log2(deg)) + 1);
    const points = math.max(2, math.ceil(8.32547 * deg * math.log2(deg)) + 1);
    start_radius = max_radius(polynomial, deg);


    var radiusDisplay = document.createElement("h3");
    radiusDisplay.setAttribute("id", "radius-display");
    radiusDisplay.innerHTML = "Calculated Roots(maximum radius = " + start_radius.toFixed(4) + "):";
    document.getElementById("placeholder").appendChild(radiusDisplay);
    var rootsList = document.createElement("ol");
    document.getElementById("placeholder").append(rootsList);

    document.getElementById("placeholder").append(startCurr);

    let inputs = Array(circles * points);

    for (let v = 1; v <= circles; v++)
    {
        for (let j = 0; j < points; j++)
        {
            if (deg == 1)
            {
                inputs[(v - 1) * points + j] = math.Complex.fromPolar({ r: -polynomial[0], phi: 0 });
                continue;
            }
            inputs[(v - 1) * points + j] = math.Complex.fromPolar({ r: start_radius * (1 + math.sqrt(2)) * math.pow((deg - 1) / deg, (2 * v - 1) / (4 * circles)), phi: 2 * math.PI * j / points + (v & 1) * math.PI / points });
        }
    }
    newtonRaphson(0, inputs, deg, polynomial, slope, rootsList, startCurr);
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

