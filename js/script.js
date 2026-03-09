// All loot items live here as plain objects { name, value, quantity }.
// Being at the top of the file means it survives across button clicks.
const loot = [];


// Grab all the elements we'll need to read from or write to
const partySizeInput    = document.getElementById("party-size");
const lootNameInput     = document.getElementById("loot-name");
const lootValueInput    = document.getElementById("loot-value");
const lootQuantityInput = document.getElementById("loot-quantity");
const addLootBtn        = document.getElementById("add-loot-btn");
const splitLootBtn      = document.getElementById("split-loot-btn");
const noLootMessage     = document.getElementById("noLootMessage");
const lootTableWrapper  = document.getElementById("loot-table-wrapper");
const lootRows          = document.getElementById("lootRows");
const totalLootSpan     = document.getElementById("totalLoot");
const resultsArea       = document.getElementById("results-area");
const resultTotal       = document.getElementById("result-total");
const resultPerMember   = document.getElementById("result-per-member");
const partyError        = document.getElementById("party-error");
const lootError         = document.getElementById("loot-error");
const splitError        = document.getElementById("split-error");


// This is the only function that calculates totals and updates the DOM.
// Every state change (add, remove, party size) calls this immediately after.
function updateUI() {

    // Add up value * quantity for every item in the array
    let total = 0;
    for (let i = 0; i < loot.length; i++) {
        total += loot[i].value * loot[i].quantity;
    }

    totalLootSpan.textContent = total.toFixed(2);

    // Wipe the previous list so we can rebuild it fresh from the array
    lootRows.innerHTML = "";

    if (loot.length === 0) {
        // Nothing in the array — show the empty message and hide the table
        noLootMessage.classList.remove("hidden");
        lootTableWrapper.classList.add("hidden");
    } else {
        noLootMessage.classList.add("hidden");
        lootTableWrapper.classList.remove("hidden");

        for (let i = 0; i < loot.length; i++) {

            let row = document.createElement("div");
            row.className = "loot-row";

            let nameCell = document.createElement("div");
            nameCell.className = "loot-cell";
            nameCell.textContent = loot[i].name;

            // Gold color on value is handled by the value-cell class in CSS
            let valueCell = document.createElement("div");
            valueCell.className = "loot-cell value-cell";
            valueCell.textContent = "$" + loot[i].value.toFixed(2);

            let quantityCell = document.createElement("div");
            quantityCell.className = "loot-cell";
            quantityCell.textContent = loot[i].quantity;

            let actionCell = document.createElement("div");
            actionCell.className = "loot-cell";

            let removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.type = "button";

            // The IIFE freezes the value of i so each button knows which
            // item to remove even after the loop finishes
            removeBtn.addEventListener("click", (function(index) {
                return function() {
                    removeLoot(index);
                };
            })(i));

            actionCell.appendChild(removeBtn);
            row.appendChild(nameCell);
            row.appendChild(valueCell);
            row.appendChild(quantityCell);
            row.appendChild(actionCell);
            lootRows.appendChild(row);
        }
    }

    // Check party size here so the rest of the function can use the result
    const partySize = parseInt(partySizeInput.value, 10);
    const partyValid = !isNaN(partySize) && partySize >= 1;

    // Split button only turns on when there's something to split and someone to split it with
    if (loot.length > 0 && partyValid) {
        splitLootBtn.disabled = false;
    } else {
        splitLootBtn.disabled = true;
    }

    // Show the results only when the state is fully ready — never show stale numbers
    if (loot.length > 0 && partyValid) {
        const perMember = total / partySize;
        resultTotal.textContent     = "$" + total.toFixed(2);
        resultPerMember.textContent = "$" + perMember.toFixed(2);
        resultsArea.classList.remove("hidden");
    } else {
        resultsArea.classList.add("hidden");
    }
}


// Validates all three fields before touching the array.
// If anything is wrong, we bail early and show an error — the array stays clean.
function addLoot() {
    lootError.textContent = "";

    const name     = lootNameInput.value.trim();
    const value    = parseFloat(lootValueInput.value);
    const quantity = parseInt(lootQuantityInput.value, 10);

    if (name === "") {
        lootError.textContent = "Please enter a loot item name.";
        lootNameInput.focus();
        return;
    }
    if (isNaN(value)) {
        lootError.textContent = "Please enter a valid loot value.";
        lootValueInput.focus();
        return;
    }
    if (value < 0) {
        lootError.textContent = "Loot value cannot be negative.";
        lootValueInput.focus();
        return;
    }
    if (isNaN(quantity) || quantity < 1) {
        lootError.textContent = "Quantity must be at least 1.";
        lootQuantityInput.focus();
        return;
    }

    loot.push({ name: name, value: value, quantity: quantity });

    // Clear the fields so the user can add the next item quickly
    lootNameInput.value     = "";
    lootValueInput.value    = "";
    lootQuantityInput.value = "";
    lootNameInput.focus();

    updateUI();
}


// splice removes exactly one item at the given index, then we let updateUI redraw everything
function removeLoot(index) {
    loot.splice(index, 1);
    updateUI();
}


// The split button doesn't do any math itself — updateUI handles that.
// This just clears old errors and triggers a fresh render.
function splitLoot() {
    splitError.textContent = "";
    partyError.textContent = "";
    updateUI();
}


// Event listeners all live here — no onclick attributes in the HTML
addLootBtn.addEventListener("click", addLoot);
splitLootBtn.addEventListener("click", splitLoot);

// Changing party size immediately recalculates everything without needing a button press
partySizeInput.addEventListener("input", function() {
    partyError.textContent = "";

    const val = parseInt(partySizeInput.value, 10);
    if (partySizeInput.value !== "" && (isNaN(val) || val < 1)) {
        partyError.textContent = "Party size must be at least 1.";
    }

    updateUI();
});

// Let Enter submit the form from any of the three loot input fields
lootNameInput.addEventListener("keydown",     function(e) { if (e.key === "Enter") addLoot(); });
lootValueInput.addEventListener("keydown",    function(e) { if (e.key === "Enter") addLoot(); });
lootQuantityInput.addEventListener("keydown", function(e) { if (e.key === "Enter") addLoot(); });


// Run once on load so the empty state is set up correctly from the start
updateUI();
