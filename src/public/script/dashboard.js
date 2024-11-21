const hamSearch = document.querySelector('.ham_search');

const popFilter = document.querySelector('pop_filter');

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

// filtre date

// $(function() {

//     var start = moment().subtract(29, 'days');
//     var end = moment();

//     function cb(start, end) {
//         $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
//     }

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

//     cb(start, end);

// });

$(function() {
    var start = moment(); // Default to today
    var end = moment();   // Default to today

    function cb(start, end, label) {
        // Check if "Today" or "Yesterday" is selected, or default
        if (label === 'Today' || label === 'Yesterday' || label === '') {
            $('#reportrange span').html(start.format('MMMM D, YYYY'));
        } else {
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }
    }

    $('#reportrange').daterangepicker({
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

    cb(start, end, ''); // Initial call with default settings
});


