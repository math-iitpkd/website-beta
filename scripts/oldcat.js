  <script>
      let courseIndex = [];
      let selectedCourses = new Set();
    
      const coreContainer = document.getElementById("coreCourses");
      const electiveContainer = document.getElementById("electiveCourses");
      const modal = document.getElementById("courseModal");
      const modalContent = document.getElementById("modalDetails");
      const closeBtn = document.querySelector(".close-btn");
      const searchBox = document.getElementById("searchBox");
      const exportBtn = document.getElementById("exportBtn");
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
              </div>
            `;
            modal.style.display = "block";
            if (window.MathJax) {
              MathJax.typesetPromise([modalContent]);
            }
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
    
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.addEventListener("click", (e) => {
            e.stopPropagation();
            if (checkbox.checked) {
              selectedCourses.add(course);
            } else {
              selectedCourses.delete(course);
            }
          });
    
          const label = document.createElement("label");
          label.appendChild(checkbox);
          label.append(` ${course.code} - ${course.title}`);
          li.appendChild(label);
    
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
    
      exportBtn.addEventListener("click", async () => {
        if (selectedCourses.size === 0) {
          alert("Please select at least one course.");
          return;
        }
    
        const container = document.createElement("div");
    
        const fetches = [...selectedCourses].map(c =>
          fetch(`courses/${c.code}.json`).then(res => res.json())
        );
    
        const fullCourses = await Promise.all(fetches);
    
        fullCourses.forEach(course => {
          const section = document.createElement("div");
          section.innerHTML = `
            <h3>${course.code} - ${course.title}</h3>
            <p><strong>LTPC:</strong> ${course.ltpc}</p>
            <p><strong>Syllabus:</strong><br>${course.syllabus.map(u => `<strong>${u.unit}:</strong> ${u.details}`).join('<br>')}</p>
            <p><strong>Text Books:</strong><br><ul>${course.textbooks.map(b => `<li>${b}</li>`).join('')}</ul></p>
            <p><strong>Reference Books:</strong><br><ul>${course.references.map(r => `<li>${r}</li>`).join('')}</ul></p>
            <hr>
          `;
          container.appendChild(section);
        });
    
        html2pdf().from(container).save("Selected_Courses.pdf");
      });
    
      // Load course index
      fetch("courses/index.json")
        .then(res => res.json())
        .then(data => {
          courseIndex = data;
          filterCourses("");
        });
    </script>