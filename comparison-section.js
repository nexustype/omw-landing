(function () {
  const STATUS_ORDER = {
    yes: 0,
    limit: 1,
    no: 2,
    na: 3
  };

  const STATUS_TEXT = {
    yes: "Yes",
    limit: "Limited",
    no: "No",
    na: "N/A"
  };

  const PLATFORMS = [
    { key: "omw", label: "OMW" },
    { key: "vtc", label: "VTC/Taxi" },
    { key: "transit", label: "Public transport" },
    { key: "blablacar", label: "BlaBlaCar" }
  ];

  const TABLE = {
    rider: {
      rows: [
        {
          label: "Cheaper than a taxi",
          values: { omw: "yes", vtc: "no", transit: "yes", blablacar: "yes" }
        },
        {
          label: "Real-time pickup (minutes)",
          hint: "Depends on drivers nearby.",
          values: { omw: "limit", vtc: "yes", transit: "no", blablacar: "no" }
        },
        {
          label: "Door-to-door",
          hint: "Sometimes a short walk to pickup.",
          values: { omw: "limit", vtc: "yes", transit: "limit", blablacar: "limit" }
        },
        {
          label: "Backup when transit fails",
          values: { omw: "yes", vtc: "yes", transit: "no", blablacar: "limit" }
        },
        {
          label: "Predictable ETA (low detours)",
          values: { omw: "yes", vtc: "yes", transit: "no", blablacar: "yes" }
        },
        {
          label: "Commute-friendly (suburbs ↔ city)",
          values: { omw: "yes", vtc: "no", transit: "yes", blablacar: "no" }
        },
        {
          label: "Shared = lower CO₂ per trip",
          values: { omw: "yes", vtc: "no", transit: "yes", blablacar: "yes" }
        },
        {
          label: "Guaranteed availability",
          hint: "Coverage grows with adoption.",
          values: { omw: "limit", vtc: "yes", transit: "yes", blablacar: "limit" }
        }
      ]
    },
    driver: {
      rows: [
        {
          label: "Offset fuel & tolls (cost-sharing)",
          values: { omw: "yes", vtc: "yes", transit: "na", blablacar: "yes" }
        },
        {
          label: "Share your existing route",
          values: { omw: "yes", vtc: "no", transit: "na", blablacar: "limit" }
        },
        {
          label: "Detour cap (keep your commute)",
          values: { omw: "yes", vtc: "no", transit: "na", blablacar: "no" }
        },
        {
          label: "Go on/off anytime (no shifts)",
          values: { omw: "yes", vtc: "no", transit: "na", blablacar: "limit" }
        },
        {
          label: "Choose rides (accept/decline)",
          values: { omw: "yes", vtc: "limit", transit: "na", blablacar: "yes" }
        },
        {
          label: "No professional license needed",
          values: { omw: "yes", vtc: "no", transit: "na", blablacar: "yes" }
        },
        {
          label: "Demand you can count on",
          values: { omw: "limit", vtc: "yes", transit: "na", blablacar: "limit" }
        },
        {
          label: "Insurance / incident support",
          values: { omw: "limit", vtc: "yes", transit: "na", blablacar: "limit" }
        }
      ]
    }
  };

  const COPY = {
    fr: {
      title: "Comparison table",
      lead: "How OMW compares for everyday trips — in Île-de-France and beyond.",
      rider: "Rider",
      driver: "Driver",
      features: "Features",
      legend: "✅ Yes / strong  •  ⚠️ Limited  •  ❌ No  •  — N/A",
      toggleLabel: "Rider or Driver comparison"
    },
    en: {
      title: "Comparison table",
      lead: "How OMW compares for everyday trips — in Île-de-France and beyond.",
      rider: "Rider",
      driver: "Driver",
      features: "Features",
      legend: "✅ Yes / strong  •  ⚠️ Limited  •  ❌ No  •  — N/A",
      toggleLabel: "Rider or Driver comparison"
    }
  };

  let instanceCounter = 0;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function sortRowsByOmw(rows) {
    return rows
      .map(function (row, index) {
        return { row: row, index: index };
      })
      .sort(function (a, b) {
        const aOrder = STATUS_ORDER[a.row.values.omw] ?? 99;
        const bOrder = STATUS_ORDER[b.row.values.omw] ?? 99;
        if (aOrder !== bOrder) return aOrder - bOrder;
        return a.index - b.index;
      })
      .map(function (entry) {
        return entry.row;
      });
  }

  function iconSvg(status) {
    if (status === "yes") {
      return [
        '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">',
        '<circle cx="10" cy="10" r="8.2" stroke="currentColor" stroke-width="1.5"></circle>',
        '<path d="M5.9 10.2L8.5 12.8L14 7.3" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"></path>',
        "</svg>"
      ].join("");
    }

    if (status === "limit") {
      return [
        '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">',
        '<path d="M10 2.9L18 16.7H2L10 2.9Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path>',
        '<path d="M10 7.3V11.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>',
        '<circle cx="10" cy="13.9" r="1" fill="currentColor"></circle>',
        "</svg>"
      ].join("");
    }

    if (status === "no") {
      return [
        '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">',
        '<circle cx="10" cy="10" r="8.2" stroke="currentColor" stroke-width="1.5"></circle>',
        '<path d="M6.7 6.7L13.3 13.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>',
        '<path d="M13.3 6.7L6.7 13.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>',
        "</svg>"
      ].join("");
    }

    return [
      '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">',
      '<circle cx="10" cy="10" r="8.2" stroke="currentColor" stroke-width="1.5"></circle>',
      '<path d="M6 10H14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>',
      "</svg>"
    ].join("");
  }

  function renderRows(mode) {
    const modeRows = TABLE[mode] && Array.isArray(TABLE[mode].rows) ? TABLE[mode].rows : [];
    const sortedRows = sortRowsByOmw(modeRows);

    return sortedRows
      .map(function (row) {
        const label = escapeHtml(row.label);
        const hint = row.hint
          ? '<span class="comparisonHint" title="' +
            escapeHtml(row.hint) +
            '" aria-label="Info: ' +
            escapeHtml(row.hint) +
            '">?</span>'
          : "";

        const cells = PLATFORMS
          .map(function (platform) {
            const status = row.values[platform.key];
            const statusText = STATUS_TEXT[status] || STATUS_TEXT.na;
            return [
              '<td class="comparisonIconCell" data-status="' + escapeHtml(status || "na") + '">',
              '<span class="comparisonStatusIcon comparisonStatusIcon--' + escapeHtml(status || "na") + '" aria-hidden="true">',
              iconSvg(status),
              "</span>",
              '<span class="srOnly">' + escapeHtml(statusText) + "</span>",
              "</td>"
            ].join("");
          })
          .join("");

        return [
          '<tr class="comparisonRow">',
          '<th scope="row" class="comparisonFeatureCell">',
          '<span class="comparisonFeatureLabel">' + label + "</span>",
          hint,
          "</th>",
          cells,
          "</tr>"
        ].join("");
      })
      .join("");
  }

  function renderTable(mode, copy, panelId) {
    return [
      '<div class="comparisonTableWrap" id="' + panelId + '">',
      '<table class="comparisonTable">',
      "<thead>",
      '<tr class="comparisonHeaderRow">',
      '<th scope="col" class="comparisonFeatureHead">' + copy.features + "</th>",
      PLATFORMS.map(function (platform) {
        return '<th scope="col" class="comparisonPlatformHead">' + escapeHtml(platform.label) + "</th>";
      }).join(""),
      "</tr>",
      "</thead>",
      '<tbody data-comparison-rows>',
      renderRows(mode),
      "</tbody>",
      "</table>",
      "</div>"
    ].join("");
  }

  function applyMode(section, mode, withTransition) {
    const rowsRoot = section.querySelector("[data-comparison-rows]");
    const tableWrap = section.querySelector(".comparisonTableWrap");
    const panel = section.querySelector("[data-comparison-panel]");
    if (!rowsRoot || !tableWrap) return;

    section.querySelectorAll("[data-comparison-mode]").forEach(function (button) {
      const isActive = button.getAttribute("data-comparison-mode") === mode;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
      button.tabIndex = isActive ? 0 : -1;
    });

    if (panel) {
      panel.setAttribute("data-mode", mode);
    }

    const updateRows = function () {
      rowsRoot.innerHTML = renderRows(mode);
    };

    if (withTransition) {
      tableWrap.classList.add("is-updating");
      window.setTimeout(function () {
        updateRows();
        window.requestAnimationFrame(function () {
          tableWrap.classList.remove("is-updating");
        });
      }, 70);
      return;
    }

    updateRows();
  }

  function mountComparison(section) {
    if (!section || section.getAttribute("data-comparison-mounted") === "true") return;

    const locale = section.getAttribute("data-comparison-locale") === "fr" ? "fr" : "en";
    const copy = COPY[locale];
    const unique = instanceCounter++;
    const panelId = "comparison-panel-" + unique;
    const riderTabId = "comparison-rider-tab-" + unique;
    const driverTabId = "comparison-driver-tab-" + unique;

    section.innerHTML = [
      '<div class="comparisonHead">',
      '<h2 class="sectionTitle">' + escapeHtml(copy.title) + "</h2>",
      '<p class="sectionLead comparisonLead">' + escapeHtml(copy.lead) + "</p>",
      "</div>",
      '<div class="comparisonToggleWrap">',
      '<div class="comparisonToggle" role="tablist" aria-label="' + escapeHtml(copy.toggleLabel) + '">',
      '<button class="comparisonToggleBtn is-active" type="button" role="tab" id="' + riderTabId + '" data-comparison-mode="rider" aria-controls="' + panelId + '" aria-selected="true" aria-pressed="true">' + escapeHtml(copy.rider) + "</button>",
      '<button class="comparisonToggleBtn" type="button" role="tab" id="' + driverTabId + '" data-comparison-mode="driver" aria-controls="' + panelId + '" aria-selected="false" aria-pressed="false" tabindex="-1">' + escapeHtml(copy.driver) + "</button>",
      "</div>",
      '<p class="comparisonLegend">' + escapeHtml(copy.legend) + "</p>",
      "</div>",
      '<div data-comparison-panel role="tabpanel" aria-labelledby="' + riderTabId + '">',
      renderTable("rider", copy, panelId),
      "</div>"
    ].join("");

    let currentMode = "rider";
    const tablist = section.querySelector("[role=tablist]");

    section.querySelectorAll("[data-comparison-mode]").forEach(function (button) {
      button.addEventListener("click", function () {
        const nextMode = button.getAttribute("data-comparison-mode");
        if (!nextMode || nextMode === currentMode) return;
        currentMode = nextMode;
        const panel = section.querySelector("[data-comparison-panel]");
        if (panel) {
          panel.setAttribute("aria-labelledby", nextMode === "rider" ? riderTabId : driverTabId);
        }
        applyMode(section, currentMode, true);
      });
    });

    if (tablist) {
      tablist.addEventListener("keydown", function (event) {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") {
          return;
        }

        event.preventDefault();
        const order = ["rider", "driver"];
        const index = order.indexOf(currentMode);
        let nextIndex = index;

        if (event.key === "ArrowRight") nextIndex = (index + 1) % order.length;
        if (event.key === "ArrowLeft") nextIndex = (index - 1 + order.length) % order.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = order.length - 1;

        currentMode = order[nextIndex];
        const target = section.querySelector('[data-comparison-mode="' + currentMode + '"]');
        if (target) target.focus();

        const panel = section.querySelector("[data-comparison-panel]");
        if (panel) {
          panel.setAttribute("aria-labelledby", currentMode === "rider" ? riderTabId : driverTabId);
        }

        applyMode(section, currentMode, true);
      });
    }

    section.setAttribute("data-comparison-mounted", "true");
    applyMode(section, currentMode, false);
  }

  function mountAll(root) {
    const scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll("[data-comparison-section]").forEach(mountComparison);
  }

  window.OMWComparisonSection = {
    mountAll: mountAll,
    table: TABLE
  };
})();
