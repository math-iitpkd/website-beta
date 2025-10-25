// Sample course data (to be replaced with JSON from Google Sheets)
const courseData = [
    {
      code: "MA101",
      title: "Calculus and Linear Algebra",
      ltpc: "3-1-0-4",
      category: "Core",
      program: "BTech",
      syllabus: `
        <p><strong>Unit 1:</strong> Limits, continuity and differentiability (6 lectures)</p>
        <p><strong>Unit 2:</strong> Applications of derivatives, curve sketching (4 lectures)</p>
        <p><strong>Unit 3:</strong> Matrices and systems of linear equations (5 lectures)</p>
      `,
      textbooks: `<ul><li>Thomas' Calculus</li></ul>`,
      references: `<ul><li>Gilbert Strang - Linear Algebra</li></ul>`
    },
    {
      code: "MA203",
      title: "Numerical Methods",
      ltpc: "3-0-0-3",
      category: "Elective",
      program: "PhD",
      syllabus: `
        <p><strong>Unit 1:</strong> Error analysis and solution of nonlinear equations (4 lectures)</p>
        <p><strong>Unit 2:</strong> Interpolation and polynomial approximations (4 lectures)</p>
        <p><strong>Unit 3:</strong> Numerical integration and differentiation (4 lectures)</p>
      `,
      textbooks: `<ul><li>Burden and Faires</li></ul>`,
      references: `<ul><li>Chapra - Numerical Methods</li></ul>`
    }
  ];
  
  const coreContainer = document.getElementById("coreCourses");
  const electiveContainer = document.getElementById("electiveCourses");
  const modal = document.getElementById("courseModal");
  const modalContent = document.getElementById("modalDetails");
  const closeBtn = document.querySelector(".close-btn");
  const searchBox = document.getElementById("searchBox");
  const exportBtn = document.getElementById("exportBtn");
  const programSelect = document.getElementById("programSelect");
  let selectedCourses = new Set();
  
  function createCourseElement(course) {
    const li = document.createElement("li");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("click", (e) => {
      e.stopPropagation();
      if (checkbox.checked) selectedCourses.add(course);
      else selectedCourses.delete(course);
    });
  
    label.textContent = `${course.code} - ${course.title}`;
    label.prepend(checkbox);
  
    li.appendChild(label);
    li.addEventListener("click", (e) => {
      if (!e.target.matches("input[type='checkbox']")) {
        showCourseModal(course);
      }
    });
    return li;
  }
  
  function showCourseModal(courseCode) {
    fetch(`../Courses/${courseCode}.json`)
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
          </div>
        `;
        modal.style.display = "block";
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
    selectedCourses.clear();
  
    data.forEach(course => {
      const li = document.createElement("li");
      li.innerHTML = `
        <label>
          <input type="checkbox" onclick="event.stopPropagation()">
          ${course.code} - ${course.title}
        </label>
      `;
      li.addEventListener("click", () => showCourseModal(course.code));
      
      if (course.category === "Core") coreContainer.appendChild(li);
      else electiveContainer.appendChild(li);
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
  
  exportBtn.addEventListener("click", () => {
    if (selectedCourses.size === 0) {
      alert("Please select at least one course.");
      return;
    }
    const container = document.createElement("div");
    selectedCourses.forEach(course => {
      const section = document.createElement("div");
      section.innerHTML = `
        <h3>${course.code} - ${course.title}</h3>
        <p><strong>LTPC:</strong> ${course.ltpc}</p>
        <p><strong>Syllabus:</strong><br>${course.syllabus}</p>
        <p><strong>Text Books:</strong><br>${course.textbooks}</p>
        <p><strong>Reference Books:</strong><br>${course.references}</p>
        <hr>
      `;
      container.appendChild(section);
    });
    html2pdf().from(container).save("Selected_Courses.pdf");
  });
  
  // Initial rendering with default program selected
  filterCourses("");
  