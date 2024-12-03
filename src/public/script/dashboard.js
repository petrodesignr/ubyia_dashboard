const hamSearch = document.querySelector('.ham_search');

const popFilter = document.querySelector('.main_pop_filter');

// hamSearch.addEventListener('click', () => {
//     hamSearch.classList.toggle('active');
//     popFilter.classList.toggle('active')
// })


// Filtrer la recherche

function myFunction() {
    var input, filter, table, tr, rowsArray, tbody;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("ticketTable");
    tbody = table.getElementsByTagName("tbody")[0];
    tr = Array.from(tbody.getElementsByTagName("tr")); // Only consider rows within <tbody>

    // Si la saisie de recherche est vide, réinitialiser toutes les lignes
    if (filter === "") {
        tr.forEach(row => row.style.display = ""); // Afficher toutes les lignes
        return;
    }

    // Filtrer les lignes en fonction de la saisie de recherche
    tr.forEach(row => {
        var td = row.getElementsByTagName("td")[1]; // Cibler la colonne "Client"
        if (td) {
            var txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().startsWith(filter)) {
                row.style.display = ""; // Afficher la ligne si elle correspond au filtre
            } else {
                row.style.display = "none"; // Masquer la ligne si elle ne correspond pas
            }
        }
    });
}


  

// Affichage du filtre

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


// Filtrer par Date

