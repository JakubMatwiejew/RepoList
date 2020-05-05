$(document).ready(function () {
    findRepos();
    function findRepos() {
        $("repos").each(function () {
            var user = $(this).data('user');
            var updated = $(this).data('update');
            if (user) {
                getRepos(user, updated, $(this));
            }
        });
    }
    function getRepos(user, updated, element) {
        $.ajax({
            type: 'GET',
            url: 'https://api.github.com/users/' + user + '/repos',
            success: function (data) {
                createTable(data, updated, user, element);
            },
            error: function (request, status, error) {
                element.replaceWith("<div class='row'><h2 class='error'>Error</h2></div>");
            }
        });
    }
    function createTable(data, updated, user, element) {
        var rows = 0;
        var table = $('<table>');
        var header = $('<tr>');
        header.append('<th>Name</th>');
        header.append('<th>Description</th>');
        header.append('<th>Last update</th>');
        header.append('<th>Url</th>');
        table.append(header);
        for (var i = 0; i < data.length; i++) {
            if (!updated || data[i].updated_at.slice(0, 10) > updated) {
                var table_row = $('<tr>');
                table_row.append('<td>' + data[i].name + '</td>');
                if (data[i].description) {
                    table_row.append('<td>' + data[i].description + '</td>');
                }
                else {
                    table_row.append('<td>No description</td>');
                }
                table_row.append('<td>' + data[i].updated_at.slice(0, 10) + '</td>');
                table_row.append('<td><a href=' + data[i].url + '><button class="link">link</button></a></td>');
                table.append(table_row);
                rows = +1;
            }
        }
        if (rows > 0) {
            var row = $('<div class="row">');
            if (!updated) {
                row.append('<h2>' + user + ' repositories list:</h2>');
            }
            else {
                row.append('<h2>' + user + ' repositories list updated after ' + updated + ':</h2>');
            }
            row.append(table);
            element.replaceWith(row);
        }
        else {
            element.replaceWith("<div class='row'><h2 class='error'>Unable to find repositories for user " + user + ", updated after " + updated + "</h2></div>");
        }
    }
    $("#form").submit(function (event) {
        if ($("#name").val()) {
            appendRepos($("#name").val(), $("#updated_at").val());
            clearForm();
            event.preventDefault();
        }
        else {
            $("#form-message").text("Enter user name!").show().fadeOut(1000);
            event.preventDefault();
        }
    });
    function appendRepos(name, updated_at) {
        var repos = $('<repos>');
        repos.attr("data-user", name);
        if (updated_at) {
            repos.attr("data-update", updated_at);
        }
        $("#form").before(repos);
        findRepos();
    }
    function clearForm() {
        $("#name").val("");
        $("#updated_at").val("");
    }
});
//# sourceMappingURL=script.js.map