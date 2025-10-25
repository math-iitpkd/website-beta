
let courseIndex = [];

const coreContainer = document.getElementById("coreCourses");
const electiveContainer = document.getElementById("electiveCourses");
const modal = document.getElementById("courseModal");
const modalContent = document.getElementById("modalDetails");
const closeBtn = document.querySelector(".close-btn");
const searchBox = document.getElementById("searchBox");
const programSelect = document.getElementById("programSelect");

function showCourseModal(courseCode) {
  fetch(`courses/${courseCode}.json`)
    .then((res) => res.json())
    .then((course) => {
      const syllabusHTML = course.syllabus.map(unit => `
        <p><strong>${unit.unit}${unit.lectures ? ` (${unit.lectures})` : ''}:</strong> ${unit.details}</p>
      `).join("");

      const textbooksHTML = course.textbooks.map(book => `<li>${book}</li>`).join("");
      const referencesHTML = course.references.map(ref => `<li>${ref}</li>`).join("");

      modalContent.innerHTML = `
        <div class="modal-course-content">
          <h3>${course.code} - ${course.title}</h3>
          <p class="ltpc-line"><strong>LTPC:</strong> ${course.ltpc}</p>

          <div class="modal-block">
            <h4>Syllabus:</h4>
            ${syllabusHTML}
          </div>

          <div class="modal-block">
            <h4>Text Books:</h4>
            <ul>${textbooksHTML}</ul>
          </div>

          <div class="modal-block">
            <h4>Reference Books:</h4>
            <ul>${referencesHTML}</ul>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <button id="exportSingleBtn" style="padding: 6px 16px; background-color: #3178c6; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Export to PDF
            </button>
          </div>
        </div>
      `;
      modal.style.display = "block";

      if (window.MathJax) {
        MathJax.typesetPromise([modalContent]);
      }

      setTimeout(() => {
        const exportSingleBtn = document.getElementById("exportSingleBtn");
        exportSingleBtn?.addEventListener("click", () => {
          const { jsPDF } = window.jspdf;
          const doc = new jsPDF({
            unit: "in",
            format: "A4",
            orientation: "portrait"
          });

          const margin = 1;
          let cursorY = margin;

          const title = `${course.code} - ${course.title}`;
          doc.setFont("Helvetica", "bold");
          doc.setFontSize(16);
          doc.text(title, margin, cursorY);
          cursorY += 0.3;

          doc.setFontSize(12);
          doc.setFont("Helvetica", "normal");
          doc.text(`LTPC: ${course.ltpc}`, margin, cursorY);
          cursorY += 0.4;

          doc.setFont("Helvetica", "bold");
          doc.text("Syllabus", margin, cursorY);
          cursorY += 0.3;
          doc.setFont("Helvetica", "normal");
          const syllabusText = course.syllabus.map(unit =>
            `${unit.unit}${unit.lectures ? ` (${unit.lectures})` : ''}: ${unit.details}`
          ).join("\n\n");
          const syllabusLines = doc.splitTextToSize(syllabusText, 6.5);
          doc.text(syllabusLines, margin, cursorY);
          cursorY += syllabusLines.length * 0.22;

          doc.setFont("Helvetica", "bold");
          doc.text("Text Books", margin, cursorY);
          cursorY += 0.3;
          doc.setFont("Helvetica", "normal");
          const tbLines = doc.splitTextToSize(course.textbooks.map(b => "• " + b).join("\n"), 6.5);
          doc.text(tbLines, margin, cursorY);
          cursorY += tbLines.length * 0.22;

          doc.setFont("Helvetica", "bold");
          doc.text("Reference Books", margin, cursorY);
          cursorY += 0.3;
          doc.setFont("Helvetica", "normal");
          const refLines = doc.splitTextToSize(course.references.map(r => "• " + r).join("\n"), 6.5);
          doc.text(refLines, margin, cursorY);

          doc.save(`${course.code}_syllabus.pdf`);
        });
      }, 0);
    })
    .catch(err => {
      console.error("Course JSON not found:", err);
      modalContent.innerHTML = `<p style="text-align: center;">Unable to load course details.</p>`;
      modal.style.display = "block";
    });
}

function renderCourses(data) {
  coreContainer.innerHTML = "";
  electiveContainer.innerHTML = "";

  data.forEach(course => {
    const li = document.createElement("li");
    li.textContent = `${course.code} - ${course.title}`;
    li.classList.add("course-item");
    li.addEventListener("click", () => showCourseModal(course.code));

    if (course.category === "Core") {
      coreContainer.appendChild(li);
    } else {
      electiveContainer.appendChild(li);
    }
  });
}

function filterCourses(keyword) {
  const program = programSelect.value;
  const filtered = courseIndex.filter(course => {
    const searchString = `${course.code} ${course.title}`.toLowerCase();
    return (
      course.program === program &&
      searchString.includes(keyword.toLowerCase())
    );
  });
  renderCourses(filtered);
}

searchBox.addEventListener("input", () => {
  filterCourses(searchBox.value);
});

programSelect.addEventListener("change", () => {
  filterCourses(searchBox.value);
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

fetch("courses/index.json")
  .then(res => res.json())
  .then(data => {
    courseIndex = data;
    filterCourses("");
  });
