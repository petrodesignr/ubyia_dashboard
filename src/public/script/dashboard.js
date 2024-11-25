const hamSearch = document.querySelector('.ham_search');

const popFilter = document.querySelector('.main_pop_filter');

hamSearch.addEventListener('click', () => {
    hamSearch.classList.toggle('active');
    popFilter.classList.toggle('active')
})

// filtre show

$(document).ready(function () {
    $("#filterbtn").click(function () {
        let $filter = $(".main_pop_filter");
        
        if ($filter.is(":visible")) {
            $filter.slideUp("slow", function () {
                $filter.removeClass("flex-toggle");
            });
        } else {
            $filter.addClass("flex-toggle").hide().slideDown("slow");
        }
    });
});


// filter Date

// $(function() {
//     // Default start and end dates
//     var start = moment();
//     var end = moment();

//     // Callback function for updating the displayed date range
//     function cb(start, end, label) {
//         // Display selected date range in the span
//         if (label === 'Today' || label === 'Yesterday' || label === '') {
//             $('#reportrange span').html(start.format('MMMM D, YYYY'));
//         } else {
//             $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
//         }

//         // Call the table filtering function with the selected date range
//         filterByDateRange(start.toDate(), end.toDate());
//     }

//     // Initialize the date range picker
//     $('#reportrange').daterangepicker({
//         startDate: start,
//         endDate: end,
//         ranges: {
//            'Today': [moment(), moment()],
//            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
//            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
//            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
//            'This Month': [moment().startOf('month'), moment().endOf('month')],
//            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
//         }
//     }, cb);

//     // Initial call with default settings
//     cb(start, end, '');
// });

// // Function to filter table rows based on date range
// function filterByDateRange(startDate, endDate) {
//     // Convert input dates to Date objects if they aren't already
//     startDate = new Date(startDate);
//     endDate = new Date(endDate);

//     // Get all rows from the table body
//     const rows = document.querySelectorAll("#ticketTable tbody tr");

//     rows.forEach(row => {
//         // Find the cell containing the date
//         const dateCell = row.querySelector("td:nth-child(4)"); // Assuming date is in the 4th column
//         if (dateCell) {
//             // Extract and parse the date
//             const rowDate = extractDate(dateCell.textContent);

//             // Check if the row's date falls within the range
//             if (rowDate >= startDate && rowDate <= endDate) {
//                 row.style.display = ""; // Show row
//             } else {
//                 row.style.display = "none"; // Hide row
//             }
//         }
//     });
// }

// // Function to extract date from cell text
// function extractDate(cellText) {
//     const dateMatch = cellText.match(/Le:\s?(\d{2}\/\d{2}\/\d{4})/);
//     if (dateMatch) {
//         const [day, month, year] = dateMatch[1].split('/').map(Number);
//         return new Date(year, month - 1, day); // Convert to Date object
//     }
//     return new Date(0); // Fallback to epoch start if no valid date
// }


$(function() {
    var start = moment();
    var end = moment();

    // Callback to update the displayed date range
    function cb(start, end, label) {
        if (label === 'Today' || label === 'Yesterday' || label === '') {
            $('#reportrange span').html(start.format('MMMM D, YYYY'));
        } else {
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }

        // Apply filter only if checkbox is checked
        if ($('#activateDateFilter').is(':checked')) {
            filterByDateRange(start.toDate(), end.toDate());
        }
    }

    // Initialize the date range picker
    const dateRangePicker = $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);

    // Disable the date picker initially
    dateRangePicker.data('daterangepicker').container.addClass('disabled');
    $('#reportrange').css('pointer-events', 'none');

    // Show all rows initially
    showAllRows();

    // Handle checkbox toggle
    $('#activateDateFilter').change(function() {
        if ($(this).is(':checked')) {
            // Enable the date picker
            dateRangePicker.data('daterangepicker').container.removeClass('disabled');
            $('#reportrange').css('pointer-events', 'auto');

            // Apply the filter with the current range
            filterByDateRange(start.toDate(), end.toDate());
        } else {
            // Disable the date picker
            dateRangePicker.data('daterangepicker').container.addClass('disabled');
            $('#reportrange').css('pointer-events', 'none');

            // Show all rows when the filter is disabled
            showAllRows();
        }
    });

    // Function to show all rows in the table
    function showAllRows() {
        const rows = document.querySelectorAll("#ticketTable tbody tr");
        rows.forEach(row => {
            row.style.display = ""; // Show all rows
        });
    }

    // Function to filter table rows based on date range
    function filterByDateRange(startDate, endDate) {
        startDate = new Date(startDate);
        endDate = new Date(endDate);

        const rows = document.querySelectorAll("#ticketTable tbody tr");

        rows.forEach(row => {
            const dateCell = row.querySelector("td:nth-child(4)"); // Assuming date is in the 4th column
            if (dateCell) {
                const rowDate = extractDate(dateCell.textContent);
                if (rowDate >= startDate && rowDate <= endDate) {
                    row.style.display = ""; // Show row
                } else {
                    row.style.display = "none"; // Hide row
                }
            }
        });
    }

    // Function to extract date from cell text
    function extractDate(cellText) {
        const dateMatch = cellText.match(/Le:\s?(\d{2}\/\d{2}\/\d{4})/);
        if (dateMatch) {
            const [day, month, year] = dateMatch[1].split('/').map(Number);
            return new Date(year, month - 1, day); // Convert to Date object
        }
        return new Date(0); // Fallback to epoch start if no valid date
    }
});



