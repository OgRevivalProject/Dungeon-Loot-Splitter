// Dungeon Loot Splitter - JavaScript file

// This array stores all the loot items
const lootItems = [];

// Get elements from the page
const partySizeInput    = document.getElementById("party-size");
const lootNameInput     = document.getElementById("loot-name");
const lootValueInput    = document.getElementById("loot-value");
const addLootBtn        = document.getElementById("add-loot-btn");
const splitLootBtn      = document.getElementById("split-loot-btn");
const lootListContainer = document.getElementById("loot-list-container");
const emptyLootMsg      = document.getElementById("empty-loot-msg");
const runningTotal      = document.getElementById("running-total");
const resultTotal       = document.getElementById("result-total");
const resultPerMember   = document.getElementById("result-per-member");
const partyError        = document.getElementById("party-error");
const lootError         = document.getElementById("loot-error");
const splitError        = document.getElementById("split-error");

// Adds a loot item after checking inputs
function addLoot() {
    lootError.textContent = "";

    const name  = lootNameInput.value.trim();
    const value = parseFloat(lootValueInput.value);

    // Make sure inputs are valid
    if (name === "") {
        lootError.textContent = "⚠ Please enter a loot item name.";
        lootNameInput.focus();
        return;
    }
    if (isNaN(value)) {
        lootError.textContent = "⚠ Please enter a valid loot value.";
        lootValueInput.focus();
        return;
    }
    if (value < 0) {
        lootError.textContent = "⚠ Loot value cannot be negative.";
        lootValueInput.focus();
        return;
    }

    // Add item to the array
    lootItems.push({ name: name, value: value });

    // Clear inputs
    lootNameInput.value  = "";
    lootValueInput.value = "";
    lootNameInput.focus();

    renderLoot();
}

// Updates the loot list and total
function renderLoot() {
    if (lootItems.length === 0) {
        lootListContainer.innerHTML = "";
        lootListContainer.appendChild(emptyLootMsg);
        runningTotal.textContent = "$0.00";
        return;
    }

    if (emptyLootMsg.parentNode === lootListContainer) {
        lootListContainer.removeChild(emptyLootMsg);
    }

    let total    = 0;
    let listHTML = "";

    // Loop through loot items
    for (let i = 0; i < lootItems.length; i++) {
        total += lootItems[i].value;
        listHTML += `<div class="loot-item">
            <span class="loot-item-name">${escapeHTML(lootItems[i].name)}</span>
            <span class="loot-item-value">$${lootItems[i].value.toFixed(2)}</span>
        </div>`;
    }

    lootListContainer.innerHTML  = listHTML;
    runningTotal.textContent     = "$" + total.toFixed(2);
}

// Splits total loot evenly
function splitLoot() {
    splitError.textContent = "";
    partyError.textContent = "";

    const partySize = parseInt(partySizeInput.value, 10);

    // Check party size
    if (isNaN(partySize) || partySize < 1) {
        partyError.textContent = "⚠ Enter a party size of at least 1.";
        partySizeInput.focus();
        return;
    }

    // Make sure there's loot
    if (lootItems.length === 0) {
        splitError.textContent = "⚠ No loot to split! Add items first.";
        return;
    }

    let total = 0;
    for (let i = 0; i < lootItems.length; i++) {
        total += lootItems[i].value;
    }

    const perMember = total / partySize;

    resultTotal.textContent     = "$" + total.toFixed(2);
    resultPerMember.textContent = "$" + perMember.toFixed(2);
}

// Keeps user input safe before putting it on the page
function escapeHTML(str) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// Button events
addLootBtn.addEventListener("click", addLoot);
splitLootBtn.addEventListener("click", splitLoot);

// Pressing Enter also adds loot
lootNameInput.addEventListener("keydown",  function(e) { if (e.key === "Enter") addLoot(); });
lootValueInput.addEventListener("keydown", function(e) { if (e.key === "Enter") addLoot(); });