$(function() {
    var start = moment();
    var end = moment();

    // Fonction de rappel pour mettre à jour la plage de dates affichée
    function cb(start, end, label) {
        if (label === 'Today' || label === 'Yesterday' || label === '') {
            $('#reportrange span').html(start.format('DD/MM/YYYY'));
        } else {
            $('#reportrange span').html(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
        }

        // Appliquer le filtre uniquement si la case à cocher est activée
        if ($('#activateDateFilter').is(':checked')) {
            filterByDateRange(start.toDate(), end.toDate());
        }
    }

    // Initialiser le sélecteur de plage de dates
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

    // Désactiver le sélecteur de dates initialement
    $('#reportrange').addClass('disabled');
    $('#reportrange').css('pointer-events', 'none');

    // Définir la valeur initiale de #dateRangeLabel à la date d'aujourd'hui
    $('#dateRangeLabel').text(moment().format('DD/MM/YYYY'));

    // Afficher toutes les lignes initialement
    showAllRows();

    // Gérer le basculement de la case à cocher
    $('#activateDateFilter').change(function() {
        if ($(this).is(':checked')) {
            // Activer le sélecteur de dates
            $('#reportrange').removeClass('disabled');
            $('#reportrange').css('pointer-events', 'auto');

            // Appliquer le filtre avec la plage actuelle
            // filterByDateRange(start.toDate(), end.toDate());

            const todayStart = moment().startOf('day').toDate();
            const todayEnd = moment().endOf('day').toDate();
            filterByDateRange(todayStart, todayEnd);
        } else {
            // Désactiver le sélecteur de dates
            $('#reportrange').addClass('disabled');
            $('#reportrange').css('pointer-events', 'none');

            // Réinitialiser #dateRangeLabel à la date d'aujourd'hui
            $('#dateRangeLabel').text(moment().format('DD/MM/YYYY'));

            // Afficher toutes les lignes lorsque le filtre est désactivé
            showAllRows();
            
        }
    });

    // Fonction pour afficher toutes les lignes du tableau
    function showAllRows() {
        const rows = document.querySelectorAll("#ticketTable tbody tr");
        rows.forEach(row => {
            row.style.display = ""; // Afficher toutes les lignes
        });
    }

    // Fonction pour filtrer les lignes du tableau en fonction de la plage de dates
    function filterByDateRange(startDate, endDate) {
        startDate = new Date(startDate);
        endDate = new Date(endDate);

        const rows = document.querySelectorAll("#ticketTable tbody tr");

        rows.forEach(row => {
            const dateCell = row.querySelector("td:nth-child(4)"); // Supposons que la date est dans la 4ème colonne
            if (dateCell) {
                const rowDate = extractDate(dateCell.textContent);
                if (rowDate >= startDate && rowDate <= endDate) {
                    row.style.display = ""; // Afficher la ligne
                } else {
                    row.style.display = "none"; // Masquer la ligne
                }
            }
        });
    }

    // Fonction pour extraire la date du texte de la cellule
    function extractDate(cellText) {
        const dateMatch = cellText.match(/Le:\s?(\d{2}\/\d{2}\/\d{4})/);
        if (dateMatch) {
            const [day, month, year] = dateMatch[1].split('/').map(Number);
            return new Date(year, month - 1, day); // Convertir en objet Date
        }
        return new Date(0); // Valeur par défaut si aucune date valide n'est trouvée
    }
});


// checkbox de filtre

$(document).ready(function () {
    $("input[name='filterPriority'], input[name='filterStatus']").change(function () {
        // Récupérer les priorités sélectionnées à partir des cases à cocher
        const selectedPriorities = $("input[name='filterPriority']:checked").map(function () {
            return $(this).val().toLowerCase(); // Normaliser en minuscule
        }).get();

        // Récupérer les statuts sélectionnés à partir des cases à cocher
        const selectedStatuses = $("input[name='filterStatus']:checked").map(function () {
            return $(this).val().toLowerCase().replace(' ', '_'); // Normaliser en minuscule et formater
        }).get();

        // Parcourir chaque ligne du tableau
        $("#ticketTable tbody tr").each(function () {
            const $row = $(this);

            // Extraire la priorité et le statut des menus déroulants
            const rowPriority = $row.find("td:nth-child(6) select option:selected").text().trim().toLowerCase(); // Texte sélectionné du menu déroulant pour la priorité
            const rowStatus = $row.find("td:nth-child(7) select option:selected").text().trim().toLowerCase().replace(' ', '_'); // Texte sélectionné du menu déroulant pour le statut

            // Vérifier si la ligne correspond aux filtres sélectionnés
            const matchesPriority = !selectedPriorities.length || selectedPriorities.includes(rowPriority);
            const matchesStatus = !selectedStatuses.length || selectedStatuses.includes(rowStatus);

            // Afficher ou masquer la ligne en fonction des filtres
            if (matchesPriority && matchesStatus) {
                $row.show();
            } else {
                $row.hide();
            }
        });
    });
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
            let cellA, cellB;

            // Handle Priority dropdown
            if (columnIndex === 5) { // Priority column
                const selectA = rowA.children[columnIndex].querySelector('select');
                const selectB = rowB.children[columnIndex].querySelector('select');

                cellA = selectA.options[selectA.selectedIndex].text.trim(); // Get the displayed text (name)
                cellB = selectB.options[selectB.selectedIndex].text.trim();

                const priorityOrder = ["Urgent", "Normal", "Faible"];
                const valueA = priorityOrder.indexOf(cellA);
                const valueB = priorityOrder.indexOf(cellB);

                return order === 'asc' ? valueA - valueB : valueB - valueA;
            }

            // Handle Status dropdown
            if (columnIndex === 6) { // Status column
                const selectA = rowA.children[columnIndex].querySelector('select');
                const selectB = rowB.children[columnIndex].querySelector('select');

                // Get the displayed text (not value)
                cellA = selectA.options[selectA.selectedIndex].text.trim();
                cellB = selectB.options[selectB.selectedIndex].text.trim();

                // Define the correct order for status
                const statusOrder = ["En attente", "En cours", "Nouveau", "Résolus"];

                // Find the index of the status in the order array
                const valueA = statusOrder.indexOf(cellA);
                const valueB = statusOrder.indexOf(cellB);

                // If the status text is not in the defined order array, move it to the end
                const adjustedValueA = valueA === -1 ? statusOrder.length : valueA;
                const adjustedValueB = valueB === -1 ? statusOrder.length : valueB;

                return order === 'asc' ? adjustedValueA - adjustedValueB : adjustedValueB - adjustedValueA;
            }


            // Handle other columns (non-dropdown)
            cellA = rowA.children[columnIndex].textContent.trim();
            cellB = rowB.children[columnIndex].textContent.trim();

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
        return new Date(year, month - 1, day); // concertir l'objet de date
    }
    return new Date(0); 
}

//handle updates when the user changes the priority or status via the dropdown

$(document).ready(function () {
    // Handle priority dropdown change
    $(document).on('change', '.priority-dropdown', function () {
        const ticketId = $(this).data('ticket-id');
        const newPriority = $(this).val();
        console.log('Changing priority for ticket ID:', ticketId, 'New Priority:', newPriority);
        updateTicketField(ticketId, newPriority, 'priority');
    });

    // Handle status dropdown change
    $(document).on('change', '.status-dropdown', function () {
        const ticketId = $(this).data('ticket-id');
        const newStatus = $(this).val();
        console.log('Changing status for ticket ID:', ticketId, 'New Status:', newStatus);
        updateTicketField(ticketId, newStatus, 'status');
    });

    // Function to update ticket field
    function updateTicketField(ticketId, value, field) {
        const url = field === 'priority'
            ? `http://localhost:5001/tickets/dashboard/priority/${ticketId}`
            : `http://localhost:5001/tickets/dashboard/status/${ticketId}`;

        console.log('Updating field:', field, 'URL:', url, 'Value:', value);

        $.ajax({
            url: url,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ [field]: value }),
            xhrFields: { withCredentials: true },
            success: function (response) {
                console.log('Update successful:', response);
                location.reload(); //Function pour rafraichir la page afin de voir les changements
                alert('Ticket updated successfully!');
            },
            error: function (xhr, status, error) {
                console.error('AJAX error:', xhr.responseText, 'Status:', status, 'Error:', error);
                alert('An error occurred while updating the ticket.');
            }
        });
    }
});




