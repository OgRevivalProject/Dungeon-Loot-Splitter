// Dungeon Loot Splitter — script.js

// Stores all loot as objects { name, value }. Lives here so it persists across clicks.
const lootItems = [];

// DOM references
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

// Validates input, builds a loot object, pushes it into lootItems[], then re-renders.
function addLoot() {
    lootError.textContent = "";

    const name  = lootNameInput.value.trim();
    const value = parseFloat(lootValueInput.value);

    // All three checks must pass before adding to the array
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

    lootItems.push({ name: name, value: value });

    lootNameInput.value  = "";
    lootValueInput.value = "";
    lootNameInput.focus();

    renderLoot();
}

// Loops through lootItems[] to build the list HTML and calculate the running total.
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

    // Traditional for loop: accumulates total and builds each row
    for (let i = 0; i < lootItems.length; i++) {
        total    += lootItems[i].value;
        listHTML += `<div class="loot-item">
            <span class="loot-item-name">${escapeHTML(lootItems[i].name)}</span>
            <span class="loot-item-value">$${lootItems[i].value.toFixed(2)}</span>
        </div>`;
    }

    lootListContainer.innerHTML  = listHTML;
    runningTotal.textContent     = "$" + total.toFixed(2);
}

// Validates party size and loot count, then divides total evenly and shows results.
function splitLoot() {
    splitError.textContent = "";
    partyError.textContent = "";

    const partySize = parseInt(partySizeInput.value, 10);

    if (isNaN(partySize) || partySize < 1) {
        partyError.textContent = "⚠ Enter a party size of at least 1.";
        partySizeInput.focus();
        return;
    }
    if (lootItems.length === 0) {
        splitError.textContent = "⚠ No loot to split! Add items first.";
        return;
    }

    // Sum total using a for loop before dividing
    let total = 0;
    for (let i = 0; i < lootItems.length; i++) {
        total += lootItems[i].value;
    }

    const perMember = total / partySize;

    resultTotal.textContent     = "$" + total.toFixed(2);
    resultPerMember.textContent = "$" + perMember.toFixed(2);
}

// Prevents XSS when inserting user text into innerHTML
function escapeHTML(str) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// Event listeners — registered in JS, not inline in HTML
addLootBtn.addEventListener("click", addLoot);
splitLootBtn.addEventListener("click", splitLoot);

// Let Enter key trigger Add Loot from either input field
lootNameInput.addEventListener("keydown",  function(e) { if (e.key === "Enter") addLoot(); });
lootValueInput.addEventListener("keydown", function(e) { if (e.key === "Enter") addLoot(); });
