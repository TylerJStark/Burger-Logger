// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
  registerPartial("burger-block", "#burger-block-partial");
  displayPage();
  setupEventHandlers();
});

function registerPartial(name, partialId) {
  var source = $(partialId).text();
  Handlebars.registerPartial(name, source);
}

function displayPage() {
  // Send the GET request.
  $.get("/api/burgers/").then(
    function(burgers) {
      renderTemplate({burgers: burgers});
    }
  );
}

function renderTemplate(data) {
  var source = $("#page-template").text();
  var template = Handlebars.compile(source);
  var html = template(data);
  $("#app").html(html);
}

function setupEventHandlers() {
  $(document).on("click", ".devour-burger", function(event) {
    var id = $(this).data("id");
    var devour = $(this).data("devour");

    var newDevour = {
      devoured: devour
    };

    // Send the PUT request.
    $.ajax("/api/burgers/" + id, {
      type: "PUT",
      data: newDevour
    }).then(
      function() {
        console.log("changed devour to", newDevour);
        // Rerender the templates with the updated list
        displayPage();
      }
    );
  });

  $(document).on("submit", ".create-form", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var newBurger = {
      name: $("#bu").val().trim()
    };

    // Send the POST request.
    $.ajax("/api/burgers", {
      type: "POST",
      data: newBurger
    }).then(
      function() {
        console.log("created new burger");
        // Rerender the templates with the updated list
        displayPage();
      }
    );
  });
};
