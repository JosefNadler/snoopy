(function () {
  "use strict";

  var STORAGE_KEY = "habit-tracker.habits";

  var form = document.getElementById("add-form");
  var input = document.getElementById("habit-input");
  var list = document.getElementById("habits");
  var empty = document.getElementById("empty");

  var habits = load();

  /* ---------- storage ---------- */

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (h) {
        return h && typeof h.name === "string" && Array.isArray(h.days);
      });
    } catch (err) {
      return [];
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch (err) {
      /* storage full or unavailable - keep the app usable */
    }
  }

  /* ---------- dates ---------- */

  // Local date as YYYY-MM-DD, so day keys don't shift with the timezone.
  function dateKey(date) {
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, "0");
    var d = String(date.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + d;
  }

  function today() {
    return dateKey(new Date());
  }

  function shiftDays(key, amount) {
    var parts = key.split("-");
    var date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    date.setDate(date.getDate() + amount);
    return dateKey(date);
  }

  /* ---------- habits ---------- */

  function addHabit(name) {
    habits.push({
      id: String(Date.now()) + Math.random().toString(36).slice(2, 7),
      name: name,
      days: []
    });
    save();
    render();
  }

  function deleteHabit(id) {
    habits = habits.filter(function (habit) {
      return habit.id !== id;
    });
    save();
    render();
  }

  function toggleToday(id) {
    var habit = habits.find(function (h) {
      return h.id === id;
    });
    if (!habit) return;

    var key = today();
    var index = habit.days.indexOf(key);
    if (index === -1) {
      habit.days.push(key);
    } else {
      habit.days.splice(index, 1);
    }
    save();
    render();
  }

  function isDoneToday(habit) {
    return habit.days.indexOf(today()) !== -1;
  }

  // Consecutive completed days up to today. If today isn't done yet the streak
  // still counts from yesterday, so it isn't lost before the day is over.
  function streak(habit) {
    var done = {};
    habit.days.forEach(function (day) {
      done[day] = true;
    });

    var cursor = today();
    if (!done[cursor]) cursor = shiftDays(cursor, -1);

    var count = 0;
    while (done[cursor]) {
      count += 1;
      cursor = shiftDays(cursor, -1);
    }
    return count;
  }

  /* ---------- rendering ---------- */

  function streakLabel(count) {
    if (count === 0) return "Kein aktueller Streak";
    return "🔥 " + count + (count === 1 ? " Tag" : " Tage") + " in Folge";
  }

  function renderHabit(habit) {
    var done = isDoneToday(habit);

    var item = document.createElement("li");
    item.className = "habit" + (done ? " is-done" : "");

    var info = document.createElement("div");
    info.className = "habit-info";

    var name = document.createElement("div");
    name.className = "habit-name";
    name.textContent = habit.name;

    var streakText = document.createElement("div");
    streakText.className = "habit-streak";
    streakText.textContent = streakLabel(streak(habit));

    info.appendChild(name);
    info.appendChild(streakText);

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "toggle";
    toggle.textContent = done ? "✓ Heute erledigt" : "Heute erledigen";
    toggle.setAttribute("aria-pressed", String(done));
    toggle.addEventListener("click", function () {
      toggleToday(habit.id);
    });

    var remove = document.createElement("button");
    remove.type = "button";
    remove.className = "delete";
    remove.textContent = "×";
    remove.title = "Gewohnheit löschen";
    remove.setAttribute("aria-label", "Gewohnheit löschen: " + habit.name);
    remove.addEventListener("click", function () {
      deleteHabit(habit.id);
    });

    item.appendChild(info);
    item.appendChild(toggle);
    item.appendChild(remove);
    return item;
  }

  function render() {
    list.textContent = "";
    habits.forEach(function (habit) {
      list.appendChild(renderHabit(habit));
    });
    empty.hidden = habits.length > 0;
  }

  /* ---------- init ---------- */

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var name = input.value.trim();
    if (!name) return;
    addHabit(name);
    input.value = "";
    input.focus();
  });

  document.getElementById("today").textContent = new Date().toLocaleDateString(
    undefined,
    { weekday: "long", day: "numeric", month: "long", year: "numeric" }
  );

  render();
})();
