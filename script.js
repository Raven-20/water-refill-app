document.addEventListener("DOMContentLoaded", () => {
  const checkboxes = document.querySelectorAll('input[type="checkbox"][name="gallon"]');
  
  // Enable/disable quantity fields
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const qtyInput = e.target.parentElement.nextElementSibling;
      qtyInput.disabled = !e.target.checked;
      if (!e.target.checked) {
        qtyInput.value = "";
      }
    });
  });
  
  const form = document.getElementById('refillForm');
  const output = document.getElementById('output');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let total = 0;
    let summary = "";

    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        const price = parseFloat(checkbox.dataset.price);
        const qtyInput = checkbox.parentElement.nextElementSibling;
        const qty = parseInt(qtyInput.value || 0);

        if (qty > 0) {
          const subtotal = price * qty;
          total += subtotal;
          summary += `${checkbox.value} Gallon × ${qty} = ₱${subtotal}<br>`;
        }
      }
    });

    const cash = parseFloat(document.getElementById("cash").value || 0);

    if (total === 0) {
      output.innerHTML = `<strong>Please select at least one gallon and enter quantity.</strong>`;
      return;
    }

    if (cash < total) {
      output.innerHTML = `
        <strong style="color:red;">Insufficient payment. Total: ₱${total}, Cash given: ₱${cash}</strong>
      `;
      return;
    }

    const change = cash - total;

    output.innerHTML = `
      <h3>Receipt</h3>
      ${summary}
      <strong>Total: ₱${total}</strong><br>
      Cash Given: ₱${cash}<br>
      Change: ₱${change}
    `;
  });

  // NEW: Clear Button functionality
  document.getElementById("clearBtn").addEventListener("click", () => {
    output.innerHTML = "";

    checkboxes.forEach(cb => {
      cb.checked = false;
      const qtyInput = cb.parentElement.nextElementSibling;
      qtyInput.disabled = true;
      qtyInput.value = "";
    });

    document.getElementById("cash").value = "";
  });
});