// ascendant and descendant

document.querySelectorAll('.icon-arrow').forEach(span => {
    span.addEventListener('click', function () {
        const table = this.closest('table'); // Reference to the table
        const tbody = table.querySelector('tbody'); // Reference to the tbody
        const rows = Array.from(tbody.querySelectorAll('tr')); // All rows in tbody
        const columnIndex = parseInt(this.getAttribute('data-column'), 10); // Column index to sort
        const order = this.getAttribute('data-order'); // Current order (asc/desc)

        rows.sort((rowA, rowB) => {
            const cellA = rowA.children[columnIndex].textContent.trim();
            const cellB = rowB.children[columnIndex].textContent.trim();

            // Date-specific sorting for "Crée le" (columnIndex 3) or "Modification Par" (columnIndex 4)
            if (columnIndex === 3 || columnIndex === 4) {
                const dateA = extractDate(cellA);
                const dateB = extractDate(cellB);
                return order === 'asc' ? dateA - dateB : dateB - dateA;
            }

            // Alphabetical sorting for other columns
            return order === 'asc'
                ? cellA.localeCompare(cellB)
                : cellB.localeCompare(cellA);
        });

        // Reorder rows in the DOM
        rows.forEach(row => tbody.appendChild(row));

        // Toggle sorting order for next click
        this.setAttribute('data-order', order === 'asc' ? 'desc' : 'asc');

        // Update arrow direction
        this.innerHTML = order === 'asc' ? '&DownArrow;' : '&UpArrow;';
    });
});

/**
 * Extracts a Date object from a cell text in the "Le: DD/MM/YYYY" format.
 * If no valid date is found, returns a fallback date (epoch start).
 */
function extractDate(cellText) {
    const dateMatch = cellText.match(/Le:\s?(\d{2}\/\d{2}\/\d{4})/);
    if (dateMatch) {
        const [day, month, year] = dateMatch[1].split('/').map(Number);
        return new Date(year, month - 1, day); // Convert to Date object
    }
    return new Date(0); // Fallback to epoch start if no valid date
}


// filtre

$(document).ready(function () {
    $("input[name='filterPriority'], input[name='filterStatus']").change(function () {
        // Collect selected priorities and statuses
        const selectedPriorities = $("input[name='filterPriority']:checked").map(function () {
            return $(this).val();
        }).get();

        const selectedStatuses = $("input[name='filterStatus']:checked").map(function () {
            return $(this).val();
        }).get();

        // Loop through each table row
        $("#ticketTable tbody tr").each(function () {
            const $row = $(this);

            // Extract the priority and status from the row
            const rowPriority = $row.find("td:nth-child(6) p").text().trim().toLowerCase();
            const rowStatus = $row.find("td:nth-child(7) p").text().trim().toLowerCase();

            // Check if the row matches the selected filters
            const matchesPriority = !selectedPriorities.length || selectedPriorities.includes(rowPriority);
            const matchesStatus = !selectedStatuses.length || selectedStatuses.includes(rowStatus);

            // Show or hide the row based on the filter
            if (matchesPriority && matchesStatus) {
                $row.show();
            } else {
                $row.hide();
            }
        });
    });
});
