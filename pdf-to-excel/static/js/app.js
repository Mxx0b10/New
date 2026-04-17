(function () {
  "use strict";

  const dropZone      = document.getElementById("dropZone");
  const fileInput     = document.getElementById("fileInput");
  const filePreview   = document.getElementById("filePreview");
  const fileName      = document.getElementById("fileName");
  const fileSize      = document.getElementById("fileSize");
  const fileIcon      = document.getElementById("fileIcon");
  const clearBtn      = document.getElementById("clearBtn");
  const convertBtn    = document.getElementById("convertBtn");
  const progressSec   = document.getElementById("progressSection");
  const progressTitle = document.getElementById("progressTitle");
  const progressSub   = document.getElementById("progressSub");
  const resultSec     = document.getElementById("resultSection");
  const resultSummary = document.getElementById("resultSummary");
  const downloadLink  = document.getElementById("downloadLink");
  const convertAgain  = document.getElementById("convertAnotherBtn");
  const errorSec      = document.getElementById("errorSection");
  const errorMessage  = document.getElementById("errorMessage");
  const retryBtn      = document.getElementById("retryBtn");

  let selectedFile = null;

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function getFileIcon(name) {
    const ext = name.split(".").pop().toLowerCase();
    if (ext === "pdf") return "📄";
    if (["png","jpg","jpeg","webp","gif","bmp","tiff","tif"].includes(ext)) return "🖼️";
    return "📁";
  }

  function showSection(section) {
    [filePreview, progressSec, resultSec, errorSec].forEach(el => el.classList.add("hidden"));
    if (section) section.classList.remove("hidden");
  }

  function setFile(file) {
    selectedFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatBytes(file.size);
    fileIcon.textContent = getFileIcon(file.name);
    showSection(filePreview);
  }

  function reset() {
    selectedFile = null;
    fileInput.value = "";
    showSection(null);
  }

  // Drag & drop
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("drag-over");
  });
  dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file) setFile(file);
  });

  dropZone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    if (fileInput.files[0]) setFile(fileInput.files[0]);
  });

  clearBtn.addEventListener("click", reset);
  convertAgain.addEventListener("click", reset);
  retryBtn.addEventListener("click", () => { showSection(filePreview); });

  const progressMessages = [
    ["Reading your file...", "Parsing structure and layout"],
    ["Detecting tables...", "Claude AI is scanning for tabular data"],
    ["Extracting data...", "Converting rows and columns accurately"],
    ["Formatting Excel...", "Applying styles and auto-sizing columns"],
    ["Almost done...", "Finalizing your spreadsheet"],
  ];
  let progressInterval = null;
  let msgIndex = 0;

  function startProgressAnimation() {
    msgIndex = 0;
    const [title, sub] = progressMessages[0];
    progressTitle.textContent = title;
    progressSub.textContent = sub;
    progressInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % progressMessages.length;
      const [t, s] = progressMessages[msgIndex];
      progressTitle.textContent = t;
      progressSub.textContent = s;
    }, 2200);
  }

  function stopProgressAnimation() {
    if (progressInterval) { clearInterval(progressInterval); progressInterval = null; }
  }

  convertBtn.addEventListener("click", async () => {
    if (!selectedFile) return;

    showSection(progressSec);
    startProgressAnimation();

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/convert", {
        method: "POST",
        body: formData,
      });

      stopProgressAnimation();

      if (!response.ok) {
        let msg = "Conversion failed. Please try again.";
        try {
          const err = await response.json();
          msg = err.error || msg;
        } catch (_) {}
        errorMessage.textContent = msg;
        showSection(errorSec);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const disposition = response.headers.get("Content-Disposition") || "";
      let outName = selectedFile.name.replace(/\.[^.]+$/, "") + "_converted.xlsx";
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match) outName = match[1];

      downloadLink.href = url;
      downloadLink.download = outName;

      resultSummary.textContent = `Your file "${selectedFile.name}" has been converted. Click below to download.`;
      showSection(resultSec);

    } catch (err) {
      stopProgressAnimation();
      errorMessage.textContent = err.message || "Network error. Please check your connection.";
      showSection(errorSec);
    }
  });
})();
