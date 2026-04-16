const form = document.querySelector("#coauthor-form");
const config = window.COAUTHOR_FORM_CONFIG || {};
const endpoint = (
  config.endpoint ||
  "https://script.google.com/macros/s/AKfycbvyTjn593ARRQ83LHHXoprxlhn0LEd7RgKl3c7tePLXWsvq7SD1mLVlreWJ9PdB1SI/exec"
).trim();
const notifyEmail = (config.notifyEmail || "jahanaraym@vcu.edu").trim();
const isAppsScriptEndpoint = /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/i.test(endpoint);

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const picked = Array.from(
      form.querySelectorAll('input[name="contribution"]:checked')
    );

    if (picked.length === 0) {
      window.alert("Please select at least one contribution area: Introduction or Discussion.");
      return;
    }

    if (!isAppsScriptEndpoint) {
      window.alert("Form is temporarily unavailable. Please try again shortly.");
      return;
    }

    const projectSelect = form.querySelector("#project");
    const selectedOption =
      projectSelect && projectSelect.options[projectSelect.selectedIndex];

    const payload = new URLSearchParams();
    payload.set("project_key", form.project.value);
    payload.set(
      "project_title",
      selectedOption ? selectedOption.text : form.project.value
    );
    payload.set("full_name", form.full_name.value.trim());
    payload.set("email", form.email.value.trim());
    payload.set("contribution", picked.map((item) => item.value).join(", "));
    payload.set("notify_email", notifyEmail);
    payload.set("source_page", window.location.href);
    payload.set("user_agent", navigator.userAgent);

    try {
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: payload.toString()
      });

      window.alert("Thanks for your submission, I will get back to soon, Mohammad");
      form.reset();
    } catch (error) {
      window.alert("Submission failed. Please try again.");
    }
  });
}
