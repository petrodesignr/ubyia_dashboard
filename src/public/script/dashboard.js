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
        var clientTd = row.getElementsByTagName("td")[1]; // Colonne "Client"
        var serveurTd = row.getElementsByTagName("td")[2]; // Colonne "Serveur"
        var contactTd = row.getElementsByTagName("td")[0]; // Colonne "Contact"

        if (clientTd || serveurTd || contactTd) {
            var clientText = clientTd ? (clientTd.textContent || clientTd.innerText).toUpperCase() : "";
            var serveurText = serveurTd ? (serveurTd.textContent || serveurTd.innerText).toUpperCase() : "";
            var contactText = contactTd ? (contactTd.textContent || contactTd.innerText).toUpperCase() : "";

            // Check if any column matches the filter
            if (
                clientText.startsWith(filter) ||
                serveurText.startsWith(filter) ||
                contactText.startsWith(filter)
            ) {
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

// $(document).ready(function () {
//     $("input[name='filterPriority'], input[name='filterStatus']").change(function () {
//         // Récupérer les priorités sélectionnées à partir des cases à cocher
//         const selectedPriorities = $("input[name='filterPriority']:checked").map(function () {
//             return $(this).val().toLowerCase(); // Normaliser en minuscule
//         }).get();

//         // Récupérer les statuts sélectionnés à partir des cases à cocher
//         const selectedStatuses = $("input[name='filterStatus']:checked").map(function () {
//             return $(this).val().toLowerCase().replace(' ', '_'); // Normaliser en minuscule et formater
//         }).get();

//         // Parcourir chaque ligne du tableau
//         $("#ticketTable tbody tr").each(function () {
//             const $row = $(this);

//             // Extraire la priorité et le statut des menus déroulants
//             const rowPriority = $row.find("td:nth-child(6) select option:selected").text().trim().toLowerCase(); // Texte sélectionné du menu déroulant pour la priorité
//             const rowStatus = $row.find("td:nth-child(7) select option:selected").text().trim().toLowerCase().replace(' ', '_'); // Texte sélectionné du menu déroulant pour le statut

//             // Vérifier si la ligne correspond aux filtres sélectionnés
//             const matchesPriority = !selectedPriorities.length || selectedPriorities.includes(rowPriority);
//             const matchesStatus = !selectedStatuses.length || selectedStatuses.includes(rowStatus);

//             // Afficher ou masquer la ligne en fonction des filtres
//             if (matchesPriority && matchesStatus) {
//                 $row.show();
//             } else {
//                 $row.hide();
//             }
//         });
//     });
// });

document.getElementById('filterForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the default form submission

    const selectedPriorities = Array.from(document.querySelectorAll('input[name="priority"]:checked')).map(el => el.value);
    const selectedStatuses = Array.from(document.querySelectorAll('input[name="status"]:checked')).map(el => el.value);

    if (selectedPriorities.length === 0) {
        selectedPriorities.push(1, 2, 3)
    }

    if (selectedStatuses.length === 0) {
        selectedStatuses.push(1, 2, 3, 4)
    }

    const requestData = {
        priority_id: selectedPriorities,
        status_id: selectedStatuses
    };

    try {
        const response = await fetch('http://localhost:5001/tickets/dashboard/filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
            credentials: 'include',
        });

        console.log('Response Status:', response.status);
        console.log('Response Headers:', response.headers);

        if (response.ok) {
            const data = await response.json();
            console.log('Filtered Data:', data);

            const tickets = data.data || []; // Fallback to an empty array if undefined
            const priorities = data.priority || []; // Fallback to empty array
            const statuses = data.status || []; // Fallback to empty array

            updateTicketsTable(tickets, priorities, statuses);
        } else {
            const errorText = await response.text();
            console.error('Error Response Text:', errorText);
        }
    } catch (error) {
        console.error('Request failed:', error);
    }


});

