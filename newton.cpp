<<<<<<< HEAD
#include <bits/stdc++.h>
using namespace std;

void derivative(double polynomial[], double slope[], int deg)
{
    for (int i = 0; i < deg; i++)
    {
        slope[i] = polynomial[i + 1] * (i + 1);
    }
}

complex<double> poly_value(double polynomial[], int deg, complex<double> input)
{
    complex<double> value(0, 0);
    for (int i = 0; i <= deg; i++)
    {
        value += pow(input, i) * polynomial[i];
    }
    return value;
}

double max_radius(double polynomial[], int deg)
{
    double radius = 0;
    for (int i = 0; i < deg; i++)
    {
        radius += abs(polynomial[i] / polynomial[deg]);
    }
}

int main()
{
    srand((unsigned int)time(NULL));
    cout << "Enter degree of polynomial: \n";
    int deg;
    cin >> deg;
    double polynomial[deg + 1], slope[deg] = {0};
    cout << "Enter coefficients from largest power to smallest: \n";
    for (int i = deg; i >= 0; i--)
    {
        cin >> polynomial[i];
    }
    derivative(polynomial, slope, deg);
    double d = (double)deg;
    int circles = ceil(0.26632 * log(d));
    int points = ceil(8.32547 * d * log(d));
    double start_radius = max_radius(polynomial, deg);

    ofstream rad;
    rad.open("radius.txt");
    rad << start_radius;
    rad.close();

    complex<double> inputs[circles * points];
    for (int v = 1; v <= circles; v++)
    {
        for (int j = 0; j < points; j++)
        {
            inputs[(v - 1) * points + j] = polar(start_radius * (1 + sqrt(2)) * pow((d - 1) / d, (2 * v - 1) / (4 * circles)), 2 * M_PI * j / points);
        }
    }

    ofstream start_points;
    start_points.open("start_points.txt");

    vector<complex<double>> roots;
    for (int start = 0; start < circles * points; start++)
    {
        double tolerance = 0.0000001;
        int cycle_lim = ceil(d * log((1 + sqrt(2)) / tolerance));
        int cycle_curr = 0;
        double rand_min = -10000, rand_max = 10000;
        complex<double> input = inputs[start];
        complex<double> output = poly_value(polynomial, deg, input);
        start_points << real(input) << " " << imag(input) << "\n";
        while (cycle_curr < cycle_lim && abs(output) > tolerance)
        {
            input = input - output / poly_value(slope, deg - 1, input);
            output = poly_value(polynomial, deg, input);
            cycle_curr++;
        }
        bool flag = true;
        for (int index = 0; index < roots.size(); index++)
        {
            if (abs(roots[index] - input) <= 0.001)
            {
                if (abs(poly_value(polynomial, deg, input)) < abs(poly_value(polynomial, deg, roots[index])))
                {
                    roots[index] = input;
                }

                flag = false;
                break;
            }
        }
        if (flag)
        {
            roots.push_back(input);
        }
    }
    start_points.close();
    ofstream sols;
    sols.open("roots.txt");
    cout << "Roots of this polynomial are: \n";
    for (auto root : roots)
    {
        cout << fixed << setprecision(10) << root << "\n";
        sols << fixed << setprecision(10) << real(root) << " " << imag(root) << "\n";
    }
    sols.close();
}
=======
#include <bits/stdc++.h>
using namespace std;

void derivative(double polynomial[], double slope[], int deg)
{
    for (int i = 0; i < deg; i++)
    {
        slope[i] = polynomial[i + 1] * (i + 1);
    }
}

complex<double> poly_value(double polynomial[], int deg, complex<double> input)
{
    complex<double> value(0, 0);
    for (int i = 0; i <= deg; i++)
    {
        value += pow(input, i) * polynomial[i];
    }
    return value;
}

double max_radius(double polynomial[], int deg)
{
    double radius = 0;
    for (int i = 0; i < deg; i++)
    {
        radius += abs(polynomial[i] / polynomial[deg]);
    }
    return max(1.0, radius);
}

int main()
{
    srand((unsigned int)time(NULL));
    cout << "Enter degree of polynomial: \n";
    int deg;
    cin >> deg;
    double polynomial[deg + 1], slope[deg] = {0};
    cout << "Enter coefficients from largest power to smallest: \n";
    for (int i = deg; i >= 0; i--)
    {
        cin >> polynomial[i];
    }
    derivative(polynomial, slope, deg);
    double d = (double)deg;
    int circles = ceil(0.26632 * log(d));
    int points = ceil(8.32547 * d * log(d));
    double start_radius = max_radius(polynomial, deg);

    ofstream rad;
    rad.open("radius.txt");
    rad << start_radius;
    rad.close();

    complex<double> inputs[circles * points];
    for (int v = 1; v <= circles; v++)
    {
        for (int j = 0; j < points; j++)
        {
            inputs[(v - 1) * points + j] = polar(start_radius * (1 + sqrt(2)) * pow((d - 1) / d, (2 * v - 1) / (4 * circles)), 2 * M_PI * j / points);
        }
    }

    ofstream start_points;
    start_points.open("start_points.txt");

    vector<complex<double>> roots;
    for (int start = 0; start < circles * points; start++)
    {
        double tolerance = 0.0000001;
        int cycle_lim = ceil(d * log((1 + sqrt(2)) / tolerance));
        int cycle_curr = 0;
        double rand_min = -10000, rand_max = 10000;
        complex<double> input = inputs[start];
        complex<double> output = poly_value(polynomial, deg, input);
        start_points << real(input) << " " << imag(input) << "\n";
        while (cycle_curr < cycle_lim && abs(output) > tolerance)
        {
            input = input - output / poly_value(slope, deg - 1, input);
            output = poly_value(polynomial, deg, input);
            cycle_curr++;
        }
        bool flag = true;
        for (int index = 0; index < roots.size(); index++)
        {
            if (abs(roots[index] - input) <= 0.001)
            {
                if (abs(poly_value(polynomial, deg, input)) < abs(poly_value(polynomial, deg, roots[index])))
                {
                    roots[index] = input;
                }

                flag = false;
                break;
            }
        }
        if (flag)
        {
            roots.push_back(input);
        }
    }
    start_points.close();
    ofstream sols;
    sols.open("roots.txt");
    cout << "Roots of this polynomial are: \n";
    for (auto root : roots)
    {
        cout << fixed << setprecision(10) << root << "\n";
        sols << fixed << setprecision(10) << real(root) << " " << imag(root) << "\n";
    }
    sols.close();
}
>>>>>>> 1a0c99b (change compiler)
