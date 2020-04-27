requestsTable = $("#Requests-Table").DataTable({
    autoWidth: true,
    bAutoWidth: true,
    scrollX: true,
    processing: true,
    serverSide: true,
    order: [[2, "asc"]],
    pagingType: "full_numbers",
    ajax: {
        url: "/request/show"
    },
    columns: [
        { data: "id", name: "id" },
        { data: "email", name: "email" },
        { data: "created_at", name: "created_at" }
    ],
    columnDefs: [
        {
            targets: 0,
            visible: false,
            searchable: false
        },
        {
            targets: 2,
            render: function(data, type, row, meta) {
                var d = new Date(row.created_at);
                return formatDate(d);
            }
        },
        {
            targets: 3,
            render: function(data, type, row, meta) {
                return (
                    '<button type="button" class="send-invitation btn btn-sm btn-success" data-toggle="modal" data-target="#Modal-Send-Invitation" data-id="' +
                    row.id +
                    '"><i class="fas fa-cogs mr-2"></i>Send Invitation</button><button type="button" class="delete-request btn btn-sm btn-danger" data-toggle="modal" data-target="#Modal-Request-Delete" data-id="' +
                    row.id +
                    '"><i class="fas fa-trash-alt mr-2"></i>Delete Request</button>'
                );
            },
            searchable: false,
            orderable: false
        },
        {
            targets: "_all",
            className: "align-middle"
        }
    ],
    language: {
        lengthMenu: "Display _MENU_ records per page",
        zeroRecords: "No Data Found",
        info: "Showing page _PAGE_ of _PAGES_",
        infoEmpty: "No records available",
        infoFiltered: "(Filtered from _MAX_ total records)"
    },
    drawCallback: function(settings) {
        updatePendingRequestsCount(requestsTable.ajax.json());
    }
});

// Update Pending Requests Counter
function updatePendingRequestsCount(json) {
    $("#Pending-Requests").text(json.pendingRequests);
    $("#Sidebar-Pending-Requests").text(json.pendingRequests);
}

// Send Invitation
$("body").on("click", "#Btn-Send-Invitation", function() {
    var requestId = $(this).data("id");
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
        }
    });

    $.ajax({
        type: "put",
        url: "/request/send-invitation/" + requestId,
        success: function (data) {
            $("#Request-Id-" + requestId).remove();
            updatePendingRequestsCount(data);
        },
        error: function(data) {
            console.log("Error:", data);
        }
    });
});
$("body").on("click", ".send-invitation", function() {
    $("#Btn-Send-Invitation").data("id", $(this).data("id"));
});

// Delete Request
$("body").on("click", "#Btn-Delete-Request", function() {
    var requestId = $(this).data("id");
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
        }
    });

    $.ajax({
        type: "delete",
        url: "/request/delete/" + requestId,
        success: function (data) {
            $("#Request-Id-" + requestId).remove();
            updatePendingRequestsCount(data);
        },
        error: function(data) {
            console.log("Error:", data);
        }
    });
});
$("body").on("click", ".delete-request", function() {
    $("#Btn-Delete-Request").data("id", $(this).data("id"));
});