document.addEventListener("DOMContentLoaded", function () {
  console.log("graph.js loaded ✅");

  // Get all input elements (Rate A, B, C)
  const inputs = document.querySelectorAll("input");
  const canvas = document.getElementById("relayChart");

  // Check that canvas exists before proceeding
  if (!canvas) {
    console.error("❌ relayChart canvas not found!");
    return;
  }

  const ctx = canvas.getContext("2d");

  // Initialize Chart.js
  let chart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Rate A",
          data: [], // expects {x, y} pairs
          borderColor: "red",
          borderWidth: 2,
          pointRadius: 3,
          fill: false,
          tension: 0.3,
        },
        {
          label: "Rate B",
          data: [],
          borderColor: "blue",
          borderWidth: 2,
          pointRadius: 3,
          fill: false,
          tension: 0.3,
        },
        {
          label: "Rate C",
          data: [],
          borderColor: "green",
          borderWidth: 2,
          pointRadius: 3,
          fill: false,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
      },
      scales: {
        x: {
          type: "linear", // 👈 Must be linear for numeric x-values
          title: {
            display: true,
            text: "Multiple of Pickup Current (I/Is)",
            color: "black",
            font: { size: 14, weight: "bold" },
          },
          min: 1,
          max: 15,
          ticks: {
            color: "black",
            stepSize: 0.5,
            autoSkip: false,
            callback: function (value) {
              return Number.isInteger(value) ? value : value.toFixed(1);
            },
          },
          grid: { color: "rgba(0,0,0,0.1)" },
        },
        y: {
          title: {
            display: true,
            text: "Operating Time (s)",
            color: "black",
            font: { size: 14, weight: "bold" },
          },
          ticks: { color: "black" },
          grid: { color: "rgba(0,0,0,0.1)" },
          beginAtZero: true,
        },
      },
    },
  });

  // IDMT formula
  function calcRate(If, Is, TMS) {
    if (If > 0 && Is > 0 && TMS > 0) {
      const numerator = 0.14;
      const denominator = Math.pow(If / Is, 0.02) - 1;
      return (numerator / denominator) * TMS;
    }
    return 0;
  }

  // Generate curve data
  function generateCurve(Is, TMS) {
    const data = [];
    if (Is > 0 && TMS > 0) {
      for (let multiple = 1.0; multiple <= 15; multiple += 0.5) {
        const I = multiple * Is;
        const t = (0.14 / (Math.pow(I / Is, 0.02) - 1)) * TMS;
        data.push({ x: multiple, y: t });
      }
    }
    return data;
  }

  // Update chart when values change
  function updateChart() {
    const IsA = parseFloat(document.getElementById("IsA").value) || 0;
    const TMSA = parseFloat(document.getElementById("TMSA").value) || 0;
    const IsB = parseFloat(document.getElementById("IsB").value) || 0;
    const TMSB = parseFloat(document.getElementById("TMSB").value) || 0;
    const IsC = parseFloat(document.getElementById("IsC").value) || 0;
    const TMSC = parseFloat(document.getElementById("TMSC").value) || 0;

    chart.data.datasets[0].data = generateCurve(IsA, TMSA);
    chart.data.datasets[1].data = generateCurve(IsB, TMSB);
    chart.data.datasets[2].data = generateCurve(IsC, TMSC);

    // ✅ Force Chart.js to re-render
    chart.update();
  }

  // Add event listeners
  inputs.forEach((input) => input.addEventListener("input", updateChart));

  // Optional: show a default chart initially
  document.getElementById("IsA").value = 100;
  document.getElementById("TMSA").value = 0.2;
  document.getElementById("IsB").value = 120;
  document.getElementById("TMSB").value = 0.3;
  document.getElementById("IsC").value = 150;
  document.getElementById("TMSC").value = 0.4;
  updateChart();
});