function updateTicketsTable(tickets = [], priorities = [], statuses = []) {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; // Clear the table

    if (tickets.length > 0) {
        tickets.forEach(ticket => {
            // Get priority and status classes directly from the ticket
            let priorityClass = '';
            let statusClass = '';

            // Set priority class
            switch (ticket.priority_name.toLowerCase()) {
                case 'faible':
                    priorityClass = 'colorfaible';
                    break;
                case 'urgent':
                    priorityClass = 'colorurgent';
                    break;
                case 'normal':
                    priorityClass = 'colornormal';
                    break;
                case 'nouveau':
                    priorityClass = 'colornouveau';
                    break;
                default:
                    priorityClass = '';
                    break;
            }

            // Set status class
            switch (ticket.status_name.toLowerCase()) {
                case 'faible':
                    statusClass = 'colorfaible';
                    break;
                case 'resolus':
                    statusClass = 'colorresolus';
                    break;
                case 'urgent':
                    statusClass = 'colorurgent';
                    break;
                case 'en attente':
                    statusClass = 'coloren_attente';
                    break;
                case 'en cours':
                    statusClass = 'coloren_cours';
                    break;
                case 'normal':
                    statusClass = 'colornormal';
                    break;
                case 'nouveau':
                    statusClass = 'colornouveau';
                    break;
                default:
                    statusClass = '';
                    break;
            }

            // Create priority options
            const priorityOptions = priorities.map(option => `
                <option value="${option.priority_id}" ${ticket.priority_name === option.priority_name ? 'selected' : ''}>
                    ${option.priority_name}
                </option>
            `).join('');

            // Create status options
            const statusOptions = statuses.map(option => `
                <option value="${option.status_id}" ${ticket.status_name === option.status_name ? 'selected' : ''}>
                    ${option.status_name}
                </option>
            `).join('');

            const row = `
                <tr class="ticket-row">
                    <td>${ticket.user_firstname} ${ticket.user_lastname}<br>${ticket.user_email}</td>
                    <td>${ticket.company_name}</td>
                    <td>${ticket.ubybox_serial_number}</td>
                    <td>
                        Ticket #${ticket.ticket_id}<br>
                        Le: ${new Date(ticket.ticket_date_create).toLocaleDateString('fr-FR')}
                    </td>
                    <td>
                        ${ticket.staff_first_name} ${ticket.staff_last_name}<br>
                        Le: ${ticket.message_date_create ? new Date(ticket.message_date_create).toLocaleDateString('fr-FR') : 'N/A'}
                    </td>
                    <td>
                        <select class="priority-dropdown ${priorityClass}" data-ticket-id="${ticket.ticket_id}">
                            ${priorityOptions}
                        </select>
                    </td>
                    <td>
                        <select class="status-dropdown ${statusClass}" data-ticket-id="${ticket.ticket_id}">
                            ${statusOptions}
                        </select>
                    </td>
                    <td>
                        <i class="fa-regular fa-message fa-2x"></i>
                    </td>
                </tr>
            `;

            // Insert the row into the table
            tbody.insertAdjacentHTML('beforeend', row);
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="8">No tickets available</td></tr>';
    }
}





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

    // Helper function to generate dropdown options
    function getOptions(selected, type) {
        const options = type === 'priority' ? priority : status;
        return options.map(option => `
            <option value="${option.id}" ${option.name === selected ? 'selected' : ''}>
                ${option.name}
            </option>`).join('');
    }


//filtrer par utiilisateur


function filterByUser() {
    console.log("Filter by user triggered"); // Debug log

    // Get the connected user's name from the staffHeader element
    var staffHeader = document.getElementById("staffHeader");
    var connectedUser = staffHeader.textContent.trim().toLowerCase(); // Convert to lowercase for consistent comparison
    console.log("Connected User:", connectedUser); // Debug log

    // Get all rows of the table body
    var table = document.getElementById("ticketTable");
    var tbody = table.getElementsByTagName("tbody")[0];
    var rows = Array.from(tbody.getElementsByTagName("tr")); // Convert HTMLCollection to array for easier iteration

    rows.forEach((row, rowIndex) => {
        // Get the "Modification Par" column (5th column, index 4 in JavaScript)
        var modifiedByCell = row.querySelector("td:nth-child(5)");

        if (modifiedByCell) {
            console.log(`Row ${rowIndex} Cell Content (raw):`, modifiedByCell.innerHTML); // Debug raw HTML content

            // Extract the staff name from the cell before the <br> tag
            var modifierName = modifiedByCell.innerHTML.split('<br>')[0].trim().toLowerCase(); // Convert to lowercase
            console.log(`Row ${rowIndex} Modifier Name (extracted):`, modifierName);

            // Check if the row should be displayed
            if (modifierName === connectedUser) {
                row.style.display = ""; // Show matching rows
                console.log(`Row ${rowIndex} displayed`);
            } else {
                row.style.display = "none"; // Hide non-matching rows
                console.log(`Row ${rowIndex} hidden`);
            }
        } else {
            console.error(`Row ${rowIndex} has no "Modification Par" column.`);
        }
    });
}

function toggleFilterByUser() {
    var filterCheckbox = document.getElementById("filterByUserCheckbox");
    if (filterCheckbox.checked) {
        filterByUser(); // Apply the filter
    } else {
        resetFilter(); // Reset the filter when unchecked
    }
}

// reset functions filter


async function resetFilter() {
    // Reset all filter inputs (checkboxes, text fields, dropdowns)
    document.querySelectorAll('input[type="checkbox"]').forEach(input => input.checked = false);
    document.querySelectorAll('input[type="text"]').forEach(input => input.value = '');
    document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);

    // Send a GET request to fetch the initial dashboard HTML
    try {
        const response = await fetch('http://localhost:5001/tickets/dashboard?page=1', {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            const html = await response.text(); // Get the HTML response as a string

            // Parse the HTML string into a DOM structure
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Extract the table body from the response
            const newTbody = doc.querySelector('#ticketTable tbody');
            if (newTbody) {
                const currentTbody = document.querySelector('#ticketTable tbody');
                currentTbody.innerHTML = newTbody.innerHTML; // Replace the current table body
            } else {
                console.error('No table body found in the returned HTML.');
            }

            // Optionally reset pagination UI if included in the HTML
            const newPagination = doc.querySelector('.pagination');
            if (newPagination) {
                const currentPagination = document.querySelector('.pagination');
                if (currentPagination) {
                    currentPagination.innerHTML = newPagination.innerHTML; // Update pagination
                }
            }

        } else {
            console.error('Failed to reset data:', await response.text());
        }
    } catch (error) {
        console.error('Request failed:', error);
    }
}

function resetTicketsTable(tickets = [], priorities = [], statuses = []) {
    const tbody = document.querySelector('#ticketTable tbody');
    tbody.innerHTML = ''; // Clear the table

    if (tickets.length > 0) {
        tickets.forEach(ticket => {
            const priorityClass = getPriorityClass(ticket.priority_name);
            const statusClass = getStatusClass(ticket.status_name);

            const row = `
                <tr>
                    <td>${ticket.user_firstname} ${ticket.user_lastname}<br>${ticket.user_email}</td>
                    <td>${ticket.company_name}</td>
                    <td>${ticket.ubybox_serial_number}</td>
                    <td>Ticket #${ticket.ticket_id}<br>Le: ${new Date(ticket.ticket_date_create).toLocaleDateString()}</td>
                    <td>${ticket.staff_first_name} ${ticket.staff_last_name}<br>Le: ${ticket.message_date_create ? new Date(ticket.message_date_create).toLocaleDateString() : 'N/A'}</td>
                    <td><select class="${priorityClass}">${renderPriorityOptions(ticket.priority_name, priorities)}</select></td>
                    <td><select class="${statusClass}">${renderStatusOptions(ticket.status_name, statuses)}</select></td>
                    <td><i class="fa-regular fa-message fa-2x"></i></td>
                </tr>`;
            tbody.insertAdjacentHTML('beforeend', row);
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="8">No tickets available</td></tr>';
    }
}

function getPriorityClass(priority) {
    switch (priority.toLowerCase()) {
        case 'faible': return 'colorfaible';
        case 'urgent': return 'colorurgent';
        case 'normal': return 'colornormal';
        default: return '';
    }
}

function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'faible': return 'colorfaible';
        case 'resolus': return 'colorresolus';
        case 'urgent': return 'colorurgent';
        case 'en attente': return 'coloren_attente';
        case 'en cours': return 'coloren_cours';
        case 'normal': return 'colornormal';
        default: return '';
    }
}

function renderPriorityOptions(selected, priorities) {
    return priorities.map(option =>
        `<option value="${option.priority_id}" ${option.priority_name === selected ? 'selected' : ''}>
            ${option.priority_name}
        </option>`
    ).join('');
}

function renderStatusOptions(selected, statuses) {
    return statuses.map(option =>
        `<option value="${option.status_id}" ${option.status_name === selected ? 'selected' : ''}>
            ${option.status_name}
        </option>`
    ).join('');
}








