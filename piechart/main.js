const { jsPDF } = window.jspdf;
document.addEventListener("DOMContentLoaded", async function () {
  const baseURL = "https://dummyjson.com/products/";

  // Fetch all product categories
  const categoriesResponse = await fetch(`${baseURL}categories`);
  const categories = await categoriesResponse.json();

  // Fetch products for each category
  const productsPromises = categories.map(async (category) => {
    const response = await fetch(`${baseURL}category/${category}`);
    return response.json();
  });
  // Wait for all fetch requests to complete
  const productsResponses = await Promise.all(productsPromises);

  // Use the fetched categories and products to create the pie chart
  const productsCount = productsResponses.map((response) => response.total);
  const backgroundColors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9966",
    "#66FF99",
    "#FFCC99",
    "#C71585",
    "#8B4513",
    "#4169E1",
    "#20B2AA",
    "#B8860B",
    "#8A2BE2",
    "#7CFC00",
    "#32CD32",
    "#FF4500",
    "#1E90FF",
    "#CD853F",
    "#FFD700",
  ];

  const ctx = document.getElementById("pieChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: categories,
      datasets: [
        {
          data: productsCount,
          backgroundColor: backgroundColors,
        },
      ],
    },
    options: {
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const category = data.labels[tooltipItem.index];
            const count = data.datasets[0].data[tooltipItem.index];
            const total = data.datasets[0].data.reduce(
              (acc, val) => acc + val,
              0
            );
            const percentage = ((count / total) * 100).toFixed(2);
            return `${category}: ${percentage}% (${count} products)`;
          },
        },
      },
    },
  });
});

const exportButton = document.getElementById('exportButton');
exportButton.addEventListener('click', function () {
  exportToPDF();
});

function exportToPDF() {
    const pieChartPanel = document.getElementById('pieChartPanel');
  
    html2canvas(pieChartPanel).then(canvas => {
      const imageData = canvas.toDataURL('image/png');
  
      const pdf = new jsPDF('p', 'mm', 'a4');
  
      pdf.addImage(imageData, 'PNG', 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);
  
      pdf.save('pie_chart_export.pdf');
    });
  }
  